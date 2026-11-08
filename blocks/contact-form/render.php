<?php
/**
 * Contact: words and details on the left, the form on the right. The phone,
 * email and social links are read from Site-Wide Settings, so they are kept in
 * one place and the links are always built correctly.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$form_id = (int) ( $attributes['formId'] ?? 0 );
$form    = $form_id && shortcode_exists( 'contact-form-7' ) ? do_shortcode( '[contact-form-7 id="' . $form_id . '"]' ) : '';
$email   = lc_bot2026_get_setting( 'email' );
$phone   = lc_bot2026_get_setting( 'phone' );
$socials = array(
	'Facebook'  => lc_bot2026_get_setting( 'facebook_url' ),
	'Instagram' => lc_bot2026_get_setting( 'instagram_url' ),
);
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'contact section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container contact__grid">
		<div class="contact__copy">
			<?php if ( ! empty( $attributes['title'] ) ) { ?>
				<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
			<?php } ?>
			<?php if ( ! empty( $attributes['content'] ) ) { ?>
				<div class="text-section__body"><?php echo wp_kses_post( wpautop( $attributes['content'] ) ); ?></div>
			<?php } ?>
			<?php if ( ! empty( $attributes['showDetails'] ) && ( $phone || $email || array_filter( $socials ) ) ) { ?>
				<dl class="contact__details">
					<?php if ( $phone ) { ?>
						<div><dt>Mobile</dt><dd><a href="tel:<?php echo esc_attr( parse_phone( $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a></dd></div>
					<?php } ?>
					<?php if ( $email ) { ?>
						<div><dt>Email</dt><dd><a href="mailto:<?php echo esc_attr( antispambot( $email ) ); ?>"><?php echo esc_html( antispambot( $email ) ); ?></a></dd></div>
					<?php } ?>
					<?php foreach ( $socials as $label => $url ) { ?>
						<?php if ( $url ) { ?>
							<div><dt><?php echo esc_html( $label ); ?></dt><dd><a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( preg_replace( '#^https?://(www\.)?#', '', untrailingslashit( $url ) ) ); ?><span class="visually-hidden"> (opens in a new tab)</span></a></dd></div>
						<?php } ?>
					<?php } ?>
				</dl>
			<?php } ?>
		</div>
		<?php if ( $form ) { ?>
			<div class="contact__form"><?php echo $form; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Contact Form 7's own escaped output. ?></div>
		<?php } ?>
	</div>
</section>
