import CreateClaimBtn from "@/app/ui/dashboard/claims/CreateClaimBtn"
import { createClient } from "@/app/utils/supabase/server"
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid"
import ClaimCard from "@/components/ClaimCard"
import Link from "next/link"

export default async function page() {
    const supabase = createClient()

    const { data, error } = await supabase.from('claim').select('id, date_submitted, part_number, qty, price, customer ( name ), rga (id, rga_number), shipment (id, drop_off)')

    return (
        <>
            <section className="p-4 relative h-full flex flex-col gap-4">
                <form action="" className="w-full">
                    <label htmlFor="searchBar">
                        <input 
                            type="text" 
                            id="searchBar" 
                            name="search" 
                            placeholder="RGA number, Original Invoice Number, Customers, and Part Number"
                            className="p-4 border border-1 border-gray-400 rounded-md w-full"
                        />
                    </label>
                </form>
                <ClaimCard claim={{
                    invoice_number: '1000153362',
                    date_submitted: '01-04-2024:thjalaslkjlnkasdk',
                    qty: '4',
                    price: '234',
                    customer: {
                        name: 'Jerobe'
                    },
                    part_number: 'BOS0986435502'
                }}/>
                {/* <div>
                    <h1 className="text-2xl font-bold">Claims</h1>
                    <p>search bar to find claims be RGA number, Original Invoice Number, Customers, and Part Number</p>
                    <p>Add a submit new claim button</p>
                    <p className="text-xl font-bold">Table view of all the claims in the database</p>
                    <p>-  The table should not overflow</p>
                    <p>-  use pagination at the bottom on the screen</p>
                </div> */}
                <div className="absolute bottom-1 right-1">
                    <CreateClaimBtn />
                </div>
            </section>
        </>
    )
}