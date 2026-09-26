# 新手老師大作戰：融合校園的一天

一個給師資生使用的融合教育情境決策遊戲。

- 虛構校園：國教院附小
- 玩家角色：五年二班導師「黃老師」
- 核心學生角色：小彥
- 內容：8 個連續情境、前後呼應、6 種一般結局 + 1 個隱藏結局
- 技術：純 HTML / CSS / JavaScript，不需要資料庫、不蒐集玩家資料
- 適合：GitHub Pages、Netlify、Cloudflare Pages

## 檔案

- `index.html`：網站入口
- `style.css`：版面與手機版樣式
- `game.js`：劇情、選擇、分支與結局判定

## 放到 GitHub Pages

1. 在 GitHub 建立新的 repository，例如：`inclusive-school-game`
2. 把這個資料夾裡的三個網站檔案上傳到 repository 根目錄：
   - `index.html`
   - `style.css`
   - `game.js`
3. 進入該 repository 的 **Settings**
4. 左側選單選 **Pages**
5. 在 **Build and deployment**：
   - Source：`Deploy from a branch`
   - Branch：`main`
   - Folder：`/ (root)`
6. 儲存後，GitHub 會產生公開網址，通常格式為：

   `https://你的GitHub帳號.github.io/inclusive-school-game/`

之後只要更新 repository 裡的檔案，公開網址不用改，原本的 QR Code 也可以繼續使用。

## 課堂使用建議

1. 請師資生掃 QR Code 直接遊玩。
2. 不先公開有哪些結局。
3. 玩完後請大家分享自己的教師結局。
4. 再以簡報帶入融合教育、合理調整、學生表意、個別化支持、平等參與與專業合作等概念。

## 注意

本遊戲目前刻意只在遊戲中以概念層級帶到法規，不直接塞入大量法條或條號，方便後續由講師簡報進行正式法規說明。
