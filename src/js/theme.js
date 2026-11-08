import { initNavToggle } from './nav-toggle';
import { initNavDropdowns } from './nav-dropdown';
import { initDialogs } from './dialog';
import { initPostFilters } from './post-filter';
import { initVideoFacades } from './video-facade';
import { initQuoteSliders } from './quote-slider';

document.addEventListener('DOMContentLoaded', () => {
	initNavToggle();
	initNavDropdowns();
	initDialogs();
	initPostFilters();
	initVideoFacades();
	initQuoteSliders();
});
