import "./editor.css"; // Even through editor.css is empty, it is required we have one stylesheet per block to be considered for block repo
import { registerBlockType } from "@wordpress/blocks";
import { PanelBody, PanelRow, BaseControl, Button, Popover } from "@wordpress/components";
import { InspectorControls, InnerBlocks, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { renderToStaticMarkup } from "react-dom/server";
import { useState } from "@wordpress/element";

registerBlockType("apedestrian/infinite-scroll-loading", {
   edit: EditComponent,
   save: () => (
      <div {...useBlockProps.save()}>
         <InnerBlocks.Content />
      </div>
   ),
});

function EditComponent() {
   const [popoverAnchor, setPopoverAnchor] = useState();
   const [popoverIsVisible, setPopoverIsVisible] = useState(false);
   let timer = null;

   return (
      <div {...useBlockProps()}>
         <InspectorControls>
            <PanelBody title="Throbber">
               <PanelRow label="Preview">
                  <div style={{ fontSize: "1.75em", margin: "10px" }} ref={setPopoverAnchor}>
                     <Throbber />
                  </div>
               </PanelRow>
               <PanelRow>
                  <BaseControl help="If you are not pasting this into an HTML element, you will need to paste this while inside the code editor (Ctrl + Shift + Alt + M) or the necessary tags and styles will be stripped out.">
                     <Button
                        variant="primary"
                        onClick={() => {
                           navigator.clipboard.writeText(renderToStaticMarkup(<Throbber />));
                           setPopoverIsVisible(true);
                           if (timer) clearTimeout(timer);
                           timer = setTimeout(() => setPopoverIsVisible(false), 2000);
                        }}
                     >
                        Copy to Clipboard
                     </Button>
                     {popoverIsVisible && (
                        <Popover noArrow={false} placement="top" offset={5} anchor={popoverAnchor}>
                           Copied!
                        </Popover>
                     )}
                  </BaseControl>
               </PanelRow>
            </PanelBody>
         </InspectorControls>
         <InnerBlocks {...useInnerBlocksProps()} template={[["core/paragraph", { content: renderToStaticMarkup(<Throbber />), align: "center" }]]} />
      </div>
   );
}

function Throbber() {
   return (
      <>
         <style>{`.ellipsis-throbber *{display:inline-block;animation:ellipsis-scale 1.2s infinite ease-out}@keyframes ellipsis-scale{0%,100%{transform:scale(0.2)}50%{transform: scale(1)}}`}</style>
         <span className="ellipsis-throbber">
            <span style={{ animationDelay: "-0.6s" }}>&#9679;</span>
            <span style={{ animationDelay: "-0.3s" }}>&#9679;</span>
            <span>&#9679;</span>
         </span>
      </>
   );
}
