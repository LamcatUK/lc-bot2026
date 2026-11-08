<?php
/**
 * Page template.
 *
 * Most projects build page layouts from native blocks rather than the_content()
 * directly — override this per project as needed.
 *
 * @package lc-bot2026
 */

get_header();
?>

<?php
// Full-bleed: every native block builds its own .container, and core text
// blocks are wrapped in one by lc_bot2026_wrap_block_in_container().
while ( have_posts() ) {
	the_post();
	the_content();
}
?>

<?php
get_footer();
