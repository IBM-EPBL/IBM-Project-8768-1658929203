function init(){
    var http = new XMLHttpRequest();
    http.open("GET", "./", true);
    http.onload = function(){
        console.log(this.responseText)
        document.body.innerHTML =this.responseText
        script_tag = document.createElement('script')
        script_tag.src = "./../static/js/changelist.js";
        document.body.appendChild(script_tag);
    }
    http.send();

}

init()