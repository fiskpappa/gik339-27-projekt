const url = 'http://localhost:3000/clients';

/* fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((clients) => {
    console.log(clients)
  }); */

window.addEventListener('load', fetchData);

const rgbaColor = colorToRGBA(client.color, 0.3);

function fetchData() {
  fetch(url)
    .then((result) => result.json())
    .then((clients) => {
      if (clients.length > 0) {
        let html = `<ul class="col-12">`;
        clients.forEach((client) => {
          html += `
        <li class="clientCard style="background-color: ${rgbaColor};" col-3">
          <h3 class="colorChanger" style="color: ${client.color};">${client.companyName}</h3>
          <p>Kontaktperson: ${client.contactName} <br> ${client.contactEmail}</p>
          <p>Projekttyp: ${client.projectType}</p>
          <p>Projektlängd: ${client.projectLength} veckor</p>
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

function colorToRGBA(colorName, opacity) {
  const tempElement = do
}

function setCurrentUser(id) {
  console.log('current', id);

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
}

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
  serverClientObject.projectLength = clientForm.projectLength
  serverClientObject.color = clientForm.color.value;
  const id = localStorage.getItem('currentId');
  if (id) {
    serverClientObject.id = id;
  }

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
}