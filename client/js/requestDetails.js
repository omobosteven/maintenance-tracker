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
  const { typeId, statusId } = request;
  const requestObject = getText(typeId, statusId);

  requestRefNumber.innerText = request.ref_no;
  requestType.innerText = capitalize(requestObject.type);
  requestCategory.innerText = capitalize(request.category);
  requestItem.innerText = capitalize(request.item);
  requestDescription.innerText = capitalize(request.description);
  requestStatus.innerText = capitalize(requestObject.status);
  displayCard.style.display = 'flex';
  requestStatus.parentElement.style.display = 'block';

  switch (statusId) {
    case 1:
      requestStatus.className = ('request-pending');
      modifyLink.style.display = 'block';
      break;
    case 2:
      requestStatus.className = 'request-approved';
      break;
    case 3:
      requestStatus.className = 'request-disapproved';
      break;
    case 4:
      requestStatus.className = 'request-resolved';
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
      clearMessage();
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
