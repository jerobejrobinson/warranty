'use client'
import { useState } from "react";
import LoginForm from "@/app/ui/LoginForm";
import SignupForm from "@/app/ui/SignupForm";
export default function Page() {  
  const [form, setForm] = useState<"login" | "signup">('login') 

  const handleFormToggle = () => {
    setForm((prev) => {
      return prev === 'login' ? 'signup' : 'login'
    })
  }
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      {form === 'login' && <LoginForm />}
      {form === 'signup' && <SignupForm />}
      <p className="text-xs p-2">Click <span className="text-blue-600 hover:underline" role="button" aria-pressed="false" onClick={handleFormToggle}>here</span> to create an account.</p>
      <p className="text-xs p-2">Placeholder for <span className="text-blue-600 hover:underline" role="button" aria-pressed="false">reset password</span>!</p>
    </main>
  );
}
