function ajaxRequest(url, data , handler, convertjson=true) {
    var xhttp = new XMLHttpRequest();
    if(convertjson){
        xhttp.open("POST", url, true);
    }else{
        xhttp.open("GET",url, true);
    }
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

function buildIndexPage(response) {
    parser = new DOMParser();
    doc = parser.parseFromString(response, 'text/html');
    dashboard = doc.getElementById('dashboard');
    document.body.innerHTML = "";
    document.body.appendChild(dashboard);
    var link_tag;
    link_tag = document.createElement("link");
    link_tag.href="./static/css/main.css";
    link_tag.setAttribute("rel", "stylesheet");
    document.body.appendChild(link_tag);
    link_tag = document.createElement("link");
    link_tag.href="./static/css/dashboard.css";
    link_tag.setAttribute("rel", "stylesheet");
    document.body.appendChild(link_tag);
    var script_tag = document.createElement("script");
    script_tag.src="./static/js/changelist.js";
    script_tag.setAttribute("type","text/javascript");
    document.body.appendChild(script_tag);
}

function handlerReg(response) {
    if(response['code'] == 200) {
        alert(response['msg']);
    }else{
        alert(response['msg']);
    }
}

function handlerLog(response) {
    if(response['code'] == 200) {
        ajaxRequest('./', {}, buildIndexPage,false);
    } else {
        alert(response['msg']);
    }
}

function init(){
    var registerForm = document.getElementById("register");
    var loginForm    = document.getElementById("login");

    var activeButtonReg = document.getElementById("active-reg");
    var deactiveButtonReg = document.getElementById("deactive-reg");

    var activeButtonLog = document.getElementById("active-log");
    var deactiveButtonLog = document.getElementById("deactive-log");


    activeButtonReg.addEventListener('click', function(){
        var currentText = activeButtonReg.innerText;
        if(currentText == 'Register'){
            var username = document.getElementById("username-reg").value;
            var password = document.getElementById("password-reg").value;
            var cpassword = document.getElementById("cpassword").value;
            var mailid = document.getElementById("mail").value;

            if(username == ""){
                alert("username feild is empty!");
            } else if(password == ""){
                alert("password feild is empty!");
            } else if(password != cpassword){
                alert("confirm password doesn't matched!");
            } else if(!mailid.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                alert("email id should be valid one!");
            }else {
                data = {
                    'username' : username,
                    'password' : password,
                    'mail': mailid
                };

                ajaxRequest('./register', data, handlerReg);
            }
        }
    });

    deactiveButtonReg.addEventListener('click',function(){
        var currentText = deactiveButtonReg.innerText;
        if(currentText == 'Login') {
            registerForm.style.display = "none";
            loginForm.setAttribute("style", "");
        }
    });

    activeButtonLog.addEventListener('click', function(){
        var currentText = activeButtonLog.innerText;
        if(currentText == 'Login'){
            var username = document.getElementById("username-log").value;
            var password = document.getElementById("password-log").value;
            if(username == "") {
                alert("username feild is empty!");
            } else if(password == "") {
                alert("password feild is empty!");
            } else {
                data = {
                    'username':username,
                    'password':password
                };
                ajaxRequest('./login', data, handlerLog);
            }
        }
    });

    deactiveButtonLog.addEventListener('click', function(){
        var currentText = deactiveButtonLog.innerText;
        if(currentText == 'Register') {
            loginForm.style.display = "none";
            registerForm.setAttribute("style", "");
        }
    });

    loginForm.onsubmit = function(){
        return false;
    }
    registerForm.onsubmit = function(){
        return false;
    }
}

init()