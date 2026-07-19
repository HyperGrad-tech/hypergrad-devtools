import { useState, useMemo, useCallback } from 'react';
import { format, type SqlLanguage } from 'sql-formatter';

const LANGS: { value: SqlLanguage; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'tsql', label: 'SQL Server (T-SQL)' },
  { value: 'plsql', label: 'Oracle PL/SQL' },
  { value: 'bigquery', label: 'Google BigQuery' },
  { value: 'redshift', label: 'Amazon Redshift' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'spark', label: 'Apache Spark' },
  { value: 'hive', label: 'Hive' },
  { value: 'clickhouse', label: 'ClickHouse' },
  { value: 'trino', label: 'Trino / Presto' },
];

const SAMPLE = `select u.id, u.name, count(o.id) as order_count, sum(o.amount) as total from users u left join orders o on o.user_id=u.id where u.status='active' and o.created_at>='2024-01-01' group by u.id, u.name having count(o.id)>0 order by total desc limit 20;`;

export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [language, setLanguage] = useState<SqlLanguage>('mysql');
  const [tabWidth, setTabWidth] = useState(2);
  const [keywordCase, setKeywordCase] = useState<'preserve' | 'upper' | 'lower'>('upper');
  const [linesBetween, setLinesBetween] = useState(1);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      const result = format(input, {
        language,
        tabWidth,
        keywordCase,
        linesBetweenQueries: linesBetween,
        denseOperators: false,
        newlineBeforeSemicolon: false,
      });
      return { output: result, error: '' };
    } catch (e: any) {
      return { output: '', error: '格式化失败：' + e.message };
    }
  }, [input, language, tabWidth, keywordCase, linesBetween]);

  const copy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  const minify = (s: string) => s.replace(/\s+/g, ' ').trim();

  return (
    <div>
      <div class="toolbar" style={{ alignItems: 'flex-end' }}>
        <div>
          <label class="text-xs text-muted">方言</label>
          <select class="select mt-md" value={language} onChange={e => setLanguage(e.target.value as SqlLanguage)}>
            {LANGS.map(l => <option value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label class="text-xs text-muted">缩进</label>
          <select class="select mt-md" value={tabWidth} onChange={e => setTabWidth(Number(e.target.value))}>
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
            <option value={8}>8 空格</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-muted">关键字大小写</label>
          <select class="select mt-md" value={keywordCase} onChange={e => setKeywordCase(e.target.value as any)}>
            <option value="upper">大写</option>
            <option value="lower">小写</option>
            <option value="preserve">保留原样</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-muted">语句间距</label>
          <select class="select mt-md" value={linesBetween} onChange={e => setLinesBetween(Number(e.target.value))}>
            <option value={0}>无空行</option>
            <option value={1}>1 空行</option>
            <option value={2}>2 空行</option>
          </select>
        </div>
        <button class="btn btn-ghost btn-sm" onClick={() => setInput(SAMPLE)}>示例</button>
        <button class="btn btn-ghost btn-sm" onClick={() => setInput('')}>清空</button>
      </div>

      {error && <div class="status-msg status-error">{error}</div>}

      <div class="tool-grid-2">
        <div class="tool-card">
          <div class="font-bold mb-md">输入 SQL</div>
          <textarea class="text-area" value={input} onChange={e => setInput(e.target.value)} placeholder="粘贴待格式化的 SQL 语句" style={{ minHeight: '320px' }} />
          <div class="text-xs text-muted mt-md">{input.length} 字符</div>
        </div>
        <div class="tool-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} class="mb-md">
            <div class="font-bold">格式化结果</div>
            <div class="btn-group">
              <button class="btn btn-secondary btn-sm" onClick={copy} disabled={!output}>{copied ? '已复制' : '复制'}</button>
              <button class="btn btn-secondary btn-sm" onClick={() => { if (output) setInput(minify(output)); }} disabled={!output}>压缩为单行</button>
            </div>
          </div>
          <textarea class="text-area dark" value={output} readOnly placeholder="格式化后结果" style={{ minHeight: '320px' }} />
        </div>
      </div>
    </div>
  );
}
