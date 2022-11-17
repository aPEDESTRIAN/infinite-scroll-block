import "./index.css";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

registerBlockType("apedestrian/infinite-scroll-end", {
   edit: () => (
      <div {...useBlockProps()}>
         <InnerBlocks
            {...useInnerBlocksProps({
               template: [["core/paragraph", { content: "No more posts" }]],
            })}
         />
      </div>
   ),
   save: (props) => (
      <div
         {...useBlockProps.save({
            className: "wp-block-apedestrian-infinite-scroll-end--hidden",
         })}
      >
         <InnerBlocks.Content />
      </div>
   ),
});
