import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PdfItem {
  name: string;
  bytes: ArrayBuffer;
  pages: number;
}

export default function PdfMerge() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [outUrl, setOutUrl] = useState('');
  const [outSize, setOutSize] = useState(0);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const readableSize = (b: number) => {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  };

  const addFiles = useCallback(async (files: FileList) => {
    setError('');
    const newItems: PdfItem[] = [];
    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') continue;
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        newItems.push({ name: file.name, bytes, pages: doc.getPageCount() });
      } catch (e: any) {
        setError(`加载 ${file.name} 失败：${e.message}`);
      }
    }
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const move = (idx: number, dir: -1 | 1) => {
    setItems(prev => {
      const arr = [...prev];
      const t = idx + dir;
      if (t < 0 || t >= arr.length) return arr;
      [arr[idx], arr[t]] = [arr[t], arr[idx]];
      return arr;
    });
  };

  const remove = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
    if (outUrl) { URL.revokeObjectURL(outUrl); setOutUrl(''); }
  };

  const merge = async () => {
    if (items.length < 2) { setError('至少需要 2 个 PDF 文件'); return; }
    setMerging(true);
    setError('');
    try {
      const merged = await PDFDocument.create();
      for (const it of items) {
        const src = await PDFDocument.load(it.bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const out = await merged.save();
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      if (outUrl) URL.revokeObjectURL(outUrl);
      const url = URL.createObjectURL(blob);
      setOutUrl(url);
      setOutSize(blob.size);
    } catch (e: any) {
      setError('合并失败：' + e.message);
    } finally {
      setMerging(false);
    }
  };

  const totalPages = items.reduce((s, i) => s + i.pages, 0);

  return (
    <div>
      <div class="tool-card">
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple style={{ display: 'none' }} onChange={e => e.target.files && addFiles(e.target.files)} />
        <div onClick={() => inputRef.current?.click()} onDrop={e => { e.preventDefault(); e.dataTransfer.files && addFiles(e.dataTransfer.files); }} onDragOver={e => e.preventDefault()}
          style={{ border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '48px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📄</div>
          <div class="font-bold" style={{ color: 'var(--text)', marginBottom: '6px' }}>点击或拖拽添加 PDF 文件</div>
          <div class="text-sm">支持多个文件，可调整合并顺序</div>
        </div>
      </div>

      {items.length > 0 && (
        <div class="tool-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div class="font-bold">文件列表（{items.length} 个 · 共 {totalPages} 页）</div>
            <button class="btn btn-ghost btn-sm" onClick={() => { setItems([]); if (outUrl) URL.revokeObjectURL(outUrl); setOutUrl(''); }}>清空</button>
          </div>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span class="text-muted text-sm" style={{ width: '24px', fontFamily: 'var(--font-mono)' }}>{idx + 1}</span>
              <span style={{ flex: 1, fontSize: '13px' }}>{it.name}</span>
              <span class="text-xs text-muted">{it.pages} 页</span>
              <button class="btn btn-ghost btn-sm" onClick={() => move(idx, -1)} disabled={idx === 0} title="上移">↑</button>
              <button class="btn btn-ghost btn-sm" onClick={() => move(idx, 1)} disabled={idx === items.length - 1} title="下移">↓</button>
              <button class="btn btn-danger btn-sm" onClick={() => remove(idx)}>删除</button>
            </div>
          ))}
          <button class="btn btn-primary mt-lg" onClick={merge} disabled={merging || items.length < 2}>
            {merging ? '合并中…' : `合并 ${items.length} 个 PDF`}
          </button>
        </div>
      )}

      {error && <div class="status-msg status-error">{error}</div>}

      {outUrl && (
        <div class="tool-card">
          <div class="font-bold mb-md">合并完成</div>
          <div class="status-msg status-success" style={{ marginBottom: '16px' }}>合并成功 · 输出体积 {readableSize(outSize)}</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a class="btn btn-primary" href={outUrl} download="merged.pdf">下载合并后的 PDF</a>
            <a class="btn btn-secondary" href={outUrl} target="_blank" rel="noopener">在新标签页预览</a>
          </div>
        </div>
      )}
    </div>
  );
}
