function getToken() {
  return sessionStorage.getItem('token');
}

function getRolesFromToken(token) {
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles || [];
  } catch (error) {
    return [];
  }
}

function isAuthenticated() {
  return Boolean(getToken());
}

function clearSession() {
  sessionStorage.removeItem('token');
}

function redirectToDashboardByRole(token) {
  const roles = getRolesFromToken(token);
  if (roles.includes('admin')) {
    window.location.href = '/admin';
  } else {
    window.location.href = '/dashboard';
  }
}

async function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = '/signIn';
    return null;
  }

  return token;
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

function showError(messageElement, text) {
  if (messageElement) {
    messageElement.textContent = text;
  }
}

function showSuccess(messageElement, text) {
  if (messageElement) {
    messageElement.textContent = text;
  }
}
