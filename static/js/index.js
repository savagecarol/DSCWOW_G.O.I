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

var index = 1;


function changeLandingPageCarousal(){
        element = document.getElementById("carousal-content")
        fade(element.id,20)
        if(index==0){
            element.getElementsByClassName("container-circles")[0].getElementsByClassName("small-circles")[0].style = ""
            element.getElementsByClassName("container-circles")[0].getElementsByClassName("small-circles")[1].style = ""
            element.getElementsByClassName("container-circles")[0].getElementsByClassName("small-circles")[2].style = ""
            element.getElementsByClassName("container-circles")[0].getElementsByClassName("small-circles")[3].style = ""
            element.getElementsByClassName("big")[0].style = ""
            document.getElementById("main-carousal-container").style = "";     
        }
        textSmall=["Daily Software Downloads","Who Reads Conditions","Who Lose Privacy","Let Us Guardians Save Privacy"]
        textBig=["2.35 Billion","0.00 Billion","2.35+ Billion","--^ Swipe Up ^--"]
        image=["/static/media/DemoPreview.png","/static/media/workingOnPhone.png","/static/media/LockAndCybersec.png","/static/media/WorkingOnSystem.png"]
        if(index==3){
            element.getElementsByClassName("big")[0].style = "font-size: 60px;"
            document.getElementById("main-carousal-container").style = "background-image: linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 1));";     
        } 
        element.getElementsByClassName("big")[0].textContent = textBig[index]
        element.getElementsByClassName("small")[0].textContent = textSmall[index]
        element.getElementsByClassName("image-carousal")[0].src = image[index]
        element.getElementsByClassName("container-circles")[0].getElementsByClassName("small-circles")[index].style = "box-shadow: 0 0 10px rgb(255, 255, 255);"
        index = index + 1;
        if(index == 4){
            index = 0
        }
        console.log(index)
        unfade(element.id,20)
}

function carousalTimer(){
    var timer = setInterval(function () {
        fade(element);
        changeLandingPageCarousal(index)
        unfade(element)
        if(index==3){
            index = 0
        }
    }, 1000);
}
