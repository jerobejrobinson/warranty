import { createClient } from '@/app/utils/supabase/server';

export default async function DisplaySupportingDocuments({id}: {id: string;}) {
    const supabase = createClient()
    const { data: getDocs, error } = await supabase.storage.from('claims').list(`${id}/documents`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
    })
    const filterDocs = getDocs?.filter(document => document.name === '.emptyFolderPlaceholder' ? false : true)
    const DocsUrl = filterDocs?.map((document) => {
        const { data } = supabase.storage.from('claims').getPublicUrl(`${id}/documents/${document.name}`)
        return {url: data.publicUrl, name: document.name}
    })
    return (
        <section className="w-full pt-4">
            <h2 className='text-xl font-bold'>Supporting Docs</h2>
            {DocsUrl?.length === 0 && <p>No supporting documents has been uploaded.</p>}
            {DocsUrl?.map((document: any) => (
                <a key={document.name} href={document.url} target="_blank" className="text-blue-500 underline block">{document.name}</a>
            ))}

        </section>
    )
}