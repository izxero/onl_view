webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[
            navbar,
            fileViewer,
        ]
    });
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const Q_DOC_SERL = urlParams.get('DOC_SERL');
const Q_FORM_NO = urlParams.get('FORM_NO');

var navbar = {
    view:"toolbar",
    css:"pasteldarkgreen",
    cols:[
        createHeader("EDM ETC",{css:"whitetext"}),
        {},
        {view:"text",id:"Q_DOC_SERL",placeholder:"Q_DOC_SERL",width:150,value:Q_DOC_SERL,readonly:true},
        {view:"text",id:"Q_FORM_NO",placeholder:"Q_FORM_NO",width:150,value:Q_FORM_NO,readonly:true},
    ]
}

var fileTable = {
    view:"datatable",
    css:"rows",
    select:"row",
    columns:[
        {id:"INDEX",header:"No.",width:80,sort:"int"},
        {id:"FILENAME",header:"Name",fillspace:true,minWidth:200,sort:"text"},
        {id:"FILETYPE",header:"Type",width:100,sort:"text"},
        {id:"FILESIZE",header:"Size",width:100,sort:"int"},
    ]
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