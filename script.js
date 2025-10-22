let firebaseConfig = { // Objeto de conexión
    apiKey: "AIzaSyB9pXcMFfhfAQIHUKgY-0uJ_GymlsfmiLk",
    authDomain: "fir-web-e6114.firebaseapp.com",
    projectId: "fir-web-e6114",
    storageBucket: "fir-web-e6114.firebasestorage.app",
    messagingSenderId: "52533220535",
    appId: "1:52533220535:web:9247805c509834fdb6a932"
}

firebase.initializeApp(firebaseConfig) // Inicializaar app Firebase

const db = firebase.firestore() // db representa mi BBDD //inicia Firestore

// Create element
const createContact = (contact) => {
  db.collection("contacts")
    .add(contact)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id)
      printUser(contact.name, contact.email, contact.message, contact.urlImg, docRef.id)
    })
    .catch((error) => console.error("Error adding document: ", error))
};

// Create
document.getElementById("contact").addEventListener("submit", (event) => {
  // Evitar comportamiento por defecto del formulario
    event.preventDefault()
    // Capturar valores del usuario
    const name = event.target.name.value.trim()
    const email = event.target.email.value.trim()
    const message = event.target.message.value.trim()
    const urlImg = event.target.urlImg.value.trim()
    // Validar campos
  if (!name || !email || !message || !urlImg) {
    alert("Hay un campo vacio. No se ha salvado")
    return
}
  // Añadir al elemento los valores
  createContact({
    name,
    email,
    message,
    urlImg
  })
  // Resetear formulario
  event.target.reset()
})

// Pintar Usuario en el DOM
const printUser = (name, email, message, urlImg, id) => {

  const formDiv = document.getElementById("form-contact")
  // Elemento artículo de usuario
  let card = document.createElement("article")
  card.className = "user-card"

  let elementName = document.createElement("h3")
  elementName.innerHTML = name

  let elementEmail = document.createElement("p")
  elementEmail.innerHTML = email

  let elementMsg = document.createElement("p")
  elementMsg.innerHTML = message

  let elementImg = document.createElement("img")
  elementImg.src = urlImg

  let elementId = document.createElement("id")
  elementId.innerHTML = id

  // Añadir elementos al Article creado
  card.appendChild(elementName)
  card.appendChild(elementEmail)
  card.appendChild(elementMsg)
  card.appendChild(elementImg)
  card.appendChild(elementId)
  formDiv.appendChild(card)
}

// Pintar usuarios de Firestore
const readAllUsers = () => {
  const formDiv = document.getElementById("form-contact")

  // Limpiar div
  formDiv.innerHTML = ""

  db.collection("contacts")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      printUser(doc.data().name, doc.data().email, doc.data().message, doc.data().urlImg, doc.id)
    })
  })
  .catch(() => console.log("Error leyendo contactos"))
}

// Borrar contacto especifico
const deleteContact = () => {
  const id = prompt("Introduce el id para borrar contacto")
  db.collection("contacts").doc(id).delete()
  .then(() => {
    alert(`El usuario ${id} ha sido borrado.`)
    document.getElementById("form-contact").innerHTML = ""
    readAllUsers()
  })
  .catch(() => {
    alert(`El usuario ${id} no se ha podido borrar.`)
  })
}

// Evento para eliminar contacto especifico
document.getElementById("delete").addEventListener("click", () => {
  deleteContact()
})

// Borrar todos los contactos
const deleteAllContact = () => {
  // Seleccionamos contactos y consultamos a Firestore para traer los contactos
  db.collection("contacts").get()
  .then((allContacts) => {
    // Array para guardar las promesas de delete de cada contacto
    const deleteContact = []
    // Recorrer cada documento 
    allContacts.forEach((doc) => {
      // Eliminar documento específico y guardar en la variable
      deleteContact.push(doc.ref.delete())
    })
    // Esperar a que todas las promesas terminen
    Promise.all(deleteContact)
    .then(() => {
      alert(`Todos los usuarios han sido borrados con éxito!`)
      // Limpiar el DOM
      document.getElementById("form-contact").innerHTML = ""
    })
    .catch(() => {
      alert(`No se han podido borrar todos los contactos`)
    })
  })
    .catch(() => {
      alert(`No se han podido borrar todos los contactos`)
    })
}

// Evento para eliminar todos los contactos
document.getElementById("delete-all").addEventListener("click", () => {
  deleteAllContact()
})


// Evento para mostrar el DOM al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  readAllUsers();
})
