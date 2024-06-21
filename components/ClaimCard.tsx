import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { status, displayRGANumber } from '@/lib/statusBadge'

export default async function ClaimCard({claim}: {claim: any}) {
    console.log(claim)
    return (
        <Link href={`/dashboard/claims/${claim.id}`}>
            <Card className="my-4">
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
                        <dd>{claim.profiles.company_name}</dd>
                    </dl>
                </CardContent>
                <CardFooter className="flex flex-row justify-between">
                    <Badge variant="outline">{status(claim)}</Badge>
                </CardFooter>
            </Card>
        </Link>
    )
}
