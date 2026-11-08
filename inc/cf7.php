<?php
/**
 * Contact Form 7: the theme styles the form itself (src/blocks/contact-form.css)
 * instead of loading CF7's own stylesheet, and the form templates are written
 * as explicit <label> markup, so CF7 doesn't add paragraphs and line breaks.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

add_filter( 'wpcf7_load_css', '__return_false' );
add_filter( 'wpcf7_autop_or_not', '__return_false' );
