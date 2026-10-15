const styles = `
        .login-shell {
          min-height:calc(100vh - 112px); display:grid; grid-template-columns:minmax(0,1.15fr) minmax(430px,.85fr);
          background:#f3f6fa; overflow:hidden;
        }
        .login-showcase {
          position:relative; isolation:isolate; display:flex; flex-direction:column; justify-content:center;
          padding:72px clamp(42px,7vw,118px); color:white; overflow:hidden;
          background:linear-gradient(135deg,#071a31 0%,#0b2d52 58%,#173f68 100%);
        }
        .login-showcase::before,.login-showcase::after {
          content:""; position:absolute; z-index:-1; border-radius:50%; border:1px solid rgba(198,246,45,.25);
        }
        .login-showcase::before { width:520px; height:520px; right:-120px; top:-180px; box-shadow:0 0 0 70px rgba(198,246,45,.03),0 0 0 145px rgba(198,246,45,.025); }
        .login-showcase::after { width:290px; height:290px; left:-100px; bottom:-130px; background:rgba(198,246,45,.06); }
        .login-brand { color:white; text-decoration:none; font-size:1.35rem; font-weight:900; letter-spacing:6px; margin-bottom:72px; }
        .login-brand span { color:#c6f62d; }
        .login-kicker { display:inline-flex; align-items:center; gap:8px; width:max-content; border:1px solid rgba(198,246,45,.38); border-radius:999px; padding:7px 13px; color:#c6f62d; font-size:.74rem; font-weight:800; letter-spacing:1.5px; }
        .login-showcase h1 { max-width:660px; margin:22px 0 15px; font-size:clamp(2.7rem,5vw,5.25rem); line-height:.98; font-weight:900; letter-spacing:-2px; }
        .login-showcase h1 span { color:#c6f62d; }
        .login-showcase>p { max-width:610px; color:#c9d6e5; font-size:1.08rem; line-height:1.75; margin:0; }
        .login-benefits { display:flex; flex-wrap:wrap; gap:22px; margin-top:34px; color:#e7eef7; font-size:.86rem; font-weight:700; }
        .login-benefits span { display:flex; align-items:center; gap:8px; }
        .login-benefits i { color:#c6f62d; }
        .login-panel { display:flex; align-items:center; justify-content:center; padding:42px clamp(28px,5vw,78px); background:#f3f6fa; }
        .login-card { width:100%; max-width:470px; background:#fff; border:1px solid #e5ebf2; border-radius:20px; padding:40px; box-shadow:0 22px 60px rgba(7,26,49,.12); }
        .login-eyebrow { color:#6b7d93; font-size:.77rem; font-weight:800; letter-spacing:1.3px; text-transform:uppercase; }
        .login-title { font-size:2rem; font-weight:800; color:#071a31; margin:5px 0 6px; }
        .login-subtitle { color:#718096; margin:0 0 26px; font-size:.94rem; }
        .login-card .form-label { font-weight:700; color:#132c4a; font-size:.88rem; }
        .login-input { border-radius:10px!important; padding:11px 13px!important; border:1px solid #cfd9e6!important; font-size:1rem; height:48px; }
        .login-input:focus { border-color:#224b78!important; box-shadow:0 0 0 3px rgba(34,75,120,.12)!important; }
        .login-btn { background:#071a31; color:white; border:0; padding:13px; width:100%; border-radius:10px; font-size:1rem; font-weight:800; margin-top:8px; transition:transform .16s,background .16s; }
        .login-btn:hover { background:#12375f; transform:translateY(-1px); }
        .error-text { color:#c53030; font-size:.82rem; margin-top:4px; }
        .login-links { display:flex; justify-content:space-between; gap:16px; margin-top:17px; font-size:.88rem; }
        .login-links a { color:#215b97; font-weight:650; }
        .google-btn { border-radius:10px; width:100%; padding:11px; font-size:.94rem; font-weight:650; }
        .separator { display:flex; align-items:center; gap:12px; margin:22px 0; color:#8a98aa; font-size:.82rem; }
        .separator::before,.separator::after { content:""; height:1px; background:#dce3eb; flex:1; }
        .password-container { position:relative; display:flex; align-items:center; }
        .password-toggle { position:absolute; right:9px; background:none; border:0; cursor:pointer; color:#48627f; font-size:1.15rem; display:grid; place-items:center; width:34px; height:100%; }
        body[data-bs-theme="dark"] .login-shell,body[data-bs-theme="dark"] .login-panel { background:#0b1220; }
        body[data-bs-theme="dark"] .login-card { background:#121d2d; border-color:#2d3c50; box-shadow:0 22px 60px rgba(0,0,0,.32); }
        body[data-bs-theme="dark"] .login-title,body[data-bs-theme="dark"] .login-card .form-label { color:#f4f7fb; }
        body[data-bs-theme="dark"] .login-eyebrow,body[data-bs-theme="dark"] .login-subtitle,body[data-bs-theme="dark"] .separator { color:#aebbd0; }
        body[data-bs-theme="dark"] .login-input { background:#0b1320!important; color:#f4f7fb!important; border-color:#34445a!important; }
        body[data-bs-theme="dark"] .login-links a { color:#9bbcff; }
        body[data-bs-theme="dark"] .separator::before,body[data-bs-theme="dark"] .separator::after { background:#34445a; }
        @media(max-width:920px) {
          .login-shell { grid-template-columns:1fr; }
          .login-showcase { min-height:330px; padding:44px 30px; }
          .login-brand { margin-bottom:36px; }
          .login-showcase h1 { font-size:2.7rem; }
          .login-panel { padding:34px 20px 55px; }
        }
        @media(max-width:520px) {
          .login-showcase { min-height:280px; }
          .login-benefits { display:none; }
          .login-card { padding:28px 22px; }
          .login-links { flex-direction:column; gap:8px; }
        }
      `;
export default styles;
