/* // A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// This is the content script for the extension

// Things are happening
console.log("Chrome extension is running!");

var departamentos
var classificacao



// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

// Handle the message
function receiver(request, sender, sendResponse) {
  
  console.log("o content recebeu ===>");
  console.log(request);
//----------------------------------------------------------
  if (request.message === "pinker") {
    var elts = document.getElementsByTagName('p');
    for (var i = 0; i < elts.length; i++) {
      elts[i].style['background-color'] = '#F0C';
    }
    // Send a message back!
    let o ={
      type:"message",
      data:"thank you"
    }
    chrome.runtime.sendMessage(o);
  }

//----------------------------------------------------------

  if (request.message === "scrape-all") {
    console.log("vai executar a promise");
    var classificacao = new Promise(function(resolve, reject) {
      console.log("dentro promise");

      var flatten = function (arr) {
        return arr.reduce(function (flat, toFlatten) {
          return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
      }

      var departamentos = flatten(Array.from(document.querySelectorAll('.x-nav-menu__dropdown-inner-row')).map(function(el){
            let links =  Array.from(el.getElementsByTagName('a'))
            return links.map(i=> i.href) })
            )

      return resolve(formataArvoreCategorias( departamentos))
    })
    
    classificacao.then(function(response){
      console.log("preparando a mensagem");

      let o ={
        type:"classificador",
        name:"classificacao",
        data:JSON.stringify(response)
      }
      // Send a message back!
      chrome.runtime.sendMessage(o)
    
    })
  
  }
  //----------------------------------------------------------

  if (request.message === "scan-produtos") {
    console.log("vai pegar os produtos da pagina inteira ");

    


    var produtos_scan_result = new Promise(function(resolve,reject){
      
      var produtos = Array.from(document.getElementsByClassName('x-category__products')[0].getElementsByTagName('li')).map(el=>el)
      
      var articles = produtos.map(function(li_el){
        var li = document.createElement("li");
        li.innerHTML = li_el.innerHTML

        var produto_permalink = li.querySelectorAll("a")[0].href
        var puid = produto_permalink.split("").map(v=>v.charCodeAt(0)).reduce((a,v)=>a+((a<<7)+(a<<3))^v).toString(16);
        var produto_descricao = li.querySelectorAll("a")[0].title
        var produto_img = li.querySelectorAll("img")[0].src
        var produto_preco = li.querySelectorAll("span[rv-text='product.price | formatPrice']")[0].innerHTML
        var elm_desconto = li.querySelectorAll("div[class='x-shelf__discount-flag']")
        var produto_desconto = (elm_desconto.length = 0)?li.querySelectorAll("div[class='x-shelf__discount-flag']")[0].getElementsByTagName('span')[0].innerHTML:0


        return {
            piud:puid,
            permalink: produto_permalink,
            descricao: produto_descricao,
            img: produto_img,
            preco: produto_preco,
            desconto: produto_desconto

        }

        
    })

    return resolve(articles)

})

produtos_scan_result.then(function(response){
      console.log("preparando a mensagem com os produtos da pagina");

      let o ={
        type:"products-page",
        name:"produtos",
        data:JSON.stringify(response)
      }
      // Send a message back!
      chrome.runtime.sendMessage(o)

    })

        
  }

//----------------------------------------------------------

}

//***************************************************************
                        UTILS


var formataArvoreCategorias = function(liArray){
    
  return liArray.map(function(liArrayItem){

      var res ={}
      var obj = parser(liArrayItem)

      res.uid = idfyer().id
      res.id = hashCode(obj.url)
      res.hostname = obj.hostname
      res.protocolo = obj.protocolo
      res.secure = obj.secure
      res.url = obj.url

      let paths = obj.path.split("/")
      paths.shift()

      for (var i = 0; i < 5; i++) {
          var value = paths[i]?paths[i]:''
          var key = 'nivel_' + (i + 1);
          res[key]=value
      }

      return res
  })

}


//hashcode function (credit http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery *
  var hashCode = function(str,seed) {
    var
    l = str.length,
    h = seed ^ l,
    i = 0,
    k;
  
        while (l >= 4) {
            k = 
            ((str.charCodeAt(i) & 0xff)) |
            ((str.charCodeAt(++i) & 0xff) << 8) |
            ((str.charCodeAt(++i) & 0xff) << 16) |
            ((str.charCodeAt(++i) & 0xff) << 24);
            
            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
            k ^= k >>> 24;
            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

            l -= 4;
            ++i;
        }
        
        switch (l) {
        case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
        case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
        case 1: h ^= (str.charCodeAt(i) & 0xff);
                h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        }

        h ^= h >>> 13;
        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        h ^= h >>> 15;

        return h >>> 0;
    };



var idfyer = function(){ 
    var d = new Date().valueOf()
    var str = new Date(d).toString();
    var t = new Date(d).toISOString()
    var uuid = d -  Math.floor(Math.random() * (Math.ceil(10000) - Math.ceil(1000)))
    return  {
        id:uuid,
        str:str,
        timestamp:t
    }
}





var parser = function(strUrl){

  var parser = document.createElement('a');
  parser.href = strUrl

  return {
  protocolo : parser.protocol, // => "http:"
  hostname :  parser.hostname, // => "example.com"
  port : parser.port,          // => "3000"
  path : parser.pathname,      // => "/pathname/"
  query : parser.search,       // => "?search=test"
  hash : parser.hash,          // => "#hash"
  host : parser.host,          // => "example.com:3000"
  secure:(parser.protocol==="https:"),
  url: parser.href  
  }
}
 */