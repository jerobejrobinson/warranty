import { ShippingForm } from "./ShippingForm"
import { FileForm } from "./FileForm"
import CommentForm from "./CommentForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export default function UserActions({id, claim}: {id: string; claim: any}) {
    return (
        <Tabs defaultValue="addPhotos" className="p-4">
            <TabsList>
                {claim.rga ? <TabsTrigger value="packageDetails">Submit Package Details</TabsTrigger> : null}
                <TabsTrigger value="addPhotos">Add Photos</TabsTrigger>
                <TabsTrigger value="addDocuments">Add Any Supporting Documents</TabsTrigger>
                <TabsTrigger value="addComment">Add Comment</TabsTrigger>
            </TabsList>
            <TabsContent value="packageDetails" className="px-3">
                {claim.shipment && claim.rga ? <p>Package details and arrival method has been sent to MSP.</p> : <ShippingForm id={id} rga_id={claim.rga.id}/>}
            </TabsContent>
            <TabsContent value="addPhotos" className="px-3">
                <FileForm fileType="img" id={id}/>
            </TabsContent>
            <TabsContent value="addDocuments" className="px-3">
                <FileForm fileType="pdf" id={id}/>
            </TabsContent>
            <TabsContent value="addComment" className="px-3">
                <CommentForm id={id}/>
            </TabsContent>
        </Tabs>
    )
}