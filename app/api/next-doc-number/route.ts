import { NextResponse } from "next/server";
import {
  getNextDocNumber,
  type DocKind,
} from "../../dashboard/documents/_lib/numbering";

export const runtime = "nodejs";

const ALLOWED: DocKind[] = ["invoice", "esf", "avr", "reconciliation", "quote"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kindRaw = url.searchParams.get("kind");
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  if (!kindRaw || !ALLOWED.includes(kindRaw as DocKind)) {
    return NextResponse.json({ number: null });
  }
  const number = await getNextDocNumber(kindRaw as DocKind, date);
  return NextResponse.json({ number });
}
