import CreateClaimBtn from "@/app/ui/dashboard/claims/CreateClaimBtn"
import { createClient } from "@/app/utils/supabase/server"
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid"
import Link from "next/link"

export default async function page() {
    const supabase = createClient()

    const { data, error } = await supabase.from('claim').select('id, date_submitted, part_number, qty, price, customer ( name ), rga (id, rga_number), shipment (id, drop_off)')

    function status(claim: any) {
        let status = null
        if(!claim.shipment) {
            return 'submitted'
        }
        if(claim.shipment.drop_off) {
            status = 'Salesperson dropping off'
        } else {
            status = 'Expecting delivery on date'
        }
        return status
    }
    
    function displayRGANumber(claim: any) {
        if(!claim.rga) {
            return 'Pending'
        } else {
            return claim.rga.rga_number
        }
    }

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
                <table className="hidden min-w-full text-gray-900 bg-white md:table border border-1 border-gray-400 rounded-md">
                    <thead className="rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th className="px-4 py-5 font-medium">Date Submitted</th>
                            <th className="px-4 py-5 font-medium">RGA Number</th>
                            <th className="px-4 py-5 font-medium">Part Number</th>
                            <th className="px-4 py-5 font-medium">Qty</th>
                            <th className="px-4 py-5 font-medium">Price (ea)</th>
                            <th className="px-4 py-5 font-medium">Customer</th>
                            <th className="px-4 py-5 font-medium">Status</th>
                            <th className="px-4 py-5"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item:any, index: any) => (
                            
                            <tr key={index} className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'>
                                <td className="px-4 py-5">{item.date_submitted.slice(0,10)}</td>
                                <td className="px-4 py-5">{displayRGANumber(item)}</td>
                                <td className="px-4 py-5">{item.part_number}</td>
                                <td className="px-4 py-5">{item.qty}</td>
                                <td className="px-4 py-5">{item.price}</td>
                                <td className="px-4 py-5">{item.customer.name}</td>
                                <td className="px-4 py-5">{status(item)}</td>
                                <td className="px-4 py-5 text-xl"><Link href={`/dashboard/claims/${item.id}`}><ArrowRightEndOnRectangleIcon className="w-4"/></Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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