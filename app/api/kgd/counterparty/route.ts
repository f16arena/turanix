import { NextResponse } from "next/server";
import { createClient } from "../../../_lib/supabase/server";
import { runKgdCounterpartyCheck } from "../../../_lib/kgd/client";
import type { KgdTaxpayerKind } from "../../../_lib/kgd/types";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const taxpayerCode = url.searchParams.get("bin")?.replace(/\D/g, "") ?? "";
  const name = url.searchParams.get("name")?.trim() ?? "";
  const taxpayerType = (url.searchParams.get("type") || "UL") as KgdTaxpayerKind;

  if (!/^\d{12}$/.test(taxpayerCode)) {
    return NextResponse.json(
      { error: "BIN/IIN must contain 12 digits" },
      { status: 400 },
    );
  }

  const result = await runKgdCounterpartyCheck({
    taxpayerCode,
    taxpayerType,
    name,
  });

  return NextResponse.json(result);
}
