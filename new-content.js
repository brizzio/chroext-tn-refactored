var listItemArray = Array.from(document.querySelectorAll('.x-nav-menu__dropdown-inner-row')).map(el=>el)

var aRef = listItemArray.map(function(el){
    let links =  Array.from(el.getElementsByTagName('a'))
    return links.map(i = i.href)
})

//-------------------------------------------------

/** hashcode function (credit http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery **/
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


  

function* navigator(array){
    console.log('iterator')
    for(let i = 0; i< array.length; i++){
        let url = array[i].url
        window.location.href = url
        yield array[i]
    }

  }

 
  
var flatten = function (arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
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

var departamentos = flatten(Array.from(document.querySelectorAll('.x-nav-menu__dropdown-inner-row'))
  .map(function(el){
        let links =  Array.from(el.getElementsByTagName('a'))
        return links.map(i=> i.href) })
  )

  var classificacao = formataArvoreCategorias(departamentos)

  
  
  
  var page_list = navigator(classificacao)
 



/* <div class="x-category__top"><p class="x-category__product-qty" rv-text="app.props.productQty | suffix ' produtos encontrados'">51 produtos encontrados</p><!-- rivets: if app.props.grid | eq 'grid4' --> 

class="x-category__products"

window.addEventListener('load', function() {
    console.log('All assets are loaded')
     
})

*/



var idfyer = function(){ 
    var d = new Date()
    var mills = d.valueOf() 
    var str = d.toString();
    var t = d.toISOString()

    return  {
        mills:mills,
        str:str,
        timestamp:t
    }
}


var btn = document.getElementsByClassName('cf-load-more')[0]

var isButtonVisible = (btn.style.display != "none");

var showAllProducts = function(){
    var exist = false
    var button = document.getElementsByClassName('cf-load-more')[0]
    
    if(button.offsetTop > 0 ){
        button.click()
        exist=true
    }
    return exist
}
while (btn.offsetTop > 0 ){btn.click()};

var scanpage = function(){

    let url = test[0].url
    window.location.href = url
    console.log('scanpage navegou...')
    let btn = document.getElementsByClassName('cf-load-more')[0]
    while (btn.style.display != "none"){btn.click()};

    return true
}

//scrape da pagina de categorias

var clsString = "{\"uid\":1630952241734,\"id\":2628773538,\"hostname\":\"www.telhanorte.com.br\",\"protocolo\":\"https:\",\"secure\":true,\"url\":\"https://www.telhanorte.com.br/pisos-e-revestimentos/acabamentos-para-piso\",\"nivel_1\":\"pisos-e-revestimentos\",\"nivel_2\":\"acabamentos-para-piso\",\"nivel_3\":\"\",\"nivel_4\":\"\",\"nivel_5\":\"\"}"

var cls = JSON.parse(clsString)


const ary = classificacao.slice(0);
var quant = document.getElementsByClassName("x-category__product-qty")[0].innerText

var produtos_na_pagina = document.getElementsByClassName('x-category__products')

var produtos = Array.from(document.getElementsByClassName('x-category__products')[0].getElementsByTagName('li')).map(el=>el)


var produtos_scan_result = function(produtos){

    var articles= produtos.map(function(li_el){
        var li = document.createElement("li");
        li.innerHTML = li_el.innerHTML

        var produto_permalink = li.querySelectorAll("a")[0].href
        var produto_descricao = li.querySelectorAll("a")[0].title
        var produto_img = li.querySelectorAll("img")[0].src
        var produto_preco = li.querySelectorAll("span[rv-text='product.price | formatPrice']")[0].innerHTML
        var elm_desconto = li.querySelectorAll("div[class='x-shelf__discount-flag']")
        var produto_desconto = (elm_desconto.length = 0)?li.querySelectorAll("div[class='x-shelf__discount-flag']")[0].getElementsByTagName('span')[0].innerHTML:0


        return {
            permalink: produto_permalink,
            descricao: produto_descricao,
            img: produto_img,
            preco: produto_preco,
            desconto: produto_desconto

        }

        
    })

    return articles

}


var article = prod[0].getElementsByTagName('article')[0]
var product_shelf = prod[0].getElementsByClassName('x-shelf__content')[0]


var produto_data = function(article){

    let obj = {}
    var produto_permalink = article.querySelectorAll("a")[0].href
    var produto_descricao = article.querySelectorAll("a")[0].title
    var produto_img = article.querySelectorAll("img")[0].src
    var produto_preco = article.querySelectorAll("span[rv-text='product.price | formatPrice']")[0].innerHTML
    var elm_desconto = article.querySelectorAll("div[class='x-shelf__discount-flag']")
    var produto_desconto = (elm_desconto.length = 0)?article.querySelectorAll("div[class='x-shelf__discount-flag']")[0].getElementsByTagName('span')[0].innerHTML:0


    return {
        permalink: produto_permalink,
        descricao: produto_descricao,
        img: produto_img,
        preco: produto_preco,
        desconto: produto_desconto

    }


}