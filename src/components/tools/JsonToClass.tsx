import { useState, useMemo, useCallback } from 'react';

type Lang = 'java' | 'csharp' | 'go' | 'python' | 'typescript';

const SAMPLE = `{
  "id": 1001,
  "name": "HyperGrad",
  "price": 99.5,
  "active": true,
  "tags": ["工具", "开发"],
  "address": {
    "city": "成都",
    "zip": "610000"
  },
  "items": [
    { "sku": "A1", "qty": 2 }
  ]
}`;

const pascal = (s: string): string => {
  if (!s) return 'Item';
  // keep ascii word chars, split on non-word
  const parts = s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  const out = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return /^[0-9]/.test(out) ? 'Item' + out : (out || 'Item');
};

const singular = (s: string): string => {
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('ses')) return s.slice(0, -2);
  if (s.endsWith('s') && !s.endsWith('ss')) return s.slice(0, -1);
  return s;
};

interface ClassDef {
  name: string;
  fields: { key: string; type: string; raw: any }[];
}

function typeFor(raw: any, key: string, lang: Lang, seen: Map<any, string>): string {
  if (raw === null || raw === undefined) {
    return lang === 'java' ? 'Object' : lang === 'csharp' ? 'object' : lang === 'go' ? 'interface{}' : lang === 'python' ? 'Any' : 'null';
  }
  if (typeof raw === 'string') return lang === 'java' ? 'String' : lang === 'csharp' ? 'string' : lang === 'go' ? 'string' : lang === 'python' ? 'str' : 'string';
  if (typeof raw === 'boolean') return (lang === 'java' || lang === 'typescript') ? 'boolean' : 'bool';
  if (typeof raw === 'number') {
    const isInt = Number.isInteger(raw);
    if (lang === 'java') return isInt ? (Math.abs(raw) > 2147483647 ? 'Long' : 'Integer') : 'Double';
    if (lang === 'csharp') return isInt ? (Math.abs(raw) > 2147483647 ? 'long' : 'int') : 'double';
    if (lang === 'go') return isInt ? 'int64' : 'float64';
    if (lang === 'python') return isInt ? 'int' : 'float';
    return 'number';
  }
  if (Array.isArray(raw)) {
    const inner = raw[0];
    let elem: string;
    if (inner !== null && typeof inner === 'object' && !Array.isArray(inner)) {
      elem = seen.get(inner) || pascal(singular(key));
    } else {
      elem = typeFor(inner, singular(key), lang, seen);
    }
    if (lang === 'java') return `List<${elem}>`;
    if (lang === 'csharp') return `List<${elem}>`;
    if (lang === 'go') return `[]${elem}`;
    if (lang === 'python') return `List[${elem}]`;
    return `${elem}[]`;
  }
  if (typeof raw === 'object') {
    return seen.get(raw) || pascal(key);
  }
  return 'any';
}

function emit(classes: ClassDef[], lang: Lang, seen: Map<any, string>): string {
  let out = '';
  if (lang === 'java') {
    out += 'import java.util.List;\n\n';
    for (const c of classes) {
      out += `public class ${c.name} {\n`;
      for (const f of c.fields) {
        const t = typeFor(f.raw, f.key, lang, seen);
        const field = f.key.charAt(0).toLowerCase() + f.key.slice(1);
        out += `    private ${t} ${field};\n`;
      }
      out += '\n';
      for (const f of c.fields) {
        const t = typeFor(f.raw, f.key, lang, seen);
        const field = f.key.charAt(0).toLowerCase() + f.key.slice(1);
        const cap = f.key.charAt(0).toUpperCase() + f.key.slice(1);
        out += `    public ${t} get${cap}() { return ${field}; }\n`;
        out += `    public void set${cap}(${t} ${field}) { this.${field} = ${field}; }\n`;
      }
      out += '}\n\n';
    }
  } else if (lang === 'csharp') {
    out += 'using System.Collections.Generic;\n\n';
    for (const c of classes) {
      out += `public class ${c.name}\n{\n`;
      for (const f of c.fields) {
        const t = typeFor(f.raw, f.key, lang, seen);
        const cap = pascal(f.key) || f.key;
        out += `    public ${t} ${cap} { get; set; }\n`;
      }
      out += '}\n\n';
    }
  } else if (lang === 'go') {
    out += 'package model\n\n';
    for (const c of classes) {
      out += `type ${c.name} struct {\n`;
      for (const f of c.fields) {
        const t = typeFor(f.raw, f.key, lang, seen);
        const name = pascal(f.key);
        out += `\t${name} ${t} \`json:"${f.key}"\`\n`;
      }
      out += '}\n\n';
    }
  } else if (lang === 'python') {
    out += 'from dataclasses import dataclass\nfrom typing import List, Any\n\n';
    for (const c of classes) {
      out += `@dataclass\nclass ${c.name}:\n`;
      for (const f of c.fields) {
        const t = typeFor(f.raw, f.key, lang, seen);
        out += `    ${f.key}: ${t} = None\n`;
      }
      out += '\n';
    }
  } else { // typescript
    for (const c of classes) {
      out += `interface ${c.name} {\n`;
      for (const f of c.fields) {
        const t = typeFor(f.raw, f.key, lang, seen);
        out += `  ${f.key}: ${t};\n`;
      }
      out += '}\n\n';
    }
  }
  return out.trim();
}

export default function JsonToClass() {
  const [input, setInput] = useState(SAMPLE);
  const [lang, setLang] = useState<Lang>('java');
  const [rootName, setRootName] = useState('Root');
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    let parsed: any;
    try {
      parsed = JSON.parse(input);
    } catch (e: any) {
      return { output: '', error: 'JSON 解析失败：' + e.message };
    }
    if (typeof parsed !== 'object' || parsed === null) {
      return { output: '', error: '根节点必须是对象或数组' };
    }
    try {
      const usedNames = new Set<string>();
      const makeNameFn = (base: string): string => {
        let n = pascal(base);
        let i = 2;
        while (usedNames.has(n)) { n = pascal(base) + i; i++; }
        usedNames.add(n);
        return n;
      };
      const seen = new Map<any, string>();
      const rootObj = Array.isArray(parsed) ? (parsed[0] || {}) : parsed;
      const rootCls = makeNameFn(rootName || 'Root');
      seen.set(rootObj, rootCls);
      if (Array.isArray(parsed) && parsed[0]) seen.set(parsed[0], rootCls);

      // First pass: assign names to all nested objects so forward references work
      const assignNames = (o: any, name: string) => {
        const target = Array.isArray(o) ? o[0] : o;
        if (!target || typeof target !== 'object') return;
        seen.set(target, name);
        const entries = Object.entries(target);
        for (const [k, v] of entries) {
          if (Array.isArray(v)) {
            const inner = v[0];
            if (inner && typeof inner === 'object' && !seen.has(inner)) {
              assignNames(inner, makeNameFn(singular(k)));
            }
          } else if (v && typeof v === 'object' && !seen.has(v)) {
            assignNames(v, makeNameFn(k));
          }
        }
      };
      const rootTarget = Array.isArray(parsed) ? parsed[0] : parsed;
      seen.clear();
      assignNames(parsed, rootCls);

      // collect classes in order
      const classes: ClassDef[] = [];
      const orderSeen = new Set<any>();
      const collect = (o: any) => {
        const target = Array.isArray(o) ? o[0] : o;
        if (!target || typeof target !== 'object' || orderSeen.has(target)) return;
        orderSeen.add(target);
        const name = seen.get(target) || 'X';
        const fields = Object.entries(target).map(([k, v]) => ({ key: k, type: '', raw: v }));
        classes.push({ name, fields });
        for (const [, v] of Object.entries(target)) {
          if (Array.isArray(v)) {
            const inner = v[0];
            if (inner && typeof inner === 'object') collect(inner);
          } else if (v && typeof v === 'object') {
            collect(v);
          }
        }
      };
      collect(parsed);

      return { output: emit(classes, lang, seen), error: '' };
    } catch (e: any) {
      return { output: '', error: '生成失败：' + e.message };
    }
  }, [input, lang, rootName]);

  const copy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  const labels: Record<Lang, string> = { java: 'Java', csharp: 'C#', go: 'Go', python: 'Python', typescript: 'TypeScript' };

  return (
    <div>
      <div class="toolbar" style={{ alignItems: 'flex-end' }}>
        <div>
          <label class="text-xs text-muted">目标语言</label>
          <select class="select mt-md" value={lang} onChange={e => setLang(e.target.value as Lang)}>
            {(Object.keys(labels) as Lang[]).map(l => <option value={l}>{labels[l]}</option>)}
          </select>
        </div>
        <div>
          <label class="text-xs text-muted">根类名</label>
          <input class="input mt-md" value={rootName} onChange={e => setRootName(e.target.value)} style={{ width: '160px' }} />
        </div>
        <button class="btn btn-ghost btn-sm" onClick={() => setInput(SAMPLE)}>示例</button>
        <button class="btn btn-ghost btn-sm" onClick={() => setInput('')}>清空</button>
      </div>

      {error && <div class="status-msg status-error">{error}</div>}

      <div class="tool-grid-2">
        <div class="tool-card">
          <div class="font-bold mb-md">输入 JSON</div>
          <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder='粘贴 JSON 对象或数组' style={{ minHeight: '420px' }} />
        </div>
        <div class="tool-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} class="mb-md">
            <div class="font-bold">{labels[lang]} 代码</div>
            <button class="btn btn-secondary btn-sm" onClick={copy} disabled={!output}>{copied ? '已复制' : '复制'}</button>
          </div>
          <textarea class="text-area dark" value={output} readOnly style={{ minHeight: '420px' }} />
        </div>
      </div>
    </div>
  );
}
