// Variabel simulasi
let simulasiBerjalan = false;
let jumpInterval = null;
let jumpCount = 0;
const MAX_JUMPS = 5; // Jumlah lompatan maksimal

// Elemen DOM
const trampoline = document.getElementById('trampoline');
const human = document.getElementById('human');
const springEffect = document.getElementById('springEffect');
const jumpHeight = document.getElementById('jumpHeight');
const springForce = document.getElementById('springForce');
const status = document.getElementById('status');
const jumpCounter = document.getElementById('jumpCounter');

// Posisi konstan
const POSISI_DIAM = 180; // Posisi diam di atas trampolin
const POSISI_TURUN = 200; // Posisi saat menekan trampolin
const TINGGI_LOMPAT = 120; // Tinggi lompatan dari posisi diam

// Data lompatan
const jumpData = {
    height: '120px',
    force: 'Kuat',
    jumpPower: TINGGI_LOMPAT,
    duration: 800,
    message: '🦘 Trampolin menggunakan gaya pegas! Semakin kuat tekanan, semakin tinggi lompatannya.'
};

// Fungsi inisialisasi data
function inisialisasiData() {
    // Set data display
    jumpHeight.textContent = jumpData.height;
    springForce.textContent = jumpData.force;
    
    // Reset status
    resetData();
}

// Fungsi reset posisi - MANUSIA DI ATAS TRAMPOLIN
function resetPosisi() {
    // Hentikan semua animasi
    if (jumpInterval) {
        clearInterval(jumpInterval);
        jumpInterval = null;
    }
    
    // Reset posisi manusia - DI ATAS TRAMPOLIN
    human.style.bottom = POSISI_DIAM + 'px';
    human.style.transition = 'none';
    human.classList.remove('jumping');
    
    // Reset trampolin
    trampoline.classList.remove('pressed');
    
    // Reset efek pegas
    springEffect.classList.remove('active');
    
    // Reset counter
    jumpCount = 0;
    if (jumpCounter) jumpCounter.textContent = '0';
}

// Fungsi mulai simulasi - LOMPAT BERULANG
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    jumpCount = 0;
    status.textContent = 'Melompat...';
    
    // Mulai lompat berulang
    lompatBerulang();
}

// Fungsi lompat berulang
function lompatBerulang() {
    let currentJumpCount = 0;
    
    function lakukanLompatan() {
        if (currentJumpCount >= MAX_JUMPS || !simulasiBerjalan) {
            selesaikanLompatan();
            return;
        }
        
        currentJumpCount++;
        jumpCount = currentJumpCount;
        if (jumpCounter) jumpCounter.textContent = currentJumpCount;
        
        // Animasi lompat tunggal
        lompatTunggal(currentJumpCount);
        
        // Jadwalkan lompatan berikutnya
        if (currentJumpCount < MAX_JUMPS && simulasiBerjalan) {
            setTimeout(lakukanLompatan, jumpData.duration + 300);
        }
    }
    
    // Mulai lompatan pertama
    lakukanLompatan();
}

// Fungsi lompat tunggal
function lompatTunggal(currentCount) {
    // Fase 1: Manusia turun dan trampolin tertekan
    human.style.transition = `bottom 0.2s ease`;
    human.style.bottom = POSISI_TURUN + 'px'; // Turun sedikit menekan trampolin
    
    setTimeout(() => {
        // Trampolin tertekan
        trampoline.classList.add('pressed');
        springEffect.classList.add('active');
        
        // Fase 2: Manusia melompat ke atas
        setTimeout(() => {
            human.classList.add('jumping');
            human.style.transition = `all ${jumpData.duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
            
            // Lompat ke atas TANPA MELEWATI BATAS BAWAH
            const posisiLompat = POSISI_DIAM - jumpData.jumpPower;
            human.style.bottom = Math.max(100, posisiLompat) + 'px'; // Batasi minimal 100px dari atas
            
            // Reset trampolin
            trampoline.classList.remove('pressed');
            
            // Fase 3: Kembali ke posisi diam di atas trampolin
            setTimeout(() => {
                human.classList.remove('jumping');
                human.style.transition = `bottom 0.3s ease`;
                human.style.bottom = POSISI_DIAM + 'px'; // Kembali ke posisi diam di atas trampolin
                
                // Efek pegas menghilang
                setTimeout(() => {
                    springEffect.classList.remove('active');
                }, 200);
                
            }, jumpData.duration);
            
        }, 200);
    }, 200);
}

// Fungsi selesaikan lompatan
function selesaikanLompatan() {
    simulasiBerjalan = false;
    status.textContent = 'Selesai';
    
    // Tampilkan hasil
    setTimeout(() => {
        if (jumpCount > 0) {
            alert(`${jumpData.message}\n\nTotal lompatan: ${jumpCount} kali`);
        }
    }, 500);
}

// Fungsi reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    
    // Hentikan semua animasi
    if (jumpInterval) {
        clearInterval(jumpInterval);
        jumpInterval = null;
    }
    
    // Reset semua posisi dan efek
    resetPosisi();
    
    // Reset data
    resetData();
}

// Fungsi reset data
function resetData() {
    status.textContent = 'Siap';
    if (jumpCounter) jumpCounter.textContent = '0';
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Set data default
    inisialisasiData();
    
    // Event listener untuk tombol keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !simulasiBerjalan) {
            mulaiSimulasi();
        } else if (e.key === 'Escape') {
            resetSimulasi();
        }
    });
    
    // Fallback jika gambar tidak ditemukan
    const trampolineImg = document.querySelector('.trampoline-image');
    const humanImg = document.querySelector('.human-image');
    
    trampolineImg.onerror = function() {
        console.log('Gambar trampolin.png tidak ditemukan, menggunakan fallback');
        trampolineImg.style.display = 'none';
        const fallbackTrampoline = document.createElement('div');
        fallbackTrampoline.style.cssText = `
            width: 200px;
            height: 30px;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            border-radius: 10px;
            position: relative;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        trampoline.appendChild(fallbackTrampoline);
    };
    
    humanImg.onerror = function() {
        console.log('Gambar manusialompat.png tidak ditemukan, menggunakan fallback');
        humanImg.style.display = 'none';
        const fallbackHuman = document.createElement('div');
        fallbackHuman.style.cssText = `
            width: 40px;
            height: 60px;
            background: linear-gradient(#4fc3f7, #1976d2);
            border-radius: 20px 20px 0 0;
            position: relative;
        `;
        // Tambahkan kepala
        const head = document.createElement('div');
        head.style.cssText = `
            width: 30px;
            height: 30px;
            background: #FFD700;
            border-radius: 50%;
            position: absolute;
            top: -20px;
            left: 5px;
        `;
        fallbackHuman.appendChild(head);
        human.appendChild(fallbackHuman);
    };
});