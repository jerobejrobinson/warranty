import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function EnterPartNumber({state, enterKeyDownFunc, enterFunc}: {state: any; enterKeyDownFunc: any, enterFunc: any}) {
    return (
        <div>
            <Label htmlFor="partNumber">Enter Part Number</Label>
            <Input type="text" placeholder="0986435502" onChange={(e) => {
                state(e.target.value)
            }} onKeyDown={(e) => enterKeyDownFunc(e, enterFunc)}/>
        </div>
    )
}