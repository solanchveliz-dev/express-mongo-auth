document.addEventListener('DOMContentLoaded', async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    window.location.href = '/signIn';
    return;
  }

  try {
    const response = await fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      sessionStorage.removeItem('token');
      if (response.status === 403) {
        window.location.href = '/403';
      } else {
        window.location.href = '/signIn';
      }
      return;
    }

    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error(error);
    window.location.href = '/signIn';
  }
});
