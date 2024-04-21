export function setupApp() {

  // Variables
  const mainForm = document.querySelector('#main-form');
  const inputLimit = document.querySelector('#input-limit');
  const msgWarning = document.querySelector('#msg-warning');
  const sectionForm = document.querySelector('#section-form');
  const spanGuests = document.querySelector('#span-guests');
  const spanRemaining = document.querySelector('#span-remaining');
  const inputName = document.querySelector('#input-name');
  const inputNumber = document.querySelector('#input-number');
  const trList = document.querySelector('#tr-list');
  const modalContainer = document.querySelector('#modal-container');
  const modalTitle = document.querySelector('#modal-title');
  const btnDeleteModal = document.querySelector('#btn-delete-modal');
  const btnCancelModal = document.querySelector('#btn-cancel-modal');
  let inputStatus = 3; // Estado de los campos de entrada
  let guest; // Objeto para manejar los invitados

  //-----------------------------------------

  // Events
  eventListeners();
  function eventListeners() {

    mainForm.addEventListener('submit', enterLimit);
    sectionForm.addEventListener('submit', addGuests);

  };

  //-----------------------------------------

  // Class

  // Clase para manejar la lógica relacionada con los invitados
  class Guest {

    constructor(guest) { // Inicializo los valores de las propiedades de la instancia Guest.

      // Inicialización de propiedades
      this.guests = guest; // Límite de invitados
      this.remaining = guest; // Invitados restantes
      this.lists = []; // Lista de invitados

    };

    // Método para agregar un nuevo invitado
    newGuest(guestObject) {

      this.lists = [...this.lists, guestObject]; // Agregar el nuevo invitado a la lista
      this.calculateValues(); // Actualizar los valores relacionados con los invitados

    };

    // Método para calcular los valores relacionados con los invitados
    calculateValues() {

      const currentGuests = this.lists.reduce((accumulated, current) => accumulated + current.number, 0); // Calcular el número total de invitados actuales
      this.remaining = this.guests - currentGuests; // Calcular el número de invitados restantes

      ui.updateValues(currentGuests, this.remaining, this.guests); // Actualizar la interfaz de usuario con los nuevos valores

    };

    // Método para eliminar un invitado
    deleteGuest(id) {

      this.lists = this.lists.filter((list) => list.id !== id); // Filtrar la lista para eliminar el invitado con el ID especificado
      guest.calculateValues(); // Actualizar los valores relacionados con los invitados

    };

  };

  // Clase para manejar la interfaz de usuario
  class UI {

    // Método para mostrar mensajes de advertencia
    warningMessage(message, type) {

      // Agregar clases según el tipo de mensaje
      if (type === 'error') {

        msgWarning.classList.add('message-alert'); // Agregar clase para mensajes de error

      } else {

        msgWarning.classList.add('message-success'); // Agregar clase para mensajes de éxito
        sectionForm.querySelector('button[type="submit"]').setAttribute('disabled', true); // Deshabilitar el botón de envío del formulario

      };

      // Mensaje de error en el HTML
      msgWarning.textContent = message;

      // Quitar mensaje después de 3 segundos
      setTimeout(() => {

        // Dejo un espacio en blanco para mantener el estilo de márgenes y relleno en el lugar de mensajes.
        msgWarning.innerHTML = '&nbsp;';

        if (type === 'error') {

          msgWarning.classList.remove('message-alert');

        } else {

          msgWarning.classList.remove('message-success');
          ui.controllingInputs();

       };

      }, 3000);

    };

    // Método para habilitar los campos y mostrar la cantidad de invitados en la interfaz de usuario
    activateSectionForm(amount) {

      // Destructuring para obtener la cantidad restante de invitados
      const { remaining } = amount;

      spanRemaining.textContent = remaining; // Mostrar la cantidad restante de invitados
      inputLimit.setAttribute('disabled', true); // Deshabilitar el campo de límite de invitados
      mainForm.querySelector('button[type="submit"]').className = '';
      mainForm.querySelector('button[type="submit"]').innerHTML = '';
      ui.controllingInputs(); // Habilitar los campos de entrada del formulario
    };

    // Método para actualizar los valores relacionados con los invitados en la interfaz de usuario
    updateValues(currentGuests, remaining, guests) {

      inputStatus = 3;

      spanGuests.textContent = currentGuests;
      spanRemaining.textContent = remaining;
      let calculation = remaining * 100 / guests; // Calcular el porcentaje de invitados restantes en relación con el límite
      spanRemaining.parentNode.parentNode.className = ''; // Limpiar las clases del elemento abuelo

      // Cambiar el estilo según la cantidad de invitados restantes
      if (remaining < 3) {
        if (remaining == 2) {
          spanRemaining.parentNode.parentNode.classList.add('red', 'size');
        } if (remaining == 1) {
          spanRemaining.parentNode.parentNode.classList.add('text-bold', 'size');
          inputStatus = 1;
        } if (remaining == 0) {
          spanRemaining.parentNode.parentNode.classList.add('text-line-through', 'size');
          inputStatus = 0;
        };      
      }; 
      
      // Estilo para más de 3 invitados restantes
      if (remaining >= 3) {
        if (calculation >= 75) {
          spanRemaining.parentNode.parentNode.classList.add('green', 'size');
        } else if (calculation >= 50) {
          spanRemaining.parentNode.parentNode.classList.add('blue', 'size');
        } else if (calculation >= 25) {
          spanRemaining.parentNode.parentNode.classList.add('yellow', 'size');
        } else if (calculation >= 3) {
          spanRemaining.parentNode.parentNode.classList.add('orange', 'size');
        };
      };

      ui.controllingInputs() // Habilitar los campos de entrada según el estado

    };

    // Método para controlar la disponibilidad de los campos de entrada
    controllingInputs() {

      inputName.value = '';
      inputNumber.value = '';
      inputName.removeAttribute('disabled');
      inputNumber.removeAttribute('disabled');
      sectionForm.querySelector('button[type="submit"]').removeAttribute('disabled');

      // Cambiar la disponibilidad de los campos de entrada según el estado
      if (inputStatus == 1) {
        inputNumber.value = 1;
        inputNumber.setAttribute('disabled', true);
      };

      // Deshabilitar los campos de entrada y el botón de envío del formulario
      if (inputStatus == 0) {
        inputName.setAttribute('disabled', true);
        inputNumber.setAttribute('disabled', true);
        sectionForm.querySelector('button[type="submit"]').setAttribute('disabled', true);
      };

    };

    // Método para agregar la lista de invitados en la interfaz de usuario
    listGuests(lists) {

      this.cleanHTML(); // Limpia el HTML previo antes de agregar los nuevos elementos.

      lists.forEach((list, index) => { // Iterar sobre la lista de invitados y agregar cada uno a la tabla

        const { name, number, id } = list; // Obtener los datos del invitado

        // Creamos el elemento <tr>
        const tr = document.createElement('tr');
        tr.dataset.id = id;

        // Alternamos entre las clases para filas pares e impares
        if (index % 2 === 0) {
          tr.classList.add('bg-slate-100', 'text-slate-500');
        } else {
          tr.classList.add('bg-white', 'text-slate-500');
        };

        tr.innerHTML = `      
          <td class="border border-white rounded-l-lg">
            <button id="trash-btn" class="fa-solid fa-trash-can"></button> 
            ${name}
          </td>
          <td class="border border-white rounded-r-lg">${number}</td>
        `

        // Agregar al HTML
        trList.appendChild(tr);

        // Obtener el botón de eliminación dentro de la fila actual
        const trashBtn = tr.querySelector('#trash-btn');

        trashBtn.onclick = () => {

          ui.overlaysModal(name, id); // Llama a la función que elimina el invitado

        };

      });

    };

    // Método para mostrar el modal de confirmación de eliminación de invitados
    overlaysModal(name, id) {

      modalContainer.classList.remove('hidden'); // Mostrar el modal
      modalTitle.innerHTML = name;

      // Evento al hacer clic en el botón "Cancelar"
      btnCancelModal.onclick = () => {

        modalContainer.classList.add('hidden');

      };

      // Evento al hacer clic en el botón "Eliminar"
      btnDeleteModal.onclick = () => {

        guest.deleteGuest(id);
        modalContainer.classList.add('hidden');

        // Elimina los gastos del HTML
        const { lists, remaining } = guest;
        ui.listGuests(lists, remaining);
        // ui.actualizarRestante(restante);
        // ui.comprobarPresupuesto(presupuesto);

      };

    };

    // Método para limpiar la lista de invitados en la interfaz de usuario
    cleanHTML() {

      while (trList.firstChild) {
        trList.removeChild(trList.firstChild);
      };

    };

  };

  //-----------------------------------------

  // Instances UI  
  const ui = new UI();

  //-----------------------------------------

  // Functions
  function enterLimit(e) {
    e.preventDefault();

    const limit = Number(inputLimit.value);

    // Instances Guest: crear el objeto 'guest' a partir de la clase 'Guest'
    guest = new Guest(limit);

    if (limit <= 0 || isNaN(limit)) {
      ui.warningMessage('El límite de Invitados es inválido', 'error');
      return;

    } else {
      ui.activateSectionForm(guest);
      return;
    };

  };

  function addGuests(e) {
    e.preventDefault();

    const name = inputName.value;
    const number = Number(inputNumber.value);

    // Si 'name' es número (con parseFloat convierto un string a number)
    // y
    // Si el número es mayor que cero
    if (!isNaN(parseFloat(name)) && isFinite(name)) {

      // Mando a llamar al método 'warningMessage' de la clase 'UI', pasándole como parámetro el mensaje del error
      ui.warningMessage('El Nombre del Invitado es inválido', 'error');
      return;

    } else if (number <= 0 || isNaN(number)) {

      // Mando a llamar al método 'warningMessage' de la clase 'UI', pasándole como parámetro el mensaje del error
      ui.warningMessage('El N° de Invitados es inválido', 'error');
      return;

    } else if (number > guest.remaining) {

      // Mando a llamar al método 'warningMessage' de la clase 'UI', pasándole como parámetro el mensaje del error
      ui.warningMessage('El N° de Invitados supera el restante', 'error');
      return;

    };

    // Generar un objeto con el invitado
    // Utilizo object literal para crear un objeto a partir de variables individuales, también llamado sintaxis de asignación
    const guestObject = { name, number, id: Date.now() };

    //Añade un nuevo invitado
    guest.newGuest(guestObject);

    ui.warningMessage(`Los invitados de ${name} se agregaron con éxito`);

    // Listar los invitados
    const { lists } = guest; //Destructuring

    ui.listGuests(lists);

  };

  //-----------------------------------------

};