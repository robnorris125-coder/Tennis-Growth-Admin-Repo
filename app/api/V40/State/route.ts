import { NextResponse } from "next/server";
import { createSupabaseServerClient, requireSupabaseUser } from "../../../../lib/supabase/server";

const JOURNEY = "v40_state";

export async function GET() {
  const user = await requireSupabaseUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("assessments")
    .select("id,payload,updated_at")
    .eq("user_id", user.id)
    .eq("journey", JOURNEY)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    state: data?.payload ?? null,
  });
}

export async function POST(request: Request) {
  const user = await requireSupabaseUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const payload = await request.json();
  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("assessments")
    .select("id")
    .eq("user_id", user.id)
    .eq("journey", JOURNEY)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("assessments")
      .update({
        payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("assessments")
      .insert({
        user_id: user.id,
        journey: JOURNEY,
        role: "tennis_growth_user",
        status: "in_progress",
        title: "Tennis Growth V40 state",
        payload,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}