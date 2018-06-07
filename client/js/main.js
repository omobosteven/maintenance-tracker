/* eslint-disable no-undef */
const logout = document.getElementById('logout');
const navToggler = document.getElementById('navbar-toggler');
const navCollapse = document.getElementById('navbar-collapse');

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
