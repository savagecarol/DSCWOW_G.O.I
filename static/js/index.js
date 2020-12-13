function loader(){
    var body = document.getElementById("body-container")
    var op = 1
    var timer = setInterval(function () {
        if (op <= 0.4){
            clearInterval(timer);
            document.getElementById("loader-container").style.display = "flex"
        }
        body.style.opacity = op;
        op = op - 0.1;
    }, 10);
}

function unloader(){
    console.log("unloader")
    var body = document.getElementById("body-container")
    body.style.opacity = 1;
    op = 0.4
    var timer = setInterval(function () {
        if (op > 1){
            clearInterval(timer);
        }
        body.style.opacity = op;
        op = op + 0.1;
    }, 10);
    document.getElementById("loader-container").style.display = "none"   
    document.getElementById("text-update").textContent = "Reading Data...."
    
}

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

var index = 1;


function changeLandingPageCarousal(){
        element = document.getElementById("carousal-content")
        fade(element.id,40)
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
        unfade(element.id,40)
}

function carousalTimer(){
    var timer = setInterval(function () {
        changeLandingPageCarousal()
    }, 2000);
}

function analyzeText(){
    // document.getElementById("loader").style.display = ""
    document.getElementById("text-update").textContent = "Sending Data...."
    loader()
    sendRequest(document.getElementById('textInput').value, "Text")
}

function analyzeImage(){
    loader()
    console.log("Image Analysis")
    imageLoader = document.getElementById("imageLoader")
    const reader = new FileReader()
    reader.readAsDataURL(imageLoader.files[0])
    reader.onload = function() {
        console.log(reader.result)//background-image
        document.getElementById("v-pills-profile").style.backgroundImage = "url("+reader.result+")"
        Tesseract.recognize(reader.result).then(function (result){

            sendRequest(result.data.text)
            document.getElementById("text-update").textContent = "Image To Text Done....     Sending Data...."

        })
    }

    reader.onerror = function() {
        console.log(reader.error);
    };
    

}

function sendRequest(value,callBy){
    console.log("Yeag")
    var http = new XMLHttpRequest();
    var url = '/api/index';
    var returnValue = ""

    value=value.replace(/[\r\n]/g, ' ')
    var params = {content: value}
    params = JSON.stringify(params)
    console.log(params)
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json')

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var output = JSON.parse(http.responseText);
            callbackCheckYesOrNo(output)
        }
        else{
            document.getElementById("v-pills-messages").style.backgroundColor = "red"
            document.getElementById("v-pills-messages").style.color = "white"
            document.getElementById("result-show-status").innerHTML = "Result  :   Could Not Process Data"
            document.getElementById("output-result").textContent = "Please, Upload Another Image/Text ....."
            
            document.getElementById("remove-button-msg").outerHTML = "<span id=\"remove-button-msg\" class=\"submit-button btn\" onclick=\"uploadNewImage()\">Upload New Content</span>"
            // document.getElementById("remove-button").outerHTML = "<span id=\"remove-button\" class=\"submit-button btn\" onclick=\"window.location.reload()\">Refresh Page</span>"
            

            document.getElementsByClassName("show active")[0].className = "tab-pane fade"
            document.getElementById("v-pills-messages").className = "tab-pane fade show active"
            var active = document.getElementsByClassName("nav-link active")[0]
            var activeClass = active.classList[0] +" "+ active.classList[1]
            active.className = activeClass
            document.getElementsByClassName("nav-link pill-3")[0].className = "nav-link pill-3 active"
            unloader()    
        }
    }
    http.send(params);

}

function uploadNewImage(){
    document.getElementsByClassName("show active")[0].className = "tab-pane fade"
    document.getElementById("v-pills-profile").className = "tab-pane fade show active"   
    var active = document.getElementsByClassName("nav-link active")[0]
    var activeClass = active.classList[0] +" "+ active.classList[1]
    active.className = activeClass
    document.getElementsByClassName("nav-link pill-2")[0].className = "nav-link pill-2 active"
     
}

function callbackCheckYesOrNo(response,callBy){
    result = response.summary.split(".")
    console.log(result)
    console.log(response.status)
    var liCreate = ""
    result.forEach(createList);
    function createList(sentence){
        if(sentence.length > 10)
            liCreate = liCreate + "\n<li>" + sentence + "</li>"
    }
    document.getElementById("result-show").innerHTML = liCreate
    if(response.status === "Yes"){
        document.getElementById("v-pills-messages").style.color = "white"
        document.getElementById("v-pills-messages").style.backgroundColor = "green"
        document.getElementById("result-show-status").innerHTML = "Result  :  The Software Is Safe For Use"
    }
    else{
        document.getElementById("v-pills-messages").style.backgroundColor = "red"
        document.getElementById("v-pills-messages").style.color = "white"
        document.getElementById("result-show-status").innerHTML = "Result  :  The Software Is Unsafe For Use"
    }
    document.getElementById("remove-button-msg").outerHTML = "<span id=\"remove-button-msg\" class=\"submit-button btn\" onclick=\"window.location.reload()\">Refresh Page</span>"
    document.getElementById("remove-button").outerHTML = "<span id=\"remove-button\" class=\"submit-button btn\" style=\"display: 'block'\" onclick=\"window.location.reload()\">Refresh Page</span>"
    document.getElementById("imageLoader").outerHTML = "<input type=\"file\" name=\"image\" id=\"imageLoader\" style=\"display:none;\" onchange=\"window.location.reload()\">"
    
    document.getElementsByClassName("show active")[0].className = "tab-pane fade"
    document.getElementById("v-pills-messages").className = "tab-pane fade show active"
    var active = document.getElementsByClassName("nav-link active")[0]
    var activeClass = active.classList[0] +" "+ active.classList[1]
    active.className = activeClass
    document.getElementsByClassName("nav-link pill-3")[0].className = "nav-link pill-3 active"

    unloader()
}


function imageUploaded(){
    analyzeImage()
}
`Depending on how you obtained the Office software, this is a license agreement between (i) you and the device manufacturer or software installer that distributes the software with your device; or (ii) you and Microsoft Corporation (or, based on where you live or if a business where your principal place of business is located, one of its affiliates) if you acquired the software from a retailer. Microsoft is the device manufacturer for devices produced by Microsoft or one of its affiliates, and Microsoft is the retailer if you acquired the software directly from Microsoft.This agreement describes your rights and the conditions upon which you may use the Office software. You should review the entire agreement, including any printed paper license terms that accompany the software and any linked terms, because all of the terms are important and together create this agreement that applies to you. You can review linked terms by pasting the forward link into a browser window.By accepting this agreement or using the software, you agree to all of these terms and consent to the transmission of certain information during activation and during your use of the software pursuant to the Microsoft Privacy Statement described in Section 4. If you do not accept and comply with these terms, you may not use the software or its features. You may contact the device manufacturer or installer, or your retailer if you purchased the software directly, to determine its return policy and return the software or device for a refund or credit under that policy. You must comply with that policy, which might require you to return the software with the en`
