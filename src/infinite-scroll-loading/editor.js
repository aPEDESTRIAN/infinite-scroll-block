import "./index.scss";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

registerBlockType("apedestrian/infinite-scroll-loading", {
	edit: () => (
		<div {...useBlockProps()}>
		   <InnerBlocks
			  {...useInnerBlocksProps({
				 template: [["core/paragraph", { content: "Loading posts..." }]],
			  })}
		   />
		</div>
	 ),
   save: () => (
      <div {...useBlockProps.save()}>
         <InnerBlocks.Content />
      </div>
   ),
});