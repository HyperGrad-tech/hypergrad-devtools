import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

export default function QrCodeTool() {
  const [input, setInput] = useState('https://hypergrad.cn');
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dark, setDark] = useState('#000000');
  const [light, setLight] = useState('#FFFFFF');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const [decoded, setDecoded] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input) { setDataUrl(''); return; }
    QRCode.toDataURL(input, {
      width: size,
      margin,
      errorCorrectionLevel: level,
      color: { dark, light },
    }).then(setDataUrl).catch(e => setError('生成失败：' + e.message));
  }, [input, size, margin, level, dark, light]);

  const download = () => {
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'qrcode.png';
      a.click();
    }
  };

  const handleDecode = useCallback(async (file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) { setDecoded(code.data); setError(''); }
      else { setError('未识别到二维码，请确认图片清晰'); }
    };
    img.src = URL.createObjectURL(file);
  }, []);

  return (
    <div>
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">二维码内容</div>
        <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="输入文本或 URL" style={{ minHeight: '80px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '12px' }}>
          <div>
            <label class="text-xs text-muted">尺寸</label>
            <select class="select w-full mt-md" value={size} onChange={e => setSize(Number(e.target.value))}>
              <option value={128}>128 px</option>
              <option value={256}>256 px</option>
              <option value={512}>512 px</option>
              <option value={1024}>1024 px</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-muted">容错等级</label>
            <select class="select w-full mt-md" value={level} onChange={e => setLevel(e.target.value as any)}>
              <option value="L">L (7%)</option>
              <option value="M">M (15%)</option>
              <option value="Q">Q (25%)</option>
              <option value="H">H (30%)</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-muted">前景色</label>
            <input type="color" value={dark} onChange={e => setDark(e.target.value)} style={{ width: '100%', height: '36px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: '8px', cursor: 'pointer' }} />
          </div>
          <div>
            <label class="text-xs text-muted">背景色</label>
            <input type="color" value={light} onChange={e => setLight(e.target.value)} style={{ width: '100%', height: '36px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: '8px', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      <div class="tool-grid-2">
        <div class="tool-card" style={{ textAlign: 'center' }}>
          <div class="text-sm font-bold mb-md">生成结果</div>
          {dataUrl ? (
            <img src={dataUrl} alt="QR Code" style={{ maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
          ) : (
            <div class="text-muted" style={{ padding: '60px 0' }}>输入内容后生成</div>
          )}
          {dataUrl && <button class="btn btn-primary mt-md" onClick={download}>下载 PNG</button>}
        </div>

        <div class="tool-card">
          <div class="text-sm font-bold mb-md">解析二维码</div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleDecode(e.target.files[0])} />
          <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '40px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼</div>
            <div>点击选择二维码图片</div>
          </div>
          {error && <div class="status-msg status-error mt-md">{error}</div>}
          {decoded && (
            <div class="mt-md">
              <div class="text-xs text-muted mb-md">解析结果：</div>
              <textarea class="text-area dark" value={decoded} readOnly style={{ minHeight: '80px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
