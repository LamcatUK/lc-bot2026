<?php
/**
 * Empty basket: one line saying so, and a way back to the hikes.
 *
 * @package lc-bot2026
 * @version 7.0.1
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="cart-empty-panel">
	<p class="cart-empty-panel__text lead">Your basket is currently empty.</p>
	<p><a class="btn" href="<?php echo esc_url( home_url( '/hikes/' ) ); ?>">Browse hikes</a></p>
</div>
