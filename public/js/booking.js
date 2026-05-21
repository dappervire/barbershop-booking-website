async function loadServices(){
    try {
        const response = await fetch('/services');
        const services = await response.json();

        const select = document.getElementById('serviceSelect')

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = `${service.name} - Rp${service.price}`;
            select.appendChild(option);
        });
    } catch (error){
        console.error('Gagal load layanan:', error)
    }
}

const form = document.getElementById('bookingForm')

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showToast('Booking berhasil', 'success');
            form.reset();
        } else {
            showToast('Booking gagal. Coba lagi.', 'error');
        }
    } catch(error) {
        console.error('Error', error);
        alert('Terjadi kesalahan koneksi.')
    }
});

loadServices();