// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// This is the background script for the extension

//msg: global variable. 
//its always updated with the active message 
msg={}
var bg = {}
//bg['classificacao']=[]
var runningTab = 0 
var runningUrl = ''
var iter




// A listener for when the user clicks on the extension button
chrome.browserAction.onClicked.addListener(buttonClicked);

// Handle that click
async function buttonClicked(tab) {
  // Send a message to the active tab
  console.log("button clicked!");
  
  let host = "https://www.telhanorte.com.br/pisos-e-revestimentos/acabamentos-para-piso"
  runningTab = tab.id
  runningUrl = host
  var linximpulse = "https://api.linximpulse.com/engage/search/v3/navigates*";
  //setListener(linximpulse)
  showMoreProducts(runningTab).then(function(tb){
    console.log(`podemos pegar os produtos com a pagina aberta... tab > "${tb}"`);
    bg['produtos'] = getProducts(tid,"products.js")
  })
  
  // Send a message to the tab that is open when button was clicked
  //chrome.tabs.sendMessage(tab.id, {"message": "browser action"});
}




/* function display(t){
  console.log('retornou o texto: ', t)
  if (t !== undefined && t == "true") {
    console.log(`String1 = "${msg.text}"`);
  }
  if (msg.text !== undefined && msg.text == "false") {
    console.log(`podemos pegar os produtos com a pagina aberta... tab > "${tid}"`);
    bg['produtos'] = getProducts(tid,"products.js")
  }

} */

function showMoreProducts(tid){

  console.log('pegou a tab: ', tid)

  return new Promise( function (resolve,reject){
  
  script(tid)

  function script(tabId){
      chrome.tabs.executeScript(
        tabId,
        {code: `
                  var btnClick = function(){
                    var btn = document.getElementsByClassName('cf-load-more')[0]
                    if(btn.offsetTop > 0){
                        console.log("btn top:", btn.offsetTop)
                        console.log('readyState antes do click:' + document.readyState);

                        btn.click()
                        console.log("cliquei no botão")
                        return "true";
                    } else {
                            
                        return "false";
                    }
                  };
                  btnClick()
        `         
        },
        resultArr => clickAgain(resultArr[0])
      );
  }

    function clickAgain(t){
      if (t !== undefined && t == "true") {
        const delay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        setTimeut(script(tid),delay)
      }
      if (t !== undefined && t == "false") {
        
        resolve(tid)
      }

    }
  });
}


async function getProducts(tid,scriptFile) {
	return new Promise(function(resolve, reject) {
		
					// fired when content script sends a message
				chrome.runtime.onMessage.addListener(function getDOMInfo(message) {
					// remove onMessage event as it may get duplicated
					chrome.runtime.onMessage.removeListener(getDOMInfo);
          
					// save data from message to a JSON file and download
					let json = JSON.parse(message)
          console.log('retornou', json)
					let blob = new Blob([JSON.stringify(json)], {type: "application/json;charset=utf-8"});
					let objectURL = URL.createObjectURL(blob);
					chrome.downloads.download({ url: objectURL, filename: 'produtos.json', conflictAction: 'overwrite' });
          resolve(json.data)
				});

				// execute content script
				chrome.tabs.executeScript({ file: scriptFile }, function() {
					// resolve Promise after content script has executed
					//resolve();
          console.log('product.js executed!')
				});
	})
}

function setListener(target) {

  
  // add event listners
  chrome.webRequest.onBeforeRequest.addListener(
      function onBefReq(details) { 
          console.log('onBeforeRequest', details);
      },
      {urls: [target]},
      []
  );

  chrome.webRequest.onBeforeSendHeaders.addListener(
      function onBefSendH(details) {
          console.log('onBeforeSendHeaders', details);
      },
      {urls: [target]},
      ["requestHeaders"]
  );

  chrome.webRequest.onCompleted.addListener( 
      function onCompleted(details) {
          console.log('onCompleted', details);

          
          
      },
      {urls: [target]},
      []
  );
  
  chrome.webRequest.onHeadersReceived.addListener( 
    function onHeadRecived(details) {
        console.log('onHeadersReceived', details);
    },
    {urls: [target]},
    []
);

chrome.webRequest.onResponseStarted.addListener( 
  function onRespStart(details) {
      console.log('onResponseStarted', details);
  },
  {urls: [target]},
  []
);
  
};

/* 

function showMoreProducts(tid){

  console.log('pegou a tab: ', tid)

  var linximpulse = "https://api.linximpulse.com/engage/search/v3/navigates*&page=*";
  chrome.webRequest.onCompleted.addListener( 
    function completed(details) {
        console.log('onCompleted', details);
        //remove listener
        chrome.webRequest.onCompleted.removeListener(completed)
        //at this point the last call is completed, so we may call it again
        console.log('button click completed')
        console.log('vai chamar denovo pra ver se tem mais botao pra clicar....')
        showMoreProducts(tid)
        
    },
    {urls: [linximpulse]},
    []
  );

  chrome.runtime.onMessage.addListener (function btnResponse(msg) {
    // remove onMessage event as it may get duplicated
      chrome.runtime.onMessage.removeListener(btnResponse);
    if (msg.text !== undefined && msg.text == "true") {
      console.log(`String1 = "${msg.text}"`);
    }
    if (msg.text !== undefined && msg.text == "false") {
      console.log(`podemos pegar os produtos com a pagina aberta... tab > "${tid}"`);
      bg['produtos'] = getProducts(tid,"products.js")
    }
  }
  );
  

  chrome.tabs.executeScript(
    tid,
    {code: `
                var btn = document.getElementsByClassName('cf-load-more')[0]
                if(btn.offsetTop > 0){
                    console.log("btn top:", btn.offsetTop)
                    console.log('readyState antes do click:' + document.readyState);

                    btn.click()
                    console.log("cliquei no botão")
                    chrome.runtime.sendMessage({text: "true"});
                } else {
                        
                    chrome.runtime.sendMessage({text: "false"});
                }
    `
    }
  );

}

*/


/* 
var linximpulse = "https://api.linximpulse.com/engage/search/v3/navigates*";
  chrome.webRequest.onCompleted.addListener( 
    function completed(details) {
        console.log('onCompleted', details);
        //remove listener
        chrome.webRequest.onCompleted.removeListener(completed)
        //at this point the last call is completed, so we may call it again
        showMoreProducts()
        
    },
    {urls: [linximpulse]},
    []
  );
,

const actualCode = `
  var s = document.createElement('script');
  s.src = ${resourceUrl};
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
`;

  chrome.tabs.executeScript(tabId, {code: actualCode, runAt: 'document_end'}, cb);


async function goToPage(url, filename, tab_id,scriptFile) {
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
					let json = JSON.parse(message)
          console.log('retornou', json)
					let blob = new Blob([JSON.stringify(json)], {type: "application/json;charset=utf-8"});
					let objectURL = URL.createObjectURL(blob);
					chrome.downloads.download({ url: objectURL, filename: filename, conflictAction: 'overwrite' });
          resolve(json.data)
				});

				// execute content script
				chrome.tabs.executeScript({ file: scriptFile }, function() {
					// resolve Promise after content script has executed
					//resolve();
				});
			}
		});
	});
}


chrome.devtools.network.onRequestFinished.addListener(request => {
            request.getContent((body) => {
              if (request.request && request.request.url) {
                if (request.request.url.includes(target)) {
          
                   //continue with custom code
                   var bodyObj = JSON.parse(body);//etc.
                   console.log(bodyObj)
                }
          }
          });
          });
 */


/* // Listening for messages
chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
  console.log("background receiver function got: ",request);
  switch(request.type)
  {
    case "message":
          console.log("%s says > %s", sender.name, request.data)
          break;
    case "setVariable":
          bg[request.name]=JSON.parse(request.data)
          console.log(sender)
          console.log("%s sent variable: %s > payload > ", sender.origin, request.name)
          console.log(bg[request.name])
          break;
    case "classificador":
          bg[request.name]=JSON.parse(request.data)
          console.log(sender)
          console.log("%s sent variable: %s > payload > ", sender.origin, request.name)
          console.log(bg[request.name])
          console.log('vai chamar a primeira url da classificacao...')
          runningUrl = bg.classificacao[0].url
          console.log('vai chamar a primeira url da classificacao...', runningUrl)
          msg = {"message": "scan-produtos"}
          chrome.tabs.update(runningTab, { url: runningUrl } );
          break;
    case "products-page":
          bg[request.name]=JSON.parse(request.data)
            console.log("%s sent dados de produto: %s > payload > ", sender.origin, request.name)
            console.log(bg[request.name])
            
  }     
  
}


chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log(activeInfo);
  console.log("runningTab-->", runningTab);
  if(activeInfo.tabId == runningTab){
    let msg = {"message": "pinker"}
    console.log("podia mandar agora ...(" + activeInfo.tabId + ")=>>> ",msg);
  };
});


chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
  
  if (tab.status == 'complete' && tabID == runningTab && runningUrl) {
    console.log("Updated tab (" + tabID + ")=>>> ",tab.url);
    console.log("changeInfo (" + tabID + ")=>>> ",changeInfo )
    console.log('navigation completed... vou passar a mensagem');

    
    console.log("mensagem enviada...", msg);
    _messager(tabID, msg);
   
   
  }
});

function _messager(tid, message){

  console.log("messager message sent...", message);
  chrome.tabs.sendMessage(tid, message);

} */