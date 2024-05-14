'use client'
import { Button } from "@/components/ui/button"
import { createClient } from "@/app/utils/supabase/client"
export default function SignoutBtn() {
    const supabase = createClient()
    const signOutHandler = async () => {
        const { error } = await supabase.auth.signOut()
        console.log(error)
    }
    return (
        <Button className="xl:mt-auto xl:mx-auto" onClick={signOutHandler}>Sign Out</Button>
    )
}