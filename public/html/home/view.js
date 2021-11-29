webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[
            {cols:[
                sidebar,
				blankTemp,
                iframe,
            ]},
        ]
    });
	$$("frame-body").hide();
});

var navBar = {
    view:"toolbar",
    css:"gradientpurple",
    cols:[
        {view:"icon",icon:"fas fa-minus-square",tooltip:"ย่อ/ขยาย เมนู",click:function(){
            $$("sidebar").toggle();
			if($$("sidebar").getState().collapsed){
				this.define("icon","fas fa-plus-square");
				this.refresh();
			}else{
				this.define("icon","fas fa-minus-square");
				this.refresh();
			}
        }},
        createHeader("ONL MENU",{css:'whitetext'}),
    ]
}

var sidebar = {
    rows:[
        navBar,
		{
            id:"sidebar",
            view:"sidebar",
            scroll:"y",
            multipleOpen:true,
            width:200,
            css:"webix_dark",
            data:[
                {id:"1",value:"Log",src:"log",icon:"fas fa-file-alt"},
				{id:"2",value:"SQL2Excel",src:"sql2excel",icon:"fas fa-table"},
                // {id:"3",value:"Login",src:"login",icon:"fas fa-table"},
            ],
            on:{
                onAfterSelect:function(id){
                    let current = this.getItem(id);
                    // console.log(current);
                    let url = "/"+current.src;
                    $$("frame-body").load(url);
					$$("blankTemp").hide();
					$$("frame-body").show();
                },
				onItemDblclick:function(id){
					let current = this.getItem(id);
					window.open("/"+current.src,"_blank");
				},
            },
        },
	]
}

var blankTemp = {
	id:"blankTemp",
	rows:[
		{},
		{cols:[
			{},
			{view:"label",	label:"กรุณาเลือกเมนู",	align:"center"},
			{},
		]},
		{},
	]
}

var iframe = {     
	view:"iframe", 
	id:"frame-body", 
	src:""
}
