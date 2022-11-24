const estados = ['#f73131','#f78d31','#f7d931','#39d12e'];

const createElements = () => {
  let elements = {};
  elements.tr = document.createElement("tr");
  elements.td1 = document.createElement("td");
  elements.td2 = document.createElement("td");
  elements.td3 = document.createElement("td");
  elements.td4 = document.createElement("td");
  elements.td5 = document.createElement("td");
  elements.div = document.createElement("div");
  elements.div2 = document.createElement("div");
  elements.button1 = document.createElement("a");
  elements.button2 = document.createElement("button");

  return elements;
};

const assignClasses = (elements) => {
  elements.tr.classList.add('centrado');
  elements.div.classList.add('d-grid', 'gap-2', 'd-md-block');
  elements.div2.classList.add('rounded-circle','statusDiv','mx-auto');
  elements.button1.classList.add('btn', 'btn-success');    
  elements.button2.classList.add('btn','btn-secondary');    

  return elements;
};

const configElements = (elements,info) => {
  const nameArray = info.Nombre.split(' ')
  // Add data to elements
  elements.td1.textContent = info.Id
  nameArray[2] ? elements.td2.textContent = nameArray[0] + ' ' + nameArray[2] : elements.td2.textContent = nameArray[0]
  elements.td3.textContent = info.Edad ?? '-';
  elements.button1.textContent = 'Ver';
  elements.button1.href = `/panel/${info.Identificacion}`
  if (info.Estado == 0){
    elements.div2.textContent = '-'
    elements.div2.style.backgroundColor = 'transparent'
  } else {
    elements.div2.style.backgroundColor = estados[info.Estado - 1]
  }
  elements.button2.textContent = 'Eliminar';
  elements.button2.type = 'button';

  return elements;
};

const createCertificate = (info) => {
  let elements = createElements();
  elements = assignClasses(elements);
  elements = configElements(elements,info);

  elements['tr'].appendChild(elements['td1']);
  elements['tr'].appendChild(elements['td2']);
  elements['tr'].appendChild(elements['td4']);
  elements['tr'].appendChild(elements['td3']);
  elements['tr'].appendChild(elements['td5']);
  elements['td4'].appendChild(elements['div2']);
  elements['td5'].appendChild(elements['div']);
  elements['div'].appendChild(elements['button1']);
  elements['div'].appendChild(elements['button2']);

  return elements['tr'];
};

const showPatients = async () => {
  const infoContainer = document.getElementById('patientsContainer');

  const fragment = document.createDocumentFragment();

  const response = await fetch('/api/getpatients');
  if (response.status == 200){
      const patients = await response.json();
      for (let i = 0; i < patients.length; i++) {
          const patient = createCertificate(patients[i]);
          fragment.appendChild(patient);
      };
      // Add fragment to DOM
      infoContainer.appendChild(fragment);
  }
};

showPatients();