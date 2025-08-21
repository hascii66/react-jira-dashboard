# 📊 React Jira Dashboard

Dashboard สำหรับสรุปงานจาก Jira แสดงผลในรูปแบบกราฟและตาราง  
พัฒนาโดยใช้ **Vite + React + TypeScript + MUI**  

---

## 🚀 Getting Started

### 1. Clone Project
```bash
git clone https://github.com/<USERNAME>/react-jira-dashboard.git
cd react-jira-dashboard

npm install

npm run dev

npm run build
npm run preview

🌍 Deploy to GitHub Pages

# 1. ติดตั้ง gh-pages

npm install gh-pages --save-dev

# 2. ตั้งค่า vite.config.ts

แก้ base ให้ตรงกับชื่อ repo (สมมติ repo คือ react-jira-dashboard)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/react-jira-dashboard/", // 👈 สำคัญ
});

# 3. เพิ่ม Script ใน package.json

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && gh-pages -d dist"
  }

#4. Push Code ไป GitHub

#5. Deploy ไป GitHub Pages
npm run deploy
