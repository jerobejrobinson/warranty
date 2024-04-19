import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import Nav from '@/app/ui/dashboard/nav/Nav'
export default async function layout({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/')
    }
    return (
        <main className="grid grid-cols-4 h-screen grid-rows-10 ">
            <div className="col-span-4 row-span-1 xl:col-span-1 xl:row-span-10">
                <Nav />
            </div>
            <div className="col-span-4 row-span-9 xl:col-span-3 xl:row-span-10 bg-gray-200">{children}</div>
        </main>
    )
}