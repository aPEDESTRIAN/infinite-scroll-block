const dataCache = {};
const blockName = "apedestrian-infinite-scroll";

document.addEventListener("DOMContentLoaded", () => {
	const rawData = document.querySelectorAll(`pre.${blockName}-data`);
	rawData.forEach(pre => {
		const data = JSON.parse(pre.innerHTML);
		pre.remove();

		// Cache and generate needed data
		dataCache[data.queryId] = data;
		dataCache[data.queryId].elementId = `${blockName}-${data.queryId}`;
		dataCache[data.queryId].postsToIgnore = [];
		addInitialStickyPostsToIgnore(data.queryId);
		watchForInfiniteScrollBlock(data.queryId);
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
	fetch(decodeNextPageLink(queryId))
		.then(response => response.text())
		.then(html => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			const infiniteScrollBlock = doc ? doc.getElementById(dataCache[queryId].elementId) : null;
			const queryBlock = infiniteScrollBlock ? infiniteScrollBlock.closest(".wp-block-query") : null;
			const templateBlock = queryBlock ? queryBlock.querySelector(".wp-block-post-template") : null;

			// Extract the next page link
			if (infiniteScrollBlock) {
				const rawData = infiniteScrollBlock.querySelector(`pre.${blockName}-data`);
				const data = JSON.parse(rawData.innerHTML);
				dataCache[queryId].nextPageLink = data.nextPageLink;
			} else {
				dataCache[queryId].nextPageLink = "";
			}

			// Extract all the posts if we have a list
			const posts = [];
			if (templateBlock) {
				templateBlock.querySelectorAll("li.wp-block-post").forEach(li => {
					var ignoreListItem = false; // Used to detect stick posts we have already printed
					for (const postId of dataCache[queryId].stickyPosts) {
						if (li.classList.contains(`post-${postId}`)) {
							if (dataCache[queryId].postsToIgnore.includes(postId)) {
								ignoreListItem = true;
							} else {
								dataCache[queryId].postsToIgnore.push(postId);
							}
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
					posts.forEach(post => {
						templateBlock.appendChild(post);
					});
				}
			}

			// Let us do it all over again!
			watchForInfiniteScrollBlock(queryId);
		})
		.catch(message => console.error(message));
}

function disableAndCleanUpInfinteScrollBlock(queryId) {
	// Show the no more posts elements
	const endBlocks = document.querySelectorAll(`#${dataCache[queryId].elementId} .wp-block-${blockName}-end--hidden`);
	endBlocks.forEach(block => {
		block.classList.remove(`wp-block-${blockName}-end--hidden`);
	});

	// Remove all loading elements
	const loadingBlocks = document.querySelectorAll(`#${dataCache[queryId].elementId} .wp-block-${blockName}-loading`);
	loadingBlocks.forEach(block => {
		block.remove();
	});

	// No need to hold onto this data
	delete dataCache[queryId];
}

function addInitialStickyPostsToIgnore(queryId) {
	const infiniteScrollBlock = document.getElementById(dataCache[queryId].elementId);
	const queryBlock = infiniteScrollBlock ? infiniteScrollBlock.closest(".wp-block-query") : null;
	const templateBlock = queryBlock ? queryBlock.querySelector(".wp-block-post-template") : null;
	if (templateBlock) {
		templateBlock.querySelectorAll("li.wp-block-post").forEach(li => {
			for (const postId of dataCache[queryId].stickyPosts) {
				if (li.classList.contains(`post-${postId}`)) {
					dataCache[queryId].postsToIgnore.push(postId);
					break;
				}
			}
		});
	}
}

function decodeNextPageLink(queryId) {
	// Create a temporary DOM element to utilize the browser's HTML parser
	var tempElement = document.createElement("textarea");
	tempElement.innerHTML = dataCache[queryId].nextPageLink;
	return tempElement.textContent || tempElement.innerText || "";
}

function lastPageHasLoaded(queryId) {
	return dataCache[queryId].nextPageLink == "";
}
