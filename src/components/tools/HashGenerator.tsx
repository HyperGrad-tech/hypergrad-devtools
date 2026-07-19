import { useState, useMemo, useCallback } from 'react';
import CryptoJS from 'crypto-js';

export default function HashGenerator() {
  const [input, setInput] = useState('Hello HyperGrad');
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState('');

  const hashes = useMemo(() => {
    if (!input) return { md5: '', sha1: '', sha256: '', sha512: '', md5Hmac: '', sha256Hmac: '' };
    return {
      md5: CryptoJS.MD5(input).toString(),
      sha1: CryptoJS.SHA1(input).toString(),
      sha256: CryptoJS.SHA256(input).toString(),
      sha512: CryptoJS.SHA512(input).toString(),
      md5Hmac: key ? CryptoJS.HmacMD5(input, key).toString() : '',
      sha256Hmac: key ? CryptoJS.HmacSHA256(input, key).toString() : '',
    };
  }, [input, key]);

  const copy = useCallback((name: string, val: string) => {
    if (val) { navigator.clipboard.writeText(val); setCopied(name); setTimeout(() => setCopied(''), 1500); }
  }, []);

  const items = [
    { name: 'MD5', val: hashes.md5, len: 32 },
    { name: 'SHA-1', val: hashes.sha1, len: 40 },
    { name: 'SHA-256', val: hashes.sha256, len: 64, recommended: true },
    { name: 'SHA-512', val: hashes.sha512, len: 128 },
    ...(key ? [
      { name: 'HMAC-MD5', val: hashes.md5Hmac, len: 32 },
      { name: 'HMAC-SHA256', val: hashes.sha256Hmac, len: 64 },
    ] : []),
  ];

  return (
    <div>
      <div class="tool-card">
        <div class="text-sm font-bold mb-md">输入内容</div>
        <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="输入要计算哈希的文本" style={{ minHeight: '100px' }} />
        <div style={{ marginTop: '12px' }}>
          <label class="text-xs text-muted">HMAC 密钥（可选，用于带密钥哈希）</label>
          <input class="input mt-md" type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="留空则只生成普通哈希" />
        </div>
      </div>

      <div>
        {items.map(item => (
          <div class="tool-card" key={item.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span class="text-sm font-bold">{item.name}</span>
                {item.recommended && <span class="tag tag-p2 ml-md" style={{ marginLeft: '6px' }}>推荐</span>}
                <span class="text-xs text-muted" style={{ marginLeft: '8px' }}>{item.len} 位</span>
              </div>
              {item.val && <button class="btn btn-ghost btn-sm" onClick={() => copy(item.name, item.val)}>{copied === item.name ? '✓' : '复制'}</button>}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', wordBreak: 'break-all', color: 'var(--blue-dark)', background: 'var(--bg-soft)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
              {item.val || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
