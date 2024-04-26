'use client'
// UI
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Server Action
import { signup } from "@/app/lib/actions"

//
import { useFormState } from 'react-dom'
import {useState} from 'react'

export default function SignupForm() {
    const [state, dispatch] = useFormState(signup, {
        message: null,
        errors: {}
    })
    return (
        <form action={dispatch}>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" placeholder="Max" name="firstName" required />
                            </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" placeholder="Robinson" name="lastName" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2 col-span-1">
                            <Label htmlFor="accountNumber">Account No#</Label>
                            <Input
                                id="accountNumber"
                                type="text"
                                placeholder="99999"
                                name="accountNumber"
                                required
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="text"
                                placeholder="(901) 698-0988"
                                name="phone"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            name="email"
                            required
                            />
                        </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" name="password"/>
                    </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}