function ajaxReq(url, handler){
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            handler(this.responseText);
        }
    }
    http.send();
}

function handler(data){
    console.log(data);
}

ajaxReq("https://plantix.net/en/library/plant-diseases/100040/potato-late-blight" , handler);