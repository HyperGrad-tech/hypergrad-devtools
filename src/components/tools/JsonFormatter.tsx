import { useState, useMemo, useCallback } from 'react';

type Mode = 'format' | 'minify' | 'validate' | 'tree';
type Indent = 2 | 4 | 0;

const DEFAULT_JSON = `{"name":"HyperGrad","product":"DeepSeal","version":"1.0","features":["加密笔记","密码管理","离线激活","跨平台"],"tags":{"security":"zero-trust","platform":["win","mac","linux"]}}`;

export default function JsonFormatter() {
  const [input, setInput] = useState(DEFAULT_JSON);
  const [indent, setIndent] = useState<Indent>(2);
  const [mode, setMode] = useState<Mode>('format');
  const [error, setError] = useState<string>('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    try {
      const obj = JSON.parse(input);
      return {
        valid: true,
        keys: countKeys(obj),
        size: new Blob([input]).size,
        depth: getDepth(obj),
      };
    } catch {
      return { valid: false, keys: 0, size: new Blob([input]).size, depth: 0 };
    }
  }, [input]);

  function countKeys(obj: any, n = 0): number {
    if (Array.isArray(obj)) return obj.reduce((s, v) => s + countKeys(v, n), n);
    if (obj && typeof obj === 'object') return Object.keys(obj).reduce((s, k) => s + 1 + countKeys(obj[k], n), n);
    return n;
  }
  function getDepth(obj: any, d = 1): number {
    if (Array.isArray(obj)) return obj.length ? Math.max(...obj.map(v => getDepth(v, d + 1))) : d;
    if (obj && typeof obj === 'object') {
      const vals = Object.values(obj);
      return vals.length ? Math.max(...vals.map(v => getDepth(v, d + 1))) : d;
    }
    return d;
  }

  const handleProcess = useCallback(() => {
    setError('');
    setOutput('');
    setCopied(false);
    if (!input.trim()) {
      setError('请输入 JSON 内容');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else if (mode === 'validate') {
        setOutput('✓ JSON 格式合法\n\n解析结果：\n' + JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed, null, indent));
      }
    } catch (e: any) {
      const msg = e.message || String(e);
      setError('JSON 解析错误：' + msg);
      // 尝试定位错误位置
      const posMatch = msg.match(/position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const before = input.substring(Math.max(0, pos - 30), pos);
        const after = input.substring(pos, pos + 30);
        setError('JSON 解析错误：' + msg + '\n\n错误位置附近：\n…' + before + '⟨这里⟩' + after + '…');
      }
    }
  }, [input, mode, indent]);

  const handleCopy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div>
      {/* 工具栏 */}
      <div class="toolbar">
        <span class="toolbar-label">模式</span>
        <div class="tabs" style={{ borderBottom: 'none', marginBottom: 0 }}>
          <div class={`tab ${mode === 'format' ? 'active' : ''}`} onClick={() => setMode('format')}>格式化</div>
          <div class={`tab ${mode === 'minify' ? 'active' : ''}`} onClick={() => setMode('minify')}>压缩</div>
          <div class={`tab ${mode === 'validate' ? 'active' : ''}`} onClick={() => setMode('validate')}>校验</div>
        </div>
        <span style={{ marginLeft: 'auto' }}></span>
        <span class="toolbar-label">缩进</span>
        <select class="select" value={indent} onChange={e => setIndent(Number(e.target.value) as Indent)}>
          <option value={2}>2 空格</option>
          <option value={4}>4 空格</option>
          <option value={0}>制表符</option>
        </select>
      </div>

      {/* 统计 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>状态：{stats.valid ? <strong style={{ color: 'var(--green)' }}>✓ 合法</strong> : <strong style={{ color: 'var(--red)' }}>✗ 错误</strong>}</span>
        {stats.valid && <span>键数：{stats.keys}</span>}
        {stats.valid && <span>层级：{stats.depth}</span>}
        <span>大小：{formatBytes(stats.size)}</span>
      </div>

      {/* 输入输出 */}
      <div class="tool-grid-2">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span class="text-sm font-bold">JSON 输入</span>
            <button class="btn btn-ghost btn-sm" onClick={handleClear}>清空</button>
          </div>
          <textarea
            class="text-area"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="在此粘贴 JSON 字符串..."
            spellCheck={false}
          />
          <div class="btn-group" style={{ marginTop: '12px' }}>
            <button class="btn btn-primary" onClick={handleProcess}>
              {mode === 'format' ? '格式化' : mode === 'minify' ? '压缩' : '校验'} →
            </button>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span class="text-sm font-bold">输出结果</span>
            {output && <button class="btn btn-ghost btn-sm" onClick={handleCopy}>{copied ? '✓ 已复制' : '复制'}</button>}
          </div>
          {error ? (
            <div class="status-msg status-error" style={{ minHeight: '240px', whiteSpace: 'pre-wrap' }}>{error}</div>
          ) : (
            <textarea
              class="text-area dark"
              value={output}
              readOnly
              placeholder="处理结果将显示在这里..."
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}
