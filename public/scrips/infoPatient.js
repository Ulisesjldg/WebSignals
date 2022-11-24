const url = window.location.pathname;
const id = url.split('/').pop();
const element = document.getElementById('identificacionInput')
element ? element.value = id : null
const loadPatientData = async () => {
  const response = await fetch(`/api/getpatient/${id}`);
    
    if (response.status == 200){
        const userData = await response.json();
        $('identificacion').innerHTML = `<b>Identificación:</b> ${userData.Identificacion}`
        $('nombre').innerHTML = `<b>Nombre:</b> ${userData.Nombre}`
        $('sexo').innerHTML = `<b>Genero:</b> ${userData.Sexo}`
        $('fecha_nacimiento').innerHTML = `<b>Fecha de nacimiento:</b> ${userData.Fecha_De_Nacimiento.split('T').join(' ').split('.')[0]}`
        $('ciudad').innerHTML = `<b>Ciudad:</b> ${userData.Ciudad}`
        $('direccion').innerHTML = `<b>Direccion:</b> ${userData.Direccion}`
        $('telefono').innerHTML = `<b>Telefono:</b> ${userData.Telefono}`
        $('eps').innerHTML = `<b>Eps:</b> ${userData.Eps}`
        $('estatura').innerHTML = `<b>Estatura:</b> ${userData.Estatura}`
        $('peso').innerHTML = `<b>Peso:</b> ${userData.Peso} Kg`
        $('antecedentes').innerHTML = `<b>Antecedentes:</b> ${userData.Antecedentes_Clinicos}`

    }   
}

loadPatientData()