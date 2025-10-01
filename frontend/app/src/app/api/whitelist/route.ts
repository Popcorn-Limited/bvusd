import { FORMSPREE } from "@/src/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, telegram, evmAddress, newsletter } = await req.json();

    const form = new FormData();
    form.append("type", "whitelist");
    if (email) form.append("email", email);
    if (telegram) form.append("telegram", telegram);
    if (evmAddress) form.append("evmAddress", evmAddress);
    if (newsletter) form.append("newsletter", newsletter);

    const upstream = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok || data?.ok === false) {
      return NextResponse.json(
        { error: "Formspree error" },
        { status: upstream.status || 422 }
      );
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
