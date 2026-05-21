const token = localStorage.getItem('token');
if (!token) {
    window.location.href = '/admin-login.html';
}

async function loadBookings(){
    try {
        const response = await fetch('/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok){
            showToast('Sesi habis. Silahkan login ulang.', 'error');
            localStorage.removeItem('token');
            window.location.href = '/admin-login.html';
            return;
        }
        const bookings = await response.json();
        renderBookings(bookings);
    } catch (error) {
        console.error('Error', error);
        showToast('Gagal load data.', 'error')
    }
}

function renderBookings(bookings) {
    const container = document.getElementById('bookingList');
    container.innerHTML = '';
    bookings.forEach(booking => {
        const card = document.createElement('div')
        card.className = 'booking-card';
        card.innerHTML = `
            <h3>${booking.customer_name}</h3>
            <p>HP: ${booking.customer_phone}</p>
            <p>Layanan: ${booking.service_name} - Rp${booking.service_price}</p>
            <p>Tanggal: ${booking.booking_date.split('T')[0]}</p>
            <p>Jam: ${booking.booking_time}</p>
            <p>Status: <span class="status status-${booking.status}">${booking.status}</span></p>
            <button class="btn-approve" onclick="updateStatus(${booking.id}, 'approved')">Approve</button>
            <button class="btn-reject" onclick="updateStatus(${booking.id}, 'rejected')">Reject</button>
        `;
        container.appendChild(card);
    });
}

async function updateStatus(id, status) {
    try {
        const response = await fetch(`/bookings/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (response.ok) {
            showToast(`Booking ${status}`, 'success');
            loadBookings();
        } else {
            showToast('Gagal update status.', 'error');
        }
    } catch (error){
        console.error('Error', error);
        showToast('Terjadi kesalahan koneksi', 'error');
    }
}

document.getElementById('logoutBtn').addEventListener('click', ()=> {
    localStorage.removeItem('token');
    window.location.href = '/admin-login.html';
});

loadBookings();