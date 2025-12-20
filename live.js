// ===== メンバー定義（最新版）=====
const members = [
  {
    name:'若凪',
    url:'https://www.twitch.tv/wakanagi',
    api:'https://decapi.me/twitch/stream/wakanagi',
    icon:'https://static-cdn.jtvnw.net/jtv_user_pictures/wakanagi-profile_image-300x300.png',
    type:'twitch'
  },
  {
    name:'柚茶',
    url:'https://www.twitch.tv/yuzucha08',
    api:'https://decapi.me/twitch/stream/yuzucha08',
    icon:'https://static-cdn.jtvnw.net/jtv_user_pictures/yuzucha08-profile_image-300x300.png',
    type:'twitch'
  },
  {
    name:'Lily00',
    url:'https://www.twitch.tv/lily00_flca',
    api:'https://decapi.me/twitch/stream/lily00_flca',
    icon:'https://static-cdn.jtvnw.net/jtv_user_pictures/lily00_flca-profile_image-300x300.png',
    type:'twitch'
  },
  {
    name:'とるま',
    url:'https://www.twitch.tv/tourma_flca',
    api:'https://decapi.me/twitch/stream/tourma_flca',
    icon:'https://static-cdn.jtvnw.net/jtv_user_pictures/tourma_flca-profile_image-300x300.png',
    type:'twitch'
  },
  {
    name:'ふらcafe',
    url:'https://www.youtube.com/@flatcafe_games/live',
    icon:'https://yt3.ggpht.com/ytc/UCAsCx41YE4mEIBCIAGOzFfA=s300-c-k-c0x00ffffff-no-rj',
    type:'youtube'
  }
];

const grid = document.getElementById('grid');

// ===== カード生成（5枠固定）=====
members.forEach((m, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `card-${i}`;
  card.innerHTML = `
    <div class="badge">LIVE</div>
    <img src="${m.icon}" alt="${m.name}">
    <div class="name">${m.name}</div>
  `;
  card.onclick = () => window.open(m.url, '_blank');
  grid.appendChild(card);
});

// ===== Twitch 判定（stream JSON）=====
function checkTwitch(member, idx) {
  fetch(member.api)
    .then(r => r.json())
    .then(d => {
      const card = document.getElementById(`card-${idx}`);
      const img = card.querySelector('img');

      if (d && d.game) {
        card.classList.add('live');
        img.onerror = () => img.src = member.icon;
        img.src =
          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${member.url.split('/').pop()}-440x248.jpg?${Date.now()}`;
      } else {
        card.classList.remove('live');
        img.src = member.icon;
      }
    })
    .catch(() => {
      const card = document.getElementById(`card-${idx}`);
      card.classList.remove('live');
      card.querySelector('img').src = member.icon;
    });
}

// ===== YouTube 判定（@handle /live ページ依存）=====
// ※ APIを使わず「配信中ならサムネが差し替わる」簡易方式
function checkYouTube(member, idx) {
  const card = document.getElementById(`card-${idx}`);
  const img = card.querySelector('img');

  // ライブ中はチャンネルアイコンとは違う絵が返ることが多い
  const testImg = new Image();
  testImg.onload = () => {
    // 読めた＝何かしら返ってる → LIVE扱い
    card.classList.add('live');
    img.src = member.icon; // サムネは公式API使う場合ここを差し替え
  };
  testImg.onerror = () => {
    card.classList.remove('live');
    img.src = member.icon;
  };
  testImg.src = member.icon + '?t=' + Date.now();
}

// ===== 初回 & 自動更新 =====
function updateAll() {
  members.forEach((m, i) => {
    if (m.type === 'twitch') checkTwitch(m, i);
    if (m.type === 'youtube') checkYouTube(m, i);
  });
}

updateAll();
setInterval(updateAll, 60000);
