# 模拟考试网站 - 快速开始指南

## 项目概述

这是一个**在线模拟考试系统**，支持多科目（汉语、数学、英文）、多难度等级的模拟考试，包含实时计时、自动评分、进度保存等功能。

## 🎯 核心功能

✅ **科目选择** - 支持汉语、数学、英文三科  
✅ **难度分级** - 简单、中等、困难三个等级  
✅ **实时计时** - 精确的倒计时，时间到自动提交  
✅ **多题型支持** - 选择题、填空题、简答题  
✅ **进度保存** - 自动保存答题进度，意外中断可恢复  
✅ **题目导航** - 快速跳转到任意题目  
✅ **自动评分** - 提交后立即显示成绩  
✅ **移动端适配** - 响应式设计，手机平板都好用  

## 📁 项目结构

```
├── app/
│   ├── page.tsx              # 首页 - 科目和难度选择
│   ├── exam/
│   │   └── page.tsx         # 考试主页面
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局样式
│
├── components/
│   ├── ExamHeader.tsx       # 考试头部（计时器）
│   ├── ProgressBar.tsx      # 进度条
│   ├── QuestionViewer.tsx   # 题目显示和答题组件
│   └── ui/                  # Shadcn UI 组件库
│
├── lib/
│   ├── exam-service.ts      # 数据加载和本地存储管理
│   └── utils.ts             # 工具函数
│
├── types/
│   ├── exam.ts              # TypeScript 类型定义
│   └── index.ts             # 类型导出
│
├── public/
│   └── questions/           # 试题数据 JSON 文件
│       ├── chinese_easy.json
│       ├── math_easy.json
│       └── english_easy.json
│
├── package.json             # 依赖配置
├── tsconfig.json            # TypeScript 配置
├── tailwind.config.ts       # Tailwind CSS 配置
└── README.md                # 项目文档
```

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm run dev
```
浏览器访问 `http://localhost:3000`

### 生产环境构建
```bash
pnpm run build
pnpm run start
```

### 代码检查
```bash
pnpm run lint
```

## 📋 数据格式

试题数据存储在 `public/questions/` 目录中，采用 JSON 格式。

### 试卷结构
```json
{
  "name": "中文模拟考试 - 入门级",
  "year": 2024,
  "month": 5,
  "totalScore": 100,
  "totalQuestions": 10,
  "totalDuration": 60,
  "difficulty": "easy",
  "subject": "chinese",
  "sections": [
    {
      "title": "选择题",
      "totalScore": 60,
      "totalQuestions": 6,
      "questions": [...]
    }
  ]
}
```

### 题目类型

#### 1. 单选题 (single_choice)
```json
{
  "type": "single_choice",
  "stem": "题目内容",
  "content": {
    "options": {
      "A": "选项 A",
      "B": "选项 B",
      "C": "选项 C",
      "D": "选项 D"
    }
  },
  "answer": "B",
  "score": 10,
  "analysis": "答案解释"
}
```

#### 2. 填空题 (cloze)
```json
{
  "type": "cloze",
  "stem": "题目内容（含空白）",
  "content": {},
  "answer": "正确答案",
  "score": 10,
  "analysis": "答案解释"
}
```

#### 3. 简答题 (essay)
```json
{
  "type": "essay",
  "stem": "题目内容",
  "content": {},
  "answer": "参考答案",
  "score": 10,
  "analysis": "评分标准"
}
```

## 🔧 核心功能详解

### 1. 考试流程
1. **首页** → 选择科目 + 难度 → 点击"开始考试"
2. **试卷确认** → 显示试卷信息 → 点击"开始考试"
3. **答题页面** → 完成所有题目 → 点击"提交答卷"
4. **成绩展示** → 显示总用时、得分、正确率

### 2. 本地进度保存
- 每 5 秒自动保存一次答题进度
- 使用 `localStorage` 存储 (浏览器本地存储)
- 支持中断后恢复进度

### 3. 计时管理
- 精确的秒级计时
- 时间快要用完时颜色变红警告
- 时间到自动提交答卷

## 📱 响应式设计

页面对不同屏幕尺寸做了适配：

- **桌面** (≥1024px)：两列布局（题目区 + 题目导航）
- **平板** (768px - 1024px)：单列布局，题目导航折叠
- **手机** (<768px)：全屏单列布局，导航作为下拉菜单

## 🔐 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript 5
- **样式**：Tailwind CSS 4 + Shadcn UI
- **状态管理**：React Hooks
- **存储**：LocalStorage
- **编译器**：Turbopack

## 📊 工作流程

### 数据加载流程
```
首页选择 → URL 参数 → ExamPage 读取参数 → loadExamPaper() 
→ 从 /public/questions 加载 JSON → 解析题目 → 显示题目
```

### 答题保存流程
```
用户输入 → handleAnswerChange() → setState answers 
→ 自动保存到 localStorage (每5秒)
```

### 计时流程
```
开始考试 → setInterval(每1秒) → 更新 timeLeft 
→ 时间 <= 0 → 自动提交考试
```

## 🎨 UI/UX 特点

- **渐变色设计** - 现代感十足的蓝绿渐变背景
- **卡片式布局** - 清晰的信息分层
- **动画反馈** - 按钮悬停、计时器变色等交互反馈
- **图标辅助** - 直观的功能表示
- **无障碍考虑** - 足够的对比度，清晰的标签

## 🌟 后续扩展建议

1. **更多科目和难度** - 添加更多试题 JSON 文件
2. **自动评分系统** - 实现选择题自动评分，填空题模糊匹配
3. **错题库** - 收集用户做错的题目
4. **学习统计** - 追踪用户的学习进度和成绩趋势
5. **用户认证** - 添加登录功能，保存用户成绩历史
6. **成绩分享** - 生成分享卡片
7. **音视频支持** - 在题目中嵌入图片、视频
8. **API 后端** - 连接数据库，支持动态添加试题

## 📝 常见问题

### Q: 如何添加新的试题？
A: 在 `public/questions/` 目录中创建新的 JSON 文件，命名规则为 `{subject}_{difficulty}.json`，然后按照题目格式添加试题内容。

### Q: 考试时间是否可以调整？
A: 可以，在 JSON 文件的 `totalDuration` 字段中设置分钟数。

### Q: 进度保存在哪里？
A: 保存在浏览器的 LocalStorage 中，可在浏览器开发者工具 → Application → Local Storage 中查看。

### Q: 如何清除保存的进度？
A: 在浏览器开发者工具中清空对应的 LocalStorage 条目，或打开浏览器隐私模式重新做题。

## 🤝 贡献指南

欢迎提交 Pull Request 或提出问题！

## 📄 许可证

MIT License

---

**最后更新**：2024年5月14日  
**版本**：0.1.0
