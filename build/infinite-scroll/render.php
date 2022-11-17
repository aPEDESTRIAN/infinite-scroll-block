<?php defined('ABSPATH') || exit;

if (!defined('INFINITE_SCROLL_DONKEY')) {
	define('INFINITE_SCROLL_DONKEY','donkeyPhraseReplaceMeWithReplaceString');
}

if (!function_exists('infinite_scroll_get_pagenum_link')) {
	// Modifed version of get_pagenum_link() that replaces the page number with our donkey value
	function infinite_scroll_get_pagenum_link($pagenum) {
		$home_root = parse_url(home_url());
		$home_root = (isset($home_root['path'])) ? $home_root['path'] : '';
		$home_root = preg_quote($home_root, '|');

		$request = remove_query_arg('paged');
		$request = preg_replace('|^' . $home_root . '|i', '', $request);
		$request = preg_replace('|^/+|', '', $request);

		global $wp_rewrite;
		if (!$wp_rewrite->using_permalinks() || is_admin()) {
			$base = trailingslashit(get_bloginfo('url'));
			$result = $pagenum > 1 ? add_query_arg('paged', INFINITE_SCROLL_DONKEY, $base . $request) : '';
		} else {
			$qs_regex = '|\?.*?$|';
			preg_match($qs_regex, $request, $qs_match);

			if (!empty($qs_match[0])) {
				$query_string = $qs_match[0];
				$request = preg_replace($qs_regex, '', $request);
			} else {
				$query_string = '';
			}

			$request = preg_replace("|$wp_rewrite->pagination_base/\d+/?$|", '', $request);
			$request = preg_replace('|^' . preg_quote($wp_rewrite->index, '|') . '|i', '', $request);
			$request = ltrim($request, '/');

			$base = trailingslashit(get_bloginfo('url'));

			if ($wp_rewrite->using_index_permalinks() && ( $pagenum > 1 || '' !== $request )) {
				$base .= $wp_rewrite->index . '/';
			}

			if ($pagenum > 1) {
				$request = ((!empty( $request)) ? trailingslashit($request) : $request) . user_trailingslashit($wp_rewrite->pagination_base . '/' . INFINITE_SCROLL_DONKEY, 'paged');
			}

			$result = $base . $request . $query_string;
		}

		// Want to keep applying filters so we dont break anyones site; is this the right move?
		$result = apply_filters('get_pagenum_link', $result, $pagenum);
		return  $result;
	}
}

$page_key = isset($block->context['queryId']) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
$page = empty($_GET[ $page_key]) ? 1 : (int) $_GET[$page_key];
$max_page = isset($block->context['query']['pages']) ? (int) $block->context['query']['pages'] : 0;
$url_pattern = '';

// Check if the query inherits the global context.
// If it does, make sure it's not a single post or page. (they are the only post on their respective pages)
if (isset($block->context['query']['inherit']) && $block->context['query']['inherit'] && !is_single()) {
	global $wp_query;
	if ($max_page > $wp_query->max_num_pages) {
		$max_page = $wp_query->max_num_pages;
	}

	global $paged;
	$next_page = (!$paged ? 1 : (int) $paged) + 1;

	if (!$max_page || $max_page >= $next_page) {
		// Unfortunately, if there are more than one query on a page it is hard
		// to parse the result of get_pagenum_link() so we have to use a modified
		// version of the function defined above
		$url_pattern = infinite_scroll_get_pagenum_link($next_page, false);
	}
} elseif (!$max_page || $max_page > $page) {
	$custom_query = new WP_Query(build_query_vars_from_query_block($block, $page));
	$custom_query_max_pages = (int) $custom_query->max_num_pages;
	if ($custom_query_max_pages && $custom_query_max_pages !== $page) {
		$url_pattern = add_query_arg($page_key, INFINITE_SCROLL_DONKEY);
	}
	wp_reset_postdata();
}

$settings = array(
	'loadingDistance' => isset($attributes['loadingDistance']) ? (int) $attributes['loadingDistance'] : 1200,
	'queryId' => isset($block->context['queryId']) ? $block->context['queryId'] : '',
	'maxPage' => $max_page,
	'currentPage' => $page,
	'urlPattern' => str_replace(INFINITE_SCROLL_DONKEY, '{pageNum}', esc_url($url_pattern)) ,
);

?>
<div <?php echo wp_kses_data(get_block_wrapper_attributes(['id' => 'apedestrian-infinite-scroll' . (isset($block->context['queryId']) ? '-' . $block->context['queryId'] : '')])); ?>>
	<pre class="apedestrian-infinite-scroll-data" style="display:none"><?php echo esc_js(wp_json_encode($settings)); ?></pre>
	<?php echo esc_html($content); ?>
</div>