<?php
/**
 * Call to Action Band.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$surface   = lc_bot2026_surface( $attributes['surface'] ?? 'soft', 'soft' );
$has_image = ! empty( $attributes['imageId'] ) || ! empty( $attributes['imageUrl'] );
if ( $has_image ) {
	$surface = 'brand';
}
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'cta-band section' . ( $has_image ? ' cta-band--image' : '' ) . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $has_image ) { ?>
		<div class="cta-band__media" aria-hidden="true"><div class="cta-band__media-inner"><?php lc_bot2026_image( $attributes['imageId'] ?? 0, $attributes['imageUrl'] ?? '', '', 'full', 'lazy' ); ?></div></div>
	<?php } ?>
	<div class="container cta-band__inner">
		<div>
			<?php if ( ! empty( $attributes['title'] ) ) { ?>
				<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
			<?php } ?>
			<?php if ( ! empty( $attributes['text'] ) ) { ?>
				<p class="lead"><?php echo esc_html( $attributes['text'] ); ?></p>
			<?php } ?>
		</div>
		<?php lc_bot2026_link( $attributes['ctaText'] ?? '', $attributes['ctaUrl'] ?? '', 'btn' ); ?>
	</div>
</section>
