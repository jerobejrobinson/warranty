'use client'
import { 
    ArrowLeftEndOnRectangleIcon
} from "@heroicons/react/16/solid"
import { signout } from "@/app/lib/actions"
export default function SignOutBtn() {
    return (
        <button 
            className="w-1/4 xl:w-full xl:mt-auto xl:rounded-lg flex justify-between items-center hover:bg-blue-600 bg-blue-400 text-white p-4 xl:shadow transition-all h-full xl:h-auto"
            onClick={async () => { await signout() }}
        ><ArrowLeftEndOnRectangleIcon className="w-8 h-8 mx-auto md:mx-0"/> <span className="hidden md:inline">Sign Out</span></button>
    )
}