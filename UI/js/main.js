let navToggler = document.getElementById('navbar-toggler');
let navCollapse = document.getElementById('navbar-collapse');
let submitBtn = document.getElementById('submitBtn');

const toggleNav = () => {
  console.log('clicked');
  navCollapse.classList.toggle('navbar-show');
}

navToggler.addEventListener('click', toggleNav);
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
});
