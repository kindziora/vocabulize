/**
 * 
 * klaster.js by Alexander Kindziora 2014 
 * is a mva (model-view-action) framework for user interfaces
 */

var uiError;

var twigInterface = function (model, cachedViews, isdev, cache) {
    var intfc = this;
    
    this.interactions = {
        bg: {
            click: function (e, self) {
                e.preventDefault();
                $('.lightbox').hide();
            }
        },
        zoom: {
            click: function (e, self) {
                e.preventDefault();
                var $box = $($(this).attr('href'));
                var $img = $box.find('.bigImg');
                $img.attr('src', $img.attr('data-src'));
                $box.show();
            }
        },
        'mark': {
            click: function (e, self) {
                e.preventDefault();
                var modelValue = !this.getValue('model'); //get invert value from model
                this.getValue(modelValue); //set inverted value to dom
                return modelValue; // return inverted value to model
            }
        }
    };

    this.model = {
        'field': model,
        event: { 
            sync: function () { 
                $('.jsonResult').val(JSON.stringify(this.field.items)); 
            }
        }
    };

    this.view = {
        templates_: cachedViews,
        templates: isdev,
        viewpath: 'view/twigInterface/',
        fileextension: 'html.twig',
        render: function (tplVars, tplName) {
            
            var key = tplName + JSON.stringify(tplVars);
            var data = false; //cache.get(key);
            if(data){
                return data.content;
            }else{
                 var res = twig({
                    data: intfc.view.templates_[tplName || arguments.callee.caller]
                });
                
                var result = res.render(tplVars);
                
                if (result) {
                    cache.set(key, result, 60 * 10000);
                    return result;
                } else {
                    console.log('error TEMPLATE NICHT IN CACHED.json gefunden', arguments.callee.caller);
                    return '<div></div>';
                }
            
            } 
       },
       views: {
           "foreach->items": function (item, index) {
               console.log(item);
                return intfc.view.render({
                    'index': index, 
                    'item': item, 
                     marked: typeof intfc.model.field.items[index].result !== 'undefined' ?
                     !intfc.model.field.items[index].result 
                     : false
                },
                "foreach->items");
            }
        },
        init: function () {
            Twig.extendFilter('encodeURIComponent', function (str) {
                return encodeURIComponent(str);
            });

            Twig.extendFunction('failed', function (str) {
                return URLS['failed'];
            });

            Twig.extendFilter('bigImg', function (str) {
                var parts = str.split('-');
                parts[parts.length - 2] = 500;
                return parts.join('-');
            });

        }()
    };

};

var cb = function (cachedViews) {
    model.tag_name = model.items[0].tag_name;
    
    var mytodos = new twigInterface(model, cachedViews, isdev, cache);
    $k('#todoapp')(mytodos);
    mytodos.model.event.sync.call(mytodos.model);
};

$.get(cachedUrl).done(cb);