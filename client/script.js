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
        <li class="clientCard shadow col-sm-12 col-md-5 col-xl-3 rounded-4 bg-light" style="background: linear-gradient(to top left, ${client.color},rgba(247, 255, 255, 0.63));">
          <h3 class="mt-2 colorChanger fw-bold" style="color:rgb(61, 58, 59);">${client.companyName}</h3>
          <div class="infoContainer mb-2">
          <p class="mb-0" style="color:rgb(61, 58, 59);"><b>Kontaktperson:</b></p> 
          <p class="mb-2" style="color:rgb(61, 58, 59);">${client.contactName}</p>  
          <p class="mb-0" style="color:rgb(61, 58, 59);"><b>Email:</b></p> 
          <p class="mb-2" style="color:rgb(61, 58, 59);">${client.contactEmail}</p>
          <p class="mb-0" style="color:rgb(61, 58, 59);"><b>Projekttyp:</b></p>
          <p class="mb-2" style="color:rgb(61, 58, 59);">${client.projectType}</p>
          <p class="mb-0" style="color:rgb(61, 58, 59);"><b>Projektlängd:</b></p>
          <p class="mb-2" style="color:rgb(61, 58, 59);">${client.projectLength} veckor</p>
          </div>
          <div class="d-flex mt-auto mb-3">
            <button class="button ms-auto btn rounded-3 bg-white" onclick="setCurrentClient(${client.id}); scrollToSection('formSection');">Ändra</button>
            <button data-bs-toggle="modal" data-bs-target="#actionModal" class="button btn ms-3 rounded-3 bg-white bg-opacity-90 text-danger text-opacity-50" onclick="deleteClient(${client.id}), e">Ta bort</button>
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

// Funktion för att hantera bilduppladdning och visa förhandsvisning
document.getElementById('projectImage').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Här sätts bildens källa och den visas som en image cap i kortet
      const previewImage = document.getElementById('previewImage');
      previewImage.src = e.target.result;  // Sätt bildens källa
      previewImage.style.display = 'block'; // Visa bilden
    }

    reader.readAsDataURL(file);  // Läs in filen och konvertera till en data-URL
  }
});

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

function deleteClient(id) {
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
      } else {
        console.error('Det blev ett fel när du försökte ändra clienten');
      }
    })
    .catch((error) => console.error('Det blev ett fel när du skickade in formuläret:', error));
  }

  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
