/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const errorMessage = document.querySelectorAll('.error');
const { signupForm } = document.forms;
const { email, password, confirmPassword } = signupForm.elements;

const displayConfirmPasswordError = () => {
  errorMessage[2].classList.add('display-error');
  errorMessage[2].innerHTML = 'password does not match';
};

const displayErrorMessages = (error) => {
  if (error.email) {
    const [emailError] = error.email;
    errorMessage[0].classList.add('display-error');
    errorMessage[0].innerHTML = emailError;
  }

  if (error.password) {
    const [passwordError] = error.password;
    errorMessage[1].classList.add('display-error');
    errorMessage[1].innerHTML = passwordError;
  }
};

const clearErrorMeassage = (e) => {
  e.target.parentElement.nextElementSibling.innerText = '';
  e.target.parentElement.nextElementSibling.classList.remove('display-error');
};

const redirectUser = () => {
  window.location.href =
  'https://maintenance-tracker-stv.herokuapp.com/user-view-requests.html';
};

const createAccount = (e) => {
  e.preventDefault();
  if (password.value === confirmPassword.value) {
    const userDetails = {
      email: email.value,
      password: password.value,
    };

    const option = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    fetch(
      'https://maintenance-tracker-stv.herokuapp.com/api/v1/auth/signup',
      option,
    ).then((response) => {
      if (response.status === 409) {
        alertLog.style.display = 'block';
        alertLog.classList.add('fail');
        alertMessage.innerText = 'User with this email already exist';
        clearMessage();
      }
      return response.json();
    })
      .then((response) => {
        if (response.status === 'success') {
          const username = response.data.email;
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', username.slice(0, username.indexOf('@')));
          alertLog.style.display = 'block';
          alertLog.classList.add('success');
          alertMessage.innerText = response.message;
          clearMessage();
          redirectUser();
        }

        if (response.status === 'fail') {
          displayErrorMessages(response.data.errors);
        }
      })
      .catch(err => err.message);
  } else {
    displayConfirmPasswordError();
  }
};

confirmPassword.addEventListener('input', clearErrorMeassage);
email.addEventListener('focus', clearErrorMeassage);
password.addEventListener('focus', clearErrorMeassage);
signupForm.addEventListener('submit', createAccount);
