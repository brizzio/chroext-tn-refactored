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

function* generator(){
  yield 'https://www.telhanorte.com.br/';
  yield 'scrape-all';
  yield* bg.classificacao


}

var sites = [
  {
      id:1,
      nome:"Madeira Madeira",
      host:"www.madeiramadeira.com.br",
      img:"assets/img/madeiramadeira-logo.jpg"
  
  },
  {
      id:2,
      nome:"Telhanorte",
      host:"www.telhanorte.com.br",
      img:"assets/img/telhanorte.png"
  
  }
]



// A listener for when the user clicks on the extension button
chrome.browserAction.onClicked.addListener(buttonClicked);

// Handle that click
async function buttonClicked(tab) {
  // Send a message to the active tab
  console.log("button clicked!");
  iter = generator()
  let host = iter.next().value
  runningTab = tab.id
  runningUrl = host
  console.log("vai fazer update na aba", runningTab);
  var cl = await goToPage(host, "tn-classificacao.json", runningTab,'classificacao.js').then(async function(classData){
    console.log("entrou no then", classData);
    //loop as urls da classificação
    var sortimento = []
    for(let i=0; i<2; i++) {
			// navigate to next url
      var classItem = classData[i]
      var productPageData = await goToPage(classItem.url, false, runningTab,'products.js')
      .then(function(arr){
        return arr.map(function(item){
          return {...classItem,...item}
        })
      })
			sortimento.push(productPageData);
			
			// wait for 5 seconds
			//await waitSeconds(5);
		}

    return sortimento

  }).then(function(srt){
    console.log("resultado do scan", srt);
  })
};
  
  
  // Send a message to the tab that is open when button was clicked
  //chrome.tabs.sendMessage(tab.id, {"message": "browser action"});




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
					/* 
          DOWNLAD DATA
          let blob = new Blob([JSON.stringify(json)], {type: "application/json;charset=utf-8"});
					let objectURL = URL.createObjectURL(blob);
					chrome.downloads.download({ url: objectURL, filename: filename, conflictAction: 'overwrite' }); */
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