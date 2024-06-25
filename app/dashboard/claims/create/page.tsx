import SearchByPart from "@/components/SearchByPart"
import SearchByDate from "@/components/SearchByDate"
import ClaimForm from "@/components/ClaimForm"

export const maxDuration = 60;

export default function page({
    searchParams
}: {
    searchParams: { [key: string]: string | undefined}
}) {
    
    if(searchParams.type === 'part-search') {
        if( searchParams.id != undefined ) return ( <ClaimForm id={searchParams.id} /> )
        return ( <SearchByPart /> )
    }
    
    if(searchParams.type === 'date-range') {
        if( searchParams.id != undefined ) return ( <ClaimForm id={searchParams.id} /> )
        return ( <SearchByDate />)
    }

    return (
        <div>
            invalid select search option
        </div>
    )
}