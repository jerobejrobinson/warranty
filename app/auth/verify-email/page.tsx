import { Metadata } from "next";
import { AtSymbolIcon } from "@heroicons/react/16/solid"

export const metadata: Metadata = {
    title: "Verify Email",
    description: "",
};

export default function Page() {
    return (
        <main className="flex flex-col h-screen justify-center items-center bg-[#e8523d] text-white space-y-2">
            <AtSymbolIcon className="w-16 h-16"/>
            <h1 className="text-2xl font-bold">Verify Your Email Address</h1>
            <p>Click the link in the email we sent you to verify your account.</p>
        </main>
    )
}