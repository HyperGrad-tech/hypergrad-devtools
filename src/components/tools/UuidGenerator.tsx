import { useState, useCallback, useEffect } from 'react';
import { v4, v7 } from 'uuid';

type Ver = 'v4' | 'v7';

export default function UuidGenerator() {
  const [version, setVersion] = useState<Ver>('v4');
  const [count, setCount] = useState(10);
  const [upper, setUpper] = useState(false);
  const [noHyphen, setNoHyphen] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const format = useCallback((raw: string): string => {
    let s = raw;
    if (upper) s = s.toUpperCase();
    if (noHyphen) s = s.replace(/-/g, '');
    return s;
  }, [upper, noHyphen]);

  const generate = useCallback(() => {
    const arr: string[] = [];
    const n = Math.max(1, Math.min(1000, count));
    for (let i = 0; i < n; i++) {
      const raw = version === 'v4' ? v4() : v7();
      arr.push(format(raw));
    }
    setList(arr);
  }, [version, count, format]);

  const copyAll = useCallback(() => {
    if (list.length) {
      navigator.clipboard.writeText(list.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [list]);

  // auto-generate on mount and when format options change applied to existing raw? Re-generate to keep consistent.
  const regenerate = useCallback(() => generate(), [generate]);

  // 挂载时自动生成一批，避免空状态
  useEffect(() => { generate(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <div class="tool-card">
        <div class="font-bold mb-md">生成参数</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label class="text-xs text-muted">版本</label>
            <select class="select w-full mt-md" value={version} onChange={e => setVersion(e.target.value as Ver)}>
              <option value="v4">UUID v4（随机）</option>
              <option value="v7">UUID v7（时间排序）</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-muted">数量（1-1000）</label>
            <input class="input w-full mt-md" type="number" min="1" max="1000" value={count} onChange={e => setCount(Number(e.target.value))} />
          </div>
          <label class="flex items-center gap-sm text-sm" style={{ height: '36px' }}><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> 大写</label>
          <label class="flex items-center gap-sm text-sm" style={{ height: '36px' }}><input type="checkbox" checked={noHyphen} onChange={e => setNoHyphen(e.target.checked)} /> 去横线</label>
          <button class="btn btn-primary" onClick={regenerate}>生成 {count} 个</button>
        </div>
      </div>

      {list.length > 0 && (
        <div class="tool-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} class="mb-md">
            <div class="font-bold">结果（{list.length} 个）</div>
            <button class="btn btn-secondary btn-sm" onClick={copyAll}>{copied ? '已复制全部' : '复制全部'}</button>
          </div>
          <textarea class="text-area dark" value={list.join('\n')} readOnly style={{ minHeight: '240px', lineHeight: '1.8' }} />
        </div>
      )}
    </div>
  );
}
