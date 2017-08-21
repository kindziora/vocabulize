
function getCards (analysis, translation) {
     var cards = []; 
     analysis.list.forEach(function(v, k) {
        var card = {
            original : v.word,
            translation : translation[k],
            rank : v.count,
            counter : 0
        };
        cards.push(card);
    });
    return cards;
}
    
function translate(analysis, cb) { 
 
     
     var key = "trnsl.1.1.20151104T202853Z.f0cfd4eec6d2b7ac.96e6c288e08b3debc3b1be2d3e61b90134563bcf";

     var placesString = analysis.list.reduce(function(str, current){
          return str + "&text=" + current.word;
        }, "");
             
     
     $.ajax({
        url: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&lang=' + 'ru-de' + '&' + placesString,
        jsonp: "callback",
        dataType: "jsonp",
       // method: 'GET',
        success: function (data) { 
            cb(analysis, data.text);
        }
    }); 
    
     
    
}
    