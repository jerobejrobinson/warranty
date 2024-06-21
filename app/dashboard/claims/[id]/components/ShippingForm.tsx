"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createShipment } from "@/app/lib/actions"

const formSchema = z.object({
    length: z.string(),
    width: z.string(),
    height: z.string(),
    weight: z.string(),
    drop_off: z.enum(['true', 'false'], {
        required_error: "You need to select a shipping type.",
    })
})

export function ShippingForm({id}: {id: string}) {
    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            drop_off: 'false'
        }
    })
    // 2. Define a submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
         createShipment({...values, id})
    }

    return (
        <div className="space-y-8 border rounded p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="drop_off"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shipping Selection</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row space-x-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="true" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Yes</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="false" />
                                            </FormControl>
                                            <FormLabel className="font-normal">No</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormDescription>Select Yes to drop off at Memphis location, otherwise a shipping label will be sent.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex flex-row space-x-2 items-end">
                        <FormField 
                            control={form.control}
                            name='length'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Package Length</FormLabel>
                                    <FormControl>
                                        <Input placeholder="length" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name='height'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Package Height</FormLabel>
                                    <FormControl>
                                        <Input placeholder="height" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name='width'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Package Width</FormLabel>
                                    <FormControl>
                                        <Input placeholder="width" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name='weight'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Package Weight</FormLabel>
                                    <FormControl>
                                        <Input placeholder="weight" {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Confirm Shipping Input</Button>
                    </div>
                </form>
            </Form>
        </div>
        
    )
}

