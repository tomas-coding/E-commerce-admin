import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: {  categoryid: string } }
  ) {
    try {
      
  
      if (!params.categoryid) {
        return new NextResponse("Billboard id is required", { status: 400 });
      }
      
  
      const category = await prismadb.category.findUnique({
        where: {
          id: params.categoryid,
          
        },
        include:{
          billboard:true,
        }

      });
    
      return NextResponse.json(category);
    } catch (error) {
      console.log('[CATEGORY_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string, categoryid: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
        return new NextResponse("Billboard id is required", { status: 400 });
      }

    if (!params.categoryid) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
        where:{
            id: params.storeid,
            userId
        }
    })
    
    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status:403})
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryid,
        
      },
      data: {
        name,
        billboardId
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { categoryid: string ,storeid: string  } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.categoryid) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
        where:{
            id: params.storeid,
            userId
        }
    })
    
    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status:403})
    }

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryid,
        
      }
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

