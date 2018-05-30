/* eslint-disable no-undef */
const { signinForm } = document.forms;
const { email, password } = signinForm.elements;
const errorMessage = document.querySelectorAll('.error');

const siginUser = (e) => {
  e.preventDefault();
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
    'https://maintenance-tracker-stv.herokuapp.com/api/v1/auth/login',
    option,
  ).then((response) => {
    if (response.status === 404) {
      alertify.logPosition('bottom right');
      alertify.delay(7000).error('User not found');
    }
    return response.json();
  })
    .then((response) => {
      if (response.status === 'success') {
        localStorage.setItem('token', response.data.token);
        alertify.logPosition('bottom right');
        alertify.delay(5000).success(response.message);
        window.location.href =
        'https://maintenance-tracker-stv.herokuapp.com/create-request.html';
      }

      if (response.message === 'Wrong password') {
        errorMessage[1].innerHTML = response.message;
      }

      if (response.data.errors.email) {
        const [emailError] = response.data.errors.email;
        errorMessage[0].innerHTML = emailError;
      }

      if (response.data.errors.password) {
        const [passwordError] = response.data.errors.password;
        errorMessage[1].innerHTML = passwordError;
      }
    })
    .catch(err => err.message);
};

signinForm.addEventListener('submit', siginUser);
