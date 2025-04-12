// import { createClient } from "@supabase/supabase-js";
// import { v4 as uuidv4 } from "uuid";
// import QRCode from "qrcode";
import { NextRequest } from "next/server";
import { Readable } from "stream";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import fs from "fs";
import { promisify } from "util";
// import path from "path";

export const dynamic = "force-dynamic"; // App Router用設定
export const runtime = "nodejs";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

export async function POST(req: NextRequest) {
  const webStream = req.body;
  const reqStream = Readable.fromWeb(webStream as any) as IncomingMessage;

  const form = new IncomingForm({ keepExtensions: true });
  const parseForm = promisify(form.parse);

  try {
    const formFields = await parseForm(reqStream);

    const name = formFields.name?.[0] || "";
    const company = formFields.company?.[0] || "";
    const position = formFields.position?.[0] || "";
    const twitter = formFields.twitter?.[0] || "";
    const website = formFields.website?.[0] || "";
    const face = formFields.face;

    return new Response(
      JSON.stringify({
        formFields,
        name,
        company,
        position,
        twitter,
        website,
        face,
      }),
      {
        status: 200,
      }
    );

    const id = uuidv4();
    const filePath = face[0].filepath;
    const content = fs.readFileSync(filePath);

    const uploadRes = await supabase.storage
      .from("faces")
      .upload(`${id}.jpg`, content, {
        contentType: face[0].mimetype || "image/jpeg",
      });

    if (uploadRes.error) {
      return new Response(JSON.stringify({ error: uploadRes.error.message }), {
        status: 500,
      });
    }

    const publicURL = supabase.storage.from("faces").getPublicUrl(`${id}.jpg`)
      .data.publicUrl;

    const insertRes = await supabase.from("cards").insert({
      id,
      name,
      company,
      position,
      twitter,
      website,
      face_url: publicURL,
    });

    if (insertRes.error) {
      return new Response(JSON.stringify({ error: insertRes.error.message }), {
        status: 500,
      });
    }

    const viewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${id}`;
    const qrUrl = await QRCode.toDataURL(viewUrl);

    return new Response(JSON.stringify({ qrUrl }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
