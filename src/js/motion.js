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
const REVEAL = [
	'.text-image__copy',
	'.text-image__media',
	'.text-section__body',
	'.tile-links__tile',
	'.latest-news__card',
	'.collaborators__item',
	'.feature-columns__item',
	'.hikes-list__item',
	'.faq__item',
	'.pullquote__figure',
	'.contact__copy',
	'.contact__form',
	'.cta-band__inner',
	'.social-band__inner',
	'.newsletter-band__inner',
].join(',');

export function initMotion() {
	const root = document.documentElement;
	const { gsap, ScrollTrigger } = window;
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

	// 1. Entrance: add .is-in the first time an element is near the viewport.
	const seen = new WeakMap();
	const groups = new Map();
	document.querySelectorAll(REVEAL).forEach((el) => {
		const parent = el.parentElement;
		const n = groups.get(parent) || 0;
		groups.set(parent, n + 1);
		el.style.setProperty('--i', String(Math.min(n, 5)));
	});
	// Quotes in the slider scroll sideways rather than into view: show them all at once.
	document.querySelectorAll('.pullquote-slider__slide .pullquote__figure').forEach((el) => el.classList.add('is-in'));
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in');
					io.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0, rootMargin: '0px 0px -8% 0px' } // threshold 0: a block taller than the screen can never be 12% visible at once, and would stay hidden
	);
	document.querySelectorAll(REVEAL).forEach((el) => io.observe(el));

	// 2. Hero: copy rises on load, photo drifts.
	document.querySelectorAll('.page-hero').forEach((hero) => {
		const copy = hero.querySelectorAll('.page-hero__inner > *');
		gsap.fromTo(copy, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15, clearProps: 'transform,opacity' });

		const img = hero.querySelector('.page-hero__media img');
		if (img) {
			gsap.fromTo(img, { yPercent: -7, scale: 1.14 }, { yPercent: 7, scale: 1.14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
		}
	});

	// 3. Photos in a brush mask, and image bands: the picture drifts inside its frame.
	document.querySelectorAll('.text-image__media.brush-photo img, .cta-band__media img, .pullquote__media img').forEach((img) => {
		const frame = img.closest('.text-image__media, .cta-band__media, .pullquote__media');
		gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
	});

	// Fern watermark: the background drifts a little slower than the section.
	document.querySelectorAll('.fern-left, .fern-right, .fern-both, #footer').forEach((el) => {
		gsap.fromTo(el, { '--fern-y': -18 }, { '--fern-y': 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
	});

	// 4. Pill strokes paint on left to right. Section edges are static.
	document.querySelectorAll('.pill').forEach((el) => {
		gsap.fromTo(el, { '--paint': 0 }, { '--paint': 1, duration: 1.3, ease: 'power1.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
	});

	root.classList.add('js-motion-ready');
}
