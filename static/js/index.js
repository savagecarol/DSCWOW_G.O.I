function fade(element,delay){
    
    element = document.getElementById(element)
    var op = 1
    var timer = setInterval(function () {
        if (op <= 0){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op = op - 0.1;
    }, delay);
    
    
}


function unfade(element,delay) {
    element = document.getElementById(element)
    var op = 0
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        op =op + 0.1;
    }, delay);
}

function analyzeText(){
    document.getElementById("loader").style.display = ""
    sendRequest(document.getElementById('textinput').value, "Text")
}


function sendRequest(value,callBy){
    var http = new XMLHttpRequest();
    var url = '/api/index';
    var returnValue = ""
    csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value

    var params = 'csrfmiddlewaretoken='+csrfToken+'&image_content='+value;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            callbackCheckYesOrNo(http.responseText,callBy)
        }
    }
    http.send(params);

}


function callbackCheckYesOrNo(response,callBy){
    console.log(response)
    var result = "";

    
    if(response === `[&#x27;Yes&#x27;]`){
    
        result = "These Terms And Conditions Sounds Good...</br> The App Can Be Used.."


        document.getElementById("loader").style.display = "none"
        document.getElementById("none").style.display = ""
        document.getElementById("YesVerified").style.display = ""
        

        console.log('Yes')
    }
    
    else{

        result = "These Terms And Conditions Does Not Sound.. </br> The App Can't Used.."


        document.getElementById("loader").style.display = "none"
        document.getElementById("none").style.display = ""
        document.getElementById("NoNotVerified").style.display = ""

        console.log('No')
    }

    if(callBy === 'Text'){
        document.getElementById("textUpload").style.display = "none"
    }
    else{
        document.getElementById("imageUpload").style.display = "none"
    }

    document.getElementById('result-text').innerHTML = result
    document.getElementById('Result').style.display = ""

    applyColorArray('Result',70)
}





