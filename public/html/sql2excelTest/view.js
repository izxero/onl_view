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
    // webix.message("Data not found");
    //xhr - xmlHttpRequest object
    //view - component which triggered error
 
    // ... custom code ...
});

const api_host = onl_const.api_address+":9001/api/"+onl_const.api_key+"/";

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("SQL2Excel",{css:"whitetext"}),
        {view:"icon",icon:"fas fa-redo",click:function(){
            sql2excelTable.reload();
        }},
        {view:"button",label:"Delete",width:80,css:"redbutton",click:function(){sql2excelTable.delete();}},
        {view:"button",css:"mybutton",label:"Add",width:80,click:function(){
            $$("sql2excel_form").setValues({DOC_NO:"NEW"});
            $$("sql2excel_window").show();
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
            {view:"text",labelWidth:80,labelAlign:"right",name:"DOC_NO",label:"DOC_NO",width:240,readonly:true,on:{onChange:function(){
                sql2excel_tr.reload();
            }}},
        ]},
        {view:"textarea",labelWidth:80,labelAlign:"right",name:"SQL_TEXT",label:"SQL"},
    ],
    save:function(){
        let form = $$(this.id);
        let this_data = form.getValues();
        let objData = removeIdAddPkKey(this_data,"DOC_NO");
        if (objData.CREATE_DATE==null){
            objData.CREATE_DATE = new Date();
        }
        objData.UPD_DATE = new Date();
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
                    createHeader("Lists",{css:"whitetext"}),
                    {view:"button",label:"Preview",width:100},
                ]},
            ]},
        ]
    }
}).hide();

function saveApi(post_data,done_fn){
    // let post = {
    //     TABLE:"sql2excel",
    //     CTRLNO:"sql2excel",
    //     PREFIX:"REP6499",
    //     DATA:JSON.stringify(objData),
    // }
    webix.ajax().post(api_host+"cud/upd",post_data,done_fn);
}

function delApi(post_data,done_fn){
    // let post = {
    //     KEYT:"6c15727a7cc40c26e7a8b14613fd753674c5181a639cf3767aa06a5effa1dce073da6751ae",
    //     TABLE:"sql2excel",
    //     DATA:{
    //         DOC_NO:data.DOC_NO,
    //     }
    // }
    webix.confirm("Please confirm to delete").then(function(){
        webix.ajax().post(api_host+"cud/del",post_data,done_fn);
    });
}

function removeIdAddPkKey(original_data,pk_key){
    let actual_data = JSON.parse(JSON.stringify(original_data));
    delete actual_data.id;
    actual_data.PK = pk_key;
    return actual_data;
}
