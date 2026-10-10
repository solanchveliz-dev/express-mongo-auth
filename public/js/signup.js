document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: document.getElementById('name').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      birthdate: document.getElementById('birthdate').value,
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    };

    const message = document.getElementById('message');

    try {
      const response = await fetch('/api/auth/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        message.textContent = data.message || 'No se pudo completar el registro.';
        return;
      }

      window.location.href = '/signIn';
    } catch (error) {
      message.textContent = 'Error de conexión con el servidor.';
    }
  });
});
