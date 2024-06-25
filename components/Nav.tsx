import Link from "next/link"
import SignoutBtn from "./SignoutBtn"
export default function Nav() {
    return (
        <nav className="flex items-center xl:items-start justify-center gap-4 xl:flex-col h-full xl:py-4" >
            <Link href={'/dashboard'} className="xl:pl-4">Dashboard</Link>
            <Link href={'/dashboard/claims'} className="xl:pl-4">Claims</Link>
            {/* <Link href={'/dashboard/account'} className="xl:pl-4">Account</Link> */}
            <SignoutBtn />
        </nav>
    )
}