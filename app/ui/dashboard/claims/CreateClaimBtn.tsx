import { DocumentPlusIcon } from "@heroicons/react/16/solid"
import Link from "next/link"
export default function CreateClaimBtn() {
    return (
        <Link 
            className="text-white w-16 h-16 rounded-full border border-1 shadow-lg bg-blue-600 hover:bg-blue-800 transition-all flex flex-col justify-center items-center p-4"
            href='/dashboard/claims/create'
        >
            <DocumentPlusIcon className="w-full" />
        </Link>
    )
}