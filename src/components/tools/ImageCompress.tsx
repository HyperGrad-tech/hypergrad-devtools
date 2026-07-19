import { useState, useRef, useCallback } from 'react';

type Format = 'image/jpeg' | 'image/webp' | 'image/png';

export default function ImageCompress() {
  const [origSrc, setOrigSrc] = useState('');
  const [outSrc, setOutSrc] = useState('');
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<Format>('image/jpeg');
  const [maxW, setMaxW] = useState(0);
  const [imgInfo, setImgInfo] = useState({ w: 0, h: 0, type: '' });
  const [outInfo, setOutInfo] = useState({ w: 0, h: 0 });
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('compressed');
  const inputRef = useRef<HTMLInputElement>(null);

  const readableSize = (b: number) => {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  };

  const compress = useCallback((img: HTMLImageElement) => {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (maxW > 0 && w > maxW) {
      h = Math.round(h * (maxW / w));
      w = maxW;
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    // PNG 透明背景，jpeg/webp 需白底避免黑底
    if (format !== 'image/png') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    const out = canvas.toDataURL(format, format === 'image/png' ? undefined : quality);
    setOutSrc(out);
    setOutInfo({ w, h });
    setOutSize(Math.round((out.length - out.indexOf(',') - 1) * 3 / 4));
  }, [format, quality, maxW]);

  const handleFile = useCallback((file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    setOrigSize(file.size);
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'compressed');
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setOrigSrc(src);
      const img = new Image();
      img.onload = () => {
        setImgInfo({ w: img.naturalWidth, h: img.naturalHeight, type: file.type });
        compress(img);
      };
      img.onerror = () => setError('图片加载失败');
      img.src = src;
    };
    reader.onerror = () => setError('文件读取失败');
    reader.readAsDataURL(file);
  }, [compress]);

  // 重新压缩（参数变化时）
  const reCompress = useCallback(() => {
    if (!origSrc) return;
    const img = new Image();
    img.onload = () => compress(img);
    img.src = origSrc;
  }, [origSrc, compress]);

  const download = () => {
    if (!outSrc) return;
    const a = document.createElement('a');
    a.href = outSrc;
    a.download = `${fileName}.${format.split('/')[1]}`;
    a.click();
  };

  const ratio = origSize > 0 ? Math.max(0, Math.round((1 - outSize / origSize) * 100)) : 0;

  return (
    <div>
      <div class="tool-card">
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {!origSrc ? (
          <div onClick={() => inputRef.current?.click()} style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '60px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🖼</div>
            <div class="font-bold" style={{ color: 'var(--text)', marginBottom: '6px' }}>点击选择图片</div>
            <div class="text-sm">支持 PNG / JPEG / WebP，本地处理不上传</div>
          </div>
        ) : (
          <div class="toolbar">
            <button class="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>更换图片</button>
            <span class="text-muted text-sm">{ fileName }</span>
          </div>
        )}
      </div>

      {origSrc && (
        <>
          <div class="tool-card">
            <div class="font-bold mb-md">压缩参数</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label class="text-xs text-muted">输出格式</label>
                <select class="select w-full mt-md" value={format} onChange={e => { setFormat(e.target.value as Format); }}>
                  <option value="image/jpeg">JPEG（有损）</option>
                  <option value="image/webp">WebP（有损/更小）</option>
                  <option value="image/png">PNG（无损）</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-muted">质量 {format === 'image/png' ? '（PNG 无效）' : `${Math.round(quality * 100)}%`}</label>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} disabled={format === 'image/png'}
                  onChange={e => setQuality(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '12px' }} />
              </div>
              <div>
                <label class="text-xs text-muted">最大宽度（0 = 原尺寸）</label>
                <input class="input w-full mt-md" type="number" min="0" value={maxW} onChange={e => setMaxW(Number(e.target.value))} />
              </div>
              <div>
                <button class="btn btn-primary" onClick={reCompress} style={{ width: '100%' }}>重新压缩</button>
              </div>
            </div>
          </div>

          <div class="tool-card">
            <div class="font-bold mb-md">压缩结果</div>
            {error ? (
              <div class="status-msg status-error">{error}</div>
            ) : (
              <div class="tool-grid-2">
                <div>
                  <div class="text-xs text-muted mb-md">原始 · {readableSize(origSize)} · {imgInfo.w}×{imgInfo.h} · {imgInfo.type.replace('image/','').toUpperCase()}</div>
                  <img src={origSrc} alt="原始" style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
                </div>
                <div>
                  <div class="text-xs text-muted mb-md">压缩后 · {readableSize(outSize)} · {outInfo.w}×{outInfo.h} · {format.split('/')[1].toUpperCase()}</div>
                  <img src={outSrc} alt="压缩后" style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
                </div>
              </div>
            )}
            {!error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                <span class="status-msg status-success" style={{ margin: 0 }}>
                  节省 {ratio}% · {readableSize(origSize)} → {readableSize(outSize)}
                </span>
                <button class="btn btn-primary" onClick={download}>下载压缩图</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
