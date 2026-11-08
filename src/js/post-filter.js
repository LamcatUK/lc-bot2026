/**
 * Topic filter for the Latest Posts block. The chips are buttons rendered
 * hidden; this shows them and hides/shows the cards by their data-topics.
 * ?topic=slug in the address is honoured on load and kept up to date, so a
 * filtered view can be shared. No JavaScript means all posts, unfiltered.
 */
export function initPostFilters() {
	document.querySelectorAll('.latest-news__filters').forEach((bar) => {
		const section = bar.closest('.latest-news');
		const cards = [...section.querySelectorAll('.latest-news__card')];
		const chips = [...bar.querySelectorAll('[data-filter]')];
		const status = section.querySelector('[data-filter-status]');

		const apply = (slug, push) => {
			let shown = 0;
			cards.forEach((card) => {
				const match = !slug || card.dataset.topics.split(' ').includes(slug);
				card.hidden = !match;
				if (match) shown += 1;
			});
			chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === slug)));
			if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'post' : 'posts'}`;
			if (push) {
				const url = new URL(window.location.href);
				if (slug) url.searchParams.set('topic', slug);
				else url.searchParams.delete('topic');
				window.history.replaceState(null, '', url);
			}
		};

		chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset.filter, true)));
		bar.hidden = false;

		const initial = new URLSearchParams(window.location.search).get('topic') || '';
		apply(chips.some((c) => c.dataset.filter === initial) ? initial : '', false);
	});
}
