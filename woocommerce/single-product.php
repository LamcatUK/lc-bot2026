<?php
/**
 * Single product. A hike (a product with a FooEvents date) gets the hero, the
 * hike's details and notes, and a booking box with the stock, price and Book
 * button. Anything else gets a plain product page.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) {
	the_post();
	global $product;
	$facts   = lc_bot2026_hike_facts( $product );
	$is_hike = (bool) $facts['ts'];
	$cats    = get_the_terms( get_the_ID(), 'product_cat' );
	$cat     = ( $cats && ! is_wp_error( $cats ) ) ? $cats[0] : null;
	$intro   = $is_hike ? implode( ' · ', array_filter( array( $facts['date'], $facts['time'], $facts['location'] ) ) ) : '';

	echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- block output is escaped in its render.php.
		array(
			'blockName'    => 'lc-bot2026/page-hero',
			'attrs'        => array(
				'title'    => get_the_title(),
				'pillText' => ( $cat && 'uncategorized' !== $cat->slug ) ? $cat->name : '',
				'intro'    => esc_html( $intro ),
			),
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		)
	);
	?>
	<article id="product-<?php the_ID(); ?>" <?php wc_product_class( 'hike section', $product ); ?>>
		<div class="container hike__grid">
			<div class="hike__main">
				<?php wc_print_notices(); ?>
				<?php if ( $product->get_short_description() ) { ?>
					<div class="lead"><?php echo wp_kses_post( $product->get_short_description() ); ?></div>
				<?php } ?>
				<div class="hike__content text-section__body"><?php the_content(); ?></div>
			</div>
			<aside class="hike__book" aria-label="Booking">
				<?php if ( $is_hike ) { ?>
					<dl class="hike__facts">
						<div><dt>Date</dt><dd><?php echo esc_html( $facts['date'] ); ?></dd></div>
						<?php if ( $facts['time'] ) { ?>
							<div><dt>Time</dt><dd><?php echo esc_html( $facts['time'] ); ?></dd></div>
						<?php } ?>
						<?php if ( $facts['location'] ) { ?>
							<div><dt>Meet at</dt><dd><?php echo esc_html( $facts['location'] ); ?></dd></div>
						<?php } ?>
					</dl>
				<?php } ?>
				<p class="hike__price"><?php echo wp_kses_post( $product->get_price_html() ); ?></p>
				<?php if ( 'nearly-full' === $facts['status'] ) { ?>
					<p class="hike__stock"><?php echo esc_html( 'Only ' . $facts['left'] . ' places left.' ); ?></p>
				<?php } elseif ( 'sold-out' === $facts['status'] ) { ?>
					<p class="hike__stock hike__stock--sold">This hike is sold out.</p>
				<?php } ?>
				<?php woocommerce_template_single_add_to_cart(); ?>
				<?php
				$calendar = $is_hike ? lc_bot2026_hike_calendar_links( $product ) : array();
				if ( $calendar ) {
					?>
					<div class="hike__calendar">
						<p class="hike__calendar-title">Add to calendar</p>
						<ul>
							<?php foreach ( $calendar as $label => $url ) { ?>
								<li><a href="<?php echo esc_url( $url ); ?>"<?php echo 0 === strpos( $url, 'https://' ) ? ' target="_blank" rel="noopener"' : ''; ?>><?php echo esc_html( $label ); ?></a></li>
							<?php } ?>
						</ul>
					</div>
				<?php } ?>
			</aside>
		</div>
		<?php $map = $is_hike ? (string) get_post_meta( get_the_ID(), 'lc_map_embed', true ) : ''; ?>
		<?php if ( $map ) { ?>
			<div class="container hike__map">
				<h2>Where we meet</h2>
				<iframe src="<?php echo esc_url( $map ); ?>" title="<?php echo esc_attr( 'Map of the start point: ' . $facts['location'] ); ?>" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
			</div>
		<?php } ?>
	</article>
	<?php
}

get_footer();
