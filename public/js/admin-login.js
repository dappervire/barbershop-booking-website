const form = document.getElementById('loginForm')

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if (response.ok){
            const result = await response.json();
            localStorage.setItem('token', result.token);
            window.location.href =  '/admin-dashboard.html';
        } else {
            showToast('Username atau password salah.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Terjadi kesalan koneksi.', 'error')
    }
});