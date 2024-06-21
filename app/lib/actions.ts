'use server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { z } from 'zod'

// New SubmitClaim Server Action
export async function submitClaimV2(values: any, id: string) {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    const arr = id.split('~')
    const { data: claim, error } = await supabase.from('claim').insert([{
        ...values,
        part_number: arr[0]+arr[2],
        qty: Number(arr[3]),
        invoice_number: arr[1],
        price: Number(arr[5]),
        profile: data?.user?.id,
    }]).select().single()
    if(claim) {
        redirect('/dashboard/claims')
    }
}
// END

// Login Server Action
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
// END

// Signup Server Action
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
    companyName: z.string(),
    address_1: z.string(),
    address_2: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    city: z.string()
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
        companyName?: string[];
        address_1?: string[];
        address_2?: string[];
        state?:string[];
        zip?: string[];
        country?: string[];
        city?: string[];
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
    const { error } = await supabase.auth.signUp({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        options: {
            data: {
                first_name: validatedFields.data.firstName,
                last_name: validatedFields.data.lastName,
                email: validatedFields.data.email,
                account_number: validatedFields.data.accountNumber,
                phone: validatedFields.data.phone,
                company_name: validatedFields.data.companyName,
                address_1: validatedFields.data.address_1,
                address_2: validatedFields.data.address_2,
                state: validatedFields.data.state,
                zip: validatedFields.data.zip,
                country: validatedFields.data.country,
                city: validatedFields.data.city
            }
        }
    })
    
    if(error) return {message: 'Auth error'}
    redirect('/auth/verify-email')
}
// END

// Signout Server Action
export async function signout() {
    const supabase = createClient()
    const {error} = await supabase.auth.signOut()
    if(error) {
        return new Error('Failed signing out user')
    }
    redirect('/')
}
// END

// GetInvoiceByDateRange 
export async function getInvoiceByDateRange({fromDate, toDate}: { fromDate: string; toDate: string}) {
    const supabase = createClient()
    const { data: customerData, error } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('account_number').eq('id', customerData?.user?.id).single()
    const cookieStore = cookies()
    const dist = cookieStore.get('dist')
    const lt = cookieStore.get('lt')
    console.log(dist)
    console.log('date =>', fromDate)
    console.log('date =>', toDate)
    const data = await fetch(`${process.env.CSD_INTERFACE_URL}/sxeapi/api/oe/oeel/lookup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `bearer ${dist?.value}`,
            'Charset': 'utf-8',
            'Content-Type': 'application/json',
            'Token': `${lt?.value}`
        },
        body: JSON.stringify({ custno: profile?.account_number, fromentered: fromDate, toentered: toDate })
    }).then(data => data.json())
    
    const arr = data.loadoeelttresults.filter(({shipprod}: {shipprod: string}) => {
        let icOrDc = shipprod.slice(-2)
        if(icOrDc.toUpperCase() === 'IC' || icOrDc.toUpperCase() === 'DC') return false
        else return true
    })
    return arr;
}
// END 

// GetInvoicesByPartNumber Server Action
// Need to add zod validation here
export async function getInvoicesByPartNumber({linecode, partnumber}: {linecode: string; partnumber: string}) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('account_number').eq('id', data?.user?.id).single()
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
          FROM oeel WHERE shipprod = '${linecode+partnumber}' AND custno = ${profile?.account_number}`
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
// END

// OLD SubmitClaim Server Action
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
// END

// Create shipment server action
export type initalShipmentSchema = {
    length: string;
    width: string
    height: string;
    weight: string;
    drop_off: 'true' | 'false';
    id: string;
}
export async function createShipment(input: initalShipmentSchema) {
    const supabase = createClient()
    // insert data into shipment table
    const { data: shipmentData, error } = await supabase.from('shipment').insert([{
        length: Number(input.length),
        width: Number(input.width),
        height: Number(input.height),
        weight: Number(input.weight),
        drop_off: input.drop_off === 'true' ? true : false,
    }]).select().single()
    // get shipment.id
    const shipmentId = shipmentData?.id;
    // insert shipment.id into the claim from claim table
    const { data: claimData, error: claimError } = await supabase.from('claim').update({shipment_id: shipmentId}).eq('id', input.id).select().single()
    console.log('error', claimError)
    if(claimData) {
        revalidatePath(`/dashboard/claims/${input.id}`)
    }
}
// END

// createRGA server action
export async function createRGA(claimId: string) {
    const supabase = createClient()
    const { data: dataRGA, error: errorRGA } = await supabase.from('rga').insert([{ }]).select().single()
    console.log('rga error', errorRGA)
    const { data: claimData, error: claimError } = await supabase.from('claim').update({rga_id: dataRGA?.id}).eq('id', claimId).select().single()
    
    if(claimData) {
        revalidatePath(`/dashboard/claims/${claimId}`)
    }
}

// upload file server action
export async function uploadFile(fileList: FileList) {
    console.log(fileList)
    // const supabase = createClient()
    // const files = Array.from(fileList)
    // if(fileType === 'img') {
    //     const file = files.map(async (file) => {
    //         const { data, error } = await supabase.storage.from('claims').upload(`${id}/photos/${file.name}`, file, {
    //             cacheControl: '3600',
    //             upsert: false
    //         })
    //         console.log(data, error)
    //         return data 
    //     })
    //     return file
    // } else {
    //     const file = files.map(async (file) => {
    //         const { data, error } = await supabase.storage.from('claims').upload(`${id}/photos/${file.name}`, file, {
    //             cacheControl: '3600',
    //             upsert: false
    //         })
    //         return data 
    //     })
    //     return file
    // }
}

export async function test(id: any) {
    console.log('test', id)
    return true
}

// submitComment server action
export async function submitComment(comment: string, claimId: string) {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('comment').insert([{ comment: comment, claim_id: claimId, user_id: userData.user?.id }])
    console.log(error)
    if(data) {
        console.log(data)
        revalidatePath(`/dashboard/claims/${claimId}`)
    }
}