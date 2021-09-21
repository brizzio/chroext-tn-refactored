# chrome-ext-telhanorte

https://usefulangle.com/post/339/chrome-extension-create-page-scraper


let arr = [2, 3, 4];

    function* g2() { 
      yield 1;
      yield* arr;
      yield 5;
    }

    var iterator = g2();

    console.log(iterator.next()); // { value: 1, done: false }
    console.log(iterator.next()); // { value: 2, done: false }
    console.log(iterator.next()); // { value: 3, done: false }
    console.log(iterator.next()); // { value: 4, done: false }
    console.log(iterator.next()); // { value: 5, done: false }
    console.log(iterator.next()); // { value: undefined, done: true }


function* stepGen(steps){
  while (true) yield* steps;
}

var messenger = stepGen(bg.classificacao)

var urlToScan = messenger.next().value.url




You can also navigate active tab to required url ( without opening new tab )

chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
  chrome.tabs.update( tabs[0].id, { url: "http://stackoverflow.com//" } ); 
});

You may add a onclick-listener for the link.

var link = document.getElementById("link");
link.addEventListener("click", function(){
  chrome.tabs.getSelected({}, function(tab) {
    chrome.tabs.update(tab.id, {url: 'http://google.com'});
  });
}, false);
However i would use the chrome.tabs.create() function.

Share
Improve this answer
Follow
edited Oct 31 '12 at 11:07
answered Oct 31 '12 at 10:14

Johannes Mittendorfer
75655 silver badges1717 bronze badges
Its not working... Any permission related things... anything i wan to include which i have missed... – flykarthick Oct 31 '12 at 11:12
Have you added a class or id tag to the element matching this in the JavaScript code? e.g. <a id='link'>Open</a> – Johannes Mittendorfer Oct 31 '12 at 11:15
Add a comment

2

Easy. Put this in popup.html:

<a href='google.com' target='_newtab'>Click</a>

Or put this in the JS file:

window.open('http://google.com','_newtab');
============================================================




Referencing external resources 
The Content Security Policy used by apps disallows the use of many kinds of remote URLs, so you can't directly reference external images, stylesheets, or fonts from an app page. Instead, you can use use cross-origin XMLHttpRequests to fetch these resources, and then serve them via blob: URLs.

Manifest requirement 
To be able to do cross-origin XMLHttpRequests, you'll need to add a permission for the remote URL's host:

"permissions": [
    "...",
    "https://supersweetdomainbutnotcspfriendly.com/"
  ]
Cross-origin XMLHttpRequest 
Fetch the remote URL into the app and serve its contents as a blob: URL:

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://supersweetdomainbutnotcspfriendly.com/image.png', true);
xhr.responseType = 'blob';
xhr.onload = function(e) {
  var img = document.createElement('img');
  img.src = window.URL.createObjectURL(this.response);
  document.body.appendChild(img);
};

xhr.send();
You may want to save these resources locally, so that they are available offline.

Embed external web pages 
API Sample: Want to play with the code? Check out the browser sample.

The webview tag allows you to embed external web content in your app, for example, a web page. It replaces iframes that point to remote URLs, which are disabled inside Chrome Apps. Unlike iframes, the webview tag runs in a separate process. This means that an exploit inside of it will still be isolated and won't be able to gain elevated privileges. Further, since its storage (cookies, etc.) is isolated from the app, there is no way for the web content to access any of the app's data.

Add webview element 
Your webview element must include the URL to the source content and specify its dimensions.

<webview src="http://news.google.com/" width="640" height="480"></webview>
Update properties 
To dynamically change the src, width and height properties of a webview tag, you can either set those properties directly on the JavaScript object, or use the setAttribute DOM function.

document.querySelector('#mywebview').src =
    'http://blog.chromium.org/';
// or
document.querySelector('#mywebview').setAttribute(
    'src', 'http://blog.chromium.org/');



    ===============================================
    # Call a function in background from popup

  --- JavaScript
    var bgPage = chrome.extension.getBackgroundPage();
    var dat =  bgPage.paste(); // Here paste() is a function that returns value.

  ---

  https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage


# Window.postMessage()
The window.postMessage() method safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.

Normally, scripts on different pages are allowed to access each other if and only if the pages they originate from share the same protocol, port number, and host (also known as the "same-origin policy"). window.postMessage() provides a controlled mechanism to securely circumvent this restriction (if used properly).

Broadly, one window may obtain a reference to another (e.g., via targetWindow = window.opener), and then dispatch a MessageEvent on it with targetWindow.postMessage(). The receiving window is then free to handle this event as needed. The arguments passed to window.postMessage() (i.e., the “message”) are exposed to the receiving window through the event object.

Syntax
targetWindow.postMessage(message, targetOrigin, [transfer]);
Copy to 

-----
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript

tabs.executeScript()
Injects JavaScript code into a page.

You can inject code into pages whose URL can be expressed using a match pattern. To do so, its scheme must be one of: http, https, or file.

You must have the permission for the page's URL—either explicitly, as a host permission—or, via the activeTab permission.

You can also inject code into pages packaged with your own extension:

browser.tabs.create({url: "/my-page.html"}).then(() => {
  browser.tabs.executeScript({
    code: `console.log('location:', window.location.href);`
  });
});
Copy to Clipboard
You don't need any special permissions to do this.

You cannot inject code into any of the browser's built-in pages, such as: about:debugging, about:addons, or the page that opens when you open a new empty tab.

The scripts you inject are called content scripts.

This is an asynchronous function that returns a Promise.

Syntax
let executing = browser.tabs.executeScript(
  tabId,                 // optional integer
  details                // object
)
Copy to Clipboard
Parameters
tabId Optional
integer. The ID of the tab in which to run the script.

Defaults to the active tab of the current window.

details
An object describing the script to run.

It contains the following properties:

allFrames Optional
boolean. If true, the code will be injected into all frames of the current page.
If true and frameId is set, then it will raise an error. (frameId and allFrames are mutually exclusive.)

If it is false, code is only injected into the top frame.

Defaults to false.

code Optional
string. Code to inject, as a text string.

Warning: Don’t use this property to interpolate untrusted data into JavaScript, as this could lead to a security issue.

file Optional
string. Path to a file containing the code to inject.

In Firefox, relative URLs not starting at the extension root are resolved relative to the current page URL.
In Chrome, these URLs are resolved relative to the extension's base URL.
To work cross-browser, you can specify the path as a relative URL, starting at the extension's root, like this: "/path/to/script.js".

frameId Optional
integer. The frame where the code should be injected.

Defaults to 0 (the top-level frame).

matchAboutBlank Optional
boolean. If true, the code will be injected into embedded about:blank and about:srcdoc frames if your extension has access to their parent document. The code cannot be inserted in top-level about: frames.

Defaults to false.

runAt Optional
extensionTypes.RunAt. The soonest that the code will be injected into the tab.

Defaults to "document_idle".

Return value
A Promise that will resolve to an array of objects. The array's values represent the result of the script in every injected frame.

The result of the script is the last evaluated statement, which is similar to what would be output (the results, not any console.log() output) if you executed the script in the Web Console. For example, consider a script like this:

let foo='my result'; foo;
Copy to Clipboard
Here the results array will contain the string "my result" as an element.

The result values must be structured clonable (see Data cloning algorithm).

Note: The last statement may be also a Promise, but this feature is unsupported by webextension-polyfill library.

If any error occurs, the promise will be rejected with an error message.

Examples
This example executes a one-line code snippet in the currently active tab:

function onExecuted(result) {
  console.log(`We made it green`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

const makeItGreen = 'document.body.style.border = "5px solid green"';

const executing = browser.tabs.executeScript({
  code: makeItGreen
});
executing.then(onExecuted, onError);
Copy to Clipboard
This example executes a script from a file (packaged with the extension) called "content-script.js". The script is executed in the currently active tab. The script is executed in subframes as well as the main document:

function onExecuted(result) {
  console.log(`We executed in all subframes`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

const executing = browser.tabs.executeScript({
  file: "/content-script.js",
  allFrames: true
});
executing.then(onExecuted, onError);
Copy to Clipboard
This example executes a script from a file (packaged with the extension) called "content-script.js". The script is executed in the tab with an ID of 2:

function onExecuted(result) {
  console.log(`We executed in tab 2`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

const executing = browser.tabs.executeScript(
  2, {
    file: "/content-script.js"
});
executing.then(onExecuted, onError);
