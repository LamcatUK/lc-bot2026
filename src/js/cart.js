/**
 * Removing the last item from the basket updates the page in place through
 * WooCommerce's script, which leaves the page empty. Reloading shows the empty
 * basket message and clears the header basket icon.
 */
export function initCart() {
	if (!window.jQuery) return;
	window.jQuery(document.body).on('wc_cart_emptied', () => window.location.reload());
}
