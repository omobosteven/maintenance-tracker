/* eslint-disable no-undef */
const { signupForm } = document.forms;
const signupBtn = document.getElementById('signupBtn');
const { email, password, confirmPassword } = signupForm.elements;
const errorMessage = document.querySelectorAll('.error');

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
      alertify.logPosition('bottom right');
      alertify.delay(7000).error('User with this email already exist');
    }
    return response.json();
  })
    .then((response) => {
      if (response.status === 'success') {
        localStorage.setItem('token', response.data.token);
        alertify.logPosition('bottom right');
        alertify.delay(5000).success(response.message);
        window.location.href =
        'https://maintenance-tracker-stv.herokuapp.com/user-view-requests.html';
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

signupForm.addEventListener('submit', createAccount);
password.addEventListener('input', checkPassword);
confirmPassword.addEventListener('input', checkPassword);
