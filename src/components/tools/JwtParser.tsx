import { useState, useMemo } from 'react';

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAxIiwibmFtZSI6Ikh5cGVyR3JhZCIsImlhdCI6MTczNzE4NDAwMCwiZXhwIjoxNzM3MjcwNDAwLCJyb2xlIjoiYWRtaW4ifQ.signature_part_is_not_verified';

const b64urlDecode = (s: string): string => {
  let str = s.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  // handle UTF-8
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
};

const fmtTime = (ts: number): string => {
  const d = new Date(ts * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

export default function JwtParser() {
  const [input, setInput] = useState(SAMPLE);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    const parts = input.trim().split('.');
    if (parts.length < 2) return { error: 'JWT 格式错误：至少需要 header.payload 两段，用 . 分隔' };
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      const signature = parts[2] || '(无)';
      const now = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === 'number' ? payload.exp : null;
      const nbf = typeof payload.nbf === 'number' ? payload.nbf : null;
      const iat = typeof payload.iat === 'number' ? payload.iat : null;

      let status: 'valid' | 'expired' | 'notyet' | 'unknown' = 'unknown';
      let statusText = '无 exp 字段，无法判断有效期';
      if (exp !== null) {
        if (now > exp) { status = 'expired'; statusText = `已过期（过期于 ${fmtTime(exp)}）`; }
        else { status = 'valid'; statusText = `有效（将于 ${fmtTime(exp)} 过期）`; }
      }
      if (nbf !== null && now < nbf) { status = 'notyet'; statusText = `尚未生效（生效时间 ${fmtTime(nbf)}）`; }

      return { header, payload, signature, exp, nbf, iat, status, statusText, now };
    } catch (e: any) {
      return { error: '解析失败：' + e.message };
    }
  }, [input]);

  const statusClass = result && 'status' in result ? (result.status === 'valid' ? 'status-success' : result.status === 'expired' || result.status === 'notyet' ? 'status-error' : 'status-info') : '';

  const renderJson = (obj: any) => JSON.stringify(obj, null, 2);

  const claims: { key: string; label: string; value: string }[] = [];
  if (result && !('error' in result) && result.payload) {
    const p = result.payload;
    if (result.iat !== null) claims.push({ key: 'iat', label: '签发时间 (iat)', value: `${fmtTime(result.iat)} (${result.iat})` });
    if (result.nbf !== null) claims.push({ key: 'nbf', label: '生效时间 (nbf)', value: `${fmtTime(result.nbf)} (${result.nbf})` });
    if (result.exp !== null) claims.push({ key: 'exp', label: '过期时间 (exp)', value: `${fmtTime(result.exp)} (${result.exp})` });
    if (p.iss) claims.push({ key: 'iss', label: '签发者 (iss)', value: String(p.iss) });
    if (p.aud) claims.push({ key: 'aud', label: '受众 (aud)', value: String(p.aud) });
    if (p.sub) claims.push({ key: 'sub', label: '主体 (sub)', value: String(p.sub) });
    for (const k of Object.keys(p)) {
      if (!['iat', 'nbf', 'exp', 'iss', 'aud', 'sub'].includes(k)) {
        claims.push({ key: k, label: k, value: typeof p[k] === 'object' ? JSON.stringify(p[k]) : String(p[k]) });
      }
    }
  }

  return (
    <div>
      <div class="tool-card">
        <div class="font-bold mb-md">JWT Token</div>
        <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="粘贴 JWT Token（三段以 . 分隔）" style={{ minHeight: '100px', wordBreak: 'break-all' }} />
        <div class="btn-group mt-md">
          <button class="btn btn-ghost btn-sm" onClick={() => setInput(SAMPLE)}>示例</button>
          <button class="btn btn-ghost btn-sm" onClick={() => setInput('')}>清空</button>
        </div>
      </div>

      {result && 'error' in result && <div class="status-msg status-error">{result.error}</div>}

      {result && !('error' in result) && (
        <>
          <div class={`status-msg ${statusClass}`}>{result.statusText}</div>

          <div class="tool-card">
            <div class="font-bold mb-md">Header（头部）</div>
            <textarea class="text-area dark" value={renderJson(result.header)} readOnly style={{ minHeight: '100px' }} />
          </div>

          <div class="tool-card">
            <div class="font-bold mb-md">Payload（载荷）</div>
            <textarea class="text-area dark" value={renderJson(result.payload)} readOnly style={{ minHeight: '140px' }} />
          </div>

          {claims.length > 0 && (
            <div class="tool-card">
              <div class="font-bold mb-md">字段说明</div>
              <div>
                {claims.map(c => (
                  <div key={c.key} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid var(--border-light)', gap: '12px' }}>
                    <div style={{ width: '160px', flexShrink: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{c.label}</div>
                    <div class="text-mono" style={{ fontSize: '13px', wordBreak: 'break-all' }}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div class="tool-card">
            <div class="font-bold mb-md">Signature（签名）</div>
            <div class="text-mono" style={{ fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all', background: 'var(--bg-soft)', padding: '12px', borderRadius: 'var(--radius)' }}>
              {result.signature}
            </div>
            <div class="text-xs text-muted mt-md">注意：本工具只解析不验签。要验证签名有效性需服务端的密钥或公钥。</div>
          </div>
        </>
      )}
    </div>
  );
}
