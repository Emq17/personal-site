import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { hobbyBySlug } from "../components/hobbies/content/HobbiesData";

type ParsedChessGame = {
  date: Date | null;
  white: string;
  black: string;
  result: string;
  whiteElo: number | null;
  blackElo: number | null;
  eco: string;
  timeControl: string;
  termination: string;
  plyCount: number;
  moveCount: number;
  annotationBestMoves: number;
  annotationExcellentMoves: number;
  annotationGoodMoves: number;
  annotationBookMoves: number;
  annotationBlunders: number;
  annotationMistakes: number;
  annotationInaccuracies: number;
  annotationBrilliants: number;
  annotationMissedWins: number;
  blackBestMoves: number;
  blackExcellentMoves: number;
  blackGoodMoves: number;
  blackBookMoves: number;
  blackBlunders: number;
  blackMistakes: number;
  blackInaccuracies: number;
  blackBrilliants: number;
  blackMissedWins: number;
  whiteSignalSource: SignalQualitySource;
  blackSignalSource: SignalQualitySource;
};

type PlayerChessGame = {
  date: Date | null;
  myAccount: string;
  myColor: "White" | "Black";
  myResult: "win" | "draw" | "loss" | "unknown";
  myRating: number | null;
  oppRating: number | null;
  oppName: string;
  eco: string;
  timeControl: string;
  termination: string;
  moveCount: number;
  annotationBestMoves: number;
  annotationExcellentMoves: number;
  annotationGoodMoves: number;
  annotationBookMoves: number;
  annotationBlunders: number;
  annotationMistakes: number;
  annotationInaccuracies: number;
  annotationBrilliants: number;
  annotationMissedWins: number;
  signalSource: SignalQualitySource;
};
type OverviewGameRow = PlayerChessGame & { gameNumber: number };
type OverviewStats = {
  totalGames: number;
  scoredCount: number;
  wins: number;
  draws: number;
  losses: number;
  winPct: number;
  drawPct: number;
  lossPct: number;
  scorePct: number;
  avgOpp: number | null;
  avgOppWin: number | null;
  avgOppLoss: number | null;
  avgOppDraw: number | null;
  bestWin: OverviewGameRow | null;
  bestStreak: number;
  bestStreakEnd: OverviewGameRow | null;
};

type SignalQualitySource = "exact" | "estimated" | "none";

type MoveSignalCounts = {
  brilliants: number;
  bestMoves: number;
  excellentMoves: number;
  goodMoves: number;
  bookMoves: number;
  inaccuracies: number;
  mistakes: number;
  blunders: number;
  missedWins: number;
};

type SignalRow = { game: string; gameNumber: number; myMoves: number } & MoveSignalCounts;
type SignalRowWithSource = SignalRow & { source: SignalQualitySource };

type ChessSummary = {
  player: string;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  overallScoreRate: number;
  whiteGames: number;
  blackGames: number;
  whiteWinRate: number;
  blackWinRate: number;
  avgOpponent: number | null;
  ratingSeries: Array<{ label: string; rating: number }>;
  openingRows: Array<{ eco: string; games: number; winRate: number }>;
  openingTypeRows: Array<{ label: string; games: number; winRate: number }>;
  gameResults: Array<"W" | "D" | "L">;
  signalRows: SignalRowWithSource[];
  totalBestMoves: number;
  totalExcellentMoves: number;
  totalGoodMoves: number;
  totalBookMoves: number;
  totalBlunders: number;
  totalMistakes: number;
  totalInaccuracies: number;
  totalBrilliants: number;
  totalMissedWins: number;
  avgBlundersPerGame: number;
  avgMovesPerGame: number;
  avgBaseMinutesPerGame: number | null;
  avgBaseMinutesInWins: number | null;
  avgBaseMinutesInLosses: number | null;
  avgMovesInWins: number | null;
  avgMovesInDraws: number | null;
  avgMovesInLosses: number | null;
  timeForfeits: number;
  timeForfeitRate: number;
  myTimeForfeits: number;
  opponentTimeForfeits: number;
  insights: string[];
};

type CoachReport = {
  title: string;
  summary: string;
  focus: string;
  quickFixes: string[];
  checklist: string[];
  secretInsights: string[];
  visuals: Array<{ label: string; value: number; hint: string }>;
};

type ChessSourcePlatform = "lichess" | "chesscom";
type ChessPlatform = ChessSourcePlatform | "all";
type OverviewWindow = "7d" | "30d" | "90d" | "1y" | "all";
type OverviewColorFilter = "all" | "white" | "black";
type MusicDiscipline = "drums" | "guitar" | "bass" | "vocals" | "produced";

const WINDOW_OPTIONS = [1, 2, 3, 4, 5, 10, 20, 30, 50];
const CHESS_USERS: Record<ChessSourcePlatform, string> = {
  lichess: "zaibao1",
  chesscom: "zaibao2",
};
const CHESS_PLATFORM_LABEL: Record<ChessPlatform, string> = {
  all: "All Accounts",
  lichess: "Lichess",
  chesscom: "Chess.com",
};
const CHESS_SOURCE_PLATFORMS: ChessSourcePlatform[] = ["lichess", "chesscom"];
const OVERVIEW_WINDOWS: Array<{ value: OverviewWindow; label: string; days: number | null }> = [
  { value: "7d", label: "7 days", days: 7 },
  { value: "30d", label: "30 days", days: 30 },
  { value: "90d", label: "90 days", days: 90 },
  { value: "1y", label: "1 year", days: 365 },
  { value: "all", label: "All Time", days: null },
];
const MUSIC_DISCIPLINE_VIEWS: Array<{
  key: MusicDiscipline;
  label: string;
  subtitle: string;
  bullets: string[];
}> = [
  {
    key: "drums",
    label: "Drums",
    subtitle: "Rhythm and timing foundation.",
    bullets: [
      "Practice focus: pocket, groove consistency, and dynamic control.",
      "Current priority: cleaner fills that resolve back into time.",
      "Improvement lens: precision under tempo changes.",
    ],
  },
  {
    key: "guitar",
    label: "Guitar",
    subtitle: "Harmony and melodic phrasing.",
    bullets: [
      "Practice focus: chord transitions, voicings, and clean articulation.",
      "Current priority: phrasing with stronger timing discipline.",
      "Improvement lens: cleaner tone with fewer wasted movements.",
    ],
  },
  {
    key: "bass",
    label: "Bass",
    subtitle: "Low-end control and groove locking.",
    bullets: [
      "Practice focus: locking with kick patterns and note duration.",
      "Current priority: tighter finger economy and consistency.",
      "Improvement lens: supportive lines that improve song feel.",
    ],
  },
  {
    key: "vocals",
    label: "Vocals",
    subtitle: "Pitch, breath, and delivery.",
    bullets: [
      "Practice focus: breath support and pitch stability.",
      "Current priority: cleaner transitions between registers.",
      "Improvement lens: clarity and control over longer phrases.",
    ],
  },
  {
    key: "produced",
    label: "Produced",
    subtitle: "Songs produced and arranged.",
    bullets: [
      "Focus: songwriting structure, arrangement, and mix decisions.",
      "Current priority: tighter intros/transitions and vocal placement.",
      "Improvement lens: faster iteration from demo to finished track.",
    ],
  },
];

const EMPTY_MOVE_SIGNAL_COUNTS: MoveSignalCounts = {
  brilliants: 0,
  bestMoves: 0,
  excellentMoves: 0,
  goodMoves: 0,
  bookMoves: 0,
  inaccuracies: 0,
  mistakes: 0,
  blunders: 0,
  missedWins: 0,
};

function HoverHelp({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center group align-middle">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-[10px] text-cyan-100">
        i
      </span>
      <span className="pointer-events-none absolute z-20 left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-md border border-white/15 bg-[#0b1320] px-2 py-1.5 text-[11px] text-white/80 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

function openingTypeFromEco(eco: string) {
  const letter = eco.charAt(0).toUpperCase();
  if (letter === "A") return "Flank / Irregular";
  if (letter === "B") return "Semi-Open / Indian";
  if (letter === "C") return "Open Games / French";
  if (letter === "D") return "Closed / Queen's Pawn";
  if (letter === "E") return "Indian Defenses";
  return "Mixed";
}

function openingMoveHint(label: string) {
  if (label === "Flank / Irregular") {
    return "Flexible flank starts (like 1.c4, 1.Nf3, or irregular setups) that often lead to less scripted middlegames.";
  }
  if (label === "Semi-Open / Indian") {
    return "Typically 1.e4 responses other than ...e5, or Indian structures with asymmetry and tactical counterplay.";
  }
  if (label === "Open Games / French") {
    return "Usually 1.e4 e5 families and French structures where central tension and early piece activity matter.";
  }
  if (label === "Closed / Queen's Pawn") {
    return "Queen's pawn systems with slower structure fights, pawn breaks, and long-term planning.";
  }
  if (label === "Indian Defenses") {
    return "King's Indian / Nimzo / related setups with dynamic imbalance and timing-based pawn breaks.";
  }
  return "Mixed opening family from your games.";
}

function hasLichessSignalTags(text: string) {
  return (
    /(?:\?\?|\?!|!!|!\?|\$1|\$2|\$3|\$4|\$6)(?=\s|$)/.test(text) ||
    /\{[^}]*\b(?:blunder|mistake|inaccuracy|brilliant|excellent|best|book|good move|missed win)\b[^}]*\}/i.test(
      text
    )
  );
}

function hasLichessAnalysisData(text: string) {
  return /\[%eval\s+[^\]\s]+\]/.test(text) || hasLichessSignalTags(text);
}

function parseEvalToken(token: string) {
  if (!token) return null;
  if (token.startsWith("#")) return token.startsWith("#-") ? -10 : 10;
  const n = Number.parseFloat(token);
  return Number.isFinite(n) ? n : null;
}

function countMovePlies(movesText: string) {
  const normalized = movesText
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[%[^\]]+\]/g, " ")
    .replace(/\d+\.(\.\.)?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = normalized ? normalized.split(" ") : [];
  return tokens.filter((token) => {
    if (!token) return false;
    if (token === "*" || token === "1-0" || token === "0-1" || token === "1/2-1/2") return false;
    if (/^\$\d+$/.test(token)) return false;
    if (/^(?:\?\?|\?|!!|!\?|\?!|!)$/.test(token)) return false;
    return true;
  }).length;
}

function parseTimeControlBaseMinutes(timeControl: string) {
  const base = Number.parseInt(String(timeControl ?? "").split("+")[0] ?? "", 10);
  if (!Number.isFinite(base) || base <= 0) return null;
  return base / 60;
}

function formatShortDate(date: Date | null) {
  if (!date) return "Unknown";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatLocalYmd(date: Date | null) {
  if (!date) return "Unknown";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatShortTime(date: Date | null) {
  if (!date) return "Unknown time";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function percentOf(value: number, total: number) {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

function accountToPlatformLabel(account: string) {
  const source = CHESS_SOURCE_PLATFORMS.find((platform) => CHESS_USERS[platform] === account);
  if (!source) return "Linked account";
  return CHESS_PLATFORM_LABEL[source];
}

async function fetchChessComPgnDirect(username: string, maxGames = 220) {
  const archivesRes = await fetch(
    `https://api.chess.com/pub/player/${encodeURIComponent(username)}/games/archives`,
    { headers: { Accept: "application/json" } }
  );
  if (!archivesRes.ok) throw new Error("archives");
  const archivesData = await archivesRes.json();
  const archiveUrls = Array.isArray(archivesData?.archives) ? archivesData.archives : [];
  const urls = [...archiveUrls].reverse();
  const chunks: string[] = [];

  for (const url of urls) {
    if (chunks.length >= maxGames) break;
    const monthRes = await fetch(url, { headers: { Accept: "application/json" } });
    if (!monthRes.ok) continue;
    const monthData = await monthRes.json();
    const games = Array.isArray(monthData?.games) ? monthData.games : [];
    for (const game of [...games].reverse()) {
      const pgn = typeof game?.pgn === "string" ? game.pgn.trim() : "";
      if (!pgn || !/\[Event\s+"/.test(pgn)) continue;
      chunks.push(pgn);
      if (chunks.length >= maxGames) break;
    }
  }

  return chunks.join("\n\n");
}

function parseMoveQualityFromAnnotations(movesText: string) {
  const normalized = movesText.replace(/\([^)]*\)/g, " ").replace(/\[%[^\]]+\]/g, " ");
  const tokens = normalized.match(/\{[^}]*\}|[^\s]+/g) ?? [];

  let whiteBlunders = 0;
  let whiteMistakes = 0;
  let whiteInaccuracies = 0;
  let whiteBrilliants = 0;
  let whiteBestMoves = 0;
  let whiteExcellentMoves = 0;
  let whiteGoodMoves = 0;
  let whiteBookMoves = 0;
  let whiteMissedWins = 0;
  let blackBlunders = 0;
  let blackMistakes = 0;
  let blackInaccuracies = 0;
  let blackBrilliants = 0;
  let blackBestMoves = 0;
  let blackExcellentMoves = 0;
  let blackGoodMoves = 0;
  let blackBookMoves = 0;
  let blackMissedWins = 0;

  const add = (
    side: "white" | "black",
    kind:
      | "blunder"
      | "mistake"
      | "inaccuracy"
      | "brilliant"
      | "best"
      | "excellent"
      | "good"
      | "book"
      | "missedWin"
  ) => {
    if (side === "white") {
      if (kind === "blunder") whiteBlunders += 1;
      if (kind === "mistake") whiteMistakes += 1;
      if (kind === "inaccuracy") whiteInaccuracies += 1;
      if (kind === "brilliant") whiteBrilliants += 1;
      if (kind === "best") whiteBestMoves += 1;
      if (kind === "excellent") whiteExcellentMoves += 1;
      if (kind === "good") whiteGoodMoves += 1;
      if (kind === "book") whiteBookMoves += 1;
      if (kind === "missedWin") whiteMissedWins += 1;
    } else {
      if (kind === "blunder") blackBlunders += 1;
      if (kind === "mistake") blackMistakes += 1;
      if (kind === "inaccuracy") blackInaccuracies += 1;
      if (kind === "brilliant") blackBrilliants += 1;
      if (kind === "best") blackBestMoves += 1;
      if (kind === "excellent") blackExcellentMoves += 1;
      if (kind === "good") blackGoodMoves += 1;
      if (kind === "book") blackBookMoves += 1;
      if (kind === "missedWin") blackMissedWins += 1;
    }
  };

  const applyGlyph = (side: "white" | "black" | null, glyph: string) => {
    if (!side) return;
    if (glyph === "??") add(side, "blunder");
    else if (glyph === "?") add(side, "mistake");
    else if (glyph === "?!" || glyph === "!?") add(side, "inaccuracy");
    else if (glyph === "!!") add(side, "brilliant");
    else if (glyph === "!") add(side, "good");
  };

  const applyNag = (side: "white" | "black" | null, nag: string) => {
    if (!side) return;
    // Common NAG mapping used in annotated PGN.
    if (nag === "$4") add(side, "blunder");
    else if (nag === "$2") add(side, "mistake");
    else if (nag === "$6") add(side, "inaccuracy");
    else if (nag === "$3") add(side, "brilliant");
    else if (nag === "$1") add(side, "good");
  };

  let side: "white" | "black" = "white";
  let lastSide: "white" | "black" | null = null;

  for (const token of tokens) {
    if (!token || token === "*" || token === "1-0" || token === "0-1" || token === "1/2-1/2") continue;

    if (token.startsWith("{") && token.endsWith("}")) {
      const comment = token.slice(1, -1).toLowerCase();
      if (!lastSide) continue;
      if (comment.includes("missed win")) add(lastSide, "missedWin");
      else if (comment.includes("blunder")) add(lastSide, "blunder");
      else if (comment.includes("mistake")) add(lastSide, "mistake");
      else if (comment.includes("inaccuracy")) add(lastSide, "inaccuracy");
      else if (comment.includes("brilliant")) add(lastSide, "brilliant");
      else if (comment.includes("excellent")) add(lastSide, "excellent");
      else if (comment.includes("book")) add(lastSide, "book");
      else if (/\bbest\b/.test(comment)) add(lastSide, "best");
      else if (comment.includes("good move") || comment.startsWith("good")) add(lastSide, "good");
      continue;
    }

    let moveToken = token;
    const prefixedMove = moveToken.match(/^\d+\.(\.\.)?(.*)$/);
    if (prefixedMove) {
      moveToken = (prefixedMove[2] ?? "").trim();
      if (!moveToken) continue;
    }
    if (/^\d+\.(\.\.)?$/.test(moveToken)) continue;

    if (/^\$\d+$/.test(moveToken)) {
      applyNag(lastSide, moveToken);
      continue;
    }
    if (/^(?:\?\?|\?|!!|!\?|\?!|!)$/.test(moveToken)) {
      applyGlyph(lastSide, moveToken);
      continue;
    }

    const suffix = moveToken.match(/(\?\?|\?!|\?|!!|!\?)$/)?.[1] ?? "";
    if (suffix) applyGlyph(side, suffix);

    lastSide = side;
    side = side === "white" ? "black" : "white";
  }

  return {
    whiteBlunders,
    whiteMistakes,
    whiteInaccuracies,
    whiteBestMoves,
    whiteExcellentMoves,
    whiteGoodMoves,
    whiteBookMoves,
    blackBlunders,
    blackMistakes,
    blackInaccuracies,
    blackBestMoves,
    blackExcellentMoves,
    blackGoodMoves,
    blackBookMoves,
    whiteBrilliants,
    blackBrilliants,
    whiteMissedWins,
    blackMissedWins,
  };
}

function parseMoveQualityFromEvals(movesText: string) {
  const evalMatches = [...movesText.matchAll(/\[%eval\s+([^\]\s]+)\]/g)];
  const evals = evalMatches
    .map((m) => parseEvalToken(m[1] ?? ""))
    .filter((n): n is number => typeof n === "number");

  let whiteBlunders = 0;
  let whiteMistakes = 0;
  let whiteInaccuracies = 0;
  const whiteBestMoves = 0;
  const whiteExcellentMoves = 0;
  const whiteGoodMoves = 0;
  const whiteBookMoves = 0;
  let blackBlunders = 0;
  let blackMistakes = 0;
  let blackInaccuracies = 0;
  const blackBestMoves = 0;
  const blackExcellentMoves = 0;
  const blackGoodMoves = 0;
  const blackBookMoves = 0;
  const whiteBrilliants = 0;
  const blackBrilliants = 0;
  const whiteMissedWins = 0;
  const blackMissedWins = 0;

  for (let i = 1; i < evals.length; i += 1) {
    const prev = evals[i - 1];
    const curr = evals[i];
    const mover = i % 2 === 0 ? "white" : "black";
    const prevPerspective = mover === "white" ? prev : -prev;
    const currPerspective = mover === "white" ? curr : -curr;
    const swing = currPerspective - prevPerspective;

    if (swing <= -2.0) {
      if (mover === "white") whiteBlunders += 1;
      else blackBlunders += 1;
    } else if (swing <= -1.0) {
      if (mover === "white") whiteMistakes += 1;
      else blackMistakes += 1;
    } else if (swing <= -0.5) {
      if (mover === "white") whiteInaccuracies += 1;
      else blackInaccuracies += 1;
    }
  }

  return {
    hasEvalData: evals.length >= 2,
    whiteBlunders,
    whiteMistakes,
    whiteInaccuracies,
    whiteBestMoves,
    whiteExcellentMoves,
    whiteGoodMoves,
    whiteBookMoves,
    blackBlunders,
    blackMistakes,
    blackInaccuracies,
    blackBestMoves,
    blackExcellentMoves,
    blackGoodMoves,
    blackBookMoves,
    whiteBrilliants,
    blackBrilliants,
    whiteMissedWins,
    blackMissedWins,
  };
}

function parsePgnHeaders(pgnText: string): ParsedChessGame[] {
  const chunks = pgnText
    .split(/\r?\n\r?\n(?=\[Event\s)/)
    .map((c) => c.trim())
    .filter(Boolean);

  const headerValue = (chunk: string, key: string) => {
    const match = chunk.match(new RegExp(`\\[${key}\\s+"([^"]*)"\\]`));
    return match?.[1] ?? "";
  };

  return chunks.map((chunk) => {
    const dateRaw = headerValue(chunk, "Date");
    const utcTimeRaw = headerValue(chunk, "UTCTime");
    const normalizedDate = dateRaw ? dateRaw.replace(/\./g, "-") : "";
    const hasFullDate = normalizedDate && !normalizedDate.includes("?");
    const hasFullTime = utcTimeRaw && !utcTimeRaw.includes("?");
    const parsedDateFromDateTime =
      hasFullDate && hasFullTime
        ? new Date(`${normalizedDate}T${utcTimeRaw}Z`)
        : null;
    const parsedDateFromDateOnly = hasFullDate ? new Date(normalizedDate) : null;
    const parsedDate =
      parsedDateFromDateTime && !Number.isNaN(parsedDateFromDateTime.getTime())
        ? parsedDateFromDateTime
        : parsedDateFromDateOnly && !Number.isNaN(parsedDateFromDateOnly.getTime())
          ? parsedDateFromDateOnly
          : null;
    const toNumber = (v: string) => {
      const n = Number.parseInt(v, 10);
      return Number.isFinite(n) ? n : null;
    };

    const movesText = chunk
      .split(/\r?\n/)
      .filter((line) => !line.startsWith("["))
      .join(" ");
    const plyCount = countMovePlies(movesText);
    const annotationQuality = parseMoveQualityFromAnnotations(movesText);
    const evalQuality = parseMoveQualityFromEvals(movesText);
    const hasExactSignals = hasLichessSignalTags(movesText);
    const signalSource: SignalQualitySource = hasExactSignals
      ? "exact"
      : evalQuality.hasEvalData
        ? "estimated"
        : "none";
    const quality = hasExactSignals ? annotationQuality : evalQuality.hasEvalData ? evalQuality : annotationQuality;

    return {
      date: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null,
      white: headerValue(chunk, "White"),
      black: headerValue(chunk, "Black"),
      result: headerValue(chunk, "Result"),
      whiteElo: toNumber(headerValue(chunk, "WhiteElo")),
      blackElo: toNumber(headerValue(chunk, "BlackElo")),
      eco: headerValue(chunk, "ECO") || "Unknown",
      timeControl: headerValue(chunk, "TimeControl") || "Unknown",
      termination: headerValue(chunk, "Termination") || "Unknown",
      plyCount,
      moveCount: (chunk.match(/\b\d+\.(?!\.)/g) ?? []).length,
      annotationBestMoves: quality.whiteBestMoves,
      annotationExcellentMoves: quality.whiteExcellentMoves,
      annotationGoodMoves: quality.whiteGoodMoves,
      annotationBookMoves: quality.whiteBookMoves,
      annotationBlunders: quality.whiteBlunders,
      annotationMistakes: quality.whiteMistakes,
      annotationInaccuracies: quality.whiteInaccuracies,
      annotationBrilliants: quality.whiteBrilliants,
      annotationMissedWins: quality.whiteMissedWins,
      blackBestMoves: quality.blackBestMoves,
      blackExcellentMoves: quality.blackExcellentMoves,
      blackGoodMoves: quality.blackGoodMoves,
      blackBookMoves: quality.blackBookMoves,
      blackBlunders: quality.blackBlunders,
      blackMistakes: quality.blackMistakes,
      blackInaccuracies: quality.blackInaccuracies,
      blackBrilliants: quality.blackBrilliants,
      blackMissedWins: quality.blackMissedWins,
      whiteSignalSource: signalSource,
      blackSignalSource: signalSource,
    };
  });
}

function buildPlayerPerspective(games: ParsedChessGame[], preferredPlayers?: string[]) {
  if (games.length === 0) return null;

  const preferred = (preferredPlayers ?? []).filter(Boolean);
  const preferredSet = new Set(preferred);
  const hasPreferred = preferredSet.size > 0;

  let player = "";
  if (hasPreferred) {
    player = preferred.length > 1 ? "Combined" : preferred[0];
  } else {
    const counts = new Map<string, number>();
    games.forEach((g) => {
      if (g.white) counts.set(g.white, (counts.get(g.white) ?? 0) + 1);
      if (g.black) counts.set(g.black, (counts.get(g.black) ?? 0) + 1);
    });
    player = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    if (!player) return null;
    preferredSet.add(player);
  }

  const scoped = games
    .filter((g) => preferredSet.has(g.white) || preferredSet.has(g.black))
    .sort((a, b) => {
      const ta = a.date ? a.date.getTime() : 0;
      const tb = b.date ? b.date.getTime() : 0;
      return ta - tb;
    });

  const myGames: PlayerChessGame[] = scoped.map((g) => {
    const whiteMine = preferredSet.has(g.white);
    const blackMine = preferredSet.has(g.black);
    const isWhite = whiteMine || !blackMine;
    const myResult: "win" | "draw" | "loss" | "unknown" =
      g.result === "1/2-1/2"
        ? "draw"
        : (isWhite && g.result === "1-0") || (!isWhite && g.result === "0-1")
          ? "win"
          : (isWhite && g.result === "0-1") || (!isWhite && g.result === "1-0")
            ? "loss"
            : "unknown";

    return {
      date: g.date,
      myAccount: isWhite ? g.white : g.black,
      myColor: isWhite ? "White" : "Black",
      myResult,
      myRating: isWhite ? g.whiteElo : g.blackElo,
      oppRating: isWhite ? g.blackElo : g.whiteElo,
      oppName: isWhite ? g.black : g.white,
      eco: g.eco,
      timeControl: g.timeControl,
      termination: g.termination,
      moveCount:
        g.plyCount > 0
          ? isWhite
            ? Math.ceil(g.plyCount / 2)
            : Math.floor(g.plyCount / 2)
          : g.moveCount,
      annotationBestMoves: isWhite ? g.annotationBestMoves : g.blackBestMoves,
      annotationExcellentMoves: isWhite ? g.annotationExcellentMoves : g.blackExcellentMoves,
      annotationGoodMoves: isWhite ? g.annotationGoodMoves : g.blackGoodMoves,
      annotationBookMoves: isWhite ? g.annotationBookMoves : g.blackBookMoves,
      annotationBlunders: isWhite ? g.annotationBlunders : g.blackBlunders,
      annotationMistakes: isWhite ? g.annotationMistakes : g.blackMistakes,
      annotationInaccuracies: isWhite ? g.annotationInaccuracies : g.blackInaccuracies,
      annotationBrilliants: isWhite ? g.annotationBrilliants : g.blackBrilliants,
      annotationMissedWins: isWhite ? g.annotationMissedWins : g.blackMissedWins,
      signalSource: isWhite ? g.whiteSignalSource : g.blackSignalSource,
    };
  });

  return { player, games: myGames };
}

function buildChessSummary(games: ParsedChessGame[], preferredPlayers?: string[]): ChessSummary | null {
  const perspective = buildPlayerPerspective(games, preferredPlayers);
  if (!perspective) return null;
  const { player } = perspective;
  const scoped = perspective.games;

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let scoredGames = 0;
  let whiteGames = 0;
  let blackGames = 0;
  let whiteWins = 0;
  let blackWins = 0;
  let opponentSum = 0;
  let opponentCount = 0;
  const ratingSeries: Array<{ label: string; rating: number }> = [];
  const openings = new Map<string, { games: number; wins: number }>();
  const openingTypes = new Map<string, { games: number; wins: number }>();
  const gameResults: Array<"W" | "D" | "L"> = [];
  let totalBestMoves = 0;
  let totalExcellentMoves = 0;
  let totalGoodMoves = 0;
  let totalBookMoves = 0;
  let totalBlunders = 0;
  let totalMistakes = 0;
  let totalInaccuracies = 0;
  let totalBrilliants = 0;
  let totalMissedWins = 0;
  let totalMoves = 0;
  let totalBaseMinutes = 0;
  let baseMinutesGames = 0;
  let winMovesSum = 0;
  let drawMovesSum = 0;
  let lossMovesSum = 0;
  let winBaseMinutesSum = 0;
  let lossBaseMinutesSum = 0;
  let winMoveGames = 0;
  let drawMoveGames = 0;
  let lossMoveGames = 0;
  let winBaseMinutesGames = 0;
  let lossBaseMinutesGames = 0;
  let timeForfeits = 0;
  let myTimeForfeits = 0;
  let opponentTimeForfeits = 0;
  const signalRows: SignalRowWithSource[] = [];

  const toResult = (g: PlayerChessGame) => {
    if (g.myColor === "White") whiteGames += 1;
    else blackGames += 1;

    if (typeof g.oppRating === "number") {
      opponentSum += g.oppRating;
      opponentCount += 1;
    }
    if (typeof g.myRating === "number") {
      ratingSeries.push({
        label: g.date ? formatLocalYmd(g.date) : `${ratingSeries.length + 1}`,
        rating: g.myRating,
      });
    }

    if (g.myResult === "win") {
      wins += 1;
      scoredGames += 1;
      gameResults.push("W");
      if (g.myColor === "White") whiteWins += 1;
      else blackWins += 1;
    } else if (g.myResult === "draw") {
      draws += 1;
      scoredGames += 1;
      gameResults.push("D");
    } else if (g.myResult === "loss") {
      losses += 1;
      scoredGames += 1;
      gameResults.push("L");
    }

    const row = openings.get(g.eco) ?? { games: 0, wins: 0 };
    row.games += 1;
    if (g.myResult === "win") row.wins += 1;
    openings.set(g.eco, row);

    const typeLabel = openingTypeFromEco(g.eco);
    const typeRow = openingTypes.get(typeLabel) ?? { games: 0, wins: 0 };
    typeRow.games += 1;
    if (g.myResult === "win") typeRow.wins += 1;
    openingTypes.set(typeLabel, typeRow);
    totalBestMoves += g.annotationBestMoves;
    totalExcellentMoves += g.annotationExcellentMoves;
    totalGoodMoves += g.annotationGoodMoves;
    totalBookMoves += g.annotationBookMoves;
    totalBlunders += g.annotationBlunders;
    totalMistakes += g.annotationMistakes;
    totalInaccuracies += g.annotationInaccuracies;
    totalBrilliants += g.annotationBrilliants;
    totalMissedWins += g.annotationMissedWins;
    totalMoves += g.moveCount;
    const baseMinutes = parseTimeControlBaseMinutes(g.timeControl);
    if (typeof baseMinutes === "number") {
      totalBaseMinutes += baseMinutes;
      baseMinutesGames += 1;
    }
    if (g.myResult === "win") {
      winMovesSum += g.moveCount;
      winMoveGames += 1;
      if (typeof baseMinutes === "number") {
        winBaseMinutesSum += baseMinutes;
        winBaseMinutesGames += 1;
      }
    } else if (g.myResult === "draw") {
      drawMovesSum += g.moveCount;
      drawMoveGames += 1;
    } else {
      lossMovesSum += g.moveCount;
      lossMoveGames += 1;
      if (typeof baseMinutes === "number") {
        lossBaseMinutesSum += baseMinutes;
        lossBaseMinutesGames += 1;
      }
    }
    if (/time forfeit/i.test(g.termination)) {
      timeForfeits += 1;
      if (g.myResult === "loss") myTimeForfeits += 1;
      if (g.myResult === "win") opponentTimeForfeits += 1;
    }
    signalRows.push({
      gameNumber: signalRows.length + 1,
      game: g.date ? formatLocalYmd(g.date) : `Game ${signalRows.length + 1}`,
      myMoves: g.moveCount,
      bestMoves: g.annotationBestMoves,
      excellentMoves: g.annotationExcellentMoves,
      goodMoves: g.annotationGoodMoves,
      bookMoves: g.annotationBookMoves,
      blunders: g.annotationBlunders,
      mistakes: g.annotationMistakes,
      inaccuracies: g.annotationInaccuracies,
      brilliants: g.annotationBrilliants,
      missedWins: g.annotationMissedWins,
      source: g.signalSource,
    });
  };

  scoped.forEach(toResult);

  const openingRows = [...openings.entries()]
    .map(([eco, row]) => ({
      eco,
      games: row.games,
      winRate: row.games > 0 ? (row.wins / row.games) * 100 : 0,
    }))
    .filter((row) => row.games >= 2)
    .sort((a, b) => b.games - a.games)
    .slice(0, 8);

  const openingTypeRows = [...openingTypes.entries()]
    .map(([label, row]) => ({
      label,
      games: row.games,
      winRate: row.games > 0 ? (row.wins / row.games) * 100 : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 6);
  const totalGames = scoped.length;
  const whiteWinRate = whiteGames > 0 ? (whiteWins / whiteGames) * 100 : 0;
  const blackWinRate = blackGames > 0 ? (blackWins / blackGames) * 100 : 0;
  const avgOpponent = opponentCount > 0 ? Math.round(opponentSum / opponentCount) : null;
  const avgBlundersPerGame = totalGames > 0 ? totalBlunders / totalGames : 0;
  const avgMovesPerGame = totalGames > 0 ? totalMoves / totalGames : 0;
  const avgBaseMinutesPerGame = baseMinutesGames > 0 ? totalBaseMinutes / baseMinutesGames : null;
  const avgBaseMinutesInWins = winBaseMinutesGames > 0 ? winBaseMinutesSum / winBaseMinutesGames : null;
  const avgBaseMinutesInLosses = lossBaseMinutesGames > 0 ? lossBaseMinutesSum / lossBaseMinutesGames : null;
  const avgMovesInWins = winMoveGames > 0 ? winMovesSum / winMoveGames : null;
  const avgMovesInDraws = drawMoveGames > 0 ? drawMovesSum / drawMoveGames : null;
  const avgMovesInLosses = lossMoveGames > 0 ? lossMovesSum / lossMoveGames : null;
  const timeForfeitRate = totalGames > 0 ? (timeForfeits / totalGames) * 100 : 0;

  const recent = ratingSeries.slice(-15).map((r) => r.rating);
  const prior = ratingSeries.slice(-30, -15).map((r) => r.rating);
  const avg = (arr: number[]) =>
    arr.length === 0 ? null : arr.reduce((sum, x) => sum + x, 0) / arr.length;
  const recentAvg = avg(recent);
  const priorAvg = avg(prior);

  const weakestOpening = openingRows
    .filter((o) => o.games >= 3)
    .sort((a, b) => a.winRate - b.winRate)[0];

  const strongerColor = whiteWinRate >= blackWinRate ? "White" : "Black";
  const weakerColor = strongerColor === "White" ? "Black" : "White";
  const colorGap = Math.round(Math.abs(whiteWinRate - blackWinRate));

  const insights: string[] = [];
  if (weakestOpening) {
    insights.push(
      `Review ${weakestOpening.eco}: ${weakestOpening.winRate.toFixed(0)}% win rate across ${weakestOpening.games} games.`
    );
  }
  if (colorGap >= 8) {
    insights.push(
      `Color imbalance: ${strongerColor} is outperforming ${weakerColor} by about ${colorGap}% win rate.`
    );
  }
  if (recentAvg !== null && priorAvg !== null) {
    const diff = Math.round(recentAvg - priorAvg);
    if (diff >= 12) insights.push(`Momentum is positive: recent rating trend is up about ${diff} points.`);
    if (diff <= -12) insights.push(`Recent dip detected: rating trend is down about ${Math.abs(diff)} points.`);
  }
  if (insights.length === 0) {
    insights.push("Current play is stable. Focus on consistency in your top 2 most-played openings.");
  }

  return {
    player,
    totalGames,
    wins,
    draws,
    losses,
    overallScoreRate: scoredGames > 0 ? ((wins + draws * 0.5) / scoredGames) * 100 : 0,
    whiteGames,
    blackGames,
    whiteWinRate,
    blackWinRate,
    avgOpponent,
    ratingSeries,
    openingRows,
    openingTypeRows,
    gameResults,
    signalRows,
    totalBestMoves,
    totalExcellentMoves,
    totalGoodMoves,
    totalBookMoves,
    totalBlunders,
    totalMistakes,
    totalInaccuracies,
    totalBrilliants,
    totalMissedWins,
    avgBlundersPerGame,
    avgMovesPerGame,
    avgBaseMinutesPerGame,
    avgBaseMinutesInWins,
    avgBaseMinutesInLosses,
    avgMovesInWins,
    avgMovesInDraws,
    avgMovesInLosses,
    timeForfeits,
    timeForfeitRate,
    myTimeForfeits,
    opponentTimeForfeits,
    insights,
  };
}

function buildAiCoachReport(recent: PlayerChessGame[]): CoachReport | null {
  if (recent.length === 0) return null;
  const sampleSize = recent.length;
  const losses = recent.filter((g) => g.myResult === "loss").length;
  const draws = recent.filter((g) => g.myResult === "draw").length;
  const wins = recent.filter((g) => g.myResult === "win").length;
  const timeForfeits = recent.filter((g) => /time forfeit/i.test(g.termination)).length;
  const shortLosses = recent.filter((g) => g.myResult === "loss" && g.moveCount <= 25).length;
  const whiteLosses = recent.filter((g) => g.myColor === "White" && g.myResult === "loss").length;
  const blackLosses = recent.filter((g) => g.myColor === "Black" && g.myResult === "loss").length;

  const openingRows = new Map<string, { games: number; losses: number }>();
  recent.forEach((g) => {
    const row = openingRows.get(g.eco) ?? { games: 0, losses: 0 };
    row.games += 1;
    if (g.myResult === "loss") row.losses += 1;
    openingRows.set(g.eco, row);
  });
  const weakOpening = [...openingRows.entries()]
    .sort((a, b) => {
      const ar = a[1].games > 0 ? a[1].losses / a[1].games : 0;
      const br = b[1].games > 0 ? b[1].losses / b[1].games : 0;
      return br - ar;
    })[0];

  const title =
    sampleSize === 1 ? "GM Coach: Most Recent Game" : `GM Coach: Last ${sampleSize} Games`;

  let summary = "";
  if (wins === sampleSize) {
    summary =
      "You are converting positions well. Now the next jump is squeezing small advantages instead of relying on tactical swings.";
  } else if (losses === sampleSize) {
    summary =
      "This run is recoverable. The losses are not from one huge gap, but from repeated decision-quality leaks in similar phases.";
  } else {
    summary = `Mixed stretch (${wins}W-${draws}D-${losses}L). Your ceiling is clearly higher than your floor; consistency is now the real battleground.`;
  }

  const focusParts: string[] = [];
  if (timeForfeits > 0) {
    focusParts.push("Manage clock checkpoints at move 10, 20, and 30.");
  }
  if (shortLosses > 0) {
    focusParts.push("Slow down in the opening and prioritize piece development before tactical risks.");
  }
  if (whiteLosses > blackLosses + 1) {
    focusParts.push("As White, focus on safer structure before launching attacks.");
  } else if (blackLosses > whiteLosses + 1) {
    focusParts.push("As Black, tighten your first 10 moves and avoid early weaknesses.");
  }
  if (weakOpening && weakOpening[1].losses > 0) {
    focusParts.push(`Review ${weakOpening[0]} ideas and typical middle-game plans.`);
  }
  if (focusParts.length === 0) {
    focusParts.push("Keep your current approach, then deepen prep in your two most-played openings.");
  }

  const checklist = [
    "Before each game, define your first 12-move structure goal and one tactical blunder-check trigger.",
    "After each game, annotate the first irreversible mistake and one move before it that allowed it.",
    "For the next 10 games, play for position first; only calculate forcing lines once king safety is verified.",
  ];
  const quickFixes = [
    focusParts[0] ?? "Play one principled opening line and avoid early tactical detours.",
    focusParts[1] ?? "Add a 10-second blunder check before every move in sharp positions.",
    "After each game, note your first major evaluation drop and the decision before it.",
  ];

  const lossByEco = new Map<string, number>();
  const avgMoveCount =
    recent.length > 0
      ? Math.round(recent.reduce((sum, g) => sum + g.moveCount, 0) / recent.length)
      : 0;
  recent.forEach((g) => {
    if (g.myResult === "loss") {
      lossByEco.set(g.eco, (lossByEco.get(g.eco) ?? 0) + 1);
    }
  });
  const mostPunishedEco = [...lossByEco.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const secretInsights = [
    mostPunishedEco
      ? `Opponents are scoring against you most often in ${mostPunishedEco}. Prepare two model games and one endgame plan from that structure.`
      : "Your opening spread is healthy; focus on converting equal middlegames, not memorizing more lines.",
    timeForfeits > 0
      ? "Your clock losses are technique losses in disguise. Use a hard time budget by move 20 and refuse deep side-lines when behind on time."
      : "Your clock control is decent. Convert this into rating by forcing simpler positions when ahead.",
    avgMoveCount < 28
      ? "Your games are ending too early. Build a 'stability phase' between moves 12-20 to avoid premature collapses."
      : "Your games go long enough; train conversion technique in slightly better endgames to turn draws into wins.",
  ];

  const toScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  const conversionScore = toScore((wins / Math.max(sampleSize, 1)) * 100);
  const clockDisciplineScore = toScore(100 - (timeForfeits / Math.max(sampleSize, 1)) * 100);
  const openingStabilityScore = toScore(
    100 -
      (mostPunishedEco
        ? ((lossByEco.get(mostPunishedEco) ?? 0) / Math.max(recent.length, 1)) * 100
        : 0)
  );
  const survivalScore = toScore(100 - (shortLosses / Math.max(sampleSize, 1)) * 100);

  const visuals = [
    {
      label: "Conversion",
      value: conversionScore,
      hint: "How well you convert playable positions into points.",
    },
    {
      label: "Clock Discipline",
      value: clockDisciplineScore,
      hint: "Lower time-pressure mistakes and better move pacing.",
    },
    {
      label: "Opening Stability",
      value: openingStabilityScore,
      hint: "How consistently your opening phase avoids immediate damage.",
    },
    {
      label: "Early-Game Survival",
      value: survivalScore,
      hint: "Resilience through moves 1-25 before complications spike.",
    },
  ];

  return {
    title,
    summary,
    focus: focusParts.slice(0, 2).join(" "),
    quickFixes,
    checklist,
    secretInsights,
    visuals,
  };
}

function MiniLineChart({ series }: { series: Array<{ label: string; rating: number }> }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (series.length < 2) {
    return <p className="text-sm text-white/55">Not enough games yet for a trend line.</p>;
  }

  const width = 760;
  const height = 220;
  const pad = 18;
  const leftAxisPad = 56;
  const bottomAxisPad = 30;
  const plotW = width - leftAxisPad - pad;
  const plotH = height - bottomAxisPad - pad;
  const values = series.map((s) => s.rating);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const stepX = plotW / (values.length - 1);
  const points = series.map((s, i) => {
    const x = leftAxisPad + i * stepX;
    const y = plotH + pad - ((s.rating - min) / range) * plotH;
    return { x, y, label: s.label, rating: s.rating };
  });
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const horizontalGrid = 4;
  const verticalGrid = 6;
  const yTicks = Array.from({ length: horizontalGrid + 1 }).map((_, i) => {
    const t = i / horizontalGrid;
    return Math.round(max - t * (max - min));
  });
  const startLabel = series[0]?.label ?? "";
  const midLabel = series[Math.floor(series.length / 2)]?.label ?? "";
  const endLabel = series[series.length - 1]?.label ?? "";
  const hoveredPoint = hoveredIndex != null ? points[hoveredIndex] : null;

  return (
    <div className="relative rounded-lg border border-white/10 bg-[#0b1320] p-2">
      {hoveredPoint ? (
        <div
          className="pointer-events-none absolute z-20 min-w-[11rem] rounded-lg border border-cyan-300/45 bg-[#0b1320]/95 px-3 py-2 text-xs text-cyan-100 shadow-xl"
          style={{
            left: `calc(${((hoveredPoint.x + 8) / width) * 100}% + 0.25rem)`,
            top: `calc(${((hoveredPoint.y - 28) / height) * 100}% + 0.25rem)`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="uppercase tracking-[0.12em] text-[10px] text-cyan-100/70">Date</p>
            <p className="font-medium text-white/90">{hoveredPoint.label}</p>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="uppercase tracking-[0.12em] text-[10px] text-cyan-100/70">Rating</p>
            <p className="font-semibold text-cyan-100">{hoveredPoint.rating}</p>
          </div>
        </div>
      ) : null}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        {Array.from({ length: horizontalGrid + 1 }).map((_, i) => {
          const y = pad + (i * plotH) / horizontalGrid;
          return (
            <line
              key={`h-${i}`}
              x1={leftAxisPad}
              y1={y}
              x2={leftAxisPad + plotW}
              y2={y}
              stroke="rgba(148,163,184,0.18)"
              strokeWidth="1"
            />
          );
        })}
        {yTicks.map((tick, i) => {
          const y = pad + (i * plotH) / horizontalGrid + 3;
          return (
            <text key={`yt-${tick}-${i}`} x="12" y={y} fill="rgba(203,213,225,0.72)" fontSize="10">
              {tick}
            </text>
          );
        })}
        {Array.from({ length: verticalGrid + 1 }).map((_, i) => {
          const x = leftAxisPad + (i * plotW) / verticalGrid;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={pad}
              x2={x}
              y2={plotH + pad}
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="1"
            />
          );
        })}
        <polyline
          fill="none"
          stroke="rgba(34,211,238,0.95)"
          strokeWidth="2.6"
          points={polylinePoints}
        />
        {points.map((point, i) => (
          <circle
            key={`rt-point-${point.label}-${i}`}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === i ? 4.8 : 3.4}
            fill={hoveredIndex === i ? "rgba(241,245,249,0.98)" : "rgba(203,213,225,0.95)"}
            stroke="rgba(15,23,34,0.95)"
            strokeWidth="1.2"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
        <line
          x1={leftAxisPad}
          y1={pad}
          x2={leftAxisPad}
          y2={plotH + pad}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
        <line
          x1={leftAxisPad}
          y1={plotH + pad}
          x2={leftAxisPad + plotW}
          y2={plotH + pad}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
        <text x={leftAxisPad} y={height - 8} fill="rgba(203,213,225,0.72)" fontSize="10">
          {startLabel}
        </text>
        <text
          x={leftAxisPad + plotW / 2}
          y={height - 8}
          fill="rgba(203,213,225,0.72)"
          fontSize="10"
          textAnchor="middle"
        >
          {midLabel}
        </text>
        <text
          x={leftAxisPad + plotW}
          y={height - 8}
          fill="rgba(203,213,225,0.72)"
          fontSize="10"
          textAnchor="end"
        >
          {endLabel}
        </text>
        <text
          x={leftAxisPad + plotW / 2}
          y={height - 20}
          fill="rgba(203,213,225,0.72)"
          fontSize="10"
          textAnchor="middle"
        >
          Date
        </text>
      </svg>
    </div>
  );
}

function MyMovesTrendChart({ rows }: { rows: Array<{ game: string; myMoves: number }> }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (rows.length < 2) {
    return <p className="text-sm text-white/55">Not enough games yet for a moves trend line.</p>;
  }

  const width = 860;
  const height = 260;
  const pad = 16;
  const leftAxisPad = 54;
  const bottomAxisPad = 34;
  const plotW = width - leftAxisPad - pad;
  const plotH = height - bottomAxisPad - pad;
  const values = rows.map((r) => r.myMoves);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const stepX = plotW / (rows.length - 1);
  const points = rows.map((r, i) => ({
    x: leftAxisPad + i * stepX,
    y: plotH + pad - ((r.myMoves - min) / range) * plotH,
    game: r.game,
    myMoves: r.myMoves,
  }));
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const yTicks = Array.from({ length: 5 }).map((_, i) => {
    const t = i / 4;
    return Math.round(max - t * (max - min));
  });
  const hoveredPoint = hoveredIndex != null ? points[hoveredIndex] : null;
  const startLabel = rows[0]?.game ?? "";
  const midLabel = rows[Math.floor(rows.length / 2)]?.game ?? "";
  const endLabel = rows[rows.length - 1]?.game ?? "";

  return (
    <div className="relative rounded-lg border border-white/10 bg-[#0b1320] p-2">
      {hoveredPoint ? (
        <div
          className="pointer-events-none absolute z-20 min-w-[11rem] rounded-lg border border-cyan-300/45 bg-[#0b1320]/95 px-3 py-2 text-xs text-cyan-100 shadow-xl"
          style={{
            left: `calc(${((hoveredPoint.x + 8) / width) * 100}% + 0.25rem)`,
            top: `calc(${((hoveredPoint.y - 28) / height) * 100}% + 0.25rem)`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="uppercase tracking-[0.12em] text-[10px] text-cyan-100/70">Date</p>
            <p className="font-medium text-white/90">{hoveredPoint.game}</p>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="uppercase tracking-[0.12em] text-[10px] text-cyan-100/70">Your Moves</p>
            <p className="font-semibold text-cyan-100">{hoveredPoint.myMoves}</p>
          </div>
        </div>
      ) : null}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
        {Array.from({ length: 5 }).map((_, i) => {
          const y = pad + (i * plotH) / 4;
          return (
            <line
              key={`mv-h-${i}`}
              x1={leftAxisPad}
              y1={y}
              x2={leftAxisPad + plotW}
              y2={y}
              stroke="rgba(148,163,184,0.16)"
              strokeWidth="1"
            />
          );
        })}
        {yTicks.map((tick, i) => {
          const y = pad + (i * plotH) / 4 + 3;
          return (
            <text key={`mv-yt-${tick}-${i}`} x="12" y={y} fill="rgba(203,213,225,0.72)" fontSize="10">
              {tick}
            </text>
          );
        })}
        <polyline fill="none" stroke="rgba(34,211,238,0.95)" strokeWidth="2.4" points={polylinePoints} />
        {points.map((point, i) => (
          <circle
            key={`mv-pt-${point.game}-${i}`}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === i ? 4.8 : 3.4}
            fill={hoveredIndex === i ? "rgba(241,245,249,0.98)" : "rgba(203,213,225,0.95)"}
            stroke="rgba(15,23,34,0.95)"
            strokeWidth="1.1"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex((current) => (current === i ? null : current))}
          >
            <title>{`${point.game} · ${point.myMoves} moves`}</title>
          </circle>
        ))}
        <line
          x1={leftAxisPad}
          y1={plotH + pad}
          x2={leftAxisPad + plotW}
          y2={plotH + pad}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
        <text x={leftAxisPad} y={height - 8} fill="rgba(203,213,225,0.72)" fontSize="10">
          {startLabel}
        </text>
        <text x={leftAxisPad + plotW / 2} y={height - 8} fill="rgba(203,213,225,0.72)" fontSize="10" textAnchor="middle">
          {midLabel}
        </text>
        <text x={leftAxisPad + plotW} y={height - 8} fill="rgba(203,213,225,0.72)" fontSize="10" textAnchor="end">
          {endLabel}
        </text>
        <text x={leftAxisPad + plotW / 2} y={height - 20} fill="rgba(203,213,225,0.72)" fontSize="10" textAnchor="middle">
          Date
        </text>
      </svg>
    </div>
  );
}

function MiniSignalsChart({ rows }: { rows: SignalRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/55">No move-quality data available yet.</p>;
  }

  const totals = rows.reduce(
    (acc, row) => {
      acc.bestMoves += row.bestMoves;
      acc.excellentMoves += row.excellentMoves;
      acc.goodMoves += row.goodMoves;
      acc.bookMoves += row.bookMoves;
      acc.blunders += row.blunders;
      acc.mistakes += row.mistakes;
      acc.inaccuracies += row.inaccuracies;
      acc.brilliants += row.brilliants;
      acc.missedWins += row.missedWins;
      return acc;
    },
    { ...EMPTY_MOVE_SIGNAL_COUNTS }
  );
  const data = [
    { label: "Brilliants", value: totals.brilliants, color: "rgba(110,231,183,0.92)" },
    { label: "Best", value: totals.bestMoves, color: "rgba(52,211,153,0.92)" },
    { label: "Excellent", value: totals.excellentMoves, color: "rgba(125,211,252,0.92)" },
    { label: "Good", value: totals.goodMoves, color: "rgba(250,204,21,0.92)" },
    { label: "Book", value: totals.bookMoves, color: "rgba(167,139,250,0.92)" },
    { label: "Inaccuracies", value: totals.inaccuracies, color: "rgba(96,165,250,0.92)" },
    { label: "Mistakes", value: totals.mistakes, color: "rgba(251,191,36,0.92)" },
    { label: "Blunders", value: totals.blunders, color: "rgba(251,113,133,0.92)" },
    { label: "Missed Win", value: totals.missedWins, color: "rgba(248,113,113,0.92)" },
  ].filter((item) => item.value > 0);
  if (data.length === 0) {
    return <p className="text-sm text-white/55">No signals in this window yet.</p>;
  }
  const width = 940;
  const height = 240;
  const pad = 16;
  const leftAxisPad = 48;
  const bottomAxisPad = 42;
  const plotW = width - leftAxisPad - pad;
  const plotH = height - bottomAxisPad - pad;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const groupWidth = plotW / data.length;
  const barWidth = Math.min(54, groupWidth * 0.5);

  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1320] p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60">
        {Array.from({ length: 5 }).map((_, i) => {
          const y = pad + (i * plotH) / 4;
          return (
            <line
              key={`sg-h-${i}`}
              x1={leftAxisPad}
              y1={y}
              x2={leftAxisPad + plotW}
              y2={y}
              stroke="rgba(148,163,184,0.16)"
              strokeWidth="1"
            />
          );
        })}
        {data.map((item, i) => {
          const xCenter = leftAxisPad + groupWidth * i + groupWidth / 2;
          const h = (item.value / maxVal) * plotH;
          const y = plotH + pad - h;
          return (
            <g key={item.label}>
              <rect
                x={xCenter - barWidth / 2}
                y={y}
                width={barWidth}
                height={h}
                rx={6}
                fill={item.color}
              />
              <text
                x={xCenter}
                y={y - 6}
                fill="rgba(226,232,240,0.9)"
                fontSize="10"
                textAnchor="middle"
              >
                {item.value}
              </text>
              <text
                x={xCenter}
                y={height - 8}
                fill="rgba(203,213,225,0.8)"
                fontSize="10"
                textAnchor="middle"
              >
                {item.label}
              </text>
            </g>
          );
        })}
        <line
          x1={leftAxisPad}
          y1={plotH + pad}
          x2={leftAxisPad + plotW}
          y2={plotH + pad}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
        {Array.from({ length: 5 }).map((_, i) => {
          const value = Math.round(maxVal - (i * maxVal) / 4);
          const y = pad + (i * plotH) / 4 + 3;
          return (
            <text key={`metric-y-${i}`} x="12" y={y} fill="rgba(203,213,225,0.72)" fontSize="10">
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function BlunderTrendChart({ rows }: { rows: SignalRow[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (rows.length < 2) {
    return <p className="text-sm text-white/55">Need at least 2 games for a blunder trend.</p>;
  }
  const width = 860;
  const height = 240;
  const pad = 18;
  const leftAxisPad = 52;
  const bottomAxisPad = 34;
  const plotW = width - leftAxisPad - pad;
  const plotH = height - bottomAxisPad - pad;
  const maxVal = Math.max(...rows.map((r) => r.blunders), 1);
  const stepX = plotW / (rows.length - 1);
  const points = rows.map((r, i) => ({
    x: leftAxisPad + i * stepX,
    y: plotH + pad - (r.blunders / maxVal) * plotH,
    game: r.game,
    blunders: r.blunders,
  }));
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const yTicks = Array.from({ length: 4 }).map((_, i) => Math.round(maxVal - (i * maxVal) / 3));
  const hoveredPoint = hoveredIndex != null ? points[hoveredIndex] : null;

  return (
    <div className="relative rounded-lg border border-white/10 bg-[#0b1320] p-3 mt-3">
      {hoveredPoint ? (
        <div
          className="pointer-events-none absolute z-20 min-w-[10rem] rounded-lg border border-rose-300/45 bg-[#0b1320]/95 px-3 py-2 text-sm text-rose-100 shadow-xl"
          style={{
            left: `calc(${((hoveredPoint.x + 10) / width) * 100}% + 0.25rem)`,
            top: `calc(${((hoveredPoint.y - 32) / height) * 100}% + 0.25rem)`,
          }}
        >
          <p className="leading-5">{hoveredPoint.game}</p>
          <p className="leading-5 font-semibold">{hoveredPoint.blunders} blunders</p>
        </div>
      ) : null}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        {Array.from({ length: 4 }).map((_, i) => {
          const y = pad + (i * plotH) / 3;
          return (
            <line
              key={`bt-h-${i}`}
              x1={leftAxisPad}
              y1={y}
              x2={leftAxisPad + plotW}
              y2={y}
              stroke="rgba(148,163,184,0.16)"
              strokeWidth="1"
            />
          );
        })}
        {yTicks.map((tick, i) => {
          const y = pad + (i * plotH) / 3 + 3;
          return (
            <text key={`bt-yt-${tick}-${i}`} x="12" y={y} fill="rgba(203,213,225,0.72)" fontSize="11">
              {tick}
            </text>
          );
        })}
        <polyline fill="none" stroke="rgba(251,113,133,0.95)" strokeWidth="2.2" points={polylinePoints} />
        {points.map((point, i) => (
          <circle
            key={`bt-point-${point.game}-${i}`}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === i ? 4.4 : 3.1}
            fill={hoveredIndex === i ? "rgba(251,113,133,0.98)" : "rgba(251,113,133,0.84)"}
            stroke="rgba(15,23,34,0.9)"
            strokeWidth="1"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
        <line
          x1={leftAxisPad}
          y1={plotH + pad}
          x2={leftAxisPad + plotW}
          y2={plotH + pad}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
        <text x={leftAxisPad} y={height - 10} fill="rgba(203,213,225,0.72)" fontSize="11">
          {rows[0]?.game}
        </text>
        <text
          x={leftAxisPad + plotW}
          y={height - 10}
          fill="rgba(203,213,225,0.72)"
          fontSize="11"
          textAnchor="end"
        >
          {rows[rows.length - 1]?.game}
        </text>
      </svg>
    </div>
  );
}

export default function HobbyDetail() {
  const { slug } = useParams();
  const hobby = slug ? hobbyBySlug.get(slug) : undefined;
  const isChess = hobby?.slug === "chess";
  const isMusic = hobby?.slug === "music";
  const [pgnText, setPgnText] = useState("");
  const [pgnLoading, setPgnLoading] = useState(false);
  const [pgnError, setPgnError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [analysisWindow, setAnalysisWindow] = useState<number>(1);
  const [analysisViewMode, setAnalysisViewMode] = useState<"window" | "game">("window");
  const [selectedAnalysisGame, setSelectedAnalysisGame] = useState<number>(-1);
  const [signalsWindow, setSignalsWindow] = useState<number>(1);
  const [signalsViewMode, setSignalsViewMode] = useState<"window" | "game">("game");
  const [selectedSignalGame, setSelectedSignalGame] = useState<number>(-1);
  const [selectedMovesGame, setSelectedMovesGame] = useState<number>(-1);
  const [musicDiscipline, setMusicDiscipline] = useState<MusicDiscipline>("drums");
  const [chessPlatform, setChessPlatform] = useState<ChessPlatform>("lichess");
  const [coachReport, setCoachReport] = useState<CoachReport | null>(null);
  const [ratingWindow, setRatingWindow] = useState<number>(60);
  const [overviewWindow, setOverviewWindow] = useState<OverviewWindow>("all");
  const [overviewColorFilter, setOverviewColorFilter] = useState<OverviewColorFilter>("all");
  const selectedPlatforms = useMemo<ChessSourcePlatform[]>(
    () => (chessPlatform === "all" ? CHESS_SOURCE_PLATFORMS : [chessPlatform]),
    [chessPlatform]
  );
  const selectedPlayers = useMemo(
    () => selectedPlatforms.map((platform) => CHESS_USERS[platform]),
    [selectedPlatforms]
  );
  const isLocalDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const syncStatus: "idle" | "syncing" | "ok" | "error" = pgnLoading
    ? "syncing"
    : pgnError
      ? "error"
      : pgnText
        ? "ok"
        : "idle";

  const isValidPgn = (text: string) => /\[Event\s+"/.test(text);
  const mergeValidPgn = (chunks: string[]) =>
    chunks.map((chunk) => chunk.trim()).filter((chunk) => chunk && isValidPgn(chunk)).join("\n\n");

  const fetchDirectPgnForPlatform = async (platform: ChessSourcePlatform, max = 220) => {
    const username = CHESS_USERS[platform];
    if (platform === "chesscom") return fetchChessComPgnDirect(username, max);
    const directLichessUrl = `https://lichess.org/api/games/user/${encodeURIComponent(
      username
    )}?max=${max}&opening=true&moves=true&evals=true&pgnInJson=false&format=pgn`;
    const directRes = await fetch(directLichessUrl, {
      headers: { Accept: "application/x-chess-pgn,text/plain;q=0.9,*/*;q=0.8" },
    });
    if (!directRes.ok) throw new Error(platform);
    return directRes.text();
  };

  const syncChessData = async () => {
    if (!isChess) return;
    setPgnLoading(true);
    setPgnError("");
    setCoachReport(null);

    try {
      if (isLocalDev) {
        const chunks = await Promise.all(
          selectedPlatforms.map((platform) => fetchDirectPgnForPlatform(platform, 220))
        );
        const directText = mergeValidPgn(chunks);
        if (!directText.trim() || !isValidPgn(directText)) {
          setPgnError(
            `Live sync failed in local dev. No valid ${CHESS_PLATFORM_LABEL[chessPlatform]} PGN returned.`
          );
          setPgnText("");
          setPgnLoading(false);
          return;
        }
        setPgnText(directText);
        setLastSyncedAt(new Date().toLocaleTimeString());
        setPgnLoading(false);
        return;
      }

      const snapshotResults = await Promise.all(
        selectedPlatforms.map(async (platform) => {
          const username = CHESS_USERS[platform];
          const snapshotUrl = `/api/chess-sync?platform=${platform}&username=${encodeURIComponent(username)}&max=220`;
          const snapshotRes = await fetch(snapshotUrl, { headers: { Accept: "application/json" } });
          if (!snapshotRes.ok) return null;
          const data = await snapshotRes.json();
          if (!data?.pgn || !isValidPgn(data.pgn)) return null;
          return { pgn: data.pgn as string, syncedAt: data.syncedAt as string | undefined };
        })
      );
      const snapshotText = mergeValidPgn(snapshotResults.map((entry) => entry?.pgn ?? ""));
      if (snapshotText) {
        const syncedAtValues = snapshotResults
          .map((entry) => (entry?.syncedAt ? new Date(entry.syncedAt).getTime() : 0))
          .filter((t) => t > 0);
        const latestSynced = syncedAtValues.length > 0 ? new Date(Math.max(...syncedAtValues)) : new Date();
        setPgnText(snapshotText);
        setLastSyncedAt(latestSynced.toLocaleTimeString());
        setPgnLoading(false);
        return;
      }

      const directChunks = await Promise.all(
        selectedPlatforms.map((platform) => fetchDirectPgnForPlatform(platform, 220))
      );
      const directText = mergeValidPgn(directChunks);
      if (!directText.trim() || !isValidPgn(directText)) {
        setPgnError(`Live sync failed. No valid ${CHESS_PLATFORM_LABEL[chessPlatform]} PGN returned.`);
        setPgnText("");
        setPgnLoading(false);
        return;
      }
      setPgnText(directText);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch {
      setPgnError(
        `Live sync failed. Unable to reach API/${CHESS_PLATFORM_LABEL[chessPlatform]} from this environment.`
      );
      setPgnText("");
    }

    setPgnLoading(false);
  };

  useEffect(() => {
    if (!isChess) return;
    const loadSnapshot = async () => {
      if (isLocalDev) {
        await syncChessData();
        return;
      }
      try {
        const snapshots = await Promise.all(
          selectedPlatforms.map(async (platform) => {
            const username = CHESS_USERS[platform];
            const res = await fetch(
              `/api/chess-data?platform=${platform}&username=${encodeURIComponent(username)}`,
              { headers: { Accept: "application/json" } }
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (!data?.pgn || !isValidPgn(data.pgn)) return null;
            if (platform === "lichess" && chessPlatform === "lichess" && !hasLichessAnalysisData(data.pgn)) {
              return null;
            }
            return { pgn: data.pgn as string, syncedAt: data.syncedAt as string | undefined };
          })
        );
        const snapshotText = mergeValidPgn(snapshots.map((entry) => entry?.pgn ?? ""));
        if (!snapshotText) {
          await syncChessData();
          return;
        }
        const syncedAtValues = snapshots
          .map((entry) => (entry?.syncedAt ? new Date(entry.syncedAt).getTime() : 0))
          .filter((t) => t > 0);
        const latestSynced = syncedAtValues.length > 0 ? new Date(Math.max(...syncedAtValues)) : new Date();
        setPgnText(snapshotText);
        setLastSyncedAt(latestSynced.toLocaleTimeString());
      } catch {
        await syncChessData();
      }
    };
    void loadSnapshot();
    // Initial chess data load should run on page entry; manual sync button handles updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChess, isLocalDev, chessPlatform, selectedPlatforms, selectedPlayers]);

  const parsedChessGames = useMemo(
    () => (isChess && pgnText ? parsePgnHeaders(pgnText) : []),
    [isChess, pgnText]
  );

  const chessSummary = useMemo(
    () => (parsedChessGames.length > 0 ? buildChessSummary(parsedChessGames, selectedPlayers) : null),
    [parsedChessGames, selectedPlayers]
  );
  const coachPerspective = useMemo(
    () => buildPlayerPerspective(parsedChessGames, selectedPlayers),
    [parsedChessGames, selectedPlayers]
  );
  const ratingSeriesWindow = useMemo(() => {
    if (!chessSummary) return [];
    const total = chessSummary.ratingSeries.length;
    if (ratingWindow >= total) return chessSummary.ratingSeries;
    return chessSummary.ratingSeries.slice(-ratingWindow);
  }, [chessSummary, ratingWindow]);
  const signalRowsWindow = useMemo(() => {
    if (!chessSummary) return [];
    const total = chessSummary.signalRows.length;
    if (signalsWindow >= total) return chessSummary.signalRows;
    return chessSummary.signalRows.slice(-signalsWindow);
  }, [chessSummary, signalsWindow]);
  const signalRowsGame = useMemo(() => {
    if (!chessSummary) return [];
    const row = chessSummary.signalRows.find((r) => r.gameNumber === selectedSignalGame);
    return row ? [row] : [];
  }, [chessSummary, selectedSignalGame]);
  const myMovesTrendRows = useMemo(() => {
    if (!chessSummary) return [];
    if (selectedMovesGame < 0) {
      return chessSummary.signalRows.map((row) => ({ game: row.game, myMoves: row.myMoves }));
    }
    const row = chessSummary.signalRows.find((r) => r.gameNumber === selectedMovesGame);
    return row ? [{ game: row.game, myMoves: row.myMoves }] : [];
  }, [chessSummary, selectedMovesGame]);
  const activeSignalRows = signalsViewMode === "game" ? signalRowsGame : signalRowsWindow;
  const trendRowsWindow = useMemo(() => {
    if (!chessSummary) return [];
    return chessSummary.signalRows;
  }, [chessSummary]);
  const latestSignalRow = activeSignalRows[activeSignalRows.length - 1] ?? null;
  const signalsSourceBadge = useMemo(() => {
    if (activeSignalRows.length === 0) return "No Data";
    const exactCount = activeSignalRows.filter((row) => row.source === "exact").length;
    const estimatedCount = activeSignalRows.filter((row) => row.source === "estimated").length;
    if (exactCount === activeSignalRows.length) return "Exact (Lichess Labels)";
    if (estimatedCount === activeSignalRows.length) return "Estimated (Lichess Evals)";
    if (exactCount === 0 && estimatedCount === 0) return "No Data";
    return `Mixed (${exactCount} exact / ${estimatedCount} estimated)`;
  }, [activeSignalRows]);
  const hasSignalSourceData = useMemo(
    () =>
      parsedChessGames.some(
        (g) =>
          g.annotationBlunders +
            g.annotationMistakes +
            g.annotationInaccuracies +
            g.annotationBrilliants +
            g.annotationBestMoves +
            g.annotationExcellentMoves +
            g.annotationGoodMoves +
            g.annotationBookMoves +
            g.annotationMissedWins +
            g.blackBlunders +
            g.blackMistakes +
            g.blackInaccuracies +
            g.blackBrilliants +
            g.blackBestMoves +
            g.blackExcellentMoves +
            g.blackGoodMoves +
            g.blackBookMoves +
            g.blackMissedWins >
          0
      ),
    [parsedChessGames]
  );
  const effectiveAnalysisWindowFromPerspective = useMemo(() => {
    const total = coachPerspective?.games.length ?? 0;
    if (total === 0) return 1;
    if (analysisWindow === -1) return total;
    return Math.max(1, Math.min(analysisWindow, total));
  }, [analysisWindow, coachPerspective]);
  const analysisGamesForCoach = useMemo(() => {
    const games = coachPerspective?.games ?? [];
    if (games.length === 0) return [];
    if (analysisViewMode === "game") {
      const game = games[selectedAnalysisGame - 1];
      return game ? [game] : [games[games.length - 1]];
    }
    if (analysisWindow === -1) return games;
    return games.slice(-effectiveAnalysisWindowFromPerspective);
  }, [analysisViewMode, analysisWindow, coachPerspective, effectiveAnalysisWindowFromPerspective, selectedAnalysisGame]);
  const overviewRows = useMemo<OverviewGameRow[]>(() => {
    const games = coachPerspective?.games ?? [];
    const selectedWindow = OVERVIEW_WINDOWS.find((w) => w.value === overviewWindow);
    const cutoff =
      selectedWindow?.days != null ? Date.now() - selectedWindow.days * 24 * 60 * 60 * 1000 : null;

    return games
      .map((g, i) => ({ ...g, gameNumber: i + 1 }))
      .filter((g) => {
        if (overviewColorFilter === "white" && g.myColor !== "White") return false;
        if (overviewColorFilter === "black" && g.myColor !== "Black") return false;
        if (cutoff == null) return true;
        return g.date ? g.date.getTime() >= cutoff : false;
      });
  }, [coachPerspective, overviewColorFilter, overviewWindow]);
  const overviewRowsDesc = useMemo(
    () =>
      [...overviewRows].sort((a, b) => {
        const ta = a.date ? a.date.getTime() : 0;
        const tb = b.date ? b.date.getTime() : 0;
        if (tb !== ta) return tb - ta;
        return b.gameNumber - a.gameNumber;
      }),
    [overviewRows]
  );
  const overviewStats = useMemo<OverviewStats>(() => {
    const scored = overviewRows.filter((g) => g.myResult === "win" || g.myResult === "draw" || g.myResult === "loss");
    const wins = scored.filter((g) => g.myResult === "win");
    const draws = scored.filter((g) => g.myResult === "draw");
    const losses = scored.filter((g) => g.myResult === "loss");
    const scoredCount = scored.length;
    const avgOppFrom = (rows: OverviewGameRow[]) => {
      const ratings = rows.map((g) => g.oppRating).filter((r): r is number => typeof r === "number");
      if (ratings.length === 0) return null;
      return Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);
    };
    const bestWinByRating = [...wins]
      .filter((g) => typeof g.oppRating === "number")
      .sort((a, b) => (b.oppRating ?? 0) - (a.oppRating ?? 0))[0];
    const bestWin = bestWinByRating ?? wins[0] ?? null;

    let bestStreak = 0;
    let currentStreak = 0;
    let bestStreakEnd: OverviewGameRow | null = null;
    overviewRows.forEach((g) => {
      if (g.myResult === "win") {
        currentStreak += 1;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
          bestStreakEnd = g;
        }
      } else {
        currentStreak = 0;
      }
    });

    return {
      totalGames: overviewRows.length,
      scoredCount,
      wins: wins.length,
      draws: draws.length,
      losses: losses.length,
      winPct: percentOf(wins.length, scoredCount),
      drawPct: percentOf(draws.length, scoredCount),
      lossPct: percentOf(losses.length, scoredCount),
      scorePct: scoredCount > 0 ? ((wins.length + draws.length * 0.5) / scoredCount) * 100 : 0,
      avgOpp: avgOppFrom(overviewRows),
      avgOppWin: avgOppFrom(wins),
      avgOppLoss: avgOppFrom(losses),
      avgOppDraw: avgOppFrom(draws),
      bestWin,
      bestStreak,
      bestStreakEnd,
    };
  }, [overviewRows]);
  const signalCards: Array<{ label: string; field: keyof MoveSignalCounts }> = [
    { label: "Brilliant", field: "brilliants" },
    { label: "Best", field: "bestMoves" },
    { label: "Excellent", field: "excellentMoves" },
    { label: "Good", field: "goodMoves" },
    { label: "Book", field: "bookMoves" },
    { label: "Inaccuracy", field: "inaccuracies" },
    { label: "Mistake", field: "mistakes" },
    { label: "Blunder", field: "blunders" },
    { label: "Missed Win", field: "missedWins" },
  ];
  const visibleSignalCards = useMemo(
    () => signalCards.filter((metric) => (latestSignalRow?.[metric.field] ?? 0) > 0),
    [latestSignalRow]
  );
  useEffect(() => {
    if (!chessSummary || chessSummary.signalRows.length === 0) return;
    const latestGameNumber = chessSummary.signalRows[chessSummary.signalRows.length - 1].gameNumber;
    const hasSelected = chessSummary.signalRows.some((row) => row.gameNumber === selectedSignalGame);
    if (selectedSignalGame < 0 || !hasSelected) {
      setSelectedSignalGame(latestGameNumber);
    }
  }, [chessSummary, selectedSignalGame]);
  useEffect(() => {
    if (!isChess) return;
    setSignalsViewMode("game");
    setSelectedSignalGame(-1);
  }, [chessPlatform, isChess]);
  useEffect(() => {
    if (!chessSummary || chessSummary.signalRows.length === 0) return;
    if (selectedMovesGame < 0) return;
    const hasSelected = chessSummary.signalRows.some((row) => row.gameNumber === selectedMovesGame);
    if (!hasSelected) setSelectedMovesGame(-1);
  }, [chessSummary, selectedMovesGame]);
  useEffect(() => {
    const games = coachPerspective?.games ?? [];
    if (games.length === 0) return;
    const latestGameNumber = games.length;
    if (selectedAnalysisGame < 0 || selectedAnalysisGame > games.length) {
      setSelectedAnalysisGame(latestGameNumber);
    }
  }, [coachPerspective, selectedAnalysisGame]);

  useEffect(() => {
    if (!isChess || analysisGamesForCoach.length === 0) {
      setCoachReport(null);
      return;
    }
    const report = buildAiCoachReport(analysisGamesForCoach);
    setCoachReport(report);
  }, [analysisGamesForCoach, isChess]);

  if (!hobby) {
    return (
      <div className="px-4 pb-20">
        <div className="mx-auto max-w-5xl showcase-card p-6 md:p-8">
          <p className="section-kicker">Hobby</p>
          <h1 className="section-title">Not Found</h1>
          <p className="text-white/70">That hobby page does not exist yet.</p>
          <Link to="/#hobbies" className="showcase-cta-primary mt-5 inline-flex">
            Back to Hobbies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="mx-auto max-w-5xl space-y-6">
        {isChess ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl border border-white/15 bg-[#0b1320] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                {(["lichess", "chesscom", "all"] as ChessPlatform[]).map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setChessPlatform(platform)}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      chessPlatform === platform
                        ? "bg-cyan-300/20 text-cyan-100 border border-cyan-300/35"
                        : "text-white/70 hover:bg-white/8"
                    }`}
                  >
                    {CHESS_PLATFORM_LABEL[platform]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <a
                href="https://chessreps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-200/85 hover:text-cyan-100 underline underline-offset-4 transition"
              >
                ChessReps.com
              </a>
            </div>
          </div>
        ) : isMusic ? (
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl border border-white/15 bg-[#0b1320] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              {MUSIC_DISCIPLINE_VIEWS.map((view) => (
                <button
                  key={view.key}
                  type="button"
                  onClick={() => setMusicDiscipline(view.key)}
                  className={`rounded-lg px-4 py-2 text-sm transition ${
                    musicDiscipline === view.key
                      ? "bg-cyan-300/20 text-cyan-100 border border-cyan-300/35"
                      : "text-white/70 hover:bg-white/8"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <section className="showcase-card p-6 md:p-8">
          {!isChess ? <p className="section-kicker mb-2">Hobby Detail</p> : null}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              {!isChess ? <h1 className="section-title">{hobby.title}</h1> : null}
              {!isChess ? <p className="text-white/70">{hobby.summary}</p> : null}
            </div>
            {isChess ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wider ${
                  syncStatus === "ok"
                    ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
                    : syncStatus === "syncing"
                      ? "border-cyan-300/45 bg-cyan-300/12 text-cyan-100"
                      : syncStatus === "error"
                        ? "border-rose-300/45 bg-rose-300/12 text-rose-100"
                        : "border-white/20 bg-white/5 text-white/70"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    syncStatus === "ok"
                      ? "bg-emerald-300"
                      : syncStatus === "syncing"
                        ? "bg-cyan-300"
                        : syncStatus === "error"
                          ? "bg-rose-300"
                          : "bg-white/50"
                  }`}
                />
                {syncStatus === "ok"
                  ? "Synced"
                  : syncStatus === "syncing"
                    ? "Syncing"
                    : syncStatus === "error"
                      ? "Sync Failed"
                      : "Not Synced"}
              </span>
            ) : (
              <Link to="/#hobbies" className="showcase-cta-secondary">
                Back to Hobbies
              </Link>
            )}
          </div>
          {!isChess && hobby.description ? (
            <p className="text-white/75 mt-4 max-w-3xl">{hobby.description}</p>
          ) : null}
          {!isChess && hobby.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {hobby.tags.map((tag) => (
                <span key={tag} className="showcase-chip">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {isMusic ? (
            <div className="mt-5 space-y-3">
              {(() => {
                const active = MUSIC_DISCIPLINE_VIEWS.find((view) => view.key === musicDiscipline);
                if (!active) return null;
                return (
                  <article className="showcase-inner-card">
                    <p className="section-kicker mb-1">Music Dashboard</p>
                    <h2 className="text-2xl font-semibold text-white/95">{active.label}</h2>
                    <p className="text-white/70 mt-1">{active.subtitle}</p>
                    <ul className="mt-3 text-sm text-white/78 space-y-1.5 list-disc list-inside">
                      {active.bullets.map((item) => (
                        <li key={`${active.key}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  </article>
                );
              })()}
            </div>
          ) : null}

          {isChess ? (
            <div>
            <div className="mb-2">
              <h2 className="section-title">Dashboards</h2>
            </div>
            {lastSyncedAt ? (
              <p className="text-xs text-white/50 -mt-1 mb-3">
                Last synced: {lastSyncedAt}
              </p>
            ) : null}
            {chessPlatform !== "lichess" ? (
              <p className="text-xs text-amber-200/80 -mt-1 mb-2">
                Chess.com is connected via a free account. Advanced review/signal tags are limited, so Chess.com data includes fewer analysis labels.
              </p>
            ) : null}
            {pgnLoading ? <p className="text-white/65">Loading PGN data...</p> : null}
            {pgnError ? <p className="text-red-300/85">{pgnError}</p> : null}
            {!pgnLoading && chessSummary ? (
              <div className="space-y-4">
                <article className="showcase-inner-card overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <p className="text-sm font-semibold text-white/90">Performance Overview</p>
                      <p className="text-xs text-white/55">{overviewStats.totalGames} games</p>
                    </div>
                    <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
                      {OVERVIEW_WINDOWS.map((window) => (
                        <button
                          key={window.value}
                          type="button"
                          onClick={() => setOverviewWindow(window.value)}
                          className={`rounded-md px-2.5 py-1 text-xs transition ${
                            overviewWindow === window.value
                              ? "bg-white/15 text-white"
                              : "text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {window.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
                      {([
                        { key: "all", label: "All Games" },
                        { key: "white", label: "White" },
                        { key: "black", label: "Black" },
                      ] as Array<{ key: OverviewColorFilter; label: string }>).map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setOverviewColorFilter(tab.key)}
                          className={`rounded-md px-3 py-1.5 text-xs sm:text-sm transition ${
                            overviewColorFilter === tab.key
                              ? "bg-white/15 text-white"
                              : "text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-[#0a101b]/75 p-4">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="flex h-full w-full">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${overviewStats.winPct}%` }}
                        />
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${overviewStats.lossPct}%` }}
                        />
                        <div
                          className="h-full bg-slate-300/80"
                          style={{ width: `${overviewStats.drawPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-semibold text-emerald-300">{overviewStats.wins}</p>
                        <p className="text-sm font-medium text-emerald-300">{overviewStats.winPct.toFixed(0)}% Win</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-red-400">{overviewStats.losses}</p>
                        <p className="text-sm font-medium text-red-400">{overviewStats.lossPct.toFixed(0)}% Loss</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-slate-200">{overviewStats.draws}</p>
                        <p className="text-sm font-medium text-slate-200">{overviewStats.drawPct.toFixed(0)}% Draw</p>
                      </div>
                    </div>
                    {chessPlatform !== "all" ? (
                      <div className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-white/55 inline-flex items-center gap-1.5">
                              Best Win
                              <HoverHelp text="Highest-rated opponent you defeated in the selected range." />
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-white">
                              {overviewStats.bestWin?.oppRating ?? "-"}
                            </p>
                            <p className="text-sm text-white/80">
                              {overviewStats.bestWin?.oppName ?? "No win in selected range"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-white/55 inline-flex items-center gap-1.5">
                              Best Streak
                              <HoverHelp text="Longest consecutive win run in the selected range. Date shown is when that streak ended." />
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-white">{overviewStats.bestStreak}</p>
                            <p className="text-sm text-white/80">
                              {overviewStats.bestStreakEnd
                                ? formatShortDate(overviewStats.bestStreakEnd.date)
                                : "No streak yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-4 rounded-xl border border-white/10 bg-[#0a101b]/75">
                    <div className="flex items-center border-b border-white/10 px-4 py-2.5">
                      <p className="text-sm font-semibold text-white/90">Completed Games</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {overviewRowsDesc.length > 0 ? (
                        overviewRowsDesc.map((game) => (
                          <div
                            key={`overview-row-${game.gameNumber}`}
                            className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5 last:border-b-0"
                          >
                            <div className="min-w-0 flex items-center gap-3">
                              <span className="text-sm font-semibold text-white/65 w-8 shrink-0">
                                {game.gameNumber}.
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm text-white/90">
                                  {game.oppName} {typeof game.oppRating === "number" ? `(${game.oppRating})` : ""}
                                </p>
                                <p className="text-xs text-white/55">
                                  {formatShortDate(game.date)} · {game.myColor} · {formatShortTime(game.date)}
                                  {chessPlatform === "all"
                                    ? ` · ${accountToPlatformLabel(game.myAccount)}`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                                  game.myResult === "win"
                                    ? "border-emerald-300/55 bg-emerald-300/20 text-emerald-200"
                                    : game.myResult === "loss"
                                      ? "border-red-300/70 bg-red-500/35 text-red-100"
                                      : game.myResult === "draw"
                                        ? "border-slate-300/35 bg-slate-300/15 text-slate-100"
                                        : "border-white/20 bg-white/5 text-white/65"
                                }`}
                              >
                                {game.myResult === "win"
                                  ? "+"
                                  : game.myResult === "loss"
                                    ? "-"
                                  : game.myResult === "draw"
                                      ? "="
                                      : "?"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-white/55">No games in this filter yet.</p>
                      )}
                    </div>
                  </div>
                </article>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3">
                  <article
                    className="showcase-inner-card xl:col-span-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">White Win %</p>
                    <p className="text-2xl font-semibold mt-1 text-white/95">
                      {chessSummary.whiteWinRate.toFixed(0)}%
                    </p>
                  </article>
                  <article
                    className="showcase-inner-card xl:col-span-6"
                  >
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Black Win %</p>
                    <p className="text-2xl font-semibold mt-1 text-white/95">
                      {chessSummary.blackWinRate.toFixed(0)}%
                    </p>
                  </article>

                </div>

                {chessPlatform !== "all" ? (
                  <>
                    <div className="showcase-inner-card">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                          Rating Trend
                          <HoverHelp text="Tracks rating trajectory over time. A flat trend with fewer drops is often better than volatile spikes." />
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRatingWindow((w) => Math.max(10, w - 10))}
                            className="h-7 w-7 rounded border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                            aria-label="Zoom in rating trend"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRatingWindow((w) =>
                                Math.min(chessSummary.ratingSeries.length, w + 10)
                              )
                            }
                            className="h-7 w-7 rounded border border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                            aria-label="Zoom out rating trend"
                          >
                            -
                          </button>
                        </div>
                      </div>
                      <MiniLineChart series={ratingSeriesWindow} />
                    </div>

                    <div className="showcase-inner-card py-2 px-3">
                      <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm">
                        <p className="text-white/70">
                          Start:{" "}
                          <span className="text-white/95 font-semibold">
                            {ratingSeriesWindow[0]?.rating ?? "-"}
                          </span>
                        </p>
                        <p className="text-white/70 text-center">
                          Peak:{" "}
                          <span className="text-white/95 font-semibold">
                            {ratingSeriesWindow.length > 0
                              ? Math.max(...ratingSeriesWindow.map((r) => r.rating))
                              : "-"}
                          </span>
                        </p>
                        <p className="text-white/70 text-right">
                          Latest:{" "}
                          <span className="text-white/95 font-semibold">
                            {ratingSeriesWindow[ratingSeriesWindow.length - 1]?.rating ?? "-"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}

                <article className="showcase-inner-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                      Your Moves Trend
                      <HoverHelp text="Tracks your move count per game over time. Hover each point for exact date and moves." />
                    </p>
                    <select
                      value={selectedMovesGame}
                      onChange={(e) => setSelectedMovesGame(Number(e.target.value))}
                      className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                    >
                      <option value={-1}>All Games</option>
                      {[...chessSummary.signalRows]
                        .sort((a, b) => b.gameNumber - a.gameNumber)
                        .map((row) => (
                          <option key={`moves-game-${row.gameNumber}`} value={row.gameNumber}>
                            {`Game ${row.gameNumber} (${row.game})`}
                          </option>
                        ))}
                    </select>
                  </div>
                  <MyMovesTrendChart rows={myMovesTrendRows} />
                </article>

                <div className="grid grid-cols-1 gap-3">
                  <article className="showcase-inner-card">
                    <p className="text-sm uppercase tracking-wider text-white/60 mb-2 inline-flex items-center gap-2">
                      Openings Used
                      <HoverHelp text="Opening families inferred from ECO codes to show what you're using most often." />
                    </p>
                    <div className="space-y-2 flex-1">
                      {chessSummary.openingTypeRows.length > 0 ? (
                        chessSummary.openingTypeRows.map((row) => (
                          <div key={row.label}>
                            <div className="flex items-center justify-between text-sm text-white/80">
                              <span className="inline-flex items-center gap-1.5">
                                {row.label}
                                <HoverHelp text={openingMoveHint(row.label)} />
                              </span>
                              <span>{row.games} games · {row.winRate.toFixed(0)}% win rate</span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-white/10">
                              <div
                                className="h-2 rounded-full bg-indigo-300/80"
                                style={{ width: `${Math.max(4, row.winRate)}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/55 text-sm">No opening usage data yet.</p>
                      )}
                    </div>
                    <div className="mt-3 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-4 py-3.5 min-h-24">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-rose-100/75">Flagged Out</p>
                          <p className="text-2xl leading-tight font-semibold text-rose-50 mt-1">
                            {chessSummary.myTimeForfeits}
                          </p>
                        </div>
                        <div className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3.5 min-h-24">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-100/75">Flagged Opponent</p>
                          <p className="text-2xl leading-tight font-semibold text-emerald-50 mt-1">
                            {chessSummary.opponentTimeForfeits}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <article className="showcase-inner-card">
                  <p className="text-sm uppercase tracking-wider text-white/60 mb-2">Move Quality Key</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-sm">
                    <div className="rounded-lg border border-sky-300/20 bg-sky-300/10 px-3 py-2.5">
                      <p className="text-sky-100 font-semibold">Inaccuracy</p>
                      <p className="text-white/75 mt-1">
                        A small miss. The move is playable, but a better option was available.
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2.5">
                      <p className="text-amber-100 font-semibold">Mistake</p>
                      <p className="text-white/75 mt-1">
                        A clear error. It worsens your position noticeably.
                      </p>
                    </div>
                    <div className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-3 py-2.5">
                      <p className="text-rose-100 font-semibold">Blunder</p>
                      <p className="text-white/75 mt-1">
                        A major error. It often loses large advantage, material, or the game.
                      </p>
                    </div>
                  </div>
                </article>

                {chessPlatform === "lichess" ? (
                  <>
                    <article className="showcase-inner-card">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                          Signals
                          <HoverHelp text="Uses platform-provided labels when present; falls back to eval tags when available. Badge shows Exact vs Estimated." />
                        </p>
                        <div className="flex items-center gap-2">
                          <select
                            value={signalsViewMode}
                            onChange={(e) => setSignalsViewMode(e.target.value as "window" | "game")}
                            className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                          >
                            <option value="window">Totals</option>
                            <option value="game">Single Game</option>
                          </select>
                          {signalsViewMode === "game" ? (
                            <select
                              value={selectedSignalGame}
                              onChange={(e) => setSelectedSignalGame(Number(e.target.value))}
                              className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                            >
                              {[...chessSummary.signalRows]
                                .sort((a, b) => b.gameNumber - a.gameNumber)
                                .map((row) => (
                                  <option key={`signal-game-${row.gameNumber}`} value={row.gameNumber}>
                                    {`Game ${row.gameNumber} (${row.game})`}
                                  </option>
                                ))}
                            </select>
                          ) : null}
                          <span className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                            {signalsSourceBadge}
                          </span>
                          {signalsViewMode === "window" ? (
                            <select
                              value={signalsWindow}
                              onChange={(e) => setSignalsWindow(Number(e.target.value))}
                              className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                            >
                              {WINDOW_OPTIONS.map((n) => (
                                <option key={n} value={n}>
                                  {n === 1 ? "Most Recent Game" : `Last ${n} Games`}
                                </option>
                              ))}
                            </select>
                          ) : null}
                        </div>
                      </div>
                      {!hasSignalSourceData ? (
                        <p className="mb-3 text-xs text-amber-200/85">
                          No analysis signal tags found in the current snapshot yet. Signals populate from labels first, then eval tags.
                        </p>
                      ) : null}
                      <div className="mb-3 flex flex-wrap justify-center gap-2">
                        {visibleSignalCards.map((metric) => (
                          <div
                            key={metric.field}
                            className="w-[10.5rem] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
                          >
                            <p className="text-[11px] uppercase tracking-wider text-white/55">{metric.label}</p>
                            <p className="text-white/90 font-semibold">{latestSignalRow?.[metric.field] ?? 0}</p>
                          </div>
                        ))}
                        {visibleSignalCards.length === 0 ? (
                          <div className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/65">
                            No signals detected for the latest game in this window.
                          </div>
                        ) : null}
                        <div className="w-[10.5rem] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                          <p className="text-[11px] uppercase tracking-wider text-white/55">Avg Blunders / Game</p>
                          <p className="text-white/90 font-semibold">
                            {activeSignalRows.length > 0
                              ? (
                                  activeSignalRows.reduce((sum, row) => sum + row.blunders, 0) /
                                  activeSignalRows.length
                                ).toFixed(2)
                              : "0.00"}
                          </p>
                        </div>
                      </div>
                      <MiniSignalsChart rows={activeSignalRows} />
                    </article>

                    <article className="showcase-inner-card">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                          Blunder Trend
                          <HoverHelp text="Trend line for blunders across your full game history." />
                        </p>
                        <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white/65">
                          All Games
                        </span>
                      </div>
                      <BlunderTrendChart rows={trendRowsWindow} />
                    </article>
                  </>
                ) : chessPlatform === "chesscom" ? (
                  <article className="showcase-inner-card">
                    <p className="text-sm uppercase tracking-wider text-white/60">Signals</p>
                    <p className="mt-2 text-sm text-white/65">
                      Signal and blunder-trend tables are hidden for Chess.com view because this account is on the free tier and those review tags are often unavailable.
                    </p>
                  </article>
                ) : null}

                <article className="showcase-inner-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                      AI Coach
                      <HoverHelp text="Coach output is derived from your recent games and emphasizes recurring patterns, not generic advice." />
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={analysisViewMode}
                        onChange={(e) => setAnalysisViewMode(e.target.value as "window" | "game")}
                        className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                      >
                        <option value="window">Totals</option>
                        <option value="game">Single Game</option>
                      </select>
                      {analysisViewMode === "game" ? (
                        <select
                          value={selectedAnalysisGame}
                          onChange={(e) => setSelectedAnalysisGame(Number(e.target.value))}
                          className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                        >
                          {(coachPerspective?.games ?? [])
                            .map((g, i) => ({
                              gameNumber: i + 1,
                              game: g.date ? formatLocalYmd(g.date) : `Game ${i + 1}`,
                            }))
                            .reverse()
                            .map((row) => (
                              <option key={`coach-game-${row.gameNumber}`} value={row.gameNumber}>
                                {`Game ${row.gameNumber} (${row.game})`}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <select
                          value={analysisWindow}
                          onChange={(e) => setAnalysisWindow(Number(e.target.value))}
                          className="rounded-lg border border-white/15 bg-[#0b1320] px-2.5 py-1.5 text-sm text-white/85"
                        >
                          <option value={1}>Most Recent Game</option>
                          {WINDOW_OPTIONS.filter((n) => n > 1).map((n) => (
                            <option key={`coach-window-${n}`} value={n}>
                              {`Last ${n} Games`}
                            </option>
                          ))}
                          <option value={-1}>All Games</option>
                        </select>
                      )}
                    </div>
                  </div>
                  {coachReport ? (
                    <div className="space-y-2.5 text-sm text-white/80">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-wider text-white/55 mb-1">Position</p>
                          <p>{coachReport.summary}</p>
                        </div>
                        <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-wider text-white/55 mb-1">Primary Focus</p>
                          <p>{coachReport.focus}</p>
                        </div>
                      </div>
                      <div className="rounded-md border border-cyan-300/20 bg-cyan-300/5 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wider text-cyan-100/80 mb-1">
                          What To Improve Right Now
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-white/80">
                          {coachReport.quickFixes.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-white/72">
                        {coachReport.checklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-[11px] uppercase tracking-wider text-cyan-100/70 mb-2">
                          Coach Signal Board
                        </p>
                        <div className="space-y-2">
                          {coachReport.visuals.map((signal) => (
                            <div key={signal.label}>
                              <div className="flex items-center justify-between text-xs text-white/75">
                                <span className="inline-flex items-center gap-1.5">
                                  {signal.label}
                                  <HoverHelp text={signal.hint} />
                                </span>
                                <span>{signal.value}%</span>
                              </div>
                              <div className="mt-1 h-2 rounded-full bg-white/10">
                                <div
                                  className="h-2 rounded-full bg-cyan-300/75"
                                  style={{ width: `${Math.max(4, signal.value)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-[11px] uppercase tracking-wider text-cyan-100/70 mb-1">
                          Secret Insights
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-white/75">
                          {coachReport.secretInsights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">
                      Loading coach analysis from your latest synced games.
                    </p>
                  )}
                </article>
              </div>
            ) : !pgnLoading && !chessSummary ? (
              <div className="showcase-inner-card">
                <p className="text-white/70">
                  No parsed chess data yet. Wait for daily sync or check Supabase setup.
                </p>
              </div>
            ) : null}
            </div>
          ) : null}
        </section>

        {!isChess && hobby.links && hobby.links.length > 0 ? (
          <section className="showcase-card p-6 md:p-8">
            <p className="section-kicker">Links</p>
            <h2 className="section-title">Profiles & More</h2>
            <div className="flex flex-wrap gap-3">
              {hobby.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="showcase-cta-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {!isChess ? (
          <section className="showcase-card p-6 md:p-8">
            <p className="section-kicker">Media</p>
            <h2 className="section-title">Photos & Videos</h2>
            {hobby.media && hobby.media.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hobby.media.map((item, idx) => (
                  <article key={`${item.src}-${idx}`} className="showcase-inner-card">
                    {item.type === "image" ? (
                      <img src={item.src} alt={item.caption ?? hobby.title} className="w-full rounded-lg" />
                    ) : (
                      <video src={item.src} controls className="w-full rounded-lg" />
                    )}
                    {item.caption ? <p className="text-sm text-white/70 mt-2">{item.caption}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="showcase-inner-card">
                <p className="text-white/75">
                  Add media files in `public/hobbies/{hobby.slug}/` and update this hobby entry in
                  `src/components/hobbies/content/HobbiesData.ts`.
                </p>
              </div>
            )}
          </section>
        ) : null}

      </div>
    </div>
  );
}
