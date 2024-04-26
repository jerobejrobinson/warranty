'use server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { z } from 'zod'

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type State = {
    errors?: {
        message?: string;
        email?: string[];
        password?: string[];
    };
    message?: string;
}

export async function login(prevState: State, formData: FormData): Promise<State> {
    const rawFormData = Object.fromEntries(formData.entries())
    const validatedFields = LoginSchema.safeParse(rawFormData)
    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing or invalid fields. Failed to login user.'
        }
    }

    const data = {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if(error) {
        return {
            errors: {
                message: error.message
            }
        }
    } else {
        redirect('/dashboard')
    }
}

const SignupSchema = z.object({
    firstName: z.string({
        required_error: "First Name is required",
    }),
    lastName: z.string({
        required_error: "Last Name is required",
    }),
    accountNumber: z.string({
        required_error: "Account number is required", 
    }),
    email: z.string({
        required_error: "Email is required",
    }).email(),
    password: z.string(),
    phone: z.string(),
})

export type SignupState = {
    message?: string | null;
    errors?: {
        firstName?: string[];
        lastName?: string[];
        accountNumber?: string[];
        email?: string[];
        password?: string[];
        phone?: string[];
    } | undefined;
}

const CompleteSignup = SignupSchema.omit({})

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
    
    const rawFormData = Object.fromEntries(formData.entries())
    const validatedFields = CompleteSignup.safeParse(rawFormData)
    console.log(rawFormData)
    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to sign up user.'
        }
    }
    
    console.log(validatedFields.data)
    
    const supabase = createClient()
    const {data, error} = await supabase.auth.signUp({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
    })
    console.log(error)
    console.log('auth-data', data)
    if(data) {
        const { data, error } = await supabase.from('profile')
            .insert({
                first_name: validatedFields.data.firstName, 
                last_name: validatedFields.data.lastName, 
                account_number: validatedFields.data.accountNumber, 
                email: validatedFields.data.email, 
                phone: validatedFields.data.phone
            })
        
        console.log('data', data)
        console.log('error', error)
    } 
    
    if(error) return {message: 'Auth error'}
    return { message: 'success', errors: undefined }
    // redirect('/auth/verify-email')
}

export async function signout() {
    const supabase = createClient()
    const {error} = await supabase.auth.signOut()
    if(error) {
        return new Error('Failed signing out user')
    }
    redirect('/')
}

// Need to add zod validation here
export async function getInvoicesByPartNumber({linecode, partnumber}: {linecode: string; partnumber: string}) {
    const cookieStore = cookies()
    const dist = cookieStore.get('dist')
    const query = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_TRN/DATAFABRIC/compass/v2/jobs/?queryExecutor=datalake`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `bearer ${dist?.value}`,
            'Charset': 'utf-8',
            'Content-Type': 'text/plain',   
        },
        body: `SELECT 
                    price, 
                    ordersuf, 
                    orderno, 
                    netord, 
                    enterdt,
                    canceldt,
                    whse,
                    shipprod,
                    qtyord,
                    slsrepin,
                    slsrepout
          FROM oeel WHERE shipprod = '${linecode+partnumber}' AND custno = '1325'`
    }).then(data => data.json())

    if(!query.queryId) return 'query error'

    async function getStatus() {
        const status: any = await new Promise((resolve, reject) => {
            setTimeout(async () => {
                const status = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_TRN/DATAFABRIC/compass/v2/jobs/${query.queryId}/status/?timeout=0&queryExecutor=datalake`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `bearer ${dist?.value}`,
                        'Charset': 'utf-8',
                    },
                }).then( data => data.json())
                console.log('status resolved')
                console.log(status)
                resolve(status)
            }, 10000)
        })

        return status
    }

    let status = await getStatus()
    while(status.status != 'FINISHED') {
        status = await getStatus()
    }
    const res = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_TRN/DATAFABRIC/compass/v2/jobs/${query.queryId}/result/?offset=0&limit=100000&queryExecutor=datalake`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `bearer ${dist?.value}`,
            'Charset': 'utf-8',
        },
    }).then( data => data.json())
    return res
}

export async function submitClaim(obj: any) {
    const supabase = createClient()
    
    let { data: customer, error } = await supabase.from('customer').select("*").eq('account_number', Number(obj.accountNumber)).single()

    if(!customer){
        const { data, error } = await supabase.from('customer')
            .insert([
                { account_number: Number(obj.accountNumber), name: obj.customerName },
            ])
            .select('*').single()

        obj.customer_id = data.id
        console.log('customer data', data)
        console.log('customer error', error)
    } else {
        obj.customer_id = customer.id
    }

    // Check salesperson in salesperson table
    // If salesperson exist add salesperson.id to claim
    // if not add salesperson to salesperson table 
    // // Receive new salesperson.id and add to claim

    // Insert new claim into CLAIM table
    console.log(obj)
    const { data, error: claimError } = await supabase
        .from('claim')
        .insert([
            {
                part_number: obj.prod,
                part_desc: obj.desc,
                qty: obj.qty,
                price: obj.price,
                vin: obj.vin,
                serial: obj.serial,
                year: obj.year,
                make: obj.make,
                model: obj.model,
                install_date: obj.installDate,
                failed_date: obj.dateFailed,
                mileage_installed: obj.mileageInstalled,
                mileage_failed: obj.mileageFailed,
                symptoms: obj.symptoms,
                diagnostics: obj.diagnostics,
                labor_hours: obj.laborHours,
                customer_id: obj.customer_id,
                invoice_number: obj.invoiceNumber
            },
        ]).select('*').single()

        console.log('claim data', data)
        console.log('claim error', claimError)
    return data
}