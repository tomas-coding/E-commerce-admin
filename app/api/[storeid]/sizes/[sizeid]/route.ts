import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: {  sizeid: string } }
  ) {
    try {
      
  
      if (!params.sizeid) {
        return new NextResponse("Size id is required", { status: 400 });
      }
      
  
      const size = await prismadb.size.findUnique({
        where: {
          id: params.sizeid,
          
        }
      });
    
      return NextResponse.json(size);
    } catch (error) {
      console.log('[SIZE_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string, sizeid: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
        return new NextResponse("Value is required", { status: 400 });
      }

    if (!params.sizeid) {
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeid,
        
      },
      data: {
        name,
        value,
      }
    });
  
    return NextResponse.json(size);
  } catch (error) {
    console.log('SIZE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { sizeid: string ,storeid: string  } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizeid) {
      return new NextResponse("Size is required", { status: 400 });
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

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeid,
        
      }
    });
  
    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

