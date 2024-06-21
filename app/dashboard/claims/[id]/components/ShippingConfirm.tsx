'use client'
import {Button} from '@/components/ui/button'
import { useState } from 'react'
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  
export default function ShippingConfirm({id}: {id: string}) {
    const [loading, setLoading] = useState(false)
    const [rates, setRates] = useState<any>(null)
    const [selectedRate, setSelectedRate] = useState<any>(null)
    const [confirmed, setConfirmed] = useState<any>(null)

    async function getRates() {
        setLoading(true)
        const res = await fetch(`${id}/api/shippo/get-rates/`, {
            method: 'GET',
        }).then(res => res.json())
        setLoading(false)
        setRates(res.rates)
        return
    }

    async function confirmRate() {
        setLoading(true)
        const res = await fetch(`${id}/api/shippo/confirm-rate/`, {
            method: 'POST',
            body: JSON.stringify({rate: selectedRate}),
        }).then(res => res.json())
        setLoading(false)
        console.log(res)
        return res
    }
    if(rates && confirmed) {
        return (
            <p>Shipping Label has up been added.</p>
        )
    }
    if(rates) {
        return (
            <div>
                <h2 className='text-lg font-bold'>Shipping Rates</h2>
                <RadioGroup defaultValue="comfortable" onValueChange={(e) => setSelectedRate(e)}>
                    {rates.map((rate: any, index: any) => (
                        <div className="flex items-center space-x-2" key={index}>
                            <RadioGroupItem value={JSON.stringify(rate)} id={`r${index}`} />
                            <Label htmlFor={`r${index}`} className='grid grid-cols-3 items-start w-full'><span>${rate.amount}</span> <span>{rate.provider} {rate.servicelevel.name}</span> <span>estimated days: {rate.estimatedDays}</span></Label>
                        </div>
                    ))}
                </RadioGroup>
                {loading && <Button className="mt-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirming Rate</Button>}
                {!loading && (<Button className="mt-2" onClick={() => setConfirmed(confirmRate())}>Confirm Selected Rate</Button>)}
            </div>
        )
    }
    
    return (
        <div>
            {loading && <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting Rates</Button>}
            {!loading && (<Button onClick={() => getRates()}>Get Rates</Button>)}
        </div>
        
    )
}