/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const errorMessage = document.querySelectorAll('.error');
const { requestForm } = document.forms;
const {
  type, category, requestItem, description,
} = requestForm.elements;
const user = document.getElementById('user');

user.innerText = localStorage.getItem('user');

const createRequest = (e) => {
  e.preventDefault();
  const requestDetails = {
    type: type.value,
    category: category.value,
    item: requestItem.value,
    description: description.value,
  };

  const token = localStorage.getItem('token');

  const option = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(requestDetails),
  };

  fetch(
    'https://maintenance-tracker-stv.herokuapp.com/api/v1/users/requests',
    option,
  ).then((response) => {
    if (response.status === 409) {
      alertLog.style.display = 'block';
      alertLog.classList.add('fail');
      alertMessage.innerText = 'request already exist';
    }

    return response.json();
  })
    .then((response) => {
      if (response.status === 'success') {
        alertLog.style.display = 'block';
        alertLog.classList.remove('fail');
        alertLog.classList.add('success');
        alertMessage.innerText = response.message;
        window.location.href =
        'https://maintenance-tracker-stv.herokuapp.com/user-view-requests.html';
      }

      if (response.data.errors.type) {
        const [typeError] = response.data.errors.type;
        errorMessage[0].innerHTML = typeError;
      }

      if (response.data.errors.category) {
        const [categoryError] = response.data.errors.category;
        errorMessage[1].innerHTML = categoryError;
      }

      if (response.data.errors.item) {
        const [itemError] = response.data.errors.item;
        errorMessage[2].innerHTML = itemError;
      }

      if (response.data.errors.description) {
        const [descriptionError] = response.data.errors.description;
        errorMessage[3].innerHTML = descriptionError;
      }
    })
    .catch(err => err.message);
};

requestForm.addEventListener('submit', createRequest);
