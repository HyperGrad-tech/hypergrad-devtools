import { useState, useMemo } from 'react';

type Base = 2 | 8 | 10 | 16;

const BASES: { value: Base; label: string; prefix: string }[] = [
  { value: 2, label: '二进制 (BIN)', prefix: '0b' },
  { value: 8, label: '八进制 (OCT)', prefix: '0o' },
  { value: 10, label: '十进制 (DEC)', prefix: '' },
  { value: 16, label: '十六进制 (HEX)', prefix: '0x' },
];

export default function RadixConverter() {
  const [dec, setDec] = useState('255');
  const [error, setError] = useState('');

  // 用 BigInt 支持大数
  const big = useMemo(() => {
    setError('');
    if (!dec.trim()) return null;
    try {
      if (!/^-?\d+$/.test(dec.trim())) throw new Error('请输入有效十进制整数');
      return BigInt(dec.trim());
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [dec]);

  function convert(base: Base): string {
    if (big === null) return '';
    const negative = big < 0n;
    let n = negative ? -big : big;
    if (n === 0n) return '0';
    const digits = '0123456789abcdef';
    let result = '';
    const b = BigInt(base);
    while (n > 0n) {
      result = digits[Number(n % b)] + result;
      n = n / b;
    }
    return (negative ? '-' : '') + result;
  }

  function parseFromBase(value: string, base: Base): void {
    setError('');
    const v = value.trim().toLowerCase().replace(/^0b|^0o|^0x/, '');
    if (!v) { setDec(''); return; }
    try {
      const validChars = base === 2 ? /^[01-]+$/ : base === 8 ? /^[0-7-]+$/ : base === 16 ? /^[0-9a-f-]+$/ : /^[\d-]+$/;
      if (!validChars.test(v)) throw new Error(`不是有效的 ${base} 进制数`);
      const negative = v.startsWith('-');
      const abs = negative ? v.slice(1) : v;
      const result = BigInt('0b' + '0'.repeat(0) + abs); // dummy
      // 用 parseInt 不支持大数，手动转换
      let n = 0n;
      const b = BigInt(base);
      for (const ch of abs) {
        const d = BigInt(parseInt(ch, base));
        n = n * b + d;
      }
      setDec((negative ? '-' : '') + n.toString());
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">十进制输入（主输入框）</div>
        <input
          class="input"
          type="text"
          value={dec}
          onChange={e => setDec(e.target.value)}
          placeholder="输入十进制整数，如 255"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', height: '44px' }}
        />
        <div class="text-xs text-muted mt-md">支持负数和大数（基于 BigInt，无精度限制）</div>
        {error && <div class="status-msg status-error mt-md">{error}</div>}
      </div>

      {/* 各进制结果，均可编辑反向转换 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {BASES.map(b => (
          <div class="tool-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span class="text-sm font-bold">{b.label}</span>
              {convert(b.value) && <button class="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(convert(b.value))}>复制</button>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {b.prefix && <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{b.prefix}</span>}
              <input
                class="input"
                type="text"
                value={convert(b.value)}
                onChange={e => parseFromBase(e.target.value, b.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '15px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 常用值速查 */}
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">常用值速查</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', fontSize: '12px' }}>
          {[
            { label: '字节上限', val: '255' },
            { label: '短整型上限', val: '65535' },
            { label: '32 位上限', val: '2147483647' },
            { label: '颜色白色', val: '16777215' },
            { label: 'K', val: '1024' },
            { label: 'M', val: '1048576' },
          ].map(item => (
            <button key={item.label} class="btn btn-ghost btn-sm" style={{ justifyContent: 'space-between' }} onClick={() => setDec(item.val)}>
              <span>{item.label}</span><span class="text-muted">{item.val}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
