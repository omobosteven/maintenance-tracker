/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const errorMessage = document.querySelectorAll('.error');
const { signinForm } = document.forms;
const { email, password } = signinForm.elements;

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
      alertLog.style.display = 'block';
      alertLog.classList.add('fail');
      alertMessage.innerText = 'User not found';
    }
    return response.json();
  })
    .then((response) => {
      if (response.message === 'Wrong password entered') {
        alertLog.style.display = 'block';
        alertLog.classList.add('fail');
        alertMessage.innerText = 'Wrong password';
      }

      if (response.status === 'success') {
        const username = response.data.email;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', username.slice(0, username.indexOf('@')));
        alertLog.style.display = 'block';
        alertLog.classList.remove('fail');
        alertLog.classList.add('success');
        alertMessage.innerText = response.message;
      }

      const adminLink =
      'https://maintenance-tracker-stv.herokuapp.com/admin-view-requests.html';
      const userLink =
      'https://maintenance-tracker-stv.herokuapp.com/user-view-requests.html';

      switch (response.data.role) {
        case 'admin':
          window.location.href = adminLink;
          break;
        case 'user':
          window.location.href = userLink;
          break;
        default:
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
