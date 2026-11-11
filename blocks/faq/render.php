<?php
/**
 * FAQ: native <details> questions, so it works with no JavaScript, plus
 * FAQPage structured data for search engines.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

$items = array_values(
	array_filter(
		is_array( $attributes['items'] ?? null ) ? $attributes['items'] : array(),
		static function ( $i ) {
			return ! empty( $i['question'] ) && ! empty( $i['answer'] );
		}
	)
);
if ( ! $items ) {
	return;
}
$surface = lc_bot2026_surface( $attributes['surface'] ?? 'surface' );
$group   = 'faq-' . wp_unique_id();
$schema  = array(
	'@context'   => 'https://schema.org',
	'@type'      => 'FAQPage',
	'mainEntity' => array_map(
		static function ( $i ) {
			return array(
				'@type'          => 'Question',
				'name'           => $i['question'],
				'acceptedAnswer' => array( '@type' => 'Answer', 'text' => $i['answer'] ),
			);
		},
		$items
	),
);
?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'faq section' . lc_bot2026_section_extras( $attributes ), 'data-surface' => $surface ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="container faq__inner">
		<?php if ( ! empty( $attributes['title'] ) ) { ?>
			<h2><?php echo esc_html( $attributes['title'] ); ?></h2>
		<?php } ?>
		<div class="faq__list">
			<?php foreach ( $items as $i ) { ?>
				<details class="faq__item" name="<?php echo esc_attr( $group ); ?>">
					<summary><?php echo esc_html( $i['question'] ); ?></summary>
					<p><?php echo esc_html( $i['answer'] ); ?></p>
				</details>
			<?php } ?>
		</div>
	</div>
	<script type="application/ld+json"><?php echo wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON for a script block. ?></script>
</section>
