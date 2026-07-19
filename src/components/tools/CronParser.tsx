import { useState, useMemo } from 'react';
import { CronExpressionParser } from 'cron-parser';

const SAMPLE = '0 0 9 * * MON-FRI';
const SAMPLES = [
  { expr: '* * * * *', desc: '每分钟' },
  { expr: '0 * * * *', desc: '每分钟整(每小时)' },
  { expr: '0 0 * * *', desc: '每天 0 点' },
  { expr: '0 0 9 * * MON-FRI', desc: '工作日早 9 点' },
  { expr: '0 0 0 1 * *', desc: '每月 1 号 0 点' },
  { expr: '0 0 0 1 1 *', desc: '每年 1 月 1 号' },
  { expr: '*/5 * * * *', desc: '每 5 分钟' },
  { expr: '0 9,18 * * *', desc: '每天 9 点和 18 点' },
  { expr: '0 0 L * *', desc: '每月最后一天（L）' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (d: Date): string => {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function CronParser() {
  const [expr, setExpr] = useState(SAMPLE);
  const [count, setCount] = useState(10);

  const result = useMemo(() => {
    if (!expr.trim()) return null;
    try {
      const interval = CronExpressionParser.parse(expr, { currentDate: new Date() });
      const fields = interval.fields;
      const secArr = (fields.second as any) || [];
      const segs = [
        { label: '秒', value: secArr.join(',') },
        { label: '分', value: (fields.minute as any).join(',') },
        { label: '时', value: (fields.hour as any).join(',') },
        { label: '日', value: (fields.dayOfMonth as any).join(',') },
        { label: '月', value: (fields.month as any).map((m: number) => m).join(',') },
        { label: '周', value: (fields.dayOfWeek as any).join(',') },
      ];
      // 仅当秒段有意义（非唯一 0）时按 6 段展示
      const isSix = secArr.length > 1 || secArr[0] !== 0;

      const next: string[] = [];
      const n = Math.max(1, Math.min(100, count));
      for (let i = 0; i < n; i++) {
        try {
          const d = interval.next();
          next.push(fmtDate((d as any).toDate()));
        } catch { break; }
      }
      return { segs, next, isSix };
    } catch (e: any) {
      return { error: '解析失败：' + (e.message || String(e)) };
    }
  }, [expr, count]);

  return (
    <div>
      <div class="tool-card">
        <div class="font-bold mb-md">Cron 表达式</div>
        <input class="input w-full text-mono" value={expr} onChange={e => setExpr(e.target.value)} placeholder="如：0 0 9 * * MON-FRI" style={{ fontSize: '15px' }} />
        <div class="toolbar mt-md" style={{ alignItems: 'center' }}>
          <div>
            <label class="text-xs text-muted">生成未来数量</label>
            <input class="input mt-md" type="number" min="1" max="100" value={count} onChange={e => setCount(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div class="text-xs text-muted mb-md">常用示例</div>
          <div class="btn-group">
            {SAMPLES.map(s => (
              <button key={s.expr} class="btn btn-ghost btn-sm" title={s.desc} onClick={() => setExpr(s.expr)}>{s.desc}</button>
            ))}
          </div>
        </div>
      </div>

      {result && 'error' in result && <div class="status-msg status-error">{result.error}</div>}

      {result && !('error' in result) && (
        <>
          <div class="tool-card">
            <div class="font-bold mb-md">分段解析</div>
            <div style={{ display: 'grid', gridTemplateColumns: result.isSix ? 'repeat(6, 1fr)' : 'repeat(5, 1fr)', gap: '8px' }}>
              {result.segs.slice(result.isSix ? 0 : 1).map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: '12px 4px', background: 'var(--bg-soft)', borderRadius: 'var(--radius)' }}>
                  <div class="text-xs text-muted">{s.label}</div>
                  <div class="text-mono font-bold mt-md" style={{ fontSize: '13px', wordBreak: 'break-all' }}>{s.value || '*'}</div>
                </div>
              ))}
            </div>
            <div class="text-xs text-muted mt-md">
              {result.isSix ? '6 段格式（含秒）' : '5 段格式（分 时 日 月 周）'} · 时间基于浏览器本地时区
            </div>
          </div>

          <div class="tool-card">
            <div class="font-bold mb-md">未来 {result.next.length} 次执行时间</div>
            {result.next.length === 0 ? (
              <div class="text-muted">无可执行时间</div>
            ) : (
              <div>
                {result.next.map((t, i) => (
                  <div key={i} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid var(--border-light)', gap: '12px', alignItems: 'center' }}>
                    <span class="text-muted text-sm" style={{ width: '32px' }}>#{i + 1}</span>
                    <span class="text-mono" style={{ fontSize: '13px' }}>{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
