webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
	webix.ui({
		rows:[
            navBar,
            menuTable,
		]
	});
});

let api_host = "http://192.168.106.4:9001/api/"+onl_const.api_key+"/";
// let api_host = "http://localhost:9001/api/"+onl_const.api_key+"/";
let sql = `SELECT * FROM MENU_REPORT ORDER BY LINE_NO`;
let sqlObj = {
    SQL:sql,
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const Q_SQL_NO = urlParams.get('sql_no');
let Q_PASS = 0;
if(Q_SQL_NO!=null){
    Q_PASS = 1;
}
console.log(Q_SQL_NO);
if((Q_SQL_NO!=null)&&(Q_SQL_NO!="")){
    webix.alert({
        title:"เลือก Menu",
        text:"กรุณาเลือกเมนูที่ต้องการใช้ SQL2EXCEL ที่สร้างแล้วทำการบันทึก<br>"+"SQL_NO = "+Q_SQL_NO,
        type:"alert-warning",
    });
}

var navBar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("Menu Management",{css:"whitetext",width:180}),
        {view:"search",id:"search_all",css:"",width:300,placeholder:"ค้นหาจากชื่อทั้งหมด",on:{onTimedKeyPress:searchAll}},
        {},
        {view:"button",label:"Refresh",width:100,css:"mybutton",click:function(){menuTable.reload()}},
        {view:"button",label:"Open All",width:100,css:"mybutton",click:function(){
            $$("menuTable").openAll();
        }},
        {view:"button",label:"Close All",width:100,css:"mybutton",click:function(){
            $$("menuTable").closeAll();
        }},
        {view:"button",type:"icon",icon:"fas fa-plus",tooltip:"เพิ่มใหม่",label:"เพิ่ม",width:130,css:"mybutton",click:addNewMenu},
    ]
}

const theme = "pastellightgreen";

var menuTable = {
    id:"menuTable",
    view:"treetable",
    select:"row",
    hover:"tableHover",
    css:"rows",
    drag:true,
    // url:"/menu",
    data:loadTable(api_host+"post/sqlq/",sqlObj),
    tooltip:true,
    columns:[
        {id:"MENU_GRP",fillspace:true,header:[{text:"ชื่อเมนู",css:theme},{content:"textFilter",css:theme}],template:function(obj, common){
            return common.treetable(obj,common) + (obj.value || obj.MENU_NAME)
        }},
        {id:"DOC_NO",width:100,header:[{text:"รหัสเอกสาร",css:theme},{content:"textFilter",css:theme}]},
        {id:"MENU_ID",width:140,header:[{text:"รหัสเมนู",css:theme},{content:"textFilter",css:theme}]},
        // {id:"REP_TITLE",fillspace:true,minWidth:150,header:[{text:"REP_TITLE",css:theme},{content:"textFilter",css:theme}]},
        {id:"LINE_NO",width:100,header:[{text:"ลำดับ",css:theme},{content:"textFilter",css:theme}]},
        {id:"STATUS",width:80,css:"textcenter",header:[{text:"สถานะ",css:theme},{content:"richSelectFilter",css:theme}],
            template:function(obj){
                if(obj.$level==3){
                    switch(obj.STATUS){
                        case "A":return "<div class='pasteldarkgreen boldtext whitetext'>" +obj.STATUS+"</div>";
                        case "W":return "<div class='pastelorange boldtext'>" +obj.STATUS+"</div>";
                        case "X":return "<div class='greybackground boldtext whitetext'>" +obj.STATUS+"</div>";
                        default: return obj.STATUS;
                    }
                }
                return ""
            },
        },
        // {id:"SQL_NO",width:120,header:[{text:"รหัส SQL",css:theme},{content:"textFilter",css:theme}]},
        {id:"sql",width:120,css:"textcenter",header:[{text:"",css:theme}],
            template:function(obj){
                if(obj.$level==3){
                    if((obj.SQL_NO!="")||(obj.SQL!=""))
                    return "<i class='fas fa-info-circle'></i>"
                }
                return "-"
            },
            tooltip:function(obj){
                if(obj.$level==3){
                    if((obj.SQL_NO!="")||(obj.SQL!="")){
                        return "SQL_NO : "+obj.SQL_NO+"<br>SQL : "+obj.SQL;
                    }
                    return "";
                }
            }
        },
        // {id:"index",template:function(obj, common, marks, column, index){
        //     if(obj.$level==3){
        //         return index;
        //     }
        //     return "";
        // }},
        // {id:"branchindex",template:function(obj, common, marks, column, index){
        //     // if(obj.$level==3){
        //     //     return common.space(obj, common) + $$("$menuTable").getBranchIndex(obj.id)
        //     // }
        //     return "";
        // }},
        {id:"addToTemp",width:80,
            tooltip:function(obj){
                if(obj.$level==1)
                    return "เพิ่มใน "+obj.MENU_GRP;
                else if(obj.$level==2)
                    return "เพิ่มใน "+obj.value;
                return "";
            },
            header:[{text:"",css:theme},{text:"",css:theme}],template:function(obj){
                if(obj.$level==1)
                    return  "<div class='myhover iconcenter'><button class='addLevel1Click tablebutton'><i class='fas fa-plus-circle'></i></button></div>"
                else if(obj.$level==2)
                    return  "<div class='myhover iconcenter'><button class='addLevel2Click tablebutton'><i class='fas fa-plus'></i></button></div>"
                return "<div class='myhover iconcenter'><button class='addLevel3Click tablebutton'><i class='fas fa-edit'></i></button></div>";
            }
        },
        {id:"viewRe",width:80,
            header:[{text:"View",css:theme},{text:"",css:theme}],template:function(obj){
                if(obj.$level==1)
                    return  ""
                else if(obj.$level==2)
                    return  ""
                return "<div class='myhover iconcenter'><button class='viewReClick tablebutton'><i class='fas fa-eye'></i></button></div>";
            }
        },
        {id:"viewRe",
            header:[{text:"Design",css:theme},{text:"",css:theme}],template:function(obj){
                if(obj.$level==1)
                    return  ""
                else if(obj.$level==2)
                    return  ""
                return "<div class='myhover iconcenter'><button class='viewDeClick tablebutton'><i class='fas fa-pencil-ruler'></i></button></div>";
            }
        },
    ],
    on:{
        onItemClick:function(id){
            if(id.column!="addToTemp"){
                let current = this.getItem(id);
                console.log(current);
                if(current!=3){
                    if(this.isBranchOpen(id)){
                        this.close(id);
                    }else{
                        this.open(id);
                    }
                }
            }
        },
        onItemDblClick:function(id){
            let current = this.getItem(id);
            let data = Object.assign({},current);
            if(current.$level==3){
                if(Q_PASS){
                    data.SQL_NO = Q_SQL_NO; 
                }
                $$("menuForm").setValues(data);
                $$("menuForm_window").show();
            }
        },
        onAfterLoad:function(){
            gby();
        },
        onBeforeDragIn:function(config, id){
            if (!id) return false;                      // block dnd on top level
            // if (!this.getItem(id).$count) return false; // block dnd in leaf items
        }    
    },
    onClick:{
        "addLevel1Click":function(event, cell, target){
            let current = this.getItem(cell.row);
            let data = {
                DOC_NO:"NEW",
                MENU_GRP:current.MENU_GRP,
            } 
            if(Q_PASS){
                data.SQL_NO = Q_SQL_NO;
            }
            $$("menuForm").setValues(data);
            $$("menuForm_window").show();
        },
        "addLevel2Click":function(event, cell, target){
            let current = this.getItem(cell.row);
            let data = {
                DOC_NO:"NEW",
                MENU_GRP:current.MENU_GRP,
                MENU_SUB_GRP:current.value,
            }
            if(Q_PASS){
                data.SQL_NO = Q_SQL_NO;
            }
            $$("menuForm").setValues(data);
            $$("menuForm_window").show();
        },
        "addLevel3Click":function(event, cell, target){
            let current = this.getItem(cell.row);
            let data = Object.assign({},current);
            if(Q_PASS){
                data.SQL_NO = Q_SQL_NO;
            } 
            $$("menuForm").setValues(data);
            $$("menuForm_window").show();
        },
        "viewReClick":function(event, cell, target){
            let current = this.getItem(cell.row);
            let link = "http://192.168.106.4:24680/view?RE="+current.MRT_NAME;
            window.open(link,"_blank");
        },
        "viewDeClick":function(event, cell, target){
            let current = this.getItem(cell.row);
            let link = "http://192.168.106.4:24680/design?RE="+current.MRT_NAME+"&sql_no="+current.SQL_NO;
            window.open(link,"_blank");
        },
    },
    scheme:{
        $change: function(obj){
            if(obj.DOC_NO){
                obj.$css = "";
            }else{
                obj.$css = "branchrow";
            }
        }
    },
    reload:function(){
        $$(this.id).clearAll();
        $$(this.id).parse(loadTable(api_host+"post/sqlq/",sqlObj));
    }
}

function gby(){
    $$("menuTable").group({
        by:function(obj){ return obj.MENU_SUB_GRP + "-" + obj.MENU_GRP },
        map:{
            value:["MENU_SUB_GRP"],
            MENU_GRP:["MENU_GRP"],
        }
    });
    $$("menuTable").group({
        by:"MENU_GRP",
        map:{
            value:["MENU_GRP"],
            MENU_SUB_GRP:["MENU_SUB_GRP"],
        }
    }, 0);
}

var menuForm = {
    view:"form",
    id:"menuForm",
    rows:[
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"DOC_NO",label:"รหัสเอกสาร",hidden:true},
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"MENU_ID",label:"รหัสเมนู",hidden:true},
        {cols:[
            {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"LINE_NO",label:"ลำดับ",placeholder:"ลำดับ"},
            {view:"richselect",width:150,labelAlign:"right",labelWidth:80,label:"สถานะ",options:["A","W","X"],name:"STATUS"},
        ]},
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"MENU_GRP",label:"กลุ่ม",placeholder:"คลิกเพื่อเลือกกลุ่ม",readonly:true,on:{onItemClick:function(){showMENU("MENU_GRP")}}},
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"MENU_SUB_GRP",label:"กลุ่มย่อย",placeholder:"คลิกเพื่อเลือกกลุ่มย่อย",readonly:true,on:{onItemClick:function(){showMENU("MENU_SUB_GRP")}}},
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"MENU_NAME",label:"ชื่อเมนู",placeholder:"ป้อนชื่อเมนู"},
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"MRT_NAME",label:"ไฟล์ MRT",placeholder:"เลือกไฟล์ MRT"},
        {view:"text",labelWidth:100,labelAlign:"right",minWidth:300,name:"SQL_NO",label:"รหัส SQL",placeholder:"ป้อนรหัส SQL (ถ้ามี)"},
        {view:"textarea",labelWidth:100,height:80,labelAlign:"right",minWidth:300,name:"SQL",label:"SQL",placeholder:"ป้อน SQL (ถ้ามี)"},
        {cols:[
            {},
            {view:"button",css:"redbutton",label:"ยกเลิก",width:100,click:function(){
                $$("menuForm").clear();
                $$("menuForm_window").hide();
            }},
            {view:"button",css:"greenbutton",hotkey:"enter",label:"บันทึก",width:100,click:function(){menuForm.save()}},
        ]}
    ],
    save:function(){
        let form_data = $$(this.id).getValues();
        let post_data = JSON.parse(JSON.stringify(form_data));
        delete post_data.id;
        delete post_data.$css;
        delete post_data.$count;
        delete post_data.$level;
        delete post_data.$parent;
        if (post_data.STATUS==""){
            post_data.STATUS = "W";
        }
        post_data.pk = "DOC_NO";
        let post = {
            TABLE:"MENU_REPORT",
            CTRLNO:"MENU_REPORT",
            PREFIX:"menu",
            DATA:JSON.stringify(post_data),
        }
        console.log(post);
        saveApi(post,function(text){
            let res = JSON.parse(text);
            console.log(res);
            if (res.status=="complete"){
                $$("menuForm").setValues({DOC_NO:res.DOC_NO},true);
                menuTable.reload();
                webix.message("Saved");
                $$("menuForm_window").hide();
            }else{
                webix.message("error while saving");
            }
        });
    }
}

webix.ui({
    view:"window",
    id:"menuForm_window",
    position:"center",
    modal:true,
    move:true,
    width:500,
    // height:500,
    head:{
        view:"toolbar",
        css:"pasteldarkgreen",
        cols:[
            createHeader("Add/Edit Menu",{css:"whitetext"}),
            {view:"icon",icon:"fas fa-times",click:function(){
                $$("menuForm_window").hide();
            }}
        ]
    },
    body:{
        rows:[
            menuForm,
        ]
    },
}).hide();

webix.ui({
    view:"window",
    id:"menuGRP_popup",
    position:"center",
    move:true,
    modal:true,
    width:400,
    height:600,
    head:{
        view:"toolbar",
        css:"pasteldarkgreen",
        cols:[
            createHeader("กรุณาเลือก",{css:"whitetext",id:"popup_header"}),
            {view:"icon",icon:"fas fa-times",click:function(){
                $$("menuGRP_popup").hide();
            }}
        ]
    },
    body:{
        rows:[
            {view:"text",id:"menuGRP_text"},
            {cols:[
                {view:"text",id:"new_grp",placeholder:"เพิ่มใหม่"},
                {view:'button',label:"เพิ่ม",width:80,css:"greenbutton",click:function(){
                    let set_to = $$("menuGRP_text").getValue();
                    let data = {};
                    data[set_to] = $$("new_grp").getValue();
                    console.log(data);
                    $$("menuForm").setValues(data,true);
                    $$("menuGRP_popup").hide();
                }},
            ]},
            {
                view:"list",
                width:300,
                // autoheight:true,
                select:true,
                css:"rows",
                hover:"tableHover",
                id:"menuGRP_list",
                template:"#ID#",
                on:{
                    onItemClick:function(id){
                        let set_to = $$("menuGRP_text").getValue();
                        let data = {};
                        data[set_to] = this.getItem(id).ID;
                        console.log(data);
                        $$("menuForm").setValues(data,true);
                        $$("menuGRP_popup").hide();
                    }
                }
            },
        ],
    }
}).hide();

function addNewMenu(){
    $$("menuForm").setValues({
        DOC_NO:"NEW",
        SQL_NO:Q_SQL_NO,
    });
    $$("menuForm_window").show();
}

function showMENU(menu_grp){
    switch(menu_grp){
        case "MENU_GRP":
            console.log("Show "+menu_grp);
            $$("popup_header").define("template","กรุณาเลือก : กลุ่ม");
            $$("popup_header").refresh();
            genMENU_GRP_TABLE(menu_grp);
            break;
        case "MENU_SUB_GRP":
            console.log("Show "+menu_grp);
            $$("popup_header").define("template","กรุณาเลือก : กลุ่มย่อย");
            $$("popup_header").refresh();
            genMENU_GRP_TABLE(menu_grp);
            break;
        default:
            console.log("Menu not found");
    }
}

function genMENU_GRP_TABLE(menu_grp){
    let sqlMenu = "SELECT DISTINCT "+menu_grp+" AS id, MIN(NVL(LINE_NO,999)) LINE_NO FROM MENU_REPORT GROUP BY "+menu_grp+" ORDER BY LINE_NO ASC, "+menu_grp+" ASC";
    let sqlObjMenu = {
        SQL:sqlMenu,
    }
    console.log(sqlMenu);
    $$("menuGRP_list").clearAll();
    $$("menuGRP_list").parse(loadTable(api_host+"post/sqlq/",sqlObjMenu));
    $$("menuGRP_text").setValue(menu_grp);
    $$("menuGRP_popup").show();
}

function searchAll(){
    let search_text = $$("search_all").getValue().toString().toLowerCase();
    $$("menuTable").filter("#MENU_NAME#",search_text);
    console.log(search_text);
}