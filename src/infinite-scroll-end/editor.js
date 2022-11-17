import "./editor.css"; // Even through editor.css is empty, it is required we have one stylesheet per block to be considered for block repo
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
   save: () => (
      <div {...useBlockProps.save()} style={{ display: "none" }}>
         <InnerBlocks.Content />
      </div>
   ),
});
