<?php
/**
 * Text Section.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$align   = 'center' === ( $attributes['align'] ?? '' ) ? ' text-section--center' : '';
$edge    = ! empty( $attributes['brushEdge'] ) ? ' brush-edge' : '';
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'text-section section' . $align . $edge . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<?php if ( ! empty( $attributes['content'] ) ) { ?>
			<div class="text-section__body"><?php echo wp_kses_post( wpautop( $attributes['content'] ) ); ?></div>
		<?php } ?>
	</div>
</section>
