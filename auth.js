const GOOGLE_CLIENT_ID = '298516381649-m3unp54osbhl1rhjaibrigea30femfo5.apps.googleusercontent.com';
const ALLOWED_DOMAIN = 'alpha-affiliates.com';

function checkAuth() {
  const session = sessionStorage.getItem('aa_auth');
  if (session) {
    try {
      const data = JSON.parse(session);
      if (data.email && data.email.endsWith('@' + ALLOWED_DOMAIN)) {
        showApp(data);
        return;
      }
    } catch(e) {}
  }
  showLogin();
}

function showLogin() {
  document.getElementById('auth-overlay').style.display = 'flex';
  document.getElementById('app-content').style.display = 'none';
}

function showApp(userData) {
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('app-content').style.display = 'flex';
  const userEl = document.getElementById('user-info');
  if (userEl && userData) {
    userEl.innerHTML = '<span style="font-size:12px;color:rgba(0,0,0,0.5);font-weight:600;">' +
      userData.name + '</span>' +
      '<button onclick="signOut()" style="margin-left:12px;background:none;border:1px solid rgba(0,0,0,0.15);' +
      'border-radius:6px;padding:4px 12px;font-size:11px;font-weight:600;color:rgba(0,0,0,0.4);' +
      'cursor:pointer;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Sign out</button>';
  }
}

function handleCredentialResponse(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const email = payload.email || '';
  const name = payload.name || email.split('@')[0];

  if (!email.endsWith('@' + ALLOWED_DOMAIN)) {
    document.getElementById('auth-error').style.display = 'block';
    document.getElementById('auth-error').textContent =
      'Access restricted to @' + ALLOWED_DOMAIN + ' accounts only';
    return;
  }

  const userData = { email: email, name: name };
  sessionStorage.setItem('aa_auth', JSON.stringify(userData));
  showApp(userData);
}

function signOut() {
  sessionStorage.removeItem('aa_auth');
  google.accounts.id.disableAutoSelect();
  showLogin();
  google.accounts.id.renderButton(document.getElementById('g-signin-btn'), {
    theme: 'outline', size: 'large', width: 300, text: 'signin_with'
  });
}

function initGoogleAuth() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    hosted_domain: ALLOWED_DOMAIN
  });
  google.accounts.id.renderButton(document.getElementById('g-signin-btn'), {
    theme: 'outline', size: 'large', width: 300, text: 'signin_with'
  });
  checkAuth();
}
