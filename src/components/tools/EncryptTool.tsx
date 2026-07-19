import { useState, useCallback } from 'react';
import CryptoJS from 'crypto-js';

type Algo = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'base64' | 'aes' | 'des' | 'url';
type Mode = 'encode' | 'decode';

const ALGOS: { value: Algo; label: string; type: 'hash' | 'symmetric' | 'base64' | 'url'; needKey: boolean }[] = [
  { value: 'md5', label: 'MD5', type: 'hash', needKey: false },
  { value: 'sha1', label: 'SHA-1', type: 'hash', needKey: false },
  { value: 'sha256', label: 'SHA-256', type: 'hash', needKey: false },
  { value: 'sha512', label: 'SHA-512', type: 'hash', needKey: false },
  { value: 'base64', label: 'Base64', type: 'base64', needKey: false },
  { value: 'aes', label: 'AES', type: 'symmetric', needKey: true },
  { value: 'des', label: 'DES', type: 'symmetric', needKey: true },
  { value: 'url', label: 'URL 编码', type: 'url', needKey: false },
];

function utf8ToBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return '编码失败（含无效字符）';
  }
}
function base64ToUtf8(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str.trim())));
  } catch {
    return '解码失败（非有效 Base64）';
  }
}

export default function EncryptTool() {
  const [algo, setAlgo] = useState<Algo>('md5');
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('Hello HyperGrad');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const current = ALGOS.find(a => a.value === algo)!;
  const showMode = current.type === 'symmetric' || current.type === 'base64' || current.type === 'url';
  const isHash = current.type === 'hash';

  const handleProcess = useCallback(() => {
    setError('');
    setOutput('');
    setCopied(false);
    if (!input) { setError('请输入内容'); return; }
    try {
      let result = '';
      if (isHash) {
        const m = mode;
        // Hash 只能编码
        if (algo === 'md5') result = CryptoJS.MD5(input).toString();
        else if (algo === 'sha1') result = CryptoJS.SHA1(input).toString();
        else if (algo === 'sha256') result = CryptoJS.SHA256(input).toString();
        else if (algo === 'sha512') result = CryptoJS.SHA512(input).toString();
      } else if (algo === 'base64') {
        result = mode === 'encode' ? utf8ToBase64(input) : base64ToUtf8(input);
      } else if (algo === 'url') {
        result = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
      } else if (algo === 'aes' || algo === 'des') {
        if (!key) { setError('请输入密钥'); return; }
        if (mode === 'encode') {
          const k = CryptoJS.enc.Utf8.parse(key);
          if (algo === 'aes') {
            result = CryptoJS.AES.encrypt(input, k, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
          } else {
            result = CryptoJS.DES.encrypt(input, k, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
          }
        } else {
          const k = CryptoJS.enc.Utf8.parse(key);
          if (algo === 'aes') {
            const decrypted = CryptoJS.AES.decrypt(input.trim(), k, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            result = decrypted.toString(CryptoJS.enc.Utf8);
          } else {
            const decrypted = CryptoJS.DES.decrypt(input.trim(), k, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
            result = decrypted.toString(CryptoJS.enc.Utf8);
          }
          if (!result) { setError('解密失败：密钥错误或数据无效'); return; }
        }
      }
      setOutput(result);
    } catch (e: any) {
      setError('处理失败：' + (e.message || String(e)));
    }
  }, [algo, mode, input, key, isHash]);

  const handleCopy = () => {
    if (output) { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  return (
    <div>
      <div class="toolbar">
        <span class="toolbar-label">算法</span>
        <select class="select" value={algo} onChange={e => { setAlgo(e.target.value as Algo); setOutput(''); }}>
          {ALGOS.map(a => <option value={a.value}>{a.label} — {a.type === 'hash' ? '哈希（不可逆）' : a.type === 'symmetric' ? '对称加密' : a.type === 'base64' ? '编码' : '编码'}</option>)}
        </select>
        {showMode && !isHash && (
          <>
            <span class="toolbar-label" style={{ marginLeft: '12px' }}>模式</span>
            <div class="tabs" style={{ borderBottom: 'none', marginBottom: 0 }}>
              <div class={`tab ${mode === 'encode' ? 'active' : ''}`} onClick={() => setMode('encode')}>编码 / 加密</div>
              <div class={`tab ${mode === 'decode' ? 'active' : ''}`} onClick={() => setMode('decode')}>解码 / 解密</div>
            </div>
          </>
        )}
        {isHash && <span class="tag" style={{ marginLeft: '12px' }}>单向哈希 · 不可逆</span>}
      </div>

      {current.needKey && (
        <div style={{ marginBottom: '16px' }}>
          <label class="text-sm font-bold" style={{ display: 'block', marginBottom: '6px' }}>密钥（{current.label}）</label>
          <input class="input" type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="请输入加密/解密密钥" />
          <div class="text-xs text-muted mt-md">ECB 模式 · PKCS7 填充 · 密钥请妥善保管</div>
        </div>
      )}

      <div class="tool-grid-2">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span class="text-sm font-bold">{isHash ? '待哈希内容' : mode === 'encode' ? '待加密/编码' : '待解密/解码'}</span>
            {input && <button class="btn btn-ghost btn-sm" onClick={() => { setInput(''); setOutput(''); }}>清空</button>}
          </div>
          <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="在此输入..." spellCheck={false} />
          <button class="btn btn-primary" style={{ marginTop: '12px' }} onClick={handleProcess}>
            {isHash ? '生成哈希' : mode === 'encode' ? '加密 / 编码 →' : '解密 / 解码 →'}
          </button>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span class="text-sm font-bold">结果</span>
            {output && <button class="btn btn-ghost btn-sm" onClick={handleCopy}>{copied ? '✓ 已复制' : '复制'}</button>}
          </div>
          {error ? (
            <div class="status-msg status-error" style={{ minHeight: '240px' }}>{error}</div>
          ) : (
            <textarea class="text-area dark" value={output} readOnly placeholder="结果将显示在这里..." spellCheck={false} />
          )}
        </div>
      </div>
    </div>
  );
}
