/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const cancelBtn = document.getElementById('cancelUpdate');
const errorMessage = document.querySelectorAll('.error');
const { requestForm } = document.forms;
const {
  type, category, requestItem, description,
} = requestForm.elements;
const user = document.getElementById('user');
const id = localStorage.getItem('id');
const token = localStorage.getItem('token');
const detailUrl =
'https://maintenance-tracker-stv.herokuapp.com/user-request-details.html';

user.innerText = localStorage.getItem('user');

const modifyRequest = (e) => {
  e.preventDefault();
  const requestDetails = {
    type: type.value,
    category: category.value,
    item: requestItem.value,
    description: description.value,
  };

  const option = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(requestDetails),
  };

  fetch(
    `https://maintenance-tracker-stv.herokuapp.com/api/v1/users/requests/${id}`,
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
        window.location.href = detailUrl;
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

const loadCurrentDetails = () => {
  const option = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': token,
    },
  };

  fetch(
    `https://maintenance-tracker-stv.herokuapp.com/api/v1/users/requests/${id}`,
    option,
  ).then((response) => {
    if (response.status === 404) {
      alertLog.style.display = 'block';
      alertLog.classList.add('fail');
      alertMessage.innerText = 'No request was found';
    }
    return response.json();
  })
    .then((response) => {
      if (response.status === 'success') {
        const { request } = response.data;
        type.value = request.type;
        category.value = request.category;
        requestItem.value = request.item;
        description.value = request.description;
      }
    })
    .catch(err => err.message);
};

const cancelUpdate = () => {
  window.location.href = detailUrl;
};

requestForm.addEventListener('submit', modifyRequest);
cancelBtn.addEventListener('click', cancelUpdate);
