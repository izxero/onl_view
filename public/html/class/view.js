webix.ready(function(){
	if (!webix.env.touch && webix.env.scrollSize)
        webix.CustomScroll.init();
    webix.ui({
        rows:[

        ]
    });
});

// const api_host = "http://192.168.106.4:9001/api/"+onl_const.api_key+"/";
const api_host = "http://localhost:9001/api/"+onl_const.api_key+"/";

