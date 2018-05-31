/* eslint-disable no-undef */
const { requestForm } = document.forms;
const {
  type, category, requestItem, description,
} = requestForm.elements;
const errorMessage = document.querySelectorAll('.error');

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
  ).then(response =>
    response.json())
    .then((response) => {
      if (response.status === 'success') {
        alertify.logPosition('bottom right');
        alertify.delay(5000).success(response.message);
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
