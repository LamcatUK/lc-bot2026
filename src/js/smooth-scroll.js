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
export function initSmoothScroll() {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (typeof window.Lenis !== 'function' || reduce) {
		return;
	}

	// autoRaf: Lenis runs its own animation loop. A lower lerp feels softer.
	const lenis = new window.Lenis({ autoRaf: true, anchors: false, lerp: 0.09 });
	window.lcLenis = lenis;

	document.addEventListener('click', (event) => {
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
					target.focus({ preventScroll: true });
					window.history.pushState(null, '', `#${id}`);
				}
			},
		});
	});
}
