let id = ''
const params = new URLSearchParams(window.location.search)
for (const [key, value] of params) { id = value; }


//Turn on load animation and hide main content until loaded.
document.getElementById('titleSection').style.display = "none";
document.getElementById('completedForm').style.display = "none";
document.getElementById('signatureSection').style.display = "none";
document.getElementById('saveToPrintSection').style.display = "none";

//Get the data to populate the field
const client = sessionStorage.getItem('userName');
const url = `https://pffm.azurewebsites.net/getForms?form=newClientIntake&id=${id}`
console.log(id)
fetch(url, {
    method: "GET",
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})
  .then(response => response.json())
  .then(data => populatePage(data))    
    //.then(data => )
  .catch(err => showErrorMsg(err))

//Populate the portal
async function populatePage(data) {
    console.log(data)	
    document.getElementById('intakeDate').innerHTML = data.intakeDate;
    document.getElementById('clientName').innerHTML = data.clientName;
    document.getElementById('age').innerHTML = data.age;
    document.getElementById('dob').innerHTML = data.dob;
    document.getElementById('grade').innerHTML = data.grade
    document.getElementById('strengths').innerHTML = data.strengths
    document.getElementById('caregiverName').innerHTML = data.caregiverName;
    document.getElementById('caregiverEmail').innerHTML = data.caregiverEmail;
    document.getElementById('caregiverPhone').innerHTML = data.caregiverPhone;
    document.getElementById('diagnosis').innerHTML = data.diagnosis;
    document.getElementById('needs').innerHTML = data.needs;
    document.getElementById('sensoryNeeds').innerHTML = data.sensoryNeeds;
    document.getElementById('medical').innerHTML = data.medical;
    document.getElementById('services').innerHTML = data.services;
    document.getElementById('hrsOfService').innerHTML = data.hrsOfServices;
    document.getElementById('availability').innerHTML = data.availability;
    document.getElementById('notes').innerHTML = data.notes;
    
    //more to come as we get more data
    showPage()
    const message = `A new client intake form was completed for ${data.clientName}`
    notify('admin', message, 'general')
}

//Turns off animation and shows the page with data fields completed
function showPage() {
    document.getElementById('loadingAnimation').style.display = "none"
    document.getElementById('titleSection').style.display = "block";
    document.getElementById('completedForm').style.display = "block";
    document.getElementById('signatureSection').style.display = "block";
    document.getElementById('saveToPrintSection').style.display = "block";
}

//Turns off animation and shows error message
function showErrorMsg(err) {
	document.getElementById('loadingAnimation').style.display = "none"
    document.getElementById('errorMessage').innerHTML = `There was and error: ${err} when retrieving the data`
    document.getElementById('errorMessageSection').style.display = "block"
}

const printToPDF = document.getElementById('printToPDF')
printToPDF.addEventListener('click', (e) => {
    // Create an IFrame.
    var iframe = document.createElement('iframe');  
    // Hide the IFrame.  
    iframe.style.visibility = "hidden"; 
    // Define the source.  
    iframe.src = pdf;        
    // Add the IFrame to the web page.
    document.body.appendChild(iframe);  
    iframe.contentWindow.focus();       
    iframe.contentWindow.print();
    
})

function notify(to, message, type) {
    toSend = {
        'to': to,
        'message': message,
        'type': type
    }

    const url = `https://pffm.azurewebsites.net/notices`
    const header = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }

    fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(toSend)
    })
        .then(() => console.log(`message to ${to} was sent`))
        .catch(console.error)
    
}