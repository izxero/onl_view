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

webix.attachEvent("onLoadError", function(xhr, view){
});

let api_host = "http://192.168.106.4:9001/api/"+onl_const.api_key+"/";
// let api_host = "http://localhost:9001/api/"+onl_const.api_key+"/";

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        {view:"button",css:"mybutton",label:"Add",width:80,click:function(){
            $$("sql2excel_form").setValues({DOC_NO:"NEW"});
            $$("sql2excel_window").show();
        }},
        createHeader("SQL2Excel",{css:"whitetext textcenter"}),
        {view:"button",label:"Delete",width:80,css:"redbutton",click:function(){sql2excelTable.delete();}},
        {view:"icon",icon:"fas fa-redo",click:function(){
            sql2excelTable.reload();
        }},
    ]
}

let sql = `select * from sql2excel 
-- comment here
where doc_no like :doc_no order by doc_no`;
let sqlObj = {
    SQL:sql,
    DATA:{
        doc_no:"REP64%"
    }
}

var sql2excelTable = {
    delete:function(){
        let table = $$(this.id);
        let data = table.getSelectedItem();
        if(data){
            let post = {
                KEYT:"6c15727a7cc40c26e7a8b14613fd753674c5181a639cf3767aa06a5effa1dce073da6751ae",
                TABLE:"sql2excel",
                DATA:{
                    DOC_NO:data.DOC_NO,
                }
            }
            delApi(post,function(text){
                console.log(text);
                let res = JSON.parse(text);
                if (res.status=="complete"){
                    table.remove(data.id);
                    webix.message("Delete Complete")
                }else{
                    webix.message("Error while delete");
                }
            });
        }else{
            webix.message("Please select item to delete")
        }
    },
    reload:function(){
        $$(this.id).clearAll();
        $$(this.id).parse(loadTable(api_host+"post/sqlq/",sqlObj));
    },
    view:"datatable",
    id:"sql2excel_table",
    data: loadTable(api_host+"post/sqlq/",sqlObj),
    css:"rows",
    select:"row",
    columns:[
        {id:"DOC_NO",width:120,header:[{text:"DOC_NO"},{content:"textFilter"}]},
        {id:"REP_NAME",width:300,header:[{text:"REP_NAME"},{content:"textFilter"}]},
        {id:"SQL_TEXT",minWidth:300,fillspace:true,header:[{text:"SQL_TEXT"},{content:"textFilter"}]},
    ],
    on:{
        onItemDblClick:function(id){
            let current_data = this.getItem(id);
            $$("sql2excel_form").setValues(current_data);
            $$("sql2excel_window").show();
            getReplaceValue();
        }
    }
}

var sql2excel_form = {
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
        {view:"textarea",labelWidth:80,labelAlign:"right",name:"SQL_TEXT",label:"SQL",on:{
            onChange:function(){
                getReplaceValue();
            }
        }},
    ],
    save:function(){
        let form = $$(this.id);
        let this_data = form.getValues();
        let objData = removeIdAddPkKey(this_data,"DOC_NO");
        if (objData.CREATE_DATE==null){
            objData.CREATE_DATE = new Date();
        }
        objData.UPD_DATE = new Date();
        objData.COLUMN_HEADING1 = JSON.stringify(headingData());
        console.log(objData);
        let post = {
            TABLE:"sql2excel",
            CTRLNO:"sql2excel",
            PREFIX:"REP6499",
            DATA:JSON.stringify(objData),
        }
        saveApi(post,function(text){
            let res = JSON.parse(text);
            console.log(res);
            if (res.status=="complete"){
                form.setValues({DOC_NO:res.DOC_NO},true);
                sql2excelTable.reload();
                webix.message("Saved");
            }else{
                webix.message("error while saving");
            }
        });
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
            {view:"button",css:"mybutton",label:"Save",width:100,click:function(){sql2excel_form.save();}},
            {view:"button",css:"mybutton",label:"Close",width:80,click:function(){
                $$("replaceValueTable").clearAll();
                $$("headingTable").clearAll();
                refreshColumns("previewTable");
                $$("sql2excel_window").hide();
            }},
        ]
    },
    body:{
        rows:[
            sql2excel_form,
            {view:"resizer"},
            {rows:[
                {view:"toolbar",css:"pasteldarkgreen",cols:[
                    {view:"button",label:"Preview",width:100,css:"bluebutton",click:previewURL},
                    {view:"button",label:"Map Header",width:130,css:"bluebutton",click:mapHeader},
                    // createHeader("Preview",{width:80,css:"whitetext"}),
                    {view:"text",css:"roundtextbox",placeholder:"URL",id:"previewURL"},
                    {view:"button",label:"Save To Menu",width:130,css:"bluebutton",click:function(){
                        let form_data = $$("sql2excel_form").getValues();
                        if(form_data.DOC_NO!="NEW"){
                            // let link = "http://localhost:9000/menuManage?sql_no="+form_data.DOC_NO;
                            let link = "http://192.168.106.4:9000/menuManage?sql_no="+form_data.DOC_NO;
                            window.open(link,"_blank");
                        }else{
                            webix.alert("DOC_NO not found<br>please save this SQL2EXCEL");
                        }
                    }},
                ]},
                {
                    view:"accordion",
                    css:"webix_dark",
                    multi:true,
                    cols:[
                        {
                            id:"replaceValueAcc",
                            width:250,
                            collapsed:true,
                            header:"Replace Value",
                            body:{
                                view:"datatable",
                                id:"replaceValueTable",
                                css:"rows",
                                editable:true,
                                columns:[
                                    {id:"variable",header:"Variable",fillspace:true},
                                    {id:"value",header:"Value",fillspace:true,editor:"text"},
                                ],
                                on:{
                                    onDataUpdate:genURL,
                                }
                            }
                        },
                        {view:"resizer"},
                        {
                            header:"Heading",
                            width:250,
                            body:{
                                view:"datatable",
                                id:"headingTable",
                                css:"rows",
                                editable:true,
                                columns:[
                                    {id:"column",header:"Column",fillspace:true},
                                    {id:"name",header:"Name",fillspace:true,editor:"text"},
                                ],
                                on:{
                                    // onDataUpdate:mapHeader,
                                }
                            }
                        },
                        {view:"resizer"},
                        {
                            header:"Preview Table",
                            body:{
                                view:"datatable",
                                id:"previewTable",
                                css:"rows",
                                autoConfig:true,
                            }
                        },
                    ]
                }
            ]},
        ]
    }
}).hide();

function headingData(){
    $$("headingTable").editStop();
    let data = {};
    let table = $$("headingTable");
    table.eachRow(function(row){
        let current = table.getItem(row);
        data[current.column] = current.name;
    });
    console.log(data);
    return data;
}

function removeIdAddPkKey(original_data,pk_key){
    let actual_data = JSON.parse(JSON.stringify(original_data));
    delete actual_data.id;
    actual_data.PK = pk_key;
    return actual_data;
}

function previewURL(){
    genURL();
    let form_data = $$("sql2excel_form").getValues();
    sql = form_data.SQL_TEXT;
    let replacedata = {};
    $$("replaceValueTable").editStop();
    $$("replaceValueTable").eachRow(function(row){
        let current = $$("replaceValueTable").getItem(row);
        sql = sql.replace("'{"+current.variable+"}'",":"+current.variable);
        replacedata[current.variable] = current.value;
    });
    console.log(sql);
    let sqlObj = {
        SQL:sql,
        DATA:replacedata,
    }
    console.log(sqlObj);
    refreshColumns("previewTable")
    $$("previewTable").parse(loadTable(api_host+"post/sqlq/",sqlObj));
    getHeader(sqlObj);
    
}

function getHeader(sqlObj){
    $$("headingTable").editStop();
    webix.ajax().post(api_host+"post/sqlh/",sqlObj,function(text){
        let res = JSON.parse(text);
        let headerArr = [];
        res.forEach(function(item){
            headerArr.push({column:item,name:""});
        });
        $$("headingTable").clearAll();
        $$("headingTable").parse(headerArr);

        let form_data = $$("sql2excel_form").getValues();
        console.log(form_data.COLUMN_HEADING1);
        if (form_data.COLUMN_HEADING1){
            let mapHeading = JSON.parse(form_data.COLUMN_HEADING1);
            $$("headingTable").eachRow(function(row){
                let current = $$("headingTable").getItem(row);
                if(mapHeading[current.column]){
                    let updateValue = {name:mapHeading[current.column]};
                    $$("headingTable").updateItem(row,updateValue);
                }
            });
        }
        mapHeader();

    });
}

function mapHeader(){
    $$("headingTable").editStop();
    let header = [];
    let last_id = $$("headingTable").getLastId();
    $$("headingTable").eachRow(function(row){
        let current = $$("headingTable").getItem(row);
        let dummy = JSON.parse(JSON.stringify(current));
        if (dummy.name==""){
            dummy.name = dummy.column;
        }
        let rowData = {
            id:dummy.column,
            header:dummy.name,
            width:100,
        }
        if(dummy.id==last_id){
            delete rowData.width;
            rowData.minWidth = 100;
            rowData.fillspace = true;
        }
        header.push(rowData);
    });
    console.log(header);
    $$("previewTable").refreshColumns(header);
}

function refreshColumns(id_name){
    $$(id_name).clearAll();
    $$(id_name).config.columns = [];
    $$(id_name).refreshColumns();
}

function genURL(){
    let table = $$("replaceValueTable");
    let paramsArr = [];
    table.eachRow(function(row){
        let current = table.getItem(row);
        paramsArr.push(current.variable+"="+current.value);
    });
    paramsText = paramsArr.join("&");
    let doc_no = $$("sql2excel_form").getValues().DOC_NO;
    $$("previewURL").setValue(api_host+"get/sqlq/"+doc_no+"?"+paramsText);
    console.log(paramsText);
}

function getReplaceValue(){
    let replaceValArr = [];
    let sql_form_data = $$("sql2excel_form").getValues();
    let sql_text = sql_form_data.SQL_TEXT;
    let sqlLeftArr = sql_text.split("{");
    sqlLeftArr.forEach(function(item){
        if (item.includes("}")){
            let sqlrightArr = item.split("}");
            replaceValArr.push(sqlrightArr[0]);
        }
    });
    let uniq = [...new Set(replaceValArr)];
    let replaceArr = [];
    uniq.forEach(function(item){
        replaceArr.push({variable:item,value:""});
    });
    if (replaceArr.length == 0){
        $$("replaceValueAcc").collapse();
    }else{
        $$("replaceValueAcc").expand();
    }
    $$("replaceValueTable").clearAll();
    $$("replaceValueTable").parse(replaceArr);
    genURL();
}