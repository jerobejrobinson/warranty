import { createClient } from '@/app/utils/supabase/server'
import { revalidatePath } from 'next/cache'
type Params = {
    id: string;
}
export async function POST(request: Request, context: { params: Params }) {
    const supabase = createClient()
    const [id, fileType] = context.params.id.split('_')
    const files = Array.from(await request.formData().then(data => data)).map(([key, value]) => (value))
    
    if(fileType === 'img') {
        const res = files.map(async (file) => {
            if(file instanceof File) {
                return await supabase.storage.from('claims').upload(`${id}/images/${file.name}`, file, {
                    cacheControl: '3600',
                    upsert: false
                })
            }
        })

        const data = await Promise.all(res)
        console.log(data)
        return new Response(null, { status: 200 })
    } else {
        const res = await files.map(async (file) => {
            if(file instanceof File) {
                return await supabase.storage.from('claims').upload(`${id}/documents/${file.name}`, file, {
                    cacheControl: '3600',
                    upsert: false
                })
            }
        })

        const data = await Promise.all(res)
        console.log(data)
        revalidatePath(`/dashboard/claims/${id}`)
        return new Response(null, { status: 200 })
    }   
}