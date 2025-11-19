// Script untuk navigasi materi
const babUrutan = ['pengertian', 'jenis-gaya', 'pengaruh-gaya', 'contoh-penerapan', 'kesimpulan', 'kuis'];
let babSekarang = 0;

function bukaBab(babId) {
    // Sembunyikan semua bab
    document.querySelectorAll('.bab').forEach(bab => {
        bab.classList.remove('active');
    });
    
    // Tampilkan bab yang dipilih
    document.getElementById(babId).classList.add('active');
    
    // Update tombol navigasi aktif
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.nav-btn[onclick="bukaBab('${babId}')"]`).classList.add('active');
    
    // Update index bab sekarang
    babSekarang = babUrutan.indexOf(babId);
    
    // Scroll ke atas
    window.scrollTo(0, 0);
}

function babSebelumnya() {
    if (babSekarang > 0) {
        babSekarang--;
        bukaBab(babUrutan[babSekarang]);
    }
}

function babBerikutnya() {
    if (babSekarang < babUrutan.length - 1) {
        babSekarang++;
        bukaBab(babUrutan[babSekarang]);
    }
}

// Script untuk kuis dengan sistem skor 0-100
let skor = 0;
let pertanyaanTerjawab = 0;
const totalPertanyaan = 5;
const nilaiPerSoal = 100 / totalPertanyaan; // Setiap soal bernilai 20 poin

const jawabanBenar = {
    1: 'B',
    2: 'B', 
    3: 'B',
    4: 'C',
    5: 'B'
};

const penjelasanJawaban = {
    1: "Gaya gesek terjadi ketika dua benda saling bergesekan. Contohnya saat berjalan, ban mobil dengan jalan, dll.",
    2: "Gaya otot adalah gaya yang dihasilkan oleh otot manusia atau hewan. Contohnya mengangkat tas, mendorong meja, dll.",
    3: "Gaya gravitasi adalah gaya tarik bumi yang menarik semua benda ke pusat bumi. Contohnya buah jatuh dari pohon.",
    4: "Gaya pegas terjadi pada benda elastis seperti karet, pegas, busur panah yang dapat kembali ke bentuk semula.",
    5: "Gaya magnet adalah gaya tarik-menarik pada benda magnetik seperti besi, baja, dan nikel."
};

function jawabKuis(soalNomor, pilihan) {
    const tombol = event.target;
    const semuaTombol = tombol.parentElement.querySelectorAll('.option-btn');
    const questionCard = tombol.closest('.question-card');
    
    // Reset semua tombol
    semuaTombol.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Cek jawaban
    if (pilihan === jawabanBenar[soalNomor]) {
        tombol.classList.add('correct');
        skor += nilaiPerSoal; // Tambah nilai per soal
        updateScoreDisplay();
        
        // Tampilkan feedback benar
        tampilkanFeedback(soalNomor, true, penjelasanJawaban[soalNomor]);
    } else {
        tombol.classList.add('wrong');
        // Tampilkan jawaban yang benar
        semuaTombol.forEach(btn => {
            if (btn.textContent.includes(jawabanBenar[soalNomor])) {
                btn.classList.add('correct');
            }
        });
        
        // Tampilkan feedback salah
        tampilkanFeedback(soalNomor, false, penjelasanJawaban[soalNomor]);
    }
    
    // Nonaktifkan tombol setelah menjawab
    semuaTombol.forEach(btn => {
        btn.disabled = true;
    });
    
    // Update counter pertanyaan terjawab
    pertanyaanTerjawab++;
    
    // Cek apakah semua pertanyaan sudah terjawab
    if (pertanyaanTerjawab === totalPertanyaan) {
        setTimeout(tampilkanHasilAkhir, 1000);
    }
    
    // Update progress bar
    updateProgressBar();
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    const progressScore = document.querySelector('.progress-score');
    const nilai = Math.round(skor);
    
    if (scoreElement) scoreElement.textContent = nilai;
    if (progressScore) progressScore.textContent = `Nilai: ${nilai}`;
}

function tampilkanFeedback(soalNomor, isCorrect, penjelasan) {
    const questionCards = document.querySelectorAll('.question-card');
    const questionCard = questionCards[soalNomor]; // +1 karena ada progress bar
    
    // Hapus feedback sebelumnya jika ada
    const feedbackLama = questionCard.querySelector('.feedback');
    if (feedbackLama) {
        feedbackLama.remove();
    }
    
    // Buat elemen feedback baru
    const feedback = document.createElement('div');
    feedback.className = `feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
    feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
        <div class="feedback-content">
            <strong>${isCorrect ? 'Benar! +' + Math.round(nilaiPerSoal) + ' poin' : 'Salah!'}</strong>
            <p>${penjelasan}</p>
        </div>
    `;
    
    questionCard.appendChild(feedback);
}

function tampilkanHasilAkhir() {
    const nilaiAkhir = Math.round(skor);
    let predikat = '';
    let pesan = '';
    let emoji = '';
    let warna = '';
    
    // Tentukan predikat berdasarkan nilai
    if (nilaiAkhir >= 85) {
        predikat = 'Luar Biasa! 🏆';
        pesan = 'Kamu sangat menguasai materi tentang gaya! Pertahankan ya!';
        emoji = '🏆';
        warna = '#4CAF50';
    } else if (nilaiAkhir >= 70) {
        predikat = 'Bagus! ⭐';
        pesan = 'Kamu sudah paham materi tentang gaya, tapi masih perlu sedikit belajar lagi.';
        emoji = '⭐';
        warna = '#2196F3';
    } else if (nilaiAkhir >= 60) {
        predikat = 'Cukup 👍';
        pesan = 'Kamu sudah memahami dasar-dasar gaya, tapi perlu belajar lebih giat lagi.';
        emoji = '👍';
        warna = '#FF9800';
    } else {
        predikat = 'Ayo Belajar Lagi! 📚';
        pesan = 'Jangan menyerah! Pelajari lagi materi tentang gaya dan coba kuis sekali lagi.';
        emoji = '🎯';
        warna = '#f44336';
    }
    
    // Buat modal hasil akhir
    const modalHasil = document.createElement('div');
    modalHasil.className = 'modal-hasil';
    modalHasil.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;
    
    modalHasil.innerHTML = `
        <div class="hasil-content" style="
            background: rgba(255, 255, 255, 0.95);
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            border: 3px solid ${warna};
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
            <div class="hasil-emoji" style="font-size: 4rem; margin-bottom: 1rem;">${emoji}</div>
            <h2 style="color: #2c5530; margin-bottom: 1rem;">${predikat}</h2>
            
            <div class="score-display" style="margin: 2rem 0;">
                <div style="font-size: 3rem; font-weight: bold; color: ${warna}; margin-bottom: 0.5rem;">
                    ${nilaiAkhir}
                </div>
                <div style="color: #666; font-size: 1.2rem;">Nilai Akhir</div>
                <div style="color: #888; font-size: 0.9rem; margin-top: 0.5rem;">
                    (${Math.round(skor / nilaiPerSoal)}/${totalPertanyaan} soal benar)
                </div>
            </div>
            
            <div class="score-details" style="
                background: rgba(44, 85, 48, 0.1);
                padding: 1.5rem;
                border-radius: 10px;
                margin: 1.5rem 0;
                text-align: left;
            ">
                <h4 style="color: #2c5530; margin-bottom: 1rem; text-align: center;">📊 Detail Nilai:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; color: #2c5530;">
                    <div>Jumlah Soal:</div>
                    <div style="text-align: right; font-weight: bold;">${totalPertanyaan}</div>
                    
                    <div>Soal Dijawab:</div>
                    <div style="text-align: right; font-weight: bold;">${pertanyaanTerjawab}</div>
                    
                    <div>Jawaban Benar:</div>
                    <div style="text-align: right; font-weight: bold; color: #4CAF50;">${Math.round(skor / nilaiPerSoal)}</div>
                    
                    <div>Nilai per Soal:</div>
                    <div style="text-align: right; font-weight: bold;">${Math.round(nilaiPerSoal)}</div>
                </div>
            </div>
            
            <p style="color: #2c5530; margin-bottom: 2rem; line-height: 1.6; font-size: 1.1rem; background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 10px;">${pesan}</p>
            
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="ulangiKuis()" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                " onmouseover="this.style.transform='translateY(-2px)'" 
                onmouseout="this.style.transform='translateY(0)'">🔄 Ulangi Kuis</button>
                
                <button onclick="tutupModal()" style="
                    background: #2196F3;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                " onmouseover="this.style.transform='translateY(-2px)'" 
                onmouseout="this.style.transform='translateY(0)'">📚 Pelajari Lagi</button>
                
                <button onclick="kembaliKeMenu()" style="
                    background: #FF9800;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                " onmouseover="this.style.transform='translateY(-2px)'" 
                onmouseout="this.style.transform='translateY(0)'">🏠 Menu Utama</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalHasil);
}

function ulangiKuis() {
    tutupModal();
    resetKuis();
}

function tutupModal() {
    const modal = document.querySelector('.modal-hasil');
    if (modal) {
        modal.remove();
    }
}

function kembaliKeMenu() {
    window.location.href = 'index.html';
}

function resetKuis() {
    skor = 0;
    pertanyaanTerjawab = 0;
    updateScoreDisplay();
    
    // Reset semua tombol kuis
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
    
    // Hapus semua feedback
    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.remove();
    });
    
    // Reset progress bar
    updateProgressBar();
    
    // Tutup modal jika masih terbuka
    tutupModal();
}

// Fungsi untuk update progress bar
function updateProgressBar() {
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    const progressScore = document.querySelector('.progress-score');
    
    if (progressFill && progressText) {
        const progress = (pertanyaanTerjawab / totalPertanyaan) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Progress: ${pertanyaanTerjawab}/${totalPertanyaan} soal`;
    }
    
    if (progressScore) {
        progressScore.textContent = `Nilai: ${Math.round(skor)}`;
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    bukaBab('pengertian');
    
    // Tambahkan progress bar ke kuis container
    const kuisContainer = document.querySelector('.kuis-container');
    if (kuisContainer) {
        const progressHTML = `
            <div class="kuis-progress">
                <div class="progress-info">
                    <div class="progress-score">Nilai: 0</div>
                    <div class="progress-text">Progress: 0/${totalPertanyaan} soal</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill"></div>
                </div>
            </div>
        `;
        kuisContainer.insertAdjacentHTML('afterbegin', progressHTML);
    }
    
    // Tambahkan event listener untuk keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            babSebelumnya();
        } else if (e.key === 'ArrowRight') {
            babBerikutnya();
        } else if (e.key === 'Escape') {
            tutupModal();
        }
    });
});

// CSS tambahan untuk kuis
const kuisCSS = `
.feedback {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border-radius: 10px;
    margin-top: 1rem;
    animation: slideIn 0.3s ease;
}

.feedback-correct {
    background: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.feedback-wrong {
    background: rgba(244, 67, 54, 0.1);
    border: 1px solid rgba(244, 67, 54, 0.3);
}

.feedback-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    flex-shrink: 0;
}

.feedback-content strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c5530;
}

.feedback-content p {
    margin: 0;
    color: #2c5530;
    line-height: 1.5;
    font-size: 0.9rem;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.option-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.option-btn.correct:disabled {
    background: rgba(76, 175, 80, 0.4);
    border-color: #4CAF50;
}

.option-btn.wrong:disabled {
    background: rgba(244, 67, 54, 0.4);
    border-color: #f44336;
}

/* Progress indicator untuk kuis */
.kuis-progress {
    background: rgba(255, 255, 255, 0.3);
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.4);
    text-align: center;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: #2c5530;
    font-weight: bold;
}

.progress-score {
    font-size: 1.2rem;
    background: rgba(76, 175, 80, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid rgba(76, 175, 80, 0.4);
}

.progress-text {
    font-size: 1rem;
}

.progress-bar-container {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    border-radius: 6px;
    transition: width 0.3s ease;
    width: 0%;
}

/* Responsive design untuk kuis */
@media (max-width: 768px) {
    .progress-info {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
    
    .progress-score, .progress-text {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .kuis-progress {
        padding: 1rem;
    }
    
    .progress-score {
        font-size: 1rem;
        padding: 0.4rem 0.8rem;
    }
}
`;

// Inject CSS ke dalam document
const style = document.createElement('style');
style.textContent = kuisCSS;
document.head.appendChild(style);