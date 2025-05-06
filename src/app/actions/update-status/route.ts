import { updateStatusAction } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  await updateStatusAction(formData);
  return NextResponse.json({ success: true });
}
