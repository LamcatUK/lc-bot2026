<?php
/**
 * Call to Action Band.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$surface = lc_bot2026_surface( $attributes['surface'] ?? 'soft', 'soft' );
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'cta-band section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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
