<?php
/**
 * Feature Columns: short points side by side. Numbered, they read as steps.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$items = array_values(
	array_filter(
		is_array( $attributes['items'] ?? null ) ? $attributes['items'] : array(),
		static function ( $i ) {
			return ! empty( $i['title'] );
		}
	)
);
if ( ! $items ) {
	return;
}
$surface  = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$numbered = ! empty( $attributes['numbered'] );
$tag      = $numbered ? 'ol' : 'ul';
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'feature-columns section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<?php if ( ! empty( $attributes['intro'] ) ) { ?>
			<p class="lead"><?php echo esc_html( $attributes['intro'] ); ?></p>
		<?php } ?>
		<<?php echo esc_attr( $tag ); ?> class="feature-columns__list<?php echo $numbered ? ' feature-columns__list--numbered' : ''; ?>">
			<?php foreach ( $items as $item ) { ?>
				<li class="feature-columns__item">
					<h3><?php echo esc_html( $item['title'] ); ?></h3>
					<?php if ( ! empty( $item['text'] ) ) { ?>
						<p><?php echo esc_html( $item['text'] ); ?></p>
					<?php } ?>
					<?php if ( ! empty( $item['linkUrl'] ) && ! empty( $item['linkText'] ) ) { ?>
						<p><a class="feature-columns__link" href="<?php echo esc_url( $item['linkUrl'] ); ?>"<?php echo 0 === strpos( $item['linkUrl'], 'http' ) ? ' target="_blank" rel="noopener"' : ''; ?>><?php echo esc_html( $item['linkText'] ); ?></a></p>
					<?php } ?>
				</li>
			<?php } ?>
		</<?php echo esc_attr( $tag ); ?>>
	</div>
</section>
