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
  moveCount: number;
  annotationBlunders: number;
  annotationMistakes: number;
  annotationInaccuracies: number;
  annotationBrilliants: number;
  blackBlunders: number;
  blackMistakes: number;
  blackInaccuracies: number;
  blackBrilliants: number;
};

type PlayerChessGame = {
  date: Date | null;
  myColor: "White" | "Black";
  myResult: "win" | "draw" | "loss";
  myRating: number | null;
  oppRating: number | null;
  eco: string;
  timeControl: string;
  termination: string;
  moveCount: number;
  annotationBlunders: number;
  annotationMistakes: number;
  annotationInaccuracies: number;
  annotationBrilliants: number;
};

type ChessSummary = {
  player: string;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  whiteGames: number;
  blackGames: number;
  whiteWinRate: number;
  blackWinRate: number;
  avgOpponent: number | null;
  ratingSeries: Array<{ label: string; rating: number }>;
  openingRows: Array<{ eco: string; games: number; winRate: number }>;
  openingTypeRows: Array<{ label: string; games: number; winRate: number }>;
  gameResults: Array<"W" | "D" | "L">;
  signalRows: Array<{
    game: string;
    blunders: number;
    mistakes: number;
    inaccuracies: number;
    brilliants: number;
  }>;
  totalBlunders: number;
  totalMistakes: number;
  totalInaccuracies: number;
  totalBrilliants: number;
  avgBlundersPerGame: number;
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

const WINDOW_OPTIONS = [1, 2, 3, 4, 5, 10, 20, 30, 50];

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

function parseEvalToken(token: string) {
  if (!token) return null;
  if (token.startsWith("#")) {
    if (token.startsWith("#-")) return -10;
    return 10;
  }
  const n = Number.parseFloat(token);
  return Number.isFinite(n) ? n : null;
}

function parseMoveQualityFromAnnotations(movesText: string) {
  const cleaned = movesText
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ");
  const movePattern = /(\d+)\.\s*([^\s]+)(?:\s+([^\s]+))?/g;

  let whiteBlunders = 0;
  let whiteMistakes = 0;
  let whiteInaccuracies = 0;
  let whiteBrilliants = 0;
  let blackBlunders = 0;
  let blackMistakes = 0;
  let blackInaccuracies = 0;
  let blackBrilliants = 0;

  const applyToken = (token: string | undefined, side: "white" | "black") => {
    if (!token) return;
    if (token === "1-0" || token === "0-1" || token === "1/2-1/2" || token === "*") return;
    const suffix = (token.match(/([!?]{1,2})$/)?.[1] ?? "").trim();
    if (!suffix) return;

    const add = (kind: "blunder" | "mistake" | "inaccuracy" | "brilliant") => {
      if (side === "white") {
        if (kind === "blunder") whiteBlunders += 1;
        if (kind === "mistake") whiteMistakes += 1;
        if (kind === "inaccuracy") whiteInaccuracies += 1;
        if (kind === "brilliant") whiteBrilliants += 1;
      } else {
        if (kind === "blunder") blackBlunders += 1;
        if (kind === "mistake") blackMistakes += 1;
        if (kind === "inaccuracy") blackInaccuracies += 1;
        if (kind === "brilliant") blackBrilliants += 1;
      }
    };

    if (suffix === "??") add("blunder");
    else if (suffix === "?!") add("inaccuracy");
    else if (suffix === "?") add("mistake");
    else if (suffix === "!!") add("brilliant");
  };

  let match = movePattern.exec(cleaned);
  while (match) {
    applyToken(match[2], "white");
    applyToken(match[3], "black");
    match = movePattern.exec(cleaned);
  }

  return {
    whiteBlunders,
    whiteMistakes,
    whiteInaccuracies,
    blackBlunders,
    blackMistakes,
    blackInaccuracies,
    whiteBrilliants,
    blackBrilliants,
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
  let blackBlunders = 0;
  let blackMistakes = 0;
  let blackInaccuracies = 0;
  let whiteBrilliants = 0;
  let blackBrilliants = 0;

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
    } else if (swing >= 2.0) {
      if (mover === "white") whiteBrilliants += 1;
      else blackBrilliants += 1;
    }
  }

  return {
    hasEvalData: evals.length >= 2,
    whiteBlunders,
    whiteMistakes,
    whiteInaccuracies,
    blackBlunders,
    blackMistakes,
    blackInaccuracies,
    whiteBrilliants,
    blackBrilliants,
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
    const parsedDate = dateRaw
      ? new Date(dateRaw.replace(/\./g, "-"))
      : null;
    const toNumber = (v: string) => {
      const n = Number.parseInt(v, 10);
      return Number.isFinite(n) ? n : null;
    };

    const movesText = chunk
      .split(/\r?\n/)
      .filter((line) => !line.startsWith("["))
      .join(" ");
    const evalQuality = parseMoveQualityFromEvals(movesText);
    const annotationQuality = parseMoveQualityFromAnnotations(movesText);
    const quality = evalQuality.hasEvalData ? evalQuality : annotationQuality;

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
      moveCount: (chunk.match(/\b\d+\.(?!\.)/g) ?? []).length,
      annotationBlunders: quality.whiteBlunders,
      annotationMistakes: quality.whiteMistakes,
      annotationInaccuracies: quality.whiteInaccuracies,
      annotationBrilliants: quality.whiteBrilliants,
      blackBlunders: quality.blackBlunders,
      blackMistakes: quality.blackMistakes,
      blackInaccuracies: quality.blackInaccuracies,
      blackBrilliants: quality.blackBrilliants,
    };
  });
}

function buildPlayerPerspective(games: ParsedChessGame[]) {
  if (games.length === 0) return null;

  const counts = new Map<string, number>();
  games.forEach((g) => {
    if (g.white) counts.set(g.white, (counts.get(g.white) ?? 0) + 1);
    if (g.black) counts.set(g.black, (counts.get(g.black) ?? 0) + 1);
  });
  const player = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!player) return null;

  const scoped = games
    .filter((g) => g.white === player || g.black === player)
    .sort((a, b) => {
      const ta = a.date ? a.date.getTime() : 0;
      const tb = b.date ? b.date.getTime() : 0;
      return ta - tb;
    });

  const myGames: PlayerChessGame[] = scoped.map((g) => {
    const isWhite = g.white === player;
    const myResult: "win" | "draw" | "loss" =
      g.result === "1/2-1/2"
        ? "draw"
        : (isWhite && g.result === "1-0") || (!isWhite && g.result === "0-1")
          ? "win"
          : "loss";

    return {
      date: g.date,
      myColor: isWhite ? "White" : "Black",
      myResult,
      myRating: isWhite ? g.whiteElo : g.blackElo,
      oppRating: isWhite ? g.blackElo : g.whiteElo,
      eco: g.eco,
      timeControl: g.timeControl,
      termination: g.termination,
      moveCount: g.moveCount,
      annotationBlunders: isWhite ? g.annotationBlunders : g.blackBlunders,
      annotationMistakes: isWhite ? g.annotationMistakes : g.blackMistakes,
      annotationInaccuracies: isWhite ? g.annotationInaccuracies : g.blackInaccuracies,
      annotationBrilliants: isWhite ? g.annotationBrilliants : g.blackBrilliants,
    };
  });

  return { player, games: myGames };
}

function buildChessSummary(games: ParsedChessGame[]): ChessSummary | null {
  const perspective = buildPlayerPerspective(games);
  if (!perspective) return null;
  const { player } = perspective;
  const scoped = perspective.games;

  let wins = 0;
  let draws = 0;
  let losses = 0;
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
  let totalBlunders = 0;
  let totalMistakes = 0;
  let totalInaccuracies = 0;
  let totalBrilliants = 0;
  const signalRows: Array<{
    game: string;
    blunders: number;
    mistakes: number;
    inaccuracies: number;
    brilliants: number;
  }> = [];

  const toResult = (g: PlayerChessGame) => {
    if (g.myColor === "White") whiteGames += 1;
    else blackGames += 1;

    if (typeof g.oppRating === "number") {
      opponentSum += g.oppRating;
      opponentCount += 1;
    }
    if (typeof g.myRating === "number") {
      ratingSeries.push({
        label: g.date ? g.date.toISOString().slice(0, 10) : `${ratingSeries.length + 1}`,
        rating: g.myRating,
      });
    }

    if (g.myResult === "win") {
      wins += 1;
      gameResults.push("W");
      if (g.myColor === "White") whiteWins += 1;
      else blackWins += 1;
    } else if (g.myResult === "draw") {
      draws += 1;
      gameResults.push("D");
    } else {
      losses += 1;
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

    totalBlunders += g.annotationBlunders;
    totalMistakes += g.annotationMistakes;
    totalInaccuracies += g.annotationInaccuracies;
    totalBrilliants += g.annotationBrilliants;
    signalRows.push({
      game: g.date ? g.date.toISOString().slice(0, 10) : `Game ${signalRows.length + 1}`,
      blunders: g.annotationBlunders,
      mistakes: g.annotationMistakes,
      inaccuracies: g.annotationInaccuracies,
      brilliants: g.annotationBrilliants,
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
    totalBlunders,
    totalMistakes,
    totalInaccuracies,
    totalBrilliants,
    avgBlundersPerGame,
    insights,
  };
}

function buildAiCoachReport(games: ParsedChessGame[], sampleSize: number): CoachReport | null {
  const perspective = buildPlayerPerspective(games);
  if (!perspective || perspective.games.length === 0) return null;

  const recent = perspective.games.slice(-sampleSize);
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
  const points = series
    .map((s, i) => {
      const x = leftAxisPad + i * stepX;
      const y = plotH + pad - ((s.rating - min) / range) * plotH;
      return `${x},${y}`;
    })
    .join(" ");
  const horizontalGrid = 4;
  const verticalGrid = 6;
  const yTicks = Array.from({ length: horizontalGrid + 1 }).map((_, i) => {
    const t = i / horizontalGrid;
    return Math.round(max - t * (max - min));
  });
  const startLabel = series[0]?.label ?? "";
  const midLabel = series[Math.floor(series.length / 2)]?.label ?? "";
  const endLabel = series[series.length - 1]?.label ?? "";

  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1320] p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        <text x="10" y="18" fill="rgba(203,213,225,0.75)" fontSize="10">
          Rating
        </text>
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
          points={points}
        />
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

function MiniSignalsChart({
  rows,
}: {
  rows: Array<{
    game: string;
    blunders: number;
    mistakes: number;
    inaccuracies: number;
    brilliants: number;
  }>;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/55">No move-quality data available yet.</p>;
  }

  const totals = rows.reduce(
    (acc, row) => {
      acc.blunders += row.blunders;
      acc.mistakes += row.mistakes;
      acc.inaccuracies += row.inaccuracies;
      acc.brilliants += row.brilliants;
      return acc;
    },
    { blunders: 0, mistakes: 0, inaccuracies: 0, brilliants: 0 }
  );
  const data = [
    { label: "Blunders", value: totals.blunders, color: "rgba(251,113,133,0.92)" },
    { label: "Mistakes", value: totals.mistakes, color: "rgba(251,191,36,0.92)" },
    { label: "Inaccuracies", value: totals.inaccuracies, color: "rgba(96,165,250,0.92)" },
    { label: "Brilliants", value: totals.brilliants, color: "rgba(110,231,183,0.92)" },
  ];
  const width = 760;
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
                height={Math.max(2, h)}
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
        <text x={8} y={18} fill="rgba(203,213,225,0.75)" fontSize="10">
          Total Count
        </text>
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

function BlunderTrendChart({
  rows,
}: {
  rows: Array<{
    game: string;
    blunders: number;
    mistakes: number;
    inaccuracies: number;
    brilliants: number;
  }>;
}) {
  if (rows.length < 2) {
    return <p className="text-sm text-white/55">Need at least 2 games for a blunder trend.</p>;
  }
  const width = 760;
  const height = 180;
  const pad = 16;
  const leftAxisPad = 44;
  const bottomAxisPad = 26;
  const plotW = width - leftAxisPad - pad;
  const plotH = height - bottomAxisPad - pad;
  const maxVal = Math.max(...rows.map((r) => r.blunders), 1);
  const stepX = plotW / (rows.length - 1);
  const points = rows
    .map((r, i) => `${leftAxisPad + i * stepX},${plotH + pad - (r.blunders / maxVal) * plotH}`)
    .join(" ");
  const yTicks = Array.from({ length: 4 }).map((_, i) => Math.round(maxVal - (i * maxVal) / 3));

  return (
    <div className="rounded-lg border border-white/10 bg-[#0b1320] p-2 mt-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
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
            <text key={`bt-yt-${tick}-${i}`} x="12" y={y} fill="rgba(203,213,225,0.72)" fontSize="10">
              {tick}
            </text>
          );
        })}
        <polyline fill="none" stroke="rgba(251,113,133,0.95)" strokeWidth="2.2" points={points} />
        <line
          x1={leftAxisPad}
          y1={plotH + pad}
          x2={leftAxisPad + plotW}
          y2={plotH + pad}
          stroke="rgba(148,163,184,0.35)"
          strokeWidth="1"
        />
        <text x={leftAxisPad} y={height - 8} fill="rgba(203,213,225,0.72)" fontSize="10">
          {rows[0]?.game}
        </text>
        <text
          x={leftAxisPad + plotW}
          y={height - 8}
          fill="rgba(203,213,225,0.72)"
          fontSize="10"
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
  const [pgnText, setPgnText] = useState("");
  const [pgnLoading, setPgnLoading] = useState(false);
  const [pgnError, setPgnError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [syncSource, setSyncSource] = useState<string>("");
  const [analysisWindow, setAnalysisWindow] = useState<number>(1);
  const [signalsWindow, setSignalsWindow] = useState<number>(1);
  const [coachReport, setCoachReport] = useState<CoachReport | null>(null);
  const [ratingWindow, setRatingWindow] = useState<number>(60);
  const lichessUsername = "zaibao1";
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

  const syncChessData = async () => {
    if (!isChess) return;
    setPgnLoading(true);
    setPgnError("");
    setCoachReport(null);

    const username = lichessUsername;
    const snapshotUrl = `/api/chess-sync?username=${encodeURIComponent(username)}&max=220`;
    const directUrl = `https://lichess.org/api/games/user/${encodeURIComponent(
      username
    )}?max=220&opening=true&moves=true&evals=true&pgnInJson=false&format=pgn`;

    try {
      if (isLocalDev) {
        const directRes = await fetch(directUrl, {
          headers: { Accept: "application/x-chess-pgn,text/plain;q=0.9,*/*;q=0.8" },
        });
        if (!directRes.ok) {
          setPgnError("Live sync failed in local dev. Lichess request returned an error.");
          setPgnText("");
          setPgnLoading(false);
          return;
        }
        const directText = await directRes.text();
        if (!directText.trim() || !isValidPgn(directText)) {
          setPgnError("Live sync failed in local dev. No valid PGN returned.");
          setPgnText("");
          setPgnLoading(false);
          return;
        }
        setPgnText(directText);
        setLastSyncedAt(new Date().toLocaleTimeString());
        setSyncSource(`Direct Lichess (${username})`);
        setPgnLoading(false);
        return;
      }

      // Preferred path: sync to Supabase snapshot via API route.
      const snapshotRes = await fetch(snapshotUrl, { headers: { Accept: "application/json" } });
      if (snapshotRes.ok) {
        const data = await snapshotRes.json();
        if (data?.pgn && isValidPgn(data.pgn)) {
          setPgnText(data.pgn);
          setLastSyncedAt(
            data.syncedAt
              ? new Date(data.syncedAt).toLocaleTimeString()
              : new Date().toLocaleTimeString()
          );
          setSyncSource(`Supabase snapshot (${username})`);
          setPgnLoading(false);
          return;
        }
      }

      // Local dev fallback: direct Lichess fetch (not persisted).
      const directRes = await fetch(directUrl, {
        headers: { Accept: "application/x-chess-pgn,text/plain;q=0.9,*/*;q=0.8" },
      });
      if (!directRes.ok) {
        setPgnError("Live sync failed. API route and direct Lichess request both failed.");
        setPgnText("");
        setPgnLoading(false);
        return;
      }
      const directText = await directRes.text();
      if (!directText.trim() || !isValidPgn(directText)) {
        setPgnError("Live sync failed. No valid PGN returned.");
        setPgnText("");
        setPgnLoading(false);
        return;
      }

      setPgnText(directText);
      setLastSyncedAt(new Date().toLocaleTimeString());
      setSyncSource(`Direct Lichess (${username})`);
    } catch {
      setPgnError("Live sync failed. Unable to reach API/Lichess from this environment.");
      setPgnText("");
    }

    setPgnLoading(false);
  };

  useEffect(() => {
    if (!isChess) return;
    const username = lichessUsername;
    const loadSnapshot = async () => {
      if (isLocalDev) {
        await syncChessData();
        return;
      }
      try {
        const res = await fetch(`/api/chess-data?username=${encodeURIComponent(username)}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          await syncChessData();
          return;
        }
        const data = await res.json();
        if (!data?.pgn || !isValidPgn(data.pgn)) {
          await syncChessData();
          return;
        }
        if (!/\[%eval\s+[^\]\s]+\]/.test(data.pgn)) {
          await syncChessData();
          return;
        }
        setPgnText(data.pgn);
        setLastSyncedAt(
          data.syncedAt ? new Date(data.syncedAt).toLocaleTimeString() : new Date().toLocaleTimeString()
        );
        setSyncSource(`Supabase snapshot (${username})`);
      } catch {
        await syncChessData();
      }
    };
    void loadSnapshot();
    // Initial chess data load should run on page entry; manual sync button handles updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChess, isLocalDev]);

  const parsedChessGames = useMemo(
    () => (isChess && pgnText ? parsePgnHeaders(pgnText) : []),
    [isChess, pgnText]
  );

  const chessSummary = useMemo(
    () => (parsedChessGames.length > 0 ? buildChessSummary(parsedChessGames) : null),
    [parsedChessGames]
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
  const trendRowsWindow = useMemo(() => {
    if (!chessSummary) return [];
    return chessSummary.signalRows;
  }, [chessSummary]);
  const effectiveAnalysisWindow = useMemo(() => {
    const total = parsedChessGames.length;
    if (total === 0) return 1;
    if (analysisWindow === -1) return total;
    return Math.max(1, Math.min(analysisWindow, total));
  }, [analysisWindow, parsedChessGames.length]);

  useEffect(() => {
    if (!isChess || parsedChessGames.length === 0) {
      setCoachReport(null);
      return;
    }
    const report = buildAiCoachReport(parsedChessGames, effectiveAnalysisWindow);
    setCoachReport(report);
  }, [effectiveAnalysisWindow, isChess, parsedChessGames]);

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

          {isChess ? (
            <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <h2 className="section-title">Dashboards</h2>
              <div />
            </div>
            {lastSyncedAt ? (
              <p className="text-xs text-white/50 -mt-1 mb-3">
                Last synced: {lastSyncedAt}
                {syncSource ? ` · Source: ${syncSource}` : ""}
              </p>
            ) : null}
            <p className="text-xs text-white/55 mb-4">
              Snapshot-first sync with Supabase. On the Hobby plan, dashboard updates are shown once per day.
            </p>
            {pgnLoading ? <p className="text-white/65">Loading PGN data...</p> : null}
            {pgnError ? <p className="text-red-300/85">{pgnError}</p> : null}
            {!pgnLoading && chessSummary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <article className="showcase-inner-card">
                    <p className="text-xs uppercase tracking-wider text-white/60">Player</p>
                    <p className="text-lg font-semibold mt-1">{chessSummary.player}</p>
                  </article>
                  <article className="showcase-inner-card">
                    <p className="text-xs uppercase tracking-wider text-white/60">Games</p>
                    <p className="text-lg font-semibold mt-1">{chessSummary.totalGames}</p>
                  </article>
                  <article className="showcase-inner-card">
                    <p className="text-xs uppercase tracking-wider text-white/60">W-D-L</p>
                    <p className="text-lg font-semibold mt-1">
                      {chessSummary.wins}-{chessSummary.draws}-{chessSummary.losses}
                    </p>
                  </article>
                  <article className="showcase-inner-card">
                    <p className="text-xs uppercase tracking-wider text-white/60">White/Black Win %</p>
                    <p className="text-lg font-semibold mt-1">
                      {chessSummary.whiteWinRate.toFixed(0)} / {chessSummary.blackWinRate.toFixed(0)}
                    </p>
                  </article>
                  <article className="showcase-inner-card">
                    <p className="text-xs uppercase tracking-wider text-white/60">Avg Opponent</p>
                    <p className="text-lg font-semibold mt-1">
                      {chessSummary.avgOpponent ?? "-"}
                    </p>
                  </article>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <article className="showcase-inner-card">
                    <p className="text-sm uppercase tracking-wider text-white/60 mb-2 inline-flex items-center gap-2">
                      Results
                      <HoverHelp text="Complete game result history. Newest game appears at the top." />
                    </p>
                    <div className="max-h-[28rem] overflow-y-auto pr-1 space-y-1.5">
                      {chessSummary.gameResults.length > 0 ? (
                        [...chessSummary.gameResults].reverse().map((r, idx) => {
                          const gameNum = chessSummary.gameResults.length - idx;
                          return (
                            <div
                              key={`${r}-${idx}`}
                              className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-2 py-1"
                            >
                              <span className="text-xs text-white/65">Game {gameNum}</span>
                              <span
                                className={`inline-flex h-5 min-w-5 px-1 items-center justify-center rounded text-[11px] font-semibold ${
                              r === "W"
                                ? "bg-emerald-400/20 text-emerald-100 border border-emerald-300/35"
                                : r === "D"
                                  ? "bg-slate-400/20 text-slate-100 border border-slate-300/30"
                                  : "bg-rose-400/20 text-rose-100 border border-rose-300/35"
                            }`}
                              >
                                {r}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-white/55 text-sm">No recent form data yet.</p>
                      )}
                    </div>
                  </article>

                  <article className="showcase-inner-card">
                    <p className="text-sm uppercase tracking-wider text-white/60 mb-2 inline-flex items-center gap-2">
                      Openings Used
                      <HoverHelp text="Opening families inferred from ECO codes to show what you're using most often." />
                    </p>
                    <div className="space-y-2">
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
                  </article>
                </div>

                <article className="showcase-inner-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                      Signals
                      <HoverHelp text="Calculated from Lichess engine eval swings per move (free source), not static PGN annotation tags." />
                    </p>
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
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                      <p className="text-[11px] uppercase tracking-wider text-white/55">Blunders</p>
                      <p className="text-white/90 font-semibold">
                        {signalRowsWindow[signalRowsWindow.length - 1]?.blunders ?? 0}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                      <p className="text-[11px] uppercase tracking-wider text-white/55">Mistakes</p>
                      <p className="text-white/90 font-semibold">
                        {signalRowsWindow[signalRowsWindow.length - 1]?.mistakes ?? 0}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                      <p className="text-[11px] uppercase tracking-wider text-white/55">Inaccuracies</p>
                      <p className="text-white/90 font-semibold">
                        {signalRowsWindow[signalRowsWindow.length - 1]?.inaccuracies ?? 0}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                      <p className="text-[11px] uppercase tracking-wider text-white/55">Brilliants</p>
                      <p className="text-white/90 font-semibold">
                        {signalRowsWindow[signalRowsWindow.length - 1]?.brilliants ?? 0}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                      <p className="text-[11px] uppercase tracking-wider text-white/55">Avg Blunders / Game</p>
                      <p className="text-white/90 font-semibold">
                        {signalRowsWindow.length > 0
                          ? (
                              signalRowsWindow.reduce((sum, row) => sum + row.blunders, 0) /
                              signalRowsWindow.length
                            ).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                  <MiniSignalsChart rows={signalRowsWindow} />
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

                <article className="showcase-inner-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm uppercase tracking-wider text-white/60 inline-flex items-center gap-2">
                      AI Coach
                      <HoverHelp text="Coach output is derived from your recent games and emphasizes recurring patterns, not generic advice." />
                    </p>
                    <div className="flex items-center gap-2">
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
