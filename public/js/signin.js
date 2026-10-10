document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signinForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
      const response = await fetch('/api/auth/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        message.textContent = data.message || 'No se pudo iniciar sesión.';
        return;
      }

      sessionStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      message.textContent = 'Error de conexión con el servidor.';
    }
  });
});
