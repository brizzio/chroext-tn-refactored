
var clickIfBtnExist = function(){

    var btn = document.getElementsByClassName('cf-load-more')[0]
    if(btn.offsetTop > 0){
        console.log("btn top:", btn.offsetTop)
        console.log('readyState antes do click:' + document.readyState);

        btn.click()
        console.log("cliquei no botão")
        return true
    } else {
        return false
    }


}

clickIfBtnExist();


/* 
2

What I do is following:

I keep track of my opened tabs

content script:

// connect to the background script
var port = chrome.extension.connect();
background script

// a tab requests connection to the background script
chrome.extension.onConnect.addListener(function(port) {
  var tabId = port.sender.tab.id;
  console.log('Received request from content script', port);

  // add tab when opened
  if (channelTabs.indexOf(tabId) == -1) {
    channelTabs.push(tabId);
  }

  // remove when closed/directed to another url
  port.onDisconnect.addListener(function() {
    channelTabs.splice(channelTabs.indexOf(tabId), 1);
  });
});
Now I can notify all my registered tabs (i.e. content scripts) from my background script when a certain action happened:

var notification = { foo: 'bar' };
for(var i = 0, len = channelTabs.length; i < len; i++) {
  chrome.tabs.sendMessage(channelTabs[i], notification, function(responseMessage) {
    // message coming back from content script
    console.log(responseMessage);
  });
}
And again, on the other side in the content script, you can add a listener on these messages:

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.foo == 'bar') {
    executeStuff();
    // if a callback is given:
    sendResponse && sendResponse('success');
  }
});
It's a bit of a brainf*ck, because it's redundant at some places. But I like it best that way, because you can wrap it and make it a bit easier.

If you want to see how I am using this, see my repository on GitHub: chrome-extension-communicator.
*/