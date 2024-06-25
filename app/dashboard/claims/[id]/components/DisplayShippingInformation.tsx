import { createClient } from '@/app/utils/supabase/server';

export default async function DisplayShippingInformation({id}: {id: string;}) {
    const supabase = createClient()
    const { data, error} = await supabase.from('claim').select('shipment ( * )').eq('id', id).single<any>()
    if(data.shipment) {
        return (
            <section className='w-full pt-4'>
                <h2 className='text-xl font-bold'>Package Details</h2>
                <div>
                    <p>Shipping label required: {data.shipment.drop_off ? 'No' : 'Yes'}</p>

                    <h3 className='font-bold mt-2'>weights and dimensions</h3>
                    <span>Weight (lb): {data.shipment.weight}  | </span>
                    <span>Height (in): {data.shipment.height} | </span>
                    <span>Width (in): {data.shipment.width} | </span>
                    <span>Length (in): {data.shipment.length} </span>

                    {!data.shipment.drop_off && (
                        <>
                            <h3 className='font-bold mt-2'>Shipping Label & Tracking Number</h3>
                            <p><span>Tracking Number: </span>{data.shipment.tracking_number ? data.shipment.tracking_number : 'pending'}</p>
                            <p><span>Shipping Label: </span>{data.shipment.label_url ? (<a href={data.shipment.label_url}  target="_blank" className="text-blue-500 underline">Shipping Label</a>) : 'pending'}</p>
                        </>
                    )}
                </div>
            </section>
        )
    }
    return (
        <section className='w-full pt-4'>
            <h2 className='text-xl font-bold'>Shipping Information</h2>
            <div>
                <p>Method of shipping has not been determined by customer.</p>
            </div>
        </section>
    )
}