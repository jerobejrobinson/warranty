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
                <Button variant="outline">Create New Claim</Button>
            </PopoverTrigger>
            <PopoverContent>
                    <Button asChild>
                        <Link href={'/dashboard/claims/create?type=part-search'}>Create Claim Using Part Number</Link>
                    </Button>
            </PopoverContent>
        </Popover>
    )
}