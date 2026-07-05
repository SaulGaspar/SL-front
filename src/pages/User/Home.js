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

  .sl-float-card {
    position: absolute;
    z-index: 4;
    right: -14px;
    top: 70px;
    width: 154px;
    padding: 15px 17px;
    border: 1px solid rgba(11,31,51,.08);
    border-radius: 18px;
    background: rgba(255,255,255,.92);
    color: #0b1f33;
    box-shadow: 0 16px 40px rgba(11,31,51,.14);
    backdrop-filter: blur(12px);
  }

  .sl-float-card strong {
    display: block;
    font-size: 1.1rem;
    letter-spacing: -.03em;
  }

  .sl-float-card span {
    display: block;
    margin-top: 2px;
    color: #677487;
    font-size: .72rem;
    font-weight: 650;
  }

  .sl-float-dot {
    width: 9px;
    height: 9px;
    display: inline-block !important;
    margin: 0 5px 0 0 !important;
    border-radius: 50%;
    background: #36b36b;
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

  .sl-category-count {
    display: block;
    margin-top: 4px;
    color: rgba(11,31,51,.58);
    font-size: .74rem;
    font-weight: 650;
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
    .sl-float-card { right: -5px; top: 38px; }
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

const TRUST = [
  { icon: "truck", title: "Envío gratis", sub: "Desde $999 MXN" },
  { icon: "rotate", title: "30 días para cambios", sub: "Sin vueltas innecesarias" },
  { icon: "shield", title: "Compra protegida", sub: "Tus datos siempre seguros" },
  { icon: "headset", title: "Estamos para ayudarte", sub: "Lunes a sábado" },
];

const CATEGORIES = [
  { icon: "shoe", name: "Calzado", count: "124 productos" },
  { icon: "shirt", name: "Ropa", count: "86 productos" },
  { icon: "dumbbell", name: "Entrenamiento", count: "52 productos" },
  { icon: "bag", name: "Accesorios", count: "68 productos" },
  { icon: "ball", name: "Balones", count: "34 productos" },
  { icon: "bottle", name: "Nutrición", count: "41 productos" },
];

const PRINCIPLES = [
  {
    title: "Lo bueno se elige, no se acumula",
    text: "Cada producto entra por rendimiento, durabilidad y comodidad. Menos ruido, mejores opciones.",
  },
  {
    title: "Hablar claro también es servicio",
    text: "Precios visibles, entregas con seguimiento y cambios sencillos. Comprar deporte no debería cansarte.",
  },
  {
    title: "Tu ritmo es el que importa",
    text: "Entrenes todos los días o apenas estés empezando, aquí encuentras equipo que acompaña tu momento.",
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
            <span className="sl-eyebrow">Hecho para moverte</span>
            <h1 className="sl-hero-title">
              Todo empieza con <em>un paso.</em>
            </h1>
            <p className="sl-hero-sub">
              Equipo bien elegido para entrenar, jugar y disfrutar el movimiento.
              Encuentra lo que te hace falta y sigue a tu ritmo.
            </p>
            <div className="sl-actions">
              <a href="/catalogo" className="sl-btn sl-btn-primary">
                Explorar catálogo <Icon name="arrow" size={19} />
              </a>
              <a href="/promociones" className="sl-btn sl-btn-secondary">
                Ver promociones
              </a>
            </div>
            <div className="sl-proof">
              <span><Icon name="check" size={17} /> Envíos a todo México</span>
              <span><Icon name="check" size={17} /> Productos auténticos</span>
            </div>
          </div>

          <div className="sl-showcase-wrap" aria-label="Producto destacado">
            <div className="sl-showcase">
              <div className="sl-showcase-top">
                <span className="sl-showcase-kicker">Selección de la semana</span>
                <span className="sl-showcase-index">01</span>
              </div>
              <svg className="sl-shoe" viewBox="0 0 620 330" role="img" aria-label="Tenis deportivo Flux">
                <defs>
                  <linearGradient id="shoeBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff"/>
                    <stop offset=".62" stopColor="#f2f4f7"/>
                    <stop offset="1" stopColor="#d8dee8"/>
                  </linearGradient>
                </defs>
                <path d="M85 202c38 1 79-7 116-43l73-72c15-15 40-14 53 3l42 57 122 38c33 10 50 32 42 61-4 15-17 25-34 25H108c-44 0-61-16-55-43 3-15 14-26 32-26z" fill="url(#shoeBody)" stroke="#0b1f33" strokeWidth="5"/>
                <path d="M172 177c46 1 78-18 108-54l38 18-48 63-104-5z" fill="#3157f5"/>
                <path d="M270 204l64-84 43 55-32 37z" fill="#c7f22b"/>
                <path d="M340 170l74 21-31 34-47-12z" fill="#ff6938"/>
                <path d="M58 235c77 18 148 15 223 7 92-9 174-20 250-4" fill="none" stroke="#0b1f33" strokeWidth="11" strokeLinecap="round"/>
                <path d="M123 272h355" stroke="#0b1f33" strokeWidth="7" strokeLinecap="round"/>
                <path d="m253 125 72 28M238 142l73 29M222 159l75 29" stroke="#0b1f33" strokeWidth="5" strokeLinecap="round"/>
                <circle cx="452" cy="221" r="7" fill="#0b1f33"/>
              </svg>
              <div className="sl-product-meta">
                <div>
                  <div className="sl-product-name">Flux Runner</div>
                  <div className="sl-product-type">Running diario · Unisex</div>
                </div>
                <div className="sl-product-price">$2,199</div>
              </div>
            </div>
            <div className="sl-float-card">
              <strong>4.9 / 5</strong>
              <span><i className="sl-float-dot" />240 reseñas reales</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sl-trust" aria-label="Beneficios de compra">
        <div className="sl-container sl-trust-grid">
          {TRUST.map((item) => (
            <div className="sl-trust-item" key={item.title}>
              <span className="sl-trust-icon"><Icon name={item.icon} size={20} /></span>
              <div>
                <div className="sl-trust-title">{item.title}</div>
                <div className="sl-trust-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sl-section sl-section-white">
        <div className="sl-container">
          <div className="sl-heading-row">
            <div>
              <span className="sl-label">Encuentra tu equipo</span>
              <h2 className="sl-title">Muévete como más te gusta.</h2>
            </div>
            <p className="sl-heading-note">
              Una selección para cada disciplina, desde el primer entrenamiento
              hasta el día de competencia.
            </p>
          </div>
          <div className="sl-category-grid">
            {CATEGORIES.map((category) => (
              <a className="sl-category" href="/catalogo" key={category.name}>
                <span className="sl-category-icon">
                  <Icon name={category.icon} size={31} strokeWidth={1.65} />
                </span>
                <span className="sl-category-bottom">
                  <span>
                    <span className="sl-category-name">{category.name}</span>
                    <span className="sl-category-count">{category.count}</span>
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
            <span className="sl-label">Nuestra manera de hacer las cosas</span>
            <h2 className="sl-title">Buen equipo. Cero complicaciones.</h2>
            <p className="sl-story-copy">
              SportLike nació para hacer más fácil una decisión sencilla:
              elegir algo que te dé ganas de salir y moverte.
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
            <h2 className="sl-process-big">Más de 500 formas de ponerte en movimiento.</h2>
            <div className="sl-sport-tags">
              {SPORTS.map((sport) => <span className="sl-sport-tag" key={sport}>{sport}</span>)}
            </div>
          </div>
          <div className="sl-process-copy">
            <span className="sl-label">Así de simple</span>
            <h2 className="sl-title">Elige. Recibe. Estrena.</h2>
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
              <h2 className="sl-cta-title">Tu próxima meta empieza aquí.</h2>
              <p>Explora la colección y encuentra ese impulso que te faltaba.</p>
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
