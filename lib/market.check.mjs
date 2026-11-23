// Self-check for the /play game engine. Run: node lib/market.check.mjs
import assert from "node:assert/strict";
import * as M from "./market.ts";

const cards = [{ v: 1 }, { v: 13 }, { v: 7 }, { v: 7 }, { v: 7 }];
assert.equal(M.fvExact(cards, 0), 35);
assert.equal(M.fvExact(cards, 5), 35);
assert.equal(M.fvShort(cards, 1), 29);
assert.equal(M.fvExact(cards, 1), 1 + 4 * (363 / 51));

for (let i = 0; i < 2000; i++) {
  const g = M.newGame(i % 2 ? "trader" : "maker", ["easy", "normal", "hard"][i % 3]);
  while (!g.settled) {
    if (g.mode === "maker") {
      const fv = M.fvExact(g.cards, g.stage) + (Math.random() - 0.5) * 8;
      M.postQuote(g, Math.round(fv) - 2, Math.round(fv) + 2);
    } else {
      M.userTrade(g, [null, "buy", "sell"][i % 3], 3);
    }
    M.advance(g);
  }
  const pnl = Object.values(g.roundPnl).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(pnl) < 1e-9, "zero-sum");
  for (const p of M.PLAYERS) assert.ok(Math.abs(M.position(g.trades, p)) <= M.LIMIT, "position limit");
  for (let s = 0; s < 5; s++)
    assert.ok(g.trades.filter(t => t.stage === s).reduce((a, t) => a + t.qty, 0) <= M.CAP, "per-quote cap");
}

const g = M.newGame("maker", "hard");
M.postQuote(g, 30, 40); assert.equal(g.err, "wide");
M.postQuote(g, 40, 30); assert.equal(g.err, "order");
M.postQuote(g, NaN, 30); assert.equal(g.err, "missing");
const tm = M.newGame("maker");
M.timeout(tm); assert.ok(tm.acted && tm.missed[0] === 0 && tm.quotes.length === 0 && tm.trades.length === 0);
M.timeout(tm); assert.equal(tm.missed.length, 1, "timeout is idempotent once acted");
const tt = M.newGame("trader");
M.timeout(tt); assert.ok(tt.acted && tt.userActions[0].side === null && tt.missed[0] === 0);

// Daily: same date + same decisions → identical game; different date → different deal.
const playDaily = date => {
  const d = M.newGame("maker", "hard", date);
  assert.equal(d.mode, "trader"); assert.equal(d.level, "normal");
  while (!M.dailyDone(d)) {
    if (d.settled) M.newRound(d);
    const q = d.quotes[d.quotes.length - 1];
    M.userTrade(d, q.ask < M.fvShort(d.cards, d.stage) ? "buy" : q.bid > M.fvShort(d.cards, d.stage) ? "sell" : null, 2);
    M.advance(d);
  }
  return d;
};
const a = playDaily("2026-11-23"), b = playDaily("2026-11-23"), c = playDaily("2026-11-24");
assert.equal(a.round, M.DAILY_ROUNDS);
assert.deepEqual(a.cards, b.cards); assert.deepEqual(a.trades, b.trades); assert.deepEqual(a.totals, b.totals);
assert.notDeepEqual(a.cards, c.cards);
M.newRound(a); assert.equal(a.round, M.DAILY_ROUNDS, "no rounds after the daily is done");

console.log("market engine ok");
