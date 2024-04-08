'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { z } from 'zod'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    revalidatePath('/')
  }

  revalidatePath('/')
}

const SignupSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    email: z.string({
        required_error: "Email is required",
    }).email(),
    salesId: z.string({
        required_error: "Sales Id is required",
    }),
    password: z.string(),
    confirmPassword: z.string()
})

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        salesId?: string[];
    };
    message?: string | null;
}

const CompleteSignup = SignupSchema.omit({confirmPassword: true})

export async function signup(prevState: State, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries())
    const validatedFields = CompleteSignup.safeParse(rawFormData)
    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.'
        }
    }
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    
    const supabase = createClient()
    
    try {
        await supabase.auth.signUp(data)
    } catch(error) {
        return { message: 'Database Error: Failed to Sign up user.'}
    } 

    revalidatePath('/')
    revalidatePath('/')
}