import { createServerClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { NextRequest } from "next/server";
// import { Readable } from "stream";
// import { IncomingForm } from "formidable";
// import { IncomingMessage } from "http";
// import fs from "fs";
// import { promisify } from "util";
// import path from "path";

export const dynamic = "force-dynamic"; // App Router用設定
export const runtime = "nodejs";

const supabase = createServerClient();

// カードデータの型定義
interface CardData {
  id: string;
  name: string;
  company: string;
  position: string;
  twitter: string;
  website: string;
}

export async function POST(req: NextRequest) {
  try {
    const formFields = await req.formData();

    const name = formFields.get("name") || "";
    const company = formFields.get("company") || "";
    const position = formFields.get("position") || "";
    const twitter = formFields.get("twitter") || "";
    const website = formFields.get("website") || "";

    const id = uuidv4();
    const cardData: CardData = {
      id,
      name: name as string,
      company: company as string,
      position: position as string,
      twitter: twitter as string,
      website: website as string,
    };

    // データを保存
    await saveDataToSupabase(cardData);
    // QRコードを生成
    const qrUrl = await makeQRCode(id);

    return new Response(JSON.stringify({ qrUrl }), { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
    });
  }
}

// データを保存する関数
async function saveDataToSupabase(cardData: CardData) {
  const insertRes = await supabase.from("cards").insert(cardData);

  if (insertRes.error) {
    throw new Error(insertRes.error.message);
  }
}

// QRコードを生成する関数
async function makeQRCode(id: string): Promise<string> {
  const viewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${id}`;
  return await QRCode.toDataURL(viewUrl);
}
