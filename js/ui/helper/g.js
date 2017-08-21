String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

String.prototype.countWords = function() {
	
	var text = this
	.toLowerCase()
	.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")
	.split(/\s+/);
	var textArray = [];
	
  	var counted = text.reduce(function(countMap, word) {
  		if(word.trim() !== ''){
  			countMap[word] = ++countMap[word] || 1;
  		}
        return countMap; 
    }, {}); 
    
    for(var i in counted){
    	if(i.trim() !== ''){
    		textArray.push({word : i, count : counted[i]});
    	}
	} 
    
    return {
	    	index: counted, 
	    	list: textArray.sort(function(a, b) {
	          return b.count - a.count;
	    })
    };
};
