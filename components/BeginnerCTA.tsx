"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isTutorialCompleted } from "@/lib/progressStorage";

export function BeginnerCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!isTutorialCompleted());
  }, []);

  if (!show) return null;

  return (
    <section className="panel panel-strong beginner-cta" style={{ gridColumn: "1 / -1" }}>
      <p className="kv">New Here?</p>
      <h2 style={{ marginTop: 0 }}>New to Poker? Start Here</h2>
      <p className="subtle">
        Learn the basics — hand rankings, table positions, card notation, and how chips work — in a quick 2-minute interactive tutorial before jumping into training.
      </p>
      <Link className="button" href="/play">
        Start the Tutorial
      </Link>
    </section>
  );
}
