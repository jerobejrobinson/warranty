import { createClient } from '@/app/utils/supabase/server';
import { notFound } from 'next/navigation';
import BreadcrumbElement from '@/components/BreadcrumbElement';
import { Badge } from '@/components/ui/badge';
import { status, displayRGANumber } from '@/lib/statusBadge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserActions from './components/UserActions';
import AdminActions from './components/AdminActions';
import DisplayPhotoGrid from './components/DisplayPhotoGrid';
import DisplaySupportingDocuments from './components/DisplaySupportingDocuments';
import DisplayComment from './components/DisplayComment';
import DisplayShippingInformation from './components/DisplayShippingInformation';

export default async function Page({ params }: {params: {id: string}}) {
    const supabase = createClient()
    
    const { data: admin } = await supabase.from('admin').select('*').limit(1).single()
    const { data } = await supabase.from('claim').select('*, shipment (id, drop_off, tracking_number ), rga (id, rga_number, status), profiles ( first_name, last_name, company_name )').eq("id", params.id).single()

    const Links = [
        {anchor: 'Back to claims', url: '/dashboard/claims'},
        {anchor: 'seperator', url: 'seperator'},
        {anchor: params.id, url: `/dashboard/claims/${params.id}`}
    ]
    
    if(!data) {
        notFound()
    }
    return (
        <main className='h-full grid grid-rows-12'>
            <div className='row-span-1'>
            <BreadcrumbElement obj={Links} />
            </div>
            <div className='p-4 m-4 bg-white border rounded shadow row-span-11'>
                <ScrollArea className='h-full'>
                    <div className='flex flex-row justify-between'>
                        <h1 className='text-2xl font-bold'>{data.part_number}</h1>
                        <Badge variant="outline">{status(data)}</Badge>
                    </div>
                    {admin && ( <AdminActions id={params.id} claim={data}/> )}
                    {!admin && ( <UserActions id={params.id} claim={data}/> )}
                    <DisplayShippingInformation id={params.id} />
                    <div className='pt-4'>
                        <h2 className='text-xl font-bold mb-4'>Claim Information</h2>
                        <dl className="grid grid-cols-2 gap-4 mb-4">
                            <dt>Customer Name</dt>
                            <dd>{data.profiles.company_name}</dd>
                            <hr className='col-span-2'/>
                            <dt>Date Submitted</dt>
                            <dd>{data.date_submitted.slice(0, 10)}</dd>
                            <hr className='col-span-2'/>
                            <dt>Part Description</dt>
                            <dd>{data.part_desc}</dd>
                            <hr className='col-span-2'/>
                            <dt>Invoice Number</dt>
                            <dd>{data.invoice_number}</dd>
                            <hr className='col-span-2'/>
                            <dt>RGA Number</dt>
                            <dd>{displayRGANumber(data)}</dd>
                            <hr className='col-span-2'/>
                            <dt>Quanity</dt>
                            <dd>{data.qty}</dd>
                            <hr className='col-span-2'/>
                            <dt>Price</dt>
                            <dd>{'$'}{data.price}</dd>
                        </dl>
                        <h2 className='text-xl font-bold mb-4'>Vehicle Information</h2>
                        <dl className="grid grid-cols-2 gap-4">
                            <dt>VIN</dt>
                            <dd>{data.vin}</dd>
                            <hr className='col-span-2'/>
                            <dt>Serial</dt>
                            <dd>{data.date_submitted.slice(0, 10)}</dd>
                            <hr className='col-span-2'/>
                            <dt>Year</dt>
                            <dd>{data.year}</dd>
                            <hr className='col-span-2'/>
                            <dt>Make</dt>
                            <dd>{data.make}</dd>
                            <hr className='col-span-2'/>
                            <dt>Model</dt>
                            <dd>{data.model}</dd>
                            <hr className='col-span-2'/>
                            <dt>Install Date</dt>
                            <dd>{data.install_date.slice(0, 10)}</dd>
                            <hr className='col-span-2'/>
                            <dt>Failed Date</dt>
                            <dd>{data.failed_date.slice(0, 10)}</dd>
                            <hr className='col-span-2'/>
                            <dt>Mileage Installed</dt>
                            <dd>{data.mileage_installed}</dd>
                            <hr className='col-span-2'/>
                            <dt>Mileage Failed</dt>
                            <dd>{data.mileage_failed}</dd>
                            <hr className='col-span-2'/>
                            <dt>Request Labor Hours</dt>
                            <dd>{data.labor_hours}</dd>
                            <hr className='col-span-2'/>
                            <dt>Symptoms</dt>
                            <dd>{data.symptoms}</dd>
                            <hr className='col-span-2'/>
                            <dt>Diagnostics Test Performed</dt>
                            <dd>{data.diagnostics}</dd>
                        </dl>
                    </div>
                    <DisplayPhotoGrid id={params.id} />
                    <DisplaySupportingDocuments id={params.id} />
                    <DisplayComment id={params.id} />
                </ScrollArea>
            </div>
        </main>
    );
}