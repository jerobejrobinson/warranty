"use client"
import { Button } from "@/components/ui/button"
import { createRGA } from "@/app/lib/actions"
import { useState } from "react"
import { Loader2 } from "lucide-react"
export function CreateRGA({id}: {id: string}) {
    const [loader, setLoader] = useState(false)
    return (
        <> 
            {!loader && <Button onClick={async () => {
                setLoader(true)
                createRGA(id)
            }}>Generates RGA number for claim</Button>}
            {loader && <Button><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating RGA</Button>}
        </>
    )
}