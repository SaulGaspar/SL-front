import React, { useEffect } from "react";

const css = `
  .sl-home {
    --sl-ink: #0b1f33;
    --sl-muted: #637083;
    --sl-paper: #f5f7f2;
    --sl-card: #ffffff;
    --sl-line: rgba(11, 31, 51, 0.12);
    --sl-acid: #c7f22b;
    --sl-blue: #3157f5;
    --sl-orange: #ff6938;
    background: var(--sl-paper);
    color: var(--sl-ink);
    overflow: hidden;
  }

  body[data-bs-theme="dark"] .sl-home {
    --sl-ink: #f4f7fb;
    --sl-muted: #a8b2c1;
    --sl-paper: #09131f;
    --sl-card: #101d2b;
    --sl-line: rgba(255, 255, 255, 0.12);
  }

  .sl-home *,
  .sl-home *::before,
  .sl-home *::after { box-sizing: border-box; }

  .sl-container {
    width: min(1180px, calc(100% - 40px));
    margin-inline: auto;
  }

  .sl-hero {
    position: relative;
    min-height: min(820px, calc(100svh - 72px));
    display: grid;
    align-items: center;
    padding: clamp(70px, 9vw, 120px) 0 86px;
    isolation: isolate;
  }

  .sl-hero::before {
    content: "";
    position: absolute;
    z-index: -2;
    inset: 0;
    background:
      linear-gradient(rgba(11,31,51,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(11,31,51,.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,.7), transparent 88%);
  }

  body[data-bs-theme="dark"] .sl-hero::before {
    background:
      linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
    background-size: 56px 56px;
  }

  .sl-hero::after {
    content: "";
    position: absolute;
    z-index: -1;
    width: 520px;
    height: 520px;
    right: -250px;
    top: -230px;
    border-radius: 50%;
    background: var(--sl-acid);
    opacity: .24;
    filter: blur(1px);
  }

  .sl-hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(390px, .98fr);
    align-items: center;
    gap: clamp(48px, 7vw, 96px);
  }

  .sl-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    color: var(--sl-ink);
    font-size: .76rem;
    line-height: 1;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .sl-eyebrow::before {
    content: "";
    width: 32px;
    height: 3px;
    border-radius: 99px;
    background: var(--sl-orange);
  }

  .sl-hero-title {
    max-width: 690px;
    margin: 0;
    color: var(--sl-ink);
    font-size: clamp(3.35rem, 6.8vw, 6.65rem);
    font-weight: 900;
    line-height: .88;
    letter-spacing: -.065em;
  }

  .sl-hero-title em {
    display: block;
    width: fit-content;
    margin-top: .09em;
    color: var(--sl-blue);
    font-style: normal;
    position: relative;
  }

  .sl-hero-title em::after {
    content: "";
    position: absolute;
    left: 2%;
    right: -2%;
    bottom: -.04em;
    height: .13em;
    border-radius: 99px;
    background: var(--sl-acid);
    transform: rotate(-1.5deg);
    z-index: -1;
  }

  .sl-hero-sub {
    max-width: 570px;
    margin: 30px 0 0;
    color: var(--sl-muted);
    font-size: clamp(1.02rem, 1.7vw, 1.18rem);
    line-height: 1.7;
  }

  .sl-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 34px;
  }

  .sl-btn {
    min-height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    padding: 0 24px;
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--sl-ink) !important;
    font-size: .94rem;
    font-weight: 800;
    text-decoration: none;
    transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  }

  .sl-btn svg { transition: transform .2s ease; }
  .sl-btn:hover { transform: translateY(-2px); }
  .sl-btn:hover svg { transform: translateX(3px); }

  .sl-btn-primary {
    background: var(--sl-ink);
    color: var(--sl-paper) !important;
    box-shadow: 0 12px 30px rgba(11,31,51,.18);
  }

  .sl-btn-secondary {
    border-color: var(--sl-line);
    background: rgba(255,255,255,.5);
  }

  body[data-bs-theme="dark"] .sl-btn-secondary {
    background: rgba(255,255,255,.04);
  }

  .sl-proof {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-top: 26px;
    color: var(--sl-muted);
    font-size: .82rem;
    font-weight: 650;
  }

  .sl-proof span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .sl-proof svg { color: var(--sl-blue); }

  .sl-showcase-wrap {
    position: relative;
    padding: 24px 18px 30px;
  }

  .sl-showcase {
    position: relative;
    min-height: 510px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px;
    border: 1px solid rgba(11,31,51,.08);
    border-radius: 38px;
    background: #dfe8ff;
    color: #0b1f33;
    overflow: hidden;
    box-shadow: 0 34px 80px rgba(32,52,84,.16);
    transform: rotate(2deg);
  }

  .sl-showcase::before {
    content: "MOVE";
    position: absolute;
    right: -28px;
    top: 104px;
    color: rgba(11,31,51,.065);
    font-size: 8.2rem;
    font-weight: 950;
    letter-spacing: -.08em;
    transform: rotate(90deg);
  }

  .sl-showcase::after {
    content: "";
    position: absolute;
    width: 270px;
    height: 270px;
    left: -70px;
    bottom: -105px;
    border-radius: 50%;
    background: var(--sl-acid);
  }

  .sl-showcase-top,
  .sl-product-meta { position: relative; z-index: 2; }

  .sl-showcase-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .sl-showcase-kicker {
    font-size: .7rem;
    font-weight: 850;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .sl-showcase-index {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(11,31,51,.16);
    border-radius: 50%;
    font-size: .72rem;
    font-weight: 800;
  }

  .sl-shoe {
    position: absolute;
    z-index: 1;
    width: 128%;
    max-width: none;
    left: -12%;
    top: 24%;
    filter: drop-shadow(0 32px 22px rgba(11,31,51,.25));
    transform: rotate(-10deg);
  }

  .sl-product-meta {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px 22px;
    align-items: end;
  }

  .sl-product-name {
    color: #0b1f33;
    font-size: clamp(1.65rem, 3vw, 2.15rem);
    font-weight: 900;
    letter-spacing: -.04em;
    line-height: 1;
  }

  .sl-product-type {
    margin-top: 7px;
    color: rgba(11,31,51,.63);
    font-size: .84rem;
    font-weight: 650;
  }

  .sl-product-price {
    font-size: 1.12rem;
    font-weight: 900;
    white-space: nowrap;
  }

  .sl-trust {
    position: relative;
    z-index: 2;
    margin-top: -1px;
    background: #0b1f33;
    color: #f5f7f2;
  }

  .sl-trust-grid {
    min-height: 118px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .sl-trust-item {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 24px;
    border-right: 1px solid rgba(255,255,255,.13);
  }

  .sl-trust-item:last-child { border-right: 0; }

  .sl-trust-icon {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 50%;
    background: var(--sl-acid);
    color: #0b1f33;
  }

  .sl-trust-title {
    color: inherit;
    font-size: .88rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .sl-trust-sub {
    margin-top: 4px;
    color: rgba(245,247,242,.62);
    font-size: .72rem;
    line-height: 1.35;
  }

  .sl-section { padding: clamp(82px, 10vw, 132px) 0; }
  .sl-section-white { background: var(--sl-card); }

  .sl-heading-row {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 34px;
    margin-bottom: 44px;
  }

  .sl-label {
    display: block;
    margin-bottom: 12px;
    color: var(--sl-blue);
    font-size: .72rem;
    font-weight: 850;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .sl-title {
    max-width: 700px;
    margin: 0;
    color: var(--sl-ink);
    font-size: clamp(2.2rem, 4.8vw, 4.25rem);
    font-weight: 900;
    line-height: .98;
    letter-spacing: -.055em;
  }

  .sl-heading-note {
    max-width: 340px;
    margin: 0;
    color: var(--sl-muted);
    font-size: .94rem;
    line-height: 1.65;
  }

  .sl-category-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
  }

  .sl-category {
    position: relative;
    min-height: 230px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    grid-column: span 4;
    padding: 24px;
    border: 1px solid var(--sl-line);
    border-radius: 24px;
    color: var(--sl-ink) !important;
    text-decoration: none;
    overflow: hidden;
    transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  }

  .sl-category:nth-child(1),
  .sl-category:nth-child(5) { grid-column: span 5; }
  .sl-category:nth-child(2),
  .sl-category:nth-child(6) { grid-column: span 3; }
  .sl-category:nth-child(3),
  .sl-category:nth-child(4) { grid-column: span 4; }

  .sl-category:nth-child(1) { background: #dfe8ff; }
  .sl-category:nth-child(2) { background: #eef7ca; }
  .sl-category:nth-child(3) { background: #ffe4da; }
  .sl-category:nth-child(4) { background: #e5e8ec; }
  .sl-category:nth-child(5) { background: #d9f1e4; }
  .sl-category:nth-child(6) { background: #eee4ff; }

  .sl-category:hover {
    transform: translateY(-5px);
    border-color: transparent;
    box-shadow: 0 20px 44px rgba(11,31,51,.12);
  }

  .sl-category-icon {
    width: 62px;
    height: 62px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(11,31,51,.12);
    border-radius: 20px;
    background: rgba(255,255,255,.48);
    color: #0b1f33;
    transform: rotate(-4deg);
  }

  .sl-category-bottom {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
  }

  .sl-category-name {
    display: block;
    color: #0b1f33;
    font-size: 1.3rem;
    font-weight: 900;
    letter-spacing: -.035em;
  }

  .sl-circle-arrow {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #0b1f33;
    color: #fff;
    transition: transform .2s ease;
  }

  .sl-category:hover .sl-circle-arrow { transform: rotate(-35deg); }

  .sl-story-grid {
    display: grid;
    grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
    gap: clamp(48px, 9vw, 120px);
    align-items: start;
  }

  .sl-story-sticky { position: sticky; top: 110px; }

  .sl-story-copy {
    margin: 26px 0 0;
    color: var(--sl-muted);
    font-size: 1rem;
    line-height: 1.78;
  }

  .sl-principles {
    border-top: 1px solid var(--sl-line);
  }

  .sl-principle {
    display: grid;
    grid-template-columns: 68px 1fr;
    gap: 24px;
    padding: 34px 0;
    border-bottom: 1px solid var(--sl-line);
  }

  .sl-principle-num {
    color: var(--sl-blue);
    font-size: .76rem;
    font-weight: 850;
    letter-spacing: .1em;
  }

  .sl-principle h3 {
    margin: 0 0 9px;
    color: var(--sl-ink);
    font-size: 1.22rem;
    font-weight: 850;
    letter-spacing: -.025em;
  }

  .sl-principle p {
    margin: 0;
    color: var(--sl-muted);
    font-size: .94rem;
    line-height: 1.7;
  }

  .sl-process {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(0, .98fr);
    gap: clamp(40px, 7vw, 86px);
    align-items: stretch;
  }

  .sl-process-visual {
    min-height: 610px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(28px, 4vw, 48px);
    border-radius: 30px;
    background: #0b1f33;
    color: #f5f7f2;
    overflow: hidden;
    position: relative;
  }

  .sl-process-visual::before {
    content: "";
    position: absolute;
    width: 380px;
    height: 380px;
    right: -115px;
    bottom: -110px;
    border: 74px solid var(--sl-acid);
    border-radius: 50%;
    opacity: .95;
  }

  .sl-process-visual::after {
    content: "SPORTLIKE";
    position: absolute;
    left: 44px;
    bottom: 104px;
    color: rgba(255,255,255,.06);
    font-size: clamp(4rem, 8vw, 7rem);
    font-weight: 950;
    letter-spacing: -.07em;
    transform: rotate(-90deg);
    transform-origin: left bottom;
  }

  .sl-process-big {
    position: relative;
    z-index: 1;
    max-width: 420px;
    margin: 0;
    color: inherit;
    font-size: clamp(2.25rem, 4vw, 3.8rem);
    font-weight: 900;
    line-height: .98;
    letter-spacing: -.055em;
  }

  .sl-sport-tags {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 390px;
  }

  .sl-sport-tag {
    padding: 8px 13px;
    border: 1px solid rgba(255,255,255,.23);
    border-radius: 999px;
    color: rgba(255,255,255,.78);
    font-size: .74rem;
    font-weight: 700;
  }

  .sl-process-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-block: 20px;
  }

  .sl-steps { margin-top: 30px; }

  .sl-step {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 18px;
    padding: 22px 0;
    border-bottom: 1px solid var(--sl-line);
  }

  .sl-step-num {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--sl-acid);
    color: #0b1f33;
    font-size: .72rem;
    font-weight: 900;
  }

  .sl-step h3 {
    margin: 0 0 5px;
    color: var(--sl-ink);
    font-size: 1rem;
    font-weight: 850;
  }

  .sl-step p {
    margin: 0;
    color: var(--sl-muted);
    font-size: .88rem;
    line-height: 1.6;
  }

  .sl-cta { padding: 0 0 clamp(82px, 10vw, 130px); }

  .sl-cta-inner {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 40px;
    min-height: 330px;
    padding: clamp(42px, 7vw, 82px);
    border-radius: 32px;
    background: var(--sl-blue);
    color: #fff;
    overflow: hidden;
  }

  .sl-cta-inner::before {
    content: "";
    position: absolute;
    width: 360px;
    height: 360px;
    right: -110px;
    top: -180px;
    border: 60px solid rgba(199,242,43,.92);
    border-radius: 50%;
  }

  .sl-cta-inner::after {
    content: "";
    position: absolute;
    width: 210px;
    height: 210px;
    right: 20%;
    bottom: -180px;
    border: 35px solid rgba(255,255,255,.12);
    border-radius: 50%;
  }

  .sl-cta-copy { position: relative; z-index: 1; }

  .sl-cta-title {
    max-width: 720px;
    margin: 0;
    color: #fff;
    font-size: clamp(2.4rem, 5vw, 4.8rem);
    font-weight: 900;
    line-height: .95;
    letter-spacing: -.06em;
  }

  .sl-cta-copy p {
    max-width: 520px;
    margin: 18px 0 0;
    color: rgba(255,255,255,.75);
    font-size: .98rem;
    line-height: 1.65;
  }

  .sl-cta .sl-btn {
    position: relative;
    z-index: 2;
    background: #fff;
    color: #0b1f33 !important;
    white-space: nowrap;
  }

  .sl-btn:focus-visible,
  .sl-category:focus-visible {
    outline: 3px solid var(--sl-orange);
    outline-offset: 4px;
  }

  @media (max-width: 991.98px) {
    .sl-hero { min-height: auto; }
    .sl-hero-grid,
    .sl-story-grid,
    .sl-process { grid-template-columns: 1fr; }
    .sl-hero-copy { max-width: 720px; }
    .sl-showcase-wrap { width: min(600px, 100%); margin-inline: auto; }
    .sl-story-sticky { position: static; }
    .sl-trust-grid { grid-template-columns: repeat(2, 1fr); }
    .sl-trust-item:nth-child(2) { border-right: 0; }
    .sl-trust-item:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,.13); }
    .sl-category,
    .sl-category:nth-child(n) { grid-column: span 6; }
    .sl-process-visual { min-height: 500px; }
  }

  @media (max-width: 767.98px) {
    .sl-container { width: min(100% - 28px, 1180px); }
    .sl-hero { padding: 62px 0 70px; }
    .sl-hero-grid { gap: 48px; }
    .sl-hero-title { font-size: clamp(3.2rem, 15vw, 5rem); }
    .sl-hero-sub { margin-top: 24px; }
    .sl-actions { align-items: stretch; }
    .sl-btn { flex: 1 1 100%; }
    .sl-proof { display: grid; }
    .sl-showcase-wrap { padding: 8px 4px 22px; }
    .sl-showcase { min-height: 430px; padding: 24px; border-radius: 28px; }
    .sl-shoe { width: 135%; left: -17%; top: 26%; }
    .sl-heading-row { display: block; }
    .sl-heading-note { margin-top: 20px; }
    .sl-category { min-height: 200px; }
    .sl-process-visual { min-height: 440px; }
    .sl-cta-inner { grid-template-columns: 1fr; min-height: 420px; align-content: center; }
    .sl-cta .sl-btn { width: fit-content; }
  }

  @media (max-width: 575.98px) {
    .sl-trust-item { padding: 20px 12px; align-items: flex-start; }
    .sl-trust-icon { width: 36px; height: 36px; }
    .sl-trust-sub { display: none; }
    .sl-category,
    .sl-category:nth-child(n) { grid-column: span 12; min-height: 180px; }
    .sl-principle { grid-template-columns: 46px 1fr; gap: 10px; }
    .sl-process-visual { min-height: 400px; }
    .sl-cta-inner { padding: 38px 26px; border-radius: 24px; }
  }

  /* ── ACABADO PROFESIONAL ── */
  .sl-home {
    --sl-ink: #0a1a2f;
    --sl-muted: #667386;
    --sl-paper: #f6f7f5;
    --sl-card: #ffffff;
    --sl-line: rgba(10, 26, 47, .11);
    --sl-acid: #bde632;
    --sl-blue: #244fdb;
  }

  .sl-hero {
    min-height: min(780px, calc(100svh - 72px));
    padding: clamp(82px, 9vw, 118px) 0 92px;
  }

  .sl-hero::before {
    background:
      linear-gradient(115deg, rgba(36,79,219,.055), transparent 42%),
      linear-gradient(rgba(10,26,47,.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(10,26,47,.028) 1px, transparent 1px);
    background-size: auto, 72px 72px, 72px 72px;
  }

  .sl-hero::after { display: none; }

  .sl-hero-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(410px, .92fr);
    gap: clamp(54px, 7vw, 96px);
  }

  .sl-eyebrow {
    margin-bottom: 20px;
    color: var(--sl-blue);
    font-size: .73rem;
    letter-spacing: .14em;
  }

  .sl-eyebrow::before {
    width: 26px;
    height: 2px;
    background: var(--sl-blue);
  }

  .sl-hero-title {
    max-width: 720px;
    font-size: clamp(3.45rem, 6.1vw, 5.85rem);
    line-height: .96;
    letter-spacing: -.058em;
  }

  .sl-hero-title em {
    margin-top: .05em;
    color: var(--sl-blue);
  }

  .sl-hero-title em::after { display: none; }

  .sl-hero-sub {
    max-width: 610px;
    margin-top: 28px;
    font-size: clamp(1rem, 1.5vw, 1.12rem);
    line-height: 1.72;
  }

  .sl-btn {
    min-height: 52px;
    padding-inline: 25px;
    border-radius: 12px;
  }

  .sl-btn-primary {
    background: var(--sl-blue);
    box-shadow: 0 12px 28px rgba(36,79,219,.22);
  }

  .sl-btn-secondary {
    background: var(--sl-card);
    border-color: var(--sl-line);
  }

  .sl-proof { margin-top: 24px; }

  .sl-showcase-wrap { padding: 8px; }

  .sl-showcase {
    min-height: 520px;
    padding: 30px;
    border-color: rgba(10,26,47,.09);
    border-radius: 26px;
    background: linear-gradient(145deg, #edf1f6 0%, #dfe6ef 100%);
    box-shadow: 0 28px 70px rgba(10,26,47,.14);
    transform: none;
  }

  .sl-showcase::before {
    content: "";
    width: 270px;
    height: 270px;
    right: -80px;
    top: -90px;
    border: 48px solid rgba(36,79,219,.1);
    border-radius: 50%;
    transform: none;
  }

  .sl-showcase::after {
    width: 210px;
    height: 210px;
    left: -90px;
    bottom: -115px;
    background: var(--sl-acid);
    opacity: .75;
  }

  .sl-shoe {
    width: 122%;
    left: -9%;
    top: 26%;
    transform: rotate(-7deg);
    filter: drop-shadow(0 28px 20px rgba(10,26,47,.22));
  }

  .sl-trust {
    background: var(--sl-card);
    color: var(--sl-ink);
    border-top: 1px solid var(--sl-line);
    border-bottom: 1px solid var(--sl-line);
  }

  .sl-trust-grid { min-height: 108px; }

  .sl-trust-item {
    border-right-color: var(--sl-line);
  }

  .sl-trust-icon {
    border-radius: 12px;
    background: rgba(36,79,219,.09);
    color: var(--sl-blue);
  }

  .sl-trust-sub { color: var(--sl-muted); }

  .sl-values {
    padding: clamp(78px, 8vw, 108px) 0;
    background: #0a1a2f;
    color: #f5f7f2;
  }

  .sl-values-head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 380px);
    align-items: end;
    gap: 36px;
    margin-bottom: 38px;
  }

  .sl-values .sl-label { color: var(--sl-acid); }

  .sl-values-title {
    max-width: 680px;
    margin: 0;
    color: #fff;
    font-size: clamp(2.25rem, 4.3vw, 3.8rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -.05em;
  }

  .sl-values-intro {
    margin: 0;
    color: rgba(255,255,255,.62);
    font-size: .94rem;
    line-height: 1.7;
  }

  .sl-values-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .sl-value-card {
    min-height: 220px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 18px;
    background: rgba(255,255,255,.045);
  }

  .sl-value-icon {
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: var(--sl-acid);
    color: #0a1a2f;
  }

  .sl-value-index {
    display: block;
    margin-bottom: 10px;
    color: rgba(255,255,255,.38);
    font-size: .68rem;
    font-weight: 800;
    letter-spacing: .13em;
  }

  .sl-value-card h3 {
    margin: 0 0 7px;
    color: #fff;
    font-size: 1rem;
    font-weight: 800;
  }

  .sl-value-card p {
    margin: 0;
    color: rgba(255,255,255,.58);
    font-size: .8rem;
    line-height: 1.6;
  }

  .sl-section { padding: clamp(88px, 9vw, 118px) 0; }

  .sl-label { color: var(--sl-blue); }

  .sl-title {
    font-size: clamp(2.25rem, 4.3vw, 3.75rem);
    line-height: 1.02;
    letter-spacing: -.05em;
  }

  .sl-category-grid { gap: 18px; }

  .sl-category,
  .sl-category:nth-child(n) {
    min-height: 218px;
    border-radius: 20px;
    background: var(--sl-card);
  }

  .sl-category:hover {
    border-color: rgba(36,79,219,.24);
    box-shadow: 0 18px 42px rgba(10,26,47,.09);
  }

  .sl-category-icon {
    border: 0;
    border-radius: 14px;
    background: #f0f3f7;
    color: var(--sl-blue);
    transform: none;
  }

  .sl-circle-arrow {
    background: var(--sl-blue);
  }

  .sl-story-grid {
    grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  }

  .sl-principle { padding: 32px 0; }

  .sl-principle-num { color: var(--sl-blue); }

  .sl-process-visual {
    min-height: 560px;
    border-radius: 24px;
    background: #0a1a2f;
  }

  .sl-process-visual::before {
    width: 330px;
    height: 330px;
    right: -120px;
    bottom: -120px;
    border-width: 58px;
    opacity: .9;
  }

  .sl-process-visual::after { display: none; }

  .sl-sport-tag {
    border-color: rgba(255,255,255,.18);
  }

  .sl-step-num {
    border-radius: 12px;
    background: rgba(36,79,219,.1);
    color: var(--sl-blue);
  }

  .sl-cta-inner {
    min-height: 310px;
    border-radius: 26px;
    background: #0a1a2f;
  }

  .sl-cta-inner::before {
    border-color: var(--sl-acid);
    opacity: .9;
  }

  .sl-cta-title {
    max-width: 760px;
    font-size: clamp(2.45rem, 4.8vw, 4.35rem);
  }

  @media (max-width: 991.98px) {
    .sl-hero-grid { grid-template-columns: 1fr; }
    .sl-showcase-wrap { width: min(580px, 100%); }
    .sl-trust-item:nth-child(-n+2) { border-bottom-color: var(--sl-line); }
    .sl-values-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 767.98px) {
    .sl-hero { padding-top: 68px; }
    .sl-hero-title { font-size: clamp(3rem, 14vw, 4.5rem); }
    .sl-showcase { min-height: 420px; }
    .sl-category,
    .sl-category:nth-child(n) { min-height: 190px; }
    .sl-values-head { grid-template-columns: 1fr; gap: 18px; }
  }

  /* ── HERO PRINCIPAL ── */
  .sl-hero {
    min-height: min(700px, calc(100svh - 72px));
    padding: clamp(90px, 11vw, 140px) 0;
  }

  .sl-hero::after {
    display: block;
    width: 520px;
    height: 520px;
    right: -330px;
    top: 50%;
    border: 76px solid rgba(36,79,219,.075);
    border-radius: 50%;
    background: transparent;
    transform: translateY(-50%);
  }

  .sl-hero-grid {
    grid-template-columns: minmax(0, 900px);
    justify-content: center;
    text-align: center;
  }

  .sl-hero-copy {
    max-width: 900px;
    margin-inline: auto;
  }

  .sl-eyebrow {
    justify-content: center;
  }

  .sl-hero-title {
    max-width: 900px;
    margin-inline: auto;
  }

  .sl-hero-title em {
    width: auto;
  }

  .sl-hero-sub {
    max-width: 640px;
    margin-inline: auto;
  }

  .sl-actions,
  .sl-proof {
    justify-content: center;
  }

  @media (max-width: 767.98px) {
    .sl-hero {
      min-height: 620px;
      padding: 80px 0;
    }
    .sl-hero::after {
      width: 320px;
      height: 320px;
      right: -235px;
      border-width: 46px;
    }
  }

  @media (max-width: 575.98px) {
    .sl-values-grid { grid-template-columns: 1fr; }
    .sl-value-card { min-height: 185px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sl-home *,
    .sl-home *::before,
    .sl-home *::after {
      scroll-behavior: auto !important;
      transition-duration: .01ms !important;
    }
  }
`;

const Icon = ({ name, size = 22, strokeWidth = 1.8 }) => {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    truck: <><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    rotate: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    shield: <><path d="M12 3 4.8 6v5.2c0 4.5 3 8.3 7.2 9.8 4.2-1.5 7.2-5.3 7.2-9.8V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2zM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z"/><path d="M17 18c0 2-2 3-5 3"/></>,
    shoe: <><path d="M3 15.5c2.3.1 4.4-.5 5.9-2.2L12 9.8l2.8 3.2 5.4 1.4c.5.1.8.5.8 1v1.1c0 .8-.7 1.5-1.5 1.5H5c-1.1 0-2-.9-2-2z"/><path d="m8.9 13.3 2.7 1.2M11 11l2.7 1.5"/></>,
    shirt: <><path d="m8 4-5 3 2 4 3-1v10h8V10l3 1 2-4-5-3c-.5 1.2-1.9 2-4 2S8.5 5.2 8 4z"/></>,
    dumbbell: <><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></>,
    bag: <><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
    ball: <><circle cx="12" cy="12" r="9"/><path d="m12 8 3 2-1 4h-4l-1-4zM12 8V3M15 10l4-2M14 14l3 4M10 14l-3 4M9 10 5 8"/></>,
    bottle: <><path d="M9 3h6v3l2 3v11H7V9l2-3z"/><path d="M9 6h6M8 11h8"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

const VALUES = [
  {
    icon: "check",
    title: "Calidad seleccionada",
    text: "Elegimos productos por su rendimiento, comodidad y durabilidad.",
  },
  {
    icon: "ball",
    title: "Pasión por el deporte",
    text: "Conocemos lo que necesitas para entrenar, competir y avanzar.",
  },
  {
    icon: "shield",
    title: "Confianza en cada compra",
    text: "Información clara y una experiencia segura de principio a fin.",
  },
  {
    icon: "headset",
    title: "Servicio cercano",
    text: "Te acompañamos antes, durante y después de recibir tu pedido.",
  },
];

const CATEGORIES = [
  { icon: "shoe", name: "Calzado", filter: "Calzado" },
  { icon: "shirt", name: "Ropa", filter: "Ropa" },
  { icon: "dumbbell", name: "Entrenamiento", filter: "Equipamiento" },
  { icon: "bag", name: "Accesorios", filter: "Accesorios" },
  { icon: "ball", name: "Balones", filter: "Balones" },
  { icon: "bottle", name: "Nutrición", filter: "Nutrición" },
];

const PRINCIPLES = [
  {
    title: "Selección con propósito",
    text: "Elegimos cada producto por su rendimiento, durabilidad y comodidad para ofrecer opciones que realmente aportan valor.",
  },
  {
    title: "Servicio claro y confiable",
    text: "Precios transparentes, entregas con seguimiento y cambios sencillos durante todo el proceso de compra.",
  },
  {
    title: "Equipo para cada objetivo",
    text: "Desde quienes comienzan hasta quienes compiten, contamos con alternativas para cada nivel y disciplina.",
  },
];

const STEPS = [
  { title: "Encuentra lo tuyo", text: "Explora por disciplina, talla o el objetivo que tienes en mente." },
  { title: "Compra con confianza", text: "Elige tu forma de pago y revisa todo antes de confirmar." },
  { title: "Recíbelo y muévete", text: "Sigue tu pedido y prepárate para estrenar en pocos días." },
];

const SPORTS = ["Running", "Fútbol", "Gimnasio", "Ciclismo", "Natación", "Yoga"];

export default function Home() {
  useEffect(() => {
    if (!document.getElementById("sl-home-css")) {
      const tag = document.createElement("style");
      tag.id = "sl-home-css";
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => document.getElementById("sl-home-css")?.remove();
  }, []);

  return (
    <main className="sl-home">
      <section className="sl-hero">
        <div className="sl-container sl-hero-grid">
          <div className="sl-hero-copy">
            <span className="sl-eyebrow">Tienda deportiva en línea</span>
            <h1 className="sl-hero-title">
              Equípate para <em>llegar más lejos.</em>
            </h1>
            <p className="sl-hero-sub">
              Productos deportivos seleccionados por su calidad, rendimiento y diseño.
              Todo lo que necesitas para entrenar con confianza.
            </p>
            <div className="sl-actions">
              <a href="/catalogo" className="sl-btn sl-btn-primary">
                Comprar ahora <Icon name="arrow" size={19} />
              </a>
              <a href="/promociones" className="sl-btn sl-btn-secondary">
                Ver promociones
              </a>
            </div>
            <div className="sl-proof">
              <span><Icon name="check" size={17} /> Envíos a todo México</span>
              <span><Icon name="check" size={17} /> Compra segura</span>
            </div>
          </div>

        </div>
      </section>

      <section className="sl-values" aria-labelledby="sl-values-title">
        <div className="sl-container">
          <div className="sl-values-head">
            <div>
              <span className="sl-label">Lo que nos mueve</span>
              <h2 className="sl-values-title" id="sl-values-title">Nuestros valores.</h2>
            </div>
            <p className="sl-values-intro">
              Estos principios guían la forma en que elegimos productos y atendemos
              a cada persona que confía en SportLike.
            </p>
          </div>
          <div className="sl-values-grid">
            {VALUES.map((item, index) => (
              <article className="sl-value-card" key={item.title}>
                <span className="sl-value-icon"><Icon name={item.icon} size={21} /></span>
                <div>
                  <span className="sl-value-index">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-section sl-section-white">
        <div className="sl-container">
          <div className="sl-heading-row">
            <div>
              <span className="sl-label">Encuentra tu equipo</span>
              <h2 className="sl-title">Todo para tu disciplina.</h2>
            </div>
            <p className="sl-heading-note">
              Una selección para cada disciplina, desde el primer entrenamiento
              hasta el día de competencia.
            </p>
          </div>
          <div className="sl-category-grid">
            {CATEGORIES.map((category) => (
              <a
                className="sl-category"
                href={`/catalogo?categoria=${encodeURIComponent(category.filter)}`}
                key={category.name}
              >
                <span className="sl-category-icon">
                  <Icon name={category.icon} size={31} strokeWidth={1.65} />
                </span>
                <span className="sl-category-bottom">
                  <span>
                    <span className="sl-category-name">{category.name}</span>
                  </span>
                  <span className="sl-circle-arrow"><Icon name="arrow" size={18} /></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-section">
        <div className="sl-container sl-story-grid">
          <div className="sl-story-sticky">
            <span className="sl-label">Compromiso SportLike</span>
            <h2 className="sl-title">Rendimiento, calidad y confianza.</h2>
            <p className="sl-story-copy">
              Seleccionamos productos que cumplen con las exigencias del deporte
              y ofrecemos una experiencia de compra clara de principio a fin.
            </p>
          </div>
          <div className="sl-principles">
            {PRINCIPLES.map((item, index) => (
              <article className="sl-principle" key={item.title}>
                <span className="sl-principle-num">0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sl-section sl-section-white">
        <div className="sl-container sl-process">
          <div className="sl-process-visual">
            <h2 className="sl-process-big">Equipo para cada disciplina y cada objetivo.</h2>
            <div className="sl-sport-tags">
              {SPORTS.map((sport) => <span className="sl-sport-tag" key={sport}>{sport}</span>)}
            </div>
          </div>
          <div className="sl-process-copy">
            <span className="sl-label">Una experiencia sencilla</span>
            <h2 className="sl-title">Compra fácil y segura.</h2>
            <div className="sl-steps">
              {STEPS.map((step, index) => (
                <article className="sl-step" key={step.title}>
                  <span className="sl-step-num">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sl-cta">
        <div className="sl-container">
          <div className="sl-cta-inner">
            <div className="sl-cta-copy">
              <h2 className="sl-cta-title">Prepárate para tu siguiente reto.</h2>
              <p>Explora nuestro catálogo y encuentra el equipo adecuado para alcanzar tus objetivos.</p>
            </div>
            <a href="/catalogo" className="sl-btn">
              Ver todo el catálogo <Icon name="arrow" size={19} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
