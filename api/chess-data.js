import { getSupabaseConfig, hasSupabaseConfig, supabaseHeaders } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!hasSupabaseConfig()) {
    return res.status(500).json({
      error: "Missing Supabase env vars",
      required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    });
  }

  const username = String(req.query.username ?? "zaibao1").trim() || "zaibao1";
  const platformRaw = String(req.query.platform ?? "lichess").trim().toLowerCase();
  const platform = platformRaw === "chesscom" ? "chesscom" : "lichess";
  const sourcePattern = platform === "chesscom" ? "*chess.com*" : "*lichess.org*";
  const { url } = getSupabaseConfig();
  const query = new URLSearchParams({
    select: "username,source,pgn,games_count,synced_at",
    username: `eq.${username}`,
    source: `ilike.${sourcePattern}`,
    order: "synced_at.desc",
    limit: "1",
  });
  const readUrl = `${url}/rest/v1/chess_game_snapshots?${query.toString()}`;

  const response = await fetch(readUrl, {
    headers: supabaseHeaders(),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return res.status(500).json({
      error: "Supabase read failed",
      detail,
    });
  }

  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(404).json({ error: "No snapshot found" });
  }

  const row = rows[0];
  return res.status(200).json({
    ok: true,
    username: row.username,
    source: row.source,
    pgn: row.pgn,
    gamesCount: row.games_count,
    syncedAt: row.synced_at,
  });
}
