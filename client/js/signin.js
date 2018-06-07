/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const errorMessage = document.querySelectorAll('.error');
const { signinForm } = document.forms;
const { email, password } = signinForm.elements;

const displayErrorMessages = (error) => {
  if (error.email) {
    const [emailError] = error.email;
    errorMessage[0].style.display = 'block';
    errorMessage[0].innerHTML = emailError;
  }

  if (error.password) {
    const [passwordError] = error.password;
    errorMessage[1].style.display = 'block';
    errorMessage[1].innerHTML = passwordError;
  }
};

const clearErrorMeassage = (e) => {
  e.target.parentElement.nextElementSibling.style.display = 'none';
};

const redirectUser = (userRole) => {
  const adminLink =
  'https://maintenance-tracker-stv.herokuapp.com/admin-view-requests.html';
  const userLink =
  'https://maintenance-tracker-stv.herokuapp.com/user-view-requests.html';

  switch (userRole) {
    case 'admin':
      window.location.href = adminLink;
      break;
    case 'user':
      window.location.href = userLink;
      break;
    default:
  }
};

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

      redirectUser(response.data.role);

      if (response.status === 'fail') {
        displayErrorMessages(response.data.errors);
      }
    })
    .catch(err => err.message);
};

email.addEventListener('focus', clearErrorMeassage);
password.addEventListener('focus', clearErrorMeassage);
signinForm.addEventListener('submit', siginUser);
