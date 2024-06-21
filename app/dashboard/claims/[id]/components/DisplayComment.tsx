import { createClient } from '@/app/utils/supabase/server';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function DisplayComment({id}: {id: string;}) {
    const supabase = createClient()
    const { data, error} = await supabase.from('comment').select('id, comment, created_at, profiles ( first_name, last_name, role )').eq('claim_id', id)
    return (
        <section className='w-full pt-4'>
            <h2 className='text-xl font-bold'>Comments</h2>
            <Table>
                <TableCaption>End of Claim Comments.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Created At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((comment: any) => (
                        <TableRow key={comment.id}>
                            <TableCell>{comment.comment}</TableCell>
                            <TableCell>{comment.profiles.role === 'customer' ? (<span>{comment.profiles.first_name} {comment.profiles.last_name}</span>) : (<span className='font-bold'>{comment.profiles.first_name}</span>)}</TableCell>
                            <TableCell>{comment.created_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    ) 
}