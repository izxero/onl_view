webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[
            navBar,
            sql2excelTable,
        ]
    });
});

// var keys_vals = {
//     REP_ID:"รหัสรายงาน",
//     LINE_NO:"บรรทัด",
//     CREATE_BY:"ผู้สร้าง",
//     CREATE_DATE:"วันที่สร้าง",
//     SQL_TEXT:"SQL Text",
//     COLUMN_HEADING1:"หัวคอลัมน์",
//     REP_NAME:"ชื่อรายงาน",
//     DOC_NO:"รหัสเอกสาร",
// }
// var sql2excel = genIdHeader(keys_vals);

// function genIdHeader(obj){
//     let res = {}
//     for (const [key,value] of Object.entries(obj)){
//         let eachres = {}
//         eachres["id"] = key
//         eachres["header"] = value;
//         res[key] = eachres
//     }
//     return res;
// }


// var navBar = {
//     view:"toolbar",
//     css:"pasteldarkgreen",
//     cols:[
//         createHeader("SQL To Excel",{css:"whitetext"}),
//         {view:"button",type:"icon",icon:"fas fa-plus",tooltip:"เพิ่มใหม่",label:"เพิ่ม",width:130,css:"mybutton",click:testclick},
//     ]
// }

// const theme = "pastellightgreen";
// function getHeader(id){
//     console.log(id);
//     return "h";
//     // return sql2excel[id].header
// }
// var sqlTable = {
//     id:"sqlTable",
//     view:"datatable",
//     select:"row",
//     css:"rows",
//     url:onl_const.api+"get/sqlq/REP6410-0016",
//     tooltip:true,
//     columns:createColumns(sql2excel,{
//         INDEX:{width:50,header:"ลำดับ"},
//         // LINE_NO:{width:100},
//         REP_NAME:{width:400,},
//         SQL_TEXT:{width:400,fillspace:true},
//     }),
//     // columns:[
//     //     {id:"INDEX",width:50,header:[{text:"No.",rowspan:2,css:theme+" textcenter"}],css:"textcenter"},
//     //     // {id:"REP_NAME",width:400,header:[{text:"ชื่อรายงาน",css:theme},{content:"textFilter",css:theme}]},
//     //     // {id:"SQL_TEXT",minWidth:250,fillspace:true,header:[{text:"SQL",css:theme},{content:"textFilter",css:theme}]},
//     //     {width:400,id:sql2excel.REP_NAME.id,header:[{text:sql2excel.REP_NAME.header,css:theme},{content:"textFilter",css:theme}]},
//     //     {width:250,id:sql2excel.SQL_TEXT.id,header:[{text:sql2excel.SQL_TEXT.header,css:theme},{content:"textFilter",css:theme}],fillspace:true},
//     // ],
//     on:{
//         onItemDblClick:function(id){
//             let current = this.getItem(id);
//             console.log(current);
//         },
//         "data->onStoreUpdated":function(){
//             this.data.each(function(obj, i){
//                 obj.INDEX = i+1;
//             });
//         }
//     }
// }

// function createColumns(fields,obj){
//     let columns = [];
//     for (const [key,prop] of Object.entries(obj)){
//         let property = prop;
//         //set property id
//         if ((property.id == null)&&(property.id == "")){
//             property.id = key;
//         }
//         //set property header
//         if (fields[key] != null) {
//             if (property.header != null){
//                 x = 1; 
//             }else{
//                 property.header = fields[key].header;
//             }
//         }
//         columns.push(property);
//     }
//     console.log(columns);
//     return columns;
// }

// function refreshColumns(id_name){
//     $$(id_name).clearAll();
//     $$(id_name).config.columns = [];
//     $$(id_name).refreshColumns();
// }

// function testclick(){
//     console.log(sql2excel);
//     // console.log(text);
//     // console.log(sql2excel_ID);
// }

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("SQL2Excel",{css:"whitetext"}),
        {view:"button",label:"Delete",width:80,css:"redbutton",click:delSql2Excel},
        {view:"button",css:"mybutton",label:"Add",width:80,click:function(){
            $$("sql2excel_form").setValues({DOC_NO:"NEW"});
            $$("sql2excel_window").show();
        }},
    ]
}

var sql2excelTable = {
    view:"datatable",
    id:"sql2excel_table",
    url:"http://localhost:9001/api/112/get/sqlq/REP6410-0016",
    css:"rows",
    select:"row",
    columns:[
        {id:"DOC_NO",width:120,header:[{text:"DOC_NO"},{content:"textFilter"}]},
        {id:"REP_NAME",width:300,header:[{text:"REP_NAME"},{content:"textFilter"}]},
        {id:"SQL_TEXT",minWidth:300,fillspace:true,header:[{text:"SQL_TEXT"},{content:"textFilter"}]},
        // {id:"CREATE_DATE",width:150,header:"Date"},
    ],
    on:{
        onItemDblClick:function(id){
            let current_data = this.getItem(id);
            console.log(current_data);
            $$("sql2excel_form").setValues(current_data);
            $$("sql2excel_window").show();
        }
    }
}

webix.ui({
    view:"window",
    id:"sql2excel_window",
    fullscreen:true,
    position:"center",
    modal:true,
    borderless:true,
    head:{
        view:"toolbar",
        css:"pasteldarkgreen",
        cols:[
            createHeader("Add/Edit",{css:"whitetext"}),
            {view:"button",css:"mybutton",label:"Save",width:80,click:saveSql2Excel},
            {view:"button",css:"mybutton",label:"Save with TR",width:120,click:saveMstTr},
            {view:"button",css:"mybutton",label:"Close",width:80,click:function(){
                $$("sql2excel_window").hide();
            }},
        ]
    },
    body:{
        rows:[
            {
                view:"form",
                id:"sql2excel_form",
                borderless:true,
                rows:[
                    {rows:[
                        {view:"datepicker",name:"CREATE_DATE",format:"%d/%m/%Y",hidden:true},
                        {view:"datepicker",name:"UPD_DATE",format:"%d/%m/%Y",hidden:true},
                    ]},
                    {cols:[
                        {view:"text",labelWidth:80,labelAlign:"right",name:"REP_NAME",label:"ชื่อ SQL"},
                        {view:"text",labelWidth:80,labelAlign:"right",name:"DOC_NO",label:"DOC_NO",width:240,readonly:true},
                    ]},
                    {view:"textarea",labelWidth:80,labelAlign:"right",name:"SQL_TEXT",label:"SQL"},
                ]
            },
            {view:"resizer"},
            {rows:[
                {view:"toolbar",css:"pasteldarkgreen",cols:[
                    createHeader("Lists",{css:"whitetext"}),
                    {view:"icon",icon:"fas fa-plus",click:function(){
                        let mst = $$("sql2excel_form").getValues();
                        $$("tr_table").add({DOC_NO:mst.DOC_NO,DOC_ID:"NEW"});
                    }},
                ]},
                {
                    view:"datatable",
                    id:"tr_table",
                    css:"rows",
                    editable:true,
                    columns:[
                        {id:"DOC_NO",width:100},
                        {id:"DOC_ID",width:100},
                        {id:"NAME",fillspace:true,editor:"text"},
                    ]
                }
            ]},
        ]
    }
}).hide();

function saveSql2Excel(){
    let objData = formDataToJSON("sql2excel_form","DOC_NO");
    if (objData.CREATE_DATE==null){
        objData.CREATE_DATE = new Date();
    }
    objData.UPD_DATE = new Date();
    console.log(objData.UPD_DATE);
    let post = {
        TABLE:"sql2excel",
        CTRLNO:"sql2excel",
        PREFIX:"REP6499",
        DATA:JSON.stringify(objData),
    }
    webix.ajax().post("http://localhost:9001/api/112/cud/upd",post,function(text){
        let res = JSON.parse(text);
        console.log(res);
        if (res.status=="complete"){
            // if (objData.DOC_NO == "NEW"){
            //     objData.DOC_NO = res.DOC_NO;
            //     $$("sql2excel_table").add(objData);
            // }
            $$("sql2excel_form").setValues({DOC_NO:res.DOC_NO},true);
            $$("sql2excel_table").clearAll();
            $$("sql2excel_table").load("http://localhost:9001/api/112/get/sqlq/REP6410-0016");
            webix.message("Saved");
        }else{
            webix.message("error while saving");
        }
    });
}

function delSql2Excel(){
    let data = $$("sql2excel_table").getSelectedItem();
    let post = {
        KEYT:"6c15727a7cc40c26e7a8b14613fd753674c5181a639cf3767aa06a5effa1dce073da6751ae",
        TABLE:"sql2excel",
        // KEYT:"0b98f239df4e7621fff3a2b10e895cf034cf51653b695f1941fce0df8d00a4b4724898f3e7a2",
        DATA:{
            DOC_NO:data.DOC_NO,
        }
    }
    webix.confirm("Delete "+data.DOC_NO+" ?").then(function(){
        webix.ajax().post("http://localhost:9001/api/112/cud/del",post,function(text){
            console.log(text);
            let res = JSON.parse(text);
            if (res.status=="complete"){
                $$("sql2excel_table").remove(data.id);
                webix.message("Delete Complete")
            }else{
                webix.message("Error while delete");
            }
        });
    });
}

function formDataToJSON(form_id,pk_key){
    let original_data = $$(form_id).getValues();
    let actual_data = JSON.parse(JSON.stringify(original_data));
    delete actual_data.id;
    actual_data.PK = pk_key;
    return actual_data;
}

function saveMstTr(){
    let tr_data = []
    $$("tr_table").eachRow(function(row){
        let current = $$("tr_table").getItem(row);
        let actual_current = JSON.parse(JSON.stringify(current));
        delete actual_current.id
        tr_data.push(actual_current);
    });
    console.log(tr_data);
}