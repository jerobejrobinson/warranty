import LoginForm from "@/components/LoginForm";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function Page() {
    const supabase = createClient()
    const { data } = await supabase.auth.getUser()
    if(data?.user) {
        redirect('/dashboard')
    }
    
    return (
        <main className="flex flex-col h-screen justify-center items-center p-4">
            <LoginForm />
        </main>
    )
}