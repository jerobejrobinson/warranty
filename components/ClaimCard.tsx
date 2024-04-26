import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { Badge } from "@/components/ui/badge"

export default async function ClaimCard({ claim }: {claim: any}) {
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
        <Card>
            <CardHeader>
                <CardTitle>
                    <span>{claim.part_number.slice(0,3)}</span>
                    <span className=" font-light">{claim.part_number.slice(3)}</span>
                </CardTitle>
                <CardDescription className="flex flex-row justify-between">
                    Part Number
                </CardDescription>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                    <dt>Date Submitted</dt>
                    <dd>{claim.date_submitted.slice(0, 10)}</dd>
                    <dt>Invoice Number</dt>
                    <dd>{claim.invoice_number}</dd>
                    <dt>RGA Number</dt>
                    <dd>{displayRGANumber(claim)}</dd>
                    <dt>Quanity</dt>
                    <dd>{claim.qty}</dd>
                    <dt>Price</dt>
                    <dd>{'$'}{claim.price}</dd>
                    <dt>Customer Name</dt>
                    <dd>{claim.customer.name}</dd>
                </dl>
            </CardContent>
            <CardFooter className="flex flex-row justify-between">
                <Badge variant="outline">{status(claim)}</Badge>
                <Button>Maintain</Button>
            </CardFooter>
        </Card>
    )
}
