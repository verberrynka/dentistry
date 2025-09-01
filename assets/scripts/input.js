document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");

  const phoneLength = 18; 

  //nameInput
  nameInput.dataset.interacted = 'false';

  nameInput.addEventListener('input', () => {
    nameInput.dataset.interacted = 'true';
    if (nameInput.validity.valid) {
      nameInput.classList.remove('form__input--invalid');
    }
  });

  nameInput.addEventListener('blur', () => {
    if (nameInput.dataset.interacted === 'true') {
      if (!nameInput.validity.valid) {
        nameInput.classList.add('form__input--invalid');
      } else {
        nameInput.classList.remove('form__input--invalid');
      }
    }
  });

  nameInput.addEventListener('invalid', () => {
    nameInput.dataset.interacted = 'true';
    nameInput.classList.add('form__input--invalid');
  });

  nameInput.addEventListener('focus', () => {
    if (nameInput.value.trim() === '' && nameInput.dataset.interacted === 'false' && nameInput.classList.contains('form__input--invalid')) {
      nameInput.classList.remove('form__input--invalid');
    }
  });


  //phone
  function applyPhoneMask(input) {
    let value = input.value.replace(/\D/g, '');

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = '+7 (';
      if (value.length > 1) {
        formattedValue += value.substring(1, 4);
      }
      if (value.length >= 4) {
        formattedValue += ') ';
      }
      if (value.length > 4) {
        formattedValue += value.substring(4, 7);
      }
      if (value.length > 7) {
        formattedValue += '-';
        formattedValue += value.substring(7, 9);
      }
      if (value.length > 9) {
        formattedValue += '-';
        formattedValue += value.substring(9, 11);
      }
    }
    input.value = formattedValue;
  }

  //phoneInput
  phoneInput.addEventListener('focus', function() {
    this.classList.remove('form__input--invalid');
    if (this.value.trim() === '') {
      this.value = '+7 (';
    }
    
    if (this.value === '+7 (') {
      this.setSelectionRange(this.value.length, this.value.length);
    }
  });

  phoneInput.addEventListener("input", function() {
    phoneInput.setCustomValidity('');
    applyPhoneMask(this);
    if (this.value.length > 3) {
        this.classList.remove('form__input--invalid');
    }
  });

  phoneInput.addEventListener('blur', function() {
    if (this.value === '+7 (') {
      this.value = '';
    }

    if (this.value.length > 0 && this.value.length < phoneLength) {
      this.classList.add('form__input--invalid');
      this.setCustomValidity('Пожалуйста, введите полный номер телефона.');
    } else {
      this.classList.remove('form__input--invalid');
      this.setCustomValidity('');
    }
  });

  //submit
  form.addEventListener('submit', (event) => {
    let formIsValid = true;

    //check nameInput
    if (!nameInput.validity.valid) {
      nameInput.classList.add('form__input--invalid');
      formIsValid = false;
    } else {
      nameInput.classList.remove('form__input--invalid');
    }

    //check phoneInput
    if (phoneInput.value.length > 0 && phoneInput.value.length < phoneLength) {
      phoneInput.classList.add('form__input--invalid');
      phoneInput.setCustomValidity('Пожалуйста, введите полный номер телефона.');
      formIsValid = false;
    } else {
      phoneInput.classList.remove('form__input--invalid');
      phoneInput.setCustomValidity('');
    }

    if (!formIsValid) {
      event.preventDefault();
    }
  });
});