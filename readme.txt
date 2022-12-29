=== Infinite Scroll Block ===
Contributors: apedestrian
Donate link: https://www.paypal.com/donate/?hosted_button_id=JTBPY8ZWAXG6N
Stable tag: 1.0.1
Tested up to: 6.1.1
Tags: full site editing, fse, gutenberg, blocks, infinite scroll
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds an infinite scroll block to the full site editor that can be placed inside a Query Loop to replace classic pagination.

== Description ==
Adds an infinite scroll block to the full site editor that can be placed inside a Query Loop to replace classic pagination.

The blocks frontend script will detect when the user is 1200px (default value) from the infinite scroll block before fetching more posts so it is best to place it right after your theme template block. In addition to the Infinite Scroll Block, 2 optional blocks also are included:

-  Loading Posts Block: Container that will display its content while more posts are loading
-  No More Posts Block: Container that will display when there are no more posts to load in

= Additional Note =
While you can add more than one Infinite Scroll Block inside of a Query Loop Block, you should not. The block was originally constrained to only one per page (multiple = false) but was removed in order to support multiple query blocks on the same page.
