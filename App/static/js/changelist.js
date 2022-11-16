var dataset;
var dashboardData = [];

function ajaxRequestRecomandation(url, data , handler, convertjson=true) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", 'application/json; charset=utf-8')
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(url);
            if(convertjson){
                handler(JSON.parse(this.responseText))
            }else{
                handler(this.responseText);
            }
        }
    }
    xhttp.send(JSON.stringify(data));
}


function searchContentHandler(data) {
    data = Object.values(data);
    for(var i of data) {
        for(var j of Object.values(i)){
            for(var k of Object.values(j)){
                dashboardData.push(Object.values(k));
            }
        }
    }
    constriantDashboardsearchContent();
}


function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function addRecomandationCloseButton(){
    var button_tag = document.getElementById("close-button");
    button_tag.addEventListener("click", function(){
        document.getElementById("dashboard").style.opacity = 1;
        document.body.removeChild(document.getElementById("recomandation-windows"));
    });
}

function recomandation(event) {
    var hintId = event.currentTarget.hintId;
    ajaxRequestRecomandation('/recommandation', {'hintId':hintId} , function(content){
        var recomand = htmlToElements(content)[0];
        try{
            document.body.removeChild(document.getElementById("recomandation-windows"));
        }catch(e){

        }
        document.body.appendChild(recomand);
        document.getElementById("dashboard").style.opacity = 0.5;
        addRecomandationCloseButton();
    }, false);
}

function addUploadEvents() {
    document.getElementById("upload-button").addEventListener('click', function(){
        var file = document.getElementById("file").files[0];
        var formData = new FormData();
        formData.append("file", file);
        var http = new XMLHttpRequest();
        http.open("POST", "./upload",true);
        http.onreadystatechange = function(){
            if(this.readyState==4 && this.status==200) {
                (function(content){
                    var recomand = htmlToElements(content)[0];
                    try{
                        document.body.removeChild(document.getElementById("recomandation-windows"));
                    }catch(e){
            
                    }
                    document.body.appendChild(recomand);
                    document.getElementById("dashboard").style.opacity = 0.5;
                    addRecomandationCloseButton();
                })(this.responseText);
            }
        }
        http.send(formData)
    })
}

function constriantDashboardsearchContent(searchWord="") {
    data = dashboardData.filter(function(ele) {
        return ele[3].toLowerCase().startsWith(searchWord.toLowerCase());
    });
    content = document.getElementById("searchcontent");
    content.innerHTML = "";
    for(var i=0; i<data.length; i++) {
        var div_tag = document.createElement('div');
        div_tag.className = "searchlist";
        var img_tag = document.createElement("img");
        img_tag.src = data[i][1];
        div_tag.appendChild(img_tag);
        var span_tag = document.createElement("span");
        span_tag.innerText = data[i][3];
        div_tag.hintId = data[i][2];
        div_tag.appendChild(span_tag);
        div_tag.addEventListener('click', recomandation)
        content.appendChild(div_tag);
    }  

}

function init() {
    var selectedHint = 0;
    var listView = document.getElementById("aside-list");
    var listArray = listView.querySelectorAll("li");

    content = document.getElementById("searchcontent");

    var http = new XMLHttpRequest();
    http.open('GET','./getdashboard', true);
    http.onload = function(){
        if(this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            dataset = data;
            searchContentHandler(data);
        }
    }
    http.send();

    for(var i=0; i<listArray.length; i++){
        listArray[i].hintId = i;
        listArray[i].addEventListener("click", function(e){
            if(selectedHint == e.currentTarget.hintId)
                e.preventDefault();
            listArray[selectedHint].id = "";
            e.currentTarget.id = "active";
            selectedHint = e.currentTarget.hintId;
            var main_page = document.getElementById("main");
            switch(selectedHint){
                case 0:
                    var form_data = `
                        <form id="search">
                            <input id="searchbox" type="text" placeholder="search plant name"  autocomplete="off">
                            <input id="submitbutton" type="submit" value="Search">
                        </form>
                        <span id="plant-disease-header">Plant Disease</span>
                        <div id="searchkeyword">
                            <span>Search Keyword : </span>
                            <span id="searchword" class="searchword">""</span>
                        </div>
                        <div id="searchcontent">
                        </div>
                    `
                    main_page.innerHTML = form_data;
                    var form_tag = document.getElementById("search");
                    form_tag.addEventListener("submit", function(event) {
                        var searchContent = document.getElementById("searchbox").value;
                        document.getElementById("searchcontent").innerHTML="";
                        constriantDashboardsearchContent(searchContent);
                        document.getElementById("searchword").innerText=' " '+searchContent+' " ';

                        event.preventDefault();
                    }); 
                    var link_tag = document.createElement("link");
                    link_tag.href = "./../static/css/upload.css";
                    link_tag.rel = "stylesheet";
                    main_page.appendChild(link_tag);
                    var http = new XMLHttpRequest();
                    http.open('GET','./getdashboard', true);
                    http.onload = function(){
                        if(this.readyState == 4 && this.status == 200) {
                            constriantDashboardsearchContent();
                        }
                    }
                    http.send();
                    break;
                case 1:
                    var upload_data = `
                    <div id="upload">
                    <div id="header">Upload Your File</div>
                    <div id="subheader">Fast and Easy Way</div>
                    <div id="drag">
                        <input id="file" type="file" class="file_upload" />
                        <img src="./../static/icon/folder.png">
                        <span>Drag and drop files here</span>
                    </div>
                    <button id="upload-button">Submit</button>
                    </div>
                    `
                    main_page.innerHTML = upload_data;
                    addUploadEvents();
                    break;
                case 2:
                    main_page.innerHTML = "";
                    break;
            }
        });
    }

    var form_tag = document.getElementById("search");
    form_tag.addEventListener("submit", function(event) {
        var searchContent = document.getElementById("searchbox").value;
        document.getElementById("searchcontent").innerHTML="";
        constriantDashboardsearchContent(searchContent);
        document.getElementById("searchword").innerText=' " '+searchContent+' " ';
        event.preventDefault();
    });

    var logout_button = document.getElementById("logout");
    logout_button.addEventListener("click", function() {
        var http = new XMLHttpRequest();
        http.open('GET','./logout', true);
        http.onload = function(){
            if(this.readyState == 4 && this.status == 200) {
                window.location.reload();
            }
        }
        http.send();
    })
}

init();