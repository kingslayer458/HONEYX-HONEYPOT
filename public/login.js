document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-container form');
  if (form) {
    form.addEventListener('submit', e => {
      const btn = form.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Logging in...';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Login';
      }, 2000);
    });
    // Animate container
    document.querySelector('.login-container').style.transform = 'scale(0.85)';
    setTimeout(()=>{
      document.querySelector('.login-container').style.transition = 'transform 1s cubic-bezier(.68,-0.55,.27,1.55)';
      document.querySelector('.login-container').style.transform = 'scale(1)';
    }, 150);
  }
});
