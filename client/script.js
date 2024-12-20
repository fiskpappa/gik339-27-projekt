const url = 'http://localhost:3000/clients';


window.addEventListener('load', fetchData);

function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then(clients => {
      if (clients.length > 0) {
        let html = `<ul class="list-unstyled row m-3">`;
        clients.forEach((client) => {
          html += `
        <li class="clientCard col-xs-10 col-sm-10 col-md-5 col-xl-3 p-3 br-1 rounded-4">
          <h3 class="colorChanger" style="color: ${client.color};">${client.companyName}</h3>
          <p class="my-2" style="color:rgb(61, 58, 59);"><b>Kontaktperson:</b> ${client.contactName}</p>
          <p class="my-2" style="color:rgb(61, 58, 59);"><b>Email:</b> ${client.contactEmail}</p>
          <p class="my-2" style="color:rgb(61, 58, 59);"><b>Projekttyp:</b> ${client.projectType}</p>
          <p class="my-2" style="color:rgb(61, 58, 59);"><b>Projektlängd:</b> ${client.projectLength} veckor</p>
          <div>
            <button class="button" onclick="setCurrentUser(${client.id})">Ändra</button>
            <button class="button" onclick="deleteUser(${client.id})">Ta bort</button>
          </div>
        </li>`;
        });
        html += `</ul>`;

        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';
        cardContainer.insertAdjacentHTML('beforeend', html);
      }
    });
}

console.log(clientForm);
clientForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
   console.log(clientForm.companyName.value); */

  const serverClientObject = {
    companyName: '',
    contactName: '',
    contactEmail: '',
    projectType: '',
    projectLength: '',
    color: ''
  };
  serverClientObject.companyName = clientForm.companyName.value;
  serverClientObject.contactName = clientForm.contactName.value;
  serverClientObject.contactEmail = clientForm.contactEmail.value;
  serverClientObject.projectType = clientForm.projectType.value;
  serverClientObject.projectLength = clientForm.projectLength.value;
  serverClientObject.color = clientForm.color.value;
  
  console.log(serverClientObject);

  const request = new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(serverClientObject)
  });
  
  fetch(request).then((response) => {
    fetchData();
    clientForm.reset();
    });
  
} */

function setCurrentClient(id) {
  console.log('current', id);
}

  fetch(`${url}/${id}`)
    .then((result) => result.json())
    .then((client) => {
      console.log(client);
      clientForm.companyName.value = client.companyName;
      clientForm.contactEmail.value = client.contactEmail;
      clientForm.projectType.value = client.projectType;
      clientForm.projectLength.value = client.projectLength;
      clientForm.color.value = client.color;
      
      localStorage.setItem('currentId', client.id);
    });

    function deleteUser(id) {
      console.log('delete', id);
      fetch(`${url}/${id}`, { method: 'DELETE' }).then((result) => fetchData());
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
  };

  serverClientObject.companyName = clientForm.companyName.value;
  serverClientObject.contactName = clientForm.contactName.value;
  serverClientObject.contactEmail = clientForm.contactEmail.value;
  serverClientObject.projectType = clientForm.projectType.value;
  serverClientObject.projectLength = clientForm.projectLength.value;
  serverClientObject.color = clientForm.color.value;
  
  const id = localStorage.getItem('currentId');
  if (id) {
    serverClientObject.id = id;
  }
  
  const request = new Request(url, {
    method: serverClientObject.id ? 'PUT' : 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(serverClientObject)
  });
  
  fetch(request).then((response) => {
    fetchData(); 
    
    localStorage.removeItem('currentId');
    clientForm.reset();
    });
  }



