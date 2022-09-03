//few sites for requesting api,s or search web
//https://randomuser.me/api/
//https://reqres.in/api/users
console.log(`GET/POST request Server`);

//initializing checkboxes
document.getElementById("get").checked=true;
document.getElementById("json").checked=false;
document.getElementById("parameters").checked=false;

//Utility functions
//1. function to get DOM element from a string
function getElementFromStr(string){
    let div=document.createElement("div");
    div.innerHTML= string;
    return div.firstElementChild;
}

//intializing no. of parametrs for content type=custom params
let paramcount=1;  //as we alreday declared one from which will be taking reference for others.


//Hiding content type box,params box request json box initially as not required for get request
const contentbox=document.getElementById("contentbox");
contentbox.style.display="none";
const jsonbox=document.getElementById("json_requestbox");
jsonbox.style.display="none";
const parametersbox=document.getElementById("parametersbox1");
parametersbox.style.display="none";


//if request type is get then contentbox, parambox and jsonbox will remain hidden, else if request type is post will be visible
const getradio=document.getElementById("get");
getradio.addEventListener("click", ()=>{
    document.getElementById("contentbox").style.display="none";
    document.getElementById("json_requestbox").style.display="none";
    document.getElementById("parametersbox1").style.display="none";
    //also again disabling the radios of content box
    document.getElementById("json").checked=false;  document.getElementById("parameters").checked=false;
});
const postradio=document.getElementById("post");
postradio.addEventListener("click", ()=>{
    document.getElementById("contentbox").style.display="block";
    document.getElementById("contentbox").style="margin-left: 4vw;";
    // document.getElementById("json_requestbox").style.display="block";
    // document.getElementById("json_requestbox").style="display: flex; align-items: center;";   //for allignment of text and textarea
    // document.getElementById("parametersbox1").style.display="block";
});
//if content type is json, hide parameters box. if content type is custom params, hide json box
const parametersradio=document.getElementById("parameters");
parametersradio.addEventListener("click", ()=>{
    document.getElementById("json_requestbox").style.display="none";
    document.getElementById("parametersbox1").style.display="block";
});
const jsonradio=document.getElementById("json");
jsonradio.addEventListener("click", ()=>{
    document.getElementById("parametersbox1").style.display="none";
    document.getElementById("json_requestbox").style.display="block";
    document.getElementById("json_requestbox").style="display: flex; align-items: center;";   //for allignment of text and textarea
});


//if user clicks on + button adding more parameters in parameter box
let addparams=document.getElementById("addparameters");
addparams.addEventListener("click", ()=>{
    let margin_left;  //for maintaining margin of parameter boxes
    if(paramcount<9){ margin_left=7.3; }
    else if(paramcount<99){ margin_left=6.7; }
    else{ margin_left=6.1; }

    let params=document.getElementById("params");
    let str=`
        <div id="parametersbox${paramcount+1}" style="display: flex; margin-bottom: 3px; margin-top: 2px;">
            <label for="parameterkey1 parametervalue${paramcount+1}" style="margin-left: 5vw;"><b>Parameter</b></label>
            <input type="text" class="form-control" id="parameterkey${paramcount+1}" placeholder="Enter Parameter Key" 
                style="width: 25vw; display: inline-block; margin-left: ${margin_left}vw; margin-right: 1vw;">
            <input type="text" class="form-control" id="parametervalue${paramcount+1}" placeholder="Enter Parameter Value" 
                style="width: 25vw; display: inline-block; margin-right: 1.5vw;">
            <button id="removeparameters" class="btn btn-primary delete-params">-</button>
        </div>
    `;
    let paramElement= getElementFromStr(str);
    params.appendChild(paramElement);  // params.innerHTML+=str; or we can directly append innerhtml then using utility funct
    paramcount++;

    //adding eventlistner for - button for removing para
    let deleteparams=document.getElementsByClassName("delete-params");  //retrieving all elements with this class
    for(item of deleteparams){
        item.addEventListener("click", (e)=>{
            e.target.parentElement.remove();  //removing the parent element of target
        });
    }
});


//event for clicking on submit btn
let submit=document.getElementById("submit");
submit.addEventListener("click", ()=>{
    //showing please wait response
    // document.getElementById("responsebox_text").classList += " text-muted";  //adding bootstrap class
    document.getElementById("responsebox_text").value= "Please Wait... Fetching Response...";

    //fetching values
    let url=document.getElementById("urlfield").value;
    let requesttype=document.querySelector(`input[name="requesttype"]:checked`).value;

    if(requesttype == "GET"){  //matching value of radio, set while declaring
        //handling get request
        fetch(url, {  
            method: "GET"
        }).then(response=>response.text()
        ).then((text)=>{
            document.getElementById("responsebox_text").value = text;
        });
    }
    else{
        let contenttype=document.querySelector(`input[name="contenttype"]:checked`).value;
        let data={};  //creating an empty object
        //if request type is custom parameters, collecting all parameters in an object
        if(contenttype == "Parameters"){  //matching the value of radio, set while declaring
            for(let i=1; i<=paramcount; i++){
                if(document.getElementById("parameterkey"+i) != undefined){
                    let key=document.getElementById("parameterkey"+i).value; //retreving particular key
                    let value=document.getElementById("parametervalue"+i).value; //retreving particular value
                    data[key]=value;
                }
            }
            data= JSON.stringify(data);  //coverting object to string, as data is string for else statement
        }
        else if(contenttype== "JSON"){  //request type is json
            data=document.getElementById("request_json_text").value;
        }

        //POST request
        fetch(url, {
            method: "POST",
            body: data,  //data is string, paasing body
            headers: {"Content-type": "application/JSON; charset=UTF-8"}  //passing header header
        }).then(response=>response.text()
        ).then((text)=>{
            document.getElementById("responsebox_text").value = text;
        });
    }
});