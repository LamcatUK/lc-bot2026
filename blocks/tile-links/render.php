<?php
/**
 * Tile Links.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$tiles   = is_array( $attributes['tiles'] ?? null ) ? $attributes['tiles'] : array();
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$ratio   = in_array( $attributes['tileRatio'] ?? '', array( 'original', 'landscape', 'square', 'portrait' ), true ) ? $attributes['tileRatio'] : 'landscape';
if ( ! $tiles ) {
	return;
}
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'tile-links section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<div class="grid tile-links__grid" style="--grid-min: 14rem" data-ratio="<?php echo esc_attr( $ratio ); ?>">
			<?php foreach ( $tiles as $tile ) { ?>
				<?php
				$url   = $tile['linkUrl'] ?? '';
				$title = $tile['title'] ?? '';
				$tag   = $url ? 'a' : 'div';
				?>
				<<?php echo esc_attr( $tag ); ?> class="tile-links__tile"<?php echo $url ? ' href="' . esc_url( $url ) . '"' : ''; ?>>
					<span class="tile-links__frame">
						<?php lc_bot2026_image( (int) ( $tile['image'] ?? 0 ), $tile['imageUrl'] ?? '', '', 'medium_large' ); ?>
						<span class="tile-links__title"><?php echo esc_html( $title ); ?></span>
					</span>
				</<?php echo esc_attr( $tag ); ?>>
			<?php } ?>
		</div>
	</div>
</section>
