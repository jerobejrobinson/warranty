'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/app/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "react-dom"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"


export default function LoginForm() {
    const supabase = createClient()
    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = e.currentTarget.email.value
        console.log(email)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/update-password',
        })
        
    }

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event == "PASSWORD_RECOVERY") {
            const newPassword = prompt("What would you like your new password to be?");
            if(!newPassword) return alert("You must enter a new password.")
            const { data, error } = await supabase.auth
              .updateUser({ password: newPassword })
     
            if (data) alert("Password updated successfully!")
            if (error) alert("There was an error updating your password.")
          }
        })
      }, [])
    return (
        <form onSubmit={(e) => sendEmail(e)}>
            <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                Enter your email below. We will send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="email">Email</Label>
                    </div>
                    <Input id="email" type="email" name="email" required />
                </div>
                <Button type="submit" className="mt-4 w-full">
                    Submit
                </Button>
            </CardContent>
            </Card>
        </form>
  )
}