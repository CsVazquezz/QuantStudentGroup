// "Make Me a Market" — game engine. No React here; the /play page renders it.
// Contract settles at the sum of 5 cards from one 52-card deck (A=1 … K=13).
// Mutating functions take a draft (the page passes a structuredClone of state).

export type Mode = "maker" | "trader";
export type Side = "buy" | "sell";
export type Style = "sharp" | "cautious" | "rough" | "stale" | "momentum" | "gambler";
export type ErrCode = "missing" | "order" | "wide" | "limit";

export type Card = { r: string; v: number; s: string; red: boolean };
export type Quote = { stage: number; maker: string; bid: number; ask: number; fv: number; filled?: number };
export type Trade = { stage: number; buyer: string; seller: string; price: number; qty: number; fv: number };
export type UserAction = { stage: number; side: Side | null; qty: number; q: Quote };

export type Game = {
  mode: Mode;
  maxSpread: number;
  round: number;
  cards: Card[];
  stage: number; // cards revealed so far; 5 = settled
  trades: Trade[];
  quotes: Quote[];
  est: Record<string, number>[]; // per stage, each bot's private estimate
  acted: boolean;
  settled: boolean;
  totals: Record<string, number>;
  roundPnl: Record<string, number>;
  err: ErrCode | null;
  userActions: UserAction[];
  missed: number[]; // stages where the decision clock ran out
};

type Ctx = { fv: number; short: number; fvPrev: number; last: number };
type Bot = { name: string; style: Style; thr: number; est: (c: Ctx) => number };

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS: [string, boolean][] = [["♠", false], ["♥", true], ["♦", true], ["♣", false]];
export const LIMIT = 5; // max |position| per player
export const CAP = 3;   // max contracts traded per quote
export const YOU = "You";

function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// thr = minimum edge (points) a bot needs before it trades
export const BOTS: Bot[] = [
  { name: "Bot 1", style: "sharp",    thr: 0.5, est: c => c.fv + gauss() * 0.6 },
  { name: "Bot 2", style: "cautious", thr: 3,   est: c => c.fv + gauss() * 0.5 },
  { name: "Bot 3", style: "rough",    thr: 1,   est: c => c.short + gauss() * 2.5 },
  { name: "Bot 4", style: "stale",    thr: 1,   est: c => c.fvPrev + gauss() * 0.5 },
  { name: "Bot 5", style: "momentum", thr: 1,   est: c => c.fv + (c.last ? (c.last - 7) * 0.9 : 0) + gauss() * 0.8 },
  { name: "Bot 6", style: "gambler",  thr: 0,   est: c => c.short + gauss() * 6 },
];
export const PLAYERS = [YOU, ...BOTS.map(b => b.name)];
export const styleOf = (name: string) => BOTS.find(b => b.name === name)?.style;

export function deal(): Card[] {
  const deck: Card[] = [];
  for (const [s, red] of SUITS) RANKS.forEach((r, i) => deck.push({ r, v: i + 1, s, red }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, 5);
}

export const shownSum = (cards: Card[], k: number) => cards.slice(0, k).reduce((a, c) => a + c.v, 0);
// Expected sum: shown + hidden × mean of the remaining deck (deck total is 364)
export function fvExact(cards: Card[], k: number) {
  const s = shownSum(cards, k);
  return s + (5 - k) * (364 - s) / (52 - k);
}
export const fvShort = (cards: Card[], k: number) => shownSum(cards, k) + 7 * (5 - k);
export const position = (trades: Trade[], p: string) =>
  trades.reduce((a, t) => a + (t.buyer === p ? t.qty : 0) - (t.seller === p ? t.qty : 0), 0);

function ctx(cards: Card[], k: number): Ctx {
  return {
    fv: fvExact(cards, k),
    short: fvShort(cards, k),
    fvPrev: fvExact(cards, k ? k - 1 : 0),
    last: k ? cards[k - 1].v : 0,
  };
}

// Contracts `p` can still trade on `side` before hitting the position limit.
const room = (g: Game, p: string, side: Side) =>
  side === "buy" ? LIMIT - position(g.trades, p) : LIMIT + position(g.trades, p);

function addTrade(g: Game, buyer: string, seller: string, price: number, qty: number, fv: number) {
  g.trades.push({ stage: g.stage, buyer, seller, price, qty, fv });
}

export function newGame(mode: Mode = "maker", maxSpread = 10): Game {
  const g: Game = {
    mode, maxSpread, round: 0, cards: [], stage: 0, trades: [], quotes: [], est: [],
    acted: false, settled: false, err: null, userActions: [], missed: [],
    totals: Object.fromEntries(PLAYERS.map(p => [p, 0])), roundPnl: {},
  };
  newRound(g);
  return g;
}

export function newRound(g: Game) {
  g.round++;
  g.cards = deal();
  g.stage = 0; g.trades = []; g.quotes = []; g.est = []; g.userActions = []; g.missed = [];
  g.settled = false; g.err = null;
  startStage(g);
}

function startStage(g: Game) {
  const c = ctx(g.cards, g.stage);
  g.est[g.stage] = Object.fromEntries(BOTS.map(b => [b.name, b.est(c)]));
  g.acted = false; g.err = null;
  if (g.mode === "trader") g.quotes.push(botQuote(g));
}

// In trader mode the Sharp bot always makes the market.
const MAKER = BOTS[0];

function botQuote(g: Game): Quote {
  const m = MAKER, e = g.est[g.stage][m.name], hidden = 5 - g.stage;
  const w = Math.max(2, Math.min(g.maxSpread, Math.round(1.3 * hidden + 2)));
  const bid = Math.round(e - w / 2);
  return { stage: g.stage, maker: m.name, bid, ask: bid + w, fv: fvExact(g.cards, g.stage) };
}

// Bots trade against quote q, best edge first; returns contracts left under the cap.
function botsHit(g: Game, q: Quote, capLeft: number) {
  const orders: { who: string; side: Side; edge: number }[] = [];
  for (const b of BOTS) {
    if (b.name === q.maker) continue;
    const e = g.est[g.stage][b.name];
    if (e - q.ask > b.thr) orders.push({ who: b.name, side: "buy", edge: e - q.ask });
    else if (q.bid - e > b.thr) orders.push({ who: b.name, side: "sell", edge: q.bid - e });
    else if (b.style === "gambler" && Math.random() < 0.3)
      orders.push({ who: b.name, side: Math.random() < 0.5 ? "buy" : "sell", edge: 0.1 });
  }
  orders.sort((a, b) => b.edge - a.edge);
  for (const o of orders) {
    if (capLeft <= 0) break;
    const makerSide: Side = o.side === "buy" ? "sell" : "buy";
    const qty = Math.min(o.edge >= 4 ? 2 : 1, capLeft, room(g, o.who, o.side), room(g, q.maker, makerSide));
    if (qty <= 0) continue;
    if (o.side === "buy") addTrade(g, o.who, q.maker, q.ask, qty, q.fv);
    else addTrade(g, q.maker, o.who, q.bid, qty, q.fv);
    capLeft -= qty;
  }
  return capLeft;
}

export function postQuote(g: Game, bid: number, ask: number) {
  if (!Number.isFinite(bid) || !Number.isFinite(ask)) { g.err = "missing"; return; }
  if (ask <= bid) { g.err = "order"; return; }
  if (ask - bid > g.maxSpread) { g.err = "wide"; return; }
  const q: Quote = { stage: g.stage, maker: YOU, bid, ask, fv: fvExact(g.cards, g.stage) };
  g.quotes.push(q);
  const before = g.trades.length;
  botsHit(g, q, CAP);
  q.filled = g.trades.slice(before).reduce((a, t) => a + t.qty, 0);
  g.acted = true; g.err = null;
}

export function userTrade(g: Game, side: Side | null, want = 1) {
  const q = g.quotes[g.quotes.length - 1];
  let qty = 0;
  if (side) {
    const makerSide: Side = side === "buy" ? "sell" : "buy";
    qty = Math.min(want, CAP, room(g, YOU, side), room(g, q.maker, makerSide));
    if (qty <= 0) { g.err = "limit"; return; }
    if (side === "buy") addTrade(g, YOU, q.maker, q.ask, qty, q.fv);
    else addTrade(g, q.maker, YOU, q.bid, qty, q.fv);
  }
  g.userActions.push({ stage: g.stage, side, qty, q });
  botsHit(g, q, CAP - qty);
  g.acted = true; g.err = null;
}

// Decision clock ran out: makers post no market, traders pass.
export function timeout(g: Game) {
  if (g.acted || g.settled) return;
  g.missed.push(g.stage);
  if (g.mode === "trader") userTrade(g, null);
  else { g.acted = true; g.err = null; }
}

export function advance(g: Game) {
  if (g.stage < 4) { g.stage++; startStage(g); return; }
  g.stage = 5;
  const F = shownSum(g.cards, 5);
  g.roundPnl = Object.fromEntries(PLAYERS.map(p => [p, 0]));
  for (const t of g.trades) {
    g.roundPnl[t.buyer] += (F - t.price) * t.qty;
    g.roundPnl[t.seller] += (t.price - F) * t.qty;
  }
  for (const p of PLAYERS) g.totals[p] += g.roundPnl[p];
  g.settled = true;
}

export function setMode(g: Game, m: Mode) { g.mode = m; newRound(g); }

// Your P&L measured against fair value at trade time — the part that isn't luck.
export const edgePnl = (g: Game) =>
  g.trades.reduce((a, t) =>
    a + (t.buyer === YOU ? (t.fv - t.price) * t.qty : 0) + (t.seller === YOU ? (t.price - t.fv) * t.qty : 0), 0);
