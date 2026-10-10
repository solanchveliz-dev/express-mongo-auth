document.addEventListener('DOMContentLoaded', async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '/signIn';
    return;
  }

  const form = document.getElementById('profileForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: document.getElementById('name').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      birthdate: document.getElementById('birthdate').value,
      url_profile: document.getElementById('url_profile').value,
      adress: document.getElementById('adress').value
    };

    const newPassword = document.getElementById('newPassword').value;
    if (newPassword) payload.password = newPassword;

    const response = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      window.location.reload();
    }
  });
});
