import { createClient } from "@/app/utils/supabase/server"
import ClaimCard from "@/components/ClaimCard"
import CreatePopover from "@/components/CreatePopover"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function page() {
    const supabase = createClient()
    const { data: admin } = await supabase.from('admin').select('*').limit(1).single()
    const { data: claims } = await supabase.from('claim').select('id, invoice_number, date_submitted, part_number, qty, price, profiles ( company_name ), rga (id, rga_number), shipment (id, drop_off)')
    return (
        <>
            <section className="p-4 relative h-full flex flex-col gap-4">
                {/* <form action="" className="w-full">
                    <label htmlFor="searchBar">
                        <input 
                            type="text" 
                            id="searchBar" 
                            name="search" 
                            placeholder="RGA number, Original Invoice Number, Customers, and Part Number"
                            className="p-4 border border-1 border-gray-400 rounded-md w-full"
                        />
                    </label>
                </form> */}
                
                <ScrollArea className="rounded-md border px-4">
                    {claims && claims.map(item => (
                        <ClaimCard claim={item} key={item.id}/>
                    ))}
                </ScrollArea>
                
                {/*
                    <div>
                        <h1 className="text-2xl font-bold">Claims</h1>
                        <p>search bar to find claims be RGA number, Original Invoice Number, Customers, and Part Number</p>
                        <p>Add a submit new claim button</p>
                        <p className="text-xl font-bold">Table view of all the claims in the database</p>
                        <p>-  The table should not overflow</p>
                        <p>-  use pagination at the bottom on the screen</p>
                    </div>
                */}
                <div className="absolute bottom-2 right-2 ">
                    {/* For new create claims btn */}
                    {!admin && <CreatePopover />}
                </div>
            </section>
        </>
    )
}