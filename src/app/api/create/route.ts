import { createServerClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { NextRequest } from "next/server";

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
  face_url: string;
}

export async function POST(req: NextRequest) {
  try {
    const formFields = await req.formData();

    const name = formFields.get("name") || "";
    const company = formFields.get("company") || "";
    const position = formFields.get("position") || "";
    const twitter = formFields.get("twitter") || "";
    const website = formFields.get("website") || "";
    const face_url = formFields.get("face_url") || "";
    const id = uuidv4();
    const cardData: CardData = {
      id,
      name: name as string,
      company: company as string,
      position: position as string,
      twitter: twitter as string,
      website: website as string,
      face_url: face_url as string,
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
