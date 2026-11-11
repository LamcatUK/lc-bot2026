<?php
/**
 * 301 redirects from the old backontrack.live structure to the 2026 site.
 *
 * A plain map rather than a plugin: the list is short and fixed. Blog posts
 * keep their /blog/{slug}/ URLs, so they need no entries. Fitness pages that
 * have a new page point at it; the rest (nutrition, courses) go to /fitness/.
 * Mirrored in the "Redirects" tab of the BOT 2026 inventory sheet.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Redirect rules: exact path (no trailing slash) => target, then regex rules.
 *
 * @return array{exact: array<string,string>, regex: array<string,string>}
 */
function lc_bot2026_redirect_rules() {
	return array(
		'exact' => array(
			'/about-us'                  => '/about/',
			'/contact-us'                => '/contact/',
			'/member-enquiries'          => '/',
			'/fitness-community'         => '/',
			'/hiking'                    => '/hikes/',
			'/event'                     => '/hikes/',
			'/previous-events'           => '/hikes/',
			'/in-sync-with-nature'       => '/nature-connected/',
			'/giving-back-to-nature'     => '/nature-connected/',
			'/blogs'                     => '/hiking-tips/blogs-news/',
			'/fitness-classes'           => '/fitness/classes/',
			'/schedule'                  => '/fitness/',
			'/book/fitness-packages'     => '/fitness/classes/',
			'/personal-training'         => '/fitness/personal-training/',
			'/running'                   => '/fitness/running/',
			'/nutrition'                 => '/fitness/',
			'/shop'                      => '/hikes/',
			'/store'                     => '/',
			'/newsletter'                => '/contact/',
			'/download'                  => '/',
			'/links'                     => '/',
			'/tips'                      => '/',
			'/demo'                      => '/',
			'/blog/love-hiking-blog-feb-2024' => '/blog/love-hiking-blog-feb-2025/',
			'/blog/a-guided-walk-blackheath'  => '/blog/a-self-guided-walk-blackheath/',
		),
		'regex' => array(
			'#^/events(/.*)?$#'          => '/hikes/',
			'#^/courses(/.*)?$#'         => '/fitness/',
			'#^/products(/.*)?$#'        => '/',
			'#^/testimonials(/.*)?$#'    => '/',
			'#^/tips/.+$#'               => '/',
			'#^/collaborations(/.*)?$#'  => '/hikes/collabs-events/',
		),
	);
}

/**
 * Send a 301 if the request matches a rule. Runs before WordPress resolves
 * templates, so a rule always wins over a 404 on the old URL.
 *
 * @return void
 */
function lc_bot2026_maybe_redirect() {
	if ( is_admin() || ! isset( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}
	$path = wp_parse_url( esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH );
	if ( ! $path ) {
		return;
	}
	$key   = '/' === $path ? '/' : untrailingslashit( $path );
	$rules = lc_bot2026_redirect_rules();
	$to    = $rules['exact'][ $key ] ?? '';
	if ( ! $to ) {
		foreach ( $rules['regex'] as $pattern => $target ) {
			if ( preg_match( $pattern, $key ) ) {
				$to = $target;
				break;
			}
		}
	}
	if ( $to ) {
		wp_redirect( $to, 301 ); // phpcs:ignore WordPress.Security.SafeRedirect.wp_redirect_wp_redirect -- targets are fixed in the rules above.
		exit;
	}
}
add_action( 'template_redirect', 'lc_bot2026_maybe_redirect', 1 );
