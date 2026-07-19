import { useState } from 'react';

export default function UrlEncoder() {
  const [input, setInput] = useState('https://hypergrad.cn/search?q=DeepSeal 加密笔记&lang=zh');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function encode(type: 'encodeURI' | 'encodeURIComponent' | 'decodeURI' | 'decodeURIComponent') {
    setError('');
    setOutput('');
    setCopied(false);
    if (!input) { setError('请输入内容'); return; }
    try {
      if (type === 'encodeURI') setOutput(encodeURI(input));
      else if (type === 'encodeURIComponent') setOutput(encodeURIComponent(input));
      else if (type === 'decodeURI') setOutput(decodeURI(input));
      else setOutput(decodeURIComponent(input));
    } catch (e: any) {
      setError('处理失败：' + (e.message || String(e)));
    }
  }

  function copy() {
    if (output) { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  }

  return (
    <div>
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">输入内容</div>
        <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="输入 URL 或待编码文本" spellCheck={false} style={{ minHeight: '120px' }} />
      </div>

      <div class="btn-group" style={{ marginBottom: '16px' }}>
        <button class="btn btn-primary" onClick={() => encode('encodeURI')}>encodeURI（整条 URL）</button>
        <button class="btn btn-primary" onClick={() => encode('encodeURIComponent')}>encodeURIComponent（参数值）</button>
        <button class="btn btn-secondary" onClick={() => encode('decodeURI')}>decodeURI 解码</button>
        <button class="btn btn-secondary" onClick={() => encode('decodeURIComponent')}>decodeURIComponent 解码</button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span class="text-sm font-bold">输出结果</span>
          {output && <button class="btn btn-ghost btn-sm" onClick={copy}>{copied ? '✓ 已复制' : '复制'}</button>}
        </div>
        {error ? (
          <div class="status-msg status-error">{error}</div>
        ) : (
          <textarea class="text-area dark" value={output} readOnly placeholder="结果将显示在这里..." />
        )}
      </div>

      <div class="tool-card mt-lg">
        <div class="text-sm font-bold mb-md">encodeURI vs encodeURIComponent 的区别</div>
        <table style={{ width: '100%', fontSize: '12px' }}>
          <tr><th style={{ textAlign: 'left', padding: '6px' }}>方法</th><th style={{ textAlign: 'left', padding: '6px' }}>不编码的字符</th><th style={{ textAlign: 'left', padding: '6px' }}>用途</th></tr>
          <tr><td style={{ padding: '6px' }}><code>encodeURI</code></td><td style={{ padding: '6px' }}>A-Z a-z 0-9 - _ . ! ~ * ' ( ) ; , / ? : @ & = + $ #</td><td style={{ padding: '6px' }}>整条 URL</td></tr>
          <tr><td style={{ padding: '6px' }}><code>encodeURIComponent</code></td><td style={{ padding: '6px' }}>A-Z a-z 0-9 - _ . ! ~ * ' ( )</td><td style={{ padding: '6px' }}>URL 参数值（会编码 / ? : @ & 等）</td></tr>
        </table>
      </div>
    </div>
  );
}
