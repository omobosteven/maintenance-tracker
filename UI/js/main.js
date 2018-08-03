let navToggler = document.getElementById('navbar-toggler');
let navCollapse = document.getElementById('navbar-collapse');

const toggleNav = () => {
  navCollapse.classList.toggle('navbar-show');
}

navToggler.addEventListener('click', toggleNav);
