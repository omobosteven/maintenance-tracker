/* eslint-disable no-undef, no-unused-vars */
const logout = document.getElementById('logout');
const navToggler = document.getElementById('navbar-toggler');
const navCollapse = document.getElementById('navbar-collapse');

const capitalize = text => text[0].toUpperCase().concat(text.slice(1));

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
