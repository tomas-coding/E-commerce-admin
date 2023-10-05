import prismadb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import {format} from "date-fns";

const ColorsPage = async ({
    params
}: {
    params: {storeid: string}
}) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeid,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedSizes : ColorColumn[] = colors.map( (item) =>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6"></div>
        <ColorClient data={formattedSizes}/>
    </div> );
}
 
export default ColorsPage;