// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// This is the content script for the extension

// Things are happening
console.log("PRODUCTS.JS is running!");
console.log("vai pegar os produtos da pagina inteira ");

    while(showAllProducts()){console.log("acionado o click no botao para mostrar mais produtos")}


    var produtos_scan_result = new Promise(function(resolve,reject){
      
      var produtos = Array.from(document.getElementsByClassName('x-category__products')[0].getElementsByTagName('li')).map(el=>el)
      var timestamp = new Date().toISOString()
      var articles = produtos.map(function(li_el){
        var li = document.createElement("li");
        li.innerHTML = li_el.innerHTML

        var produto_permalink = li.querySelectorAll("a")[0].href
        //var puid = produto_permalink.split("").map(v=>v.charCodeAt(0)).reduce((a,v)=>a+((a<<7)+(a<<3))^v).toString(16);
        var produto_descricao = li.querySelectorAll("a")[0].title
        var puid = hashCode(produto_descricao)
        var produto_img = li.querySelectorAll("img")[0].src
        var produto_preco = li.querySelectorAll("span[rv-text='product.price | formatPrice']")[0].innerHTML
        var elm_desconto = li.querySelectorAll("div[class='x-shelf__discount-flag']")
        var produto_desconto = (elm_desconto.length = 0)?li.querySelectorAll("div[class='x-shelf__discount-flag']")[0].getElementsByTagName('span')[0].innerHTML:0
        

        return {
            piud:puid,
            timestamp:timestamp,
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

      let obj ={
        type:"products-page",
        name:"produtos",
        data:response
      }
      // Send a message back!
      chrome.runtime.sendMessage(JSON.stringify(obj))

    })

        


function showAllProducts(){
  var exist = false
  var button = document.getElementsByClassName('cf-load-more')[0]
  
  if(button.offsetTop > 0 ){
      button.click()
      exist=true
  }
  return exist
}
  
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
      