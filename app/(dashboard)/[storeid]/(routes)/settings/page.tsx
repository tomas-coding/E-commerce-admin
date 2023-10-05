import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { SettingsForm } from "./components/settings-form";



interface SettingsPageProps{
    params: {
        storeid: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const {userId} = auth();
    if (!userId) {
        redirect("/sign-in")
    }
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeid,
            userId
        }
    })
    if (!store){
        redirect("/")
    }
    return ( 
    <div>
        <SettingsForm initialData={store}/>
    </div> );
}
 
export default SettingsPage;