(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const langButton = document.querySelector("[data-lang-toggle]");
  const langButtonLabel = document.querySelector("[data-lang-label]");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const primaryNav = document.querySelector("[data-primary-nav]");
  const header = document.querySelector("[data-site-header]");
  const progressBar = document.querySelector(".scroll-progress");
  const backToTop = document.querySelector("[data-back-to-top]");
  const backToTopProgress = document.querySelector(".backtop-progress");
  const cursorAura = document.querySelector(".cursor-aura");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const meta = {
    zh: {
      title: "郭润琪｜金融学硕士 · 投资研究与量化分析",
      description:
        "郭润琪的个人作品集：湖南大学金融学硕士在读，浙江财经大学金融工程本科。关注投资研究、量化策略与金融数据分析。",
      menuOpen: "打开导航菜单",
      menuClose: "关闭导航菜单",
      switchLang: "Switch to English",
      copyLabel: "复制邮箱地址",
      copied: "邮箱已复制",
      copyFailed: "请手动复制邮箱",
      backTop: "回到顶部",
    },
    en: {
      title: "Runqi Guo | M.Sc. in Finance · Investment Research & Quantitative Analysis",
      description:
        "Portfolio of Runqi Guo, a Master of Finance student at Hunan University and graduate in Financial Engineering from Zhejiang University of Finance & Economics.",
      menuOpen: "Open navigation menu",
      menuClose: "Close navigation menu",
      switchLang: "切换至中文",
      copyLabel: "Copy email address",
      copied: "Email copied",
      copyFailed: "Please copy the email manually",
      backTop: "Back to top",
    },
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        /* Ignore storage restrictions. */
      }
    },
  };

  const currentLang = () => (root.dataset.lang === "en" ? "en" : "zh");

  function applyLanguage(lang, persist = true) {
    const next = lang === "en" ? "en" : "zh";
    const dictionary = meta[next];

    root.dataset.lang = next;
    root.setAttribute("lang", next === "zh" ? "zh-CN" : "en");
    document.title = dictionary.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", dictionary.description);

    if (langButtonLabel) {
      langButtonLabel.textContent = next === "zh" ? "EN" : "中文";
    }

    if (langButton) {
      langButton.setAttribute("aria-label", dictionary.switchLang);
      langButton.setAttribute("title", dictionary.switchLang);
    }

    if (menuButton) {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-label", expanded ? dictionary.menuClose : dictionary.menuOpen);
    }

    if (backToTop) {
      backToTop.setAttribute("aria-label", dictionary.backTop);
    }

    if (persist) safeStorage.set("runqi-portfolio-lang", next);
  }

  function openMenu() {
    if (!menuButton) return;
    body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", meta[currentLang()].menuClose);

    const firstLink = primaryNav ? primaryNav.querySelector("a") : null;
    if (firstLink) {
      window.setTimeout(() => {
        if (body.classList.contains("menu-open")) firstLink.focus({ preventScroll: true });
      }, 140);
    }
  }

  function closeMenu(options = {}) {
    if (!menuButton) return;
    const hadFocus = primaryNav && primaryNav.contains(document.activeElement);
    body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", meta[currentLang()].menuOpen);

    if (hadFocus && options.restoreFocus) {
      menuButton.focus({ preventScroll: true });
    }
  }

  applyLanguage(currentLang(), false);

  if (langButton) {
    langButton.addEventListener("click", () => {
      applyLanguage(currentLang() === "zh" ? "en" : "zh");
    });
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      if (body.classList.contains("menu-open")) {
        closeMenu({ restoreFocus: true });
      } else {
        openMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1080px)").matches) {
        closeMenu({ restoreFocus: false });
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu({ restoreFocus: true });
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
  });

  function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;

    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 270);
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12;

    if (nearBottom) currentId = sections[sections.length - 1].id;

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${currentId}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  function onScroll() {
    if (scrollScheduled) return;
    scrollScheduled = true;

    window.requestAnimationFrame(() => {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

      if (progressBar) progressBar.style.width = `${progress * 100}%`;

      if (backToTop) {
        backToTop.classList.toggle("is-visible", window.scrollY > 440);
      }

      if (backToTopProgress) {
        const circumference = 125.66;
        backToTopProgress.style.strokeDashoffset = String(circumference * (1 - progress));
      }

      updateActiveNav();
      scrollScheduled = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* Scroll reveals */
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -34px" }
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal-pending");
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* Counter animation */
  const counters = Array.from(document.querySelectorAll("[data-count]"));

  function animateCounter(element) {
    const target = Number.parseFloat(element.dataset.count);
    if (!Number.isFinite(target)) return;

    const decimals = Number.parseInt(element.dataset.decimals || "0", 10);
    const duration = 1350;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (target * eased).toFixed(decimals);

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = target.toFixed(decimals);
      }
    }

    window.requestAnimationFrame(tick);
  }

  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          window.setTimeout(() => animateCounter(entry.target), 160);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* Pointer interactions */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((panel) => {
      panel.addEventListener("pointermove", (event) => {
        const rect = panel.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateX = Math.max(-2.8, Math.min(2.8, y * -5));
        const rotateY = Math.max(-3.6, Math.min(3.6, x * 7));

        panel.style.transition = "transform 120ms ease-out";
        panel.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      panel.addEventListener("pointerleave", () => {
        panel.style.transition = "";
        panel.style.transform = "";
      });
    });

    document.querySelectorAll("[data-spotlight]").forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const rect = surface.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        surface.style.setProperty("--mx", `${x.toFixed(1)}%`);
        surface.style.setProperty("--my", `${y.toFixed(1)}%`);
      });

      surface.addEventListener("pointerleave", () => {
        surface.style.setProperty("--mx", "50%");
        surface.style.setProperty("--my", "50%");
      });
    });

    if (cursorAura) {
      let auraVisible = false;
      window.addEventListener(
        "pointermove",
        (event) => {
          cursorAura.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
          if (!auraVisible) {
            cursorAura.style.opacity = "1";
            auraVisible = true;
          }
        },
        { passive: true }
      );

      document.addEventListener("mouseleave", () => {
        cursorAura.style.opacity = "0";
        auraVisible = false;
      });
    }
  }

  /* Copy email */
  const copyButton = document.querySelector("[data-copy-email]");
  const copyFeedback = document.querySelector("[data-copy-feedback]");
  const emailLink = document.querySelector("[data-email-link]");

  if (copyButton && copyFeedback && emailLink) {
    copyButton.addEventListener("click", async () => {
      const email = emailLink.dataset.email || emailLink.textContent.trim();
      let success = false;

      try {
        await navigator.clipboard.writeText(email);
        success = true;
      } catch (error) {
        const helper = document.createElement("textarea");
        helper.value = email;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();

        try {
          success = document.execCommand("copy");
        } catch (fallbackError) {
          success = false;
        }

        helper.remove();
      }

      const strings = meta[currentLang()];
      copyFeedback.textContent = success ? strings.copied : strings.copyFailed;
      copyFeedback.classList.add("is-visible");

      window.clearTimeout(copyButton.feedbackTimer);
      copyButton.feedbackTimer = window.setTimeout(() => {
        copyFeedback.classList.remove("is-visible");
      }, 2200);
    });
  }

  const yearNode = document.querySelector("[data-current-year]");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();
