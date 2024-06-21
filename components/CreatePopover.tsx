import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CreatePopover() {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" asChild>
                    <p>Create New Claim</p>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Button asChild className="w-full mb-4">
                    <Link href={'/dashboard/claims/create?type=part-search'}>Find Invoice by Part Number</Link>
                </Button>
                <Button asChild className="w-full">
                    <Link href={'/dashboard/claims/create?type=date-range'}>Find invoice by date range</Link>
                </Button>
                
            </PopoverContent>
        </Popover>
    )
}