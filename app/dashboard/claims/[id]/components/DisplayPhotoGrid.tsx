import { createClient } from '@/app/utils/supabase/server';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
export default async function DisplayPhotoGrid({id}: {id: string;}) {
    const supabase = createClient()
    const { data: getPhotos, error } = await supabase.storage.from('claims').list(`${id}/images`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
    })
    const filterPhotos = getPhotos?.filter(photo => photo.name === '.emptyFolderPlaceholder' ? false : true)
    const photosUrl = filterPhotos?.map((photo) => {
        const { data } = supabase.storage.from('claims').getPublicUrl(`${id}/images/${photo.name}`)
        return data.publicUrl
    })
    return (
        <section className="w-full pt-4">
            <h2 className='text-xl font-bold'>Photos</h2>
            {photosUrl?.length === 0 && <p>No photos has been uploaded.</p>}
            {photosUrl?.length != 0  && <Carousel
                className="w-full p-4  border rounded"
            >
                <CarouselContent>
                    {photosUrl?.map((photo: string) => (
                        <CarouselItem key={photo}  className="md:basis-1/2 lg:basis-1/3 h-72">
                            <img src={photo} alt="photo" className="w-full h-full object-contain"/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>}
        </section>
    )
}