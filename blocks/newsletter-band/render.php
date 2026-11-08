<?php
/**
 * Newsletter Sign-up. The form is a Mailchimp for WP form, picked by ID (blank =
 * the plugin's default form), so fields, lists and consent wording are all
 * edited in the plugin.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

if ( ! shortcode_exists( 'mc4wp_form' ) ) {
	return;
}
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'brand', 'brand' );
$form_id = (int) ( $attributes['formId'] ?? 0 );
$form    = do_shortcode( $form_id ? '[mc4wp_form id="' . $form_id . '"]' : '[mc4wp_form]' );
if ( '' === trim( wp_strip_all_tags( $form ) ) && false === strpos( $form, '<form' ) ) {
	return;
}
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'newsletter-band section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container newsletter-band__inner">
		<div class="newsletter-band__copy">
			<?php if ( ! empty( $attributes['title'] ) ) { ?>
				<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
			<?php } ?>
			<?php if ( ! empty( $attributes['text'] ) ) { ?>
				<p class="lead"><?php echo esc_html( $attributes['text'] ); ?></p>
			<?php } ?>
		</div>
		<div class="newsletter-band__form"><?php echo $form; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Mailchimp for WP's own escaped output. ?></div>
	</div>
</section>
