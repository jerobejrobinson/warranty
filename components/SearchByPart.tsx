'use client'
import { useState } from "react"
import EnterPartNumber from "@/components/EnterPartNumber"
import { useDebounce } from "use-debounce"
import { Button } from "@/components/ui/button"
import { getInvoicesByPartNumber } from "@/app/lib/actions"
import { Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { toast } from "./ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { handleKeyDown } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import brands from "@/lib/brands"
import Link from "next/link"



export default function SearchByPart() {
    const [brand, setBrand] = useState<string | null>(null)
    const [partNumber, setPartNumber] = useState<string | null>(null)
    const [invoices, setInvoices] = useState<object[] | null>(null)
    const [loader, setLoader] = useState<boolean>(false)
    const [value] = useDebounce(partNumber, 500)

    async function actionHandler() {
        setLoader(true)
        if(!brand || !value) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "let's try this again"
            })
            return;
        }
        const res = await getInvoicesByPartNumber({linecode: brand, partnumber: value})
        setInvoices(res)
        setLoader(false)
    }
    
    return (
        <section className="h-full flex flex-col bg-slate-300">
            <div className={`p-4 ${invoices ? 'h-min' : 'h-full'}`}>
                <h1 className="w-full">Search For Invoice By Part Number</h1>
                {invoices && <p className="text-sm">Displaying all invoices that includes the part number below.</p>}
                {!brand && <SelectBrand state={setBrand}/>}
                {brand && <p className="font-medium">{brand}{invoices && <span className="font-light">{value}</span>}</p>}
                {!invoices && brand && <EnterPartNumber state={setPartNumber} enterKeyDownFunc={handleKeyDown} enterFunc={actionHandler}/>}
                {!loader && !invoices && brand && value && <Button onClick={actionHandler} className="w-full mt-4">Click to Find Invoice {' ( crtl + enter )'}</Button>}
                {loader && <Button className="w-full mt-4" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>}
            </div>
            <ScrollArea className={`${invoices ? 'w-full p-4 ' : 'w-0 h-0 p-0'} transition-all bg-slate-100 flex flex-col`}>
                {invoices && invoices.map((obj: any, index: number) => ( <InvoiceCard invoice={obj} key={index} /> ))}
            </ScrollArea>
        </section>
    )
}

function InvoiceCard({invoice}: {invoice: any}) {
    return (
        <Card className="mb-4 cursor-pointer">
            <CardHeader>
                <CardTitle>Invoice Number: <span className="font-light">{invoice.orderno}</span></CardTitle>
                <CardDescription>
                    <span>{invoice.shipprod.slice(0,3)}</span>
                    <span className="font-light">{invoice.shipprod.slice(3)}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2">
                    <dt>Order Qty</dt>
                    <dd>{Number(invoice.qtyord)}</dd>
                    <dt>Price</dt>
                    <dd>{'$'}{Number(invoice.price)}</dd>
                </dl>
            </CardContent>
            <CardFooter>
                <dl className="grid grid-cols-2 gap-4">
                    <dt>Date Orderded</dt>
                    <dd>{invoice.enterdt}</dd>
                </dl>
                <Button asChild className="ml-auto">
                    <Link href={`/dashboard/claims/create?type=part-search&id=${invoice.shipprod.slice(0,3)}~${invoice.orderno}~${invoice.shipprod.slice(3)}~${Number(invoice.qtyord)}~${invoice.slsrepin}~${Number(invoice.price)}`}>Select Invoice</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

function SelectBrand({state}: {state: any}) {
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