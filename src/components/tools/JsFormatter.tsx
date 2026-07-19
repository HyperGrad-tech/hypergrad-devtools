import { useState, useEffect, useCallback, useRef } from 'react';
import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';

const SAMPLE = `function fib(n){if(n<2)return n;return fib(n-1)+fib(n-2)}
const user={name:'HyperGrad',tools:['json','regex'],get first(){return this.tools[0]}}`;

const minify = (src: string): string => {
  // 保守压缩：去块注释、折行内多余空白、去空行，保留换行以防 ASI
  let r = src.replace(/\/\*[\s\S]*?\*\//g, '');
  return r.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => l.length > 0).join('\n');
};

export default function JsFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [semi, setSemi] = useState(true);
  const [singleQuote, setSingleQuote] = useState(true);
  const [tabWidth, setTabWidth] = useState(2);
  const [printWidth, setPrintWidth] = useState(100);
  const [trailingComma, setTrailingComma] = useState<'none' | 'es5' | 'all'>('all');
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
      parser: 'babel',
      plugins: [parserBabel, parserEstree],
      semi, singleQuote, tabWidth, printWidth, trailingComma,
    }).then(result => {
      if (id === reqId.current) { setOutput(result); setError(''); }
    }).catch(e => {
      if (id === reqId.current) { setOutput(''); setError('格式化失败：' + (e.message || String(e))); }
    });
  }, [input, mode, semi, singleQuote, tabWidth, printWidth, trailingComma]);

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
      </div>

      {mode === 'format' && (
        <div class="toolbar" style={{ alignItems: 'center' }}>
          <label class="flex items-center gap-sm text-sm"><input type="checkbox" checked={semi} onChange={e => setSemi(e.target.checked)} /> 分号</label>
          <label class="flex items-center gap-sm text-sm"><input type="checkbox" checked={singleQuote} onChange={e => setSingleQuote(e.target.checked)} /> 单引号</label>
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
          <div>
            <label class="text-xs text-muted">尾随逗号</label>
            <select class="select mt-md" value={trailingComma} onChange={e => setTrailingComma(e.target.value as any)}>
              <option value="none">none</option>
              <option value="es5">es5</option>
              <option value="all">all</option>
            </select>
          </div>
          <button class="btn btn-ghost btn-sm" onClick={() => setInput(SAMPLE)}>示例</button>
          <button class="btn btn-ghost btn-sm" onClick={() => setInput('')}>清空</button>
        </div>
      )}

      {error && <div class="status-msg status-error">{error}</div>}

      <div class="tool-grid-2">
        <div class="tool-card">
          <div class="font-bold mb-md">输入 JS</div>
          <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="粘贴待格式化的 JavaScript 代码" style={{ minHeight: '400px' }} />
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
