<?php
/**
 * Page Hero. Dark brand section; photo, when set, sits behind the copy under a scrim.
 * Falls back to the page title and featured image.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$title    = ! empty( $attributes['title'] ) ? $attributes['title'] : get_the_title();
$image_id = (int) ( $attributes['imageId'] ?? 0 );
$image_url = $attributes['imageUrl'] ?? '';
if ( ! $image_id && ! $image_url && has_post_thumbnail() ) {
	$image_id = (int) get_post_thumbnail_id();
}
$has_image = $image_id || $image_url;
$classes   = 'page-hero section' . ( ! empty( $attributes['brushEdge'] ) ? ' brush-edge' : '' ) . ( $has_image ? ' page-hero--image' : '' );
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => $classes, 'data-surface' => 'brand' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $has_image ) { ?>
		<div class="page-hero__media" aria-hidden="true"><?php lc_bot2026_image( $image_id, $image_url, '', 'full', 'eager' ); ?></div>
	<?php } ?>
	<div class="container page-hero__inner">
		<?php if ( ! empty( $attributes['pillText'] ) ) { ?>
			<p class="pill"><?php echo esc_html( $attributes['pillText'] ); ?></p>
		<?php } ?>
		<h1><?php echo esc_html( $title ); ?></h1>
		<?php if ( ! empty( $attributes['intro'] ) ) { ?>
			<div class="lead"><?php echo wp_kses_post( $attributes['intro'] ); ?></div>
		<?php } ?>
		<?php lc_bot2026_link( $attributes['ctaText'] ?? '', $attributes['ctaUrl'] ?? '', 'btn' ); ?>
	</div>
</section>
