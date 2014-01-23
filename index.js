/*=========== PRIVATE VARIABLES AND METHODS ===========*/

var tableRow = function(tag, content){
    var row = '<tr>';
    for (var i = 0; i < content.length; i++) {
        row += '<'+tag+'>'+content[i]+'</'+tag+'>';
    };
    row += '</tr>';
    return row;
}

/*============ EXPORT THE DOC API CONFIGURATION ============*/

module.exports =  {

    identifier: "doc-http",
    title: "HTTP Documentation",
    layout: {
        sections:{
            "public":{
                order: 1,
                title: "public",
                match: function (id, module, section, item, subItem) {
                    return section == "public";
                }
            },
            "protected": {
                order: 2,
                title: "protected",
                match: function (id, module, section, item, subItem) {
                    return section == "protected";
                }
            }
        }
    },


    ui_resources : {
        js : [],
        css : ['resources/ui/api_ui_styles.css']
    },

    /*============ THIS FUNCTION WILL DETERMINE HOW THE TITLE APPEARS AT THE TOP OF THE PAGE ============*/

    //heading : function (dom) {}  Let's use the one provided by the default api


    /*============ CUSTOM RENDER METHODS FOR USING ALL THE DOC ATTRIBUTES TO SPIT OUT HTML FOR THE PARTIALS ===========*/

    html : {

        root: function(dom){

            var self = this,
                path, method,
                colors = {
                    get: 'green',
                    put: 'yellow',
                    post:'blue',
                    'delete': 'red'
                };

            dom.out.length = 0;
            dom.h1(self.shortName);

            if(self.description){
                dom.h('Description', function(){
                    dom.html(self.description);
                });
            }

            if(self.schemas && self.schemas.length > 0){

                dom.h('Schema', function(){

                    dom.tag('table', function(){
                        var schema,
                            table = tableRow('th', ['Field', 'Type', 'Description']);
                        
                        for (var i = 0; i < self.schemas.length; i++) {
                            schema = self.schemas[i];
                            if(schema.fields && schema.fields.length > 0){
                                schema.fields.forEach(function(field){
                                    table += tableRow('td', 
                                    ['<code class="plain">'+(field.name||'')+'</code>',  
                                     '<code class="plain">{'+(field.type||'')+'}</code>',
                                     field.description||''
                                    ]);
                                });
                            }
                        };
                            
                        dom.html(table);
                    });

                });           
            }


            if(self.paths && self.paths.length > 0){
                
                dom.h('Paths', function(){
                    
                    //Sort the paths - to make them appear
                    // in a nicer order
                    var method_order = {
                        get:1,
                        post:2,
                        put:3,
                        'delete':4
                    }
                    self.paths.sort(function(a, b){
                        var a_split = a.id.split('@');
                        var b_split = b.id.split('@');
                        if(a_split[0] !== b_split[0]){
                            return a_split[0] > b_split[0];
                        }
                        else if(a_split[1] && b_split[1]) {
                            return method_order[a_split[1]] > 
                                method_order[b_split[1]];
                        }
                        return a > b;
                    });

                    //Create each path
                    for (var i = 0; i < self.paths.length; i++) {
                        
                        path = self.paths[i];
                        method = path.method.split('-');

                        dom.div({class:'path-section'}, function(){

                            //Add relevant badges
                            dom.div(function(){
                                dom.tag('span', {class:'badge-method ' + (colors[method[0]] || 'default')}, method[0]);
                                if(method[1]){
                                    dom.tag('span', {class:'badge-method grey'}, method[1]);
                                }
                            });
                            
                            //Show the url path
                            dom.div({class:''}, function(){
                                dom.tag('pre', {class:'path'}, function(){
                                    dom.tag('code', path.path);
                                });
                            });

                            //Add parameters if present
                            if(path.param.length > 0){
                                dom.tag('h4', 'Parameters');
                                dom.div({class:'path-parameters'}, function(){
                                    dom.tag('table', function(){
                                        var table = tableRow('th', ['Field', 'Type', 'Description']),
                                            param;
                                        for (var i = 0; i < path.param.length; i++) {
                                            param = path.param[i];
                                            table += tableRow('td', 
                                                ['<code class="plain">'+(param.name||'')+'</code>',  
                                                 '<code class="plain">{'+(param.type||'')+'}</code>',
                                                 param.description||''
                                                ]);
                                        };
                                        dom.html(table);
                                    });
                                });  
                            }

                            //Add description
                            if(path.description){
                                dom.tag('h4', 'Description');
                                dom.div({class:'path-description'}, function(){
                                    dom.html(path.description);
                                });   
                            }

                        });
                        
                    };

                });

            }

            //console.log(this);
            
        }

    },


    parse : {

         //Works the same as param
         'field' : function (text) {
            var self = this;
            var match = text.match(/^\{([^}=]+)(=)?\}\s+(([^\s=]+)|\[(\S+)=([^\]]+)\])\s+(.*)/);
                             //  1      12 2      34       4   5   5 6      6  3   7  7
            if (!match) { throw new Error("Not a valid 'field' format: " + text); }
            var field = {
                name: match[5] || match[4],
                description:self.markdown(text.replace(match[0], match[7])),
                type: match[1],
                optional: !!match[2],
                'default':match[6]
            };
            if(!self.fields) self.fields = [];
            self.fields.push(field);
        }

    }


};