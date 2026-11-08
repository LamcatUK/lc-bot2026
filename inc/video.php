<?php
/**
 * Video links: work out the provider and embed URL from any YouTube or Vimeo
 * address, and keep a poster image on this site. A block shows the poster
 * behind a play button (src/js/video-facade.js loads the player only when it
 * is clicked), so a page with a video makes no request to the provider until
 * the visitor presses play.
 *
 * @package lc-bot2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Describe a YouTube or Vimeo URL.
 *
 * @param string $url Address as pasted.
 * @return array{provider: string, id: string, embed: string, url: string}|null Null when it is not a video link.
 */
function lc_bot2026_parse_video_url( $url ) {
	$url   = trim( (string) $url );
	$parts = wp_parse_url( $url );

	if ( '' === $url || empty( $parts['host'] ) ) {
		return null;
	}

	$host = strtolower( preg_replace( '/^www\./', '', $parts['host'] ) );
	$path = isset( $parts['path'] ) ? $parts['path'] : '';

	if ( in_array( $host, array( 'youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'youtu.be' ), true ) ) {
		$id = '';
		if ( 'youtu.be' === $host ) {
			$id = trim( $path, '/' );
		} elseif ( preg_match( '#^/(?:embed|shorts|live|v)/([\w-]{6,})#', $path, $m ) ) {
			$id = $m[1];
		} elseif ( ! empty( $parts['query'] ) ) {
			parse_str( $parts['query'], $query );
			$id = isset( $query['v'] ) ? (string) $query['v'] : '';
		}
		if ( ! preg_match( '/^[\w-]{6,}$/', $id ) ) {
			return null;
		}
		return array(
			'provider' => 'youtube',
			'id'       => $id,
			'embed'    => 'https://www.youtube-nocookie.com/embed/' . $id . '?autoplay=1&rel=0&playsinline=1',
			'url'      => $url,
		);
	}

	if ( preg_match( '#(?:^|\.)vimeo\.com$#', $host ) && preg_match( '#/(\d{6,})#', $path, $m ) ) {
		return array(
			'provider' => 'vimeo',
			'id'       => $m[1],
			'embed'    => 'https://player.vimeo.com/video/' . $m[1] . '?autoplay=1&dnt=1',
			'url'      => $url,
		);
	}

	return null;
}

/**
 * A poster image for a video, kept on this site.
 *
 * The provider's thumbnail is fetched once, saved under uploads/lc-video-posters
 * and served from there. If it cannot be fetched this returns an empty string
 * (the block shows a plain panel) and tries again in an hour, so a slow
 * provider never slows page views.
 *
 * @param array $video Result of lc_bot2026_parse_video_url().
 * @return string Local poster URL, or an empty string.
 */
function lc_bot2026_video_poster_url( $video ) {
	$upload = wp_upload_dir();
	$name   = sanitize_file_name( $video['provider'] . '-' . $video['id'] . '.jpg' );
	$path   = $upload['basedir'] . '/lc-video-posters/' . $name;

	if ( file_exists( $path ) ) {
		return $upload['baseurl'] . '/lc-video-posters/' . $name;
	}

	$retry = 'lc_bot2026_poster_retry_' . md5( $name );
	if ( get_transient( $retry ) ) {
		return '';
	}

	$sources = ( 'youtube' === $video['provider'] )
		? array(
			'https://img.youtube.com/vi/' . $video['id'] . '/maxresdefault.jpg',
			'https://img.youtube.com/vi/' . $video['id'] . '/hqdefault.jpg',
		)
		: array( lc_bot2026_vimeo_thumbnail_url( $video['url'] ) );

	foreach ( array_filter( $sources ) as $source ) {
		$response = wp_remote_get( $source, array( 'timeout' => 8 ) );
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			continue;
		}
		$body = wp_remote_retrieve_body( $response );
		$type = wp_remote_retrieve_header( $response, 'content-type' );
		// Only an ordinary image of a sensible size is kept.
		if ( 0 !== strpos( (string) $type, 'image/jpeg' ) || strlen( $body ) < 1024 || strlen( $body ) > 2 * MB_IN_BYTES ) {
			continue;
		}
		if ( wp_mkdir_p( dirname( $path ) ) && false !== file_put_contents( $path, $body ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- a cached copy in uploads.
			lc_bot2026_trim_black_bars( $path );
			return $upload['baseurl'] . '/lc-video-posters/' . $name;
		}
	}

	set_transient( $retry, 1, HOUR_IN_SECONDS );
	return '';
}

/**
 * The thumbnail URL Vimeo's oEmbed endpoint gives for a video, at a larger
 * size, or an empty string. Only a Vimeo CDN address is accepted.
 *
 * @param string $url Vimeo link.
 * @return string
 */
function lc_bot2026_vimeo_thumbnail_url( $url ) {
	$response = wp_remote_get( 'https://vimeo.com/api/oembed.json?url=' . rawurlencode( $url ), array( 'timeout' => 5 ) );
	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		return '';
	}
	$data  = json_decode( wp_remote_retrieve_body( $response ), true );
	$thumb = ( is_array( $data ) && ! empty( $data['thumbnail_url'] ) ) ? esc_url_raw( $data['thumbnail_url'] ) : '';
	$host  = (string) wp_parse_url( $thumb, PHP_URL_HOST );
	if ( '' === $thumb || ! preg_match( '/(^|\.)vimeocdn\.com$/', $host ) ) {
		return '';
	}
	// oEmbed returns a 295px thumbnail: ask Vimeo's CDN for a larger one.
	return preg_replace( '/-d_\d+(x\d+)?/', '-d_1280', $thumb );
}

/**
 * Crop solid black bars off a saved poster. A video's thumbnail is often an
 * image that is not 16:9, padded with black bars to fit YouTube's 16:9 frame. Only bars along the edges are removed, and only when they are black
 * all the way across, so a dark photo is left alone.
 *
 * @param string $path Absolute path of a JPEG.
 * @return void
 */
function lc_bot2026_trim_black_bars( $path ) {
	if ( ! function_exists( 'imagecreatefromjpeg' ) ) {
		return;
	}
	$im = @imagecreatefromjpeg( $path );
	if ( ! $im ) {
		return;
	}
	$w = imagesx( $im );
	$h = imagesy( $im );

	$lum = static function ( $x, $y ) use ( $im ) {
		$c = imagecolorat( $im, $x, $y );
		return ( ( $c >> 16 & 255 ) + ( $c >> 8 & 255 ) + ( $c & 255 ) ) / 3;
	};
	$col = static function ( $x ) use ( $h, $lum ) {
		$sum = 0;
		$n   = 0;
		for ( $y = 0; $y < $h; $y += 6 ) {
			$sum += $lum( $x, $y );
			++$n;
		}
		return $sum / $n;
	};
	$row = static function ( $y ) use ( $w, $lum ) {
		$sum = 0;
		$n   = 0;
		for ( $x = 0; $x < $w; $x += 6 ) {
			$sum += $lum( $x, $y );
			++$n;
		}
		return $sum / $n;
	};

	$left = 0;
	while ( $left < $w / 3 && $col( $left ) < 14 ) {
		++$left;
	}
	$right = $w - 1;
	while ( $right > $w * 2 / 3 && $col( $right ) < 14 ) {
		--$right;
	}
	$top = 0;
	while ( $top < $h / 3 && $row( $top ) < 14 ) {
		++$top;
	}
	$bottom = $h - 1;
	while ( $bottom > $h * 2 / 3 && $row( $bottom ) < 14 ) {
		--$bottom;
	}

	// Ignore thin edges (compression noise); crop real bars only.
	$cw = $right - $left + 1;
	$ch = $bottom - $top + 1;
	if ( ( $w - $cw ) / $w < 0.03 && ( $h - $ch ) / $h < 0.03 ) {
		imagedestroy( $im );
		return;
	}
	$cropped = imagecrop( $im, array( 'x' => $left, 'y' => $top, 'width' => $cw, 'height' => $ch ) );
	if ( $cropped ) {
		imagejpeg( $cropped, $path, 88 );
		imagedestroy( $cropped );
	}
	imagedestroy( $im );
}
