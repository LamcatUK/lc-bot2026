<?php
/**
 * Page template.
 *
 * Most projects build page layouts from native blocks rather than the_content()
 * directly — override this per project as needed.
 *
 * @package lc-bot2026
 */

get_header();
?>

<?php
// Full-bleed: every native block builds its own .container, and core text
// blocks are wrapped in one by lc_bot2026_wrap_block_in_container().
// The booking pages (basket, attendee details, checkout, account) are plain
// WooCommerce/FooEvents output, so give them a title and a container.
$lc_woo_page = function_exists( 'is_woocommerce' ) && ( is_cart() || is_checkout() || is_account_page() || is_page( 'attendee-details' ) );

while ( have_posts() ) {
	the_post();
	if ( $lc_woo_page ) {
		echo '<section class="section woo-page"><div class="container"><h1>' . esc_html( get_the_title() ) . '</h1>';
		the_content();
		echo '</div></section>';
	} else {
		the_content();
	}
}
?>

<?php
get_footer();
