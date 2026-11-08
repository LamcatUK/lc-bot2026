/**
 * Pullquote Slider: shows the previous/next buttons and the count, and keeps
 * the count in step with the quote in view. The track is plain scroll-snap, so
 * without JavaScript it still scrolls by swipe or keyboard.
 */
export function initQuoteSliders() {
	document.querySelectorAll('.pullquote-slider__frame').forEach((frame) => {
		const track = frame.querySelector('.pullquote-slider__track');
		const controls = frame.querySelector('.pullquote-slider__controls');
		if (!track || !controls) return;

		const slides = [...track.children];
		const current = controls.querySelector('[data-current]');

		const index = () => Math.round(track.scrollLeft / track.clientWidth);
		const go = (i) => track.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, i)) * track.clientWidth });

		controls.hidden = false;
		controls.querySelectorAll('[data-dir]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const next = index() + Number(btn.dataset.dir);
				// wrap round, so the last quote leads back to the first
				go(next < 0 ? slides.length - 1 : next >= slides.length ? 0 : next);
			});
		});
		track.addEventListener('scroll', () => {
			current.textContent = String(index() + 1);
		}, { passive: true });
	});
}
