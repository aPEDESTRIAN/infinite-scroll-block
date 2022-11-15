!function(){"use strict";var e=window.wp.element,t=window.wp.blocks,n=window.wp.components,l=window.wp.blockEditor;(0,t.registerBlockType)("apedestrian/infinite-scroll",{edit:function(t){return(0,e.createElement)("div",(0,l.useBlockProps)(),(0,e.createElement)(l.InspectorControls,null,(0,e.createElement)(n.PanelBody,{title:"Start Loading Distance"},(0,e.createElement)(n.PanelRow,null,(0,e.createElement)(n.BaseControl,{help:"Content will start to be loaded in once the distance between the bottom of the browsers window and the top of the Infinite Scroll block is greater than or equal to this value."},(0,e.createElement)(n.__experimentalNumberControl,{label:"Distance in PX",value:t.attributes.loadingDistance,onChange:e=>{t.setAttributes({loadingDistance:e})}}))))),(0,e.createElement)(l.InnerBlocks,(0,l.useInnerBlocksProps)({template:[["apedestrian/infinite-scroll-loading",{}],["apedestrian/infinite-scroll-end",{}]],allowedBlocks:["apedestrian/infinite-scroll-loading","apedestrian/infinite-scroll-end"]})))},save:()=>(0,e.createElement)(l.InnerBlocks.Content,null)})}();