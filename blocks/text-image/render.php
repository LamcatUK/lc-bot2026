<?php
/**
 * Text and Image.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$surface   = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$side      = 'left' === ( $attributes['imageSide'] ?? '' ) ? ' text-image--left' : '';
$image_id  = (int) ( $attributes['imageId'] ?? 0 );
$image_url = $attributes['imageUrl'] ?? '';
$ratio     = in_array( $attributes['imageRatio'] ?? '', array( 'original', 'landscape', 'widescreen', 'square', 'portrait' ), true ) ? $attributes['imageRatio'] : 'original';
$video     = lc_bot2026_parse_video_url( $attributes['videoUrl'] ?? '' );
$poster    = $video ? lc_bot2026_video_poster_url( $video ) : '';
$vshapes   = array( 'landscape' => 1.5, 'widescreen' => 16 / 9, 'square' => 1.0, 'portrait' => 0.75 );
$vshape    = $vshapes[ $ratio ] ?? 16 / 9; // the player is always 16:9; the still crops to the chosen shape.
$vlabel    = ! empty( $attributes['title'] ) ? $attributes['title'] : 'video';
$mask      = ! empty( $attributes['brushMask'] ) ? ' brush-photo' : '';
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'text-image section' . $side . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container text-image__grid">
		<div class="text-image__copy">
			<?php if ( ! empty( $attributes['title'] ) ) { ?>
				<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
			<?php } ?>
			<?php if ( ! empty( $attributes['content'] ) ) { ?>
				<div class="text-section__body"><?php echo wp_kses_post( wpautop( $attributes['content'] ) ); ?></div>
			<?php } ?>
			<?php lc_bot2026_link( $attributes['ctaText'] ?? '', $attributes['ctaUrl'] ?? '', 'btn' ); ?>
		</div>
		<?php if ( $video ) { ?>
			<div class="text-image__media text-image__media--video<?php echo esc_attr( $mask ); ?>">
				<button type="button" class="video-facade" style="--video-aspect: <?php echo esc_attr( round( $vshape, 4 ) ); ?>" data-play="modal" data-embed="<?php echo esc_url( $video['embed'] ); ?>" data-title="<?php echo esc_attr( $vlabel ); ?>">
					<?php if ( $poster ) { ?>
						<img class="video-facade__poster" src="<?php echo esc_url( $poster ); ?>" alt="" loading="lazy">
					<?php } ?>
					<span class="video-facade__play" aria-hidden="true"></span>
					<span class="visually-hidden"><?php echo esc_html( 'Play video: ' . $vlabel ); ?></span>
				</button>
			</div>
		<?php } elseif ( $image_id || $image_url ) { ?>
			<div class="text-image__media<?php echo esc_attr( $mask ); ?>" data-ratio="<?php echo esc_attr( $ratio ); ?>">
				<?php lc_bot2026_image( $image_id, $image_url, $attributes['imageAlt'] ?? '', 'large' ); ?>
			</div>
		<?php } ?>
	</div>
</section>
