"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
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
import { uploadFile, test } from "@/app/lib/actions"
import { useState } from "react"
import { Loader2 } from "lucide-react"
const formSchema = z.object({
    fileList: typeof window === "undefined" ?  z.any() : z.instanceof(FileList).refine((value) => value.length > 0, {
        message: "You need to select a file."
    })
})

export function FileForm({fileType, id}: {fileType: 'img' | 'pdf'; id: string}) {
    const [loader, setLoader] = useState<boolean>(false)
    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })
    // 2. Define a submit handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoader(true)
        const formData = new FormData()
        for(let i = 0; i < values.fileList.length; i++) {
            formData.append(`${i}`, values.fileList[i])
        }
        const res = await fetch(`${id}_${fileType}/api/uploadFile`, {
            method: 'POST',
            body: formData
        }).then(res => {
            return res
        })
        
        setLoader(false)
        console.log(res)
    }

    if(fileType === 'pdf') return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border rounded p-4">
                <FormField
                    control={form.control}
                    name="fileList"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Upload Supporting Documents</FormLabel>
                            <FormControl>
                                <Input 
                                    multiple
                                    type="file" 
                                    {...field} 
                                    accept=".pdf" 
                                    value={value?.fileName}  
                                    onChange={(event) => {
                                        onChange(event.target.files);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>Uploading supporting documents will help when sending your claim to our vendors.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!loader && <Button type="submit" className="!mt-10">Upload Photos</Button>}
                {loader && <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading Photos</Button>}
            </form>
        </Form>
    )
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border rounded p-4">
                <FormField
                    control={form.control}
                    name="fileList"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Upload Photo(s)</FormLabel>
                            <FormControl>
                                <Input
                                    multiple
                                    type="file" 
                                    {...field} 
                                    accept="image/png, image/jpeg, image/jpg"
                                    value={value?.fileName}  
                                    onChange={(event) => {
                                        onChange(event.target.files);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>Uploading photos will help when sending your claim to our vendors.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!loader && <Button type="submit" className="!mt-10">Upload Photos</Button>}
                {loader && <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading Photos</Button>}
            </form>
        </Form>
    )
}

