'use client'
import {useState} from 'react'
import ReactPasswordChecklist from 'react-password-checklist'
import { signup } from '@/app/lib/actions'
import { useFormState } from 'react-dom'

export default function SignupForm() {
    const initialState = { message: 'str', errors: {}}
    //@ts-ignore
    const [state, dispatch] = useFormState(signup, initialState)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    return (
        <form action={dispatch} className="border border-1 rounded shadow p-2 space-y-2 w-full lg:w-1/3">
            <label htmlFor="name" className="block">
                <span className="text-sm">Name</span>
                <input id="name" name="name" type="text" className="p-2 block w-full border border-1 border-gray-300 rounded" required/>
            </label>
            <label htmlFor="email" className="block">
                <span className="text-sm">Email</span>
                <input id="email" name="email" type="email" className="p-2 block w-full border border-1 border-gray-300 rounded" required/>
            </label>
            <label htmlFor="salesId" className="block">
                <span className="text-sm">Sales Id</span>
                <input id="salesId" name="salesId" type="text" className="p-2 block w-full border border-1 border-gray-300 rounded" required/>
            </label>
            <label htmlFor="password" className="block">
                <span className="text-sm">Password</span>
                <input id="password" name="password" type="password" className="p-2 block w-full border border-1 border-gray-300 rounded" onChange={e => setPassword(e.target.value)} required/>
            </label>
            <label htmlFor="confirmPassword" className="block">
                <span className="text-sm">Confirm Password</span>
                <input id="confirmPassword" name="confirmPassword" type="password" className="p-2 block w-full border border-1 border-gray-300 rounded" onChange={e => setConfirmPassword(e.target.value)} required/>
            </label>
            <ReactPasswordChecklist
                className='text-sm !mt-4'
				rules={["minLength","specialChar","number","capital","match"]}
				minLength={5}
				value={password}
				valueAgain={confirmPassword}
			/>
            <button type="submit" className="bg-blue-400 text-white w-full p-4 rounded !mt-4 hover:bg-blue-600 transition-all">Sign Up</button>
        </form>
    )
}