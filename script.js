const openButton = document.getElementById("openButton");
const coverBook = document.getElementById("coverBook");
const journeySection = document.getElementById("journey");
const timelineBoard = document.getElementById("timelineBoard");
const timelinePath = document.getElementById("timelinePath");
const polaroids = document.querySelectorAll(".polaroid");
const envelopeButton = document.getElementById("envelopeButton");
const heartBurst = document.getElementById("heartBurst");
const readWishButton = document.getElementById("readWishButton");
const writeWishButton = document.getElementById("writeWishButton");
const wishPasswordInput = document.getElementById("wishPasswordInput");
const wishPasswordFeedback = document.getElementById("wishPasswordFeedback");
const photoModalOverlay = document.getElementById("photoModalOverlay");
const letterModalOverlay = document.getElementById("letterModalOverlay");
const wishFormOverlay = document.getElementById("wishFormOverlay");
const modalPhoto = document.getElementById("modalPhoto");
const modalMeta = document.getElementById("modalMeta");
const modalPhotoText = document.getElementById("modalPhotoText");
const letterPaper = document.getElementById("letterPaper");
const confettiField = document.getElementById("confettiField");
const flipBook = document.getElementById("flipBook");
const nextPageButton = document.getElementById("nextPageButton");
const prevPageButton = document.getElementById("prevPageButton");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const polaroidImages = document.querySelectorAll(".polaroid__img");
const wishForm = document.getElementById("wishForm");
const wishMessageInput = document.getElementById("wishMessageInput");
const wishFormFeedback = document.getElementById("wishFormFeedback");
const wishFormSuccess = document.getElementById("wishFormSuccess");

const revealTargets = document.querySelectorAll(".reveal");
const targetDate = getNextJuneFirst();
const LETTER_PASSWORD = "aliganteng";

let confettiTimeout = 0;
let confettiInterval = 0;
let updateTimelineThread = () => {};
let hasReadLetter = false;
let hasShownWishForm = false;

function getNextJuneFirst() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const juneFirst = new Date(currentYear, 5, 1, 0, 0, 0);
  return now >= juneFirst ? new Date(currentYear + 1, 5, 1, 0, 0, 0) : juneFirst;
}

function openModal(modal) {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function closeAllModals() {
  closeModal(photoModalOverlay);
  closeModal(letterModalOverlay);
  closeModal(wishFormOverlay);
  stopLetterConfetti();
  restoreMusicVolume();
}

function handleCoverOpen() {
  document.body.classList.remove("is-locked");
  document.body.classList.add("is-unlocked");
  document.querySelectorAll(".gated-section").forEach((section) => {
    section.setAttribute("aria-hidden", "false");
  });
  coverBook.classList.add("is-open");
  openButton.innerHTML = 'OPENED <img src="asset/heart.svg" alt="" aria-hidden="true" class="hero-btn__icon" />';
  openButton.disabled = true;

  window.setTimeout(() => {
    updateTimelineThread();
    journeySection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 560);

  window.setTimeout(updateTimelineThread, 900);
  window.setTimeout(updateTimelineThread, 1400);
}

function resetScrollPosition() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function updateCountdown() {
  const now = new Date();
  const diff = Math.max(targetDate - now, 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function createScene(sceneName) {
  const frame = document.createElement("div");
  frame.className = `modal-photo scene scene--${sceneName}`;

  if (sceneName === "date") {
    frame.innerHTML = `
      <div class="scene__ground"></div>
      <div class="scene__person scene__person--left"></div>
      <div class="scene__person scene__person--right"></div>
    `;
  }

  if (sceneName === "beach") {
    frame.innerHTML = `
      <div class="scene__water"></div>
      <div class="scene__sand"></div>
      <div class="scene__tree"></div>
      <div class="scene__face"></div>
    `;
  }

  if (sceneName === "movie") {
    frame.innerHTML = `
      <div class="scene__screen"></div>
      <div class="scene__seat"></div>
      <div class="scene__popcorn"></div>
    `;
  }

  if (sceneName === "sunset") {
    frame.innerHTML = `
      <div class="scene__sun"></div>
      <div class="scene__road"></div>
      <div class="scene__couple"></div>
    `;
  }

  return frame;
}

function openPhotoModal(card) {
  const title = card.dataset.title || "Polaroid";
  const date = card.dataset.date || "";
  const place = card.dataset.place || "";
  const story = card.dataset.story || "";
  const scene = card.dataset.scene || "date";
  const cardImage = card.querySelector(".polaroid__img");

  modalPhoto.innerHTML = "";
  if (cardImage && !cardImage.classList.contains("is-missing")) {
    const photo = document.createElement("img");
    photo.className = "polaroid__img";
    photo.src = cardImage.src;
    photo.alt = cardImage.alt || title;
    modalPhoto.appendChild(photo);
  } else {
    modalPhoto.appendChild(createScene(scene));
  }
  modalMeta.textContent = `${title} | ${date} | ${place}`;
  modalPhotoText.textContent = story;
  openModal(photoModalOverlay);
}

function lowerMusicVolume() {
  if (!bgMusic.paused) {
    bgMusic.volume = 0.18;
  }
}

function restoreMusicVolume() {
  if (!bgMusic.paused) {
    bgMusic.volume = 0.6;
  }
}

function stopLetterConfetti() {
  window.clearTimeout(confettiTimeout);
  window.clearInterval(confettiInterval);
  confettiField.innerHTML = "";
}

function startLetterConfetti() {
  stopLetterConfetti();

  const spawnBit = () => {
    const bit = document.createElement("span");
    bit.className = "confetti-bit";
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = ["#f87171", "#facc15", "#38bdf8", "#4ade80", "#f9a8d4"][Math.floor(Math.random() * 5)];
    bit.style.animationDuration = `${3.4 + Math.random() * 1.1}s`;
    bit.style.transform = `rotate(${Math.random() * 80}deg)`;
    confettiField.appendChild(bit);

    window.setTimeout(() => {
      bit.remove();
    }, 4200);
  };

  for (let index = 0; index < 10; index += 1) {
    window.setTimeout(spawnBit, index * 120);
  }

  confettiInterval = window.setInterval(spawnBit, 280);
  confettiTimeout = window.setTimeout(() => {
    stopLetterConfetti();
  }, 4200);
}

function openLetterModal() {
  letterPaper.classList.remove("is-typing");
  void letterPaper.offsetWidth;
  letterPaper.classList.add("is-typing");
  openModal(letterModalOverlay);
  hasReadLetter = true;
  lowerMusicVolume();
  startLetterConfetti();
}

function closeLetterModal() {
  closeModal(letterModalOverlay);
  stopLetterConfetti();
  restoreMusicVolume();

  if (hasReadLetter && !hasShownWishForm) {
    hasShownWishForm = true;
    window.setTimeout(() => {
      openModal(wishFormOverlay);
      wishMessageInput?.focus();
    }, 180);
  }
}

function openWishFormFromLetter() {
  hasShownWishForm = true;
  closeModal(letterModalOverlay);
  stopLetterConfetti();
  restoreMusicVolume();
  openModal(wishFormOverlay);
  wishMessageInput?.focus();
}

function setWishPasswordFeedback(message, type = "") {
  if (!wishPasswordFeedback) {
    return;
  }

  wishPasswordFeedback.textContent = message;
  wishPasswordFeedback.classList.remove("is-error", "is-success");
  if (type) {
    wishPasswordFeedback.classList.add(type);
  }
}

function validateWishPassword() {
  const value = wishPasswordInput?.value.trim() || "";
  if (value === LETTER_PASSWORD) {
    setWishPasswordFeedback("Password accepted. The letter is ready.", "is-success");
    return true;
  }

  setWishPasswordFeedback("That password is not right yet.", "is-error");
  return false;
}

function attemptOpenWish() {
  if (!validateWishPassword()) {
    wishPasswordInput?.focus();
    return;
  }

  openLetterModal();
}

function spawnHeartParticle() {
  const particle = document.createElement("span");
  particle.className = "heart-particle";
  particle.style.setProperty("--dx", `${-70 + Math.random() * 140}px`);
  particle.style.setProperty("--rise", `${80 + Math.random() * 80}px`);
  particle.style.background = ["#ffd7e4", "#ffe6a7", "#bfdbfe", "#fecdd3"][Math.floor(Math.random() * 4)];
  heartBurst.appendChild(particle);

  window.setTimeout(() => {
    particle.remove();
  }, 1000);
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

function setupTimelinePath() {
  if (!timelinePath || !timelineBoard) {
    return;
  }

  const totalLength = timelinePath.getTotalLength();
  const lastPolaroid = polaroids[polaroids.length - 1] || null;
  timelinePath.style.strokeDasharray = `${totalLength}`;
  timelinePath.style.strokeDashoffset = `${totalLength}`;

  updateTimelineThread = () => {
    const rect = timelineBoard.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const boardTop = scrollY + rect.top;
    const lastPolaroidBottom = lastPolaroid
      ? scrollY + lastPolaroid.getBoundingClientRect().bottom
      : boardTop + rect.height;
    const boardBottom = Math.max(boardTop + rect.height, lastPolaroidBottom + 40);
    const mobile = window.innerWidth <= 720;
    const start = boardTop - viewportHeight * 0.72;
    const end = boardBottom - viewportHeight * (mobile ? 0.88 : 0.62);
    const progress = Math.min(Math.max((scrollY - start) / Math.max(end - start, 1), 0), 1);
    timelinePath.style.strokeDashoffset = `${totalLength * (1 - progress)}`;
  };

  updateTimelineThread();
  window.addEventListener("scroll", updateTimelineThread, { passive: true });
  window.addEventListener("resize", updateTimelineThread);
}

async function submitWishForm(event) {
  event.preventDefault();

  const wish = wishMessageInput?.value.trim() || "";
  const endpoint = wishForm?.dataset.endpoint?.trim() || "";
  const endpointReady = endpoint && !endpoint.startsWith("PASTE_YOUR_");
  const submittedAt = new Date().toISOString();

  if (!wish) {
    wishFormFeedback.textContent = "Please write your wish first.";
    wishMessageInput?.focus();
    return;
  }

  if (!endpointReady) {
    wishFormFeedback.textContent = "Spreadsheet endpoint is not connected yet.";
    return;
  }

  const submitButton = document.getElementById("wishSubmitButton");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";
  }
  wishFormFeedback.textContent = "";

  try {
    if (endpoint) {
      console.info("[wish-submit] Sending request", {
        endpoint,
        submittedAt,
        wishLength: wish.length
      });

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          wish,
          submittedAt
        })
      });

      console.info("[wish-submit] Request sent from browser", {
        endpoint,
        submittedAt
      });
    }

    wishFormFeedback.textContent = "Wish sent";
    wishForm.hidden = true;
    wishFormSuccess.hidden = false;
  } catch (error) {
    console.error("[wish-submit] Failed to send request", {
      endpoint,
      submittedAt,
      error: error instanceof Error ? error.message : String(error)
    });
    wishFormFeedback.textContent = "The wish could not be sent yet.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "SEND THE WISH";
    }
  }
}

function setupWishForm() {
  if (!wishForm) {
    return;
  }

  wishForm.addEventListener("submit", submitWishForm);
}

function setupInitialState() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  resetScrollPosition();
  window.addEventListener("load", resetScrollPosition);
  window.addEventListener("pageshow", resetScrollPosition);
}

function setupFlipBook() {
  if (!flipBook || !nextPageButton || !prevPageButton) {
    return;
  }

  nextPageButton.addEventListener("click", () => {
    flipBook.classList.add("is-flipped");
  });

  prevPageButton.addEventListener("click", () => {
    flipBook.classList.remove("is-flipped");
  });
}

function setupPolaroidImages() {
  polaroidImages.forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("is-missing");
    });

    if (image.complete && image.naturalWidth === 0) {
      image.classList.add("is-missing");
    }
  });
}

function setupAudio() {
  const setLabel = (text) => {
    musicToggle.textContent = text;
    musicToggle.setAttribute("aria-pressed", text === "Music On" ? "true" : "false");
  };

  musicToggle.addEventListener("click", async () => {
    if (bgMusic.paused) {
      try {
        bgMusic.volume = 0.6;
        await bgMusic.play();
        setLabel("Music On");
      } catch (error) {
        setLabel("Music Off");
      }
    } else {
      bgMusic.pause();
      setLabel("Music Off");
    }
  });

  bgMusic.addEventListener("error", () => {
    setLabel("Music Off");
  });
}

openButton.addEventListener("click", handleCoverOpen);
readWishButton.addEventListener("click", attemptOpenWish);
writeWishButton?.addEventListener("click", openWishFormFromLetter);

envelopeButton.addEventListener("click", () => {
  spawnHeartParticle();
  window.setTimeout(spawnHeartParticle, 90);
  attemptOpenWish();
});

envelopeButton.addEventListener("mouseenter", () => {
  for (let index = 0; index < 5; index += 1) {
    window.setTimeout(spawnHeartParticle, index * 85);
  }
});

envelopeButton.addEventListener("focus", () => {
  for (let index = 0; index < 3; index += 1) {
    window.setTimeout(spawnHeartParticle, index * 100);
  }
});

polaroids.forEach((card) => {
  card.addEventListener("click", () => openPhotoModal(card));
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-close");
    if (target === "wish-form") {
      closeModal(wishFormOverlay);
      return;
    }

    if (letterModalOverlay.classList.contains("active")) {
      closeLetterModal();
      return;
    }

    closeAllModals();
  });
});

[photoModalOverlay, letterModalOverlay, wishFormOverlay].forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      if (overlay === letterModalOverlay) {
        closeLetterModal();
        return;
      }

      closeModal(overlay);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (letterModalOverlay.classList.contains("active")) {
      closeLetterModal();
      return;
    }

    closeAllModals();
  }
});

wishPasswordInput?.addEventListener("input", () => {
  setWishPasswordFeedback("");
});

wishPasswordInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    attemptOpenWish();
  }
});

updateCountdown();
window.setInterval(updateCountdown, 1000);
setupInitialState();
setupRevealObserver();
setupTimelinePath();
setupFlipBook();
setupPolaroidImages();
setupAudio();
setupWishForm();
