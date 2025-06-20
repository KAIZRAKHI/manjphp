// About page JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Testimonial Slider
  const slider = document.querySelector(".testimonial-slider");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  const slideCount = document.querySelectorAll(".testimonial-slide").length;
  let isTransitioning = false;
  let autoSlideInterval;

  // Touch variables
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const videoElement = document.querySelector(".testimonial-slide video");
  let isVideoPlaying = false;

  let isHovered = false;

  function updateSlider(transition = true) {
    if (transition) {
      slider.style.transition = "transform 0.3s ease-out";
    } else {
      slider.style.transition = "none";
    }

    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("bg-white");
        dot.classList.remove("bg-gray-600");
      } else {
        dot.classList.remove("bg-white");
        dot.classList.add("bg-gray-600");
      }
    });

    if (currentSlide !== 0) {
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => video.pause());
    }
  }

  function nextSlide() {
    if (!isTransitioning && currentSlide < slideCount - 1) {
      isTransitioning = true;
      currentSlide++;
      updateSlider();
      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }
  }

  function prevSlide() {
    if (!isTransitioning && currentSlide > 0) {
      isTransitioning = true;
      currentSlide--;
      updateSlider();
      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }
  }

  function touchStart(e) {
    resetAutoSlide();
    isDragging = true;
    const touch = e.type === "mousedown" ? e : e.touches[0];
    touchStartX = touch.clientX;
    startPos = -currentSlide * 100;

    slider.style.transition = "none";

    const videos = document.querySelectorAll("video");
    videos.forEach((video) => video.pause());
  }

  function touchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.type === "mousemove" ? e : e.touches[0];
    touchEndX = touch.clientX;
    const diff = ((touchEndX - touchStartX) / window.innerWidth) * 100;
    const newPosition = startPos + diff;

    slider.style.transform = `translateX(${newPosition}%)`;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;

    const movedBy = touchEndX - touchStartX;

    if (Math.abs(movedBy) > 50) {
      if (movedBy > 0 && currentSlide > 0) {
        prevSlide();
      } else if (movedBy < 0 && currentSlide < slideCount - 1) {
        nextSlide();
      } else {
        updateSlider();
      }
    } else {
      updateSlider();
    }

    if (!isVideoPlaying && !isHovered) {
      startAutoSlide();
    }
  }

  // Auto-sliding
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    if (!isVideoPlaying && !isDragging && !isHovered) {
      autoSlideInterval = setInterval(nextSlide, 5000);
    }
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Add hover event listeners to the slider
  slider.addEventListener("mouseenter", () => {
    isHovered = true;
    resetAutoSlide();
  });

  slider.addEventListener("mouseleave", () => {
    isHovered = false;
    if (!isVideoPlaying) {
      startAutoSlide();
    }
  });

  // Update video event listeners
  if (videoElement) {
    videoElement.addEventListener("play", () => {
      isVideoPlaying = true;
      resetAutoSlide();
    });

    videoElement.addEventListener("pause", () => {
      isVideoPlaying = false;
      if (!isDragging && !isHovered) {
        startAutoSlide();
      }
    });

    videoElement.addEventListener("ended", () => {
      isVideoPlaying = false;
      if (!isDragging && !isHovered) {
        startAutoSlide();
      }
    });
  }

  // Update button event listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetAutoSlide();
      prevSlide();
      if (!isVideoPlaying && !isHovered) {
        startAutoSlide();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetAutoSlide();
      nextSlide();
      if (!isVideoPlaying && !isHovered) {
        startAutoSlide();
      }
    });
  }

  // Update dots click handler
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      resetAutoSlide();
      currentSlide = index;
      updateSlider();
      if (!isVideoPlaying && !isHovered) {
        startAutoSlide();
      }
    });
  });

  // Event Listeners
  slider.addEventListener("touchstart", touchStart);
  slider.addEventListener("touchmove", touchMove);
  slider.addEventListener("touchend", touchEnd);
  slider.addEventListener("mousedown", touchStart);
  slider.addEventListener("mousemove", touchMove);
  slider.addEventListener("mouseup", touchEnd);
  slider.addEventListener("mouseleave", touchEnd);

  // Prevent context menu on long press
  slider.addEventListener("contextmenu", (e) => e.preventDefault());

  // Initialize slider
  updateSlider(false);
  startAutoSlide();

  // Mobile Menu Functionality
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = menuBtn.querySelector(".hamburger");

  menuBtn.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    if (mobileMenu.classList.contains("translate-x-full")) {
      mobileMenu.classList.remove("translate-x-full");
      mobileMenu.classList.add("translate-x-0");
    } else {
      mobileMenu.classList.remove("translate-x-0");
      mobileMenu.classList.add("translate-x-full");
    }
  });

  document.querySelectorAll("#mobileMenu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      document.body.classList.remove("menu-open");
      mobileMenu.classList.remove("translate-x-0");
      mobileMenu.classList.add("translate-x-full");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      hamburger.classList.remove("active");
      document.body.classList.remove("menu-open");
      mobileMenu.classList.remove("translate-x-0");
      mobileMenu.classList.add("translate-x-full");
    }
  });

  // YouTube lazy loading functionality
  function loadYouTubeVideo(placeholder) {
    const videoId = placeholder.dataset.embed;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = "best building contractors in kerala";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.className = "w-full h-64 md:h-80 lg:h-96 rounded-lg";

    placeholder.parentNode.replaceChild(iframe, placeholder);
  }

  // Initialize YouTube lazy loading
  const youtubePlaceholder = document.querySelector(".youtube-placeholder");
  if (youtubePlaceholder) {
    youtubePlaceholder.addEventListener("click", function () {
      loadYouTubeVideo(this);
    });
  }

  // Lazy loading for images
  function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  }

  // Initialize lazy loading
  setupLazyLoading();

  // Service Worker registration
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
});
