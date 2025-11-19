// Variabel simulasi
let simulasiBerjalan = false;
let startTime = 0;
let timerInterval = null;

// Elemen DOM
const surfaceSelect = document.getElementById('surfaceSelect');
const aspalSurface = document.getElementById('aspalSurface');
const tanahSurface = document.getElementById('tanahSurface');
const mobil = document.getElementById('mobil');
const finishLine = document.getElementById('finishLine');
const currentSurface = document.getElementById('currentSurface');
const travelTime = document.getElementById('travelTime');
const frictionForce = document.getElementById('frictionForce');
const status = document.getElementById('status');

// Fungsi ubah permukaan
function ubahPermukaan() {
    const selectedSurface = surfaceSelect.value;
    
    // Reset posisi mobil
    mobil.style.left = '50px';
    mobil.style.transition = 'none';
    mobil.classList.remove('moving');
    
    // Tampilkan permukaan yang dipilih
    if (selectedSurface === 'aspal') {
        aspalSurface.style.display = 'flex';
        tanahSurface.style.display = 'none';
        currentSurface.textContent = 'Aspal';
        frictionForce.textContent = 'Kecil';
    } else {
        aspalSurface.style.display = 'none';
        tanahSurface.style.display = 'flex';
        currentSurface.textContent = 'Tanah';
        frictionForce.textContent = 'Besar';
    }
    
    // Reset status
    resetData();
}

// Fungsi mulai simulasi
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    status.textContent = 'Berjalan...';
    mobil.classList.add('moving');
    
    // Reset posisi mobil
    mobil.style.left = '50px';
    mobil.style.transition = 'none';
    
    // Tentukan kecepatan berdasarkan permukaan
    const selectedSurface = surfaceSelect.value;
    let duration;
    
    if (selectedSurface === 'aspal') {
        duration = 3000; // 3 detik untuk aspal (gesekan kecil)
    } else {
        duration = 12000; // 6 detik untuk tanah (gesekan besar)
    }
    
    // Mulai timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
    
    // Animasikan mobil
    setTimeout(() => {
        mobil.style.transition = `left ${duration}ms linear`;
        mobil.style.left = 'calc(100% - 150px)';
    }, 100);
    
    // Selesaikan simulasi setelah durasi
    setTimeout(() => {
        selesaikanSimulasi();
    }, duration + 100);
}

// Fungsi update timer
function updateTimer() {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000;
    travelTime.textContent = elapsed.toFixed(1) + ' detik';
}

// Fungsi selesaikan simulasi
function selesaikanSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    mobil.classList.remove('moving');
    status.textContent = 'Selesai';
    
    // Tampilkan hasil
    const selectedSurface = surfaceSelect.value;
    const finalTime = (Date.now() - startTime) / 1000;
    
    travelTime.textContent = finalTime.toFixed(1) + ' detik';
    
    // Berikan feedback berdasarkan permukaan
    setTimeout(() => {
        if (selectedSurface === 'aspal') {
            alert('🎉 Mobil sampai finish dengan cepat! Gaya gesek di aspal kecil.');
        } else {
            alert('🐢 Mobil sampai finish lebih lambat! Gaya gesek di tanah besar.');
        }
    }, 500);
}

// Fungsi reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    mobil.classList.remove('moving');
    
    // Reset posisi mobil
    mobil.style.left = '50px';
    mobil.style.transition = 'none';
    
    // Reset data
    resetData();
}

// Fungsi reset data
function resetData() {
    travelTime.textContent = '-';
    status.textContent = 'Siap';
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    ubahPermukaan(); // Set permukaan default
});