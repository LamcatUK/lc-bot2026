<?php
/**
 * 301 redirects from the old backontrack.live structure to the 2026 site.
 *
 * A plain map rather than a plugin: the list is short and fixed. Blog posts
 * keep their /blog/{slug}/ URLs, so they need no entries. Fitness pages that
 * have a new page point at it; the rest (nutrition, courses) go to /fitness/.
 * Fitness lives on its own site, so /fitness/... targets are resolved by
 * lc_bot2026_resolve_redirect_target(): kept local on the Fitness site (as
 * /classes/ etc.) and sent to the other site from the Hiking site.
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
 * Turn a rule target into the address to send the visitor to. A target under
 * /fitness/ belongs to the Fitness site and loses the prefix there (/fitness/classes/
 * becomes /classes/); everything else belongs to the Hiking site. A target that
 * lives on the other site goes there, or to the home page if its address is not set.
 *
 * @param string $to Rule target, a path.
 * @return string
 */
function lc_bot2026_resolve_redirect_target( $to ) {
	$fitness_target = (bool) preg_match( '#^/fitness(/|$)#', $to );
	if ( $fitness_target ) {
		$to = '/' . ltrim( substr( $to, strlen( '/fitness' ) ), '/' );
	}
	if ( $fitness_target === lc_bot2026_is_fitness_site() ) {
		return $to;
	}
	$other = untrailingslashit( lc_bot2026_get_setting( 'sister_site_url' ) );
	return $other ? $other . $to : '/';
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
	if ( ! $to && preg_match( '#^/fitness(/|$)#', $key ) ) {
		$to = trailingslashit( $key );
	}
	if ( $to ) {
		$to = lc_bot2026_resolve_redirect_target( $to );
		if ( untrailingslashit( $to ) === $key ) {
			return; // The old URL is also the new one (e.g. /running/ on the Fitness site).
		}
		wp_redirect( $to, 301 ); // phpcs:ignore WordPress.Security.SafeRedirect.wp_redirect_wp_redirect -- targets come from the rules above and the saved other-site address.
		exit;
	}
}
add_action( 'template_redirect', 'lc_bot2026_maybe_redirect', 1 );
