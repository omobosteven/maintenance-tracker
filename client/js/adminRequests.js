/* eslint-disable no-undef */
const alertLog = document.getElementById('alertLog');
const alertMessage = document.getElementById('alertMessage');
const requestsFilter = document.getElementById('filter');
const requests = document.getElementById('requests');

let allRequests;

const saveIdOnLocalStorage = (e) => {
  const { id } = e.target;

  localStorage.setItem('id', `${parseInt(id, 10)}`);
  window.location.href =
  'https://maintenance-tracker-stv.herokuapp.com/admin-request-details.html';
};

const createNewRequestItem = (request) => {
  const requestList = document.createElement('li');
  const requestLink = document.createElement('a');
  const requestRef = document.createElement('p');
  const requestType = document.createElement('p');
  const requestItem = document.createElement('p');
  const requestStatus = document.createElement('p');

  requestList.addEventListener('click', saveIdOnLocalStorage);

  const { typeId, statusId } = request;
  const requestObject = getText(typeId, statusId);

  requestRef.innerText = `#${request.ref_no}`;
  requestType.innerText = capitalize(requestObject.type);
  requestItem.innerText = capitalize(request.item);
  requestStatus.innerText = capitalize(requestObject.status);

  switch (statusId) {
    case 1:
      requestList.classList.add('request', 'pending');
      requestStatus.className = ('status-pending');
      break;
    case 2:
      requestList.classList.add('request', 'approved');
      requestStatus.className = ('status-approved');
      break;
    case 3:
      requestList.classList.add('request', 'disapproved');
      requestStatus.className = ('status-disapproved');
      break;
    case 4:
      requestList.classList = ('request', 'resolved');
      requestStatus.className = ('status-resolved');
      break;
    default:
  }

  requestLink.className = ('request-item');
  requestLink.setAttribute('id', `${request.requestId}`);

  requestLink.appendChild(requestRef);
  requestLink.appendChild(requestType);
  requestLink.appendChild(requestItem);
  requestLink.appendChild(requestStatus);
  requestList.appendChild(requestLink);

  requests.appendChild(requestList);
};

const filterRequests = () => {
  const filterValue = parseInt(requestsFilter.value, 10);

  requests.innerText = '';

  if (filterValue === 0) {
    allRequests.forEach(request => createNewRequestItem(request));
  } else {
    const filteredRequests =
      allRequests.filter(request => request.statusId === filterValue);

    filteredRequests.forEach(request => createNewRequestItem(request));
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
    'https://maintenance-tracker-stv.herokuapp.com/api/v1/requests',
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
        allRequests = response.data.requests;
        response.data.requests
          .forEach(request => createNewRequestItem(request));
      }
    })
    .catch(err => err.message);
};

requestsFilter.addEventListener('change', filterRequests);
