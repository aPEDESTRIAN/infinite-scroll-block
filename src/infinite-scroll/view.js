const dataCache = {};
const blockName = "apedestrian-infinite-scroll";

document.addEventListener("DOMContentLoaded", () => {
   const rawData = document.querySelectorAll(`pre.${blockName}-data`);
   rawData.forEach((pre) => {
      const newData = JSON.parse(pre.innerHTML);
      dataCache[newData.queryId] = newData;
      dataCache[newData.queryId].elementId = `${blockName}-${newData.queryId}`;
      pre.remove();
      watchForInfiniteScrollBlock(newData.queryId);
   });
});

function inRangeOfInfiniteScrollBlock(queryId) {
   return document.getElementById(dataCache[queryId].elementId).getBoundingClientRect().top - window.innerHeight <= dataCache[queryId].loadingDistance;
}

function watchForInfiniteScrollBlock(queryId) {
   if (lastPageHasLoaded(queryId)) {
      disableAndCleanUpInfinteScrollBlock(queryId);
   } else {
      // Are we already in range of element?
      if (inRangeOfInfiniteScrollBlock(queryId)) {
         tryToLoadNextPage(queryId);
      } else {
         dataCache[queryId].intervalId = setInterval(() => {
            if (inRangeOfInfiniteScrollBlock(queryId)) {
               clearInterval(dataCache[queryId].intervalId);
               tryToLoadNextPage(queryId);
            }
         }, 1000);
      }
   }
}

function tryToLoadNextPage(queryId) {
   fetch(`?query-${queryId}-page=${++dataCache[queryId].currentPage}`)
      .then((response) => response.text())
      .then((html) => {
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, "text/html");
         const infiniteScrollBlock = doc ? doc.getElementById(dataCache[queryId].elementId) : null;
         const queryBlock = infiniteScrollBlock ? infiniteScrollBlock.closest(".wp-block-query") : null;
         const templateBlock = queryBlock ? queryBlock.querySelector(".wp-block-post-template") : null;

         // Extract all the posts if we have a list
         const posts = [];
         if (templateBlock) {
            templateBlock.querySelectorAll("li.wp-block-post").forEach((li) => {
				var ignoreListItem = false;
				for (const postId of dataCache[queryId].postsToIgnore) {
					if (li.classList.contains(`post-${postId}`)) {
						ignoreListItem = true;
						break;
					}
				}

				// We only want to push posts that are not in our ignore array
				if (ignoreListItem === false) {
					posts.push(li);
				}
            });
         }

         // Were there any posts?
         if (posts.length > 0) {
            // Display content
            const infiniteScrollBlock = document.getElementById(dataCache[queryId].elementId);
            const queryBlock = infiniteScrollBlock ? infiniteScrollBlock.closest(".wp-block-query") : null;
            const templateBlock = queryBlock ? queryBlock.querySelector(".wp-block-post-template") : null;
            if (templateBlock) {
               posts.forEach((post) => {
                  templateBlock.appendChild(post);
               });
            } else {
               disableAndCleanUpInfinteScrollBlock(queryId);
            }
         }
		 lastPageHasLoaded(queryId) ? disableAndCleanUpInfinteScrollBlock(queryId) : watchForInfiniteScrollBlock(queryId);
      })
      .catch(/* Silence is golden */);
}

function disableAndCleanUpInfinteScrollBlock(queryId) {
   // Show the no more posts elements
   const endBlocks = document.querySelectorAll(`#${dataCache[queryId].elementId} .wp-block-${blockName}-end--hidden`);
   endBlocks.forEach((block) => {
      block.classList.remove(`wp-block-${blockName}-end--hidden`);
   });

   // Remove all loading elements
   const loadingBlocks = document.querySelectorAll(`#${dataCache[queryId].elementId} .wp-block-${blockName}-loading`);
   loadingBlocks.forEach((block) => {
      block.remove();
   });

   // No need to hold onto this data
   delete dataCache[queryId];
}

function lastPageHasLoaded(queryId) {
   return dataCache[queryId].totalPages === dataCache[queryId].currentPage || dataCache[queryId].maxPage === dataCache[queryId].currentPage;
}
