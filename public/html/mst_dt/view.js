webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[
            navBar,
            master_table,
        ]
    });
});

const api_host = "http://192.168.106.4:9001/api/"+onl_const.api_key+"/";
// const api_host = "http://localhost:9001/api/"+onl_const.api_key+"/";

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("MST",{css:"whitetext"}),
        {view:"icon",icon:"fas fa-plus",tooltip:"new",click:function(){
            let blank_data = {
                REF_ID:"new",
            }
            $$("master_form").setValues(blank_data);
            $$("detail_table").clearAll();
            $$("master_form_window").show();
        }},
        {view:"icon",icon:"fas fa-redo",tooltip:"Refresh",click:function(){master_table.reload()}},
    ]
}

var table_col = [
    {id:"REF_ID",header:"รหัส",width:200},
    {id:"NAME_THAI",header:"ประเภท",minWidth:200,fillspace:true},
    {id:"NAME_ENG",header:"Type",minWidth:200,fillspace:true},
];

var master_table = {
    view:"datatable",
    id:"master_table",
    css:"rows",
    hover:"tableHover",
    url:api_host+"get/sqlq/REP6499-0306?",
    reload:function(){
        let url = api_host + "get/sqlq/REP6499-0306?"
        $$(this.id).clearAll();
        $$(this.id).load(url);
    },
    columns:table_col,
    on:{
        onItemDblClick:function(id){
            let data = this.getItem(id);
            $$("master_form").setValues(data);
            $$("master_form_window").show();
            detail_table.reload();
        }
    }
}

var master_form = {
    view:"form",
    id:"master_form",
    rows:[
        {view:"text",labelWidth:100,labelAlign:"right",name:"REF_ID",label:"REF_ID"},
        {view:"text",labelWidth:100,labelAlign:"right",name:"NAME_THAI",label:"NAME_THAI"},
        {view:"text",labelWidth:100,labelAlign:"right",name:"NAME_ENG",label:"NAME_ENG"},
    ],
    getData:function(){
        return getFormData(this.id);
    },
    save:function(){
        let form_data = getFormData(this.id);
        let post = {
            TABLE:"gl_mst_t",
            CTRLNO:"gl_mst",
            PREFIX:"mt64",
            PK:"REF_ID",
            DATA:JSON.stringify(form_data),
        }
        console.log(post);
        webix.ajax().post(api_host+"cud/upda",post,function(text){
            let res = JSON.parse(text);
            if(res.status=="complete"){
                console.log("save master complete")
                $$("master_form").setValues({REF_ID:res.REF_ID},true);
                detail_table.saveTable();
            }else{
                console.log(text);
                webix.message("error while saving");
            }
        })
    }

}

table_col = [
    {id:"VCHR_NO",header:"VCHR_NO",minWidth:100,fillspace:true},
    {id:"DB",header:"Debit",width:200,editor:"text"},
    {id:"CR",header:"Credit",width:200,editor:"text"},
]

var detail_table = {
    view:"datatable",
    id:"detail_table",
    css:"rows",
    hover:"tableHover",
    editable:true,
    reload:function(ref_id){
        ref_id = ref_id || $$("master_form").getValues().REF_ID;
        let url = api_host + "get/sqlq/REP6499-0307?id=" + ref_id;
        $$(this.id).clearAll();
        $$(this.id).load(url);
    },
    columns:table_col,
    saveTable:function(){
        let table = $$(this.id)
        console.log(table);
        let dataArr = [];
        table.eachRow(function(row){
            let master_id = $$("master_form").getValues().REF_ID;
            let current_row = table.getItem(row);
            let current_actual_row = JSON.parse(JSON.stringify(current_row));
            delete current_actual_row.id;
            current_actual_row.ID = master_id;
            dataArr.push(current_actual_row);
        });
        let post = {
            TABLE:"gl_vchr_t",
            CTRLNO:"gl_vchr",
            PREFIX:"vchr6499",
            PK:"VCHR_NO",
            DATA:JSON.stringify(dataArr),
        }
        console.log(dataArr);
        // console.log(post);
        webix.ajax().post(api_host+"cud/upda",post,function(text){
            let res = JSON.parse(text);
            if(res.status=="complete"){
                detail_table.reload();
                webix.message("Save complete");
            }else{
                console.log(text);
                webix.message("error while saving");
            }
        })
    }
}

webix.ui({
    view:"window",
    id:"master_form_window",
    modal:true,
    position:autoAdjustWindow(),
    head:{
        view:"toolbar",
        css:"pasteldarkblue",
        cols:[
            {view:"icon",icon:"fas fa-arrow-left",click:function(){
                $$("master_form_window").hide();
            }},
            createHeader("MST Form",{css:"whitetext"}),
            {view:"icon",icon:"fas fa-save",click:function(){
                master_form.save();
            }},
        ]
    },
    body:{rows:[
        master_form,
        {view:"toolbar",css:"pasteldarkblue",cols:[
            createHeader("Detail",{css:"whitetext"}),
            {view:"icon",icon:"fas fa-plus",click:function(){
                let blank_data = {
                    VCHR_NO:"new"
                }
                $$("detail_table").add(blank_data,0);
            }},
        ]},
        {cols:[
            detail_table,
            {},
        ]}
    ]}
}).hide();

function getFormData(form_id){
    let current_data = $$(form_id).getValues();
    $$(form_id).clear();
    let blank_data = $$(form_id).getValues();
    for (const [key, value] of Object.entries(blank_data)){
        blank_data[key] = current_data[key]
    }
    $$(form_id).setValues(current_data);
    return blank_data; 
}