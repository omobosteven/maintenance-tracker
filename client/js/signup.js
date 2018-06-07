/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const errorMessage = document.querySelectorAll('.error');
const signupBtn = document.getElementById('signupBtn');
const { signupForm } = document.forms;
const { email, password, confirmPassword } = signupForm.elements;

const checkPassword = () => {
  if (confirmPassword.value && (password.value !== confirmPassword.value)) {
    errorMessage[2].innerHTML = 'password does not match';
    signupBtn.disabled = true;
  }

  if (confirmPassword.value === password.value) {
    errorMessage[2].innerHTML = '';
    signupBtn.disabled = false;
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

const createAccount = (e) => {
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
    'https://maintenance-tracker-stv.herokuapp.com/api/v1/auth/signup',
    option,
  ).then((response) => {
    if (response.status === 409) {
      alertLog.style.display = 'block';
      alertLog.classList.add('fail');
      alertMessage.innerText = 'User with this email already exist';
    }
    return response.json();
  })
    .then((response) => {
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

      if (response.data.errors.email) {
        const [emailError] = response.data.errors.email;
        errorMessage[0].style.display = 'block';
        errorMessage[0].innerHTML = emailError;
      }

      if (response.data.errors.password) {
        const [passwordError] = response.data.errors.password;
        errorMessage[1].style.display = 'block';
        errorMessage[1].innerHTML = passwordError;
      }
    })
    .catch(err => err.message);
};

confirmPassword.addEventListener('input', checkPassword);
email.addEventListener('focus', clearErrorMeassage);
password.addEventListener('focus', clearErrorMeassage);
password.addEventListener('input', checkPassword);
signupForm.addEventListener('submit', createAccount);
