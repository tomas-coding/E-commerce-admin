import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";
import {format} from "date-fns";

const SizesPage = async ({
    params
}: {
    params: {storeid: string}
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeid,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedSizes : SizeColumn[] = sizes.map( (item) =>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6"></div>
        <SizeClient data={formattedSizes}/>
    </div> );
}
 
export default SizesPage;