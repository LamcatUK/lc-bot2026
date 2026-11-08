<?php
/**
 * Collaborators. Reads the Collaborators list in Site-Wide Settings, so the
 * same partners can be shown on any page. Each one is a single link: logo on
 * a white disc, name, one line about them, then where the link goes.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$partners = array_filter(
	lc_bot2026_get_repeater_setting( 'partners' ),
	static function ( $p ) {
		return ! empty( $p['name'] );
	}
);
if ( ! $partners ) {
	return;
}
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'collaborators section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<?php if ( ! empty( $attributes['intro'] ) ) { ?>
			<p class="lead"><?php echo esc_html( $attributes['intro'] ); ?></p>
		<?php } ?>
		<ul class="collaborators__list">
			<?php foreach ( $partners as $p ) { ?>
				<?php
				$url  = ! empty( $p['url'] ) ? esc_url( $p['url'] ) : '';
				$logo = ! empty( $p['logo'] ) ? (int) $p['logo'] : 0;
				?>
				<li class="collaborators__item">
					<div class="collaborators__disc">
						<?php lc_bot2026_image( $logo, '', $p['name'] . ' logo', 'medium', 'lazy' ); ?>
					</div>
					<h3>
						<?php if ( $url ) { ?>
							<a class="collaborators__link" href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $p['name'] ); ?><span class="visually-hidden"> (opens in a new tab)</span></a>
						<?php } else { ?>
							<?php echo esc_html( $p['name'] ); ?>
						<?php } ?>
					</h3>
					<?php if ( ! empty( $p['description'] ) ) { ?>
						<p><?php echo esc_html( $p['description'] ); ?></p>
					<?php } ?>
					<?php if ( $url ) { ?>
						<span class="collaborators__visit" aria-hidden="true">
							<?php echo esc_html( preg_replace( '#^www\.#', '', (string) wp_parse_url( $url, PHP_URL_HOST ) ) ); ?>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10 10 4M5 4h5v5"/></svg>
						</span>
					<?php } ?>
				</li>
			<?php } ?>
		</ul>
	</div>
</section>
