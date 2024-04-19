import { createClient } from '@/app/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function Page({ params }: {params: {id: string}}) {
    const supabase = createClient()
    const id = params.id
    const { data, error } = await supabase.from('claim').select('*').eq("id", id).single()

    if(!data) {
        notFound()
    }
    return (
        <main>
            claim page {data.part_number}
        </main>
    );
    }