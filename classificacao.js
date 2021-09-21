// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// This is the content script for the extension

// Things are happening
console.log("CLASSIFICACAO.JS is running!!");
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

      return resolve(formataArvoreCategorias(departamentos))
    })
    
    classificacao.then(function(response){
      console.log("preparando a mensagem");

      let obj = {
         type:"classificador",
         name:"classificacao",
         data:response
       }

      
      // Send a message back!
      chrome.runtime.sendMessage(JSON.stringify(obj))
    
    })
  

function formataArvoreCategorias(liArray){
    
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


/** hashcode function (credit http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery **/
function hashCode(str,seed) {
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



function idfyer(){ 
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





function parser(strUrl){

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
