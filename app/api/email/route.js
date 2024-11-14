import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/models/db";
import EmailModel from "@/lib/config/models/EmailModel";

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

export async function POST(request) {
  const formData = await request.formData();
  const emailData = {
    email: formData.get('email'),
  };

  try {
    await EmailModel.create(emailData);
    return NextResponse.json({ success: true, msg: "Email Subscribed" });
  } catch (error) {
    console.error("Error saving email:", error);
    return NextResponse.json({ success: false, msg: "Failed to subscribe email" });
  }
}


export async function GET(request){
    const emails=await EmailModel.find({});
    return NextResponse.json({emails});
}

export async function DELETE(request){
    const id= await request.nextUrl.searchParams.get("id");
    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({success:true,msg:"Email Delete"})
}