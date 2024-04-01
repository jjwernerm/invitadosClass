export function setupApp() {

  // Variables
  const mainForm = document.querySelector('#main-form');
  const inputAmount = document.querySelector('#input-amount');
  const warningMessage = document.querySelector('#warning-message');
  const sectionForm = document.querySelector('#section-form');
  const spanGuests = document.querySelector('#span-guests');
  const spanRemaining = document.querySelector('#span-remaining');
  const inputName = document.querySelector('#input-name');
  const inputNumber = document.querySelector('#input-number');
  let guests;

  //-----------------------------------------

  // Events
  eventListeners();
  function eventListeners() {

    mainForm.addEventListener('submit', enterGuests);
    sectionForm.addEventListener('submit', addGuests);


  };

  //-----------------------------------------

  // Class
  class Guests {

    constructor(guests) {
      this.guests = Number(guests);
      this.remaining = Number(guests);
      this.total = [];
    };
  };

  class UI {

    // Método para habilitar los campos y mostrar la cantidad de invitados en la interfaz de usuario
    activateSectionForm(amount) {

      // Destructuring
      const { guests, remaining } = amount;

      spanGuests.textContent = guests;
      spanRemaining.textContent = remaining
      inputAmount.setAttribute('disabled', true);    
      inputName.removeAttribute('disabled');
      inputNumber.removeAttribute('disabled');
  
    };

    warningMessage(message, type) {
      
      if(type === 'error') {

        warningMessage.classList.add('bg-red-100', 'text-red-500', 'rounded-md');

      } else {

        warningMessage.classList.add('bg-green-100', 'text-green-500', 'rounded-md');

      };

      // Mensaje de error en el HTML
      warningMessage.textContent = message;

      // Quitar mensaje de error en el HTML
      // setTimeout(() => {
      //   warningMessage.innerHTML = '&nbsp;';
      //   warningMessage.classList.remove('bg-red-100', 'bg-green-100');
      //   warningMessage.remove();
      // }, 3000);

    };

  };

  //-----------------------------------------

  // Instances UI  
  const ui = new UI();  

  //-----------------------------------------

  // Functions
  function enterGuests(e) {
    e.preventDefault();

    const amount = Number(inputAmount.value);

    // Instances Guest: crear el objeto 'guest' a partir de la clase 'Guest'
    guests = new Guests(amount);

    if(amount <= 0 || isNaN(amount)) {
      console.log('La Cantidad de Invitados es inválida');
    } else {
      ui.activateSectionForm(guests);
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

      ui.warningMessage(`Los invitados de ${name} se agregaron con éxito`);


  };

  //-----------------------------------------

};