import { useState, useEffect, useCallback, useRef } from 'react';
import * as prettier from 'prettier/standalone';
import * as parserPostcss from 'prettier/plugins/postcss';

const SAMPLE = `.container{display:flex;flex-direction:column;gap:16px;padding:24px;background:#fafaf7}.btn{padding:8px 16px;border-radius:6px;font-weight:600;transition:all .15s}.btn:hover{background:#2d5f8a;color:#fff}`;

const minify = (src: string): string => {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
};

export default function CssFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [tabWidth, setTabWidth] = useState(2);
  const [printWidth, setPrintWidth] = useState(80);
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const reqId = useRef(0);

  useEffect(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    if (mode === 'minify') {
      setOutput(minify(input));
      setError('');
      return;
    }
    const id = ++reqId.current;
    prettier.format(input, {
      parser: 'css',
      plugins: [parserPostcss],
      tabWidth,
      printWidth,
    }).then(result => {
      if (id === reqId.current) { setOutput(result); setError(''); }
    }).catch(e => {
      if (id === reqId.current) { setOutput(''); setError('格式化失败：' + (e.message || String(e))); }
    });
  }, [input, mode, tabWidth, printWidth]);

  const doCopy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  return (
    <div>
      <div class="toolbar" style={{ alignItems: 'center' }}>
        <div class="tabs" style={{ margin: 0, borderBottom: 'none' }}>
          <div class={`tab ${mode === 'format' ? 'active' : ''}`} onClick={() => setMode('format')}>格式化</div>
          <div class={`tab ${mode === 'minify' ? 'active' : ''}`} onClick={() => setMode('minify')}>压缩</div>
        </div>
        {mode === 'format' && (
          <>
            <div>
              <label class="text-xs text-muted">缩进</label>
              <select class="select mt-md" value={tabWidth} onChange={e => setTabWidth(Number(e.target.value))}>
                <option value={2}>2 空格</option>
                <option value={4}>4 空格</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-muted">行宽</label>
              <input class="input mt-md" type="number" value={printWidth} onChange={e => setPrintWidth(Number(e.target.value))} style={{ width: '90px' }} />
            </div>
          </>
        )}
        <button class="btn btn-ghost btn-sm" onClick={() => setInput(SAMPLE)}>示例</button>
        <button class="btn btn-ghost btn-sm" onClick={() => setInput('')}>清空</button>
      </div>

      {error && <div class="status-msg status-error">{error}</div>}

      <div class="tool-grid-2">
        <div class="tool-card">
          <div class="font-bold mb-md">输入 CSS</div>
          <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="粘贴待格式化的 CSS 代码" style={{ minHeight: '400px' }} />
          <div class="text-xs text-muted mt-md">{input.length} 字符</div>
        </div>
        <div class="tool-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} class="mb-md">
            <div class="font-bold">{mode === 'format' ? '格式化结果' : '压缩结果'}</div>
            <button class="btn btn-secondary btn-sm" onClick={doCopy} disabled={!output}>{copied ? '已复制' : '复制'}</button>
          </div>
          <textarea class="text-area dark" value={output} readOnly style={{ minHeight: '400px' }} />
          <div class="text-xs text-muted mt-md">{output.length} 字符</div>
        </div>
      </div>
    </div>
  );
}
