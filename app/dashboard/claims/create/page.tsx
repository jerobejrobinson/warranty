import SearchByPart from "@/components/SearchByPart"
import ClaimForm from "@/components/ClaimForm"
export default function page({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined}
}) {
    
    if(searchParams.type === 'part-search') {
        console.log(searchParams)
        if( searchParams.id != undefined ) return ( <ClaimForm id={searchParams.id} /> )
        return ( <SearchByPart /> )
    }

    return (
        <div>
            invalid select search option
        </div>
    )
}