# 新手老師大作戰 v5.1.3 Research Participants

本版本供已完成整體研究知情同意程序的參與者使用。

## 流程
首頁 → 基本資料 → 八個融合教育情境 → 教師成長紀錄 → 「我的重新思考」 → 完成並提交研究資料 → 課堂接棒

## 本版調整
- 移除遊戲內再次勾選研究同意的步驟。
- 移除遊戲結束後「不提交研究資料」的選項。
- 首頁直接進入基本資料頁。
- Reflection 仍為必填，至少 20 字、最多 500 字。
- 完成 Reflection 後，以「完成並提交研究資料」作為本次研究活動的完成步驟。
- Google Apps Script endpoint 與 Google Sheet 欄位均未變更。

## 研究資料欄位
`completionTime`, `restartCount`, `nickname`, `school`, `department`, `grade`, `gender`, `specialEd`, `fieldExperience`, `q1`–`q8`, `teacherType`, `voice`, `individual`, `accommodation`, `collaboration`, `procedure`, `reflection`

- Q1–Q8 以 A/B/C/D 儲存。
- completionTime 以秒為單位，自開始研究遊戲起計時；若提交前重新挑戰，時間持續累積。
- restartCount 計算提交前的重新挑戰次數。
