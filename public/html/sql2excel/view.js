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

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("SQL To Excel",{css:"whitetext"}),
        {view:"button",type:"icon",icon:"fas fa-plus",tooltip:"เพิ่มใหม่",label:"เพิ่ม",width:130,css:"mybutton"},
    ]
}

const theme = "pastellightgreen";
let link = onl_const.api+"get/sqlq/xx?sql=select * from sql2excel where doc_no like 'REP64%'"
console.log(link);

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
            $$("sqlForm").setValues(current);
            $$("sqlForm_window").show();
        },
        "data->onStoreUpdated":function(){
            this.data.each(function(obj, i){
                obj.INDEX = i+1;
            });
        }
    }
}

var sqlForm = {
    view:"form",
    id:"sqlForm",
    rows:[
        {gravity:0.4,rows:[
            {view:"text",name:"LINE_NO",label:"ลำดับ",labelWidth:80,minWidth:280,hidden:true},
            {view:"datepicker",name:"CREATE_DATE",label:"วันที่สร้าง",labelWidth:80,minWidth:280,hidden:true},
            {cols:[
                {view:"text",label:"เรื่อง",labelWidth:80,minWidth:280,name:"REP_NAME"},
                {view:"text",name:"DOC_NO",label:"รหัส",labelWidth:80,width:280,readonly:true},
            ]},
            {view:"textarea",name:"SQL_TEXT",labelWidth:80,label:"SQL",minWidth:280},
        ]},
        {view:"resizer"},
        {gravity:0.6,rows:[
            {view:"toolbar",css:"pastellightgreen",cols:[
                {view:"button",css:"bluebutton",label:"SQL Data Preview",width:200,click:previewReport},
                {},
                {view:"button",css:"bluebutton",label:"Export To Excel",width:200,click:toExcel},
                {view:"button",css:"redbutton",label:"Save Menu",width:200,click:saveMenu},
            ]},
            {cols:[
                {view:"text",name:"COLUMN_HEADING1",placeholder:"กรุณาใส่ Header ex: heading1,heading2,heading3"},
                {view:"button",type:"icon",icon:"fas fa-check",width:100,css:"bluebutton",label:"apply",click:applyHeader},
            ]},
            {
                view:"datatable",
                id:"sql_preview",
                css:"rows",
                autoConfig:true,
            }
        ]},
    ]
}

webix.ui({
    id:"sqlForm_window",
    view:"window",
    position:"center",
    fullscreen:true,
    borderless:true,
    head:{
        view:"toolbar",
        css:"pasteldarkgreen",
        cols:[
            createHeader("Add/Edit SQL",{css:"whitetext"}),
            {view:"button",label:"บันทึก",width:100,css:"mybutton",click:saveSql},
            {view:"icon",icon:"fas fa-times",tooltip:"ปิด",click:function(){
                refreshColumns("sql_preview");
                $$("sqlForm_window").hide();
            }}
        ]
    },
    body:sqlForm,
}).hide();

function refreshColumns(id_name){
    $$(id_name).clearAll();
    $$(id_name).config.columns = [];
    $$(id_name).refreshColumns();
}

function previewReport(){
    loading("sql_preview",false);
    refreshColumns("sql_preview");
    let values = $$("sqlForm").getValues();
    values.SQL_TEXT = "SELECT * FROM ("+values.SQL_TEXT+") WHERE ROWNUM <20";
    webix.ajax().post("/sqlPost",values,function(text){
        let result = JSON.parse(text);
        if((result==null)||(result=="null")){
            result = [
                {
                    "Total Row":"0",
                    "status":"complete",
                }
            ]
        }
        $$("sql_preview").parse(result);
        applyHeader();
        loading("sql_preview",true);
    });
}

function toExcel(){
    let values = $$("sqlForm").getValues();
    let first = $$("sql_preview").getFirstId();
    if (first){
        webix.message("Please wait...")
        webix.toExcel($$("sql_preview"),{
            filename:values.REP_NAME
        });
    }else{
        webix.confirm("ยังไม่ได้ทำการแสดงตัวอย่าง ต้องการดูตัวอย่างหรือไม่").then(function(){
            previewReport();
        });
    }
}

function addNewSql(){
    let data = {
        LINE_NO:"NEW",
        DOC_NO:"NEW",
    }
    $$("sqlForm").setValues(data);
    $$("sqlForm_window").show();
}

function saveSql(){
    let data = $$("sqlForm").getValues();
    if(data.DOC_NO=="NEW"){
        data.CREATE_DATE = new Date()
    }
    console.log(data);
    webix.ajax().post("/update2Excel",data,function(text){
        let result = JSON.parse(text);
        console.log(result);
        if (result.status=="complete"){
            webix.message("บันทึกสำเร็จ");
            $$("sqlForm").setValues({DOC_NO:result.doc_no},true);
            if(data.DOC_NO=="NEW"){
                data.DOC_NO = result.doc_no;
                $$("sqlTable").add(data);
            }else{
                let id = $$("sqlTable").getSelectedId(); 
                $$("sqlTable").updateItem(id, data)
            }
        }else{
            webix.message("เกิดข้อผิดพลาดระหว่างบันทึก");
        }
    });
}

function saveMenu(){
    let sql = $$("sqlForm").getValues().DOC_NO;
    console.log(sql);
    if ((sql!="NEW")&&(sql!="")){
        let host = window.location.hostname
        let link = "http://"+host+":8081/?sql_no="+sql;
        window.open(link,"_blank");
    }else{
        webix.confirm("ท่านยังไม่ได้บันทึก SQL2EXCEL นี้<br>ต้องการบันทึกหรือไม่?").then(function(){
            saveSql();
        }).then(function(){
            webix.message("Saved");
        });
    }
}

function applyHeader(){
    let header = $$("sqlForm").getValues().COLUMN_HEADING1;
    let headerArr = header.split(",");
    console.log(headerArr);
    $$("sql_preview").eachColumn(function(id){
        let i = $$("sql_preview").getColumnIndex(id);
        if(headerArr[i]){
            $$("sql_preview").config.columns[i].header = headerArr[i]
        }
    });
    $$("sql_preview").refreshColumns();
}


