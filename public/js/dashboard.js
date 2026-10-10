document.addEventListener('DOMContentLoaded', async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '/signIn';
    return;
  }

  try {
    const response = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      sessionStorage.removeItem('token');
      window.location.href = '/signIn';
      return;
    }

    const user = await response.json();
    document.getElementById('userName').textContent = user.name || 'usuario';
  } catch (error) {
    sessionStorage.removeItem('token');
    window.location.href = '/signIn';
  }
});
