/* eslint-disable no-undef, no-unused-vars */
const logout = document.getElementById('logout');
const navToggler = document.getElementById('navbar-toggler');
const navCollapse = document.getElementById('navbar-collapse');

const capitalize = text => text[0].toUpperCase().concat(text.slice(1));

const clearMessage = () => {
  window.setTimeout(() => {
    alertLog.classList.remove('fail');
    alertLog.classList.remove('success');
    alertLog.style.display = 'none';
  }, 3000);
};

const getText = (typeId, statusId) => {
  const requestText = {};

  switch (typeId) {
    case 1:
      requestText.type = 'repair';
      break;
    case 2:
      requestText.type = 'maintenance';
      break;
    default:
  }

  switch (statusId) {
    case 1:
      requestText.status = 'pending';
      break;
    case 2:
      requestText.status = 'approved';
      break;
    case 3:
      requestText.status = 'disapproved';
      break;
    case 4:
      requestText.status = 'resolved';
      break;
    default:
  }

  return requestText;
};

const toggleNav = () => {
  navCollapse.classList.toggle('navbar-show');
};

const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('id');
};

navToggler.addEventListener('click', toggleNav);
logout.addEventListener('click', logoutUser);
