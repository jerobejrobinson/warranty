import ShippingConfirm from "./ShippingConfirm";
import { FileForm } from "./FileForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateRGA } from "./CreateRGA";
import CommentForm from "./CommentForm";
export default function AdminActions({id, claim}: {id: string; claim: any}) {
    return (
        <Tabs defaultValue="Package Details" className="p-4">
            <TabsList>
                {!claim.rga ? <TabsTrigger value="submitClaim">Submit Claim</TabsTrigger> : null}
                <TabsTrigger value="packageDetails">Package Details</TabsTrigger>
                <TabsTrigger value="addPhotos">Add Photos</TabsTrigger>
                <TabsTrigger value="addDocuments">Add Any Supporting Documents</TabsTrigger>
                <TabsTrigger value="addComment">Add Comment</TabsTrigger>
            </TabsList>
            {!claim.rga ? (<TabsContent value="submitClaim" className="px-3">
                <CreateRGA id={id} />
            </TabsContent>): null}
            <TabsContent value="packageDetails" className="px-3">
                {claim.shipment ? null : <p>Awaiting customer to determine shipping method.</p>}
                {claim.shipment && claim.shipment.drop_off && <p>Customer will be dropping off package.</p>}
                {claim.shipment && !claim.shipment.drop_off && claim.shipment.tracking_number ? <p>Rated has been selected.</p> : claim.shipment ? <ShippingConfirm id={id} /> : null}
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