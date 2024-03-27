<?php defined('ABSPATH') || exit;

/*
	Plugin Name: Infinite Scroll Block
	Description: Adds an infinite scroll block to the full site editor that can be placed inside a Query Loop to replace classic pagination.
	Version: 1.1.0
	Author: aPEDESTRIAN
	Author URI: https://github.com/apedestrian/
	Plugin URI: https://github.com/apedestrian/infinite-scroll-block
	License: GPL-2.0+
	License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

add_action('init', function() {
	register_block_type(plugin_dir_path(__FILE__) . '/build/infinite-scroll');
	register_block_type(plugin_dir_path(__FILE__) . '/build/infinite-scroll-end');
	register_block_type(plugin_dir_path(__FILE__) . '/build/infinite-scroll-loading');
});