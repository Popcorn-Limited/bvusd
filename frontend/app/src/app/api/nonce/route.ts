import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  const nonce = `Login nonce: ${randomBytes(16).toString('hex')}`;
  return NextResponse.json({ nonce });
}