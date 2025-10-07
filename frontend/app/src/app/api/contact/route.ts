import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { name, email, telegram, amount, assets, newsletter } = await req.json();
    const assetsArray = Object.keys(assets).filter(key => assets[key]).join(', ');

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    const { data, error } = await supabase
      .from('Instititutional')
      .insert([
        { name, email, telegram, amount, assets: assetsArray, newsletter },
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
