import BlogModel from "@/lib/config/models/BlogModel";
import { ConnectDB } from "@/lib/config/models/db";
import { writeFile } from 'fs/promises';
import { NextResponse } from "next/server";
const fs= require('fs')
const LoadDB = async () => {
    await ConnectDB();
};

// Ensure database connection is established before handling requests
LoadDB();

export async function GET(request) {
   
    const blogId=request.nextUrl.searchParams.get("id")
    if(blogId){
        const blog=await BlogModel.findById(blogId)
        return NextResponse.json(blog)
    }
    else{
        const blogs=await BlogModel.find({})
        return NextResponse.json({blogs});
    }
   
}

export async function POST(request) {
    try {
        // Parse form data
        const formData = await request.formData();
        const timestamp = Date.now();
        const image = formData.get('image');

        if (!image || !(image instanceof Blob)) {
            return NextResponse.json({ error: 'No valid image uploaded' }, { status: 400 });
        }

        // Get image data
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);

        // Construct file path and write file
        const path = `./public/${timestamp}_${image.name}`;
        await writeFile(path, buffer);

        // Construct image URL
        const imgUrl = `/${timestamp}_${image.name}`;

        // Prepare blog data
        const blogData = {
            title: `${formData.get('title')}`,
            description: `${formData.get('description')}`,
            category: `${formData.get('category')}`,
            author: `${formData.get('author')}`,
            image:`${ imgUrl}`, // Use the actual URL for the image
            authorImg: `${formData.get('authorImg')}`,
        };

        // Save blog data to the database
        await BlogModel.create(blogData);
        console.log("Blog saved");

        // Return success response
        return NextResponse.json({ success: true, msg: "Blog Added", imgUrl });
    } catch (error) {
        console.error('Error processing image or saving blog:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get('id')
    const blog= await BlogModel.findById(id)
    fs.unlink(`./public${blog.image}`,()=>{})
    await BlogModel.findByIdAndDelete(id)
    return NextResponse.json({msg:"Blog Deleted"})

}
