const API_URL = "https://login-backend-96fl.onrender.com"; // Địa chỉ backend

async function postJSON(url, data) {
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw json || { error: 'Request failed' };
  return json;
}

function showMsg(el, text, isError=false) {
  el.textContent = text;
  el.style.display = 'block';
  el.classList.toggle('err', !!isError);
  setTimeout(() => { el.style.display='none'; }, 4000);
}

// Đăng ký
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('regMsg');

  try {
    const resp = await postJSON('/register', { name, email, password });
    showMsg(msg, resp.message || 'Đăng ký thành công!');
  } catch (err) {
    showMsg(msg, err.error || 'Đăng ký thất bại', true);
  }
});

// Đăng nhập
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');

  try {
    const resp = await postJSON('/login', { email, password });
    showMsg(msg, resp.message || 'Đăng nhập thành công!');
    await loadProfile();
    // Sau khi đăng nhập thành công
    window.location.href = "conkhi.html";

  } catch (err) {
    showMsg(msg, err.error || 'Đăng nhập thất bại', true);
  }
});

// Load profile
async function loadProfile() {
  const res = await fetch(`${API_URL}/profile`, { credentials: 'include' });
  if (!res.ok) return;
  const ct = res.headers.get('content-type') || '';
  const profileCard = document.getElementById('profile');

  if (ct.includes('application/json')) {
    const data = await res.json();
    const user = data.user || {};
    document.getElementById('pName').textContent = user.name || user.displayName || '(Không tên)';
    document.getElementById('pEmail').textContent = user.email || (user.emails && user.emails[0]?.value) || '';
    document.getElementById('avatar').src = (user.photos && user.photos[0]?.value) || '';
    profileCard.style.display = 'block';
  } else {
    profileCard.style.display = 'none';
  }
}

// Đăng xuất
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch(`${API_URL}/logout`, { credentials: 'include' });
  location.reload();
});

loadProfile();
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('regMsg');

  try {
    const resp = await postJSON('/register', { name, email, password });
    showMsg(msg, resp.message || 'Đăng ký thành công!');
    
    // Sau khi đăng ký thành công → chuyển sang trang home
    window.location.href = "conkhi.html";

  } catch (err) {
    showMsg(msg, err.error || 'Đăng ký thất bại', true);
  }
});

