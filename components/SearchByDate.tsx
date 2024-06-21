'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { getInvoiceByDateRange } from "@/app/lib/actions"
import { Loader2 } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { toast } from "./ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { handleKeyDown } from "@/lib/utils"
import Link from "next/link"



export default function SearchByDate() {
    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()
    const [invoices, setInvoices] = useState<object[] | null>(null)
    const [loader, setLoader] = useState<boolean>(false)

    async function actionHandler() {
        setLoader(true)
        if(!fromDate || !toDate) return;
        const res = await getInvoiceByDateRange({fromDate: fromDate.toISOString().slice(0, -5), toDate: toDate.toISOString().slice(0, -5)})
        setInvoices(res)
        setLoader(false)
    }
    
    return (
        <section className="h-full flex flex-col bg-slate-300">
            <div className={`p-4 ${invoices ? 'h-min' : 'h-full'}`}>
                <h1 className="w-full">Search For Invoice By Date Range</h1>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={'outline'} className={cn('w-[300px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')} >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, 'PPP') : <span>Select a from date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w=auto p-0">
                        <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            initialFocus 
                        />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={'outline'} className={cn('w-[300px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')} >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, 'PPP') : <span>Select a to date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w=auto p-0">
                        <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            initialFocus 
                        />
                    </PopoverContent>
                </Popover>
                {!loader && fromDate && toDate && <Button onClick={actionHandler} className="w-full mt-4">Click to Find Invoice {' ( crtl + enter )'}</Button>}
                {loader && <Button className="w-full mt-4" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>}
                {invoices && <p className="text-sm">Displaying all invoices from {fromDate?.toDateString()} to {toDate?.toDateString()}.</p>}
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