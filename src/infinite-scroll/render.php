<?php defined('ABSPATH') || exit;

// Get next page link then use preg_match to extract the href
$next_page_content = '';
$next_page_content = render_block_core_query_pagination_next($attributes, $next_page_content, $block);
$link = preg_match('/href="([^"]*)"/', $next_page_content, $matches) ? $matches[1] : '';

$query_id = isset($block->context['queryId']) ? $block->context['queryId'] : 'main-query';

$data = array(
	'loadingDistance' => isset($attributes['loadingDistance']) ? (int) $attributes['loadingDistance'] : 1200,
	'stickyPosts' => isset($attributes['ignoreStickyPosts']) && $attributes['ignoreStickyPosts'] == true ? get_option('sticky_posts') : array(),
	'nextPageLink' => $link,
	'queryId' => $query_id
);

?>
<div <?php echo wp_kses_data(get_block_wrapper_attributes(['id' => 'apedestrian-infinite-scroll-' . $query_id])); ?>>
	<pre class="apedestrian-infinite-scroll-data" style="display:none"><?php echo esc_js(wp_json_encode($data)); ?></pre>
	<?php echo wp_kses_post($content); ?>
</div>