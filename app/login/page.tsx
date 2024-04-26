import LoginForm from "@/components/LoginForm";
import { createClient } from "@/app/utils/supabase/server";
export default async function Page() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()

    console.log('data', data)
    console.log('error', error)
    return (
        <main className="flex flex-col h-screen justify-center items-center p-4">
            <LoginForm />
        </main>
    )
}