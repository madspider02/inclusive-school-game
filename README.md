# 新手老師大作戰 v5.1 Research Mode

GitHub Pages 可部署版本。

## 兩個入口
- 一般體驗模式：不送出研究資料。
- 研究參與模式：研究說明 → 知情同意 → 基本資料 → 八個情境 → 教師成長紀錄 → 自行決定是否提交研究資料。

## 研究模式送出欄位
`completionTime`, `restartCount`, `nickname`, `school`, `department`, `grade`, `gender`, `specialEd`, `fieldExperience`, `q1`–`q8`, `teacherType`, `voice`, `individual`, `accommodation`, `collaboration`, `procedure`, `reflection`。

- Q1–Q8 以 A/B/C/D 儲存。
- completionTime 以秒為單位，從第一次開始研究遊戲到按下提交資料為止；若提交前重新挑戰，時間持續累積。
- restartCount 計算提交資料前的重新挑戰次數。
- Apps Script endpoint 已接入 game.js。

> 正式研究前，研究說明與知情同意文字請以研究倫理審查核准版本為準。
