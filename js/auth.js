// Claude - Accord | Auth & App Logic

// ===== Auth State =====

async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function updateNavAuth() {
  const user = await getUser();
  document.querySelectorAll('.auth-logged-in').forEach(el => {
    el.style.display = user ? '' : 'none';
  });
  document.querySelectorAll('.auth-logged-out').forEach(el => {
    el.style.display = user ? 'none' : '';
  });
}

// Run on every page load
document.addEventListener('DOMContentLoaded', updateNavAuth);

// ===== Sign Up =====

async function handleSignup(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#signup-email').value.trim();
  const password = form.querySelector('#signup-password').value;
  const tier = form.querySelector('#signup-tier')?.value || 'personal';
  const alertEl = form.querySelector('.alert');

  if (!email || !password) {
    showAlert(alertEl, 'Please fill in all fields.', 'error');
    return;
  }

  if (password.length < 6) {
    showAlert(alertEl, 'Password must be at least 6 characters.', 'error');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { tier } }
  });

  if (error) {
    showAlert(alertEl, error.message, 'error');
    return;
  }

  // Also insert into subscribers table
  await supabase.from('subscribers').insert([{ email, tier }]);

  showAlert(alertEl, 'Account created! Check your email to confirm.', 'success');
  form.reset();
}

// ===== Login =====

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#login-email').value.trim();
  const password = form.querySelector('#login-password').value;
  const alertEl = form.querySelector('.alert');

  if (!email || !password) {
    showAlert(alertEl, 'Please fill in all fields.', 'error');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showAlert(alertEl, error.message, 'error');
    return;
  }

  window.location.href = 'index.html';
}

// ===== Logout =====

async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// ===== Email Capture (Landing Page) =====

async function handleEmailCapture(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('#capture-email').value.trim();
  const alertEl = form.closest('.email-capture')?.querySelector('.alert') || form.querySelector('.alert');

  if (!email) {
    showAlert(alertEl, 'Please enter your email.', 'error');
    return;
  }

  const { error } = await supabase.from('subscribers').insert([{
    email,
    tier: 'personal'
  }]);

  if (error) {
    if (error.code === '23505') {
      showAlert(alertEl, 'You are already subscribed!', 'error');
    } else {
      showAlert(alertEl, 'Something went wrong. Please try again.', 'error');
    }
    return;
  }

  showAlert(alertEl, 'You are on the list! We will be in touch.', 'success');
  form.reset();
}

// ===== Helpers =====

function showAlert(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type} visible`;
}

// ===== Mobile Nav =====

function toggleNav() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}
