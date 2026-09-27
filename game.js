(() => {
  'use strict';

  const titleEl = document.getElementById('screen-title');
  const timeEl = document.getElementById('time-pill');
  const progressEl = document.getElementById('progress-bar');
  const sceneEl = document.getElementById('scene');
  const storyEl = document.getElementById('story');
  const actionsEl = document.getElementById('actions');
  const dayTrackEl = document.getElementById('day-track');
  const progressLabelEl = document.getElementById('progress-label');
  const progressWrapEl = document.querySelector('.progress-wrap');
  const footerEl = document.getElementById('footer-note');

  const RESEARCH_API = 'https://script.google.com/macros/s/AKfycbyjiE15KzX279g3ZAyXEkQMkLaM2H_SUXItuZuqeZbIH3zWu6N4bpT2ETTnpXZSmRtuCA/exec';

  const initialTraits = () => ({
    rights: 0,
    individual: 0,
    voice: 0,
    accommodation: 0,
    collaboration: 0,
    procedure: 0,
    care: 0,
    same: 0,
    delegate: 0,
    solo: 0
  });

  const emptyResearchProfile = () => ({
    nickname: '',
    school: '',
    department: '',
    grade: '',
    gender: '',
    specialEd: '',
    fieldExperience: ''
  });

  const state = {
    phase: 'cover',
    mode: null,
    step: 0,
    answers: {},
    traits: initialTraits(),
    reflection: { choice: '', text: '' },
    research: {
      consented: false,
      profile: emptyResearchProfile(),
      startTime: null,
      completionTime: 0,
      restartCount: 0,
      submitted: false,
      declined: false
    }
  };

  const scenes = [
    {
      id: 'q1',
      time: '07:40',
      icon: '📚',
      art: 'classroom',
      title: '第一關｜新班級裡的「特殊生」',
      story: `
        <p>資源班陳老師從門口探頭。</p>
        <div class="quote">「黃老師，小彥是自閉症學生，有接受資源班服務。他的 IEP 裡有一些需要注意的地方。像是臨時改變活動時，他有時候會比較不安；上課如果資訊很多，也可能需要多一點時間。」</div>
        <p>「快打鐘了，我中午再過來跟你說詳細一點。」</p>
        <p>你看向教室裡的小彥。他正在看黑板上的今日課表。</p>
        <div class="callout"><strong>身為他的導師，你現在最適合怎麼做？</strong></div>
      `,
      options: [
        {
          title: '先掌握障礙特徵',
          text: '「我大學有學過自閉症，先按照常見特徵注意他的狀況，有問題再調整。」',
          delta: { procedure: 1 },
          result: '你開始回想課堂裡學過的自閉症特徵。至少，你不是毫無準備。',
          reflect: '但「自閉症學生」和眼前的「小彥」，會完全一樣嗎？'
        },
        {
          title: '先把 IEP 弄清楚',
          text: '「先看小彥的 IEP，確認需求與支持方式，再依照 IEP 協助。」',
          delta: { procedure: 2, individual: 1 },
          result: '你在記事本上寫下：中午先把小彥的 IEP 看完。',
          reflect: 'IEP 很重要，但它是學生的「使用說明書」，還是認識學生的起點？'
        },
        {
          title: '先認識小彥',
          text: '「IEP 要看，我也想直接了解他會什麼、需要什麼，以及他自己怎麼想。」',
          delta: { individual: 2, voice: 2, rights: 1 },
          result: '你告訴小彥：「如果有什麼事情需要我知道，可以直接跟我說。」他看著你問：「什麼都可以說嗎？」',
          reflect: '小彥不只是 IEP 裡被描述的學生。'
        },
        {
          title: '專業的事交給專業的人',
          text: '「我負責班級教學；特殊教育有資源班老師，有需要再配合就好。」',
          delta: { delegate: 3 },
          result: '你決定有需要時再找陳老師。畢竟，他才是特教老師。',
          reflect: '只是今天的事情，未必都會等到陳老師在場。'
        }
      ]
    },
    {
      id: 'q2',
      time: '08:40',
      icon: '✏️',
      art: 'math',
      title: '第二關｜老師，為什麼他可以？',
      story: `
        <p>數學課進行到一半，小彥看得懂題目，卻需要比較長的時間閱讀。你讓他多一些時間。</p>
        <div class="quote">阿哲：「黃老師，為什麼小彥可以多一點時間？我寫不完也可以嗎？」</div>
        <p>小彥把鉛筆放下。全班都看著你。</p>
      `,
      options: [
        {
          title: '規則就是規則',
          text: '「小彥是特殊教育學生，本來就可以有一些特別的調整。」',
          delta: { procedure: 1 },
          result: '幾個孩子點點頭：「喔，因為他是特殊生。」',
          reflect: '你解釋了調整，卻也可能留下「因為他是特殊生」的標籤。'
        },
        {
          title: '公平就是每個人都可以',
          text: '「好，那今天只要寫不完的人，都可以多五分鐘。」',
          delta: { same: 3 },
          result: '阿哲很開心。但你發現，小彥需要處理的困難並不只是「時間」。',
          reflect: '每個人得到一模一樣的東西，就一定公平嗎？'
        },
        {
          title: '把焦點放回每個人的學習需要',
          text: '「公平不一定是完全一樣，而是讓每個人都有機會把自己會的表現出來。」',
          delta: { rights: 2, individual: 2, accommodation: 1 },
          result: '阿哲皺眉：「所以不是讓他比較簡單？」你回答：「這就是我們要一起想清楚的地方。」',
          reflect: '五年二班第一次開始討論：公平是不是等於一樣。'
        },
        {
          title: '不要公開談他的事情',
          text: '「這是老師跟小彥之間的事情，我們不適合在全班面前討論。」',
          delta: { rights: 1, procedure: 1 },
          result: '你保護了小彥的個人資訊，但同學對差異支持仍然困惑。',
          reflect: '保護隱私與回應同學的公平疑問，能不能同時做到？'
        }
      ]
    },
    {
      id: 'q3',
      time: '10:10',
      icon: '🔬',
      art: 'science',
      title: '第三關｜我們這組不要小彥！',
      story: `
        <p>自然課分組前，佳佳小聲說：</p>
        <div class="quote">「我們這組……可以不要跟小彥一組嗎？」</div>
        <p>阿哲：「因為他都不跟我們討論啊！上次做海報，我們只是把標題換一個顏色，他就一直說不行。」</p>
        <p>佳佳趕緊補一句：「我們不是討厭他喔……可是跟他一組真的很累。」</p>
      `,
      options: [
        {
          title: '融合就是大家都要一起',
          text: '「小彥也是班上的一份子，不能排斥他。照原本分組。」',
          delta: { rights: 1 },
          result: '小彥留在原組，但實驗很快又出現爭執。',
          reflect: '「在同一組」和「真正參與」是同一件事嗎？'
        },
        {
          title: '先讓大家完成今天的實驗',
          text: '「今天先幫小彥換一組，讓大家順利完成，之後再處理。」',
          delta: { care: 1 },
          result: '實驗順利了，但你突然想起：上次被換組的，好像也是小彥。',
          reflect: '每次都是合理的臨時處理，可是被移動的為什麼總是他？'
        },
        {
          title: '先弄清楚「麻煩」到底是什麼',
          text: '先問同學發生了什麼，也問小彥怎麼看，再找具體的合作支持。',
          delta: { individual: 2, voice: 2, rights: 1 },
          result: '「一定要照順序」「突然改東西會不安」「有時很久才回答」——模糊的「麻煩」開始變成可以處理的情境。',
          reflect: '真正需要改變的是小彥，還是活動的方式？'
        },
        {
          title: '讓小彥自己選',
          text: '「等一下我問他想跟哪一組，再讓他自己選。」',
          delta: { voice: 2 },
          result: '小彥仍然選原組：「佳佳知道我怎麼記實驗步驟。」',
          reflect: '尊重選擇很好，但老師的支持責任就結束了嗎？'
        }
      ]
    },
    {
      id: 'q4',
      time: '11:20',
      icon: '📝',
      art: 'math',
      title: '第四關｜這張考卷，他也要寫一樣的嗎？',
      story: `
        <p>今天的小考要評量「兩步驟應用問題」，文字很多。</p>
        <div class="quote">另一位老師：「小彥真的要寫這份？他不是有去資源班嗎？不然幫他改簡單一點，這樣比較有成就感。」</div>
        <p>你知道：「需要比較多時間」和「不會這個內容」，好像不是同一件事。</p>
      `,
      options: [
        {
          title: '既然有評量調整，就降低題目難度',
          text: '把兩步驟題改成一步驟，題數也少一點。',
          delta: { care: 3 },
          result: '小彥很快寫完，卻問：「為什麼我的題目跟阿哲不一樣？」',
          reflect: '支持學生，有沒有可能同時降低了原本對他的期待？'
        },
        {
          title: '公平起見，大家寫同一份',
          text: '同一份考卷、同一個時間，這樣最公平。',
          delta: { same: 3 },
          result: '鐘響時，小彥還有兩題沒寫完；你看見他已完成的算式其實是對的。',
          reflect: '相同規則真的測到了相同能力嗎？'
        },
        {
          title: '先確認這次到底要評量什麼',
          text: '保留兩步驟目標，調整文字呈現、標示重點並提供需要的時間。',
          delta: { accommodation: 3, individual: 2, rights: 1 },
          result: '小彥完成了兩步驟計算。原來他會。',
          reflect: '調整不一定是讓學習變簡單；也可能是移除妨礙學生表現能力的障礙。'
        },
        {
          title: '既然有 IEP，就完全照 IEP 辦',
          text: 'IEP 寫什麼支持，就完全照文件提供。',
          delta: { procedure: 3 },
          result: '評量順利完成，但你突然想到：這份 IEP 是幾個月前訂定的。',
          reflect: 'IEP 能不能取代教師此刻對學生需求的觀察與判斷？'
        }
      ]
    },
    {
      id: 'q5',
      time: '12:30',
      icon: '🚌',
      art: 'trip',
      title: '第五關｜媽媽說：「不然就不要去了。」',
      story: `
        <p>下個月要去自然科學博物館。小彥媽媽擔心去年戶外教育時臨時改行程、人又多，讓小彥非常不安，希望今年能陪同；如果不方便，也可以讓小彥留校。</p>
        <p>你問小彥：「你想去嗎？」</p>
        <div class="quote"><strong>「……想。我會怕，可是我還是想去。」</strong></div>
        <p>「因為全班都會去啊。而且我想看恐龍。我只是不喜歡不知道下一個要去哪裡。」</p>
      `,
      options: [
        {
          title: '尊重家長的判斷',
          text: '如果媽媽擔心，就安排小彥當天留校。',
          delta: { care: 2 },
          result: '小彥問：「阿哲跟佳佳都會去嗎？」然後一直看著通知單上的恐龍。',
          reflect: '你尊重了家長的擔心，有沒有同樣認真地對待小彥的意願？'
        },
        {
          title: '校外教學大家都一樣',
          text: '既然要去，就跟全班照原行程參加，不做特別安排。',
          delta: { same: 2, rights: 1 },
          result: '你保障了「可以去」，卻還沒有處理究竟是什麼讓參與特別困難。',
          reflect: '參加活動與能夠實質參與，可能不是同一件事。'
        },
        {
          title: '先找出他參與時真正遇到的障礙',
          text: '和小彥、家長、資源班老師確認去年的困難，再討論支持。',
          delta: { accommodation: 3, voice: 2, collaboration: 2, individual: 2 },
          result: '需求開始變得具體：提前知道流程、變動時先通知、人潮太多時能短暫離開、知道找誰協助。小彥還問：「可以告訴我恐龍在哪一樓嗎？」',
          reflect: '有沒有可能先改變環境，而不是先改變小彥能不能參加？'
        },
        {
          title: '媽媽陪同最保險',
          text: '如果媽媽願意，就請她陪同，大家都比較安心。',
          delta: { care: 2 },
          result: '小彥問：「如果媽媽沒有去，我就不能去嗎？」',
          reflect: '家長陪同可以是一種支持，但它是否真的有必要成為參加條件？'
        }
      ]
    },
    {
      id: 'q6',
      time: '13:30',
      icon: '🏃',
      art: 'sport',
      title: '第六關｜安全起見，他今天不要跑？',
      story: `
        <p>體育課要進行接力。林老師說，上次有人突然大聲喊叫，小彥在跑道上停住，今天又人多、又計時。</p>
        <div class="quote">「安全起見，不然今天讓他幫忙記成績？一樣有參與，而且比較不會出事。」</div>
        <p>你轉頭，小彥已經拿著接力棒問阿哲：「我是第三棒對不對？」</p>
      `,
      options: [
        {
          title: '安全還是最重要',
          text: '今天先不要跑，讓小彥改做記錄工作。',
          delta: { care: 2 },
          result: '小彥坐在終點記秒數。他在體育課裡，也有一個任務。',
          reflect: '「有一個任務」就是「參與原本的學習活動」嗎？'
        },
        {
          title: '既然要融合，就讓他跟大家一樣跑',
          text: '既然他想跑，就照原本棒次，不做特別處理。',
          delta: { rights: 1, same: 1 },
          result: '旁邊突然一陣歡呼，小彥停頓，後面的同學差點撞上來。',
          reflect: '不要排除學生，不等於什麼支持都不用做。'
        },
        {
          title: '先確認風險，再找支持方法',
          text: '了解上次發生什麼，也問小彥，再調整提示、動線或約定訊號。',
          delta: { accommodation: 3, voice: 2, individual: 2, collaboration: 1 },
          result: '你們發現問題主要是突然聲音與不清楚是否該停。阿哲在旁邊補一句：「他跑很快耶！」',
          reflect: '今天第一次，有人談到的不是小彥的困難，而是他的能力。'
        },
        {
          title: '讓小彥自己決定',
          text: '只要他說想跑，就尊重他的決定。',
          delta: { voice: 3 },
          result: '小彥說想跑。林老師卻問你：「那上次的風險要怎麼處理？」',
          reflect: '學生表意，不代表把成人的支持責任全部交還給學生。'
        }
      ]
    },
    {
      id: 'q7',
      time: '14:50',
      icon: '💬',
      art: 'talk',
      title: '第七關｜老師，可是我不想要這樣',
      story: '',
      options: [
        {
          title: '先讓他知道老師是為他好',
          text: '「大家都是因為擔心你、希望你好，才會做這些決定。」',
          delta: { care: 2 },
          result: '你的理由都是真的。但小彥安靜了下來。',
          reflect: '「為你好」能不能取代學生自己的聲音？'
        },
        {
          title: '以後都讓小彥自己決定',
          text: '「以後只要是你的事情，最後就按照你的決定來做。」',
          delta: { voice: 3 },
          result: '小彥反而說：「可是有時候我也不知道要怎麼選。」',
          reflect: '表意權不等於所有事情都由學生單獨決定。'
        },
        {
          title: '先聽，再一起重新看今天的決定',
          text: '你說你的想法，我也說老師擔心什麼，我們一起想辦法。',
          delta: { voice: 3, rights: 2, individual: 2, accommodation: 1 },
          result: '你們重新看了今天幾件事。你也承認，有些決定做得太快。',
          reflect: '讓學生的意見真正進入決策，同時保留教師的專業支持責任。'
        },
        {
          title: '把他的意見記下來，之後和大人討論',
          text: '把小彥的想法帶回家長、特教老師與其他教師的討論。',
          delta: { collaboration: 2, procedure: 1 },
          result: '你認真記錄了小彥的想法。只是他問：「那你們討論的時候，我呢？」',
          reflect: '聽過學生的意見，和讓他的聲音真正進入決策，是同一件事嗎？'
        }
      ]
    },
    {
      id: 'q8',
      time: '16:10',
      icon: '🌇',
      art: 'office',
      title: '第八關｜放學了，但事情還沒結束',
      story: `
        <p>孩子都走了。桌上留下小彥的 IEP、數學小考、校外教學通知單。</p>
        <p>陳老師走進來：</p>
        <div class="quote">「第一天還活著嗎？」</div>
        <p>你沉默三秒：「……我有很多事情想問你。」</p>
        <p>談完今天所有事情，你才發現：很多支持都是事情發生後才臨時決定。</p>
        <div class="callout"><strong>明天、下星期、下個月呢？</strong></div>
      `,
      options: [
        {
          title: '我要再多學一點，自己準備好',
          text: '把 IEP、法規與相關資料讀熟，至少下次我可以自己判斷。',
          delta: { solo: 3, procedure: 1 },
          result: '晚上 10:47，你還在搜尋：「自閉症學生校外教學支持」、「體育課融合教育支持」……你真的變得更懂了。',
          reflect: '但如果整個支持系統只存在黃老師的腦袋裡，一個很努力的老師可以撐多久？'
        },
        {
          title: '以後多請陳老師協助',
          text: '跟小彥有關的事情，先問資源班老師再決定。',
          delta: { delegate: 3, collaboration: 1 },
          result: '陳老師說：「可以啊。可是我星期三下午不在，而且體育課我也不會跟著去。」',
          reflect: '小彥一天大部分的時間，其實都在五年二班。'
        },
        {
          title: '把今天的問題變成大家一起準備的事情',
          text: '找小彥、家長、資源班、任課教師與需要的行政人員，先談支持與分工。',
          delta: { collaboration: 4, rights: 1, voice: 1, accommodation: 1 },
          result: '你們不再寫「小彥有哪些問題」，而是寫：「哪些情境形成障礙？可以有哪些支持？誰需要知道？誰一起做？」',
          reflect: '有些事情，本來就不應該由一個老師自己扛。'
        },
        {
          title: '先把 IEP 修得更完整',
          text: '把評量、活動參與、情緒支持與注意事項都先寫清楚。',
          delta: { procedure: 3 },
          result: '你寫到一半突然停下來：如果下一次遇到的是 IEP 裡從來沒有寫過的情境呢？',
          reflect: 'IEP 很重要，但它不是一本能預先寫完所有答案的學生使用說明書。'
        }
      ]
    }
  ];

  const endingData = {
    aware: {
      icon: '🌱',
      title: '權利導向型融合教師',
      body: '你開始從學生權利、實質參與與環境支持的角度思考教育決定。你不只在問「怎麼做」，也在問「這樣做會不會讓學生更能參與？」。',
      quote: '「黃老師，恐龍在二樓。」「你查到了？」「我早就查到了。我只是想確認你會不會記得。」'
    },
    care: {
      icon: '❤️',
      title: '善意照顧型教師',
      body: '你非常在意學生是否安全、是否被照顧好，也會積極保護學生不受挫折。你的關心很真誠，但有時候你會比學生更快替他決定什麼對他最好。',
      quote: '「黃老師，你不用每次都幫我。我不會的時候會跟你說。」'
    },
    procedure: {
      icon: '📋',
      title: '法規依循型教師',
      body: '你知道專業決定需要依據，會先看 IEP、文件與程序，這是重要基礎。下一步，是讓制度與眼前的學生經驗一起工作。',
      quote: '小彥看著自己的 IEP 問：「黃老師，這裡面都是我嗎？」'
    },
    solo: {
      icon: '🔥',
      title: '熱血投入型教師',
      body: '你願意為學生多做一點，也想把事情弄懂、弄好。你的投入很可貴，但融合教育若只靠一位老師獨自撐住，往往難以長久。',
      quote: '陳老師傳訊息：「你還在工作？」你回：「快好了。……應該。」'
    },
    delegate: {
      icon: '🧑‍🏫',
      title: '專業合作型教師',
      body: '你知道合作的重要，也會想到尋求特教專業支持。下一步，是在合作中更清楚自己身為導師的角色，而不是把責任全部交出去。',
      quote: '「黃老師，你明天還是我的老師嗎？」「當然啊。」「那就好。」'
    },
    same: {
      icon: '⚖️',
      title: '一致公平型教師',
      body: '你很在意不偏心，因此會傾向讓大家遵守相同規則。這份公平感很重要；下一步，是思考「完全一樣」和「實質平等」之間的差別。',
      quote: '「如果我看題目真的比較久，我一定要跟阿哲一樣快，才算公平嗎？」'
    },
    secret: {
      icon: '🔓',
      title: '可以再商量老師',
      body: '你今天不一定每一次都做出最理想的決定，但當小彥說出自己的感受時，你願意重新聽、重新想，也願意修正。這正是教師專業成長最珍貴的地方。',
      quote: '紙條上寫著：「昨天有一些事情我不喜歡。但是你後來有問我。所以今天如果有事情，我們可以再商量。——小彥」'
    }
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setFooter(message) {
    if (!footerEl) return;
    footerEl.innerHTML = `<span>本遊戲為師資培育教學用途之虛構情境</span><span aria-hidden="true">・</span><span>${message}</span>`;
  }

  function resetRunState() {
    state.step = 0;
    state.answers = {};
    state.traits = initialTraits();
    state.reflection = { choice: '', text: '' };
  }

  function elapsedResearchSeconds() {
    if (!state.research.startTime) return 0;
    return Math.max(0, Math.floor((Date.now() - state.research.startTime) / 1000));
  }

  function startGeneralMode() {
    resetRunState();
    state.mode = 'general';
    state.research = {
      consented: false,
      profile: emptyResearchProfile(),
      startTime: null,
      completionTime: 0,
      restartCount: 0,
      submitted: false,
      declined: false
    };
    setFooter('一般模式不送出研究資料');
    showPrologue();
  }

  function showResearchConsent() {
    state.phase = 'research-consent';
    state.mode = 'research';
    titleEl.textContent = '研究參與模式';
    timeEl.textContent = '研究說明';
    setProgress(4, '研究說明與知情同意');
    updateDayTrack(-1, false);
    renderSceneArt('classroom', '🎓', '融合教育情境決策研究');
    setFooter('研究模式僅在你同意提交後送出資料');

    storyEl.innerHTML = `
      <div class="research-note">
        <div class="mode-badge">RESEARCH MODE</div>
        <h2>研究參與說明</h2>
        <p>本研究旨在了解師資生如何在融合教育情境中進行專業判斷，以及參與者如何反思自己的教育決策。</p>
        <ul class="research-list">
          <li><strong>你會做什麼：</strong>填寫基本背景資料，完成八個融合教育情境，並可留下簡短反思。</li>
          <li><strong>系統會記錄：</strong>情境選擇、完成時間、重新挑戰次數、教師樣貌與五個教師雷達構面。</li>
          <li><strong>姓名：</strong>不要求真實姓名；請自行設定暱稱，並避免使用可直接識別你的真實姓名。</li>
          <li><strong>參與方式：</strong>你可隨時停止；遊戲結束後仍會先取得自己的教師成長紀錄，再自行決定是否提交研究資料。</li>
        </ul>
      </div>
      <label class="consent-check" for="research-consent-check">
        <input type="checkbox" id="research-consent-check">
        <span><strong>我已閱讀上述說明，並同意進入研究參與模式。</strong><br><span class="subtle">正式研究使用時，請以研究倫理審查核准之研究說明內容為準。</span></span>
      </label>
      <div id="research-consent-error" class="subtle" role="alert"></div>`;

    clearActions();
    addButton('繼續填寫基本資料 →', 'primary', () => {
      const checked = document.getElementById('research-consent-check')?.checked;
      if (!checked) {
        const err = document.getElementById('research-consent-error');
        if (err) err.textContent = '請先勾選同意後再繼續。';
        return;
      }
      state.research.consented = true;
      showResearchForm();
    });
    addButton('← 返回首頁', 'secondary', showCover);
  }

  function showResearchForm() {
    state.phase = 'research-form';
    titleEl.textContent = '研究參與模式｜基本資料';
    timeEl.textContent = '基本資料';
    setProgress(5, '填寫研究基本資料');
    updateDayTrack(-1, false);
    renderSceneArt('classroom', '🗂️', '開始前，先認識一下你');
    setFooter('研究模式｜不要求真實姓名');

    const p = state.research.profile;
    storyEl.innerHTML = `
      <div class="research-note">
        <h2>參與者基本資料</h2>
        <p>以下資料將用於描述與分析師資生的背景差異。請使用暱稱，不需填寫真實姓名。</p>
      </div>
      <form id="research-form" class="research-form">
        <div class="form-grid">
          <div class="form-field full">
            <label for="research-nickname">我的暱稱 *</label>
            <input id="research-nickname" name="nickname" required maxlength="30" autocomplete="off" value="${escapeHtml(p.nickname)}" placeholder="例如：小安、Teacher01">
            <div class="form-help">請勿使用真實姓名；此暱稱僅用於研究資料與遊戲中的稱呼。</div>
          </div>
          <div class="form-field">
            <label for="research-school">就讀學校 *</label>
            <input id="research-school" name="school" required maxlength="60" value="${escapeHtml(p.school)}" placeholder="例如：國立○○大學">
          </div>
          <div class="form-field">
            <label for="research-department">就讀科系 *</label>
            <input id="research-department" name="department" required maxlength="60" value="${escapeHtml(p.department)}" placeholder="例如：特殊教育學系">
          </div>
          <div class="form-field">
            <label for="research-grade">年級 *</label>
            <select id="research-grade" name="grade" required>
              <option value="">請選擇</option>
              ${['大一','大二','大三','大四','碩士班','博士班','其他'].map(v => `<option value="${v}" ${p.grade===v?'selected':''}>${v}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label for="research-gender">性別 *</label>
            <select id="research-gender" name="gender" required>
              <option value="">請選擇</option>
              ${['男','女','其他','不願回答'].map(v => `<option value="${v}" ${p.gender===v?'selected':''}>${v}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label for="research-specialed">特殊教育導論修習狀況 *</label>
            <select id="research-specialed" name="specialEd" required>
              <option value="">請選擇</option>
              ${['尚未修習','修習中','已修畢'].map(v => `<option value="${v}" ${p.specialEd===v?'selected':''}>${v}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label for="research-field">教育現場經驗 *</label>
            <select id="research-field" name="fieldExperience" required>
              <option value="">請選擇</option>
              ${[
                '無',
                '曾入校觀課或參與教育現場觀察',
                '曾擔任代理教師、代課教師或其他實際教學工作'
              ].map(v => `<option value="${v}" ${p.fieldExperience===v?'selected':''}>${v}</option>`).join('')}
            </select>
          </div>
        </div>
      </form>`;

    clearActions();
    addButton('開始研究遊戲 →', 'primary', saveResearchFormAndStart);
    addButton('← 返回研究說明', 'secondary', showResearchConsent);
  }

  function saveResearchFormAndStart() {
    const form = document.getElementById('research-form');
    if (!form || !form.reportValidity()) return;
    const get = (id) => document.getElementById(id)?.value?.trim() || '';
    state.research.profile = {
      nickname: get('research-nickname'),
      school: get('research-school'),
      department: get('research-department'),
      grade: get('research-grade'),
      gender: get('research-gender'),
      specialEd: get('research-specialed'),
      fieldExperience: get('research-field')
    };
    resetRunState();
    state.mode = 'research';
    state.research.startTime = Date.now();
    state.research.completionTime = 0;
    state.research.restartCount = 0;
    state.research.submitted = false;
    state.research.declined = false;
    setFooter('研究模式｜遊戲結束後由你決定是否提交資料');
    showPrologue();
  }

  function addTraits(delta) {
    Object.entries(delta || {}).forEach(([key, value]) => {
      state.traits[key] = (state.traits[key] || 0) + value;
    });
  }

  function setProgress(value, label = '') {
    const safe = Math.max(0, Math.min(100, value));
    progressEl.style.width = `${safe}%`;
    progressWrapEl?.setAttribute('aria-valuenow', String(Math.round(safe)));
    if (progressLabelEl && label) progressLabelEl.textContent = label;
  }

  function updateDayTrack(current = -1, completed = false) {
    if (!dayTrackEl) return;
    dayTrackEl.classList.toggle('is-idle', current < 0 && !completed);
    dayTrackEl.innerHTML = Array.from({ length: 8 }, (_, i) => {
      const cls = completed || i < current ? 'done' : (i === current ? 'current' : '');
      return `<span class="day-node ${cls}" aria-label="第 ${i + 1} 關${completed || i < current ? '已完成' : i === current ? '進行中' : '尚未開始'}"></span>`;
    }).join('');
  }

  function animateScreen() {
    const card = document.querySelector('.game-card');
    if (!card) return;
    card.classList.remove('screen-enter');
    void card.offsetWidth;
    card.classList.add('screen-enter');
  }

  function sceneImagePath(kind) {
    const files = {
      classroom: 'classroom.png',
      math: 'math.png',
      science: 'science.png',
      trip: 'fieldtrip.png',
      sport: 'sport.png',
      talk: 'talk.png',
      office: 'office.png',
      sunset: 'ending.png'
    };
    return `assets/${files[kind] || files.classroom}`;
  }

  function sceneLabel(kind, caption) {
    const labels = {
      classroom: ['晨間教室', '第一次真正面對學生差異'],
      math: ['數學課', '公平與評量的選擇'],
      science: ['自然課', '同儕合作與參與'],
      trip: ['午間討論', '校外教學與合理調整'],
      sport: ['體育課', '安全、風險與參與'],
      talk: ['放學前', '學生開始說出自己的想法'],
      office: ['放學後', '把個人努力變成團隊支持'],
      sunset: ['17:02', '國教院附小・放學']
    };
    return labels[kind] || ['國教院附小', caption];
  }

  function renderSceneArt(kind, icon, caption) {
    const [kicker, note] = sceneLabel(kind, caption);
    sceneEl.className = `scene scene-${kind}`;
    sceneEl.innerHTML = `
      <div class="scene-illustration">
        <div class="scene-copy">
          <div class="scene-kicker">${icon} ${kicker}</div>
          <div class="scene-headline">${caption}</div>
          <div class="scene-note">${note}</div>
        </div>
        <div class="scene-svg-wrap"><img class="scene-svg" src="${sceneImagePath(kind)}" alt="" aria-hidden="true"></div>
      </div>`;
    animateScreen();
  }

  function clearActions() {
    actionsEl.innerHTML = '';
  }

  function addButton(label, className, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', handler);
    actionsEl.appendChild(button);
  }

  function showCover() {
    state.phase = 'cover';
    state.mode = null;
    setFooter('一般模式不送出研究資料');
    titleEl.textContent = '新手老師大作戰';
    timeEl.textContent = '報到日';
    setProgress(3, '準備報到');
    updateDayTrack(-1, false);
    sceneEl.className = 'scene';
    sceneEl.innerHTML = `
      <div class="cover-hero">
        <div class="cover-copy">
          <div class="cover-school-name">國教院附小・虛構校園</div>
          <h2 class="cover-big">新手老師<br>大作戰</h2>
          <div class="cover-sub">融合校園的一天</div>
          <div class="cover-line">一場關於融合教育、合理調整與學生參與的情境決策遊戲</div>
        </div>
        <img class="school-illustration" src="assets/cover.png" alt="國教院附小校園插畫">
      </div>`;

    storyEl.innerHTML = `
      <div class="id-card center">
        <div class="subtle">國教院附小｜教師識別證</div>
        <div class="big-name">黃老師</div>
        <div>職務：五年二班導師</div>
        <div>到職日：今天</div>
      </div>
      <div class="card-note center"><strong>今日任務</strong><br>走進五年二班，完成你的第一天。</div>
      <p class="center">你修過教育法規。你學過特殊教育。你知道什麼是融合教育。</p>
      <p class="center"><strong>但是今天，你不是來考法規。<br>你是五年二班的導師。</strong></p>
      <div class="mode-grid" aria-label="選擇遊戲模式">
        <div class="mode-card"><strong>🎮 一般體驗模式</strong><span>適合課堂體驗、教師研習與個人反思；不會送出研究資料。</span></div>
        <div class="mode-card"><strong>🎓 研究參與模式</strong><span>完成研究說明與基本資料後進入遊戲；遊戲結束後再由你決定是否提交研究資料。</span></div>
      </div>
      <div class="author-note center small"><strong>遊戲設計與內容策劃</strong><br>國家教育研究院 黃彥融副研究員</div>`;

    clearActions();
    addButton('🎮 一般體驗模式', 'primary', startGeneralMode);
    addButton('🎓 研究參與模式', 'secondary', showResearchConsent);
    animateScreen();
  }

  function showPrologue() {
    state.phase = 'prologue';
    titleEl.textContent = '序章｜新手導師的第一天';
    timeEl.textContent = '07:38';
    setProgress(7, '07:38・走進五年二班');
    updateDayTrack(-1, false);
    renderSceneArt('classroom', '👨‍🏫', '五年二班');
    storyEl.innerHTML = `
      <p>「黃老師早！」</p>
      <p>「黃老師！他拿我的鉛筆！」</p>
      <p>「黃老師，我媽媽說聯絡簿要給你看！」</p>
      <p>「黃老師——」</p>
      <p>你才剛走進五年二班三分鐘，就已經有四個孩子同時叫你。</p>
      <p>這時，資源班老師從門口探頭。</p>
      <div class="quote">「黃老師，有空嗎？我想先跟你談一下小彥的事情。」</div>
      <p>你看向教室裡的小彥。</p>
      <p><strong>大學裡學過的「融合教育」、「IEP」、「合理調整」和「學生參與」，突然全部跑進你的腦袋。</strong></p>
      <p>但真正站在教室裡，你才發現第一個問題不是「法規怎麼規定？」</p>
      <div class="callout center"><strong>而是——「身為他的老師，我現在應該怎麼做？」</strong></div>
      <p class="center"><strong>你的融合校園第一天，正式開始。</strong></p>`;

    clearActions();
    addButton('走進五年二班 →', 'primary', () => showScene(0));
  }

  function buildDynamicLevel7() {
    const echoes = [];
    if (state.answers.q4 === 0) echoes.push('「可是那題我會。你為什麼沒有讓我寫？」');
    if (state.answers.q5 === 3) echoes.push('「我沒有說我要媽媽去。我只是說我會怕。」');
    if (state.answers.q3 === 1) echoes.push('「為什麼每次他們不想跟我一組，就是我換？」');
    if (state.answers.q6 === 0) echoes.push('「我今天本來想跑。可是老師說我記成績比較安全。那下次呢？」');
    if (!echoes.length) echoes.push('「你今天有問我很多事情。可是有時候……我也不知道要怎麼選。」');

    scenes[6].story = `
      <p>小彥桌上放著數學小考、校外教學通知單，還有接力棒號碼貼紙。</p>
      <div class="quote"><strong>「為什麼你們一直在討論我的事情？考卷也是。校外教學也是。體育課也是。可是有時候你們都沒有先問我。」</strong></div>
      <div class="card-note">${echoes.map(text => `<p>${text}</p>`).join('')}</div>
      <p>你突然明白：他不是在問「為什麼你們要幫我」。</p>
      <div class="callout"><strong>他在問的是：「決定我的事情時，我有沒有在裡面？」</strong></div>`;
  }

  function showScene(index) {
    state.phase = 'scene';
    state.step = index;
    if (index === 6) buildDynamicLevel7();

    const scene = scenes[index];
    titleEl.textContent = scene.title;
    timeEl.textContent = scene.time;
    setProgress(12 + index * 10.7, `第 ${index + 1} 關 / 8`);
    updateDayTrack(index, false);
    renderSceneArt(scene.art, scene.icon, scene.title.replace(/^第[一二三四五六七八]關｜/, ''));
    storyEl.innerHTML = scene.story;
    clearActions();

    scene.options.forEach((option, optionIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + optionIndex)}</span><span class="choice-copy"><strong>${option.title}</strong><span>${option.text}</span></span>`;
      button.addEventListener('click', () => chooseOption(scene, option, optionIndex));
      actionsEl.appendChild(button);
    });
  }

  function chooseOption(scene, option, optionIndex) {
    state.answers[scene.id] = optionIndex;
    addTraits(option.delta);

    storyEl.innerHTML = `
      <div class="decision-summary">
        <div class="decision-check">✓</div>
        <div><div class="subtle">你剛才的決定</div><strong>${option.title}</strong></div>
      </div>
      <p>${option.result}</p>
      <div class="reflect"><strong>想一想：${option.reflect}</strong></div>`;
    animateScreen();

    clearActions();
    const isLast = state.step === scenes.length - 1;
    addButton(isLast ? '走出校門 →' : '繼續今天的行程 →', 'primary', () => {
      if (isLast) showDayComplete();
      else showScene(state.step + 1);
    });
  }

  function showDayComplete() {
    state.phase = 'complete';
    titleEl.textContent = 'DAY 1 COMPLETE';
    timeEl.textContent = '17:02';
    setProgress(100, 'DAY 1 COMPLETE');
    updateDayTrack(8, true);
    renderSceneArt('sunset', '🏫🌇', '第一天，完成');
    storyEl.innerHTML = `
      <p>你終於收好東西，走出五年二班。</p>
      <p>經過校門時，警衛伯伯抬頭：</p>
      <div class="quote">「黃老師，第一天還順利嗎？」</div>
      <p>你想了一下。</p>
      <p>「……學到很多。」</p>
      <p>警衛伯伯點點頭。</p>
      <div class="callout center"><strong>「明天還要來喔。」</strong></div>
      <p class="center"><strong>今天，你做了八個決定。<br>這些決定，也慢慢形成了你的教師樣貌……</strong></p>`;

    clearActions();
    addButton('查看我的教師成長紀錄 →', 'primary', showGrowthRecord);
  }

  function getEndingKey() {
    const t = state.traits;
    const q7 = state.answers.q7;
    const q8 = state.answers.q8;
    const imperfectEarlier = ['q1','q2','q3','q4','q5','q6'].some(id => state.answers[id] !== 2);

    if (q7 === 2 && q8 === 2 && imperfectEarlier && t.voice >= 5 && t.collaboration >= 4) return 'secret';

    const dominant = [
      ['care', t.care],
      ['procedure', t.procedure],
      ['solo', t.solo],
      ['delegate', t.delegate],
      ['same', t.same]
    ].sort((a, b) => b[1] - a[1])[0];

    if (dominant[1] >= 5) return dominant[0];
    // 「熱血投入型」主要由第八關的獨自承擔選擇觸發；solo 只有這一關加權，因此使用 3 作為門檻。
    if (q8 === 0 && t.solo >= 3) return 'solo';

    const integrated = t.rights + t.individual + t.voice + t.accommodation + t.collaboration;
    if (integrated >= 16) return 'aware';
    if (t.care >= 3) return 'care';
    if (t.procedure >= 4) return 'procedure';
    if (t.delegate >= 3) return 'delegate';
    if (t.same >= 3) return 'same';
    return 'aware';
  }

  function computeRadar() {
    const t = state.traits;
    const toFive = (n) => Math.max(1, Math.min(5, Math.round(n)));
    return {
      voice: toFive((t.voice / 2.2) + (state.answers.q7 === 2 ? 1 : 0)),
      individual: toFive((t.individual / 2.1)),
      accommodation: toFive((t.accommodation / 2.2)),
      collaboration: toFive((t.collaboration / 1.8)),
      procedure: toFive((t.procedure / 2.1))
    };
  }

  function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function radarRowsHtml(radar) {
    const items = [
      ['💬 學生表意', radar.voice],
      ['🔍 個別化思考', radar.individual],
      ['⚖️ 合理調整', radar.accommodation],
      ['🤝 專業合作', radar.collaboration],
      ['📚 法規程序', radar.procedure]
    ];
    return items.map(([label, val]) => `
      <div class="radar-row">
        <div class="radar-label">${label}</div>
        <div class="radar-track"><div class="radar-fill" style="width:${val * 20}%"></div></div>
        <div class="radar-stars">${stars(val)}</div>
      </div>`).join('');
  }

  function getGrowthFeedback(key) {
    const feedback = {
      aware: {
        strength: '你願意停下來理解學生的處境，並思考如何移除參與障礙。',
        next: '持續把這些理念轉化為更具體的教學支持與班級經營策略。'
      },
      care: {
        strength: '你願意保護學生，也願意投入協助，對學生很有同理心。',
        next: '在提供支持前，先邀請學生參與決定，讓關心與表意一起出現。'
      },
      procedure: {
        strength: '你重視制度與依據，知道 IEP 與法規程序是重要基礎。',
        next: '除了看文件，也多回到學生當下的感受與具體情境。'
      },
      solo: {
        strength: '你願意承擔責任，也會主動學習，對學生非常投入。',
        next: '練習把支持工作轉化為團隊合作，而不是獨自承擔全部。'
      },
      delegate: {
        strength: '你知道專業合作的重要，願意尋求不同專業的協助。',
        next: '在合作中更清楚自己的角色，讓支持成為共同工作，而不是完全轉交。'
      },
      same: {
        strength: '你重視公平一致，不希望任何學生被偏心或被忽略。',
        next: '再往前一步思考：形式上的一樣，是否真的能帶來實質平等。'
      },
      secret: {
        strength: '你願意在學生回應之後重新思考，展現出真正的專業成長能力。',
        next: '把這種「可再商量」的態度帶進更多日常情境，形成穩定的班級文化。'
      }
    };
    return feedback[key];
  }

  function getRethink() {
    const priorities = [];
    if (state.answers.q2 !== 2) priorities.push('「老師，為什麼他可以？」——我想重新思考公平與合理調整。');
    if (state.answers.q5 !== 2) priorities.push('「我會怕，可是我還是想去。」——我想重新思考安全與參與如何並存。');
    if (state.answers.q7 !== 2) priorities.push('「可是你們沒有先問我。」——我想重新思考學生表意如何真正進入決策。');
    if (state.answers.q3 !== 2) priorities.push('「我們這組不要小彥！」——我想重新思考同儕合作與個別化支持。');
    return priorities[0] || '今天有些地方做得不錯，但我仍想繼續練習：先問學生，再一起找支持方法。';
  }

  function getGrowthCardData() {
    const key = getEndingKey();
    return {
      key,
      ending: endingData[key],
      radar: computeRadar(),
      feedback: getGrowthFeedback(key),
      rethink: getRethink()
    };
  }

  function showGrowthRecord() {
    state.phase = 'growth';
    const data = getGrowthCardData();
    titleEl.textContent = '我的教師成長紀錄';
    timeEl.textContent = 'DAY 1 COMPLETE';
    setProgress(100, '教師成長紀錄');
    updateDayTrack(8, true);
    sceneEl.className = 'scene scene-ending';
    sceneEl.innerHTML = `
      <div class="ending-hero">
        <div>
          <div class="ending-icon-bubble">${data.ending.icon}</div>
          <div class="school-badge">DAY 1 COMPLETE</div>
          <div class="scene-headline" style="max-width:none;margin-top:7px">${data.ending.title}</div>
          <div class="scene-caption">${state.mode === 'research' && state.research.profile.nickname ? `${escapeHtml(state.research.profile.nickname)}，你今天看見了自己的教師樣貌` : '黃老師，你今天看見了自己的教師樣貌'}</div>
        </div>
      </div>`;
    animateScreen();

    storyEl.innerHTML = `
      <div class="growth-card">
        <div class="subtle">這不是你的標籤，而是你今天在情境中展現出的教師傾向。</div>
        <h2>${data.ending.title}</h2>
        <p>${data.ending.body}</p>
        <div class="quote"><strong>${data.ending.quote}</strong></div>
      </div>
      <div class="radar-card">
        <h3>📊 我的融合教育教師雷達</h3>
        ${radarRowsHtml(data.radar)}
      </div>
      <div class="rethink-card" id="rethink-card">
        <h3>💭 我的重新思考</h3>
        <p>如果重新開始五年二班的一天，我最想重新思考哪一個決定？</p>
        <div class="rethink-options">
          <button type="button" class="rethink-choice" data-rethink="fairness"><strong>「老師，為什麼他可以？」</strong><span>公平與合理調整</span></button>
          <button type="button" class="rethink-choice" data-rethink="participation"><strong>「我會怕，可是我還是想去。」</strong><span>安全與參與</span></button>
          <button type="button" class="rethink-choice" data-rethink="voice"><strong>「可是你們沒有先問我。」</strong><span>學生表意</span></button>
        </div>
        <label class="reflection-label" for="reflection-input">下一次遇到類似情境，我會……</label>
        <textarea id="reflection-input" class="reflection-input" maxlength="180" placeholder="寫下一句給未來自己的提醒（可留白）"></textarea>
      </div>
      ${state.mode === 'research' ? `
      <div class="research-note" id="research-submit-panel">
        <div class="mode-badge">RESEARCH MODE</div>
        <h3>願意分享你的學習歷程嗎？</h3>
        <p>你已經先取得自己的教師成長紀錄。若你同意，系統會把本次遊戲選擇、背景資料、完成時間、重新挑戰次數、教師樣貌、五個雷達構面與反思文字送至研究資料表。</p>
        <div id="research-submit-status" class="subtle">研究資料尚未提交。</div>
      </div>` : ''}
      <div class="callout center"><strong>好的融合教師，不是永遠第一次就做出完美決定的人，<br>而是在學生的聲音出現後，願意重新理解、重新調整的人。</strong></div>`;

    clearActions();
    addButton('📸 下載我的教師成長卡（PNG）', 'secondary', downloadGrowthCard);
    if (state.mode === 'research') {
      if (!state.research.submitted && !state.research.declined) {
        addButton('🎓 同意提交本次研究資料', 'primary', sendResearchData);
        addButton('不提交研究資料', 'secondary', declineResearchData);
        addButton('↻ 再挑戰一次（尚未送出資料）', 'secondary', restartGame);
      }
    } else {
      addButton('↻ 再挑戰五年二班的一天', 'secondary', restartGame);
    }
    addButton('看看今天其實遇到了什麼 →', 'secondary', showConcepts);

    const textarea = document.getElementById('reflection-input');
    textarea.value = state.reflection.text || '';
    textarea.addEventListener('input', () => { state.reflection.text = textarea.value; });

    document.querySelectorAll('.rethink-choice').forEach(btn => {
      if (btn.dataset.rethink === state.reflection.choice) btn.classList.add('selected');
      btn.addEventListener('click', () => {
        state.reflection.choice = btn.dataset.rethink;
        document.querySelectorAll('.rethink-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  function researchPayload() {
    const radar = computeRadar();
    const profile = state.research.profile;
    const answerLetter = (id) => {
      const value = state.answers[id];
      return Number.isInteger(value) ? String.fromCharCode(65 + value) : '';
    };
    state.research.completionTime = elapsedResearchSeconds();
    return {
      completionTime: state.research.completionTime,
      restartCount: state.research.restartCount,
      nickname: profile.nickname,
      school: profile.school,
      department: profile.department,
      grade: profile.grade,
      gender: profile.gender,
      specialEd: profile.specialEd,
      fieldExperience: profile.fieldExperience,
      q1: answerLetter('q1'),
      q2: answerLetter('q2'),
      q3: answerLetter('q3'),
      q4: answerLetter('q4'),
      q5: answerLetter('q5'),
      q6: answerLetter('q6'),
      q7: answerLetter('q7'),
      q8: answerLetter('q8'),
      teacherType: getGrowthCardData().ending.title,
      voice: radar.voice,
      individual: radar.individual,
      accommodation: radar.accommodation,
      collaboration: radar.collaboration,
      procedure: radar.procedure,
      reflection: (state.reflection.text || '').trim()
    };
  }

  function setResearchSubmitStatus(message, kind = '') {
    const status = document.getElementById('research-submit-status');
    if (!status) return;
    status.className = `research-status ${kind}`.trim();
    status.textContent = message;
  }

  async function sendResearchData() {
    if (state.mode !== 'research' || state.research.submitted) return;
    const payload = researchPayload();
    setResearchSubmitStatus('正在送出研究資料……');
    const buttons = Array.from(actionsEl.querySelectorAll('button'));
    buttons.forEach(btn => { btn.disabled = true; });
    try {
      await fetch(RESEARCH_API, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
        keepalive: true
      });
      state.research.submitted = true;
      state.research.declined = false;
      setResearchSubmitStatus('研究資料已送出。謝謝你分享這次的學習歷程。', 'success');
      clearActions();
      addButton('📸 下載我的教師成長卡（PNG）', 'secondary', downloadGrowthCard);
      addButton('看看今天其實遇到了什麼 →', 'primary', showConcepts);
    } catch (error) {
      setResearchSubmitStatus('目前無法送出資料，請確認網路後再試一次。你的教師成長紀錄仍保留在本頁。', 'error');
      buttons.forEach(btn => { btn.disabled = false; });
    }
  }

  function declineResearchData() {
    if (state.mode !== 'research' || state.research.submitted) return;
    state.research.declined = true;
    setResearchSubmitStatus('你已選擇不提交研究資料。你的教師成長紀錄仍然可以下載與保留。', 'declined');
    clearActions();
    addButton('📸 下載我的教師成長卡（PNG）', 'secondary', downloadGrowthCard);
    addButton('看看今天其實遇到了什麼 →', 'primary', showConcepts);
  }

  function showConcepts() {
    state.phase = 'concepts';
    titleEl.textContent = '原來，你今天遇到的是……';
    timeEl.textContent = '課堂接棒';
    setProgress(100, '課堂接棒');
    updateDayTrack(8, true);
    renderSceneArt('classroom', '🧭', '接下來，交給簡報把概念說清楚');
    storyEl.innerHTML = `
      <div class="card-note">
        <strong>合理調整</strong><br>
        不是單純把要求降低，而是思考如何移除妨礙學生參與與表現的障礙。
      </div>
      <div class="card-note">
        <strong>學生表意</strong><br>
        不是所有事情都交給學生決定，而是讓他的意見真正進入與自己有關的決策。
      </div>
      <div class="card-note">
        <strong>融合教育</strong><br>
        不只是「人在普通班」，也要思考學生能否實質參與學習與班級生活。
      </div>
      <div class="callout center"><strong>法規不只是在告訴老師「不能做什麼」。<br>它也提醒我們：哪些人的權利、聲音與需要，不能在決策中消失。</strong></div>
      <p class="center subtle">接下來，跟著黃老師一起拆解這些情境背後的法規與權利概念。</p>`;

    clearActions();
    if (state.mode === 'research' && !state.research.submitted && !state.research.declined) {
      addButton('🎓 回到成長紀錄並決定是否提交資料', 'primary', showGrowthRecord);
    } else {
      addButton('↻ 重新挑戰國教院附小', 'primary', restartGame);
    }
  }

  function reflectionChoiceLabel() {
    const labels = {
      fairness: '「老師，為什麼他可以？」｜公平與合理調整',
      participation: '「我會怕，可是我還是想去。」｜安全與參與',
      voice: '「可是你們沒有先問我。」｜學生表意'
    };
    return labels[state.reflection.choice] || '尚未選擇';
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
    const chars = Array.from(text || '');
    let line = '';
    const lines = [];
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
        if (lines.length >= maxLines) break;
      } else {
        line = test;
      }
    }
    if (line && lines.length < maxLines) lines.push(line);
    lines.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
    return y + lines.length * lineHeight;
  }

  function downloadGrowthCard() {
    const data = getGrowthCardData();
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1620;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f6f3ec';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fffdf8';
    ctx.beginPath();
    ctx.roundRect(70, 60, 940, 1500, 28);
    ctx.fill();
    ctx.strokeStyle = '#d8d3c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    let y = 120;
    ctx.fillStyle = '#68736d';
    ctx.font = '28px sans-serif';
    ctx.fillText('新手老師大作戰：融合校園的一天', 120, y);
    y += 58;

    ctx.fillStyle = '#26312d';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText('我的教師成長紀錄', 120, y);
    y += 54;
    if (state.mode === 'research' && state.research.profile.nickname) {
      ctx.fillStyle = '#68736d';
      ctx.font = '26px sans-serif';
      ctx.fillText(`暱稱：${state.research.profile.nickname}`, 120, y);
      y += 54;
    } else {
      y += 20;
    }

    ctx.fillStyle = '#315a50';
    ctx.font = 'bold 42px sans-serif';
    y = wrapCanvasText(ctx, `${data.ending.icon} ${data.ending.title}`, 120, y, 830, 54, 2) + 22;

    ctx.fillStyle = '#26312d';
    ctx.font = '30px sans-serif';
    y = wrapCanvasText(ctx, data.ending.body, 120, y, 830, 44, 5) + 28;

    ctx.fillStyle = '#315a50';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('我的融合教育教師雷達', 120, y);
    y += 52;

    const radarItems = [
      ['學生表意', data.radar.voice],
      ['個別化思考', data.radar.individual],
      ['合理調整', data.radar.accommodation],
      ['專業合作', data.radar.collaboration],
      ['法規程序', data.radar.procedure]
    ];
    ctx.font = '28px sans-serif';
    for (const [label, val] of radarItems) {
      ctx.fillStyle = '#26312d';
      ctx.fillText(label, 120, y);
      ctx.fillStyle = '#315a50';
      ctx.fillText(stars(val), 430, y);
      y += 43;
    }
    y += 18;

    ctx.fillStyle = '#315a50';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('我的重新思考', 120, y);
    y += 48;

    ctx.fillStyle = '#26312d';
    ctx.font = '28px sans-serif';
    y = wrapCanvasText(ctx, reflectionChoiceLabel(), 120, y, 830, 42, 3) + 18;
    const reflection = (state.reflection.text || '').trim() || '下一次遇到類似情境，我會先停一下，聽聽學生怎麼想。';
    y = wrapCanvasText(ctx, `我想提醒自己：${reflection}`, 120, y, 830, 42, 5) + 30;

    ctx.fillStyle = '#dbe8e3';
    ctx.beginPath();
    ctx.roundRect(110, y, 860, 180, 18);
    ctx.fill();
    ctx.fillStyle = '#26312d';
    ctx.font = 'bold 28px sans-serif';
    wrapCanvasText(ctx, '好的融合教師，不是永遠第一次就做出完美決定的人，而是在學生的聲音出現後，願意重新理解、重新調整的人。', 140, y + 48, 800, 40, 4);

    ctx.fillStyle = '#68736d';
    ctx.font = '24px sans-serif';
    ctx.fillText('遊戲設計與內容策劃｜國家教育研究院 黃彥融副研究員', 120, 1510);

    const link = document.createElement('a');
    link.download = '我的教師成長紀錄.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function restartGame() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (state.mode === 'research' && !state.research.submitted && !state.research.declined) {
      state.research.restartCount += 1;
      resetRunState();
      setFooter(`研究模式｜已重新挑戰 ${state.research.restartCount} 次｜資料尚未提交`);
      showPrologue();
      return;
    }

    resetRunState();
    state.mode = null;
    state.research = {
      consented: false,
      profile: emptyResearchProfile(),
      startTime: null,
      completionTime: 0,
      restartCount: 0,
      submitted: false,
      declined: false
    };
    showCover();
  }

  updateDayTrack(-1, false);
  showCover();
})();
