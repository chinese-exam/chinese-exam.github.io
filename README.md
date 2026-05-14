# 模拟考试网站

一个功能完整的**在线模拟考试系统**，支持多科目、多难度的考试练习。

## ✨ 核心特性

- 🎓 **多科目支持** - 汉语、数学、英文
- 📊 **多难度分级** - 简单、中等、困难
- ⏱️ **实时计时** - 精确倒计时，时间到自动提交
- 📝 **多题型** - 选择题、填空题、简答题
- 💾 **进度保存** - 自动保存答题进度，支持恢复
- 📱 **响应式设计** - 完美适配桌面、平板、手机
- 🎯 **智能导航** - 快速跳转任意题目
- ⚡ **高性能** - 使用 Next.js 16 Turbopack 编译

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+ (推荐) 或 npm/yarn

### 安装和运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm run start

# 代码检查
pnpm run lint
```

启动后访问 `http://localhost:3000`

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   └── exam/page.tsx      # 考试页面
├── components/            # React 组件
├── lib/                   # 工具库
├── types/                 # TypeScript 定义
├── public/questions/      # 试题数据 (JSON)
└── README.md             # 本文件
```

## 📚 如何使用

### 1. 首页流程
- 选择**科目**（中文/数学/英文）
- 选择**难度**（简单/中等/困难）
- 点击"开始考试"

### 2. 考试流程
- 阅读题目和选项
- 选择或填写答案
- 使用题目导航快速跳转
- 时间到或手动提交完成考试

### 3. 成绩查看
- 显示总用时
- 显示得分和总分
- 返回首页重新开始

## 🔧 数据添加

在 `public/questions/` 目录添加试题文件，命名格式：`{subject}_{difficulty}.json`

### 试题文件格式

```json
{
  "name": "试卷名称",
  "totalScore": 100,
  "totalQuestions": 10,
  "totalDuration": 60,
  "subject": "chinese",
  "difficulty": "easy",
  "sections": [...]
}
```

详见 `DEVELOPMENT.md` 文件获取完整的数据格式说明。

## 💻 技术栈

- **前端框架** - Next.js 16 (App Router)
- **语言** - TypeScript 5
- **样式** - Tailwind CSS 4 + Shadcn UI
- **构建工具** - Turbopack
- **存储** - LocalStorage (浏览器本地存储)

## 📖 文档

- `DEVELOPMENT.md` - 开发指南和详细文档
- `README.md` - 项目概览（本文件）

## 🔄 工作流程

```
科目选择 → 难度选择 → 开始考试 → 答题 → 自动保存进度 → 提交 → 查看成绩 → 返回
```

## 📱 响应式支持

- ✅ 桌面电脑 (1024px+)
- ✅ 平板设备 (768px - 1024px)  
- ✅ 手机设备 (<768px)

## 🎯 后续计划

- [ ] 自动评分系统
- [ ] 错题库功能
- [ ] 学习进度统计
- [ ] 用户认证系统
- [ ] 成绩历史记录
- [ ] 更多科目和试题

## 📝 示例数据

项目内已包含示例试题：
- `public/questions/chinese_easy.json` - 中文简单题
- `public/questions/math_easy.json` - 数学简单题
- `public/questions/english_easy.json` - 英文简单题

## ⚙️ 环境变量

暂无必需的环境变量配置。

## 🐛 常见问题

**Q: 如何添加新的试题？**  
A: 在 `public/questions/` 目录创建 JSON 文件，按照格式添加试题。

**Q: 进度是否支持云同步？**  
A: 当前版本使用本地存储，后续可添加数据库支持。

**Q: 可以修改考试时间吗？**  
A: 可以，修改试题 JSON 中的 `totalDuration` 字段。

## 📄 许可证

MIT License

---

**版本**: 0.1.0  
**最后更新**: 2024 年 5 月 14 日
