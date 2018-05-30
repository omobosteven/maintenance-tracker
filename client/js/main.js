const navToggler = document.getElementById('navbar-toggler');
const navCollapse = document.getElementById('navbar-collapse');

const toggleNav = () => {
  navCollapse.classList.toggle('navbar-show');
};

navToggler.addEventListener('click', toggleNav);
