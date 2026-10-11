# 新手老師大作戰 v5.1.4 Reflection Before Result

本版本供已完成整體研究知情同意程序的參與者使用。

## 流程
首頁 → 基本資料 → 八個融合教育情境 → DAY 1 COMPLETE → 「我的重新思考」 → 完成遊戲／送出研究紀錄 → 顯示教師樣貌與成長紀錄 → 課堂接棒

## 本版調整
- 教師類型與雷達結果改為「完成反思並成功送出本次紀錄後」才顯示，避免參與者看到結果後誤以為活動已完成。
- Reflection 仍為必填，最低由 20 字調整為 10 字，最多 500 字。
- 最後主要按鈕改為「✨ 完成遊戲，查看我的教師樣貌」。
- 結果出現前不再重複提醒「提交研究資料」；送出動作整合在完成遊戲流程中。
- 結果頁保留已填寫的重新思考內容，並可下載教師成長卡。
- Google Apps Script endpoint 與 Google Sheet 欄位均未變更。

## 研究資料欄位
`completionTime`, `restartCount`, `nickname`, `school`, `department`, `grade`, `gender`, `specialEd`, `fieldExperience`, `q1`–`q8`, `teacherType`, `voice`, `individual`, `accommodation`, `collaboration`, `procedure`, `reflection`

- Q1–Q8 以 A/B/C/D 儲存。
- teacherType 會在背景送出時先計算，但直到送出完成後才顯示給參與者。
- completionTime 以秒為單位，自開始研究遊戲起計時，包含最後反思時間。


## v5.1.5
- Reflection minimum: 10 characters
- Result is shown only after successful submission
- index.html uses game.js?v=5.1.5 to avoid stale browser cache
