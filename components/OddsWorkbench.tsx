"use client";

import { useMemo, useState } from "react";
import {
  calculateBreakEvenEquity,
  classifyPotOdds,
  estimateEquityFromOuts,
  formatPercentage
} from "@/lib/pokerMath";

export function OddsWorkbench() {
  const [outs, setOuts] = useState(9);
  const [cardsToCome, setCardsToCome] = useState<1 | 2>(1);
  const [pot, setPot] = useState(12);
  const [toCall, setToCall] = useState(6);

  const output = useMemo(() => {
    const equity = estimateEquityFromOuts(outs, cardsToCome);
    const breakEven = calculateBreakEvenEquity(pot, toCall);
    return {
      equity,
      breakEven,
      decision: classifyPotOdds(pot, toCall, equity)
    };
  }, [outs, cardsToCome, pot, toCall]);

  return (
    <section className="panel">
      <h3>Odds Workbench</h3>
      <p className="subtle">Quickly compare your draw equity to break-even pot odds.</p>
      <div className="card-grid">
        <label>
          Outs
          <input type="number" value={outs} min={0} max={20} onChange={(event) => setOuts(Number(event.target.value))} />
        </label>
        <label>
          Cards To Come
          <select value={cardsToCome} onChange={(event) => setCardsToCome(Number(event.target.value) as 1 | 2)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </label>
        <label>
          Pot (bb)
          <input type="number" value={pot} min={0} onChange={(event) => setPot(Number(event.target.value))} />
        </label>
        <label>
          To Call (bb)
          <input type="number" value={toCall} min={0} onChange={(event) => setToCall(Number(event.target.value))} />
        </label>
      </div>
      <div className="split" style={{ marginTop: "0.8rem" }}>
        <span className="tag">Equity: {formatPercentage(output.equity)}</span>
        <span className="tag">Break-even: {formatPercentage(output.breakEven)}</span>
        <span className="tag">Guidance: {output.decision.toUpperCase()}</span>
      </div>
    </section>
  );
}
