const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const revealItems = Array.from(document.querySelectorAll('.reveal'));
const counters = Array.from(document.querySelectorAll('.counter'));
const architectureImage = document.getElementById('architecture-image');
const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightbox-media');
const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
const zoomButtons = Array.from(document.querySelectorAll('[data-action]'));
const demoVideos = Array.from(document.querySelectorAll('video[data-video-src]'));

const getAssetUrl = (assetPath) => new URL(assetPath, window.location.href).href;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

const animateCounters = () => {
  counters.forEach((counter, index) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1400 + index * 120;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.38 }
);

sections.forEach((section) => sectionObserver.observe(section));

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  navLinksContainer?.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinksContainer?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const openLightbox = (src, alt) => {
  // clear previous
  lightboxMedia.innerHTML = '';
  const isVideo = /\.mp4($|\?)/i.test(src) || src.includes('video');
  if (isVideo) {
    const v = document.createElement('video');
    v.controls = true;
    v.autoplay = true;
    v.muted = true; // autoplay-friendly; user can unmute
    v.playsInline = true;
    v.src = src;
    v.style.maxWidth = 'min(1120px, 100%)';
    v.style.maxHeight = '90vh';
    v.setAttribute('aria-label', alt || 'Video preview');
    lightboxMedia.appendChild(v);
    v.play().catch(() => {});
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Preview';
    img.style.maxWidth = 'min(1120px, 100%)';
    img.style.maxHeight = '90vh';
    lightboxMedia.appendChild(img);
  }
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
};

const closeLightbox = () => {
  // If a video is playing, pause and remove
  const v = lightboxMedia.querySelector('video');
  if (v) {
    try { v.pause(); } catch (e) {}
  }
  lightboxMedia.innerHTML = '';
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
};

galleryCards.forEach((card) => {
  card.addEventListener('click', () => {
    openLightbox(card.dataset.image, card.dataset.title || 'Project gallery preview');
  });
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

let zoomLevel = 1;
zoomButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'zoom-in') {
      zoomLevel = Math.min(1.2, zoomLevel + 0.08);
    } else if (action === 'zoom-out') {
      zoomLevel = Math.max(0.86, zoomLevel - 0.08);
      } else {
        openLightbox(architectureImage.src, architectureImage.alt);
        return;
      }
    architectureImage.style.transform = `scale(${zoomLevel})`;
    architectureImage.classList.toggle('zoomed', zoomLevel > 1);
  });
});

architectureImage?.addEventListener('click', () => openLightbox(architectureImage.src, architectureImage.alt));

demoVideos.forEach((video) => {
  const source = video.querySelector('source');
  if (source) {
    source.src = getAssetUrl(video.dataset.videoSrc);
    video.load();
  }
});

// wire architecture overlay video to open in lightbox on click
const archVideo = document.querySelector('.arch-video');
if (archVideo) {
  archVideo.addEventListener('click', (e) => {
    e.stopPropagation();
    const source = archVideo.querySelector('source');
    const src = source && source.src ? source.src : getAssetUrl(archVideo.dataset.videoSrc);
    openLightbox(src, 'Architecture walkthrough');
  });
}

// Enable muted autoplay, looping, and hover interactions for demo videos
demoVideos.forEach((video) => {
  try {
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    // Attempt to play (muted autoplay is allowed in modern browsers)
    video.play().catch(() => {});

    // Keep demos autoplaying/looping like short ad previews; add visual state
    video.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    video.addEventListener('playing', () => video.classList.add('playing'));
    video.addEventListener('pause', () => video.classList.remove('playing'));
  } catch (e) {
    // ignore
  }
});

window.addEventListener('load', () => {
  animateCounters();
});

// Video chrome: wire overlay controls for play/pause, mute, speed, and PiP
const videoCards = Array.from(document.querySelectorAll('.video-card'));
videoCards.forEach((card) => {
  const video = card.querySelector('video');
  if (!video) return;
  const playBtn = card.querySelector('.vc-play');
  const muteBtn = card.querySelector('.vc-mute');
  const speedSel = card.querySelector('.vc-speed');
  const pipBtn = card.querySelector('.vc-pip');

  const updatePlayIcon = () => {
    if (!playBtn) return;
    playBtn.textContent = video.paused ? '▶' : '❚❚';
  };

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) video.play(); else video.pause();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔈' : '🔊';
      if (!video.muted) video.play().catch(() => {});
    });
    // reflect initial state
    muteBtn.textContent = video.muted ? '🔈' : '🔊';
  }

  if (speedSel) {
    speedSel.addEventListener('change', (e) => {
      video.playbackRate = Number(e.target.value) || 1;
    });
  }

  if (pipBtn) {
    pipBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (video.requestPictureInPicture) {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('PiP not available', err);
      }
    });
  }

  video.addEventListener('play', () => {
    card.classList.add('video-playing');
    updatePlayIcon();
    video.classList.add('playing');
  });
  video.addEventListener('pause', () => {
    card.classList.remove('video-playing');
    updatePlayIcon();
    video.classList.remove('playing');
  });

  // toggle play on click of the video area
  card.querySelector('.browser-frame')?.addEventListener('click', (e) => {
    const targetIsControl = e.target.closest('.video-controls');
    if (targetIsControl) return;
    if (video.paused) video.play().catch(() => {}); else video.pause();
  });
});
