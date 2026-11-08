</main>

<footer id="footer" data-surface="brand">
	<div class="container footer__grid">
		<div class="footer__brand">
			<span class="navbar-logo footer__logo" role="img" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"></span>
			<p>Guided hikes in the Surrey Hills and beyond.</p>
		</div>
		<div>
			<h2 class="footer__heading">Contact</h2>
			<ul class="footer__list">
				<?php if ( lc_bot2026_get_setting( 'email' ) ) { ?>
					<li><a href="mailto:<?php echo esc_attr( antispambot( lc_bot2026_get_setting( 'email' ) ) ); ?>"><?php echo esc_html( antispambot( lc_bot2026_get_setting( 'email' ) ) ); ?></a></li>
				<?php } ?>
				<?php if ( lc_bot2026_get_setting( 'phone' ) ) { ?>
					<li><a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', lc_bot2026_get_setting( 'phone' ) ) ); ?>"><?php echo esc_html( lc_bot2026_get_setting( 'phone' ) ); ?></a></li>
				<?php } ?>
				<?php foreach ( array( 'facebook' => 'Facebook', 'instagram' => 'Instagram' ) as $slug => $label ) { ?>
					<?php if ( lc_bot2026_get_setting( $slug . '_url' ) ) { ?>
						<li><a href="<?php echo esc_url( lc_bot2026_get_setting( $slug . '_url' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html( $label ); ?></a></li>
					<?php } ?>
				<?php } ?>
			</ul>
		</div>
		<nav aria-label="Footer">
			<h2 class="footer__heading">Site</h2>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'menu_class'     => 'footer__list',
					'container'      => false,
					'fallback_cb'    => false,
				)
			);
			?>
		</nav>
	</div>
	<?php $lc_accreditations = array_filter( lc_bot2026_get_repeater_setting( 'accreditations' ), static function ( $a ) { return ! empty( $a['logo'] ); } ); ?>
	<?php if ( $lc_accreditations ) { ?>
		<div class="container">
			<ul class="footer__accreditations" aria-label="Accreditations">
				<?php foreach ( $lc_accreditations as $a ) { ?>
					<li>
						<?php if ( ! empty( $a['url'] ) ) { ?>
							<a href="<?php echo esc_url( $a['url'] ); ?>" target="_blank" rel="noopener"><?php lc_bot2026_image( (int) $a['logo'], '', $a['name'] ?? '', 'medium', 'lazy' ); ?><span class="visually-hidden"> (opens in a new tab)</span></a>
						<?php } else { ?>
							<?php lc_bot2026_image( (int) $a['logo'], '', $a['name'] ?? '', 'medium', 'lazy' ); ?>
						<?php } ?>
					</li>
				<?php } ?>
			</ul>
		</div>
	<?php } ?>
	<div id="colophon">
		<div class="container">
			<p>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
