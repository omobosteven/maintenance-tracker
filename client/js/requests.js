/* eslint-disable no-undef */
const requests = document.getElementById('requests');
const user = document.getElementById('user');

const saveIdOnLocalStorage = (e) => {
  let { id } = e.target;
  if (e.target.localName === 'p') {
    id = e.target.parentElement.id;
  }

  localStorage.setItem('id', `${parseInt(id, 10)}`);
  window.location.href =
  'https://maintenance-tracker-stv.herokuapp.com/user-request-details.html';
};

const createNewRequestItem = (request) => {
  const requestList = document.createElement('li');
  const requestLink = document.createElement('a');
  const requestId = document.createElement('p');
  const requestType = document.createElement('p');
  const requestItem = document.createElement('p');
  const requestStatus = document.createElement('p');

  requestList.addEventListener('click', saveIdOnLocalStorage, false);

  requestId.innerText = `#${request.requestid}`;
  requestType.innerText = request.type;
  requestItem.innerText = request.item;
  requestStatus.innerText = request.status;

  const { status } = request;
  switch (status) {
    case 'pending':
      requestList.className = ('new-request');
      requestStatus.className = ('status-new');
      break;
    case 'approved':
      requestList.className = ('pending');
      requestStatus.className = ('status-pending');
      break;
    case 'disaproved':
      requestList.className = ('rejected');
      requestStatus.className = ('status-rejected');
      break;
    case 'resolved':
      requestList.className = ('resolved');
      requestStatus.className = ('status-resolved');
      break;
    default:
  }

  requestLink.className = ('request-item');
  requestLink.setAttribute('id', `${request.requestid}`);

  requestLink.appendChild(requestId);
  requestLink.appendChild(requestType);
  requestLink.appendChild(requestItem);
  requestLink.appendChild(requestStatus);
  requestList.appendChild(requestLink);

  requests.appendChild(requestList);
};

const getRequests = () => {
  const token = localStorage.getItem('token');

  const option = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'x-access-token': token,
    },
  };

  fetch(
    'https://maintenance-tracker-stv.herokuapp.com/api/v1/users/requests',
    option,
  ).then(response =>
    response.json())
    .then((response) => {
      if (response.status === 'success') {
        response.data.requests
          .forEach(request => createNewRequestItem(request));
        const username = response.data.user;
        localStorage.setItem('user', username.slice(0, username.indexOf('@')));
        user.innerText = localStorage.getItem('user');
      }
    })
    .catch(err => err.message);
};

