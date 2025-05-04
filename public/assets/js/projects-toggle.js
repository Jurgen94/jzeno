document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.project-toggle');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.project-card');
        card.classList.toggle('expanded');
      });
    });
  });