import { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState('');
  const [tsResult, setTsResult] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [tsError, setTsError] = useState('');
  const [dateError, setDateError] = useState('');
  const [unit, setUnit] = useState<'s' | 'ms'>('s');

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  function tsToDate(ts: number, u: 's' | 'ms'): string {
    const ms = u === 's' ? ts * 1000 : ts;
    const d = new Date(ms);
    if (isNaN(d.getTime())) throw new Error('无效时间戳');
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function handleTsConvert() {
    setTsError('');
    setTsResult('');
    const raw = tsInput.trim();
    if (!raw) { setTsError('请输入时间戳'); return; }
    const num = Number(raw);
    if (isNaN(num)) { setTsError('时间戳必须是数字'); return; }
    try {
      // 智能判断单位：13位=毫秒，10位=秒
      const detected: 's' | 'ms' = String(raw).length >= 13 ? 'ms' : 's';
      const u = unit === 's' && String(raw).length >= 13 ? 'ms' : unit;
      const actualUnit = u;
      const d = new Date(actualUnit === 's' ? num * 1000 : num);
      const pad = (n: number) => String(n).padStart(2, '0');
      setTsResult([
        `本地时间：${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
        `UTC 时间：${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`,
        `星期：${['日', '一', '二', '三', '四', '五', '六'][d.getDay()]}`,
        `本年天数：第 ${Math.ceil((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)} 天`,
        `相对现在：${relativeTime(d)}`,
      ].join('\n'));
    } catch (e: any) { setTsError(e.message); }
  }

  function handleDateConvert() {
    setDateError('');
    setDateResult('');
    if (!dateInput.trim()) { setDateError('请输入日期'); return; }
    const d = new Date(dateInput.trim());
    if (isNaN(d.getTime())) { setDateError('日期格式无效，建议 YYYY-MM-DD HH:mm:ss'); return; }
    const s = Math.floor(d.getTime() / 1000);
    const ms = d.getTime();
    setDateResult([
      `秒级时间戳：${s}`,
      `毫秒时间戳：${ms}`,
      `ISO 8601：${d.toISOString()}`,
    ].join('\n'));
  }

  function relativeTime(d: Date): string {
    const diff = d.getTime() - Date.now();
    const abs = Math.abs(diff);
    const days = Math.floor(abs / 86400000);
    const hours = Math.floor((abs % 86400000) / 3600000);
    if (days > 0) return `${diff > 0 ? '' : ''}${days} 天 ${hours} 小时${diff > 0 ? '后' : '前'}`;
    if (hours > 0) return `${hours} 小时${diff > 0 ? '后' : '前'}`;
    const mins = Math.floor(abs / 60000);
    return `${mins} 分钟${diff > 0 ? '后' : '前'}`;
  }

  return (
    <div>
      {/* 实时时间 */}
      <div class="tool-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div class="text-xs text-muted">当前 Unix 时间戳（秒）</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: 'var(--blue-dark)' }}>{now}</div>
        </div>
        <div>
          <div class="text-xs text-muted">当前时间（本地）</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600 }}>{new Date().toLocaleString('zh-CN', { hour12: false })}</div>
        </div>
        <div>
          <div class="text-xs text-muted">毫秒时间戳</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>{Date.now()}</div>
        </div>
      </div>

      <div class="tool-grid-2">
        {/* 时间戳 → 日期 */}
        <div class="tool-card">
          <div class="text-sm font-bold mb-md">时间戳 → 日期</div>
          <div class="toolbar">
            <input class="input" type="text" value={tsInput} onChange={e => setTsInput(e.target.value)} placeholder="如 1700000000" style={{ fontFamily: 'var(--font-mono)' }} />
            <button class="btn btn-primary btn-sm" onClick={handleTsConvert}>转换</button>
          </div>
          <div class="text-xs text-muted mb-md">自动识别 10 位（秒）/ 13 位（毫秒）时间戳</div>
          {tsError ? <div class="status-msg status-error">{tsError}</div> : tsResult && <textarea class="text-area dark" value={tsResult} readOnly style={{ minHeight: '180px' }} />}
        </div>

        {/* 日期 → 时间戳 */}
        <div class="tool-card">
          <div class="text-sm font-bold mb-md">日期 → 时间戳</div>
          <div class="toolbar">
            <input class="input" type="text" value={dateInput} onChange={e => setDateInput(e.target.value)} placeholder="如 2026-07-19 12:00:00" />
            <button class="btn btn-primary btn-sm" onClick={handleDateConvert}>转换</button>
          </div>
          <div class="text-xs text-muted mb-md">支持格式：YYYY-MM-DD HH:mm:ss 或 ISO 字符串</div>
          {dateError ? <div class="status-msg status-error">{dateError}</div> : dateResult && <textarea class="text-area dark" value={dateResult} readOnly style={{ minHeight: '180px' }} />}
        </div>
      </div>
    </div>
  );
}
