import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import {format} from "date-fns";

const BillboardsPage = async ({
    params
}: {
    params: {storeid: string}
}) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeid,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedBillboards : BillboardColumn[] = billboards.map( (item) =>({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6"></div>
        <BillboardClient data={formattedBillboards}/>
    </div> );
}
 
export default BillboardsPage;