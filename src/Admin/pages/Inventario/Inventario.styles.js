const S = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .inv-wrap { font-family: 'DM Sans', sans-serif; }
  .inv-toolbar {
    background: white; padding: 20px; border-radius: 12px;
    margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: space-between;
  }
  .inv-search-box { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
  .inv-search-box input { width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; }
  .inv-search-box input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .inv-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 1.2rem; }
  .inv-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; min-width: 160px; background: white; }
  .inv-date-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
  .inv-date-label { font-size: .75rem; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }
  .inv-date-input { padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: .88rem; font-family: inherit; background: white; color: #2d3748; }
  .inv-date-input:focus { outline: none; border-color: #1e3a5f; }
  .inv-date-sep { color: #a0aec0; }
  .inv-date-clear { background: none; border: none; color: #a0aec0; cursor: pointer; font-size: .8rem; padding: 2px 6px; border-radius: 4px; font-family: inherit; }
  .inv-date-clear:hover { color: #e53e3e; background: #fff5f5; }
  .inv-btn { padding: 10px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: inherit; font-size: .88rem; font-weight: 600; border: 1.5px solid transparent; transition: all .2s; }
  .inv-btn-refresh { background: #f7fafc; color: #2d3748; border-color: #e2e8f0; }
  .inv-btn-refresh:hover { background: #edf2f7; }
  .inv-btn-export { background: #ebf8ff; color: #2b6cb0; border-color: #bee3f8; }
  .inv-btn-export:hover { background: #bee3f8; }
  .inv-btn-import { background: #f0fff4; color: #276749; border-color: #c6f6d5; }
  .inv-btn-import:hover { background: #c6f6d5; }
  .inv-btn:disabled { opacity: .5; cursor: not-allowed; }
  .inv-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .inv-stat-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 4px; }
  .inv-stat-label { font-size: 0.8rem; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .inv-stat-value { font-size: 2rem; font-weight: 700; color: #1e3a5f; }
  .inv-stat-sub { font-size: 0.8rem; color: #a0aec0; }
  .inv-table-wrap { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden; }
  .inv-table { width: 100%; border-collapse: collapse; }
  .inv-table thead { background: #f7fafc; }
  .inv-table th { padding: 14px 16px; text-align: left; font-size: 0.8rem; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
  .inv-table td { padding: 14px 16px; border-bottom: 1px solid #f0f4f8; color: #2d3748; vertical-align: middle; }
  .inv-table tbody tr:hover { background: #f7fafc; }
  .inv-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
  .inv-badge.ok  { background: #c6f6d5; color: #276749; }
  .inv-badge.low { background: #fef5e7; color: #975a16; }
  .inv-badge.out { background: #fed7d7; color: #9b2c2c; }
  .inv-progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 4px; overflow: hidden; }
  .inv-progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
  .inv-edit-btn { background: #bee3f8; color: #2c5282; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-family: inherit; }
  .inv-edit-btn:hover { background: #90cdf4; }
  .inv-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
  .inv-modal { background: white; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); font-family: 'DM Sans', sans-serif; animation: invIn .22s ease; }
  .inv-modal-lg  { max-width: 900px; max-height: 90vh; overflow-y: auto; }
  .inv-modal-md  { max-width: 520px; max-height: 90vh; overflow-y: auto; }
  @keyframes invIn { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .inv-modal-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; border-radius: 16px 16px 0 0; z-index: 1; }
  .inv-modal-header h3 { margin: 0; color: #1e3a5f; font-size: 1.1rem; font-weight: 700; }
  .inv-modal-close { background: #f7fafc; border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #718096; }
  .inv-modal-close:hover { background: #fed7d7; color: #9b2c2c; }
  .inv-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .inv-form-group { display: flex; flex-direction: column; gap: 6px; }
  .inv-form-group label { font-weight: 600; font-size: 0.9rem; color: #2d3748; }
  .inv-form-group input { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; font-family: inherit; }
  .inv-form-group input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
  .inv-modal-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; justify-content: flex-end; position: sticky; bottom: 0; background: white; border-radius: 0 0 16px 16px; }
  .inv-btn-cancel { padding: 10px 20px; border: 1px solid #e2e8f0; background: white; color: #2d3748; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; }
  .inv-btn-save { padding: 10px 20px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .inv-btn-save:hover { background: #2c5282; }
  .inv-btn-save:disabled { opacity: .5; cursor: not-allowed; }
  .inv-empty { padding: 48px; text-align: center; color: #718096; }
  .inv-info-box { background: #ebf8ff; border: 1px solid #bee3f8; color: #2c5282; padding: 12px 14px; border-radius: 8px; font-size: .84rem; line-height: 1.5; }
  .inv-warn-box { background: #fffbeb; border: 1px solid #f6e05e; color: #744210; padding: 12px 14px; border-radius: 8px; font-size: .84rem; line-height: 1.6; }
  .inv-success-box { background: #f0fff4; border: 1px solid #9ae6b4; color: #276749; padding: 14px 16px; border-radius: 10px; font-size: .88rem; line-height: 1.7; }
  .inv-summary-badge { padding: 5px 12px; border-radius: 20px; font-size: .8rem; font-weight: 700; }
  .inv-summary-badge.new { background: #c6f6d5; color: #276749; }
  .inv-summary-badge.dup { background: #fef5e7; color: #975a16; }
  .inv-export-table-wrap { max-height: 400px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; }
  .inv-export-table { width: 100%; border-collapse: collapse; font-size: .78rem; }
  .inv-export-table thead { position: sticky; top: 0; background: #f7fafc; z-index: 1; }
  .inv-export-table th { padding: 9px 12px; text-align: left; color: #4a5568; font-weight: 700; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
  .inv-export-table td { padding: 7px 12px; border-bottom: 1px solid #f0f4f8; }
  .inv-export-table tr:hover td { background: #f8fafc; }
  .inv-cell-empty { color: #cbd5e0; font-style: italic; font-size: .73rem; }
  .inv-cell-warn  { background: #fffbeb !important; }
  .inv-export-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
  .inv-export-stat { padding: 5px 14px; border-radius: 20px; font-size: .8rem; font-weight: 700; }
  .inv-export-stat.total { background: #ebf8ff; color: #2b6cb0; }
  .inv-export-stat.warn  { background: #fffbeb; color: #975a16; }
  .inv-export-stat.ok    { background: #c6f6d5; color: #276749; }
  .inv-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .inv-result-card { border-radius: 10px; padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; }
  .inv-result-card.created { background: #f0fff4; border: 1px solid #9ae6b4; }
  .inv-result-card.updated { background: #ebf8ff; border: 1px solid #90cdf4; }
  .inv-result-card.skipped { background: #f7fafc; border: 1px solid #e2e8f0; }
  .inv-result-card.errors  { background: #fff5f5; border: 1px solid #fc8181; }
  .inv-result-num { font-size: 2rem; font-weight: 700; line-height: 1; }
  .inv-result-num.created { color: #276749; }
  .inv-result-num.updated { color: #2b6cb0; }
  .inv-result-num.skipped { color: #718096; }
  .inv-result-num.errors  { color: #9b2c2c; }
  .inv-date-active { margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: .82rem; color: #2b6cb0; }
  .inv-toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; padding: 12px 20px; border-radius: 10px; color: white; font-family: 'DM Sans', sans-serif; font-size: .88rem; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); animation: invIn .3s ease; }
  .inv-toast.ok  { background: #276749; }
  .inv-toast.err { background: #9b2c2c; }
  .spinning { animation: spin .9s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;
export default S;
