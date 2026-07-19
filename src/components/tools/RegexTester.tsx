import { useState, useMemo } from 'react';

const COMMON_REGEX: { name: string; pattern: string; desc: string }[] = [
  { name: '手机号', pattern: '^1[3-9]\\d{9}$', desc: '中国大陆手机号' },
  { name: '邮箱', pattern: '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', desc: '电子邮箱' },
  { name: 'URL', pattern: '^https?://[\\w.-]+(:\\d+)?(/[\\w./?-=%&]*)?$', desc: 'HTTP(S) 链接' },
  { name: 'IP 地址', pattern: '^(\\d{1,3}\\.){3}\\d{1,3}$', desc: 'IPv4' },
  { name: '身份证', pattern: '^\\d{17}[\\dXx]$', desc: '18 位身份证' },
  { name: '日期', pattern: '^\\d{4}-\\d{2}-\\d{2}$', desc: 'YYYY-MM-DD' },
  { name: '整数', pattern: '^-?\\d+$', desc: '正负整数' },
  { name: '浮点数', pattern: '^(-?\\d+)(\\.\\d+)?$', desc: '小数' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('HyperGrad DevTools v1.0 发布于 2026-07-19，支持 20+ 工具。');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    setError('');
    if (!pattern) return { matches: [], highlighted: text, count: 0 };
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let m: RegExpExecArray | null;
      if (flags.includes('g')) {
        let safety = 0;
        while ((m = re.exec(text)) !== null && safety < 10000) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === re.lastIndex) re.lastIndex++;
          safety++;
        }
      } else {
        m = re.exec(text);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      // 高亮
      let highlighted = '';
      let last = 0;
      for (const mt of matches) {
        highlighted += escapeHtml(text.substring(last, mt.index));
        highlighted += `<mark class="regex-match">${escapeHtml(mt.match)}</mark>`;
        last = mt.index + mt.match.length;
      }
      highlighted += escapeHtml(text.substring(last));
      return { matches, highlighted, count: matches.length };
    } catch (e: any) {
      setError('正则语法错误：' + (e.message || String(e)));
      return { matches: [], highlighted: escapeHtml(text), count: 0 };
    }
  }, [pattern, flags, text]);

  return (
    <div>
      {/* 正则输入 */}
      <div class="tool-card">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-dark)', fontSize: '18px', fontWeight: 700 }}>/</span>
          <input
            class="input"
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="输入正则表达式，如 \d+"
            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '14px' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-dark)', fontSize: '18px', fontWeight: 700 }}>/</span>
          <input
            class="input"
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="标志"
            style={{ width: '80px', fontFamily: 'var(--font-mono)' }}
            title="标志：g 全局, i 忽略大小写, m 多行, s . 匹配换行"
          />
        </div>
        {error && <div class="status-msg status-error">{error}</div>}
        <div class="text-xs text-muted">
          标志：g 全局匹配 · i 忽略大小写 · m 多行 · s . 匹配换行符 · u Unicode · y 粘性
        </div>
      </div>

      {/* 常用正则 */}
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">常用正则表达式</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {COMMON_REGEX.map(r => (
            <button
              class="btn btn-secondary btn-sm"
              onClick={() => { setPattern(r.pattern); setFlags('g'); }}
              title={r.pattern}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* 测试文本与结果 */}
      <div class="tool-grid-2">
        <div>
          <div class="text-sm font-bold mb-md">待测试文本</div>
          <textarea
            class="text-area"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="输入待匹配文本..."
            spellCheck={false}
          />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <span class="text-sm font-bold">匹配结果</span>
            <span class="tag tag-p0">{result.count} 个匹配</span>
          </div>
          <div class="output-box light" style={{ minHeight: '240px' }} dangerouslySetInnerHTML={{ __html: result.highlighted }}></div>
          {result.matches.length > 0 && (
            <div style={{ marginTop: '12px', maxHeight: '200px', overflowY: 'auto' }}>
              <div class="text-xs text-muted mb-md">匹配详情：</div>
              {result.matches.slice(0, 100).map((m, i) => (
                <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: '12px' }}>
                  <span class="text-muted">#{i + 1} @ {m.index}:</span>{' '}
                  <code style={{ background: 'var(--amber-bg)', padding: '1px 4px', borderRadius: '3px', fontFamily: 'var(--font-mono)' }}>{m.match}</code>
                  {m.groups.length > 0 && <span class="text-muted"> 分组: [{m.groups.join(', ')}]</span>}
                </div>
              ))}
              {result.matches.length > 100 && <div class="text-xs text-muted">…还有 {result.matches.length - 100} 个</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
