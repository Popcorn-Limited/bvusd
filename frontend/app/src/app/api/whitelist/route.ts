import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email, telegram, evmAddress, newsletter } = await req.json();

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    const { data, error } = await supabase
      .from('Whitelist')
      .insert([
        { email, telegram, evmAddress, newsletter },
      ])
      .select()

      if (error) {
        return NextResponse.json(
          { error: "Supabase error" },
          { status: 422 }
        );
      }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
