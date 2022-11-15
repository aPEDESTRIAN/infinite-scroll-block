<?php defined('ABSPATH') || exit;
defined('INFINITE_SCROLL_DONKEY') || define('INFINITE_SCROLL_DONKEY','donkeyPhraseReplaceMeWithReplaceString');

if (!function_exists('infinite_scroll_get_inherited_url_pattern'))
{
	function infinite_scroll_get_inherited_url_pattern($max_page)
	{
		#region Modified get_next_posts_page_link()
		if (!is_single())
		{
			global $paged;
			$pagenum = (!$paged ? 1 : (int) $paged) + 1;

			if (!$max_page || $max_page >= $pagenum)
			{
				//return get_pagenum_link($pagenum);
				#region Modified get_pagenum_link()
				global $wp_rewrite;

				$request = remove_query_arg('paged');

				$home_root = parse_url(home_url());
				$home_root = (isset($home_root['path'])) ? $home_root['path'] : '';
				$home_root = preg_quote($home_root, '|');

				$request = preg_replace('|^' . $home_root . '|i', '', $request);
				$request = preg_replace('|^/+|', '', $request);

				if (!$wp_rewrite->using_permalinks() || is_admin())
				{
					$base = trailingslashit(get_bloginfo('url'));

					if ($pagenum > 1)
					{
						$result = add_query_arg('paged', INFINITE_SCROLL_DONKEY, $base . $request);
					}
					else
					{
						$result = '';
					}
				}
				else
				{
					$qs_regex = '|\?.*?$|';
					preg_match($qs_regex, $request, $qs_match);

					if (!empty( $qs_match[0]))
					{
						$query_string = $qs_match[0];
						$request = preg_replace($qs_regex, '', $request);
					}
					else
					{
						$query_string = '';
					}

					$request = preg_replace("|$wp_rewrite->pagination_base/\d+/?$|", '', $request);
					$request = preg_replace('|^' . preg_quote($wp_rewrite->index, '|') . '|i', '', $request);
					$request = ltrim($request, '/');

					$base = trailingslashit(get_bloginfo('url'));

					if ($wp_rewrite->using_index_permalinks() && ( $pagenum > 1 || '' !== $request ))
					{
						$base .= $wp_rewrite->index . '/';
					}

					if ($pagenum > 1 )
					{
						$request = ((!empty( $request)) ? trailingslashit($request) : $request) . user_trailingslashit($wp_rewrite->pagination_base . '/' . INFINITE_SCROLL_DONKEY, 'paged');
					}

					$result = $base . $request . $query_string;
				}

				/**
				 * Filters the page number link for the current request.
				 *
				 * @since 2.5.0
				 * @since 5.2.0 Added the `$pagenum` argument.
				 *
				 * @param string $result  The page number link.
				 * @param int    $pagenum The page number.
				 */
				$result = apply_filters('get_pagenum_link', $result, $pagenum);
				return str_replace(INFINITE_SCROLL_DONKEY, '{pageNum}', esc_url($result));

				#endregion Modified get_pagenum_link()
			}
		}
		#endregion Modified get_next_posts_page_link()
	}
}

// Since infinte scroll is always going to just load the next page, we're going to use
// "wp-includes\blocks\query-pagination-next.php" as a guide to get the pattern for the next page

$block_name =	'apedestrian-infinite-scroll';
$page_key =		isset($block->context['queryId']) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
$page =			empty($_GET[ $page_key]) ? 1 : (int) $_GET[$page_key];
$max_page =		isset($block->context['query']['pages']) ? (int) $block->context['query']['pages'] : 0;
$url_pattern =	'';

// Check if the pagination is for Query that inherits the global context.
if (isset($block->context['query']['inherit']) && $block->context['query']['inherit'])
{
	global $wp_query;
	$url_pattern = infinite_scroll_get_inherited_url_pattern($max_page > $wp_query->max_num_pages ? $wp_query->max_num_pages : $max_page);
}
elseif (!$max_page || $max_page > $page)
{
	$custom_query = new WP_Query(build_query_vars_from_query_block($block, $page));
	$custom_query_max_pages = (int) $custom_query->max_num_pages;
	if ($custom_query_max_pages && $custom_query_max_pages !== $page)
	{
		$url_pattern = str_replace(INFINITE_SCROLL_DONKEY, '{pageNum}', esc_url(add_query_arg($page_key, INFINITE_SCROLL_DONKEY)));
	}
	wp_reset_postdata(); // Restore original Post Data.
}

$settings = array(
	'loadingDistance' => isset($attributes['loadingDistance']) ? (int) $attributes['loadingDistance'] : 1200,
	'queryId' => isset($block->context['queryId']) ? $block->context['queryId'] : '',
	'maxPage' => $max_page,
	'currentPage' => $page,
	'urlPattern' => $url_pattern,
);

$element_id = isset($block->context['queryId']) ? $block_name . '-' . $block->context['queryId'] : $block_name;

?>
<div <?php echo get_block_wrapper_attributes(['id' => $element_id]); ?>>
	<pre class="<?php echo $block_name; ?>-data" style="display:none"><?php echo wp_json_encode($settings); ?></pre>
	<?php echo $content; ?>
</div>