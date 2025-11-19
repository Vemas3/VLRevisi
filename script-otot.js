// Variabel simulasi
let simulasiBerjalan = false;
let startTime = 0;
let timerInterval = null;

// Elemen DOM
const forceSelect = document.getElementById('forceSelect');
const human = document.querySelector('.human');
const table = document.querySelector('.table');
const muscleEffect = document.querySelector('.muscle-effect');
const currentForce = document.getElementById('currentForce');
const travelTime = document.getElementById('travelTime');
const muscleForce = document.getElementById('muscleForce');
const status = document.getElementById('status');

// Data kekuatan otot - REVISI: MANUSIA DAN MEJA SAMA-SAMA SAMPAI FINISH
const forceData = {
    lemah: {
        duration: 6000,
        force: 'Lemah',
        tableDistance: 500,  // JARAK LEBIH JAUH UNTUK SAMPAI FINISH
        humanDistance: 500,  // MANUSIA JUGA SAMPAI FINISH
        speed: 'Lambat',
        message: '💪 Daya lemah - Meja bergerak lambat! Butuh waktu lebih lama untuk mencapai finish.'
    },
    sedang: {
        duration: 4000,
        force: 'Sedang', 
        tableDistance: 500,
        humanDistance: 500,
        speed: 'Sedang',
        message: '💪💪 Daya sedang - Meja bergerak dengan kecepatan normal!'
    },
    kuat: {
        duration: 2500,
        force: 'Kuat',
        tableDistance: 500,
        humanDistance: 500,
        speed: 'Cepat',
        message: '💪💪💪 Daya kuat - Meja bergerak sangat cepat! Gaya otot yang kuat efektif menggerakkan benda.'
    }
};

// Fungsi ubah kekuatan
function ubahKekuatan() {
    if (simulasiBerjalan) return;
    
    const selectedForce = forceSelect.value;
    const force = forceData[selectedForce];
    
    // Reset posisi
    resetPosisi();
    
    // Update data display
    currentForce.textContent = force.force;
    muscleForce.textContent = force.speed;
    
    // Reset status
    resetData();
}

// Fungsi reset posisi
function resetPosisi() {
    // Hentikan semua animasi
    human.style.transition = 'none';
    human.style.left = '100px';
    human.style.transform = 'translateX(0)';
    human.classList.remove('pushing', 'ready');
    
    table.style.transition = 'none';
    table.style.left = '215px'; // POSISI AWAL MEJA BERSENTUHAN
    table.style.transform = 'translateX(0)';
    table.classList.remove('moving');
    
    // Reset efek otot
    muscleEffect.classList.remove('active');
    muscleEffect.style.opacity = '0';
    
    // Force reflow
    void human.offsetWidth;
    void table.offsetWidth;
    
    // Set animasi standby setelah reset
    setTimeout(() => {
        human.classList.add('ready');
    }, 100);
}

// Fungsi mulai simulasi - REVISI: MANUSIA DAN MEJA SAMA-SAMA SAMPAI FINISH
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    status.textContent = 'Mendorong...';
    
    const selectedForce = forceSelect.value;
    const force = forceData[selectedForce];
    
    // Hentikan animasi standby
    human.classList.remove('ready');
    
    // Mulai timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
    
    // Hitung posisi finish berdasarkan lebar container
    const simulationArea = document.querySelector('.simulation-area');
    const areaWidth = simulationArea.offsetWidth;
    const finishLine = document.querySelector('.finish-line');
    const finishRect = finishLine.getBoundingClientRect();
    const simulationRect = simulationArea.getBoundingClientRect();
    
    // Hitung posisi finish relatif terhadap simulation area
    const finishPosition = finishRect.left - simulationRect.left - 50; // Margin dari finish line
    
    console.log('Area width:', areaWidth, 'Finish position:', finishPosition);
    
    // ANIMASI DORONG: MANUSIA DAN MEJA SAMA-SAMA SAMPAI FINISH
    
    // 1. FASE AWAL: PERSIAPAN DORONG
    setTimeout(() => {
        // Aktifkan efek visual
        human.classList.add('pushing');
        table.classList.add('moving');
        muscleEffect.classList.add('active');
        
        // Efek awal: manusia mendorong dengan tubuh
        human.style.transition = 'transform 0.3s ease-out';
        human.style.transform = 'translateX(5px) scale(0.98)';
        
    }, 200);
    
    // 2. FASE DORONG: MANUSIA DAN MEJA BERGERAK BERSAMAAN SAMPAI FINISH
    setTimeout(() => {
        // Hitung jarak yang harus ditempuh sampai finish
        const humanStartPos = 100;
        const tableStartPos = 215;
        
        // Posisi akhir - sampai melewati finish line
        const humanFinalPos = finishPosition - 50;  // Manusia berhenti sedikit sebelum finish
        const tableFinalPos = finishPosition + 50;  // Meja melewati finish
        
        console.log(`Human: ${humanStartPos} -> ${humanFinalPos}px`);
        console.log(`Table: ${tableStartPos} -> ${tableFinalPos}px`);
        
        // Gerakkan manusia dan meja BERSAMA-SAMA sampai finish
        human.style.transition = `left ${force.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
        table.style.transition = `left ${force.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
        
        human.style.left = `${humanFinalPos}px`;
        table.style.left = `${tableFinalPos}px`;
        
        // Efek otot mengikuti pergerakan
        muscleEffect.style.transition = `left ${force.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
        muscleEffect.style.left = `${humanFinalPos - 80}px`; // Efek otot mengikuti manusia
        
    }, 500);
    
    // 3. FASE AKHIR: SIMULASI SELESAI
    setTimeout(() => {
        selesaikanSimulasi(force);
    }, force.duration + 800);
}

// Fungsi update timer
function updateTimer() {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000;
    travelTime.textContent = elapsed.toFixed(1) + ' detik';
}

// Fungsi selesaikan simulasi
function selesaikanSimulasi(force) {
    if (!simulasiBerjalan) return;
    
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    
    // Hentikan animasi dorong
    human.classList.remove('pushing');
    table.classList.remove('moving');
    muscleEffect.classList.remove('active');
    
    // Reset transform manusia
    human.style.transform = 'translateX(0) scale(1)';
    human.style.transition = 'transform 0.3s ease-out';
    
    status.textContent = 'Selesai!';
    
    // Tampilkan hasil final
    const finalTime = (Date.now() - startTime) / 1000;
    travelTime.textContent = finalTime.toFixed(1) + ' detik';
    
    // Berikan feedback
    setTimeout(() => {
        showResultMessage(force.message);
    }, 500);
}

// Fungsi tampilkan hasil
function showResultMessage(message) {
    // Cek jika sudah ada modal, hapus dulu
    const existingModal = document.querySelector('.result-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-modal';
    resultDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 400px;
        text-align: center;
        border: 2px solid #2c5530;
        backdrop-filter: blur(10px);
    `;
    
    resultDiv.innerHTML = `
        <h3 style="color: #2c5530; margin-bottom: 1rem;">🏁 Finish!</h3>
        <p style="color: #2c5530; margin-bottom: 1.5rem; line-height: 1.5;">${message}</p>
        <p style="color: #2c5530; font-size: 0.9rem; margin-bottom: 1rem;">
            ✅ Manusia dan meja berhasil mencapai finish!
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: #2c5530;
            color: white;
            border: none;
            padding: 0.7rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='#1e3a23'" 
        onmouseout="this.style.background='#2c5530'">Mengerti</button>
    `;
    
    document.body.appendChild(resultDiv);
}

// Fungsi reset simulasi
function resetSimulasi() {
    if (simulasiBerjalan) {
        clearInterval(timerInterval);
        simulasiBerjalan = false;
    }
    
    // Hapus modal hasil jika ada
    const existingModal = document.querySelector('.result-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Reset semua posisi dan efek
    resetPosisi();
    
    // Reset data
    resetData();
    
    // Beri feedback
    status.textContent = 'Direset';
    setTimeout(() => {
        status.textContent = 'Siap';
    }, 1000);
}

// Fungsi reset data
function resetData() {
    travelTime.textContent = '-';
    if (!simulasiBerjalan) {
        status.textContent = 'Siap';
    }
}

// DEMO MODE
function demoMode() {
    if (simulasiBerjalan) return;
    
    const forces = ['lemah', 'sedang', 'kuat'];
    let currentDemo = 0;
    
    function runDemo() {
        if (currentDemo >= forces.length) {
            resetSimulasi();
            return;
        }
        
        forceSelect.value = forces[currentDemo];
        ubahKekuatan();
        
        setTimeout(() => {
            mulaiSimulasi();
            
            setTimeout(() => {
                currentDemo++;
                setTimeout(runDemo, 2000);
            }, forceData[forces[currentDemo]].duration + 1500);
            
        }, 1000);
    }
    
    runDemo();
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Set animasi standby setelah load
    setTimeout(() => {
        human.classList.add('ready');
    }, 1000);
    
    // Set kekuatan default
    ubahKekuatan();
    
    // Event listener untuk tombol keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            if (!simulasiBerjalan) {
                mulaiSimulasi();
            }
        } else if (e.key === 'Escape' || e.key === 'r') {
            resetSimulasi();
        } else if (e.key === 'd') {
            demoMode();
        } else if (e.key >= '1' && e.key <= '3') {
            const forces = ['lemah', 'sedang', 'kuat'];
            forceSelect.value = forces[parseInt(e.key) - 1];
            ubahKekuatan();
        }
    });
    
    // Touch support untuk mobile
    const simulationArea = document.querySelector('.simulation-area');
    simulationArea.addEventListener('touchstart', function(e) {
        if (!simulasiBerjalan) {
            e.preventDefault();
            mulaiSimulasi();
        }
    });
});

// CSS tambahan untuk animasi finish
const additionalCSS = `
/* Animasi manusia mendorong - LEBIH DINAMIS */
.human.pushing {
    animation: pushingMotion 0.7s ease-in-out infinite;
}

@keyframes pushingMotion {
    0%, 100% { 
        transform: translateX(0) translateY(0) scale(1);
    }
    20% { 
        transform: translateX(8px) translateY(-3px) scale(0.97);
    }
    40% { 
        transform: translateX(12px) translateY(-1px) scale(0.95);
    }
    60% { 
        transform: translateX(8px) translateY(1px) scale(0.97);
    }
    80% { 
        transform: translateX(4px) translateY(0) scale(0.99);
    }
}

/* Animasi meja bergerak - LEBIH HIDUP */
.table.moving {
    animation: tableMovement 0.4s ease-in-out infinite;
}

@keyframes tableMovement {
    0%, 100% { 
        transform: translateY(0) rotate(0deg);
    }
    25% { 
        transform: translateY(-2px) rotate(0.3deg);
    }
    50% { 
        transform: translateY(1px) rotate(0deg);
    }
    75% { 
        transform: translateY(-1px) rotate(-0.3deg);
    }
}

/* Efek otot yang lebih kuat dan mengikuti pergerakan */
.muscle-effect.active {
    animation: musclePower 0.6s ease-in-out infinite;
}

@keyframes musclePower {
    0%, 100% { 
        transform: scale(1);
        opacity: 0.7;
    }
    25% { 
        transform: scale(1.4);
        opacity: 0.9;
    }
    50% { 
        transform: scale(1.2);
        opacity: 0.8;
    }
    75% { 
        transform: scale(1.3);
        opacity: 0.9;
    }
}

/* Efek saat mencapai finish */
@keyframes finishCelebration {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.finish-line.reached::after {
    animation: finishCelebration 0.5s ease-in-out 3;
    color: #ff0000;
}

/* Efek glow saat mendekati finish */
.simulation-area.near-finish .human,
.simulation-area.near-finish .table {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
}

/* Progress indicator */
.progress-bar {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    overflow: hidden;
    z-index: 10;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    width: 0%;
    transition: width 0.1s linear;
    border-radius: 4px;
}
`;

// Inject CSS tambahan
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

document.querySelector('.simulation-area').insertAdjacentHTML('afterbegin', progressBarHTML);

// Modifikasi updateTimer untuk include progress
const originalUpdateTimer = updateTimer;
updateTimer = function() {
    originalUpdateTimer.apply(this, arguments);
    
    if (simulasiBerjalan) {
        const selectedForce = forceSelect.value;
        const force = forceData[selectedForce];
        const elapsed = (Date.now() - startTime) / 1000;
        const totalTime = force.duration / 1000;
        const progress = Math.min(elapsed / totalTime, 1);
        
        updateProgressBar(progress);
        
        // Efek near finish saat progress > 80%
        const simulationArea = document.querySelector('.simulation-area');
        if (progress > 0.8) {
            simulationArea.classList.add('near-finish');
        } else {
            simulationArea.classList.remove('near-finish');
        }
    }
};

// Reset progress bar saat reset
const originalResetSimulasi = resetSimulasi;
resetSimulasi = function() {
    originalResetSimulasi.apply(this, arguments);
    updateProgressBar(0);
    const simulationArea = document.querySelector('.simulation-area');
    simulationArea.classList.remove('near-finish');
};