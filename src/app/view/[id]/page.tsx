// app/view/[id]/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import ViewARClient from "./ClientAR"; // クライアント側のAR部分

export default async function ViewPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) return <div>Not found</div>;

  return <ViewARClient data={data} />;
}
