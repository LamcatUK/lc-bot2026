<?php
/**
 * Hikes: WooCommerce products booked with FooEvents. A hike's date is the
 * FooEvents "WooCommerceEventsDateTimestamp" meta, so the list is a plain
 * meta query: upcoming only, soonest first. Hikes are told apart by product
 * category (Guided hikes, Challenges, Collabs and events), one category per
 * sub-page of the sitemap.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Upcoming hikes, soonest first.
 *
 * @param string[] $categories Product category slugs. Empty = all hikes.
 * @param int      $limit      How many; 0 = all.
 * @return WC_Product[]
 */
function lc_bot2026_upcoming_hikes( $categories = array(), $limit = 0 ) {
	if ( ! function_exists( 'wc_get_product' ) ) {
		return array();
	}
	$args = array(
		'post_type'      => 'product',
		'post_status'    => 'publish',
		'posts_per_page' => $limit > 0 ? (int) $limit : -1,
		'fields'         => 'ids',
		'meta_key'       => 'WooCommerceEventsDateTimestamp', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- small fixed query.
		'orderby'        => 'meta_value_num',
		'order'          => 'ASC',
		'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
			array(
				'key'     => 'WooCommerceEventsDateTimestamp',
				'value'   => strtotime( 'today', current_time( 'timestamp' ) ), // phpcs:ignore WordPress.DateTime.CurrentTimeTimestamp.Requested -- compared with a site-local timestamp saved by FooEvents.
				'compare' => '>=',
				'type'    => 'NUMERIC',
			),
		),
	);
	$slugs = array_filter( array_map( 'sanitize_title', (array) $categories ) );
	if ( $slugs ) {
		$args['tax_query'] = array( array( 'taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $slugs ) ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
	}
	$out = array();
	foreach ( get_posts( $args ) as $id ) {
		$product = wc_get_product( $id );
		if ( $product ) {
			$out[] = $product;
		}
	}
	return $out;
}

/**
 * The facts about a hike, read from FooEvents' meta.
 *
 * @param WC_Product $product Hike product.
 * @return array{ts:int,date:string,time:string,location:string,status:string,left:int|null}
 */
function lc_bot2026_hike_facts( $product ) {
	$id    = $product->get_id();
	$ts    = (int) get_post_meta( $id, 'WooCommerceEventsDateTimestamp', true );
	$hour  = (string) get_post_meta( $id, 'WooCommerceEventsHour', true );
	$min   = (string) get_post_meta( $id, 'WooCommerceEventsMinutes', true );
	$endh  = (string) get_post_meta( $id, 'WooCommerceEventsHourEnd', true );
	$endm  = (string) get_post_meta( $id, 'WooCommerceEventsMinutesEnd', true );
	$time  = '';
	if ( '' !== $hour && '00' !== $hour ) {
		$time = $hour . ':' . ( '' !== $min ? $min : '00' );
		if ( '' !== $endh && '00' !== $endh ) {
			$time .= ' to ' . $endh . ':' . ( '' !== $endm ? $endm : '00' );
		}
	}
	$left   = $product->managing_stock() ? $product->get_stock_quantity() : null;
	$status = 'open';
	if ( ! $product->is_in_stock() ) {
		$status = 'sold-out';
	} elseif ( null !== $left && $left > 0 && $left < 4 ) {
		$status = 'nearly-full';
	}
	return array(
		'ts'       => $ts,
		'date'     => $ts ? wp_date( 'l j F Y', $ts ) : '',
		'time'     => $time,
		'location' => (string) get_post_meta( $id, 'WooCommerceEventsLocation', true ),
		'status'   => $status,
		'left'     => $left,
	);
}

// The hike page says "Only N places left" itself, so drop WooCommerce's own "N in stock" line.
add_filter( 'woocommerce_get_stock_html', '__return_empty_string' );

/**
 * The basket link for the header: a basket icon with the number of tickets, and
 * only when there is something in the basket. The wrapper is always printed so
 * WooCommerce's cart fragments can fill it in when the basket changes without a
 * page load.
 *
 * @return string
 */
function lc_bot2026_basket_link() {
	$count = ( function_exists( 'WC' ) && WC()->cart ) ? (int) WC()->cart->get_cart_contents_count() : 0;
	$html  = '<span class="navbar-basket-wrap" data-basket>';
	if ( $count > 0 ) {
		$label = sprintf( /* translators: %d: number of items. */ _n( 'Basket, %d item', 'Basket, %d items', $count, 'lc-bot2026' ), $count );
		$html .= '<a class="navbar-basket" href="' . esc_url( wc_get_cart_url() ) . '" aria-label="' . esc_attr( $label ) . '">'
			. '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h20l-2 11H5L3 10Z"/><path d="M8 10l4-6M18 10l-4-6"/></svg>'
			. '<span class="navbar-basket__count" aria-hidden="true">' . $count . '</span></a>';
	}
	return $html . '</span>';
}

/**
 * Keep the header basket in step with WooCommerce's cart fragments.
 *
 * @param array $fragments Fragments keyed by selector.
 * @return array
 */
function lc_bot2026_basket_fragment( $fragments ) {
	$fragments['span.navbar-basket-wrap'] = lc_bot2026_basket_link();
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'lc_bot2026_basket_fragment' );

/**
 * Start and end of a hike as local "YmdTHis" strings, for calendar links. The
 * end is the FooEvents end time, or three hours on when there is none.
 *
 * @param int $id Hike product ID.
 * @return array{start:string,end:string}|null
 */
function lc_bot2026_hike_times( $id ) {
	$mysql = (string) get_post_meta( $id, 'WooCommerceEventsDateMySQLFormat', true );
	if ( '' === $mysql ) {
		return null;
	}
	$start = new DateTime( $mysql, new DateTimeZone( 'Europe/London' ) );
	$endh  = (string) get_post_meta( $id, 'WooCommerceEventsHourEnd', true );
	$endm  = (string) get_post_meta( $id, 'WooCommerceEventsMinutesEnd', true );
	$end   = clone $start;
	if ( '' !== $endh && '00' !== $endh ) {
		$end->setTime( (int) $endh, (int) $endm );
	}
	if ( $end <= $start ) {
		$end = ( clone $start )->modify( '+3 hours' );
	}
	return array(
		'start' => $start->format( 'Ymd\THis' ),
		'end'   => $end->format( 'Ymd\THis' ),
	);
}

/**
 * Add-to-calendar links for a hike: Google Calendar, and an .ics file that
 * Apple Calendar, Outlook and the rest open.
 *
 * @param WC_Product $product Hike product.
 * @return array<string,string> label => URL
 */
function lc_bot2026_hike_calendar_links( $product ) {
	$id    = $product->get_id();
	$times = lc_bot2026_hike_times( $id );
	if ( ! $times ) {
		return array();
	}
	$loc    = (string) get_post_meta( $id, 'WooCommerceEventsLocation', true );
	$google = add_query_arg(
		array(
			'action'   => 'TEMPLATE',
			'text'     => rawurlencode( $product->get_name() ),
			'dates'    => $times['start'] . '/' . $times['end'],
			'ctz'      => 'Europe/London',
			'location' => rawurlencode( $loc ),
			'details'  => rawurlencode( 'Back on Track: ' . get_permalink( $id ) ),
		),
		'https://calendar.google.com/calendar/render'
	);
	return array(
		'Google Calendar'        => $google,
		'Apple / Outlook (.ics)' => add_query_arg( 'hike-ics', $id, home_url( '/' ) ),
	);
}

/**
 * Serve a hike's .ics file at /?hike-ics=ID.
 *
 * @return void
 */
function lc_bot2026_serve_ics() {
	if ( empty( $_GET['hike-ics'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- public read-only download.
		return;
	}
	$id    = absint( $_GET['hike-ics'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$post  = get_post( $id );
	$times = $post && 'product' === $post->post_type && 'publish' === $post->post_status ? lc_bot2026_hike_times( $id ) : null;
	if ( ! $times ) {
		return;
	}
	$esc = static function ( $text ) {
		return preg_replace( '/([,;\\\\])/', '\\\\$1', str_replace( array( "\r", "\n" ), ' ', wp_strip_all_tags( (string) $text ) ) );
	};
	$lines = array(
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Back on Track//Hikes//EN',
		'CALSCALE:GREGORIAN',
		'BEGIN:VEVENT',
		'UID:hike-' . $id . '@' . wp_parse_url( home_url(), PHP_URL_HOST ),
		'DTSTAMP:' . gmdate( 'Ymd\THis\Z' ),
		'DTSTART;TZID=Europe/London:' . $times['start'],
		'DTEND;TZID=Europe/London:' . $times['end'],
		'SUMMARY:' . $esc( $post->post_title ),
		'LOCATION:' . $esc( get_post_meta( $id, 'WooCommerceEventsLocation', true ) ),
		'DESCRIPTION:' . $esc( get_permalink( $id ) ),
		'URL:' . get_permalink( $id ),
		'END:VEVENT',
		'END:VCALENDAR',
	);
	nocache_headers();
	header( 'Content-Type: text/calendar; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="hike-' . $id . '.ics"' );
	echo implode( "\r\n", $lines ) . "\r\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
	exit;
}
add_action( 'template_redirect', 'lc_bot2026_serve_ics' );

/**
 * A "Meeting-point map" box on the hike edit screen. Paste Google's embed code
 * (or just its address) and only the Google Maps embed address is kept.
 *
 * @return void
 */
function lc_bot2026_add_map_meta_box() {
	add_meta_box( 'lc-hike-map', __( 'Meeting-point map', 'lc-bot2026' ), 'lc_bot2026_render_map_meta_box', 'product', 'normal', 'default' );
}
add_action( 'add_meta_boxes', 'lc_bot2026_add_map_meta_box' );

/**
 * Print the map box.
 *
 * @param WP_Post $post Product being edited.
 * @return void
 */
function lc_bot2026_render_map_meta_box( $post ) {
	wp_nonce_field( 'lc_bot2026_map', 'lc_bot2026_map_nonce' );
	$value = (string) get_post_meta( $post->ID, 'lc_map_embed', true );
	?>
	<p><label for="lc_bot2026_map_embed"><strong><?php esc_html_e( 'Google Maps embed code', 'lc-bot2026' ); ?></strong></label></p>
	<textarea id="lc_bot2026_map_embed" name="lc_bot2026_map_embed" rows="3" class="widefat" placeholder="&lt;iframe src=&quot;https://www.google.com/maps/embed?pb=...&quot;&gt;&lt;/iframe&gt;"><?php echo esc_textarea( $value ); ?></textarea>
	<p class="description"><?php esc_html_e( 'In Google Maps, find the meeting point, choose Share, then Embed a map, then Copy HTML, and paste it here. It shows under "Where we meet" on the hike page. Leave blank for no map.', 'lc-bot2026' ); ?></p>
	<?php
}

/**
 * Save the map box. Keeps only a Google Maps embed address, never raw HTML.
 *
 * @param int $post_id Product ID.
 * @return void
 */
function lc_bot2026_save_map_meta_box( $post_id ) {
	if ( ! isset( $_POST['lc_bot2026_map_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lc_bot2026_map_nonce'] ) ), 'lc_bot2026_map' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}
	$raw = isset( $_POST['lc_bot2026_map_embed'] ) ? wp_unslash( $_POST['lc_bot2026_map_embed'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- only a Google Maps address is extracted below.
	if ( preg_match( '#https://www\.google\.com/maps/embed[^"\'\s<>]+#', html_entity_decode( $raw ), $m ) ) {
		update_post_meta( $post_id, 'lc_map_embed', esc_url_raw( $m[0] ) );
	} elseif ( '' === trim( $raw ) ) {
		delete_post_meta( $post_id, 'lc_map_embed' );
	}
}
add_action( 'save_post_product', 'lc_bot2026_save_map_meta_box' );
