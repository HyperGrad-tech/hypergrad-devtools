import { useState, useMemo, useCallback } from 'react';

type Model = 'hex' | 'rgb' | 'hsl';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// HEX -> RGB
const hexToRgb = (hex: string): [number, number, number] | null => {
  let h = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h = ((h % 360) + 360) % 360 / 360; s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255)];
};

export default function ColorConverter() {
  const [hex, setHex] = useState('#2D5F8A');
  const [r, setR] = useState(45);
  const [g, setG] = useState(95);
  const [b, setB] = useState(138);
  const [h, setH] = useState(207);
  const [s, setS] = useState(51);
  const [l, setL] = useState(36);
  const [activeModel, setActiveModel] = useState<Model>('hex');
  const [copied, setCopied] = useState('');

  // 当 hex 输入变化时同步（仅 hex 模式）
  const onHexInput = useCallback((val: string) => {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
      const hsl = rgbToHsl(...rgb);
      setH(hsl[0]); setS(hsl[1]); setL(hsl[2]);
    }
  }, []);

  const onRgbInput = (nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    setHex(rgbToHex(nr, ng, nb));
    const hsl = rgbToHsl(nr, ng, nb);
    setH(hsl[0]); setS(hsl[1]); setL(hsl[2]);
  };

  const onHslInput = (nh: number, ns: number, nl: number) => {
    setH(nh); setS(ns); setL(nl);
    const rgb = hslToRgb(nh, ns, nl);
    setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
    setHex(rgbToHex(...rgb));
  };

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(''), 1200);
  };

  const swatchStyle = { background: hex, width: '100%', height: '80px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', transition: 'background 0.15s' };

  const presets = ['#2D5F8A', '#1F4361', '#2D7A4F', '#C8862E', '#B83A3A', '#7A4FB8', '#FAFAF7', '#000000', '#FFFFFF'];

  const hslString = `hsl(${h}, ${s}%, ${l}%)`;
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  return (
    <div>
      <div class="tool-card">
        <div style={swatchStyle as any}></div>
      </div>

      <div class="tool-grid-2">
        <div class="tool-card">
          <div class="tabs" style={{ marginBottom: '16px' }}>
            <div class={`tab ${activeModel === 'hex' ? 'active' : ''}`} onClick={() => setActiveModel('hex')}>HEX</div>
            <div class={`tab ${activeModel === 'rgb' ? 'active' : ''}`} onClick={() => setActiveModel('rgb')}>RGB</div>
            <div class={`tab ${activeModel === 'hsl' ? 'active' : ''}`} onClick={() => setActiveModel('hsl')}>HSL</div>
          </div>

          {activeModel === 'hex' && (
            <div>
              <label class="text-xs text-muted">HEX</label>
              <input class="input w-full mt-md text-mono" value={hex} onChange={e => onHexInput(e.target.value)} style={{ fontSize: '15px' }} />
              <div class="text-xs text-muted mt-md">预设色板</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {presets.map(c => (
                  <div key={c} onClick={() => onHexInput(c)} title={c}
                    style={{ width: '32px', height: '32px', borderRadius: 'var(--radius)', background: c, border: '1px solid var(--border)', cursor: 'pointer' }}></div>
                ))}
              </div>
            </div>
          )}

          {activeModel === 'rgb' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 16px', alignItems: 'center' }}>
                <span class="text-sm font-bold" style={{ color: 'var(--red)' }}>R</span>
                <input type="range" min="0" max="255" value={r} onChange={e => onRgbInput(Number(e.target.value), g, b)} style={{ width: '100%' }} />
                <input class="input text-mono" type="number" min="0" max="255" value={r} onChange={e => onRgbInput(Number(e.target.value), g, b)} style={{ gridColumn: '2' }} />
                <span class="text-sm font-bold" style={{ color: 'var(--green)' }}>G</span>
                <input type="range" min="0" max="255" value={g} onChange={e => onRgbInput(r, Number(e.target.value), b)} style={{ width: '100%' }} />
                <input class="input text-mono" type="number" min="0" max="255" value={g} onChange={e => onRgbInput(r, Number(e.target.value), b)} style={{ gridColumn: '2' }} />
                <span class="text-sm font-bold" style={{ color: 'var(--blue)' }}>B</span>
                <input type="range" min="0" max="255" value={b} onChange={e => onRgbInput(r, g, Number(e.target.value))} style={{ width: '100%' }} />
                <input class="input text-mono" type="number" min="0" max="255" value={b} onChange={e => onRgbInput(r, g, Number(e.target.value))} style={{ gridColumn: '2' }} />
              </div>
            </div>
          )}

          {activeModel === 'hsl' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 16px', alignItems: 'center' }}>
                <span class="text-sm font-bold">H</span>
                <input type="range" min="0" max="360" value={h} onChange={e => onHslInput(Number(e.target.value), s, l)} style={{ width: '100%' }} />
                <input class="input text-mono" type="number" min="0" max="360" value={h} onChange={e => onHslInput(Number(e.target.value), s, l)} style={{ gridColumn: '2' }} />
                <span class="text-sm font-bold">S</span>
                <input type="range" min="0" max="100" value={s} onChange={e => onHslInput(h, Number(e.target.value), l)} style={{ width: '100%' }} />
                <input class="input text-mono" type="number" min="0" max="100" value={s} onChange={e => onHslInput(h, Number(e.target.value), l)} style={{ gridColumn: '2' }} />
                <span class="text-sm font-bold">L</span>
                <input type="range" min="0" max="100" value={l} onChange={e => onHslInput(h, s, Number(e.target.value))} style={{ width: '100%' }} />
                <input class="input text-mono" type="number" min="0" max="100" value={l} onChange={e => onHslInput(h, s, Number(e.target.value))} style={{ gridColumn: '2' }} />
              </div>
            </div>
          )}
        </div>

        <div class="tool-card">
          <div class="font-bold mb-md">输出值（点击复制）</div>
          {[
            { label: 'HEX', value: hex.toUpperCase() },
            { label: 'RGB', value: rgbString },
            { label: 'HSL', value: hslString },
          ].map(item => (
            <div key={item.label} onClick={() => copy(item.value)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
              <span class="text-xs text-muted" style={{ width: '36px' }}>{item.label}</span>
              <span class="text-mono" style={{ fontSize: '13px', flex: 1 }}>{item.value}</span>
              <span class="text-xs text-muted">{copied === item.value ? '已复制' : '复制'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
