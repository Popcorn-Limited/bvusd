import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const BLOCKED = new Set(['US'])

export const config = { matcher: ['/(.*)'] }

export default function geoBlock(req: NextRequest) {
  const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || null;

  if (BLOCKED.has(country)) {
    return new NextResponse(
      `<!doctype html><html><head><meta charset="utf-8" />
       <title>Unavailable For Legal Reasons</title>
       <meta name="robots" content="noindex" />
       </head><body><h1>Content is not available in your country.</h1></body></html>`,
      {
        status: 451,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      }
    )
  }

  return NextResponse.next()
}
