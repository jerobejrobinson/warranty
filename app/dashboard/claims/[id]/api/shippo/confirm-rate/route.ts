import { 
    Shippo, 
    LabelFileTypeEnum
} from "shippo"
import { createClient } from "@/app/utils/supabase/server"
import { status } from "@/lib/statusBadge";

type Params = {
    id: string
}
declare global {
    interface Date {
        addDays(days: number): Date;
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export async function POST(request: Request, context: { params: Params }) {
    let { rate } = await request.json()
    
    rate = JSON.parse(rate)
    const shippo = new Shippo({apiKeyHeader: process.env.SHIPPO_TEST_API_KEY})
    const id = context.params.id
    const supabase = createClient()
    const { data, error } = await supabase.from('claim').select('shipment ( id ), rga ( id )').eq("id", id).single<any>()
    
    if(error) {
        return new Response(null, { status: 500 })
    }
    const transaction = await shippo.transactions.create({
        rate: rate.objectId,
        labelFileType: LabelFileTypeEnum.Pdf,
        async: false
    })
    
    let date = new Date()
    const { data: updatedData, error: updateError } = await supabase.from('shipment').update({
        tracking_number: transaction.trackingNumber,
        carrier: rate.provider,
        estimated_delivery_date: date.addDays(rate.estimatedDays).toISOString(),
        label_url: transaction.labelUrl,
        amount: rate.amount,
    }).eq("id", data.shipment.id).single<any>()

    const { data: updatedRGA, error: updateRGAError } = await supabase.from('rga').update({ status: 'Shipping label sent' }).eq("id", data.rga.id).single<any>()

    return new Response(JSON.stringify(updatedData), { status: 200 })
}