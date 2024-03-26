=== Infinite Scroll Block ===
Contributors: apedestrian
Stable tag: 1.0.3
Tested up to: 6.4.3
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

== Changelog ==

= 1.0.1 =
* Fixed issue where a list element inside of a posts content would be stripped out and placed into the query block list

= 1.0.3 =
* Fixed issue where sticky posts would we included in every single fetch request (Added optional flag to keep this functionality)
* Fixed infinite  loop where sticky posts would continue to load even after all posts have been loaded
* Removed throbber editor panel because it was not intuitive to use (kept styles for backwards compatibility)