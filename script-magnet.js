// Variabel simulasi
let simulasiBerjalan = false;

// Elemen DOM
const objectSelect = document.getElementById('objectSelect');
const pakuObject = document.getElementById('pakuObject');
const penghapusObject = document.getElementById('penghapusObject');
const magnet = document.getElementById('magnet');
const magneticField = document.getElementById('magneticField');
const currentObject = document.getElementById('currentObject');
const objectType = document.getElementById('objectType');
const magneticForce = document.getElementById('magneticForce');
const status = document.getElementById('status');

// Posisi awal
const POSISI_MAGNET_AWAL = { left: '100px', bottom: '100px' };
const POSISI_PAKU_AWAL = { left: '400px', bottom: '100px' };
const POSISI_PENGHAPUS_AWAL = { left: '400px', bottom: '100px' };

// Fungsi ubah benda
function ubahBenda() {
    const selectedObject = objectSelect.value;
    
    // Reset posisi semua benda
    resetPosisiBenda();
    
    // Tampilkan benda yang dipilih
    if (selectedObject === 'paku') {
        pakuObject.style.display = 'block';
        penghapusObject.style.display = 'none';
        currentObject.textContent = 'Paku';
        objectType.textContent = 'Benda Logam';
        magneticForce.textContent = 'Akan Tertarik';
    } else {
        pakuObject.style.display = 'none';
        penghapusObject.style.display = 'block';
        currentObject.textContent = 'Penghapus';
        objectType.textContent = 'Benda Non-Logam';
        magneticForce.textContent = 'Tidak Tertarik';
    }
    
    // Reset status
    resetData();
}

// Fungsi reset posisi benda
function resetPosisiBenda() {
    // Reset posisi magnet
    magnet.style.left = POSISI_MAGNET_AWAL.left;
    magnet.style.bottom = POSISI_MAGNET_AWAL.bottom;
    magnet.classList.remove('active');
    
    // Reset posisi paku
    pakuObject.style.left = POSISI_PAKU_AWAL.left;
    pakuObject.style.bottom = POSISI_PAKU_AWAL.bottom;
    pakuObject.style.transform = 'translate(0, 0) rotate(0deg)';
    pakuObject.classList.remove('attracted', 'attached');
    
    // Reset posisi penghapus
    penghapusObject.style.left = POSISI_PENGHAPUS_AWAL.left;
    penghapusObject.style.bottom = POSISI_PENGHAPUS_AWAL.bottom;
    penghapusObject.style.transform = 'translate(0, 0) rotate(0deg)';
    penghapusObject.classList.remove('attracted', 'attached');
    
    // Reset efek magnet
    magneticField.classList.remove('active');
}

// Fungsi mulai simulasi
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    status.textContent = 'Magnet Aktif...';
    
    const selectedObject = objectSelect.value;
    const currentObjectElement = selectedObject === 'paku' ? pakuObject : penghapususObject;
    
    if (selectedObject === 'paku') {
        // Magnet menarik paku sampai menempel
        magneticForce.textContent = 'Menarik';
        
        // Aktifkan efek magnet
        magnet.classList.add('active');
        magneticField.classList.add('active');
        
        // Animasi paku tertarik ke magnet
        setTimeout(() => {
            currentObjectElement.classList.add('attracted');
            
            // Hitung posisi akhir (menempel ke magnet)
            const magnetRect = magnet.getBoundingClientRect();
            const pakuRect = pakuObject.getBoundingClientRect();
            const simulationArea = document.querySelector('.simulation-area').getBoundingClientRect();
            
            // Posisi menempel di sisi kanan magnet
            const posisiAkhirX = magnetRect.left - simulationArea.left + magnetRect.width - 20;
            const posisiAkhirY = magnetRect.bottom - simulationArea.bottom;
            
            // Animasi paku bergerak ke magnet
            pakuObject.style.transition = 'all 1.5s ease-in-out';
            pakuObject.style.left = posisiAkhirX + 'px';
            pakuObject.style.bottom = (100 - posisiAkhirY) + 'px';
            
            // Setelah sampai, tambah efek menempel
            setTimeout(() => {
                currentObjectElement.classList.add('attached');
                selesaikanSimulasi(true);
            }, 1600);
            
        }, 500);
        
    } else {
        // Magnet tidak menarik penghapus
        magneticForce.textContent = 'Tidak Menarik';
        
        // Aktifkan efek magnet sebentar
        magnet.classList.add('active');
        magneticField.classList.add('active');
        
        // Efek getar untuk menunjukkan tidak tertarik
        setTimeout(() => {
            currentObjectElement.style.animation = 'objectShake 0.5s ease-in-out 3';
        }, 500);
        
        // Selesaikan simulasi
        setTimeout(() => {
            magnet.classList.remove('active');
            magneticField.classList.remove('active');
            selesaikanSimulasi(false);
        }, 2000);
    }
}

// Fungsi selesaikan simulasi
function selesaikanSimulasi(tertarik) {
    simulasiBerjalan = false;
    status.textContent = 'Selesai';
    
    // Berikan feedback berdasarkan hasil
    setTimeout(() => {
        if (tertarik) {
            alert('🎉 Magnet berhasil menarik paku! Paku terbuat dari besi yang bersifat magnetis dan menempel kuat pada magnet.');
        } else {
            alert('❌ Magnet tidak menarik penghapus! Penghapus terbuat dari karet yang tidak bersifat magnetis.');
        }
    }, 500);
}

// Fungsi reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    
    // Reset semua posisi dan efek
    resetPosisiBenda();
    
    // Reset data
    resetData();
}

// Fungsi reset data
function resetData() {
    magneticForce.textContent = '-';
    status.textContent = 'Siap';
}

// CSS untuk efek getar dan animasi (ditambahkan via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes objectShake {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-5px) rotate(-2deg); }
        75% { transform: translateX(5px) rotate(2deg); }
    }
    
    .object.attracted {
        z-index: 25;
    }
    
    .object.attached {
        filter: brightness(1.2) drop-shadow(0 0 5px rgba(33, 150, 243, 0.5));
        transition: all 0.3s ease;
    }
    
    .magnet.active {
        animation: magnetGlow 1s ease-in-out infinite;
    }
    
    @keyframes magnetGlow {
        0%, 100% { 
            filter: drop-shadow(0 0 5px rgba(33, 150, 243, 0.5));
        }
        50% { 
            filter: drop-shadow(0 0 15px rgba(33, 150, 243, 0.8));
        }
    }
`;
document.head.appendChild(style);

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    ubahBenda(); // Set benda default
    
    // Fallback jika gambar tidak ditemukan
    const magnetImg = document.querySelector('.magnet-image');
    const pakuImg = document.querySelector('.paku .object-image');
    const penghapusImg = document.querySelector('.penghapus .object-image');
    
    magnetImg.onerror = function() {
        console.log('Gambar magnet.png tidak ditemukan, menggunakan fallback');
        magnetImg.style.display = 'none';
        const fallbackMagnet = document.createElement('div');
        fallbackMagnet.style.cssText = `
            width: 120px;
            height: 60px;
            background: linear-gradient(45deg, #ff4444, #ff6666);
            border-radius: 10px;
            position: relative;
            border: 3px solid #cc0000;
        `;
        // Tambahkan label N dan S
        const northLabel = document.createElement('div');
        northLabel.style.cssText = `
            position: absolute;
            top: 5px;
            left: 10px;
            color: white;
            font-weight: bold;
            font-size: 14px;
        `;
        northLabel.textContent = 'N';
        
        const southLabel = document.createElement('div');
        southLabel.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            color: white;
            font-weight: bold;
            font-size: 14px;
        `;
        southLabel.textContent = 'S';
        
        fallbackMagnet.appendChild(northLabel);
        fallbackMagnet.appendChild(southLabel);
        magnet.appendChild(fallbackMagnet);
    };
    
    pakuImg.onerror = function() {
        console.log('Gambar paku.png tidak ditemukan, menggunakan fallback');
        pakuImg.style.display = 'none';
        const fallbackPaku = document.createElement('div');
        fallbackPaku.style.cssText = `
            width: 60px;
            height: 20px;
            background: linear-gradient(#888888, #666666);
            border-radius: 5px;
            position: relative;
        `;
        // Tambahkan kepala paku
        const pakuHead = document.createElement('div');
        pakuHead.style.cssText = `
            width: 25px;
            height: 8px;
            background: #aaaaaa;
            border-radius: 3px;
            position: absolute;
            top: -4px;
            left: 17px;
        `;
        fallbackPaku.appendChild(pakuHead);
        pakuObject.appendChild(fallbackPaku);
    };
    
    penghapusImg.onerror = function() {
        console.log('Gambar penghapus.png tidak ditemukan, menggunakan fallback');
        penghapusImg.style.display = 'none';
        const fallbackPenghapus = document.createElement('div');
        fallbackPenghapus.style.cssText = `
            width: 70px;
            height: 25px;
            background: linear-gradient(#ff9999, #ff6666);
            border-radius: 8px;
            position: relative;
        `;
        penghapusObject.appendChild(fallbackPenghapus);
    };
});