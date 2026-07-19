export type Priority = 'P0' | 'P1' | 'P2';
export type Category = '开发编码' | '加解密' | '文档处理' | '前端设计' | '网络调试';

export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  desc: string;
  priority: Priority;
  category: Category;
  keywords: string[];
  icon: string;
  /** 搜索热度（百度日搜索量估算） */
  volume: number;
  /** SEO 长尾说明 */
  seoNote: string;
}

/**
 * 20 个工具元数据，按优先级排序。
 * P0 核心（6）→ P1 常用（7）→ P2 扩展（7）
 */
export const tools: Tool[] = [
  // ============ P0 核心 ============
  {
    slug: 'json-formatter',
    name: 'JSON 格式化',
    shortName: 'JSON',
    desc: 'JSON 在线格式化、校验、压缩、转树形查看，支持语法高亮和错误定位。',
    priority: 'P0',
    category: '开发编码',
    keywords: ['json格式化', 'json在线解析', 'json校验', 'json压缩', 'json美化', 'json树形'],
    icon: '{ }',
    volume: 792,
    seoNote: '开发者最高频需求，bejson 和 tool.lu 均为 Top 关键词',
  },
  {
    slug: 'encrypt',
    name: '加密 / 解密',
    shortName: '加解密',
    desc: 'MD5、SHA、Base64、AES、DES 等常见加密解密算法，全部本地计算。',
    priority: 'P0',
    category: '加解密',
    keywords: ['加密解密', 'md5加密', 'base64编码', 'aes加密', 'des加密', 'sha256', '在线解密'],
    icon: '🔒',
    volume: 728,
    seoNote: 'tool.lu 合计 ~728/日，与 DeepSeal 隐私品牌天然契合',
  },
  {
    slug: 'regex-tester',
    name: '正则表达式测试',
    shortName: '正则',
    desc: '正则在线测试、实时匹配高亮、常用正则库、语法速查。',
    priority: 'P0',
    category: '开发编码',
    keywords: ['正则表达式', '正则在线测试', '正则语法', '正则匹配', '正则可视化'],
    icon: '.*',
    volume: 487,
    seoNote: 'bejson 487、tool.lu 398，开发者刚需',
  },
  {
    slug: 'timestamp',
    name: '时间戳转换',
    shortName: '时间戳',
    desc: 'Unix 时间戳与日期互转，支持秒/毫秒、多时区、本地时间。',
    priority: 'P0',
    category: '开发编码',
    keywords: ['时间戳转换', 'unix时间戳', '毫秒时间戳', '时间戳转日期', '在线时间戳'],
    icon: '⏱',
    volume: 300,
    seoNote: '接口调试高频需求',
  },
  {
    slug: 'radix',
    name: '进制转换',
    shortName: '进制',
    desc: '二进制、八进制、十进制、十六进制互转，支持大数。',
    priority: 'P0',
    category: '开发编码',
    keywords: ['进制转换', '二进制转十进制', '十六进制转换', '八进制', '进制计算器'],
    icon: '0x',
    volume: 453,
    seoNote: 'tool.lu 第 7 大词，底层开发需求',
  },
  {
    slug: 'url-encode',
    name: 'URL 编码 / 解码',
    shortName: 'URL',
    desc: 'URL 编码（百分号编码）、解码，支持 UTF-8、URI 组件。',
    priority: 'P0',
    category: '网络调试',
    keywords: ['url编码', 'url解码', 'url encode', 'url转义', '百分号编码'],
    icon: '%20',
    volume: 250,
    seoNote: '前端/接口调试常用',
  },
  // ============ P1 常用 ============
  {
    slug: 'base64',
    name: 'Base64 编解码',
    shortName: 'Base64',
    desc: 'Base64 编码解码，支持文本与图片互转（Data URL）。',
    priority: 'P1',
    category: '加解密',
    keywords: ['base64', 'base64编码', 'base64解码', '图片转base64', 'base64转图片'],
    icon: 'B64',
    volume: 300,
    seoNote: '数据传输/图片内嵌场景',
  },
  {
    slug: 'hash',
    name: 'Hash 生成器',
    shortName: 'Hash',
    desc: '生成 MD5、SHA-1、SHA-256、SHA-512 哈希，支持大小写与 HMAC。',
    priority: 'P1',
    category: '加解密',
    keywords: ['hash生成', 'md5', 'sha1', 'sha256', 'sha512', '哈希计算'],
    icon: '#',
    volume: 229,
    seoNote: 'tool.lu「加密」229/日',
  },
  {
    slug: 'qrcode',
    name: '二维码生成 / 解析',
    shortName: '二维码',
    desc: '生成二维码图片、解析二维码内容，支持自定义尺寸与容错等级。',
    priority: 'P1',
    category: '前端设计',
    keywords: ['二维码', '二维码生成', '二维码解析', 'qrcode'],
    icon: '▦',
    volume: 1664,
    seoNote: 'tool.lu 第一大词，泛用户需求',
  },
  {
    slug: 'image-compress',
    name: '图片压缩',
    shortName: '图片压缩',
    desc: '在线压缩 PNG/JPEG/WebP 图片，本地 Canvas 处理，不上传。',
    priority: 'P1',
    category: '文档处理',
    keywords: ['图片压缩', '照片压缩', '在线压缩图片', 'png压缩', 'jpg压缩'],
    icon: '🖼',
    volume: 891,
    seoNote: 'tool.lu 压缩 640 + 照片压缩 251',
  },
  {
    slug: 'pdf-merge',
    name: 'PDF 合并',
    shortName: 'PDF',
    desc: '在线合并多个 PDF 文件为一个，本地处理，不上传服务器。',
    priority: 'P1',
    category: '文档处理',
    keywords: ['pdf合并', 'pdf合并在线', 'pdf合并工具', '在线合并pdf'],
    icon: '📄',
    volume: 490,
    seoNote: '办公场景高频需求',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL 格式化',
    shortName: 'SQL',
    desc: 'SQL 语句格式化美化，支持 MySQL/PostgreSQL/SQL Server 等方言。',
    priority: 'P1',
    category: '开发编码',
    keywords: ['sql格式化', 'sql美化', 'sql压缩', 'sql在线工具'],
    icon: 'SQL',
    volume: 250,
    seoNote: 'SQL 美化需求',
  },
  {
    slug: 'json-to-class',
    name: 'JSON 转实体类',
    shortName: 'JSON转类',
    desc: '将 JSON 转为 Java、C#、Go、Python、TypeScript 等语言实体类。',
    priority: 'P1',
    category: '开发编码',
    keywords: ['json转实体类', 'json转java', 'json转c#', 'json转go', 'json转python'],
    icon: 'Class',
    volume: 180,
    seoNote: 'bejson 核心功能之一',
  },
  // ============ P2 扩展 ============
  {
    slug: 'js-formatter',
    name: 'JS 格式化 / 压缩',
    shortName: 'JS',
    desc: 'JavaScript 代码格式化美化与压缩，基于 Prettier。',
    priority: 'P2',
    category: '开发编码',
    keywords: ['js格式化', 'js美化', 'js压缩', 'javascript格式化'],
    icon: 'JS',
    volume: 200,
    seoNote: '前端优化',
  },
  {
    slug: 'css-formatter',
    name: 'CSS 格式化 / 压缩',
    shortName: 'CSS',
    desc: 'CSS 代码格式化美化与压缩，基于 Prettier。',
    priority: 'P2',
    category: '前端设计',
    keywords: ['css格式化', 'css美化', 'css压缩', 'css在线工具'],
    icon: 'CSS',
    volume: 180,
    seoNote: '前端优化',
  },
  {
    slug: 'html-formatter',
    name: 'HTML 格式化',
    shortName: 'HTML',
    desc: 'HTML 代码格式化美化，基于 Prettier。',
    priority: 'P2',
    category: '前端设计',
    keywords: ['html格式化', 'html美化', 'html压缩', 'html在线工具'],
    icon: '<>',
    volume: 180,
    seoNote: '代码整理',
  },
  {
    slug: 'uuid',
    name: 'UUID 生成',
    shortName: 'UUID',
    desc: '批量生成 UUID v4 / v7，支持大写、去横线、批量导出。',
    priority: 'P2',
    category: '开发编码',
    keywords: ['uuid', 'uuid生成', 'guid生成', '在线uuid'],
    icon: 'ID',
    volume: 200,
    seoNote: '开发测试、临时标识',
  },
  {
    slug: 'jwt',
    name: 'JWT 解析',
    shortName: 'JWT',
    desc: '解析 JWT Token 的 Header、Payload、签名，检查过期时间。',
    priority: 'P2',
    category: '加解密',
    keywords: ['jwt', 'jwt解析', 'jwt解码', 'jwt token'],
    icon: 'JWT',
    volume: 180,
    seoNote: 'Token 调试，后端开发者需求',
  },
  {
    slug: 'cron',
    name: 'Cron 表达式解析',
    shortName: 'Cron',
    desc: '解析 Cron 表达式，生成未来执行时间表，支持 5/6/7 段格式。',
    priority: 'P2',
    category: '开发编码',
    keywords: ['cron', 'cron表达式', 'cron解析', '定时任务'],
    icon: '⏰',
    volume: 150,
    seoNote: '定时任务配置',
  },
  {
    slug: 'color',
    name: '颜色转换',
    shortName: '颜色',
    desc: 'HEX、RGB、HSL 颜色互转，含色彩预览与调色板。',
    priority: 'P2',
    category: '前端设计',
    keywords: ['颜色转换', 'hex转rgb', 'rgb转hex', 'hsl转换', '调色板'],
    icon: '🎨',
    volume: 200,
    seoNote: '前端需求',
  },
];

export const priorityMeta: Record<Priority, { label: string; desc: string; color: string; bg: string }> = {
  P0: { label: '核心工具', desc: '开发者每日高频使用', color: '#B83A3A', bg: '#FCEFEF' },
  P1: { label: '常用工具', desc: '日常开发常用', color: '#C8862E', bg: '#FDF5EA' },
  P2: { label: '扩展工具', desc: '特定场景补齐', color: '#2D7A4F', bg: '#EEF7F1' },
};

export const categoryMeta: Record<Category, { icon: string; color: string }> = {
  '开发编码': { icon: '⌨️', color: '#2D5F8A' },
  '加解密': { icon: '🔐', color: '#B83A3A' },
  '文档处理': { icon: '📄', color: '#C8862E' },
  '前端设计': { icon: '🎨', color: '#7A4FB8' },
  '网络调试': { icon: '🌐', color: '#2D7A4F' },
};

export function getTool(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

export function toolsByPriority(p: Priority): Tool[] {
  return tools.filter(t => t.priority === p);
}

export function toolsByCategory(c: Category): Tool[] {
  return tools.filter(t => t.category === c);
}
