import { 
    Shippo, 
    AddressCreateRequest, 
    ParcelCreateRequest, 
    DistanceUnitEnum, 
    WeightUnitEnum 
} from "shippo"
import { createClient } from "@/app/utils/supabase/server"
type Params = {
    id: string
}
export async function GET(request: Request, context: { params: Params }) {
    const shippo = new Shippo({apiKeyHeader: process.env.SHIPPO_TEST_API_KEY})
    const id = context.params.id
    const supabase = createClient()
    const { data, error } = await supabase.from('claim').select('shipment ( * ), profiles ( * )').eq("id", id).single<any>()

    if(error) {
        return new Response(null, { status: 500 })
    }
    const parcel: ParcelCreateRequest = {
        length: data.shipment.length.toString(),
        width: data.shipment.width.toString(),
        height: data.shipment.height.toString(),
        distanceUnit: DistanceUnitEnum.In,
        weight: data.shipment.weight.toString(),
        massUnit: WeightUnitEnum.Lb,
    }

    const addressFrom: AddressCreateRequest = {
        name: data.profiles?.first_name + ' ' + data.profiles?.last_name,
        street1: data.profiles.address_1,
        street2: data.profiles.address_2,
        city: data.profiles.city,
        state: data.profiles.state,
        zip: data.profiles.zip,
        country: data.profiles.country,
        phone: data.profiles.phone,
        email: data.profiles.email
    }

    const addressTo: AddressCreateRequest = {
        name: 'Warranty Claim',
        street1: '3250 Millbranch Rd',
        street2: '',
        street3: '',
        city: 'Memphis',
        state: 'TN',
        zip: '38116',
        country: 'US',
        phone: '19013024488',
        email: 'jrobinson@mspdieselsolutions.com'
    }

    const shipment = await shippo.shipments.create({
        addressFrom: addressFrom,
        addressTo: addressTo,
        parcels: [parcel],
        "async": false,
    })

    return new Response(JSON.stringify(shipment), { status: 200 })
}