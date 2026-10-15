const CSS = `
  .db-filter-note{color:var(--text-muted,#64748b);font-size:.82rem;line-height:1.6;margin:-8px 0 22px;max-width:1000px;}
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }

  .db-filters {
    background: white; padding: 18px 20px; border-radius: 12px; margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;
  }
  .db-filter-group { display: flex; flex-direction: column; gap: 5px; }
  .db-filter-group label { font-size: 0.8rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; }
  .db-filter-group input, .db-filter-group select {
    padding: 9px 13px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; min-width: 150px;
  }
  .db-filter-group input:focus, .db-filter-group select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .db-btn-apply {
    background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;
    padding: 9px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;
    font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px;
  }
  .db-btn-apply:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(102,126,234,0.3); }

  /* KPI */
  .db-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .db-kpi-card {
    background: white; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex; align-items: center; gap: 16px; transition: all 0.25s ease; border-left: 4px solid transparent;
    min-width: 0;
  }
  .db-kpi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
  .db-kpi-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
  .db-kpi-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
  .db-kpi-label { font-size: 0.78rem; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .db-kpi-value {
    font-size: 1.6rem; font-weight: 700; color: #1e3a5f; line-height: 1.1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  /* Solo el valor monetario usa clamp para reducirse si es muy largo */
  .db-kpi-value--money {
    font-size: clamp(1rem, 2.2vw, 1.6rem);
    white-space: nowrap;
  }
  .db-kpi-sub { font-size: 0.78rem; color: #a0aec0; margin-top: 2px; }

  /* Estado órdenes */
  .db-section-title { font-size: 0.85rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; margin-top: 4px; }
  .db-order-status-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; margin-bottom: 24px; }
  .db-status-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .db-status-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .db-status-count { font-size: 1.6rem; font-weight: 700; }
  .db-status-label { font-size: 0.8rem; color: #718096; margin-bottom: 8px; }
  .db-status-bar-track { height: 4px; background: #f0f4f8; border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
  .db-status-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
  .db-status-pct { font-size: 0.72rem; color: #a0aec0; }

  /* Charts */
  .db-charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 20px; margin-bottom: 20px; }
  .db-card { background: white; border-radius: 14px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .db-card-title { font-size: 0.95rem; font-weight: 700; color: #1e3a5f; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .db-card-title svg { color: #667eea; }
  .db-empty { text-align: center; color: #a0aec0; padding: 32px 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }

  /* Bottom 3 cols */
  .db-bottom-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 24px; }

  /* Stock bajo */
  .db-stock-list { display: flex; flex-direction: column; gap: 10px; }
  .db-stock-row { display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #fffaf0; border-radius: 8px; border-left: 3px solid #f6ad55; }
  .db-stock-name { font-size: 0.88rem; font-weight: 600; color: #1e3a5f; }
  .db-stock-branch { font-size: 0.78rem; color: #718096; }
  .db-stock-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }

  /* Top productos */
  .db-top-list { display: flex; flex-direction: column; gap: 10px; }
  .db-top-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f0f4f8; }
  .db-top-row:last-child { border-bottom: none; }
  .db-top-rank { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem; flex-shrink: 0; }
  .rank-0 { background: linear-gradient(135deg,#ffd700,#ffed4e); color: #744210; }
  .rank-1 { background: linear-gradient(135deg,#c0c0c0,#e8e8e8); color: #4a5568; }
  .rank-2 { background: linear-gradient(135deg,#cd7f32,#e8a87c); color: #744210; }
  .rank-n { background: #edf2f7; color: #718096; }
  .db-top-info { flex: 1; min-width: 0; }
  .db-top-name { font-size: 0.88rem; font-weight: 600; color: #1e3a5f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-top-sub { font-size: 0.76rem; color: #a0aec0; }
  .db-top-val { font-size: 0.88rem; font-weight: 700; color: #48bb78; white-space: nowrap; }

  /* Órdenes recientes */
  .db-orders-list { display: flex; flex-direction: column; gap: 10px; }
  .db-order-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f4f8; }
  .db-order-row:last-child { border-bottom: none; }
  .db-order-name { font-size: 0.88rem; font-weight: 600; color: #1e3a5f; }
  .db-order-date { font-size: 0.76rem; color: #a0aec0; }
  .db-order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .db-order-total { font-size: 0.88rem; font-weight: 700; color: #1e3a5f; }
  .db-order-badge { padding: 2px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }

  /* Usuarios */
  .db-users-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 24px; }
  .db-user-stat { background: white; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
  .db-user-stat-val { font-size: 1.8rem; font-weight: 700; }
  .db-user-stat-label { font-size: 0.78rem; color: #718096; }
`;
export default CSS;
