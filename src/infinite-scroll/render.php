<?php defined('ABSPATH') || exit;

// Get the current page
$page_key = isset($block->context['queryId']) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
$page = empty($_GET[$page_key]) ? 1 : (int) $_GET[$page_key];

// Get the total number of pages for this query
$total_pages = 0;
$custom_query = new WP_Query(build_query_vars_from_query_block($block, $page));
$total_pages = $custom_query->max_num_pages;

// Sticky post filter logic
$sticky_posts = isset($attributes['ignoreStickyPosts']) && $attributes['ignoreStickyPosts'] == true ? get_option('sticky_posts') : array();


$settings = array(
	'loadingDistance' => isset($attributes['loadingDistance']) ? (int) $attributes['loadingDistance'] : 1200,
	'queryId' => isset($block->context['queryId']) ? $block->context['queryId'] : '',
	'maxPage' => isset($block->context['query']['pages']) ? (int) $block->context['query']['pages'] : 0,
	'currentPage' => $page,
	'totalPages' => $total_pages,
	'postsToIgnore' => $sticky_posts
);

?>
<div <?php echo wp_kses_data(get_block_wrapper_attributes(['id' => 'apedestrian-infinite-scroll' . (isset($block->context['queryId']) ? '-' . $block->context['queryId'] : '')])); ?>>
	<pre class="apedestrian-infinite-scroll-data" style="display:none"><?php echo esc_js(wp_json_encode($settings)); ?></pre>
	<?php echo wp_kses_post($content); ?>
</div>