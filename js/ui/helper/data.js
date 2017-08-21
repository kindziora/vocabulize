function storage() {
    var self = this;
    var priv = {};
    
    var fdb = new ForerunnerDB();
    var db = fdb.db('main');
    var dictionary = db.collection('dictionary', 'name');  
    /**
     * remote hash of userdata
     **/
    this.startup = function(hRemote) {
        var system = db.collection('system', 'name');  
        var localInfo = system.find('hash');
        
        if(localInfo.data != hRemote.data){
            if(localInfo.time > hRemote.time){
                //update remote
            }else{
                //update local
            }
        } 
    };
    
    this.setDictionary = function (data) { 
        priv.data = data;
    };
    
    this.getDictionary = function () { 
        return priv.data;
    };
    
    this.addTranslation = function (original, translation, langugeCodes) { 
        dictionary.insert({original: original, translation: translation, 'lC' : langugeCodes });
        
    };
    //https://github.com/louischatriot/nedb ??
}