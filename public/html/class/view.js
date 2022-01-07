webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[
            navbar,
            fileViewer,
        ]
    });
    if((Q_DOC_SERL!="")&&(Q_FORM_NO!="")&&(Q_DOC_SERL!=null)&&(Q_FORM_NO!=null)){
        $$("nullWindow").hide();
    }
    $$("uploadAPI").addDropZone( $$("fileTable").$view, "Drop files here");
});

// const api_host = "http://192.168.106.4:9001/api/"+onl_const.api_key+"/";
const api_host = "http://localhost:9001/api/"+onl_const.api_key+"/";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const Q_DIRECTORY = "D:/edm_etc_uploads";
const Q_FORM_NO = urlParams.get('FORM_NO');
const Q_DOC_SERL = urlParams.get('DOC_SERL');

var path_form = {
    view:"form",
    id:"path_form",
    borderless:true,
    type:"clean",
    cols:[
        {view:"text",name:"DIRECTORY",placeholder:"DIRECTORY",width:200,value:Q_DIRECTORY,readonly:true,tooltip:"Directory"},
        {view:"text",name:"Q_FORM_NO",placeholder:"Q_FORM_NO",width:150,value:Q_FORM_NO,readonly:true,tooltip:"Form_no"},
        {view:"text",name:"Q_DOC_SERL",placeholder:"Q_DOC_SERL",width:150,value:Q_DOC_SERL,readonly:true,tooltip:"Doc_serl"},
        {view:"button",label:"text",width:80,click:function(){
            fileTable.reload();
        }},
    ],
}

var navbar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("EDM ETC",{css:"whitetext"}),
        {},
        path_form,
    ]
}

var fileTable = {
    view:"datatable",
    id:"fileTable",
    css:"rows",
    select:"row",
    data:getFiles(),
    columns:[
        {id:"INDEX",header:[{text:"No.",css:"textcenter"}],width:80,sort:"int",css:"textcenter"},
        {id:"FILENAME",header:"Name",fillspace:true,minWidth:200,sort:"text"},
        {id:"FILETYPE",header:"Type",width:100,sort:"text",template:function(obj){
            let filesArr = (obj.FILENAME).split(".");
            return filesArr.at(-1);
        }},
        {id:"FILESIZE",header:"Size",width:100,sort:"int",css:"textright",format:formatFileSize},
    ],
    scheme:{
        $init:function(obj){ obj.INDEX = this.count(); }
    },
    reload:function(){
        $$(this.id).clearAll();
        $$(this.id).parse(getFiles());
    }
}

var previewFile = {
    rows:[
        {
            view:"toolbar",
            css:"lightgreybackground",
            height:42,
            cols:[
                createHeader("Preview"),
            ]
        },
        {
            view:"template",
            width:500,
        }
    ]
}

var fileViewer = {
    type:"space",cols:[
        fileTable,
        {view:"resizer"},
        previewFile,
    ]
}

webix.ui({
    view:"window",
    id:"nullWindow",
    position:"center",
    modal:true,
    width:300,
    height:200,
    head:false,
    body:{
        rows:[
            {},
            createHeader("FORM_NO / DOC_SERL not found",{css:"textcenter"}),
            {},
        ]
    }
}).show();

webix.ui({
    id:"uploadAPI",
    view:"uploader",
    upload:api_host+"file/fileupdt",
    inputName:"uploader",
    on:{
        onFileUploadError:function(item){
            console.log(item);
        },
        onFileUpload:function(item){
            console.log(item);
            webix.message("Done");
        }
    },
    link:"fileTable",
    apiOnly:true
});

function getFiles(){
    let post = {
        PATH:"DIRECTORY/Q_FORM_NO/Q_DOC_SERL",
        DATA:{
            DIRECTORY:Q_DIRECTORY,
            Q_FORM_NO:Q_FORM_NO,
            Q_DOC_SERL:Q_DOC_SERL,
        }
    }
    return webix.ajax().post(api_host+"file/read",post,function(text){
        // console.log(text);
    })
}

function formatFileSize(bytes) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}