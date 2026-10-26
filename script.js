(() => {
  const $ = (id) => document.getElementById(id);
  const toast = $('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToElement = (element) => element.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });

  // Initial state: only the diary cover is visible.
  const diaryContent = $('diaryContent');
  const topbarNav = document.querySelector('.topbar nav');
  const musicMini = $('musicMini');
  document.body.classList.add('cover-only');
  if (diaryContent) diaryContent.hidden = true;
  if (topbarNav) topbarNav.setAttribute('aria-hidden', 'true');
  if (musicMini) musicMini.setAttribute('aria-hidden', 'true');

  $('openBook').addEventListener('click', () => {
    document.body.classList.remove('cover-only');
    document.body.classList.add('opening-diary');
    if (topbarNav) topbarNav.removeAttribute('aria-hidden');
    if (musicMini) musicMini.removeAttribute('aria-hidden');
    diaryContent.hidden = false;
    requestAnimationFrame(() => diaryContent.classList.add('diary-open'));
    setTimeout(() => {
      document.body.classList.remove('opening-diary');
      scrollToElement($('time'));
    }, reducedMotion() ? 0 : 500);
  });

  $('backCover').addEventListener('click', () => {
    diaryContent.classList.remove('diary-open');
    diaryContent.hidden = true;
    document.body.classList.remove('opening-diary');
    document.body.classList.add('cover-only');
    if (topbarNav) topbarNav.setAttribute('aria-hidden', 'true');
    if (musicMini) musicMini.setAttribute('aria-hidden', 'true');
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  });

  $('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  });

  // Calendar-aware elapsed time from the relationship start date (Vietnam time).
  function updateCounter() {
    const start = new Date('2026-04-30T00:00:00+07:00').getTime();
    const elapsed = Math.max(0, Date.now() - start);
    const day = 86400000, hour = 3600000, minute = 60000;
    $('days').textContent = Math.floor(elapsed / day).toLocaleString('vi-VN');
    $('hours').textContent = String(Math.floor((elapsed % day) / hour)).padStart(2, '0');
    $('minutes').textContent = String(Math.floor((elapsed % hour) / minute)).padStart(2, '0');
    $('seconds').textContent = String(Math.floor((elapsed % minute) / 1000)).padStart(2, '0');
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  // Music player.
  const audio = $('audio'), playButton = $('playButton'), vinyl = $('vinyl');
  const progress = $('progress'), volume = $('volume');
  const currentTime = $('currentTime'), duration = $('duration'), audioStatus = $('audioStatus');
  const floatingPlay = $('floatingPlay'), floatingVolume = $('floatingVolume'), floatingMute = $('floatingMute'), floatingResize = $('floatingResize');
  const floatingVolumeValue = $('floatingVolumeValue'), floatingStatus = $('floatingStatus');
  // Start in the compact two-button mode; the user can expand it at any time.
  const floatingPlayer = $('floatingMusic');
  floatingPlayer.classList.add('is-compact');
  audio.volume = Number(volume.value);
  let previousVolume = audio.volume || 0.75;
  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  }
  function syncPlayState() {
    const playing = !audio.paused;
    playButton.innerHTML = playing ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'; 
    playButton.setAttribute('aria-label', playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
    vinyl.classList.toggle('playing', playing);
    musicMini.innerHTML = playing ? 'Ⅱ <span>Music</span>' : '♫ <span>Music</span>';
    floatingPlay.innerHTML = playing ? '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z"/></svg>' : '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    floatingPlay.setAttribute('aria-label', playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
    floatingStatus.textContent = playing ? 'Đang phát nhạc ♡' : (audio.error ? 'Không tải được nhạc' : 'Nhạc đang tạm dừng');
  }
  async function toggleAudio() {
    if (!audio.paused) { audio.pause(); return; }
    try {
      await audio.play();
      audioStatus.textContent = 'Đang phát: Từ thích thích thành thương thương';
      floatingStatus.textContent = 'Đang phát nhạc ♡';
    } catch (err) {
      audioStatus.textContent = 'Chưa phát được nhạc. Hãy kiểm tra kết nối, đường dẫn file MP3 hoặc thử tải lại trang.';
      floatingStatus.textContent = 'Trình duyệt chặn tự phát — chạm ▶ để nghe';
      showToast('Trình duyệt có thể chặn tự phát. Hãy chạm nút ▶ để nghe nhạc.');
    }
  }
  playButton.addEventListener('click', toggleAudio);
  musicMini.addEventListener('click', toggleAudio);
  floatingPlay.addEventListener('click', toggleAudio);
  if (floatingResize) floatingResize.addEventListener('click', () => {
    const player = document.getElementById('floatingMusic');
    const compact = player.classList.toggle('is-compact');
    floatingResize.setAttribute('aria-label', compact ? 'Mở rộng trình phát nhạc' : 'Thu gọn trình phát nhạc');
    floatingResize.title = compact ? 'Mở rộng trình phát nhạc' : 'Thu gọn trình phát nhạc';
    floatingResize.innerHTML = compact
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 12h6M12 9v6"/></svg>';
  });
  audio.addEventListener('play', syncPlayState);
  audio.addEventListener('pause', syncPlayState);
  function syncDuration() {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      duration.textContent = formatTime(audio.duration);
      progress.max = audio.duration;
    } else { duration.textContent = '0:00'; }
  }
  audio.addEventListener('loadedmetadata', syncDuration);
  audio.addEventListener('durationchange', syncDuration);
  audio.addEventListener('canplay', syncDuration);
  audio.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) { duration.textContent = formatTime(audio.duration); progress.max = audio.duration; progress.value = audio.currentTime; }
  });
  progress.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(progress.value); });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value); floatingVolume.value = volume.value; floatingVolumeValue.textContent = Math.round(audio.volume * 100) + '%'; if (audio.volume > 0) { previousVolume = audio.volume; floatingMute.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4z"/></svg>'; floatingMute.setAttribute('aria-label','Tắt tiếng'); } });
  floatingVolume.addEventListener('input', () => { audio.volume = Number(floatingVolume.value); volume.value = floatingVolume.value; floatingVolumeValue.textContent = Math.round(audio.volume * 100) + '%'; if (audio.volume > 0) previousVolume = audio.volume; floatingMute.innerHTML = audio.volume === 0 ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4zm12 0 5 5m0-5-5 5"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4z"/></svg>'; floatingMute.setAttribute('aria-label', audio.volume === 0 ? 'Bật tiếng' : 'Tắt tiếng'); });
  floatingMute.addEventListener('click', () => { if (audio.volume > 0) { previousVolume = audio.volume; audio.volume = 0; } else { audio.volume = previousVolume || 0.75; } volume.value = floatingVolume.value = String(audio.volume); floatingVolumeValue.textContent = Math.round(audio.volume * 100) + '%'; floatingMute.innerHTML = audio.volume === 0 ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4zm12 0 5 5m0-5-5 5"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4z"/></svg>'; floatingMute.setAttribute('aria-label', audio.volume === 0 ? 'Bật tiếng' : 'Tắt tiếng'); });
  // Try audible autoplay on first load. Browsers may reject it until a user gesture.
  window.addEventListener('load', () => { audio.play().then(() => { floatingStatus.textContent = 'Đang phát nhạc ♡'; }).catch(() => { floatingStatus.textContent = 'Chạm ▶ để bắt đầu phát nhạc'; }); }, { once: true });
  audio.addEventListener('error', () => {
    audioStatus.textContent = 'Không tải được nhạc. Kiểm tra assets/music/our-song.mp3 và file dự phòng M4A.';
    floatingStatus.textContent = 'Không tải được nhạc — kiểm tra đường dẫn file';
  });

  // Six messages are selected uniformly at random; repeats are intentionally allowed.
  const notes = [
    'Cứ quấn lấy anh đi. Anh không cần khoảng cách, anh chỉ cần em.',
    'Nhắn cho anh mỗi khi em nhớ anh, dù là cứ năm phút một lần cũng được.',
    'Kể anh nghe về một ngày của em đi, những chuyện nhỏ nhặt, cả những chuyện chẳng có gì đặc biệt. Anh muốn biết tất cả.',
    'Anh không bao giờ thấy chán em. Anh yêu cách em cứ luôn ở thật gần anh.',
    'Anh tự hào về em mỗi ngày, bởi vì em là một trong những người mạnh mẽ nhất mà anh từng biết, với một trái tim đẹp đẽ nhất.',
    'Anh sẽ luôn ở đây bên em, nhưng nếu có lúc em không ổn, xin hãy nói với anh nhé.'
  ];
  const noteCard = $('randomNoteCard');
  let lastNoteIndex = -1;
  $('drawNote').addEventListener('click', () => {
    let index = Math.floor(Math.random() * notes.length);
    // Randomness is retained while avoiding an identical immediate repeat when possible.
    if (notes.length > 1 && index === lastNoteIndex) index = (index + 1 + Math.floor(Math.random() * (notes.length - 1))) % notes.length;
    lastNoteIndex = index;
    noteCard.classList.add('note-changing');
    setTimeout(() => {
      $('randomNoteText').textContent = notes[index];
      $('randomNoteNumber').textContent = `♡ / ${String(index + 1).padStart(2, '0')}`;
      noteCard.classList.remove('note-changing');
    }, reducedMotion() ? 0 : 180);
  });

  $('revealFinal').addEventListener('click', () => {
    const finalMessage = $('finalMessage');
    const willShow = finalMessage.hidden;
    finalMessage.hidden = !willShow;
    $('revealFinal').textContent = willShow ? 'Ẩn lời cuối cùng' : 'Mở lời cuối cùng của anh ♡';
    if (willShow) {
      setTimeout(() => scrollToElement(finalMessage), reducedMotion() ? 0 : 80);
    }
  });

  // Cinematic interaction layer: scroll progress, staggered reveals and tiny paper-heart bursts.
  const progressBar = document.querySelector('#scrollProgress span');
  let scrollTicking = false;
  function updateScrollProgress() {
    if (!progressBar) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll))})`;
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Add reveal classes only when motion is supported; content remains readable without JS.
  const motionAllowed = !reducedMotion();
  if (motionAllowed) {
    document.documentElement.classList.add('js-motion-ready');
    document.querySelectorAll('.section > .section-label, .section > h2, .section > .section-copy, .portrait-card, .date-card, .counter-wrap, .letter-paper, .music-player, .random-note-card, .final-note-area, .ending-names, .back-top, .back-cover').forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      if (el.classList.contains('portrait-left') || index % 3 === 1) el.dataset.reveal = 'left';
      else if (el.classList.contains('portrait-right') || index % 3 === 2) el.dataset.reveal = 'right';
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    });
  }
  if ('IntersectionObserver' in window && motionAllowed) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-visible'));
  }

  // Small decorative burst on deliberate actions; capped and removed automatically.
  function paperHeartBurst(origin) {
    if (reducedMotion() || !origin || window.matchMedia('(max-width: 600px)').matches) return;
    const rect = origin.getBoundingClientRect();
    const layer = document.createElement('span');
    layer.className = 'paper-burst';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
    layer.style.top = `${rect.top + rect.height / 2 + window.scrollY}px`;
    const symbols = ['♡', '✧', '·', '♡', '✦', '·'];
    symbols.forEach((symbol, i) => {
      const bit = document.createElement('i');
      bit.textContent = symbol;
      bit.style.setProperty('--burst-angle', `${i * 60 - 25}deg`);
      bit.style.setProperty('--burst-distance', `${24 + (i % 3) * 12}px`);
      bit.style.setProperty('--burst-delay', `${i * 25}ms`);
      layer.appendChild(bit);
    });
    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 1000);
  }
  $('openBook')?.addEventListener('click', (event) => paperHeartBurst(event.currentTarget));
  $('drawNote')?.addEventListener('click', (event) => paperHeartBurst(event.currentTarget));

  // Gentle pointer parallax on desktop only; no scroll listeners or motion on touch devices.
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && motionAllowed) {
    const cover = document.querySelector('.cover');
    const orbitOne = document.querySelector('.ambient-orbit-one');
    const orbitTwo = document.querySelector('.ambient-orbit-two');
    let pointerFrame = 0;
    window.addEventListener('pointermove', (event) => {
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        const x = (event.clientX / Math.max(1, window.innerWidth) - .5) * 2;
        const y = (event.clientY / Math.max(1, window.innerHeight) - .5) * 2;
        if (cover && document.body.classList.contains('cover-only')) cover.style.setProperty('--tilt-x', `${y * -1.1}deg`), cover.style.setProperty('--tilt-y', `${x * 1.1}deg`);
        if (orbitOne) orbitOne.style.translate = `${x * 9}px ${y * 7}px`;
        if (orbitTwo) orbitTwo.style.translate = `${x * -7}px ${y * -6}px`;
        pointerFrame = 0;
      });
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      if (cover) { cover.style.removeProperty('--tilt-x'); cover.style.removeProperty('--tilt-y'); }
    }, { passive: true });
  }

  // Smoothly reveal sections as they enter view, when supported.
  if ('IntersectionObserver' in window && !reducedMotion()) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.section').forEach((section) => observer.observe(section));
  }
})();