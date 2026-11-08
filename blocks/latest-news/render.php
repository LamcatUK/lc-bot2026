<?php
/**
 * Latest Posts. Posts from one category term, optionally minus another.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$term    = sanitize_title( $attributes['term'] ?? '' );
$exclude = sanitize_title( $attributes['excludeTerm'] ?? '' );
$count   = max( 1, min( 24, (int) ( $attributes['count'] ?? 6 ) ) );
$paged   = ! empty( $attributes['paginate'] ) ? max( 1, (int) get_query_var( 'page' ), (int) get_query_var( 'paged' ) ) : 1;
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );

$args = array(
	'post_type'           => 'post',
	'post_status'         => 'publish',
	'posts_per_page'      => $count,
	'paged'               => $paged,
	'ignore_sticky_posts' => true,
);
if ( is_singular( 'post' ) ) {
	$args['post__not_in'] = array( get_the_ID() );
}
$tax = array();
if ( $term ) {
	$tax[] = array( 'taxonomy' => 'category', 'field' => 'slug', 'terms' => $term );
}
if ( $exclude ) {
	$tax[] = array( 'taxonomy' => 'category', 'field' => 'slug', 'terms' => $exclude, 'operator' => 'NOT IN' );
}
if ( $tax ) {
	$args['tax_query'] = $tax; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- small fixed query.
}

// Topic filter: chips list the topics used by the posts this block shows, so they
// always match the content. js/post-filter filters the cards in the browser.
$filters     = array();
$show_filter = ! empty( $attributes['showFilters'] );
if ( $show_filter ) {
	$all_ids = get_posts( array_merge( $args, array( 'fields' => 'ids', 'posts_per_page' => -1, 'paged' => 1 ) ) );
	$counts  = array();
	foreach ( $all_ids as $pid ) {
		foreach ( get_the_category( $pid ) as $t ) {
			if ( ! in_array( $t->slug, array( 'hiking', 'fitness' ), true ) ) {
				$counts[ $t->slug ] = array( 'name' => $t->name, 'n' => ( $counts[ $t->slug ]['n'] ?? 0 ) + 1 );
			}
		}
	}
	uasort( $counts, static function ( $a, $b ) { return $b['n'] <=> $a['n'] ?: strcmp( $a['name'], $b['name'] ); } );
	$filters = $counts;
	// All matching posts load at once and the chips filter them in the browser.
	$args['posts_per_page'] = -1;
	$args['paged']          = 1;
	$args['orderby'] = 'date';
	$args['order']   = 'DESC';
}
$q = new WP_Query( $args );
if ( ! $q->have_posts() ) {
	return;
}
$wrap = array( 'class' => 'latest-news section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface );
if ( $show_filter ) {
	$wrap['id'] = 'latest-news';
}
?>
<section <?php echo get_block_wrapper_attributes( $wrap ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<?php if ( $show_filter && count( $filters ) > 1 ) { ?>
			<div class="latest-news__filters" role="group" aria-label="Filter posts by topic" hidden>
				<button type="button" class="latest-news__chip" data-filter="" aria-pressed="true">All <span><?php echo esc_html( count( $all_ids ) ); ?></span></button>
				<?php foreach ( $filters as $slug => $f ) { ?>
					<button type="button" class="latest-news__chip" data-filter="<?php echo esc_attr( $slug ); ?>" aria-pressed="false"><?php echo esc_html( $f['name'] ); ?> <span><?php echo esc_html( $f['n'] ); ?></span></button>
				<?php } ?>
			</div>
			<p class="visually-hidden" role="status" aria-live="polite" data-filter-status></p>
		<?php } ?>
		<div class="grid latest-news__grid" style="--grid-min: 18rem">
			<?php
			$show_excerpt = ! isset( $attributes['showExcerpt'] ) || $attributes['showExcerpt'];
			$show_term    = ! isset( $attributes['showTerm'] ) || $attributes['showTerm'];
			while ( $q->have_posts() ) {
				$q->the_post();
				$card_term = $show_term ? lc_bot2026_card_term( get_the_ID() ) : null;
				$minutes   = estimate_reading_time_in_minutes( get_the_content() );
				?>
				<article class="latest-news__card" data-topics="<?php echo esc_attr( implode( ' ', wp_list_pluck( array_filter( get_the_category(), static function ( $t ) { return ! in_array( $t->slug, array( 'hiking', 'fitness' ), true ); } ), 'slug' ) ) ); ?>">
					<div class="latest-news__figure">
						<div class="latest-news__media" aria-hidden="true">
							<?php if ( has_post_thumbnail() ) { the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy', 'alt' => '' ) ); } ?>
						</div>
						<?php if ( $card_term ) { ?>
							<span class="latest-news__pill"><?php echo esc_html( $card_term->name ); ?></span>
						<?php } ?>
					</div>
					<div class="latest-news__body">
						<p class="latest-news__meta">
							<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
							<?php if ( $minutes ) { ?>
								<span aria-hidden="true">&middot;</span> <span><?php echo esc_html( $minutes ); ?> min read</span>
							<?php } ?>
						</p>
						<h3><a class="latest-news__link" href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<?php if ( $show_excerpt ) { ?>
							<p class="latest-news__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 22 ) ); ?></p>
						<?php } ?>
					</div>
				</article>
				<?php
			}
			wp_reset_postdata();
			?>
		</div>
		<?php if ( ! $show_filter && ! empty( $attributes['paginate'] ) && $q->max_num_pages > 1 ) { ?>
			<nav class="latest-news__pager" aria-label="Posts">
				<?php
				echo wp_kses_post(
					paginate_links(
						array(
							'base'      => trailingslashit( get_permalink() ) . '%_%',
							'format'    => 'page/%#%/',
							'current'   => $paged,
							'total'     => $q->max_num_pages,
							'prev_text' => 'Newer',
							'next_text' => 'Older',
						)
					)
				);
				?>
			</nav>
		<?php } ?>
	</div>
</section>
