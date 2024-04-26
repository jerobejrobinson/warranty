import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import brands from "@/lib/brands"

export default function SelectBrand({state}: {state: any}) {
    return (
        <Select onValueChange={(value) => {
            state(value)
        }}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select A Brand" />
            </SelectTrigger>
            <SelectContent>
                {brands.map(({linecode, brand}, index) => (
                    <SelectItem value={linecode} key={index}>{brand}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}