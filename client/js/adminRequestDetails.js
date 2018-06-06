/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const btnApprove = document.getElementById('approveBtn');
const btnDisapprove = document.getElementById('disapproveBtn');
const btnResolve = document.getElementById('resolveBtn');
const displayCard = document.getElementById('cardDetails');
const requestRefNumber = document.getElementById('reqRef');
const requestUser = document.getElementById('reqUser');
const requestType = document.getElementById('reqType');
const requestCategory = document.getElementById('reqCat');
const requestItem = document.getElementById('reqItem');
const requestDescription = document.getElementById('reqDes');

const id = localStorage.getItem('id');
const token = localStorage.getItem('token');

const generateRequestDetails = (request) => {
  requestRefNumber.innerText = request.ref_no;
  requestUser.innerText = request.email;
  requestType.innerText = request.type;
  requestCategory.innerText = request.category;
  requestItem.innerText = request.item;
  requestDescription.innerText = request.description;
  displayCard.style.display = 'flex';

  switch (request.status) {
    case 'pending':
      btnApprove.disabled = false;
      btnDisapprove.disabled = false;
      btnResolve.disabled = true;
      break;
    case 'approved':
      btnApprove.disabled = true;
      btnDisapprove.disabled = false;
      btnResolve.disabled = false;
      break;
    case 'disapproved':
      btnApprove.disabled = false;
      btnDisapprove.disabled = true;
      btnResolve.disabled = true;
      break;
    case 'resolved':
      btnApprove.disabled = true;
      btnDisapprove.disabled = true;
      btnResolve.disabled = true;
      break;
    default:
  }
};

const getRequestDetails = () => {
  const option = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': token,
    },
  };

  fetch(
    `https://maintenance-tracker-stv.herokuapp.com/api/v1/requests/${id}`,
    option,
  ).then((response) => {
    if (response.status === 404) {
      alertLog.style.display = 'block';
      alertLog.classList.add('fail');
      alertMessage.innerText = 'Request not found';
    }
    return response.json();
  })
    .then((response) => {
      if (response.status === 'success') {
        generateRequestDetails(response.data.request);
      }
    })
    .catch(err => err.message);
};

const something = (e) => {
  const urlOption = e.target.title;
  const url =
  `https://maintenance-tracker-stv.herokuapp.com/api/v1/requests/${id}/${urlOption}`;

  const option = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': token,
    },
  };

  fetch(url, option)
    .then(response => response.json())
    .then((response) => {
      if (response.status === 'success') {
        alertLog.style.display = 'block';
        alertLog.classList.remove('fail');
        alertLog.classList.add('success');
        alertMessage.innerText = response.message;
        generateRequestDetails(response.data.request);
      }

      if (response.status === 'fail') {
        alertLog.style.display = 'block';
        alertLog.classList.add('fail');
        alertMessage.innerText = response.message;
      }
    })
    .catch(err => err.message);
};

btnApprove.addEventListener('click', something);
btnDisapprove.addEventListener('click', something);
btnResolve.addEventListener('click', something);
