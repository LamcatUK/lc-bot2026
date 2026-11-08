<?php
/**
 * Social Link Band. One big link out to the chosen network, from the address
 * in Site-Wide Settings. No embedded feed: a feed would load third-party
 * scripts on every page view.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$networks = array(
	'instagram' => array( 'Instagram', 'Find us on Instagram', 'Follow on Instagram' ),
	'facebook'  => array( 'Facebook', 'Join us on Facebook', 'Visit our Facebook page' ),
);
$network = isset( $networks[ $attributes['network'] ?? '' ] ) ? $attributes['network'] : 'instagram';
$url     = lc_bot2026_get_setting( $network . '_url' );
if ( ! $url ) {
	return;
}
$title   = ! empty( $attributes['title'] ) ? $attributes['title'] : $networks[ $network ][1];
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'brand', 'brand' );
$path    = trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' );
$handle  = $path ? '@' . basename( $path ) : '';
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'social-band section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container social-band__inner">
		<div>
			<h2><?php echo esc_html( $title ); ?></h2>
			<?php if ( ! empty( $attributes['text'] ) ) { ?>
				<p class="lead"><?php echo esc_html( $attributes['text'] ); ?></p>
			<?php } elseif ( $handle ) { ?>
				<p class="lead"><?php echo esc_html( $handle ); ?></p>
			<?php } ?>
		</div>
		<a class="btn social-band__btn" href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener">
			<?php if ( 'instagram' === $network ) { ?>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
			<?php } else { ?>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.5c0-.8.2-1.2 1.3-1.2H17V2.2C16.6 2.1 15.7 2 14.7 2 12.4 2 11 3.400 11 6.100V8H8v3.500h3V22h3.500V11.500h2.800L18 8h-4z"/></svg>
			<?php } ?>
			<?php echo esc_html( $networks[ $network ][2] ); ?>
			<span class="visually-hidden">(opens in a new tab)</span>
		</a>
	</div>
</section>
