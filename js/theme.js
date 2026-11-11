/*!
 * lc-bot2026 v1.0.0 (https://github.com/LamcatUK/lc-bot2026)
 * Copyright 2026 LamcatUK
 * Licensed under GPL-3.0
 */
(function () {
	'use strict';

	/**
	 * Mobile nav toggle. Wires any button with aria-controls pointing at a
	 * .navbar-collapse to show/hide it and keep aria-expanded in sync — this is
	 * the entire replacement for Bootstrap's Collapse component for this use case.
	 */
	function initNavToggle() {
	  document.querySelectorAll('.navbar-toggler[aria-controls]').forEach(toggler => {
	    const target = document.getElementById(toggler.getAttribute('aria-controls'));
	    if (!target) return;
	    toggler.addEventListener('click', () => {
	      const isOpen = target.classList.toggle('is-open');
	      toggler.setAttribute('aria-expanded', String(isOpen));
	    });

	    // Close after choosing a link — expected mobile nav behaviour.
	    target.querySelectorAll('a').forEach(link => {
	      link.addEventListener('click', () => {
	        target.classList.remove('is-open');
	        toggler.setAttribute('aria-expanded', 'false');
	      });
	    });
	  });
	}

	/**
	 * Click-to-open nav dropdowns. Each dropdown-toggle button shows/hides its
	 * linked .dropdown-menu and keeps aria-expanded in sync. Clicking elsewhere,
	 * or pressing Escape, closes whatever is open — this is the entire
	 * replacement for hover-based submenus.
	 */
	function initNavDropdowns() {
	  const toggles = document.querySelectorAll('.dropdown-toggle[aria-controls]');
	  function close(toggle) {
	    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
	    if (!menu) return;
	    menu.classList.remove('is-open');
	    toggle.setAttribute('aria-expanded', 'false');
	  }
	  function closeAllExcept(except) {
	    toggles.forEach(toggle => {
	      if (toggle !== except) close(toggle);
	    });
	  }
	  toggles.forEach(toggle => {
	    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
	    if (!menu) return;
	    toggle.addEventListener('click', event => {
	      event.stopPropagation();
	      const isOpen = menu.classList.toggle('is-open');
	      toggle.setAttribute('aria-expanded', String(isOpen));
	      closeAllExcept(toggle);
	    });
	  });
	  document.addEventListener('click', event => {
	    if (event.target.closest('.dropdown-menu')) return;
	    closeAllExcept();
	  });
	  document.addEventListener('keydown', event => {
	    if (event.key !== 'Escape') return;
	    const openToggle = Array.from(toggles).find(toggle => toggle.getAttribute('aria-expanded') === 'true');
	    closeAllExcept();
	    if (openToggle) openToggle.focus();
	  });
	}

	/**
	 * Native <dialog> wiring — replaces Bootstrap's Modal component entirely.
	 * showModal()/close() do the heavy lifting (focus trap, Escape-to-close,
	 * ::backdrop); this just connects trigger/close buttons to a target dialog.
	 *
	 * Markup:
	 *   <button data-dialog-target="my-dialog">Open</button>
	 *   <dialog id="my-dialog">
	 *     <button data-dialog-close>Close</button>
	 *     ...
	 *   </dialog>
	 */
	function initDialogs() {
	  document.querySelectorAll('[data-dialog-target]').forEach(trigger => {
	    const dialog = document.getElementById(trigger.getAttribute('data-dialog-target'));
	    if (!(dialog instanceof HTMLDialogElement)) return;
	    trigger.addEventListener('click', () => {
	      dialog.showModal();
	      // Lenis would keep scrolling the page behind the dialog.
	      if (window.lcLenis) window.lcLenis.stop();
	    });
	    dialog.addEventListener('close', () => {
	      if (window.lcLenis) window.lcLenis.start();
	    });
	    dialog.querySelectorAll('[data-dialog-close]').forEach(closeBtn => {
	      closeBtn.addEventListener('click', () => dialog.close());
	    });

	    // Click on the backdrop (the dialog element itself, outside its content) closes it.
	    dialog.addEventListener('click', event => {
	      if (event.target === dialog) dialog.close();
	    });
	  });
	}

	/**
	 * Topic filter for the Latest Posts block. The chips are buttons rendered
	 * hidden; this shows them and hides/shows the cards by their data-topics.
	 * ?topic=slug in the address is honoured on load and kept up to date, so a
	 * filtered view can be shared. No JavaScript means all posts, unfiltered.
	 */
	function initPostFilters() {
	  document.querySelectorAll('.latest-news__filters').forEach(bar => {
	    const section = bar.closest('.latest-news');
	    const cards = [...section.querySelectorAll('.latest-news__card')];
	    const chips = [...bar.querySelectorAll('[data-filter]')];
	    const status = section.querySelector('[data-filter-status]');
	    const apply = (slug, push) => {
	      let shown = 0;
	      cards.forEach(card => {
	        const match = !slug || card.dataset.topics.split(' ').includes(slug);
	        card.hidden = !match;
	        if (match) shown += 1;
	      });
	      chips.forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.filter === slug)));
	      if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'post' : 'posts'}`;
	      if (push) {
	        const url = new URL(window.location.href);
	        if (slug) url.searchParams.set('topic', slug);else url.searchParams.delete('topic');
	        window.history.replaceState(null, '', url);
	      }
	    };
	    chips.forEach(chip => chip.addEventListener('click', () => apply(chip.dataset.filter, true)));
	    bar.hidden = false;
	    const initial = new URLSearchParams(window.location.search).get('topic') || '';
	    apply(chips.some(c => c.dataset.filter === initial) ? initial : '', false);
	  });
	}

	/**
	 * Video behind a play button. The block prints a button holding a poster
	 * image; the real player is only created when it is clicked, so a page with a
	 * video loads no third-party iframe until the visitor asks for it.
	 *
	 * Markup: <button class="video-facade" data-play="modal|inline" data-embed="https://..." data-title="...">
	 *
	 * data-play="modal" (the default) opens the video in a pop-out player on
	 * screens from md up; below md, and with data-play="inline", the video plays
	 * in place of the poster. The pop-out is one shared <dialog> built on first
	 * use; its player is removed on close, which stops the video.
	 */
	const DESKTOP = window.matchMedia('(min-width: 768px)');
	let modal = null;
	function buildModal() {
	  const dialog = document.createElement('dialog');
	  dialog.className = 'video-modal';
	  const close = document.createElement('button');
	  close.type = 'button';
	  close.className = 'video-modal__close';
	  close.setAttribute('aria-label', 'Close video');
	  close.innerHTML = '<span aria-hidden="true">&times;</span>';
	  close.addEventListener('click', () => dialog.close());
	  const inner = document.createElement('div');
	  inner.className = 'video-modal__inner';
	  dialog.append(close, inner);

	  // A click on the backdrop lands on the dialog itself; the player fills the dialog, so a click on it never does.
	  dialog.addEventListener('click', event => {
	    if (event.target === dialog) {
	      dialog.close();
	    }
	  });
	  dialog.addEventListener('close', () => {
	    inner.innerHTML = '';
	    // Lenis was stopped while the pop-out was open.
	    if (window.lcLenis) {
	      window.lcLenis.start();
	    }
	    if (dialog.opener && document.contains(dialog.opener)) {
	      dialog.opener.focus();
	    }
	  });
	  document.body.appendChild(dialog);
	  return dialog;
	}
	function createFrame(facade) {
	  const frame = document.createElement('iframe');
	  frame.className = 'video-facade__frame';
	  frame.src = facade.getAttribute('data-embed');
	  frame.title = facade.getAttribute('data-title') || 'Video';
	  frame.allow = 'autoplay; fullscreen; picture-in-picture';
	  frame.allowFullscreen = true;
	  return frame;
	}
	const warmed = new Set();

	/**
	 * Open the connection to the video provider as soon as a visitor points at
	 * (or tabs to) a poster, so the player is ready sooner when they click.
	 */
	function warmUp(facade) {
	  let origin = '';
	  try {
	    origin = new URL(facade.getAttribute('data-embed')).origin;
	  } catch (e) {
	    return;
	  }
	  if (warmed.has(origin)) {
	    return;
	  }
	  warmed.add(origin);
	  const link = document.createElement('link');
	  link.rel = 'preconnect';
	  link.href = origin;
	  document.head.appendChild(link);
	}
	function initVideoFacades() {
	  ['pointerover', 'focusin'].forEach(type => {
	    document.addEventListener(type, event => {
	      const facade = event.target.closest && event.target.closest('.video-facade');
	      if (facade) {
	        warmUp(facade);
	      }
	    });
	  });
	  document.addEventListener('click', event => {
	    const facade = event.target.closest('.video-facade');
	    if (!facade) {
	      return;
	    }
	    if ('inline' !== facade.getAttribute('data-play') && DESKTOP.matches && 'function' === typeof HTMLDialogElement) {
	      modal = modal || buildModal();
	      modal.querySelector('.video-modal__inner').replaceChildren(createFrame(facade));
	      modal.setAttribute('aria-label', facade.getAttribute('data-title') || 'Video');
	      modal.opener = facade;
	      modal.showModal();
	      // Lenis would keep scrolling the page behind the pop-out.
	      if (window.lcLenis) {
	        window.lcLenis.stop();
	      }
	      return;
	    }
	    const frame = createFrame(facade);
	    facade.replaceWith(frame);
	    frame.focus();
	  });
	}

	/**
	 * Pullquote Slider: shows the previous/next buttons and the count, and keeps
	 * the count in step with the quote in view. The track is plain scroll-snap, so
	 * without JavaScript it still scrolls by swipe or keyboard.
	 */
	function initQuoteSliders() {
	  document.querySelectorAll('.pullquote-slider__frame').forEach(frame => {
	    const track = frame.querySelector('.pullquote-slider__track');
	    const controls = frame.querySelector('.pullquote-slider__controls');
	    if (!track || !controls) return;
	    const slides = [...track.children];
	    const current = controls.querySelector('[data-current]');
	    const index = () => Math.round(track.scrollLeft / track.clientWidth);
	    const go = i => track.scrollTo({
	      left: Math.max(0, Math.min(slides.length - 1, i)) * track.clientWidth
	    });
	    controls.hidden = false;
	    controls.querySelectorAll('[data-dir]').forEach(btn => {
	      btn.addEventListener('click', () => {
	        const next = index() + Number(btn.dataset.dir);
	        // wrap round, so the last quote leads back to the first
	        go(next < 0 ? slides.length - 1 : next >= slides.length ? 0 : next);
	      });
	    });
	    track.addEventListener('scroll', () => {
	      current.textContent = String(index() + 1);
	    }, {
	      passive: true
	    });
	  });
	}

	/**
	 * Removing the last item from the basket updates the page in place through
	 * WooCommerce's script, which leaves the page empty. Reloading shows the empty
	 * basket message and clears the header basket icon.
	 */
	function initCart() {
	  if (!window.jQuery) return;
	  window.jQuery(document.body).on('wc_cart_emptied', () => window.location.reload());
	}

	/**
	 * Smooth scrolling with Lenis (js/vendor/lenis.min.js, loaded before this).
	 * The instance is window.lcLenis, so other code can stop() and start() it.
	 *
	 * Off for visitors who ask for reduced motion, and on touch devices Lenis does
	 * not take over (syncTouch is off), so phones and tablets scroll natively.
	 *
	 *  - An element with its own scrollbar needs data-lenis-prevent, or the page
	 *    scrolls instead of the element. (The open mobile menu has it.)
	 *  - Anything that locks the page (a dialog) calls lcLenis.stop() and start().
	 *  - In-page links (#section) are handled here so the page glides and keyboard
	 *    focus still moves to the target.
	 */
	function initSmoothScroll() {
	  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	  if (typeof window.Lenis !== 'function' || reduce) {
	    return;
	  }

	  // autoRaf: Lenis runs its own animation loop. A lower lerp feels softer.
	  const lenis = new window.Lenis({
	    autoRaf: true,
	    anchors: false,
	    lerp: 0.09
	  });
	  window.lcLenis = lenis;
	  document.addEventListener('click', event => {
	    const link = event.target.closest('a[href^="#"]');
	    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) {
	      return;
	    }
	    const id = decodeURIComponent(link.getAttribute('href').slice(1));
	    const target = id ? document.getElementById(id) : document.body;
	    if (!target) {
	      return;
	    }
	    event.preventDefault();
	    lenis.scrollTo(target, {
	      offset: -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0),
	      onComplete: () => {
	        if (id) {
	          if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
	            target.setAttribute('tabindex', '-1');
	          }
	          target.focus({
	            preventScroll: true
	          });
	          window.history.pushState(null, '', `#${id}`);
	        }
	      }
	    });
	  });
	}

	/**
	 * The site's motion, all in one place. GSAP and ScrollTrigger are loaded before
	 * this (js/vendor/). Everything here is skipped for visitors who ask for reduced
	 * motion, and if anything is missing the page simply shows as it is.
	 *
	 *  1. Entrance: text and tiles rise into place as they scroll into view.
	 *  2. Hero: the heading, intro and button rise on load; the photo drifts slower
	 *     than the page (parallax).
	 *  3. Photos in a brush mask drift slightly inside their frame.
	 *  3b. The fern watermark drifts behind its section.
	 *  4. Pill strokes paint on left to right. Brush section edges are static.
	 *
	 * CSS (src/css/motion.css) hides the starting states only while <html> has
	 * .js-motion, which a script in <head> sets before paint.
	 */
	const REVEAL = ['.text-image__copy', '.text-image__media', '.text-section__body', '.tile-links__tile', '.latest-news__card', '.collaborators__item', '.feature-columns__item', '.hikes-list__item', '.faq__item', '.pullquote__figure', '.contact__copy', '.contact__form', '.cta-band__inner', '.social-band__inner', '.newsletter-band__inner'].join(',');
	function initMotion() {
	  const root = document.documentElement;
	  const {
	    gsap,
	    ScrollTrigger
	  } = window;
	  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	  if (reduce || !gsap || !ScrollTrigger || !root.classList.contains('js-motion')) {
	    root.classList.remove('js-motion');
	    return;
	  }
	  gsap.registerPlugin(ScrollTrigger);

	  // Lenis owns the scrolling, so tell ScrollTrigger whenever it moves.
	  if (window.lcLenis) {
	    window.lcLenis.on('scroll', ScrollTrigger.update);
	  }
	  const groups = new Map();
	  document.querySelectorAll(REVEAL).forEach(el => {
	    const parent = el.parentElement;
	    const n = groups.get(parent) || 0;
	    groups.set(parent, n + 1);
	    el.style.setProperty('--i', String(Math.min(n, 5)));
	  });
	  // Quotes in the slider scroll sideways rather than into view: show them all at once.
	  document.querySelectorAll('.pullquote-slider__slide .pullquote__figure').forEach(el => el.classList.add('is-in'));
	  const io = new IntersectionObserver(entries => {
	    entries.forEach(entry => {
	      if (entry.isIntersecting) {
	        entry.target.classList.add('is-in');
	        io.unobserve(entry.target);
	      }
	    });
	  }, {
	    threshold: 0,
	    rootMargin: '0px 0px -8% 0px'
	  } // threshold 0: a block taller than the screen can never be 12% visible at once, and would stay hidden
	  );
	  document.querySelectorAll(REVEAL).forEach(el => io.observe(el));

	  // 2. Hero: copy rises on load, photo drifts.
	  document.querySelectorAll('.page-hero').forEach(hero => {
	    const copy = hero.querySelectorAll('.page-hero__inner > *');
	    gsap.fromTo(copy, {
	      y: 36,
	      opacity: 0
	    }, {
	      y: 0,
	      opacity: 1,
	      duration: 0.9,
	      ease: 'power3.out',
	      stagger: 0.12,
	      delay: 0.15,
	      clearProps: 'transform,opacity'
	    });
	    const img = hero.querySelector('.page-hero__media img');
	    if (img) {
	      gsap.fromTo(img, {
	        yPercent: -7,
	        scale: 1.14
	      }, {
	        yPercent: 7,
	        scale: 1.14,
	        ease: 'none',
	        scrollTrigger: {
	          trigger: hero,
	          start: 'top top',
	          end: 'bottom top',
	          scrub: true
	        }
	      });
	    }
	  });

	  // 3. Photos in a brush mask, and image bands: the picture drifts inside its frame.
	  document.querySelectorAll('.text-image__media.brush-photo img, .cta-band__media img, .pullquote__media img').forEach(img => {
	    const frame = img.closest('.text-image__media, .cta-band__media, .pullquote__media');
	    gsap.fromTo(img, {
	      yPercent: -6,
	      scale: 1.12
	    }, {
	      yPercent: 6,
	      scale: 1.12,
	      ease: 'none',
	      scrollTrigger: {
	        trigger: frame,
	        start: 'top bottom',
	        end: 'bottom top',
	        scrub: true
	      }
	    });
	  });

	  // Fern watermark: the background drifts a little slower than the section.
	  document.querySelectorAll('.fern-left, .fern-right, .fern-both, #footer').forEach(el => {
	    gsap.fromTo(el, {
	      '--fern-y': -18
	    }, {
	      '--fern-y': 12,
	      ease: 'none',
	      scrollTrigger: {
	        trigger: el,
	        start: 'top bottom',
	        end: 'bottom top',
	        scrub: true
	      }
	    });
	  });

	  // 4. Pill strokes paint on left to right. Section edges are static.
	  document.querySelectorAll('.pill').forEach(el => {
	    gsap.fromTo(el, {
	      '--paint': 0
	    }, {
	      '--paint': 1,
	      duration: 1.3,
	      ease: 'power1.inOut',
	      scrollTrigger: {
	        trigger: el,
	        start: 'top 92%',
	        once: true
	      }
	    });
	  });
	  root.classList.add('js-motion-ready');
	}

	document.addEventListener('DOMContentLoaded', () => {
	  initNavToggle();
	  initNavDropdowns();
	  initDialogs();
	  initPostFilters();
	  initVideoFacades();
	  initQuoteSliders();
	  initCart();
	  initSmoothScroll();
	  initMotion();
	});

})();
//# sourceMappingURL=theme.js.map
