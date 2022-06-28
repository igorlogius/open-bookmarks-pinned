/* global browser */

//const temporary = browser.runtime.id.endsWith('@temporary-addon'); // debugging?
const manifest = browser.runtime.getManifest();
const extname = manifest.name;

function recGetBookmarkUrls(bookmarkItem){
	let urls = [];
	if(bookmarkItem.url){
		urls.push(bookmarkItem.url);
	}else
	if(bookmarkItem.children){
		for(var child of bookmarkItem.children){
			urls = urls.concat(recGetBookmarkUrls(child));
		}
	}
	return urls;
}

browser.menus.create({
	id: extname,
	title: extname,
	contexts: ["bookmark", "link"],
	onclick: async function(info) {
		// open bookmarks pinned
		if(info.bookmarkId){

			const subtree = await browser.bookmarks.getSubTree(info.bookmarkId);
			const urls = recGetBookmarkUrls(subtree[0]);

			for(const url of urls){
				browser.tabs.create({
					'pinned': true,
					'url': url,
					'active': false
				});
			}
		}else
		if(info.linkUrl) {
			browser.tabs.create({
				'pinned': true,
				'url': info.linkUrl,
				'active': false
			});
		}
	}
});

