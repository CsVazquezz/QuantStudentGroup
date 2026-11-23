"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useLang } from "@/lib/useLang";
import MobileNav from "@/components/MobileNav";
import {
  PLAYERS, YOU, type Game, type Mode, type Side, type Style,
  advance, edgePnl, fvShort, newGame, newRound, position, postQuote,
  setMode, shownSum, styleOf, timeout, userTrade,
} from "@/lib/market";

// Seconds per decision. When it hits zero the controls lock (lib/market.ts timeout()).
const DECISION_SECS = 5;

// ─────────────────────────────────────────────────────────────────
// Copy
// ─────────────────────────────────────────────────────────────────

const en = {
  nav: { home: "Home", team: "Team", learn: "Learn", events: "Events", blog: "Blog", contact: "Contact", apply: "Apply" },
  eyebrow: "Practice simulator",
  heading: "Make Me a Market.",
  sub: "The contract settles at the sum of 5 cards (A = 1 … K = 13), revealed one at a time. Quote six bots, or trade against the sharpest one.",
  modes: { maker: "You make the market", trader: "You trade" } as Record<Mode, string>,
  modeLabel: "Mode",
  newRound: "New round",
  round: (n: number) => `Round ${n}`,
  stage: (n: number) => `Quote ${n} of 5`,
  settled: "Settled",
  hidden: "hidden card",
  finalValue: "final value",
  roleMaker: "Market maker",
  roleTrader: "Trader",
  makeMe: "“Make me a market”",
  makerHint: (s: number) => `Bid and ask at most ${s} apart`,
  bid: "Bid", ask: "Ask", at: "at", post: "Post market",
  botMakes: (m: string) => `${m} makes the market`,
  reveal: (n: number) => `Reveal card ${n}`,
  revealLast: "Reveal last card & settle",
  nobody: "Nobody traded.",
  tradeLine: (b: string, q: number, s: string, p: number) => `${b} bought ${q} from ${s} at ${p}`,
  bubbleBuy: (q: number, p: number) => `Buy ${q} @ ${p}`,
  bubbleSell: (q: number, p: number) => `Sell ${q} @ ${p}`,
  qty: "Qty",
  buyAt: (p: number) => `Buy at ${p}`,
  sellAt: (p: number) => `Sell at ${p}`,
  pass: "Pass",
  timeUp: { maker: "Time's up. No market this quote.", trader: "Time's up. You passed." } as Record<Mode, string>,
  clock: "Time left to decide",
  yourPnl: "Your round P&L",
  edge: "edge", luck: "luck",
  verdict: {
    none: "You didn't trade this round.",
    flat: "You ended flat, so you kept the spread no matter what the cards did.",
    luck: "Most of this was luck from the hidden cards. Over many rounds only edge sticks.",
    good: "You traded at good prices. That edge is what compounds.",
    bad: "You gave away edge: your prices were on the wrong side of fair value.",
  },
  next: "Deal next round",
  errs: {
    missing: () => "Enter both a bid and an ask.",
    order: () => "Your ask has to be higher than your bid.",
    wide: (s: number) => `Too wide: keep bid and ask at most ${s} apart.`,
    limit: () => "That would break a ±5 position limit.",
  },
  score: { title: "Scoreboard", note: "total P&L" },
  tape: { title: "Tape", debrief: "Debrief", cols: ["Buyer", "Seller", "Px", "Qty"], empty: "No trades yet this round." },
  styles: {
    sharp:    { tag: "Sharp",    desc: "Knows the exact fair value." },
    cautious: { tag: "Cautious", desc: "Accurate, but needs 3+ points of edge." },
    rough:    { tag: "Rough",    desc: "Uses the 7 shortcut, loosely." },
    stale:    { tag: "Stale",    desc: "Always one card behind." },
    momentum: { tag: "Momentum", desc: "Overreacts to the last card." },
    gambler:  { tag: "Gambler",  desc: "Guesses wildly, loves to trade." },
  } as Record<Style, { tag: string; desc: string }>,
  you: "You",
  debrief: {
    quote: (n: number) => `Quote ${n}`,
    makerLine: (bid: number, ask: number, fv: string, filled: number) => `${bid} at ${ask}, fair value ${fv}, ${filled} filled.`,
    askLow: "Your ask was below fair value. Buyers picked you off.",
    bidHigh: "Your bid was above fair value. Sellers picked you off.",
    noFill: "No trades: your market was fair, or too wide to be worth hitting.",
    fair: "Fair value was inside your market. Trades here earn you the spread on average.",
    traderLine: (m: string, bid: number, ask: number, fv: string) => `${m} quoted ${bid} at ${ask}, fair value ${fv}.`,
    youDid: (side: Side, q: number) => side === "buy" ? `You bought ${q}.` : `You sold ${q}.`,
    goodBuy: (e: string) => `Good buy: ${e} points under fair value.`,
    badBuy: (e: string) => `You paid ${e} over fair value.`,
    goodSell: (e: string) => `Good sale: ${e} points over fair value.`,
    badSell: (e: string) => `You sold ${e} under fair value.`,
    missed: (e: string) => `You passed, but the market was ${e} off fair value. That was free edge.`,
    goodPass: "Good pass: fair value was inside the market.",
    timeUp: "Time ran out.",
  },
  footer: "Extracting alpha from noise.",
};

const es: typeof en = {
  nav: { home: "Inicio", team: "Equipo", learn: "Aprender", events: "Eventos", blog: "Blog", contact: "Contacto", apply: "Aplicar" },
  eyebrow: "Simulador de práctica",
  heading: "Make Me a Market.",
  sub: "El contrato liquida a la suma de 5 cartas (A = 1 … K = 13), reveladas una por una. Cotiza a seis bots, u opera contra el más preciso.",
  modes: { maker: "Tú haces el mercado", trader: "Tú operas" },
  modeLabel: "Modo",
  newRound: "Nueva ronda",
  round: n => `Ronda ${n}`,
  stage: n => `Cotización ${n} de 5`,
  settled: "Liquidado",
  hidden: "carta oculta",
  finalValue: "valor final",
  roleMaker: "Market maker",
  roleTrader: "Trader",
  makeMe: "“Hazme un mercado”",
  makerHint: s => `Bid y ask con máximo ${s} de diferencia`,
  bid: "Bid", ask: "Ask", at: "a", post: "Publicar mercado",
  botMakes: m => `${m} hace el mercado`,
  reveal: n => `Revelar carta ${n}`,
  revealLast: "Revelar última carta y liquidar",
  nobody: "Nadie operó.",
  tradeLine: (b, q, s, p) => `${b} compró ${q} a ${s} en ${p}`,
  bubbleBuy: (q, p) => `Compra ${q} @ ${p}`,
  bubbleSell: (q, p) => `Vende ${q} @ ${p}`,
  qty: "Cant.",
  buyAt: p => `Comprar en ${p}`,
  sellAt: p => `Vender en ${p}`,
  pass: "Pasar",
  timeUp: { maker: "Se acabó el tiempo. Sin mercado en esta cotización.", trader: "Se acabó el tiempo. Pasaste." },
  clock: "Tiempo restante para decidir",
  yourPnl: "Tu P&L de la ronda",
  edge: "ventaja", luck: "suerte",
  verdict: {
    none: "No operaste esta ronda.",
    flat: "Terminaste sin posición, así que te quedaste con el spread sin importar las cartas.",
    luck: "Casi todo fue suerte de las cartas ocultas. A lo largo de muchas rondas solo la ventaja se mantiene.",
    good: "Operaste a buenos precios. Esa ventaja es la que se acumula.",
    bad: "Regalaste ventaja: tus precios estaban del lado equivocado del valor justo.",
  },
  next: "Repartir siguiente ronda",
  errs: {
    missing: () => "Ingresa un bid y un ask.",
    order: () => "Tu ask tiene que ser mayor que tu bid.",
    wide: s => `Muy amplio: deja máximo ${s} entre bid y ask.`,
    limit: () => "Eso rompería el límite de posición de ±5.",
  },
  score: { title: "Marcador", note: "P&L total" },
  tape: { title: "Operaciones", debrief: "Resumen", cols: ["Compra", "Vende", "Px", "Cant."], empty: "Aún no hay operaciones esta ronda." },
  styles: {
    sharp:    { tag: "Preciso",    desc: "Conoce el valor justo exacto." },
    cautious: { tag: "Cauteloso",  desc: "Preciso, pero necesita 3+ puntos de ventaja." },
    rough:    { tag: "Aproximado", desc: "Usa el atajo del 7, sin mucho cuidado." },
    stale:    { tag: "Rezagado",   desc: "Siempre va una carta atrás." },
    momentum: { tag: "Momentum",   desc: "Sobrerreacciona a la última carta." },
    gambler:  { tag: "Apostador",  desc: "Adivina sin control, le encanta operar." },
  },
  you: "Tú",
  debrief: {
    quote: n => `Cotización ${n}`,
    makerLine: (bid, ask, fv, filled) => `${bid} a ${ask}, valor justo ${fv}, ${filled} ejecutados.`,
    askLow: "Tu ask estaba debajo del valor justo. Los compradores te aprovecharon.",
    bidHigh: "Tu bid estaba arriba del valor justo. Los vendedores te aprovecharon.",
    noFill: "Sin operaciones: tu mercado era justo, o muy amplio para que valiera la pena.",
    fair: "El valor justo estaba dentro de tu mercado. Aquí, en promedio, ganas el spread.",
    traderLine: (m, bid, ask, fv) => `${m} cotizó ${bid} a ${ask}, valor justo ${fv}.`,
    youDid: (side, q) => side === "buy" ? `Compraste ${q}.` : `Vendiste ${q}.`,
    goodBuy: e => `Buena compra: ${e} puntos debajo del valor justo.`,
    badBuy: e => `Pagaste ${e} arriba del valor justo.`,
    goodSell: e => `Buena venta: ${e} puntos arriba del valor justo.`,
    badSell: e => `Vendiste ${e} debajo del valor justo.`,
    missed: e => `Pasaste, pero el mercado estaba ${e} fuera del valor justo. Era ventaja gratis.`,
    goodPass: "Buen pase: el valor justo estaba dentro del mercado.",
    timeUp: "Se acabó el tiempo.",
  },
  footer: "Extrayendo alpha del ruido.",
};

const T = { en, es };
type Copy = typeof en;
type Act = (fn: (d: Game) => void) => void;

// ─────────────────────────────────────────────────────────────────
// Helpers & styles
// ─────────────────────────────────────────────────────────────────

const fmt = (x: number, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d);
const sgn = (x: number) => (x > 0 ? "+" : x < 0 ? "−" : "") + fmt(Math.abs(x), Number.isInteger(x) ? 0 : 1);
const tone = (x: number) => (x > 0 ? "text-emerald-400" : x < 0 ? "text-red-400" : "text-white/50");

// Each bot's avatar is a symbol for its habit.
const GLYPH: Record<Style, string> = { sharp: "μ", cautious: "σ", rough: "≈", stale: "Δt", momentum: "β", gambler: "ε" };

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tec-300";
const BTN = `px-5 py-2.5 text-sm font-sans font-semibold rounded-full transition-colors duration-200 ${FOCUS}`;
const BTN_LIGHT = `${BTN} bg-white text-tec-800 hover:bg-tec-50 shadow-lg shadow-tec-600/30`;
const KICKER = "text-[11px] font-sans tracking-[0.18em] uppercase";
const GLASS = "rounded-xl bg-white/[0.04] border border-white/10";
const INPUT = `w-20 px-3 py-2 font-mono text-xl text-center text-white bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-tec-300 ${FOCUS}`;

// 7 seats evenly around the oval, "You" at the bottom. Exposed as CSS vars
// so the position only applies at md+ (seats sit in a grid on phones).
// toFixed: server and client must format the same string, or hydration fails.
function seatPos(i: number) {
  const a = ((90 + (i * 360) / 7) * Math.PI) / 180;
  return {
    style: {
      "--l": `${(50 + 39 * Math.cos(a)).toFixed(2)}%`,
      "--t": `${(50 + 38 * Math.sin(a)).toFixed(2)}%`,
    } as CSSProperties,
    below: Math.sin(a) > 0.2,
  };
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function PlayPage() {
  const { lang, toggle } = useLang();
  const t = T[lang];
  const [g, setG] = useState<Game | null>(null);
  const [qty, setQty] = useState(1);

  // Deal on the client only: a server-side deal would differ from the
  // client's and cause a hydration mismatch.
  useEffect(() => setG(newGame()), []);

  const act: Act = fn => {
    if (!g) return;
    const d = structuredClone(g);
    fn(d);
    setG(d);
  };
  // Functional update: the clock fires after a delay, so it must not use a stale `g`.
  const expire = () => setG(prev => {
    if (!prev || prev.acted || prev.settled) return prev;
    const d = structuredClone(prev);
    timeout(d);
    return d;
  });
  const who = (p: string) => (p === YOU ? t.you : p);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Image src="/tmqs-logo.png" alt="TMQS" width={1259} height={967} className="h-8 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="/"        className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.home}</Link>
            <Link href="/team"    className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.team}</Link>
            <Link href="/learn"   className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.learn}</Link>
            <Link href="/events"  className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.events}</Link>
            <Link href="/blog"    className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.blog}</Link>
            <Link href="/contact" className="text-xs font-sans text-slate-500 hover:text-slate-900 transition-colors tracking-wide">{t.nav.contact}</Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggle}
              className="text-xs font-sans text-slate-400 hover:text-slate-600 transition-colors px-1.5 py-1"
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <Link
              href="/apply"
              className="px-4 py-2 text-xs font-sans font-semibold bg-tec-600 text-white hover:bg-tec-700 rounded-full transition-colors duration-200"
            >
              {t.nav.apply}
            </Link>
            <MobileNav links={[
              { href: "/", label: t.nav.home },
              { href: "/team", label: t.nav.team },
              { href: "/learn", label: t.nav.learn },
              { href: "/events", label: t.nav.events },
              { href: "/blog", label: t.nav.blog },
              { href: "/contact", label: t.nav.contact },
            ]} />
          </div>
        </div>
      </header>

      {/* ── GAME ── fills the viewport under the nav on desktop; side panels scroll internally */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4 lg:h-[calc(100svh-3.5rem)] lg:min-h-[680px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 shrink-0"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-sans text-slate-400 tracking-[0.18em] uppercase mb-1">{t.eyebrow}</p>
            <h1 className="font-serif tracking-tight text-slate-900 text-3xl lg:text-4xl mb-1">{t.heading}</h1>
            <p className="font-sans text-slate-500 text-sm max-w-2xl leading-snug">{t.sub}</p>
          </div>
          {g && <Controls g={g} t={t} act={act} />}
        </motion.div>

        <div className="lg:flex-1 lg:min-h-0 rounded-2xl p-3 sm:p-4 bg-[radial-gradient(ellipse_at_40%_20%,#0d1f4a_0%,#060c1c_55%,#03060f_100%)] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-3 sm:gap-4 shadow-[0_30px_80px_-40px_rgba(0,57,166,0.6)]">
          {g ? (
            <MotionConfig reducedMotion="user">
              <TableArea g={g} t={t} act={act} expire={expire} qty={qty} setQty={setQty} who={who} />
              <div className="flex flex-col gap-3 sm:gap-4 min-w-0 lg:min-h-0">
                <Scoreboard g={g} t={t} who={who} />
                <TapePanel g={g} t={t} who={who} />
              </div>
            </MotionConfig>
          ) : (
            <div className="min-h-[560px] lg:col-span-2" />
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-sans text-slate-400">Tec de Monterrey Campus Querétaro, Est. 2026</span>
          <p className="text-xs font-mono text-slate-400 italic">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Controls (on the white page, above the dark game panel)
// ─────────────────────────────────────────────────────────────────

function Controls({ g, t, act }: { g: Game; t: Copy; act: Act }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="group" aria-label={t.modeLabel} className="inline-flex border border-slate-200 rounded-full bg-white p-1">
        {(["maker", "trader"] as Mode[]).map(m => (
          <button
            key={m}
            aria-pressed={g.mode === m}
            onClick={() => act(d => setMode(d, m))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-colors ${FOCUS} ${g.mode === m ? "bg-tec-600 text-white" : "text-slate-500 hover:text-slate-900"}`}
          >
            {t.modes[m]}
          </button>
        ))}
      </div>
      <button
        onClick={() => act(newRound)}
        className={`px-4 py-2 text-xs font-sans font-semibold rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors ${FOCUS}`}
      >
        {t.newRound}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Table
// ─────────────────────────────────────────────────────────────────

function TableArea({ g, t, act, expire, qty, setQty, who }: {
  g: Game; t: Copy; act: Act; expire: () => void; qty: number; setQty: (n: number) => void; who: (p: string) => string;
}) {
  const done = g.settled ? 5 : g.stage;
  return (
    // Phones: header, felt card, seat grid stacked. md+: oval felt with seats placed around it.
    <section aria-label={t.round(g.round)} className="relative min-w-0 flex flex-col gap-3 md:block md:min-h-[600px] lg:min-h-0">
      <div className="flex items-start justify-between gap-3 md:absolute md:top-3 md:inset-x-4 md:z-20 pointer-events-none">
        <div>
          <p className={`${KICKER} text-white/40`}>{t.round(g.round)}</p>
          <p className="font-serif text-lg text-white">{g.settled ? t.settled : t.stage(g.stage + 1)}</p>
        </div>
        <div className="flex gap-1.5 pt-2" aria-hidden="true">
          {[0, 1, 2, 3, 4].map(n => (
            <span key={n} className={`w-5 sm:w-6 h-1.5 rounded-full transition-colors duration-500 ${n < done ? "bg-tec-400" : n === done && !g.settled ? "bg-tec-400/40" : "bg-white/15"}`} />
          ))}
        </div>
      </div>

      {/* felt */}
      <div className="relative rounded-[32px] px-3 py-7 md:p-0 md:absolute md:inset-x-[14%] md:inset-y-[15%] md:rounded-[50%] bg-[radial-gradient(ellipse_at_50%_35%,#17408f_0%,#0a1f52_45%,#050d24_100%)] shadow-[0_30px_80px_-20px_rgba(0,57,166,0.55),inset_0_0_0_6px_rgba(255,255,255,0.06),inset_0_0_60px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-[4%] md:inset-[5%] rounded-[28px] md:rounded-[50%] border border-white/10 pointer-events-none" />
        <div className="relative h-full flex flex-col items-center justify-center gap-4 md:gap-5">
          <Cards g={g} t={t} />
          <Center g={g} t={t} act={act} expire={expire} qty={qty} setQty={setQty} who={who} />
        </div>
      </div>

      {/* seats: overlay layer ignores clicks so the felt's controls stay usable */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:block md:absolute md:inset-0 md:pointer-events-none">
        {PLAYERS.map((p, i) => <SeatCard key={p} g={g} t={t} p={p} i={i} who={who} />)}
      </div>
    </section>
  );
}

function Cards({ g, t }: { g: Game; t: Copy }) {
  const k = Math.min(g.stage, 5);
  const fan = [-8, -4, 0, 4, 8];
  const box = "w-10 h-14 sm:w-12 sm:h-[68px] lg:w-[60px] lg:h-[84px] rounded-lg grid place-items-center relative shadow-[0_10px_24px_-8px_rgba(0,0,0,0.6)]";
  return (
    <div className="flex items-end gap-1.5 sm:gap-2" style={{ perspective: 600 }}>
      {g.cards.map((c, i) => {
        const shown = i < k;
        return (
          <motion.div
            key={`${g.round}-${i}-${shown}`}
            initial={shown ? { rotateY: 90 } : { y: -24, opacity: 0 }}
            animate={{ rotateY: 0, y: Math.abs(fan[i]) * 0.6, opacity: 1, rotate: fan[i] }}
            transition={shown ? { duration: 0.35, ease: "easeOut" } : { delay: i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
            aria-label={shown ? `${c.r}${c.s}` : t.hidden}
            className={`${box} ${shown
              ? `bg-white border-[1.5px] font-serif text-lg sm:text-xl lg:text-2xl ${c.red ? "border-red-500 text-red-600" : "border-slate-900 text-slate-900"}`
              : "bg-white/5 border border-white/20 text-tec-200 font-mono text-base lg:text-lg backdrop-blur"}`}
          >
            {shown ? (<><small className="absolute top-0.5 left-1 sm:top-1 sm:left-1.5 font-mono text-[9px] sm:text-[10px]">{c.s}</small>{c.r}</>) : "?"}
          </motion.div>
        );
      })}
      <motion.div
        key={`${g.round}-${g.settled}`}
        initial={g.settled ? { scale: 0.6, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 14 }}
        aria-label={t.finalValue}
        className={`ml-1.5 sm:ml-3 h-14 sm:h-[68px] lg:h-[84px] min-w-[56px] sm:min-w-[72px] px-2 sm:px-3 rounded-lg grid place-items-center font-mono text-lg sm:text-2xl font-semibold border-[1.5px] ${
          g.settled
            ? "border-tec-200 bg-tec-500 text-white shadow-[0_0_40px_rgba(74,131,205,0.8)]"
            : "border-dashed border-tec-300 text-white bg-tec-500/20"
        }`}
      >
        Σ={g.settled ? shownSum(g.cards, 5) : "?"}
      </motion.div>
    </div>
  );
}

function Center({ g, t, act, expire, qty, setQty, who }: {
  g: Game; t: Copy; act: Act; expire: () => void; qty: number; setQty: (n: number) => void; who: (p: string) => string;
}) {
  const clock = <Clock key={`${g.round}-${g.stage}-${g.mode}`} t={t} onExpire={expire} />;
  const err = g.err && <p role="alert" className="font-sans text-xs text-red-300 text-center">{t.errs[g.err](g.maxSpread)}</p>;
  const q = g.quotes[g.quotes.length - 1];
  const bigQuote = q && (
    <p className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums text-white">
      {q.bid}<span className="text-white/40 text-lg px-2">{t.at}</span>{q.ask}
    </p>
  );

  if (g.settled) {
    const actual = g.roundPnl[YOU];
    const edge = edgePnl(g);
    const traded = g.trades.some(x => x.buyer === YOU || x.seller === YOU);
    const verdict = !traded ? t.verdict.none
      : position(g.trades, YOU) === 0 ? t.verdict.flat
      : Math.abs(actual - edge) > Math.abs(edge) ? t.verdict.luck
      : edge >= 0 ? t.verdict.good : t.verdict.bad;
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-1.5 text-center">
        <p className={`${KICKER} text-tec-200`}>{t.yourPnl}</p>
        <p className={`font-mono text-4xl sm:text-5xl font-semibold ${tone(actual)} ${actual > 0 ? "drop-shadow-[0_0_18px_rgba(52,211,153,0.45)]" : actual < 0 ? "drop-shadow-[0_0_18px_rgba(248,113,113,0.4)]" : ""}`}>
          {sgn(actual)}
        </p>
        <div className="flex gap-4 font-mono text-xs text-white/60">
          <span>{t.edge} <b className={tone(edge)}>{sgn(edge)}</b></span>
          <span>{t.luck} <b className="text-white/80">{sgn(actual - edge)}</b></span>
        </div>
        <p className="font-sans text-xs text-white/55 max-w-[280px]">{verdict}</p>
        <button onClick={() => act(newRound)} className={`${BTN_LIGHT} mt-1.5`}>{t.next}</button>
      </motion.div>
    );
  }

  const nextLabel = g.stage < 4 ? t.reveal(g.stage + 1) : t.revealLast;
  if (g.acted) {
    const now = g.trades.filter(x => x.stage === g.stage);
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        {g.mode === "trader" && <p className={`${KICKER} text-tec-200`}>{t.botMakes(q.maker)}</p>}
        {g.missed.includes(g.stage) && <p className="font-mono text-xs font-semibold text-amber-300">⏱ {t.timeUp[g.mode]}</p>}
        {(g.mode === "trader" || !g.missed.includes(g.stage)) && (
          <>
            {bigQuote}
            <p className="font-sans text-xs text-white/60 max-w-[320px]">
              {now.length ? now.map(x => t.tradeLine(who(x.buyer), x.qty, who(x.seller), x.price)).join(" · ") : t.nobody}
            </p>
          </>
        )}
        <button onClick={() => act(advance)} className={`${BTN_LIGHT} mt-1`}>{nextLabel}</button>
      </div>
    );
  }

  if (g.mode === "maker") {
    const guess = Math.round(fvShort(g.cards, g.stage));
    const half = Math.floor(Math.min(g.maxSpread, 6) / 2);
    return (
      <form
        key={`${g.round}-${g.stage}`}
        className="flex flex-col items-center gap-2"
        onSubmit={e => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          act(d => postQuote(d, parseFloat(String(f.get("bid"))), parseFloat(String(f.get("ask")))));
        }}
      >
        {clock}
        <p className={`${KICKER} text-tec-200`}>{t.makeMe}</p>
        <div className="flex items-end gap-2.5">
          <label className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-emerald-300">{t.bid}</span>
            <input name="bid" type="number" step="0.5" defaultValue={guess - half} className={INPUT} />
          </label>
          <span className="pb-2.5 font-mono text-white/40">{t.at}</span>
          <label className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-red-300">{t.ask}</span>
            <input name="ask" type="number" step="0.5" defaultValue={guess + half} className={INPUT} />
          </label>
        </div>
        <p className="font-sans text-[11px] text-white/40">{t.makerHint(g.maxSpread)}</p>
        <button type="submit" className={BTN_LIGHT}>{t.post}</button>
        {err}
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2.5">
      {clock}
      <p className={`${KICKER} text-tec-200`}>{t.botMakes(q.maker)}</p>
      {bigQuote}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <label className="inline-flex items-center gap-1.5 font-sans text-xs text-white/60">
          {t.qty}
          <select
            value={qty}
            onChange={e => setQty(parseInt(e.target.value, 10))}
            className={`px-2 py-2 font-mono text-sm text-white bg-white/10 border border-white/20 rounded-lg ${FOCUS}`}
          >
            {[1, 2, 3].map(n => <option key={n} value={n} className="text-slate-900">{n}</option>)}
          </select>
        </label>
        <button onClick={() => act(d => userTrade(d, "buy", qty))} className={`${BTN} bg-emerald-600 text-white hover:bg-emerald-500`}>{t.buyAt(q.ask)}</button>
        <button onClick={() => act(d => userTrade(d, "sell", qty))} className={`${BTN} bg-red-600 text-white hover:bg-red-500`}>{t.sellAt(q.bid)}</button>
        <button onClick={() => act(d => userTrade(d, null))} className={`${BTN} border border-white/25 text-white hover:bg-white/10`}>{t.pass}</button>
      </div>
      {err}
    </div>
  );
}

// Draining bar + seconds. Keyed per decision by the parent, so it restarts each quote.
// Wall-clock based, so it stays honest if the tab is throttled.
function Clock({ t, onExpire }: { t: Copy; onExpire: () => void }) {
  const [left, setLeft] = useState(DECISION_SECS);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;
  useEffect(() => {
    const end = Date.now() + DECISION_SECS * 1000;
    const iv = setInterval(() => {
      const l = Math.max(0, (end - Date.now()) / 1000);
      setLeft(l);
      if (l === 0) { clearInterval(iv); expireRef.current(); }
    }, 100);
    return () => clearInterval(iv);
  }, []);
  const urgent = left <= 2;
  return (
    <div role="timer" aria-label={t.clock} className="flex items-center gap-2.5">
      <div className="w-36 sm:w-44 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${urgent ? "bg-red-400" : "bg-tec-300"}`}
          style={{ width: `${(left / DECISION_SECS) * 100}%` }}
        />
      </div>
      <span className={`w-10 font-mono text-sm font-semibold tabular-nums ${urgent ? "text-red-300 animate-pulse" : "text-white/80"}`}>
        {left.toFixed(1)}s
      </span>
    </div>
  );
}

function SeatCard({ g, t, p, i, who }: { g: Game; t: Copy; p: string; i: number; who: (p: string) => string }) {
  const { style: posVars, below } = seatPos(i);
  const you = p === YOU;
  const style = styleOf(p);
  const pos = position(g.trades, p);

  // Badge: this quote's net trade while live; round P&L once settled.
  let badge: { text: string; good: boolean } | null = null;
  if (g.settled) {
    const r = g.roundPnl[p];
    if (r) badge = { text: sgn(r), good: r > 0 };
  } else {
    const now = g.trades.filter(x => x.stage === g.stage && (x.buyer === p || x.seller === p));
    if (now.length) {
      const net = now.reduce((a, x) => a + (x.buyer === p ? x.qty : -x.qty), 0);
      const px = now[now.length - 1].price;
      badge = net >= 0 ? { text: t.bubbleBuy(net || now[0].qty, px), good: true } : { text: t.bubbleSell(-net, px), good: false };
    }
  }
  const live = !g.settled && badge;
  const role = you ? (g.mode === "maker" ? t.roleMaker : t.roleTrader)
    : g.mode === "trader" && p === g.quotes[0]?.maker ? t.roleMaker
    : t.styles[style!].tag;

  return (
    <div style={posVars} className="relative md:absolute md:left-[var(--l)] md:top-[var(--t)] md:-translate-x-1/2 md:-translate-y-1/2 md:z-10 md:pointer-events-auto">
      <AnimatePresence>
        {badge && (
          <motion.div
            key={`${g.round}-${g.stage}-${badge.text}`}
            initial={{ opacity: 0, scale: 0.8, y: below ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: g.settled ? 0.6 : 0 }}
            className={`hidden md:block absolute left-1/2 -translate-x-1/2 ${below ? "top-full mt-2" : "bottom-full mb-2"} whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold text-white shadow-lg ${badge.good ? "bg-emerald-600" : "bg-red-600"}`}
          >
            {badge.text}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        title={style ? t.styles[style].desc : undefined}
        className={`flex items-center gap-2 sm:gap-2.5 rounded-2xl pl-1.5 pr-2.5 sm:pr-3 py-1.5 bg-white/[0.06] backdrop-blur-md border ${you ? "border-tec-400/60" : "border-white/10"} shadow-[0_8px_30px_-10px_rgba(0,0,0,0.8)]`}
      >
        <div className="relative shrink-0">
          {live && (
            <motion.span
              className={`absolute inset-0 rounded-full ring-2 ${badge!.good ? "ring-emerald-400" : "ring-red-400"}`}
              animate={{ scale: [1, 1.6], opacity: [0.9, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            />
          )}
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center text-sm sm:text-base ${you ? "bg-tec-600 text-white font-mono" : "bg-white text-slate-900 font-serif"}`}>
            {you ? "★" : GLYPH[style!]}
          </div>
        </div>
        <div className="leading-tight min-w-0">
          <p className="font-sans text-[13px] font-semibold text-white whitespace-nowrap">{who(p)}</p>
          <p className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-tec-300 whitespace-nowrap">{role}</p>
          {badge && <p className={`md:hidden font-mono text-[10px] font-semibold ${badge.good ? "text-emerald-400" : "text-red-400"}`}>{badge.text}</p>}
        </div>
        <div className="flex flex-col items-end ml-auto pl-1">
          <span className={`font-mono text-sm font-semibold tabular-nums ${tone(pos)}`}>{sgn(pos)}</span>
          <div className="flex -space-x-1 h-2" aria-hidden="true">
            {Array.from({ length: Math.abs(pos) }).map((_, k) => (
              <span key={k} className={`w-2 h-2 rounded-full border border-slate-900 ${pos > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Side panels
// ─────────────────────────────────────────────────────────────────

function Scoreboard({ g, t, who }: { g: Game; t: Copy; who: (p: string) => string }) {
  const order = [...PLAYERS].sort((a, b) => g.totals[b] - g.totals[a]);
  return (
    <section className={`${GLASS} p-4 flex flex-col gap-1 shrink-0`} aria-label={t.score.title}>
      <div className="flex justify-between items-baseline mb-1.5">
        <h2 className="font-serif text-lg text-white">{t.score.title}</h2>
        <span className={`${KICKER} text-white/40`}>{t.score.note}</span>
      </div>
      {order.map((p, k) => (
        <motion.div
          layout
          key={p}
          className={`flex items-center gap-2 font-sans text-sm py-0.5 ${p === YOU ? "bg-tec-500/20 text-white font-semibold -mx-2 px-2 rounded-md" : "text-white/80"}`}
        >
          <span className="w-4 font-mono text-[11px] text-white/30">{k + 1}</span>
          <span className="flex-1">{who(p)}</span>
          <span className={`font-mono tabular-nums ${tone(g.totals[p])}`}>{sgn(g.totals[p])}</span>
        </motion.div>
      ))}
    </section>
  );
}

function TapePanel({ g, t, who }: { g: Game; t: Copy; who: (p: string) => string }) {
  const [tab, setTab] = useState<"tape" | "debrief">("debrief");
  // The debrief opens by default each time a round settles.
  useEffect(() => setTab("debrief"), [g.round]);
  const view = g.settled ? tab : "tape";
  const th = "font-mono text-[10.5px] font-semibold tracking-[0.08em] uppercase px-2 py-1.5 text-white/40 border-b border-white/10 sticky top-0 bg-[#08112a]";
  const td = "px-2 py-1.5 border-b border-white/5 whitespace-nowrap";
  const tabBtn = (on: boolean) => `font-serif text-lg transition-colors ${on ? "text-white" : "text-white/35 hover:text-white/70"} ${FOCUS}`;

  return (
    <section className={`${GLASS} p-4 flex flex-col gap-3 min-h-[200px] max-h-80 lg:max-h-none lg:flex-1 lg:min-h-0`}>
      <div className="flex items-baseline gap-4">
        <button onClick={() => setTab("tape")} aria-pressed={view === "tape"} className={tabBtn(view === "tape")}>{t.tape.title}</button>
        {g.settled && <button onClick={() => setTab("debrief")} aria-pressed={view === "debrief"} className={tabBtn(view === "debrief")}>{t.tape.debrief}</button>}
      </div>
      <div className="overflow-auto flex-1 min-h-0 -mx-1 px-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
        {view === "tape" ? (
          <table className="w-full border-collapse font-sans text-[13px] tabular-nums text-white/90">
            <thead>
              <tr>{t.tape.cols.map((c, i) => <th key={c} className={`${th} ${i >= 2 ? "text-right" : "text-left"}`}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {g.trades.length === 0 ? (
                <tr><td colSpan={4} className="py-2 text-white/40">{t.tape.empty}</td></tr>
              ) : g.trades.map((x, i) => ({ x, i })).reverse().map(({ x, i }) => (
                <tr key={i} className={x.buyer === YOU || x.seller === YOU ? "bg-tec-500/15 font-semibold" : ""}>
                  <td className={td}>{who(x.buyer)}</td>
                  <td className={td}>{who(x.seller)}</td>
                  <td className={`${td} font-mono text-right`}>{x.price}</td>
                  <td className={`${td} font-mono text-right`}>{x.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Debrief g={g} t={t} />
        )}
      </div>
    </section>
  );
}

function Debrief({ g, t }: { g: Game; t: Copy }) {
  const d = t.debrief;
  const lines =
    g.mode === "maker"
      ? [
          ...g.quotes.map(q => {
            const bad = q.ask < q.fv - 0.5 || q.bid > q.fv + 0.5;
            const note = q.ask < q.fv - 0.5 ? d.askLow : q.bid > q.fv + 0.5 ? d.bidHigh : !q.filled ? d.noFill : d.fair;
            return { stage: q.stage, bad, text: `${d.makerLine(q.bid, q.ask, fmt(q.fv), q.filled || 0)} ${note}` };
          }),
          ...g.missed.map(stage => ({ stage, bad: true, text: d.timeUp })),
        ].sort((a, b) => a.stage - b.stage)
      : g.userActions.map(u => {
          const q = u.q;
          let note: string, bad: boolean;
          if (u.side === "buy") { const e = q.fv - q.ask; bad = e < 0; note = e >= 0 ? d.goodBuy(fmt(e)) : d.badBuy(fmt(-e)); }
          else if (u.side === "sell") { const e = q.bid - q.fv; bad = e < 0; note = e >= 0 ? d.goodSell(fmt(e)) : d.badSell(fmt(-e)); }
          else { const best = Math.max(q.fv - q.ask, q.bid - q.fv); bad = best > 1; note = best > 1 ? d.missed(fmt(best)) : d.goodPass; }
          const did = u.side ? d.youDid(u.side, u.qty) + " " : g.missed.includes(u.stage) ? d.timeUp + " " : "";
          return { stage: q.stage, bad, text: `${d.traderLine(q.maker, q.bid, q.ask, fmt(q.fv))} ${did}${note}` };
        });

  return (
    <ol className="flex flex-col gap-2.5 font-sans text-[13px] leading-snug text-white/75">
      {lines.map(l => (
        <li key={l.stage} className={`pl-3 border-l-2 ${l.bad ? "border-red-400/70" : "border-emerald-400/70"}`}>
          <b className="block font-mono text-[10.5px] tracking-[0.08em] uppercase text-white/45">{d.quote(l.stage + 1)}</b>
          {l.text}
        </li>
      ))}
    </ol>
  );
}
