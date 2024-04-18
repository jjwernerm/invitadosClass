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
  let guests;

  //-----------------------------------------

  // Events
  eventListeners();
  function eventListeners() {

    mainForm.addEventListener('submit', enterLimit);
    sectionForm.addEventListener('submit', addGuests);


  };

  //-----------------------------------------

  // Class
  class Guest {

    constructor(guest) {
      this.guest = Number(guest);
      this.remaining = Number(guest);
      this.lists = [];
    };

    newGuest(guestObject) {

      this.lists = [...this.lists,  guestObject];
      // this.calcularRestante();
  
    };

    deleteGuest(id) {

      this.lists = this.lists.filter((list) => list.id !== id );
      // this.calcularRestante();
  
    };

  };

  class UI {

    // Método para habilitar los campos y mostrar la cantidad de invitados en la interfaz de usuario
    activateSectionForm(amount) {

      // Destructuring
      const { guest, remaining } = amount;

      spanGuests.textContent = guest;
      spanRemaining.textContent = remaining
      inputLimit.setAttribute('disabled', true);
      mainForm.querySelector('button[type="submit"]').className = '';
      mainForm.querySelector('button[type="submit"]').innerHTML = '';
      inputName.removeAttribute('disabled');
      inputNumber.removeAttribute('disabled');
      sectionForm.querySelector('button[type="submit"]').removeAttribute('disabled');

  
    };

    warningMessage(message, type) {

      if(type === 'error') {

        msgWarning.classList.add('message-alert');

      } else { 
        
        msgWarning.classList.add('message-success');

      };      

      // Mensaje de error en el HTML
      msgWarning.textContent = message;

      // Quitar mensaje después de 3 segundos
      setTimeout(() => {
        
        // Dejo un espacio en blanco para mantener el estilo de márgenes y relleno en en lugar de mensajes.
        msgWarning.innerHTML = '&nbsp;';

        if (type === 'error') {
          
          msgWarning.classList.remove('message-alert');

        } else {

          msgWarning.classList.remove('message-success');
          inputName.value = '';
          inputNumber.value = '';
        };

      }, 3000);

    };

    listGuests(lists) {

      this.cleanHTML(); // Limpia el HTML previo antes de agregar los nuevos elementos.

      lists.forEach((list, index) => {

        const { name, number, id } = list;

        // Creamos el elemento <tbody>
        const tr = document.createElement('tr');
        tr.dataset.id = id;

        // Alternamos entre las clases para filas pares e impares
        if (index % 2 === 0) {
          tr.classList.add('bg-slate-100', 'text-slate-500');
        } else {
        tr.classList.add('bg-white', 'text-slate-500');
        };

        tr.innerHTML = `      
          <tr>
            <td class="border border-white rounded-l-lg">
              <button id="delete-btn" class="fa-solid fa-trash-can"></button> 
              ${name}
            </td>
            <td class="border border-white rounded-r-lg">${number}</td>
          </tr>
        `     

        // Agregar al HTML
        trList.appendChild(tr);

        // Obtener el botón de eliminación dentro de la fila actual
        const deleteBtn = tr.querySelector('#delete-btn');

        deleteBtn.onclick = () => {

          deleteGuest(id); // Llama a la función que elimina el invitado

        };

      });      

    };

    cleanHTML() {

      while(trList.firstChild) {
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
    guests = new Guest(limit);

    if(limit <= 0 || isNaN(limit)) {
      ui.warningMessage('El límite de Invitados es inválido', 'error');
      return;

    } else {
      ui.activateSectionForm(guests);
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
    if(!isNaN(parseFloat(name)) && isFinite(name)) {

      // Mando a llamar al método 'warningMessage' de la clase 'UI', pasándole como parámetro el mensaje del error
      ui.warningMessage('El Nombre del Invitado es inválido', 'error');
      return;

    } else if(number <= 0 || isNaN(number)) {

      // Mando a llamar al método 'warningMessage' de la clase 'UI', pasándole como parámetro el mensaje del error
      ui.warningMessage('El N° de Invitados es inválido', 'error');
      return;

    };

    // Generar un objeto con el invitado
    // Utilizo object literal para crear un objeto a partir de variables individuales, también llamado sintaxis de asignación
    const guestObject = { name, number, id: Date.now() };

    //Añade un nuevo invitado
    guests.newGuest(guestObject);

    ui.warningMessage(`Los invitados de ${name} se agregaron con éxito`);

    // Listar los invitados
    const { lists } = guests; //Destructuring

    ui.listGuests(lists);

  };

  function deleteGuest(id) {

    // Elimina los gastos del objeto
    guests.deleteGuest(id);
  
    // Elimina los gastos del HTML
    const { lists, restante }  = guests;  
    ui.listGuests(lists);
    // ui.actualizarRestante(restante);
    // ui.comprobarPresupuesto(presupuesto);
  
  };

  //-----------------------------------------

};