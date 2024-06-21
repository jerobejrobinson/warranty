"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { submitClaimV2 } from "@/app/lib/actions"

const formSchema = z.object({
    vin: z.string(),
    serial: z.string(),
    year: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    make: z.string(),
    model: z.string(),
    install_date: z.date({
        required_error: 'a install date is required'
    }),
    failed_date: z.date({
        required_error: 'a install date is required'
    }),
    mileage_installed: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    mileage_failed: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    symptoms: z.string().min(10, {
        message: 'Must be at least 10 characters.'
    }).max(160, {
        message: 'Must be no longer than 160 characters.'
    }),
    diagnostics: z.string().min(10, {
        message: 'Must be at least 10 characters.'
    }).max(160, {
        message: 'Must be no longer than 160 characters.'
    }),
    labor_hours: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    part_desc: z.string()
})

export default function ClaimForm({ id }: { id: string }) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // Submit invoice and prod along with values from form.
        console.log('active')
        console.log(values)
        // console.log(id.split('~'))
        await submitClaimV2(values, id)
        
    }

    return (
        <ScrollArea className="h-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-white border border-1 rounded m-4">
                    <div>
                        <p className="text-xl font-bold">Fill out form to submit claim</p>
                        <p className="font-light text-sm text-gray-400">* All fields are required</p>    
                    </div>
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div className="flex flex-col xl:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="vin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VIN</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serial"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serial</FormLabel>
                                        <FormControl>
                                            <Input {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col xl:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
                        <div className="flex flex-col xl:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name='mileage_installed'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mileage Installed</FormLabel>
                                        <FormControl>
                                            <Input {...field}  type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='mileage_failed'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mileage Failed</FormLabel>
                                        <FormControl>
                                            <Input {...field}  type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col xl:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="install_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date Installed</FormLabel>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="failed_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date Failed</FormLabel>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="part_desc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name of Part</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ex: Fuel Injector, Fuel Pump..."/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="symptoms"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Describe symptoms with part</FormLabel>
                                    <FormControl>
                                        <Textarea className="resize-none" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name='diagnostics'
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Describe diagnostics tests preformed</FormLabel>
                                    <FormControl>
                                        <Textarea className="resize-none" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField 
                            control={form.control}
                            name='labor_hours'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Labor Hours</FormLabel>
                                    <FormControl>
                                        <Input {...field}  type="number"/>
                                    </FormControl>
                                    <FormDescription>
                                        include original & replacement work orders if filing for labor. * Published Labor Guides from Mitchell and Alldata will be used for all labor hours *
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="ml-auto">Submit</Button>
                </form>
            </Form>
        </ScrollArea>
      )
}