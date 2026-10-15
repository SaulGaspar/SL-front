const CSS = `
  .rp-page {
    --rp-ink: #0a1a2f;
    --rp-muted: #657286;
    --rp-paper: #f5f7f4;
    --rp-card: #ffffff;
    --rp-line: rgba(10, 26, 47, .11);
    --rp-blue: #244fdb;
    --rp-acid: #bde632;
    min-height: calc(100vh - 70px);
    display: grid;
    place-items: center;
    padding: 48px 20px;
    background:
      radial-gradient(circle at 90% 12%, rgba(36,79,219,.11), transparent 25rem),
      radial-gradient(circle at 8% 92%, rgba(189,230,50,.30), transparent 20rem),
      var(--rp-paper);
    color: var(--rp-ink);
    font-family: "Poppins", "Segoe UI", sans-serif;
  }

  body[data-bs-theme="dark"] .rp-page {
    --rp-ink: #f3f6fa;
    --rp-muted: #a6b1c0;
    --rp-paper: #09131f;
    --rp-card: #101d2b;
    --rp-line: rgba(255, 255, 255, .11);
    --rp-blue: #86a5ff;
  }

  .rp-page *,
  .rp-page *::before,
  .rp-page *::after { box-sizing: border-box; }

  .rp-card {
    position: relative;
    width: min(100%, 620px);
    padding: clamp(34px, 6vw, 58px);
    border: 1px solid var(--rp-line);
    border-radius: 30px;
    background: var(--rp-card);
    overflow: hidden;
    box-shadow: 0 26px 70px rgba(10, 26, 47, .13);
  }

  .rp-card::before {
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    right: -130px;
    top: -130px;
    border: 34px solid var(--rp-acid);
    border-radius: 50%;
    opacity: .92;
  }

  .rp-top {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: center;
    margin-bottom: 34px;
  }

  .rp-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--rp-blue);
    font-size: .72rem;
    font-weight: 850;
    letter-spacing: .18em;
    text-transform: uppercase;
  }

  .rp-brand-mark {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #0a1a2f;
    color: var(--rp-acid);
    letter-spacing: .04em;
  }

  .rp-back {
    color: var(--rp-muted);
    text-decoration: none;
    font-size: .84rem;
    font-weight: 800;
  }

  .rp-kicker {
    position: relative;
    display: block;
    margin-bottom: 12px;
    color: var(--rp-blue);
    font-size: .7rem;
    font-weight: 850;
    letter-spacing: .15em;
    text-transform: uppercase;
  }

  .rp-title {
    position: relative;
    max-width: 470px;
    margin: 0;
    color: var(--rp-ink);
    font-size: clamp(2.1rem, 6vw, 3.4rem);
    line-height: .98;
    font-weight: 900;
    letter-spacing: -.06em;
  }

  .rp-copy {
    position: relative;
    max-width: 450px;
    margin: 18px 0 0;
    color: var(--rp-muted);
    line-height: 1.7;
    font-size: .94rem;
  }

  .rp-message {
    position: relative;
    margin: 24px 0 0;
    padding: 13px 15px;
    border-radius: 15px;
    border: 1px solid var(--rp-line);
    font-size: .9rem;
    font-weight: 650;
  }

  .rp-message.ok {
    background: #e9f8ef;
    color: #23864b;
    border-color: rgba(35,134,75,.18);
  }

  .rp-message.err {
    background: #fff0f0;
    color: #c93636;
    border-color: rgba(201,54,54,.18);
  }

  body[data-bs-theme="dark"] .rp-message.ok {
    background: rgba(35,134,75,.15);
    color: #7be09d;
  }

  body[data-bs-theme="dark"] .rp-message.err {
    background: rgba(201,54,54,.15);
    color: #ff9a9a;
  }

  .rp-form {
    position: relative;
    display: grid;
    gap: 18px;
    margin-top: 30px;
  }

  .rp-field label {
    display: block;
    margin-bottom: 8px;
    color: var(--rp-ink);
    font-size: .86rem;
    font-weight: 800;
  }

  .rp-password {
    position: relative;
  }

  .rp-input {
    width: 100%;
    min-height: 54px;
    padding: 0 92px 0 16px;
    border: 1px solid var(--rp-line);
    border-radius: 15px;
    background: rgba(255,255,255,.72);
    color: var(--rp-ink);
    font: inherit;
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  body[data-bs-theme="dark"] .rp-input {
    background: rgba(255,255,255,.05);
  }

  .rp-input:focus {
    border-color: rgba(36,79,219,.55);
    box-shadow: 0 0 0 4px rgba(36,79,219,.10);
    background: var(--rp-card);
  }

  .rp-input::placeholder {
    color: color-mix(in srgb, var(--rp-muted), transparent 10%);
  }

  .rp-toggle {
    position: absolute;
    right: 8px;
    top: 8px;
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--rp-line);
    border-radius: 11px;
    background: transparent;
    color: var(--rp-muted);
    font-size: .76rem;
    font-weight: 800;
    cursor: pointer;
  }

  .rp-hint {
    margin-top: 7px;
    color: var(--rp-muted);
    font-size: .78rem;
    line-height: 1.45;
  }

  .rp-actions {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    margin-top: 8px;
  }

  .rp-submit,
  .rp-secondary {
    min-height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    font-size: .9rem;
    font-weight: 850;
    text-decoration: none;
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  }

  .rp-submit {
    border: 0;
    background: #244fdb;
    color: #fff;
    box-shadow: 0 12px 24px rgba(36,79,219,.22);
  }

  .rp-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(36,79,219,.28);
  }

  .rp-submit:disabled {
    opacity: .68;
    cursor: not-allowed;
    transform: none;
  }

  .rp-secondary {
    min-width: 124px;
    border: 1px solid var(--rp-line);
    background: transparent;
    color: var(--rp-ink);
  }

  .rp-back:focus-visible,
  .rp-toggle:focus-visible,
  .rp-submit:focus-visible,
  .rp-secondary:focus-visible {
    outline: 3px solid var(--rp-acid);
    outline-offset: 3px;
  }

  @media (max-width: 560px) {
    .rp-page { padding: 22px 12px; }
    .rp-card { padding: 32px 22px; border-radius: 24px; }
    .rp-top { align-items: flex-start; flex-direction: column; margin-bottom: 28px; }
    .rp-actions { grid-template-columns: 1fr; }
    .rp-secondary { width: 100%; }
  }
`;
export default CSS;
