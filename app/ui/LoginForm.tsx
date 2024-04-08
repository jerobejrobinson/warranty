import { login, signup } from "@/app/lib/actions"

export default function LoginForm() {
    return (
        <form action={login} className="border border-1 rounded shadow p-2 space-y-2 w-1/3">
            <label htmlFor="email" className="block">
                <span className="text-sm">Email</span>
                <input id="email" type="email" name="email" className="p-2 block w-full border border-1 border-gray-300 rounded" required />
            </label>
            <label htmlFor="password" className="block">
                <span className="text-sm">Password</span>
                <input id="password" type="password" name="passsword" className="p-2 block w-full border border-1 border-gray-300 rounded" required/>
            </label>
            <button type="submit" className="bg-blue-400 text-white w-full p-4 rounded !mt-4 hover:bg-blue-600 transition-all">Login</button>
        </form>
    )
}