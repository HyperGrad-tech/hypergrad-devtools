export type Priority = 'P0' | 'P1' | 'P2';
export type Category = '开发编码' | '加解密' | '文档处理' | '前端设计' | '网络调试';

export interface FaqItem {
  q: string;
  a: string;
}

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
  /** 优化后的 <title>，主关键词前置 + 长尾修饰词 */
  seoTitle: string;
  /** 优化后的 meta description，140-160 字符 */
  seoDescription: string;
  /** FAQ 问答，用于 FAQPage Schema + 页面自动渲染 */
  faq: FaqItem[];
  /** 相关工具 slug 列表，用于内链卡片 */
  related: string[];
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
    seoTitle: 'JSON 格式化在线 - JSON 校验/压缩/美化工具 | HyperGrad',
    seoDescription: '免费在线 JSON 格式化工具，支持 JSON 校验、压缩、美化、树形查看，语法高亮错误定位。纯浏览器本地处理，数据不上传。',
    faq: [
      { q: 'JSON 格式化报错「Unexpected token」是什么原因？', a: '最常见原因是 JSON 中包含单引号、尾随逗号、注释或未转义的特殊字符。JSON 标准要求字符串必须用双引号，最后一个元素后不能有逗号。' },
      { q: '这个工具会上传我的 JSON 数据吗？', a: '不会。本工具是纯前端实现，所有解析和格式化都在你的浏览器中完成，数据不会通过网络发送到任何服务器。' },
      { q: '支持多大的 JSON 文件？', a: '浏览器原生 JSON.parse 可处理数 MB 的数据，常规接口返回的 JSON 都能流畅处理。超过 10MB 可能会卡顿。' },
      { q: 'JSON 和 JSONP 有什么区别？', a: 'JSON 是数据格式，JSONP（JSON with Padding）是一种利用 <script> 标签绕过同源策略获取跨域数据的技术，把 JSON 数据包裹在回调函数中。现代开发中 CORS 已取代 JSONP，JSON 几乎不再需要 JSONP 形式传输。' },
    ],
    related: ['sql-formatter', 'json-to-class', 'js-formatter', 'regex-tester'],
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
    seoTitle: '加密解密在线 - MD5/AES/Base64/SHA256 工具 | HyperGrad',
    seoDescription: '免费在线加密解密工具，支持 MD5、SHA-256、Base64、AES、DES 等算法，纯浏览器本地计算，密钥不上传。',
    faq: [
      { q: 'MD5 可以解密吗？', a: '不能。MD5 是单向哈希，无法逆向还原。网上的「MD5 解密」站点本质是彩虹表查询，只能反查常见字符串。' },
      { q: 'AES 解密时提示「解密失败」？', a: '请确认密钥与加密时一致，且数据是完整的 Base64 密文。本工具使用 ECB 模式 + PKCS7 填充。' },
      { q: '我的密钥会被上传吗？', a: '不会。所有加密解密在浏览器本地完成，密钥和明文都不会离开你的设备。' },
      { q: '对称加密和非对称加密有什么区别？', a: '对称加密（AES/DES）加密和解密用同一密钥，速度快，适合大量数据。非对称加密（RSA）用公钥加密、私钥解密，解决了密钥分发问题但速度慢，适合加密小数据或交换对称密钥。实际应用中常混合使用。' },
    ],
    related: ['hash', 'base64', 'jwt', 'url-encode'],
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
    seoTitle: '正则表达式在线测试 - 正则匹配/语法速查 | HyperGrad',
    seoDescription: '免费在线正则表达式测试工具，实时匹配高亮、常用正则库、语法速查。纯浏览器本地运算。',
    faq: [
      { q: '为什么带 g 标志时只匹配到部分结果？', a: '带 g 标志的正则对象是有状态的（lastIndex）。本工具已正确处理，会遍历所有匹配。如出现死循环（零宽匹配），已加 10000 次安全限制。' },
      { q: '支持 PCRE / Python / Java 的正则语法吗？', a: '本工具基于 JavaScript RegExp，支持大部分通用语法。少数高级特性（如命名捕获组 (?<name>) 在 ES2018+ 支持、负向断言等）视浏览器而定。' },
      { q: '正则表达式中的贪婪和非贪婪有什么区别？', a: '贪婪模式（默认，如 .*）尽可能匹配最多字符；非贪婪模式（加 ?，如 .*?）尽可能匹配最少字符。例如对字符串 "<a><b>"，<.*> 匹配整个串，<.*?> 只匹配 <a>。' },
      { q: '如何匹配中文？', a: '基础匹配用 [\\u4e00-\\u9fa5] 匹配基本汉字。注意 JavaScript 正则中需用 Unicode 转义。更全面的中文范围还包括扩展区，但日常使用基本区足够。' },
    ],
    related: ['json-formatter', 'js-formatter', 'url-encode', 'timestamp'],
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
    seoTitle: '时间戳转换在线 - Unix 时间戳转日期工具 | HyperGrad',
    seoDescription: '免费在线 Unix 时间戳转换工具，支持秒/毫秒、多时区互转，本地时间显示。纯浏览器本地运算。',
    faq: [
      { q: '秒和毫秒时间戳怎么区分？', a: '10 位数字通常是秒级（Unix 时间戳），13 位数字通常是毫秒级（JavaScript 默认）。本工具会自动识别。' },
      { q: '时区是怎样的？', a: '时间戳本身是 UTC 时区。转换结果会同时显示本地时间和 UTC 时间，便于跨时区对照。' },
      { q: '什么是 Unix 时间戳？', a: 'Unix 时间戳是从 1970 年 1 月 1 日 00:00:00 UTC 到指定时刻的秒数（或毫秒数）。它是跨平台、跨语言通用的时间表示方式，不受时区影响。2038 年问题指的是 32 位有符号整数最大值 2^31-1 对应 2038-01-19，届时会溢出。' },
      { q: '为什么有时候时间戳转换差 8 小时？', a: '这是因为时区差异。UTC+8（北京时间）比 UTC 快 8 小时。如果服务端存的是 UTC 时间但按本地时间显示，或反之，就会出现 8 小时偏差。务必确认数据链路中每一步的时区处理一致。' },
    ],
    related: ['radix', 'uuid', 'cron', 'json-formatter'],
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
    seoTitle: '进制转换在线 - 二/八/十/十六进制互转工具 | HyperGrad',
    seoDescription: '免费在线进制转换工具，支持二进制、八进制、十进制、十六进制互转，大数 BigInt 支持。纯浏览器本地运算。',
    faq: [
      { q: '为什么 JavaScript 的进制转换大数会出错？', a: 'JavaScript Number 类型是 64 位浮点，安全整数上限是 2^53 - 1。超过此值精度丢失。本工具使用 BigInt，可处理任意长度整数。' },
      { q: '进制前缀有哪些？', a: '常见前缀：0x 表示十六进制（如 0xFF），0b 表示二进制（如 0b1010），0o 表示八进制（如 0o17）。C/C++ 中无前缀的 0 开头数字也是八进制（如 017 = 15），这是常见陷阱。' },
      { q: '十六进制为什么广泛使用？', a: '十六进制每个字符正好表示 4 位（半个字节），两个字符一个字节，与二进制对齐简洁。在内存地址、颜色值、MAC 地址、哈希值、密钥等场景广泛使用，比二进制紧凑，比十进制直观对应字节。' },
      { q: '如何手动做进制转换？', a: '十进制转 N 进制：不断除以 N 取余数，余数倒序排列。N 进制转十进制：每位数字乘以 N 的幂次后求和。例如十进制 255 转十六进制：255÷16=15 余 15(F)，15÷16=0 余 15(F)，结果 FF。' },
    ],
    related: ['timestamp', 'uuid', 'json-formatter', 'regex-tester'],
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
    seoTitle: 'URL 编码解码在线 - 百分号编码/URI 组件 | HyperGrad',
    seoDescription: '免费在线 URL 编码解码工具，支持 encodeURIComponent、encodeURI、百分号编码，处理中文特殊字符。纯浏览器本地运算。',
    faq: [
      { q: '中文被编码成了 %E4%B8%AD 是什么？', a: '这是 UTF-8 编码后的百分号表示。中文字符「中」的 UTF-8 字节是 E4 B8 AD，每个字节前加 % 即 %E4%B8%AD。' },
      { q: '应该用 encodeURI 还是 encodeURIComponent？', a: '编码整条 URL 用 encodeURI（保留 / ? : @ & 等）；编码 URL 的某个参数值用 encodeURIComponent（这些字符也要编码）。' },
      { q: '空格编码成 + 还是 %20？', a: '两者都合法。HTML 表单（application/x-www-form-urlencoded）用 +，纯 URL 中 RFC 3986 推荐 %20。本工具使用 %20 以符合 RFC 标准。' },
      { q: 'URL 为什么需要编码？', a: 'URL 标准只允许 ASCII 字母数字和少数特殊字符（- _ . ~ : / ? # [ ] @ ! $ & \' ( ) * + , ; =）。中文、空格、其他非 ASCII 字符必须编码为 %XX 形式才能在 URL 中安全传输，否则会被解析器误判。' },
    ],
    related: ['base64', 'encrypt', 'jwt', 'json-formatter'],
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
    seoTitle: 'Base64 编解码在线 - 文本/图片转 Base64 | HyperGrad',
    seoDescription: '免费在线 Base64 编码解码工具，支持文本与图片 Data URL 互转。纯浏览器本地处理，数据不上传。',
    faq: [
      { q: 'Base64 是加密吗？', a: '不是。Base64 是编码，任何人都能解码，不提供任何安全性。仅用于数据格式转换，不要用它保护敏感信息。' },
      { q: 'Base64 后体积变大了？', a: '是的，Base64 编码后体积约为原始数据的 4/3（约增大 33%）。因此大图片不建议转 Base64 嵌入。' },
      { q: 'Base64 Data URL 是什么？', a: 'Data URL 是将小图片等资源以 Base64 编码直接嵌入 HTML/CSS 的方案，格式为 data:image/png;base64,xxxx。优点是减少 HTTP 请求，缺点是不走缓存、增大 HTML 体积，适合小图标。' },
      { q: '浏览器 atob/btoa 处理中文为什么会乱码？', a: '浏览器原生 atob/btoa 不支持 UTF-8，只处理 Latin1 字符。处理中文需先 encodeURIComponent 再编码，或用 TextEncoder/TextDecoder。本工具已正确处理 UTF-8。' },
    ],
    related: ['url-encode', 'encrypt', 'hash', 'jwt'],
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
    seoTitle: '哈希生成在线 - MD5/SHA-256/SHA-512 哈希工具 | HyperGrad',
    seoDescription: '免费在线哈希生成器，同时计算 MD5、SHA-1、SHA-256、SHA-512，支持 HMAC 带密钥哈希。纯浏览器本地运算。',
    faq: [
      { q: '哈希和加密有什么区别？', a: '哈希是单向的，无法从哈希值还原原文；加密是双向的，可解密。哈希用于校验完整性、密码存储；加密用于保护数据机密性。' },
      { q: 'HMAC 是什么？', a: 'HMAC（Hash-based Message Authentication Code）是带密钥的哈希，用于验证消息完整性和真实性。只有知道密钥的人才能生成有效的 HMAC。' },
      { q: 'MD5 还能用吗？', a: 'MD5 存在已知碰撞攻击，不应用于安全场景（密码存储、数字签名）。仅适合非安全场景的校验和、文件去重。安全场景请用 SHA-256。' },
      { q: '可以用哈希存密码吗？', a: '普通哈希存密码不安全，容易被彩虹表破解。密码存储必须用专门算法如 bcrypt、scrypt、Argon2，内置 salt 和慢速计算抵抗暴力破解。' },
    ],
    related: ['encrypt', 'base64', 'jwt', 'url-encode'],
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
    seoTitle: '二维码生成在线 - 二维码制作/解析工具 | HyperGrad',
    seoDescription: '免费在线二维码生成与解析工具，支持自定义尺寸、容错等级，文本图片互转。纯浏览器本地处理。',
    faq: [
      { q: '二维码最大能放多少内容？', a: '取决于版本和容错等级：版本 40 在 L 级下最多约 2953 字节（纯数字 7089 个）。内容越多码图越密，建议长文本先用短链接服务压缩。' },
      { q: '扫描识别不出来怎么办？', a: '请确认图片清晰、对比度足够、未被裁剪掉边缘空白区域；H 级容错的码图即使污损 30% 仍可识别，必要时重新生成提高容错等级。' },
      { q: '支持中文吗？', a: '支持。本工具使用 UTF-8 编码，中文、Emoji 均可正常生成与解析。' },
      { q: '容错等级 L/M/Q/H 怎么选？', a: 'L 级容错 7%（码图最简洁、容量最大），M 级 15%，Q 级 25%，H 级 30%（码图最密集、最耐污损）。如需在二维码中间放 Logo，建议选 H 级。日常使用 M 级平衡。' },
    ],
    related: ['color', 'image-compress', 'json-formatter', 'base64'],
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
    seoTitle: '图片压缩在线 - PNG/JPEG/WebP 压缩工具 | HyperGrad',
    seoDescription: '免费在线图片压缩工具，支持 PNG/JPEG/WebP 压缩，本地 Canvas 处理不上传。可调质量与尺寸。',
    faq: [
      { q: '压缩后图片会变模糊吗？', a: '取决于质量参数。JPEG/WebP 质量越高越清晰但体积越大。一般 75%-85% 是清晰与体积的最佳平衡点，肉眼几乎看不出差异。' },
      { q: '为什么 PNG 压不出来更小？', a: 'PNG 是无损格式，质量参数对它无效。要进一步压缩 PNG 请改用 WebP，或在「最大宽度」里缩小尺寸。' },
      { q: '图片会上传服务器吗？', a: '不会。本工具基于浏览器 Canvas API 完整在本地处理，断网也能用，适合处理含隐私信息的截图。' },
      { q: 'WebP 和 JPEG 哪个压缩率更高？', a: 'WebP 通常比 JPEG 压缩率高 25-35%，同等质量下体积更小。WebP 还支持透明通道（像 PNG）和动画（像 GIF）。现代浏览器全面支持 WebP，建议优先使用。' },
    ],
    related: ['pdf-merge', 'qrcode', 'color', 'base64'],
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
    seoTitle: 'PDF 合并在线 - 多个 PDF 文件合并工具 | HyperGrad',
    seoDescription: '免费在线 PDF 合并工具，将多个 PDF 文件合并为一个，本地处理不上传服务器，断网可用。',
    faq: [
      { q: '合并后的 PDF 会被压缩吗？', a: '不会。本工具做的是无损页面拼接，保留原 PDF 的页面、文字与图片质量。如需压缩请使用图片压缩工具把扫描页压小后再合并。' },
      { q: '加密的 PDF 能合并吗？', a: '需先解除密码保护的 PDF 才能合并。本工具不会破解加密文档，遇到加密文件时会提示加载失败。' },
      { q: '文件会上传服务器吗？', a: '不会。合并完全在浏览器使用 pdf-lib 库本地完成，断网也可使用，处理完不保留任何文件。' },
      { q: '合并后页面顺序可以调整吗？', a: '本工具按加入顺序拼接。如需调整顺序，请按目标顺序依次添加文件。合并前请确认文件顺序正确。' },
    ],
    related: ['image-compress', 'qrcode', 'color', 'json-formatter'],
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
    seoTitle: 'SQL 格式化在线 - SQL 美化/压缩工具 | HyperGrad',
    seoDescription: '免费在线 SQL 格式化工具，支持 MySQL/PostgreSQL/SQL Server 方言，美化压缩一键转换。纯浏览器本地处理。',
    faq: [
      { q: '格式化会改我的 SQL 逻辑吗？', a: '不会。本工具只调整空白、换行与关键字大小写，不修改语句结构、表名、字段名和值。原样保留所有标识符。' },
      { q: '方言选错了会怎样？', a: '方言主要负责处理各数据库特有语法（如 PostgreSQL 的 :: 类型转换、SQL Server 的方括号标识符）。选错可能无法识别某些特有写法，但通用 SQL 语句通常仍能正常格式化。' },
      { q: '能压缩成单行吗？', a: '可以。格式化后点击「压缩为单行」会去掉多余空白，把整段 SQL 合并为一行，方便放进代码字符串或日志。' },
      { q: 'SQL 格式化有什么好处？', a: '格式化后的 SQL 更易阅读和维护，便于团队协作时统一风格。在 Code Review 中，格式化的 SQL 能更快发现逻辑错误。建议在提交代码前先格式化。' },
    ],
    related: ['json-formatter', 'js-formatter', 'regex-tester', 'json-to-class'],
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
    seoTitle: 'JSON 转实体类在线 - Java/C#/Go/Python 工具 | HyperGrad',
    seoDescription: '免费在线 JSON 转实体类工具，支持 Java、C#、Go、Python、TypeScript 等语言代码生成。纯浏览器本地处理。',
    faq: [
      { q: '数组里的对象会被识别吗？', a: '会。本工具取数组第一个元素作为元素类型样本，生成对应的嵌套类，数组字段类型转为 List<元素类>。建议传入结构完整的样本数据。' },
      { q: '字段值为 null 时怎么处理？', a: 'null 会推断为通用 Object / object / interface{} / Any / null。建议用含真实值的样本，或生成后手动调整为更精确的类型。' },
      { q: '支持嵌套 JSON 吗？', a: '支持。嵌套对象会生成嵌套类/内部类，深度不限。但过深嵌套可读性差，建议适当扁平化后转换。' },
      { q: '字段名有特殊字符怎么办？', a: 'JSON 字段名含特殊字符或关键字时，各语言生成器会自动加引号或下划线处理。如 JavaScript 的 class 用引号包裹，Java 会加下划线前缀。' },
    ],
    related: ['json-formatter', 'sql-formatter', 'js-formatter', 'regex-tester'],
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
    seoTitle: 'JS 格式化在线 - JavaScript 美化/压缩工具 | HyperGrad',
    seoDescription: '免费在线 JavaScript 格式化工具，代码美化压缩，基于 Prettier。纯浏览器本地处理，代码不上传。',
    faq: [
      { q: '压缩会破坏代码逻辑吗？', a: '本工具的压缩保留换行符，仅折叠多余空白和移除块注释，不会触发 ASI 问题。但行注释（//）会保留，以免误删带 // 的 URL。生产环境建议用专门的压缩工具（如 Terser）做变量混淆和死代码消除。' },
      { q: '支持 ES6+ 和 JSX 语法吗？', a: '支持 ES6+ 全部语法。纯 JSX 需使用专门的 JSX 格式化器，本工具以 babel parser 解析标准 JS。' },
      { q: 'Prettier 和 ESLint 有什么区别？', a: 'Prettier 是代码格式化工具，只管空格换行等风格，不管代码质量。ESLint 是代码检查工具，能发现未使用变量、隐式全局等潜在 bug。两者通常配合使用：Prettier 管格式，ESLint 管质量。' },
    ],
    related: ['css-formatter', 'html-formatter', 'json-formatter', 'sql-formatter'],
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
    seoTitle: 'CSS 格式化在线 - CSS 美化/压缩工具 | HyperGrad',
    seoDescription: '免费在线 CSS 格式化工具，代码美化压缩，基于 Prettier。纯浏览器本地处理，代码不上传。',
    faq: [
      { q: '压缩会去掉所有注释吗？', a: '是。压缩模式移除所有 /* */ 注释以最大化减小体积。如需保留版权注释，压缩前请手动备份。' },
      { q: '支持 SCSS / Less 吗？', a: '本工具使用 postcss 解析器，支持嵌套、变量等基础 SCSS/Less 写法，复杂函数和 mixin 可能解析失败。' },
      { q: 'CSS 压缩能减小多少体积？', a: '压缩通常能减小 15%-30% 体积，主要来自移除空白、注释和合并缩写。配合 Gzip 传输可再减小 70%。生产环境务必开启压缩。' },
    ],
    related: ['js-formatter', 'html-formatter', 'color', 'json-formatter'],
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
    seoTitle: 'HTML 格式化在线 - HTML 美化工具 | HyperGrad',
    seoDescription: '免费在线 HTML 格式化工具，代码美化，基于 Prettier。纯浏览器本地处理，代码不上传。',
    faq: [
      { q: '压缩后布局错乱怎么办？', a: '通常是行内元素（如 span、a）之间的空白被折叠导致间距消失。压缩前给这些元素显式设置 margin，或保留格式化模式。' },
      { q: '支持 Vue / JSX 模板吗？', a: '本工具按标准 HTML 解析。Vue 单文件模板、JSX 含自定义组件的语法可能无法完美格式化，建议用对应语言专门的格式化器。' },
      { q: 'HTML 格式化会影响 SEO 吗？', a: '不会。搜索引擎不关心 HTML 的换行和缩进，只关心内容和结构。格式化是给人看的，压缩是给机器传输的，两者都不影响 SEO。' },
    ],
    related: ['css-formatter', 'js-formatter', 'json-formatter', 'color'],
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
    seoTitle: 'UUID 生成在线 - UUID v4/v7 批量生成工具 | HyperGrad',
    seoDescription: '免费在线 UUID 生成器，批量生成 UUID v4/v7，支持大写、去横线、批量导出。纯浏览器本地生成。',
    faq: [
      { q: 'UUID 真的不会重复吗？', a: 'UUID v4 有 122 位随机空间，理论碰撞概率极低。生成 10 亿个 UUID 后碰撞概率仍不到十亿分之一。日常使用可视为全局唯一。' },
      { q: 'v4 和 v7 我应该选哪个？', a: '没有排序需求选 v4；若用作数据库主键或按时间检索（如日志、事件流），选 v7，其时间前缀让 B+ 树索引更紧凑、范围查询更快。' },
      { q: '去横线后还能用吗？', a: '可以。横线只是展示用的分隔符，去掉后仍是合法的 32 位十六进制字符串，常用作文件名、Redis key 等场景。' },
      { q: 'UUID 和 GUID 有什么区别？', a: 'GUID 是微软对 UUID 的实现（主要用于 Windows/.NET），两者格式基本相同。GUID 通常指 Microsoft 的实现，UUID 是 RFC 4122 标准。日常使用中两个术语常互换。' },
    ],
    related: ['timestamp', 'radix', 'json-formatter', 'cron'],
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
    seoTitle: 'JWT 解析在线 - JSON Web Token 解码工具 | HyperGrad',
    seoDescription: '免费在线 JWT 解析器，解码 Token 的 Header、Payload、Signature，检查过期时间。纯浏览器本地解析。',
    faq: [
      { q: '这个工具能验证 Token 是否被篡改吗？', a: '不能。验签需要服务端密钥（HS256）或公钥（RS256）。本工具只解码 Header/Payload，用于调试和查看声明内容。' },
      { q: 'Token 放在浏览器解析安全吗？', a: '安全。JWT 的 Payload 是 Base64 编码而非加密，任何持有 Token 的人都能读取内容，所以不要在 Payload 放敏感信息。本工具的处理完全在本地，不会外传。' },
      { q: 'exp 已过期还能用吗？', a: '不能。服务端会校验 exp，过期 Token 会被拒绝，需要用 refresh token 换新的 access token。' },
      { q: 'JWT 应该存在哪里？', a: '常见两种方案：存在 HttpOnly Cookie（防 XSS 读取但需防 CSRF）或 localStorage（方便但易受 XSS 攻击）。根据威胁模型权衡。Access token 过期时间应短（15-30 分钟），配合 refresh token 使用。' },
    ],
    related: ['encrypt', 'hash', 'base64', 'url-encode'],
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
    seoTitle: 'Cron 表达式解析在线 - 定时任务表达式工具 | HyperGrad',
    seoDescription: '免费在线 Cron 表达式解析工具，生成未来执行时间表，支持 5/6/7 段格式。纯浏览器本地解析。',
    faq: [
      { q: '时区按什么算？', a: '本工具按浏览器本地时区计算执行时间。生产环境中 Linux crontab 用服务器时区，Spring/Quartz 等可配置时区，部署时请确认时区一致。' },
      { q: '6 段和 5 段有什么区别？', a: '5 段最小粒度是分钟，6 段多了秒字段，适合需要秒级调度的场景（如 Quartz）。Linux crontab 只支持 5 段。' },
      { q: '为什么我的表达式解析失败？', a: '常见原因：字段数不是 5 或 6 段；取值越界（如月份写 13）；周字段大小写问题（部分实现要求大写）。请对照字段顺序检查。' },
      { q: 'Cron 表达式中 * 和 ? 有什么区别？', a: '星号 * 表示"每个"（每分钟、每小时等），问号 ? 表示"不指定"，仅在日和周字段互斥使用——当指定了其中一个，另一个必须用 ?。例如 0 0 * * ? 表示每天 0 点（日用 *，周必须用 ?）。' },
    ],
    related: ['timestamp', 'uuid', 'regex-tester', 'json-formatter'],
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
    seoTitle: '颜色转换在线 - HEX/RGB/HSL 互转工具 | HyperGrad',
    seoDescription: '免费在线颜色转换工具，HEX、RGB、HSL 互转，含色彩预览与调色板。纯浏览器本地运算。',
    faq: [
      { q: 'HSL 和 HSV 有什么区别？', a: 'HSL 的 L=100% 是纯白，L=50% 是纯色；HSV 的 V=100% 是纯色。CSS 原生支持 HSL，本工具使用 HSL 与 CSS 一致。' },
      { q: '支持 8 位 HEX（含透明度）吗？', a: '当前支持 6 位 HEX 与 3 位缩写。8 位透明度 HEX（如 #2D5F8AFF）可读取但不解析 alpha 通道，后续可扩展。' },
      { q: '为什么我输入的 HEX 没反应？', a: '请确认是 3 位或 6 位合法十六进制（0-9、a-f），可带可不带 # 号。非法字符会跳过同步。' },
      { q: 'RGB 和 HSL 分别适合什么场景？', a: 'RGB 是设备显示的原生格式（红绿蓝加色），适合代码直接指定颜色。HSL 更符合人类直觉（色相、饱和度、亮度），适合需要程序化调整颜色明暗或生成配色方案的场景。CSS 变量配合 HSL 能实现灵活的主题切换。' },
    ],
    related: ['css-formatter', 'qrcode', 'html-formatter', 'image-compress'],
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
