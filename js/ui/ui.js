function ui (apiKey, data){
    var self = this;
    
    self.translationReady = function (me) {
        me.model2View.call(this);
    };
    
    this.validator = {
        'translation' : function(value, name) {
            var cardName = this._getParentObject(name, '');
            var card = this.get(cardName);
            var valid = value.trim().toLowerCase() === card.translation.trim().toLowerCase();
            
            return {
                result: valid,
                msg : "oops...",
                view : "validInfo"
            };
        }
    };
    
    this.interactions = {
        'card' : {
            'dblclick' : function(e, me){
                var $card =  this.find('.cardx');
                $card.toggleClass('flipped');
                var CntName = this.getName() + '.counter';
               
                if($card.hasClass('flipped')) {
                     var cnt = me.model.get(CntName);
                    cnt = cnt + 1;
                    me.model.set(CntName, cnt);
                }
               
                return me.model.get(this.getName());
            }, 
            'swipe' : function( e ) {
              console.log(e); 
              
            },
            'change' : function(e, me){
               return me.validate(this.getName(), this.val(), 'translation'); 
            }
        }, 
        'textin' : {
            'change' : function(e, me){
                var analysis = this.getValue().countWords();
              
                translate(analysis, function(analysis, translation) {
                   me.model.set('card', getCards(analysis, translation));
                   self.translationReady(me); 
                });
                
                return this.getValue();
            }
        },
        'play' : {
            'click' : function(e){
                e.preventDefault();
                $('body').addClass('play');
                
                MBP.toggleFullScreen();
                 
                setTimeout(function(){
                    $('.greeting').fadeOut(300); 
                    $('.playarea').fadeIn(300); 
                }, 2000);
            }
        },
       'translate' : {
            'click' : function(e, me){
                self.translationReady = function () {
                    me.model2View.call(this);
                };
                self.translationReady();
            }
        }
    };
    
    this.model = {
        field : {
        },
        event : {
            sync : function(d) {
                console.log(d, this);
            }
        }
    };
    
    this.view = {
        templates_: {},
        templates: true,
        viewpath: 'js/ui/view/',
        fileextension: 'twig.html',
        render: function (tplVars, tplName) {
            return twig({
                data: self.view.templates_[tplName || arguments.callee.caller]
            }).render(tplVars);
        },
        views: { 
            "validInfo" : function(msg, notation, $el){ 
               var validationResult = this.model.getState(notation);  
               return validationResult.result ? 'richtig': validationResult.msg;
            },
            "length" : function(cards, index){
                return cards.length;
            },
            "foreach->card" : function (potentialMatch, index) {
                return self.view.render({'index': index, 'item': potentialMatch});
            },
            "foreach->cardswitched" : function (potentialMatch, index) {
                  var posterAngle = 360 / self.model.field.card.length;
                  const RING_RADIUS = 130;
                  var transform = '-webkit-transform: rotateX(' + (posterAngle * index) + 'deg) translateZ(' + RING_RADIUS + 'px)';
              
                return self.view.render({'index': index, 'item': potentialMatch, 'transform' : transform});
            }
        } 
    };
        
}