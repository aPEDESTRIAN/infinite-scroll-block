import "./editor.css"; // Even through editor.css is empty, it is required we have one stylesheet per block to be considered for block repo
import { registerBlockType } from "@wordpress/blocks";
import { PanelBody, PanelRow, BaseControl, __experimentalNumberControl as NumberControl } from "@wordpress/components";
import { InspectorControls, InnerBlocks, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

registerBlockType("apedestrian/infinite-scroll", {
   edit: EditComponent,
   save: () => <InnerBlocks.Content />,
});

function EditComponent(props) {
   return (
      <div {...useBlockProps()}>
         <InspectorControls>
            <PanelBody title="Start Loading Distance">
               <PanelRow>
                  <BaseControl help="Content will start to be loaded in once the distance between the bottom of the browsers window and the top of the Infinite Scroll block is greater than or equal to this value.">
                     <NumberControl
                        label="Distance in PX"
                        value={props.attributes.loadingDistance}
                        onChange={(value) => {
                           props.setAttributes({ loadingDistance: value });
                        }}
                     />
                  </BaseControl>
               </PanelRow>
            </PanelBody>
         </InspectorControls>
         <InnerBlocks
            {...useInnerBlocksProps({
               template: [
                  ["apedestrian/infinite-scroll-loading", {}],
                  ["apedestrian/infinite-scroll-end", {}],
               ],
               allowedBlocks: ["apedestrian/infinite-scroll-loading", "apedestrian/infinite-scroll-end"],
            })}
         />
      </div>
   );
}
