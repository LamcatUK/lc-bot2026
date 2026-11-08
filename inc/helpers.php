<?php
/**
 * Project-specific helpers used by block render.php files.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Print an image from an attachment ID, falling back to a plain URL.
 *
 * @param int    $id      Attachment ID, 0 if none.
 * @param string $url     Fallback URL.
 * @param string $alt     Alt text, used for URL fallback and when the attachment has none.
 * @param string $size    Image size slug.
 * @param string $loading 'lazy' or 'eager'.
 * @param string $class   Extra class on the img.
 * @return void
 */
function lc_bot2026_image( $id, $url = '', $alt = '', $size = 'large', $loading = 'lazy', $class = '' ) {
	$attrs = array(
		'loading' => $loading,
		'class'   => $class,
	);
	if ( $id ) {
		if ( '' !== $alt ) {
			$attrs['alt'] = $alt;
		}
		echo wp_get_attachment_image( (int) $id, $size, false, $attrs ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core-escaped.
		return;
	}
	if ( $url ) {
		printf(
			'<img src="%s" alt="%s" loading="%s" class="%s">',
			esc_url( $url ),
			esc_attr( $alt ),
			esc_attr( $loading ),
			esc_attr( $class )
		);
	}
}

/**
 * Print a link, or nothing if there is no URL or text.
 *
 * @param string $text  Link text.
 * @param string $url   Link URL.
 * @param string $class CSS classes.
 * @return void
 */
function lc_bot2026_link( $text, $url, $class = 'btn' ) {
	if ( ! $url || ! $text ) {
		return;
	}
	printf( '<a class="%s" href="%s">%s</a>', esc_attr( $class ), esc_url( $url ), esc_html( $text ) );
}

/**
 * Whitelist a block surface value.
 *
 * @param string $value   Saved attribute.
 * @param string $default Fallback.
 * @return string
 */
function lc_bot2026_surface( $value, $default = 'surface' ) {
	return in_array( $value, array( 'surface', 'tint', 'soft', 'brand' ), true ) ? $value : $default;
}

/**
 * Add a fitness theme class to the body for anything under /fitness/.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function lc_bot2026_fitness_body_class( $classes ) {
	$path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '';
	if ( $path && preg_match( '#^/fitness(/|$)#', $path ) ) {
		$classes[] = 'theme-fitness';
	}
	return $classes;
}
add_filter( 'body_class', 'lc_bot2026_fitness_body_class' );

/**
 * The site term (hiking or fitness) a post belongs to. Hiking wins when a
 * post has both, since the hiking site is the main one.
 *
 * @param int $post_id Post ID.
 * @return WP_Term|null
 */
function lc_bot2026_post_site_term( $post_id ) {
	foreach ( array( 'hiking', 'fitness' ) as $slug ) {
		if ( has_term( $slug, 'category', $post_id ) ) {
			return get_term_by( 'slug', $slug, 'category' );
		}
	}
	return null;
}

/**
 * Posts that only belong to Fitness use the fitness colours.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function lc_bot2026_fitness_post_body_class( $classes ) {
	if ( is_singular( 'post' ) ) {
		$term = lc_bot2026_post_site_term( get_the_ID() );
		if ( $term && 'fitness' === $term->slug ) {
			$classes[] = 'theme-fitness';
		}
	}
	return $classes;
}
add_filter( 'body_class', 'lc_bot2026_fitness_post_body_class' );

/**
 * The topic term for a post card label (Running, Nutrition, Seasons ...).
 * Hiking and Fitness are the site terms, not topics, so they never show here.
 * Each post carries one topic.
 *
 * @param int $post_id Post ID.
 * @return WP_Term|null
 */
function lc_bot2026_card_term( $post_id ) {
	foreach ( get_the_category( $post_id ) as $t ) {
		if ( ! in_array( $t->slug, array( 'hiking', 'fitness' ), true ) ) {
			return $t;
		}
	}
	return null;
}

/**
 * Extra classes for a content block: the brush top edge and the spacing
 * choices. "none" and "small" trim the block's own top or bottom padding, for
 * back-to-back sections that share a background colour.
 *
 * @param array $attributes Block attributes.
 * @return string Leading-space class string.
 */
function lc_bot2026_section_extras( $attributes ) {
	$out = ! empty( $attributes['brushTop'] ) ? ' brush-top' : '';
	foreach ( array( 'spaceTop' => 'space-top', 'spaceBottom' => 'space-bottom' ) as $key => $class ) {
		$v = $attributes[ $key ] ?? 'normal';
		if ( in_array( $v, array( 'none', 'small' ), true ) ) {
			$out .= ' ' . $class . '-' . $v;
		}
	}
	return $out;
}
