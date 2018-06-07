/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const displayCard = document.getElementById('cardDetails');
const modifyLink = document.getElementById('editLink');
const requestRefNumber = document.getElementById('reqRef');
const requestType = document.getElementById('reqType');
const requestCategory = document.getElementById('reqCat');
const requestItem = document.getElementById('reqItem');
const requestDescription = document.getElementById('reqDes');
const requestStatus = document.getElementById('requestStatus');
const user = document.getElementById('user');

user.innerText = localStorage.getItem('user');
const id = localStorage.getItem('id');

const generateRequestDetails = (request) => {
  requestRefNumber.innerText = request.ref_no;
  requestType.innerText = request.type;
  requestCategory.innerText = request.category;
  requestItem.innerText = request.item;
  requestDescription.innerText = request.description;
  displayCard.style.display = 'flex';
  requestStatus.parentElement.style.display = 'block';

  switch (request.status) {
    case 'pending':
      requestStatus.className = ('req-pending');
      requestStatus.innerText = 'Pending';
      modifyLink.style.display = 'block';
      break;
    case 'approved':
      requestStatus.className = 'req-approved';
      requestStatus.innerText = 'Approved';
      break;
    case 'disapproved':
      requestStatus.className = 'req-reject';
      requestStatus.innerText = 'Dispproved';
      break;
    case 'resolved':
      requestStatus.className = 'req-resolved';
      requestStatus.innerText = 'Resolved';
      break;
    default:
  }
};

window.onload = () => {
  const token = localStorage.getItem('token');
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
        generateRequestDetails(response.data.request);
      }
    })
    .catch(err => err.message);
};
