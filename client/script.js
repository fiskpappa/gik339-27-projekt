const url = 'http://localhost:3000/client';

window.addEventListener('load', fetchData);

function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then(clients => {
      if (clients.length > 0) {
        let html = `<ul class="list-unstyled row gap-4">`;
        clients.forEach((client) => {
          html += `
        <li class="clientCard d-block p-0 shadow col-sm-12 col-md-5 col-xl-3 rounded-4 bg-white bg-opacity-50">
          <header class="cardHeader px-3 py-3 rounded-top-4 mb-3" style="border-bottom: solid .25rem ${client.color};">
          <h3 class="cardHeader mt-2 colorChanger fw-bold" style="color:rgb(61, 58, 59);">${client.companyName}</h3>
          </header>
          <div class="infoContainer d-block mb-2">
          <p class="mb-0 px-3 mt-2" style="color:rgb(61, 58, 59);"><b>Kontaktperson:</b></p> 
          <p class="mb-2 px-3" style="color:rgb(61, 58, 59);">${client.contactName}</p>  
          <p class="mb-0 px-3" style="color:rgb(61, 58, 59);"><b>Email:</b></p> 
          <p class="mb-2 px-3" style="color:rgb(61, 58, 59);">${client.contactEmail}</p>
          <p class="mb-0 px-3" style="color:rgb(61, 58, 59);"><b>Projekttyp:</b></p>
          <p class="mb-2 px-3" style="color:rgb(61, 58, 59);">${client.projectType}</p>
          <p class="mb-0 px-3" style="color:rgb(61, 58, 59);"><b>Projektlängd:</b></p>
          <p class="mb-2 px-3" style="color:rgb(61, 58, 59);">${client.projectLength} veckor</p>
          </div>
          <div class="d-flex mt-auto py-3 px-2 rounded-bottom-4"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="${client.color}" class="bi bi-circle-fill ms-3" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8"/>
          </svg>
          <a href="#formSection" class="button shadow-sm ms-auto btn rounded-3 bg-white" onclick="setCurrentClient(${client.id});">Ändra</a>
          <button class="deleteButton shadow-sm button btn mx-3 rounded-3 bg-white text-danger" data-id="${client.id}">Ta bort</button>
          </div>
        </li>`;
        });
        html += `</ul>`;

        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';
        cardContainer.insertAdjacentHTML('beforeend', html);

        clients.forEach(client => {
          const button = document.querySelector(`.deleteButton[data-id="${client.id}"]`);
          button.addEventListener('click', () => deleteClient(client.id));  
        });
      }
    });
}

function deleteClient(id) {
  fetch(`${url}/${id}`, { method: 'DELETE' })
    .then((response) => {
      if (response.ok) {
        fetchData();
        showModal('Företagsinformation har raderats.');
      } else {
        showModal('Ett fel uppstod när resursen skulle tas bort.');
      }
    })
    .catch((error) => {
      console.error('Fel vid borttagning av resurs:', error);
      showModal('Ett oväntat fel inträffade.');
    });
}  

function setCurrentClient(id) {
  console.log('Current ID:', id);

  fetch(`${url}/${id}`)
  .then((result) => result.json())
  .then((client) => {
      console.log('Client data:', client);
      clientForm.companyName.value = client.companyName;
      clientForm.contactName.value = client.contactName;
      clientForm.contactEmail.value = client.contactEmail;
      clientForm.projectType.value = client.projectType;
      clientForm.projectLength.value = client.projectLength;
      clientForm.color.value = client.color;
      clientForm.id.value = client.id;
      
      localStorage.setItem('currentId', client.id);
    });
}



clientForm.addEventListener('submit', handleSubmit);


function handleSubmit(e) {
  e.preventDefault();
  
  const serverClientObject = {
    companyName: '',
    contactName: '',
    contactEmail: '',
    projectType: '',
    projectLength: '',
    color: ''
  }

  serverClientObject.companyName = clientForm.companyName.value;
  serverClientObject.contactName = clientForm.contactName.value;
  serverClientObject.contactEmail = clientForm.contactEmail.value;
  serverClientObject.projectType = clientForm.projectType.value;
  serverClientObject.projectLength = clientForm.projectLength.value;
  serverClientObject.color = clientForm.color.value;
  
  const id = localStorage.getItem('currentId');

  let requestUrl = url;
  let method = 'POST';
  
  if(id) {
    requestUrl = `${url}/${id}`;
    method = 'PUT';
    serverClientObject.id = id;
  }

  const request = new Request(requestUrl, {
    method: method,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(serverClientObject)
  });

  
  fetch(request)
  .then((response) => {
    if (response.ok) {
      fetchData();
      localStorage.removeItem('currentId');
      clientForm.reset();
      showModal(id ? 'Företagsinformationen har uppdaterats.' : 'Företagsinformationen har lagts till!');
      } else {
        console.error('Ett fel har uppstått när informationen försökte sparas.');
        showModal('Ett fel har inträffat.')
      }
    })
    .catch((error) => console.error('Det blev ett fel när du skickade in formuläret:', error));
  }

function showModal(message) {
  const feedbackMessage = document.getElementById('feedbackMessage');
  feedbackMessage.textContent = message;

  const actionModal = new bootstrap.Modal(document.getElementById('actionModal'));
  actionModal.show();
}
