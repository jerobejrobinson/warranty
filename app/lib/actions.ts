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
        email?: string[];
        password?: string[];
    };
    message?: string;
}

export async function login(prevState: State, formData: FormData) {
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
            message: 'Failed to log in user.'
        }
    } else {
        redirect('/dashboard')
    }
}

const SignupSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    email: z.string({
        required_error: "Email is required",
    }),
    salesId: z.string({
        required_error: "Sales Id is required",
    }),
    password: z.string(),
    confirmPassword: z.string()
})

export type SignupState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        salesId?: string[];
    };
    message?: string | null;
}

const CompleteSignup = SignupSchema.omit({confirmPassword: true})

export async function signup(prevState: SignupState, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries())
    const validatedFields = CompleteSignup.safeParse(rawFormData)

    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to sign up user.'
        }
    }
    
    try {
        const supabase = createClient()
        await supabase.auth.signUp({
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            options: {
                data: {
                  name: validatedFields.data.name,
                  salesId: validatedFields.data.salesId
                },
              },
        })
    } catch(error) {
        return { message: 'Failed to sign up user' }
    }
    redirect('/auth/verify-email')
}

export async function signout() {
    const supabase = createClient()
    const {error} = await supabase.auth.signOut()
    if(error) {
        return new Error('Failed signing out user')
    }
    redirect('/')
}

export async function getInvoice(formData: FormData) {
    const cookieStore = cookies()
    const dist = cookieStore.get('dist')
    const json = {
        "request": {
          "companyNumber": 3,
          "operatorInit": "web",
          "operatorPassword": "",
          "orderNumber": Number(formData.get('invoiceNumber') as string),
          "orderSuffix": 0,
          "includeHeaderData": true,
          "includeTotalData": true,
          "includeTaxData": true,
          "includeLineData": true
        }
    }

    const { response } = await fetch(`${process.env.CSD_URL}/sxapioegetsingleorder`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${dist?.value}`
        },
        body: JSON.stringify(json)
    }).then(data => data.json())

    const contact = new Map()
    response?.tFieldlist['t-fieldlist'].forEach(({fieldName, fieldValue}: {fieldName: string; fieldValue: string | null}) => {
        contact.set(fieldName, fieldValue)
    });
    
    return {
        details: {
            customerName: contact.get('name'),
            accountNumber: contact.get('custno'),
            salesRepId: contact.get('slsrepin'),
            totalInvoiceAmount: contact.get('totinvamt'),
            invoiceNumber: contact.get('orderno'),
        },
        parts: response?.tOelineitem['t-oelineitem'],
        rawRes: response?.tFieldlist['t-fieldlist']
    }
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