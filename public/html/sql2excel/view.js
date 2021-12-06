webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[
            navBar,
            sqlTable,
        ]
    });
});

const sql2excel = {
    
}

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("SQL To Excel",{css:"whitetext"}),
        {view:"button",type:"icon",icon:"fas fa-plus",tooltip:"เพิ่มใหม่",label:"เพิ่ม",width:130,css:"mybutton"},
    ]
}

const theme = "pastellightgreen";

var sqlTable = {
    id:"sqlTable",
    view:"datatable",
    select:"row",
    css:"rows",
    url:onl_const.api+"get/sqlq/REP6410-0016",
    tooltip:true,
    columns:[
        {id:"INDEX",width:50,header:[{text:"No.",rowspan:2,css:theme+" textcenter"}],css:"textcenter"},
        {id:"REP_NAME",width:400,header:[{text:"ชื่อรายงาน",css:theme},{content:"textFilter",css:theme}]},
        {id:"SQL_TEXT",minWidth:250,fillspace:true,header:[{text:"SQL",css:theme},{content:"textFilter",css:theme}]},
    ],
    on:{
        onItemDblClick:function(id){
            let current = this.getItem(id);
        },
        "data->onStoreUpdated":function(){
            this.data.each(function(obj, i){
                obj.INDEX = i+1;
            });
        }
    }
}

function refreshColumns(id_name){
    $$(id_name).clearAll();
    $$(id_name).config.columns = [];
    $$(id_name).refreshColumns();
}


