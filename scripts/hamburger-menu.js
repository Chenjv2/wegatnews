const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent click events from bubbling up to the document
  sidebar.classList.toggle('active');
});

// Optional: Close sidebar when clicking outside of it
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    sidebar.classList.remove('active');
  }
});