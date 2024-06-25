"use client";
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { updateRgaStatus } from '@/app/lib/actions';
const formSchema = z.object({
  newStatus: z.string()
});

export function UpdateItemStatus({id, rga_id}: {id: string; rga_id: string}) {
    const [loader, setLoader] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newStatus: '',
        },
    });

    const updateStatus = async (values: z.infer<typeof formSchema>) => {
        setLoader(true);
        await updateRgaStatus({id, rga_id, status: values.newStatus})
        setLoader(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(updateStatus)} className="space-y-8 border rounded p-4">
                <FormField
                    control={form.control}
                    name="newStatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Update Claim Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a new status to update claim." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Recieved">Recieved</SelectItem>
                                        <SelectItem value="Sent to vendor for inspection">Sent to vendor for inspection</SelectItem>
                                        <SelectItem value="Claim credited">Claim credited</SelectItem>
                                        <SelectItem value="Claim could not be credited">Claim could not be credited</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!loader && <Button type="submit">Update Claim Status</Button>}
                {loader && <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Comment</Button>}
            </form>
        </Form>
    );
}

export default UpdateItemStatus;
