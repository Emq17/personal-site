import { getSupabaseConfig, hasSupabaseConfig, supabaseHeaders } from "./_supabase.js";

function isValidPgn(text) {
  return typeof text === "string" && /\[Event\s+"/.test(text);
}

function gameCountFromPgn(pgn) {
  return (pgn.match(/\[Event\s+"/g) ?? []).length;
}

function hasEvalData(text) {
  return /\[%eval\s+[^\]\s]+\]/.test(text);
}

async function fetchFirstValidPgn(urls, { requireEval = false } = {}) {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/x-chess-pgn,text/plain;q=0.9,*/*;q=0.8",
          "User-Agent": "emmette-portfolio-chess-sync/1.0",
        },
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!isValidPgn(text)) continue;
      if (requireEval && !hasEvalData(text)) continue;
      return { pgn: text, source: url };
    } catch {
      // try next source
    }
  }
  return { pgn: "", source: "" };
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!hasSupabaseConfig()) {
    return res.status(500).json({
      error: "Missing Supabase env vars",
      required: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    });
  }

  const username = String(req.query.username ?? "zaibao1").trim() || "zaibao1";
  const maxRaw = Number.parseInt(String(req.query.max ?? "220"), 10);
  const max = Number.isFinite(maxRaw) ? Math.min(Math.max(maxRaw, 1), 300) : 220;

  const exportUrl = `https://lichess.org/games/export/${encodeURIComponent(
    username
  )}?moves=true&tags=true&evals=true`;
  const apiUrl = `https://lichess.org/api/games/user/${encodeURIComponent(
    username
  )}?max=${max}&opening=true&moves=true&evals=true&pgnInJson=false&format=pgn`;

  // Prefer eval-rich API payload so quality signals can be computed.
  let { pgn, source } = await fetchFirstValidPgn([apiUrl, exportUrl], { requireEval: true });
  // Fallback to any valid PGN if evals are unavailable.
  if (!pgn) {
    ({ pgn, source } = await fetchFirstValidPgn([apiUrl, exportUrl]));
  }
  if (!pgn) {
    return res.status(502).json({ error: "Unable to fetch valid PGN from Lichess" });
  }

  const { url } = getSupabaseConfig();
  const insertUrl = `${url}/rest/v1/chess_game_snapshots`;
  const payload = [
    {
      username,
      source,
      pgn,
      games_count: gameCountFromPgn(pgn),
      synced_at: new Date().toISOString(),
    },
  ];

  const insertRes = await fetch(insertUrl, {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!insertRes.ok) {
    const detail = await insertRes.text().catch(() => "");
    return res.status(500).json({
      error: "Supabase insert failed",
      detail,
      hint:
        "Create table `chess_game_snapshots` with columns: username text, source text, pgn text, games_count int, synced_at timestamptz.",
    });
  }

  return res.status(200).json({
    ok: true,
    username,
    source,
    gamesCount: gameCountFromPgn(pgn),
    syncedAt: new Date().toISOString(),
    pgn,
  });
}
