import { NextResponse } from "next/server";

export async function GET() {
  const target = process.env.WHATSAPP_GROUP_URL;
  if (!target) {
    return NextResponse.redirect(new URL("/", "https://tecmonterreyquantsociety.com"));
  }
  return NextResponse.redirect(target);
}
