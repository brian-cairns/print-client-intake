const { stat } = require("fs");

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
    sessionStorage.setItem('clientName', data.clientName)
    showPage()
    data = await appendStaffAssessment(data);
    sessionStorage.setItem('staffName', data.staff)
    submitForm(data, 'newIntakeFormStaff') 
    updateClient(data)
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

function notify(to, message, type, priority) {
    toSend = {
        'name': to,
        'notice': message,
        'type': type,
        'priority': priority
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

async function appendStaffAssessment(data) {
    document.getElementById('submit').addEventListener('click', (event) => {
        data.staff = ''
        data.assessDate = ''
        data.readingLevel = ''
        data.writingLevel = ''
        data.ogl = ''
        data.bgl = ''
        data.mathLevel = ''
        data.staff = document.getElementById('staff').value;
        data.assessDate = document.getElementById('assessDate').value;
        data.readingLevel = document.getElementById('readingLevel').value;
        data.writingLevel = document.getElementById('writingLevel').value;
        data.ogl = document.getElementById('ogl').value;
        data.bgl = document.getElementById('bgl').value;
        data.mathLevel = document.getElementById('mathLevel').value
        return data
    } )
}

async function submitForm(data, form) {
  const document = {
    'form': form,
    'data': data
  }
  console.log(document)
  fetch('https://pffm.azurewebsites.net/form', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin" : "*"
    },
    body: JSON.stringify(document)
  })
    .then(response => response.json())
    .then(data => respond(data)) 
    .catch((err) => showError(err))
}

function respond(data) {
  let id = data.key
  if (id) {
    showSuccess(id) 
  } else {
    showError(data.error)
  }
}

function showSuccess(id) {
  document.getElementById('returnMessage').innerHTML = 'Form has been successfully submitted & notifications have been sent'
  href = `https://phoenix-freedom-foundation-backend.webflow.io/completed-forms/new-client-intake-form-staff?id=${id}`
    message = `You have an updated <a href=${href}>New Client Intake Form</a> to view`
    let staff = sessionStorage.getItem('staffName')
    let client = sessionStorage.getItem('clientName')
    notify(staff, message, 'individual', 'not urgent')
    notify(client, message, 'individual', 'not urgent')
    notify('admin', message, 'individual', 'not urgent')
    
}


function showError(err) {
    console.error
    document.getElementById('returnMessage').innerHTML = `An error occurred when submitting this form, which was ${err}. Please contact the administrator for help.`
}


async function updateClient(clientData) {
    console.log(clientData)
    const document = {
        data: clientData,
        clientName: clientData.clientName
    }
    fetch('https://pffm.azurewebsites.net/updateClient', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(document)
    })
        .then(() => console.log('resolved'))
        .catch(console.error)
}