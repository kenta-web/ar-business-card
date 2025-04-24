"use server";

import { createServerClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

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

// データを保存する関数
async function saveDataToSupabase(cardData: CardData) {
  const supabase = createServerClient();
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

export async function createARCard(formData: FormData) {
  try {
    const name = formData.get("name") || "";
    const company = formData.get("company") || "";
    const position = formData.get("position") || "";
    const twitter = formData.get("twitter") || "";
    const website = formData.get("website") || "";
    const face_url = formData.get("face_url") || "";
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

    return { qrUrl };
  } catch (err: unknown) {
    console.error(err);
    throw new Error((err as Error).message);
  }
}
