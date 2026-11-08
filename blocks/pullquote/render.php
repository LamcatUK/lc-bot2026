<?php
/**
 * Pullquote. One quote is set large on its own; two or more become a slider.
 * The slider is a plain scroll-snap track, so it also works by swipe and by
 * keyboard; src/js/quote-slider.js adds the buttons and the count. No autoplay.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$quotes = array_values(
	array_filter(
		is_array( $attributes['quotes'] ?? null ) ? $attributes['quotes'] : array(),
		static function ( $q ) {
			return ! empty( $q['quote'] );
		}
	)
);
if ( ! $quotes ) {
	return;
}
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$total   = count( $quotes );
$title   = $attributes['title'] ?? '';

/**
 * Print one quote as a figure.
 *
 * @param array $q Quote row: quote, name, detail.
 */
$figure = static function ( $q ) {
	?>
	<figure class="pullquote__figure">
		<blockquote><p><?php echo esc_html( $q['quote'] ); ?></p></blockquote>
		<?php if ( ! empty( $q['name'] ) ) { ?>
			<figcaption>
				<strong><?php echo esc_html( $q['name'] ); ?></strong>
				<?php if ( ! empty( $q['detail'] ) ) { ?>
					<span><?php echo esc_html( $q['detail'] ); ?></span>
				<?php } ?>
			</figcaption>
		<?php } ?>
	</figure>
	<?php
};
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'pullquote section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( $title ) { ?>
			<h2><?php echo esc_html( $title ); ?></h2>
		<?php } ?>
		<?php if ( 1 === $total ) { ?>
			<?php $figure( $quotes[0] ); ?>
		<?php } else { ?>
			<div class="pullquote-slider__frame" role="region" aria-roledescription="carousel" aria-label="<?php echo esc_attr( $title ? $title : 'Client quotes' ); ?>">
				<ul class="pullquote-slider__track" tabindex="0">
					<?php foreach ( $quotes as $i => $q ) { ?>
						<li class="pullquote-slider__slide" role="group" aria-roledescription="slide" aria-label="<?php echo esc_attr( ( $i + 1 ) . ' of ' . $total ); ?>">
							<?php $figure( $q ); ?>
						</li>
					<?php } ?>
				</ul>
				<div class="pullquote-slider__controls" hidden>
					<button type="button" class="pullquote-slider__btn" data-dir="-1" aria-label="Previous quote"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 3 5 9l6 6"/></svg></button>
					<span class="pullquote-slider__count" aria-live="polite"><span data-current>1</span> / <?php echo (int) $total; ?></span>
					<button type="button" class="pullquote-slider__btn" data-dir="1" aria-label="Next quote"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m7 3 6 6-6 6"/></svg></button>
				</div>
			</div>
		<?php } ?>
	</div>
</section>
