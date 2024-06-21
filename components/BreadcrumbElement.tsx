import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export type AnchorList = {
    anchor: string;
    url: string;
}[]

export default async function BreadcrumbElement({obj}: {obj: AnchorList}) {
    return (
        <div className="p-4 bg-blue-400 text-white">
            <Breadcrumb>
                <BreadcrumbList>
                    {obj.map((x, index) => {
                        if(x.anchor === 'seperator') return (
                            <BreadcrumbSeparator key={index} className="text-white"/>
                        )
                        if(obj.length - 1 != index) return (
                            <BreadcrumbItem key={index}>
                                <BreadcrumbLink href={x.url} className="text-white opacity-80">{x.anchor}</BreadcrumbLink>
                            </BreadcrumbItem>
                        ) 

                        return (
                            <BreadcrumbItem key={index}>
                                <BreadcrumbPage className="font-bold text-white">{x.anchor}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>

    );
}