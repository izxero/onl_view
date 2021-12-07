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

var keys_vals = {
    REP_ID:"รหัสรายงาน",
    LINE_NO:"บรรทัด",
    CREATE_BY:"ผู้สร้าง",
    CREATE_DATE:"วันที่สร้าง",
    SQL_TEXT:"SQL Text",
    COLUMN_HEADING1:"หัวคอลัมน์",
    REP_NAME:"ชื่อรายงาน",
    DOC_NO:"รหัสเอกสาร",
}
var sql2excel = genIdHeader(keys_vals);

function genIdHeader(obj){
    let res = {}
    for (const [key,value] of Object.entries(obj)){
        let eachres = {}
        eachres["id"] = key
        eachres["header"] = value;
        res[key] = eachres
    }
    return res;
}


var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("SQL To Excel",{css:"whitetext"}),
        {view:"button",type:"icon",icon:"fas fa-plus",tooltip:"เพิ่มใหม่",label:"เพิ่ม",width:130,css:"mybutton",click:testclick},
    ]
}

const theme = "pastellightgreen";
function getHeader(id){
    console.log(id);
    return "h";
    // return sql2excel[id].header
}
var sqlTable = {
    id:"sqlTable",
    view:"datatable",
    select:"row",
    css:"rows",
    url:onl_const.api+"get/sqlq/REP6410-0016",
    tooltip:true,
    columns:createColumns(sql2excel,{
        INDEX:{width:50,header:"ลำดับ"},
        // LINE_NO:{width:100},
        REP_NAME:{width:400,},
        SQL_TEXT:{width:400,fillspace:true},
    }),
    // columns:[
    //     {id:"INDEX",width:50,header:[{text:"No.",rowspan:2,css:theme+" textcenter"}],css:"textcenter"},
    //     // {id:"REP_NAME",width:400,header:[{text:"ชื่อรายงาน",css:theme},{content:"textFilter",css:theme}]},
    //     // {id:"SQL_TEXT",minWidth:250,fillspace:true,header:[{text:"SQL",css:theme},{content:"textFilter",css:theme}]},
    //     {width:400,id:sql2excel.REP_NAME.id,header:[{text:sql2excel.REP_NAME.header,css:theme},{content:"textFilter",css:theme}]},
    //     {width:250,id:sql2excel.SQL_TEXT.id,header:[{text:sql2excel.SQL_TEXT.header,css:theme},{content:"textFilter",css:theme}],fillspace:true},
    // ],
    on:{
        onItemDblClick:function(id){
            let current = this.getItem(id);
            console.log(current);
        },
        "data->onStoreUpdated":function(){
            this.data.each(function(obj, i){
                obj.INDEX = i+1;
            });
        }
    }
}

function createColumns(fields,obj){
    let columns = [];
    for (const [key,prop] of Object.entries(obj)){
        let property = prop;
        //set property id
        if ((property.id == null)&&(property.id == "")){
            property.id = key;
        }
        //set property header
        if (fields[key] != null) {
            if (property.header != null){
                x = 1; 
            }else{
                property.header = fields[key].header;
            }
        }
        columns.push(property);
    }
    console.log(columns);
    return columns;
}

function refreshColumns(id_name){
    $$(id_name).clearAll();
    $$(id_name).config.columns = [];
    $$(id_name).refreshColumns();
}

function testclick(){
    console.log(sql2excel);
    // console.log(text);
    // console.log(sql2excel_ID);
}

