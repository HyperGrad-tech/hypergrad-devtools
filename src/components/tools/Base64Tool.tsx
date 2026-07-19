import { useState, useRef } from 'react';

export default function Base64Tool() {
  const [text, setText] = useState('Hello HyperGrad');
  const [b64, setB64] = useState('');
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [imgB64, setImgB64] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function encode() {
    setError('');
    try {
      setB64(btoa(unescape(encodeURIComponent(text))));
    } catch { setError('编码失败'); }
  }
  function decode() {
    setError('');
    try {
      setText(decodeURIComponent(escape(atob(b64.trim()))));
    } catch { setError('解码失败：非有效 Base64'); }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError('图片不能超过 5MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImgSrc(result);
      setImgB64(result);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div>
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">文本 ↔ Base64</div>
        <div class="tool-grid-2">
          <div>
            <div class="text-xs text-muted mb-md">文本</div>
            <textarea class="text-area" value={text} onChange={e => setText(e.target.value)} placeholder="输入文本" style={{ minHeight: '140px' }} />
            <button class="btn btn-primary btn-sm mt-md" onClick={encode}>编码 →</button>
          </div>
          <div>
            <div class="text-xs text-muted mb-md">Base64</div>
            <textarea class="text-area dark" value={b64} onChange={e => setB64(e.target.value)} placeholder="Base64 字符串" style={{ minHeight: '140px' }} />
            <button class="btn btn-secondary btn-sm mt-md" onClick={decode}>← 解码</button>
          </div>
        </div>
        {error && <div class="status-msg status-error mt-md">{error}</div>}
      </div>

      <div class="tool-card">
        <div class="text-sm font-bold mb-md">图片 ↔ Base64（Data URL）</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '40px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
              <div>点击选择图片，或拖入此区域</div>
              <div class="text-xs mt-md">支持 PNG / JPEG / WebP / GIF · 最大 5MB · 本地处理</div>
            </div>
            {imgSrc && (
              <div class="mt-md">
                <img src={imgSrc} alt="预览" style={{ maxWidth: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <div class="text-xs text-muted mb-md">Base64 Data URL</div>
            <textarea class="text-area dark" value={imgB64} readOnly placeholder="选择图片后在此显示 Base64" style={{ minHeight: '180px', fontSize: '11px' }} />
            {imgB64 && <button class="btn btn-ghost btn-sm mt-md" onClick={() => { navigator.clipboard.writeText(imgB64); }}>复制 Data URL</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
