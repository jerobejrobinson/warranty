'use client'
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

export default function Page() {  
  const [form, setForm] = useState<"login" | "signup">('login') 

  const handleFormToggle = () => {
    setForm((prev) => {
      return prev === 'login' ? 'signup' : 'login'
    })
  }
  return (
    <main className="flex flex-col h-screen justify-center items-center p-4">
      Welcome to claims
    </main>
  );
}
