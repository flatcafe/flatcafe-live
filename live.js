// ===== 設定 =====
const YT_API_KEY = "ここにYouTube APIキー";
const YT_CHANNEL_ID = "ここにYouTubeチャンネルID";
const TWITCH_NAME = "twitchユーザー名"; // 例: flatcafe

// ===== YouTube =====
function checkYouTube() {
  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YT_CHANNEL_ID}&eventType=live&type=video&key=${YT_API_KEY}`
  )
  .then(r => r.json())
  .then(d => {
    const box = document.getElementById("ytBox");
    if (d.items && d.items.length > 0) {
      const v = d.items[0];
      document.getElementById("ytThumb").src = v.snippet.thumbnails.high.url;
      document.getElementById("ytThumb").onclick =
        () => location.href = `https://www.youtube.com/watch?v=${v.id.videoId}`;
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  });
}

// ===== Twitch（DecAPI）=====
function checkTwitch() {
  fetch(`https://decapi.me/twitch/uptime/${TWITCH_NAME}`)
    .then(r => r.text())
    .then(t => {
      const box = document.getElementById("twBox");
      if (!t.includes("offline")) {
        document.getElementById("twThumb").src =
          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${TWITCH_NAME}-440x248.jpg?${Date.now()}`;
        document.getElementById("twThumb").onclick =
          () => location.href = `https://www.twitch.tv/${TWITCH_NAME}`;
        box.style.display = "block";
      } else {
        box.style.display = "none";
      }
    });
}

// ===== 初回＋自動更新 =====
checkYouTube();
checkTwitch();
setInterval(() => {
  checkYouTube();
  checkTwitch();
}, 60000);
