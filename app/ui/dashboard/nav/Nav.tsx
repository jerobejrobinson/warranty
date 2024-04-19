import Image from "next/image"
import { 
    HomeIcon,
    UserCircleIcon,
    DocumentPlusIcon
} from "@heroicons/react/16/solid"
import Link from "next/link"
import SignOutBtn from "./SignOutBtn"

export default async function Nav() {
    return (
        <>
        <div className="w-full xl:p-4 flex flex-row items-center xl:flex-col h-full gap-4 xl:border xl:border-r-1 border-r-gray-300 shadow-xl ">
            <Image src='/images/logo.svg' alt="MSP Diesel Solutions Warranty Tracker" width={250} height={125} className="hidden xl:block bg-[#e8523d] p-4 rounded-xl w-full shadow"/>
            <nav className="w-full p-4 xl:shadow xl:rounded-xl flex-1 xl:border xl:border-1 flex flex-row justify-between xl:justify-start xl:flex-col gap-4">
                <Link href='/dashboard' className="flex gap-4 items-center bg-gray-300 hover:bg-gray-600 transition-all xl:rounded-xl p-4 w-full"><HomeIcon className="w-6 mx-auto md:mx-0" /><span className="hidden md:inline">Dashboard</span></Link>
                <Link href='/dashboard/claims' className="flex gap-4 items-center bg-gray-300 hover:bg-gray-600 transition-all xl:rounded-xl p-4 w-full"><DocumentPlusIcon className="w-6 mx-auto md:mx-0"/><span className="hidden md:inline">Claims</span></Link>
                <Link href='/dashboard/customers' className="flex gap-4 items-center bg-gray-300 hover:bg-gray-600 transition-all xl:rounded-xl p-4 w-full"><UserCircleIcon className="w-6 mx-auto md:mx-0"/><span className="hidden md:inline">Customers</span></Link>
            </nav>
            <SignOutBtn />
        </div>
        </>
    )
}