function analyse(imgUrl) {

    const apiEndpoint = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0'
    const apiKey = '33216c3f6e944066b1055fda30078210'

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey
    })

    const params = {
        'returnFaceId': 'true',
        'returnFaceAttributes': 'age,gender'
    }

    let initObject = {
        method: "POST",
        headers: headers,
        mode: 'cors',
        body: JSON.stringify({ url: imgUrl})   
        
    }

    var query = Object.keys(params)
     .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
     .join('&');


    const request = new Request(apiEndpoint + "/detect?" + query, initObject)

    fetch(request).then(response => {
        if (response.ok) {
            return response.json();
        } else {
          return Promise.reject(new Error(response.statusText))  
        }
    }).then(response => {
        document.getElementById('analysedImg').src = imgUrl;

        if (response[0] === undefined) {
            return Promise.reject("Not a face");
        }

        document.getElementById("output").innerHTML = "Age: " + response[0].faceAttributes.age + "<br/>Gender: " + response[0].faceAttributes.gender;
    }).catch(err => {
        alert(err)
        document.getElementById("output").innerHTML = "";
    })
}


document.getElementById("analyseButton").addEventListener('click', () => { 
    let input = document.getElementById("input").value;
    analyse(input);
})