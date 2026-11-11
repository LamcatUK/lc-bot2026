<?php
/**
 * Upcoming Hikes: FooEvents products from today on, grouped by month. Each row
 * is one link (the title's link is stretched over the row).
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'lc_bot2026_upcoming_hikes' ) ) {
	return;
}
$category = sanitize_title( $attributes['category'] ?? '' );
$hikes    = lc_bot2026_upcoming_hikes( $category ? array( $category ) : array(), (int) ( $attributes['count'] ?? 0 ) );
$surface  = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$images   = ! isset( $attributes['showImages'] ) || ! empty( $attributes['showImages'] );
$groups   = array();
foreach ( $hikes as $product ) {
	$facts = lc_bot2026_hike_facts( $product );
	if ( ! $facts['ts'] ) {
		continue;
	}
	$groups[ wp_date( 'F Y', $facts['ts'] ) ][] = array( $product, $facts );
}
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'hikes-list section' . ( $images ? ' hikes-list--images' : '' ) . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<?php if ( ! $groups ) { ?>
			<p class="hikes-list__empty lead">No hikes are listed just now. New dates are added regularly, so check back soon or sign up to the newsletter to hear first.</p>
		<?php } ?>
		<?php foreach ( $groups as $month => $rows ) { ?>
			<div class="hikes-list__month">
				<h3><?php echo esc_html( $month ); ?></h3>
				<ul class="hikes-list__list">
					<?php foreach ( $rows as list( $product, $facts ) ) { ?>
						<li class="hikes-list__item" data-status="<?php echo esc_attr( $facts['status'] ); ?>">
							<div class="hikes-list__date" aria-hidden="true">
								<span class="hikes-list__dow"><?php echo esc_html( wp_date( 'D', $facts['ts'] ) ); ?></span>
								<span class="hikes-list__day"><?php echo esc_html( wp_date( 'j', $facts['ts'] ) ); ?></span>
								<span class="hikes-list__mon"><?php echo esc_html( wp_date( 'M', $facts['ts'] ) ); ?></span>
							</div>
							<?php if ( $images ) { ?>
								<div class="hikes-list__thumb brush-photo" aria-hidden="true">
									<?php
									$thumb_id = (int) get_post_thumbnail_id( $product->get_id() );
									if ( $thumb_id ) {
										lc_bot2026_image( $thumb_id, '', '', 'medium', 'lazy' );
									}
									?>
								</div>
							<?php } ?>
							<div class="hikes-list__body">
								<h4><a class="hikes-list__link" href="<?php echo esc_url( get_permalink( $product->get_id() ) ); ?>"><?php echo esc_html( $product->get_name() ); ?></a></h4>
								<p class="hikes-list__meta">
									<span class="visually-hidden"><?php echo esc_html( $facts['date'] ); ?>. </span>
									<?php echo esc_html( implode( ' · ', array_filter( array( $facts['time'], $facts['location'] ) ) ) ); ?>
								</p>
								<?php if ( $product->get_short_description() ) { ?>
									<div class="hikes-list__desc"><?php echo wp_kses_post( wp_trim_words( wp_strip_all_tags( $product->get_short_description() ), 24 ) ); ?></div>
								<?php } ?>
							</div>
							<div class="hikes-list__side">
								<span class="hikes-list__price"><?php echo wp_kses_post( $product->get_price_html() ); ?></span>
								<?php if ( 'sold-out' === $facts['status'] ) { ?>
									<span class="hikes-list__tag hikes-list__tag--sold">Sold out</span>
								<?php } elseif ( 'nearly-full' === $facts['status'] ) { ?>
									<span class="hikes-list__tag"><?php echo esc_html( 'Only ' . $facts['left'] . ' left' ); ?></span>
								<?php } ?>
							</div>
						</li>
					<?php } ?>
				</ul>
			</div>
		<?php } ?>
		<?php if ( ! empty( $attributes['seeAllUrl'] ) ) { ?>
			<p class="hikes-list__more"><?php lc_bot2026_link( $attributes['seeAllText'] ?: 'See all hikes', $attributes['seeAllUrl'], 'btn' ); ?></p>
		<?php } ?>
	</div>
</section>
