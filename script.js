/**
 * GUESS THE SONG – ĐOÁN TÊN BÀI HÁT
 * Logic chính của trò chơi (Tương thích hoàn toàn GitHub Pages & mở trực tiếp trên máy)
 */

// Danh sách dự phòng (dùng khi mở trực tiếp bằng file:// trên máy không có web server)
// Khi chạy trên GitHub Pages, website sẽ tự động tải dữ liệu mới nhất từ ./songs.json
const FALLBACK_SONGS = [
  {
    "id": 1,
    "file": "videos/song_01.mp4",
    "title": "Bài hát #01 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 2,
    "file": "videos/song_02.mp4",
    "title": "Bài hát #02 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 3,
    "file": "videos/song_03.mp4",
    "title": "Bài hát #03 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 4,
    "file": "videos/song_04.mp4",
    "title": "Bài hát #04 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 5,
    "file": "videos/song_05.mp4",
    "title": "Bài hát #05 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 6,
    "file": "videos/song_06.mp4",
    "title": "Bài hát #06 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 7,
    "file": "videos/song_07.mp4",
    "title": "Bài hát #07 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 8,
    "file": "videos/song_08.mp4",
    "title": "Bài hát #08 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  },
  {
    "id": 9,
    "file": "videos/song_09.mp4",
    "title": "Bài hát #09 (Chưa cập nhật tên – Nhấn 'Sửa tên bài hát' hoặc chỉnh songs.json)",
    "artist": ""
  }
];

const STORAGE_KEY = "guess_the_song_custom_titles_ghpages_v1";

// Trạng thái toàn cục của trò chơi
const state = {
  baseSongs: [],
  songs: [],
  playOrder: [],
  currentIndex: 0,
  gameState: "READY", // READY | PLAYING | GUESS_TIME | ANSWER_REVEALED | CONTINUING | SONG_COMPLETED
  snippetDuration: 12,
  audioOnly: false,
  isShuffled: false,
  isRevealed: false,
  completedIds: new Set(),
  rafId: null
};

// Tham chiếu các phần tử DOM
const el = {
  songCounter: document.getElementById("songCounter"),
  toggleSettingsBtn: document.getElementById("toggleSettingsBtn"),
  settingsPanel: document.getElementById("settingsPanel"),
  durationSelector: document.getElementById("durationSelector"),
  modeSelector: document.getElementById("modeSelector"),
  orderSelector: document.getElementById("orderSelector"),
  completedStats: document.getElementById("completedStats"),
  openEditorBtn: document.getElementById("openEditorBtn"),
  restartQuickBtn: document.getElementById("restartQuickBtn"),
  gameCard: document.getElementById("gameCard"),
  statusBadge: document.getElementById("statusBadge"),
  statusText: document.getElementById("statusText"),
  snippetTargetLabel: document.getElementById("snippetTargetLabel"),
  mediaStage: document.getElementById("mediaStage"),
  videoPlayer: document.getElementById("videoPlayer"),
  vinylDisc: document.getElementById("vinylDisc"),
  eqBars: document.getElementById("eqBars"),
  stageBanner: document.getElementById("stageBanner"),
  mediaErrorOverlay: document.getElementById("mediaErrorOverlay"),
  retryLoadBtn: document.getElementById("retryLoadBtn"),
  skipBrokenBtn: document.getElementById("skipBrokenBtn"),
  currentTimeLabel: document.getElementById("currentTimeLabel"),
  durationLabel: document.getElementById("durationLabel"),
  snippetZone: document.getElementById("snippetZone"),
  progressFill: document.getElementById("progressFill"),
  answerBox: document.getElementById("answerBox"),
  answerPlaceholder: document.getElementById("answerPlaceholder"),
  answerContent: document.getElementById("answerContent"),
  answerTitle: document.getElementById("answerTitle"),
  answerArtist: document.getElementById("answerArtist"),
  btnStart: document.getElementById("btnStart"),
  btnReveal: document.getElementById("btnReveal"),
  btnContinue: document.getElementById("btnContinue"),
  btnNext: document.getElementById("btnNext"),
  completionCard: document.getElementById("completionCard"),
  completionSummary: document.getElementById("completionSummary"),
  btnReplayOriginal: document.getElementById("btnReplayOriginal"),
  btnReplayShuffle: document.getElementById("btnReplayShuffle"),
  editorModal: document.getElementById("editorModal"),
  editorList: document.getElementById("editorList"),
  closeEditorBtn: document.getElementById("closeEditorBtn"),
  saveTitlesBtn: document.getElementById("saveTitlesBtn"),
  resetTitlesBtn: document.getElementById("resetTitlesBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  toast: document.getElementById("toast")
};

const STATUS_LABELS = {
  READY: "READY – Sẵn sàng",
  PLAYING: "PLAYING – Đang phát đoạn nhạc",
  GUESS_TIME: "GUESS TIME – Thời gian đoán",
  ANSWER_REVEALED: "ANSWER REVEALED – Đã hiện đáp án",
  CONTINUING: "CONTINUING – Đang phát phần còn lại",
  SONG_COMPLETED: "SONG COMPLETED – Bài hát hoàn thành"
};

function showToast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  clearTimeout(el.toast._timer);
  el.toast._timer = setTimeout(() => el.toast.classList.remove("show"), 3200);
}

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isPlaceholderTitle(title) {
  return typeof title === "string" && title.includes("Chưa cập nhật tên");
}

function normalizeRelativePath(filePath) {
  const clean = String(filePath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  return clean.startsWith("./") ? clean : `./${clean}`;
}

async function fetchSongsFromJson() {
  try {
    const response = await fetch("./songs.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, idx) => ({
        id: item.id ?? idx + 1,
        file: String(item.file || "").replace(/\\/g, "/").replace(/^\/+/, ""),
        title: (item.title || `Bài hát #${String(idx + 1).padStart(2, "0")}`).trim(),
        artist: (item.artist || "").trim()
      }));
    }
  } catch (err) {
    console.info("Sử dụng danh sách bài hát dự phòng nội bộ:", err.message);
  }
  return FALLBACK_SONGS.map(s => ({ ...s }));
}

function mergeLocalOverrides(baseList) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseList.map(s => ({ ...s }));
    const savedMap = JSON.parse(raw);
    if (!savedMap || typeof savedMap !== "object") return baseList.map(s => ({ ...s }));

    return baseList.map(song => {
      const custom = savedMap[song.file];
      if (custom && custom.title && !isPlaceholderTitle(custom.title)) {
        return {
          ...song,
          title: custom.title.trim(),
          artist: (custom.artist || "").trim()
        };
      }
      return { ...song };
    });
  } catch (e) {
    console.warn("Không đọc được dữ liệu lưu cục bộ:", e);
    return baseList.map(s => ({ ...s }));
  }
}

function buildPlayOrder(shuffle) {
  const indices = state.songs.map((_, i) => i);
  if (shuffle) {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
  return indices;
}

function getCurrentSong() {
  const songIdx = state.playOrder[state.currentIndex];
  return state.songs[songIdx];
}

function setVisualPlaying(isPlaying) {
  if (isPlaying) {
    el.vinylDisc.classList.add("spinning");
    el.eqBars.classList.add("active");
  } else {
    el.vinylDisc.classList.remove("spinning");
    el.eqBars.classList.remove("active");
  }
}

function updateStatus(newState) {
  state.gameState = newState;
  el.statusBadge.className = `status-badge status-${newState}`;
  el.statusText.textContent = STATUS_LABELS[newState] || newState;

  el.stageBanner.classList.remove("visible", "completed-banner");
  if (newState === "GUESS_TIME") {
    el.stageBanner.textContent = "HẾT THỜI GIAN NGHE – BẠN ĐOÁN ĐƯỢC CHƯA?";
    el.stageBanner.classList.add("visible");
  } else if (newState === "SONG_COMPLETED") {
    el.stageBanner.textContent = "BÀI HÁT ĐÃ KẾT THÚC";
    el.stageBanner.classList.add("visible", "completed-banner");
  }

  el.btnReveal.classList.remove("pulse-hint");

  switch (newState) {
    case "READY":
      el.btnStart.disabled = false;
      el.btnStart.innerHTML = "▶ BẮT ĐẦU";
      el.btnReveal.disabled = true;
      el.btnContinue.disabled = true;
      el.btnNext.disabled = true;
      break;

    case "PLAYING":
      el.btnStart.disabled = true;
      el.btnReveal.disabled = false;
      el.btnContinue.disabled = true;
      el.btnNext.disabled = true;
      break;

    case "GUESS_TIME":
      el.btnStart.disabled = true;
      el.btnReveal.disabled = false;
      el.btnReveal.classList.add("pulse-hint");
      el.btnContinue.disabled = false;
      el.btnNext.disabled = false;
      break;

    case "ANSWER_REVEALED":
      el.btnStart.disabled = true;
      el.btnReveal.disabled = true;
      el.btnContinue.disabled = el.videoPlayer.ended;
      el.btnNext.disabled = false;
      break;

    case "CONTINUING":
      el.btnStart.disabled = true;
      el.btnReveal.disabled = state.isRevealed;
      el.btnContinue.disabled = true;
      el.btnNext.disabled = false;
      break;

    case "SONG_COMPLETED":
      el.btnStart.disabled = true;
      el.btnReveal.disabled = state.isRevealed;
      el.btnContinue.disabled = true;
      el.btnNext.disabled = false;
      break;
  }

  const isLast = state.currentIndex >= state.playOrder.length - 1;
  el.btnNext.innerHTML = isLast ? "🏁 HOÀN THÀNH" : "⏭ BÀI TIẾP THEO";
}

function updateProgressUI() {
  const v = el.videoPlayer;
  const dur = v.duration || 0;
  const cur = v.currentTime || 0;
  el.currentTimeLabel.textContent = formatTime(cur);
  el.durationLabel.textContent = formatTime(dur);

  if (dur > 0) {
    const pct = Math.min(100, (cur / dur) * 100);
    el.progressFill.style.width = `${pct}%`;
    const snippetPct = Math.min(100, (state.snippetDuration / dur) * 100);
    el.snippetZone.style.width = `${snippetPct}%`;
  } else {
    el.progressFill.style.width = "0%";
    el.snippetZone.style.width = "0%";
  }
}

function stopPlaybackLoop() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function startPlaybackLoop() {
  stopPlaybackLoop();
  const tick = () => {
    const v = el.videoPlayer;
    updateProgressUI();

    if (state.gameState === "PLAYING" && !v.paused && !v.ended) {
      const maxStop = v.duration
        ? Math.min(state.snippetDuration, Math.max(1, v.duration - 0.15))
        : state.snippetDuration;
      if (v.currentTime >= maxStop) {
        v.pause();
        v.currentTime = maxStop;
        setVisualPlaying(false);
        updateProgressUI();
        updateStatus("GUESS_TIME");
        return;
      }
    }

    if (!v.paused && !v.ended) {
      state.rafId = requestAnimationFrame(tick);
    }
  };
  state.rafId = requestAnimationFrame(tick);
}

function loadTrack(index) {
  // Dừng hoàn toàn bài trước để không bao giờ phát chồng âm thanh
  stopPlaybackLoop();
  const v = el.videoPlayer;
  v.pause();
  setVisualPlaying(false);
  v.removeAttribute("src");
  v.load();

  state.currentIndex = index;
  state.isRevealed = false;

  const song = getCurrentSong();
  const total = state.playOrder.length;
  el.songCounter.textContent = `SONG ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  // Ẩn đáp án cho vòng mới
  el.answerBox.classList.remove("revealed");
  el.answerPlaceholder.style.display = "flex";
  el.answerContent.style.display = "none";
  el.answerTitle.textContent = song.title;
  el.answerArtist.textContent = song.artist ? `Nghệ sĩ: ${song.artist}` : "";

  el.mediaErrorOverlay.classList.remove("visible");

  // Nạp nguồn video theo đường dẫn tương đối (tương thích username.github.io/repo-name/)
  v.src = normalizeRelativePath(song.file);
  v.load();

  updateProgressUI();
  updateStatus("READY");
}

function revealAnswer() {
  if (state.isRevealed) return;
  const song = getCurrentSong();
  state.isRevealed = true;
  el.answerTitle.textContent = song.title;
  el.answerArtist.textContent = song.artist ? `Nghệ sĩ: ${song.artist}` : "";
  el.answerPlaceholder.style.display = "none";
  el.answerContent.style.display = "block";
  el.answerBox.classList.add("revealed");

  if (state.gameState === "GUESS_TIME") {
    updateStatus("ANSWER_REVEALED");
  } else {
    el.btnReveal.disabled = true;
    el.btnReveal.classList.remove("pulse-hint");
  }
}

async function startSnippet() {
  const v = el.videoPlayer;
  el.btnStart.disabled = true;
  try {
    if (v.readyState === 0) {
      v.load();
    }
    v.currentTime = 0;
    await v.play();
    setVisualPlaying(true);
    updateStatus("PLAYING");
    startPlaybackLoop();
  } catch (err) {
    console.error("Playback error:", err);
    el.btnStart.disabled = false;
    showToast("Không thể phát video. Vui lòng thử nhấn lại nút BẮT ĐẦU.");
  }
}

async function continueSong() {
  const v = el.videoPlayer;
  if (v.ended) return;
  el.btnContinue.disabled = true;
  try {
    await v.play();
    setVisualPlaying(true);
    updateStatus("CONTINUING");
    startPlaybackLoop();
  } catch (err) {
    console.error("Continue error:", err);
    el.btnContinue.disabled = false;
    showToast("Lỗi khi tiếp tục phát video.");
  }
}

function goNextSong() {
  const currentSong = getCurrentSong();
  state.completedIds.add(currentSong.id);
  updateCompletedStats();

  if (state.currentIndex + 1 < state.playOrder.length) {
    loadTrack(state.currentIndex + 1);
  } else {
    stopPlaybackLoop();
    el.videoPlayer.pause();
    setVisualPlaying(false);
    el.gameCard.style.display = "none";
    el.completionCard.classList.add("visible");
    el.completionSummary.textContent =
      `Bạn đã hoàn thành ${state.completedIds.size} / ${state.songs.length} bài hát. Chọn chơi lại từ đầu hoặc xáo trộn thứ tự để tiếp tục giải trí!`;
  }
}

function resetGame(shuffle = state.isShuffled) {
  state.isShuffled = shuffle;
  state.completedIds.clear();
  updateCompletedStats();

  el.orderSelector.querySelectorAll(".seg-btn").forEach(btn => {
    btn.classList.toggle("active", (btn.dataset.order === "shuffle") === shuffle);
  });

  state.playOrder = buildPlayOrder(shuffle);
  el.completionCard.classList.remove("visible");
  el.gameCard.style.display = "flex";
  loadTrack(0);
}

function updateCompletedStats() {
  el.completedStats.textContent = `Đã hoàn thành: ${state.completedIds.size} / ${state.songs.length} bài`;
  el.openEditorBtn.textContent = `✏️ Sửa tên bài hát (${state.songs.length} bài)`;
}

// Sự kiện trình phát Video
el.videoPlayer.addEventListener("loadedmetadata", () => {
  el.mediaErrorOverlay.classList.remove("visible");
  updateProgressUI();
});

el.videoPlayer.addEventListener("timeupdate", () => {
  updateProgressUI();
});

el.videoPlayer.addEventListener("ended", () => {
  stopPlaybackLoop();
  setVisualPlaying(false);
  updateProgressUI();
  const song = getCurrentSong();
  state.completedIds.add(song.id);
  updateCompletedStats();
  updateStatus("SONG_COMPLETED");
});

el.videoPlayer.addEventListener("error", () => {
  // Bỏ qua sự kiện error trống khi vừa removeAttribute("src") lúc chuyển bài
  if (!el.videoPlayer.getAttribute("src")) return;
  stopPlaybackLoop();
  setVisualPlaying(false);
  el.mediaErrorOverlay.classList.add("visible");
  el.btnStart.disabled = true;
  el.btnNext.disabled = false;
});

// Nút điều khiển chính
el.btnStart.addEventListener("click", startSnippet);
el.btnReveal.addEventListener("click", revealAnswer);
el.btnContinue.addEventListener("click", continueSong);
el.btnNext.addEventListener("click", goNextSong);
el.skipBrokenBtn.addEventListener("click", goNextSong);
el.retryLoadBtn.addEventListener("click", () => loadTrack(state.currentIndex));

// Khu vực cài đặt
el.toggleSettingsBtn.addEventListener("click", () => {
  const open = el.settingsPanel.classList.toggle("open");
  el.toggleSettingsBtn.classList.toggle("active", open);
});

el.durationSelector.addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  state.snippetDuration = Number(btn.dataset.sec);
  el.snippetTargetLabel.textContent = `${state.snippetDuration}s`;
  el.durationSelector.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  updateProgressUI();
  showToast(`Đã đặt thời gian nghe đoán: ${state.snippetDuration} giây`);
});

el.modeSelector.addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  state.audioOnly = btn.dataset.mode === "audio";
  el.mediaStage.classList.toggle("audio-only", state.audioOnly);
  el.modeSelector.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  showToast(state.audioOnly ? "Đã bật chế độ Chỉ nghe nhạc" : "Đã bật hiển thị Video + Nhạc");
});

el.orderSelector.addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  const shuffle = btn.dataset.order === "shuffle";
  resetGame(shuffle);
  showToast(shuffle ? "Đã xáo trộn thứ tự bài hát!" : "Đã chuyển về thứ tự gốc!");
});

el.restartQuickBtn.addEventListener("click", () => {
  resetGame(state.isShuffled);
  showToast("Đã đặt lại trò chơi từ đầu!");
});

el.btnReplayOriginal.addEventListener("click", () => resetGame(false));
el.btnReplayShuffle.addEventListener("click", () => resetGame(true));

// Trình chỉnh sửa đáp án bài hát (xuất trực tiếp songs.json cho GitHub Pages)
function renderEditorRows() {
  const note = el.editorList.querySelector(".modal-note");
  el.editorList.innerHTML = "";
  if (note) el.editorList.appendChild(note);

  state.songs.forEach((song, idx) => {
    const row = document.createElement("div");
    row.className = "track-edit-row";
    const placeholder = isPlaceholderTitle(song.title);
    const shortFile = song.file.split("/").pop();
    row.innerHTML = `
      <div class="track-num">
        #${String(idx + 1).padStart(2, "0")}
        <small>${escapeHtml(shortFile)}</small>
      </div>
      <input
        type="text"
        class="track-input title-input"
        data-idx="${idx}"
        placeholder="Nhập tên bài hát #${String(idx + 1).padStart(2, "0")}..."
        value="${placeholder ? "" : escapeHtml(song.title)}"
      />
      <input
        type="text"
        class="track-input artist-input"
        data-idx="${idx}"
        placeholder="Ca sĩ / Nghệ sĩ (tùy chọn)"
        value="${escapeHtml(song.artist || "")}"
      />
    `;
    el.editorList.appendChild(row);
  });
}

function collectEditorInputsToState() {
  const titleInputs = el.editorList.querySelectorAll(".title-input");
  const artistInputs = el.editorList.querySelectorAll(".artist-input");
  const overrides = {};

  titleInputs.forEach((inp, idx) => {
    const val = inp.value.trim();
    const artistVal = artistInputs[idx].value.trim();
    state.songs[idx].title = val || state.baseSongs[idx].title;
    state.songs[idx].artist = artistVal;
    if (val) {
      overrides[state.songs[idx].file] = { title: val, artist: artistVal };
    }
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.warn("Không thể lưu vào localStorage:", e);
  }

  const cur = getCurrentSong();
  if (cur) {
    el.answerTitle.textContent = cur.title;
    el.answerArtist.textContent = cur.artist ? `Nghệ sĩ: ${cur.artist}` : "";
  }
}

el.openEditorBtn.addEventListener("click", () => {
  renderEditorRows();
  el.editorModal.classList.add("open");
});

el.closeEditorBtn.addEventListener("click", () => {
  el.editorModal.classList.remove("open");
});

el.editorModal.addEventListener("click", (e) => {
  if (e.target === el.editorModal) {
    el.editorModal.classList.remove("open");
  }
});

el.saveTitlesBtn.addEventListener("click", () => {
  collectEditorInputsToState();
  el.editorModal.classList.remove("open");
  showToast("Đã lưu đáp án trên trình duyệt hiện tại!");
});

el.resetTitlesBtn.addEventListener("click", () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn(e);
  }
  state.songs = state.baseSongs.map(s => ({ ...s }));
  renderEditorRows();
  const cur = getCurrentSong();
  if (cur) {
    el.answerTitle.textContent = cur.title;
    el.answerArtist.textContent = cur.artist ? `Nghệ sĩ: ${cur.artist}` : "";
  }
  showToast("Đã khôi phục danh sách gốc từ songs.json.");
});

el.exportJsonBtn.addEventListener("click", () => {
  collectEditorInputsToState();
  const jsonText = JSON.stringify(state.songs, null, 2) + "\n";
  const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "songs.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Đã tải songs.json — Hãy upload file này lên GitHub để cập nhật cho mọi người!");
});

// Phím tắt điều khiển nhanh (Space: Phát/Nghe tiếp, R: Hiện đáp án, N: Bài tiếp theo)
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (el.editorModal.classList.contains("open")) {
    if (e.key === "Escape") el.editorModal.classList.remove("open");
    return;
  }

  if (e.code === "Space") {
    e.preventDefault();
    if (!el.btnStart.disabled) startSnippet();
    else if (!el.btnContinue.disabled) continueSong();
  } else if (e.key.toLowerCase() === "r") {
    if (!el.btnReveal.disabled) revealAnswer();
  } else if (e.key.toLowerCase() === "n") {
    if (!el.btnNext.disabled) goNextSong();
  }
});

// Khởi chạy ứng dụng
async function init() {
  state.baseSongs = await fetchSongsFromJson();
  state.songs = mergeLocalOverrides(state.baseSongs);
  state.playOrder = buildPlayOrder(false);
  updateCompletedStats();
  loadTrack(0);
}

init();
