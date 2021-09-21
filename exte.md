This tutorial explains how to create a Google Chrome extension that will navigate through a list of given URLs, and save data from each page to a file.

The extension includes the following features :

Automate multiple URLs to open in the same tab — one after the other — from a given list.
Scraping data from each page to a JSON file.
Saving the files in the Downloads directory.
This tutorial assumes that the reader already knows how to create a basic Chrome extension. The current tutorial just covers the Javascript & HTML code involved in the extension files — manifest.json, background.js, popup.html, popup.js & the content script.

manifest.json
{
	"name": "UA Demo Extension",
	"version": "1.0",
	"description": "UA Demo Extension",
	"permissions": ["declarativeContent", "activeTab", "tabs", "downloads", "*://*/*"],
	"background": {
    	"scripts": ["background.js"],
      	"persistent": false
    },
    "page_action": {
    	"default_popup": "popup.html",
    },
	"manifest_version": 2
}
The following permissions are required :

declarativeContent - to load extension only when page url is of a specific hostname
activeTab - to access the active tab
tabs - to open URL in tab
downloads - to save files in Downloads directory
*://*/* - match pattern permission to access DOM content of the given URLs
background.js
'use strict';

// activate extension when host is www.website.com
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
				conditions: [new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {hostEquals: 'www.website.com'},
				})
			],
		    actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});
For the sake of the tutorial, extension will get activated if hostname of the current page is www.website.com

popup.html
<!DOCTYPE html>
<html>
<head>
<style>
button {
    height: 30px;
    width: 30px;
    outline: none;
    border: none;
    background-color: orange;
    border: 2px solid #000000;
}
</style>
</head>

<body>

<button id="startNavigation"></button>
<script src="popup.js"></script>

</body>
<html>
The extension just consists of a button and a script file. On clicking this button, navigation will start.

Important : Navigation will stop if this button loses focus.

popup.js
'use strict';

// list of urls to navigate
let urls_list = [
	'https://website.com/page-1',
	'https://website.com/page-2',
	'https://website.com/page-3',
	'https://website.com/page-4',
	'https://website.com/page-5',
];

// start navigation when #startNavigation button is clicked
startNavigation.onclick = function(element) {
	// query the current tab to find its id
	chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
		for(let i=0; i<urls_list.length; i++) {
			// navigate to next url
			await goToPage(urls_list[i], i+1, tabs[0].id);
			
			// wait for 5 seconds
			await waitSeconds(5);
		}

		// navigation of all pages is finished
		alert('Navigation Completed');
	});
};

async function goToPage(url, url_index, tab_id) {
	return new Promise(function(resolve, reject) {
		// update current tab with new url
		chrome.tabs.update({url: url});
		
		// fired when tab is updated
		chrome.tabs.onUpdated.addListener(function openPage(tabID, changeInfo) {
			// tab has finished loading, validate whether it is the same tab
			if(tab_id == tabID && changeInfo.status === 'complete') {
				// remove tab onUpdate event as it may get duplicated
				chrome.tabs.onUpdated.removeListener(openPage);

				// fired when content script sends a message
				chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
					// remove onMessage event as it may get duplicated
					chrome.runtime.onMessage.removeListener(getDOMInfo);

					// save data from message to a JSON file and download
					let json_data = {
						title: JSON.parse(message).title,
						h1: JSON.parse(message).h1,
						url: url
					};

					let blob = new Blob([JSON.stringify(json_data)], {type: "application/json;charset=utf-8"});
					let objectURL = URL.createObjectURL(blob);
					chrome.downloads.download({ url: objectURL, filename: ('content/' + url_index + '/data.json'), conflictAction: 'overwrite' });
				});

				// execute content script
				chrome.tabs.executeScript({ file: 'script.js' }, function() {
					// resolve Promise after content script has executed
					resolve();
				});
			}
		});
	});
}

// async function to wait for x seconds 
async function waitSeconds(seconds) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve();
		}, seconds*1000);
	});
}
Content script script.js code :

let page_title = document.title,
	page_h1_tag = '';

if(document.querySelector("h1") !== null)
	page_h1_tag = document.querySelector("h1").textContent;

// prepare JSON data with page title & first h1 tag
let data = JSON.stringify({ title: page_title, h1: page_h1_tag });

// send message back to popup script
chrome.runtime.sendMessage(null, data);
async-await is used to write down asynchronous code in a synchronous-styled code.
Between each page, we are waiting for a few seconds. This is also written in async-await style.
The event chrome.tabs.onUpdated is fired when the tab is updated with the new url. We also wait for the page to be loaded.
We need to execute a content script within each page to get data from the page's DOM. The content script sends the data back as a message.
The chrome.runtime.onMessage is fired when the message is received from the content script.
We create a new Blob object using JSON data, and create a local object URL out of it. That object URL is given as the download url.
Scraped data is saved as content/1/data.json, content/2/data.json etc in the Downloads directory.
Other Resources
Chrome Extensions Getting Started Tutorial
Chrome Extensions APIs