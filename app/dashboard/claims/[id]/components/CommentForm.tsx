'use client'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { submitComment } from "@/app/lib/actions"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    comment: z.string(),
})

export default function CommentForm({ id }: { id: string;}) {
    const [loader, setLoader] = useState<boolean>(false)
    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {  
            comment: ''
        }
    })
    // 2. Define a submit handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoader(true)
        await submitComment(values.comment, id)
        setLoader(false)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border rounded p-4">
                <FormField 
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Input 
                                    {...field}
                                    placeholder="Enter your comment"
                                />
                            </FormControl>
                            <FormDescription>Add comments to claim.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                {!loader && <Button type="submit">Submit Comment</Button>}
                {loader && <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Comment</Button>}
            </form>
        </Form>
    );
}