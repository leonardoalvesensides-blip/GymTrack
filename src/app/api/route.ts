import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "Servidor rodando corretamente na IA Lasy 🚀"
  });
}
