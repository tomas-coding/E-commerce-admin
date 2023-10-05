import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: {  productid: string } }
  ) {
    try {
      
  
      if (!params.productid) {
        return new NextResponse("Poduct id is required", { status: 400 });
      }
      
  
      const product = await prismadb.product.findUnique({
        where: {
          id: params.productid,
          
        },
        include:{
          images: true,
          category: true,
          size: true,
          color: true,
        }
      });
    
      return NextResponse.json(product);
    } catch (error) {
      console.log('[PRODUCT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
export async function PATCH(
  req: Request,
  { params }: { params: { storeid: string, productid: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, categoryId, images, colorId, sizeId, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeid,
        userId
      }
    });
    
    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status:403})
    }

     await prismadb.product.update({
      where: {
        id: params.productid,
        
      },
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeid,
        images: {
          deleteMany: {}    
           },
      }
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productid,
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: {url:string}) => image)
            ]
          }
        }
      }

    })
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { productid: string ,storeid: string  } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const product = await prismadb.product.delete({
      where: {
        id: params.productid,
        
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

