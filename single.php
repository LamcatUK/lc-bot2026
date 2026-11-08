<?php
/**
 * Single post template. Hero from the page-hero block, a narrow reading column,
 * then more posts from the same site term (hiking or fitness).
 *
 * @package lc-bot2026
 */

get_header();

while ( have_posts() ) {
	the_post();

	$site_term = lc_bot2026_post_site_term( get_the_ID() );
	$minutes   = estimate_reading_time_in_minutes( get_the_content() );
	$intro     = get_the_date() . ( $minutes ? ' · ' . $minutes . ' min read' : '' );

	echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- block output is escaped in its render.php.
		array(
			'blockName'    => 'lc-bot2026/page-hero',
			'attrs'        => array(
				'title'    => get_the_title(),
				'pillText' => $site_term ? $site_term->name : '',
				'intro'    => esc_html( $intro ),
			),
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		)
	);
	?>
	<article <?php post_class( 'post section' ); ?>>
		<div class="container post__body">
			<?php the_content(); ?>
			<?php
			$topics = get_the_category();
			if ( $topics ) {
				echo '<ul class="post__terms">';
				foreach ( $topics as $t ) {
					echo '<li>' . esc_html( $t->name ) . '</li>';
				}
				echo '</ul>';
			}
			?>
		</div>
	</article>
	<?php
	if ( $site_term ) {
		echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- block output is escaped in its render.php.
			array(
				'blockName'    => 'lc-bot2026/latest-news',
				'attrs'        => array(
					'title'   => 'More from the blog',
					'term'    => $site_term->slug,
					'count'   => 3,
					'showExcerpt' => false,
					'surface' => 'tint',
				),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);
	}
}

get_footer();
