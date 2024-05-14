'use client'
// UI
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import states from '@/lib/states'
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
            <Card className="mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 grid-cols-2">
                        {/* Left Side */}
                        <div className="grid grid-cols-2 gap-4 border-r-2 pr-4">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input placeholder="Company Name" name="companyName" required />
                            </div>
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="address_1">Address 1</Label>
                                <Input placeholder="Address 1" name="address_1" required />
                            </div>
                            <div className="grid gap-2 col-span-2 grid-cols-2">
                                <div>
                                    <Label htmlFor="address_2">Address 2</Label>
                                    <Input placeholder="Address 2" name="address_2"/>
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input placeholder="City" name="city" required />
                                </div>
                            </div>
                            <div className="grid gap-2 col-span-2 grid-cols-3">
                                <div className="">
                                    <Label htmlFor="state">State</Label>
                                    <Input placeholder="State" name="state" required />
                                </div>
                                <div className="">
                                    <Label htmlFor="zip">Zip</Label>
                                    <Input placeholder="Zip" name="zip" required />
                                </div>
                                <div className="">
                                    <Label htmlFor="country">Country</Label>
                                    <Input placeholder="country" name="country" required />
                                </div>
                            </div>
                        </div>
                        {/* Right Side */}
                        <div className="grid gap-4 grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" placeholder="Max" name="firstName" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" placeholder="Robinson" name="lastName" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4 col-span-2">
                                <div className="">
                                    <Label htmlFor="accountNumber">Account No#</Label>
                                    <Input
                                        id="accountNumber"
                                        type="text"
                                        placeholder="99999"
                                        name="accountNumber"
                                        required
                                    />
                                </div>
                                <div className="">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="9016980988"
                                        name="phone"
                                        required
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    name="email"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password"/>
                            </div>
                        </div>
                        <Button type="submit" className="w-full col-span-2">
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