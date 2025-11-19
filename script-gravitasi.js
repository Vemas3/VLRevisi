// Variabel simulasi
let simulasiBerjalan = false;
let startTime = 0;
let timerInterval = null;

// Elemen DOM
const fruitSelect = document.getElementById('fruitSelect');
const treeContainer = document.getElementById('treeContainer');
const tree = document.getElementById('tree');
const gravityEffect = document.getElementById('gravityEffect');
const currentFruit = document.getElementById('currentFruit');
const fallTime = document.getElementById('fallTime');
const gravityForce = document.getElementById('gravityForce');
const status = document.getElementById('status');

// Data buah-buahan
const fruitData = {
    apel: {
        name: 'Apel 🍎',
        color: '#ff4444',
        fallSpeed: 1.8,
        message: '🍎 Apel jatuh karena gaya gravitasi! Semua buah akan jatuh ke bawah menuju bumi.'
    },
    jeruk: {
        name: 'Jeruk 🍊', 
        color: '#ff8800',
        fallSpeed: 1.6,
        message: '🍊 Jeruk jatuh ke tanah! Gaya gravitasi menarik semua benda ke pusat bumi.'
    },
    mangga: {
        name: 'Mangga 🥭',
        color: '#ffcc00',
        fallSpeed: 2.0,
        message: '🥭 Mangga jatuh dengan cepat! Benda yang lebih berat cenderung jatuh lebih cepat.'
    },
    semua: {
        name: 'Semua Buah',
        color: 'mixed',
        fallSpeed: 1.7,
        message: '🌳 Semua buah jatuh bersamaan! Gaya gravitasi mempengaruhi semua benda tanpa terkecuali.'
    }
};

// Posisi buah di pohon - POSISI RELATIF DALAM TREE CONTAINER
const fruitPositions = [
    // Posisi di cabang atas (sekitar 20-30% dari tinggi container)
    { top: '10%', left: '45%' },
    { top: '15%', left: '60%' },
    { top: '13%', left: '35%' },
    // Posisi di cabang tengah (sekitar 40-60% dari tinggi container)
    { top: '20%', left: '65%' },
    { top: '20%', left: '25%' },
    // Posisi di cabang bawah (sekitar 70-80% dari tinggi container)
    { top: '25%', left: '55%' },
    { top: '26%', left: '35%' }
];

// Fungsi untuk membuat gambar pohon dari PNG
function buatPohonGambar() {
    const img = document.createElement('img');
    img.src = 'asset/pohon.png';
    img.alt = 'Pohon';
    img.classList.add('tree-image');
    img.style.objectPosition = 'bottom'; // PASTIKAN BAGIAN BAWAH POHON DI BAWAH
    return img;
}

// Fungsi untuk membuat gambar SVG buah
function buatBuahSVG(jenis, warna) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "28");
    svg.setAttribute("viewBox", "0 0 40 40");
    svg.classList.add("fruit-image");

    // Bentuk buah (lingkaran untuk apel/jeruk, oval untuk mangga)
    let buah;
    if (jenis === 'mangga') {
        buah = document.createElementNS(svgNS, "ellipse");
        buah.setAttribute("cx", "20");
        buah.setAttribute("cy", "20");
        buah.setAttribute("rx", "8");
        buah.setAttribute("ry", "10");
    } else {
        buah = document.createElementNS(svgNS, "circle");
        buah.setAttribute("cx", "20");
        buah.setAttribute("cy", "20");
        buah.setAttribute("r", "9");
    }
    buah.setAttribute("fill", warna);
    
    // Highlight untuk efek 3D
    const highlight = document.createElementNS(svgNS, "ellipse");
    highlight.setAttribute("cx", "16");
    highlight.setAttribute("cy", "16");
    highlight.setAttribute("rx", "3");
    highlight.setAttribute("ry", "4");
    highlight.setAttribute("fill", "rgba(255,255,255,0.4)");
    
    // Tangkai buah
    const tangkai = document.createElementNS(svgNS, "rect");
    tangkai.setAttribute("x", "19");
    tangkai.setAttribute("y", "10");
    tangkai.setAttribute("width", "2");
    tangkai.setAttribute("height", "5");
    tangkai.setAttribute("fill", "#8B4513");

    svg.appendChild(buah);
    svg.appendChild(highlight);
    svg.appendChild(tangkai);
    
    return svg;
}

// Fungsi ubah jenis buah
function ubahBuah() {
    const selectedFruit = fruitSelect.value;
    const fruit = fruitData[selectedFruit];
    
    // Reset simulasi
    resetPosisi();
    
    // Update data display
    currentFruit.textContent = fruit.name;
    gravityForce.textContent = 'Menarik ke Bawah';
    
    // Buat buah di pohon
    buatBuahDiPohon(selectedFruit);
    
    // Reset status
    resetData();
}

// Fungsi reset posisi
function resetPosisi() {
    // Hapus semua buah yang ada
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
    
    // Reset efek gravitasi
    gravityEffect.classList.remove('active');
    
    // Reset status
    status.textContent = 'Siap';
}

// Fungsi buat buah di pohon - SEKARANG DI DALAM TREE CONTAINER
function buatBuahDiPohon(jenis) {
    const fruit = fruitData[jenis];
    
    if (jenis === 'semua') {
        // Buat semua jenis buah
        const jenisBuah = ['apel', 'jeruk', 'mangga'];
        fruitPositions.forEach((pos, index) => {
            const fruitType = jenisBuah[index % 3];
            const fruitDataItem = fruitData[fruitType];
            buatBuahElement(fruitDataItem, pos, index);
        });
    } else {
        // Buat satu jenis buah
        fruitPositions.forEach((pos, index) => {
            buatBuahElement(fruit, pos, index);
        });
    }
}

// Fungsi buat elemen buah - SEKARANG DI DALAM TREE CONTAINER
function buatBuahElement(fruitData, position, index) {
    const fruitDiv = document.createElement('div');
    fruitDiv.className = 'fruit';
    fruitDiv.style.position = 'absolute';
    fruitDiv.style.top = position.top;
    fruitDiv.style.left = position.left;
    fruitDiv.style.zIndex = '15';
    fruitDiv.style.transition = 'all 0.3s ease';
    fruitDiv.style.transform = 'translate(-50%, -50%)'; // Center the fruit
    
    const fruitSVG = buatBuahSVG(fruitSelect.value, fruitData.color);
    fruitDiv.appendChild(fruitSVG);
    
    // Tambahkan buah ke dalam tree container, bukan simulation area
    treeContainer.appendChild(fruitDiv);
    return fruitDiv;
}

// Fungsi mulai simulasi
function mulaiSimulasi() {
    if (simulasiBerjalan) return;
    
    simulasiBerjalan = true;
    status.textContent = 'Buah Jatuh...';
    
    const selectedFruit = fruitSelect.value;
    const fruit = fruitData[selectedFruit];
    
    // Aktifkan efek gravitasi
    gravityEffect.classList.add('active');
    
    // Mulai timer
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
    
    // Animasikan buah jatuh
    setTimeout(() => {
        const semuaBuah = document.querySelectorAll('.fruit');
        semuaBuah.forEach((fruit, index) => {
            setTimeout(() => {
                // Tambahkan class falling untuk trigger animasi CSS
                fruit.classList.add('falling');
            }, index * 200); // Staggered falling
        });
    }, 500);
    
    // Selesaikan simulasi
    setTimeout(() => {
        selesaikanSimulasi(fruit);
    }, 4000);
}

// Fungsi update timer
function updateTimer() {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000;
    fallTime.textContent = elapsed.toFixed(1) + ' detik';
}

// Fungsi selesaikan simulasi
function selesaikanSimulasi(fruit) {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    
    status.textContent = 'Selesai';
    
    // Tampilkan hasil final
    const finalTime = (Date.now() - startTime) / 1000;
    fallTime.textContent = finalTime.toFixed(1) + ' detik';
    
    // Berikan feedback
    setTimeout(() => {
        alert(fruit.message);
    }, 500);
}

// Fungsi reset simulasi
function resetSimulasi() {
    simulasiBerjalan = false;
    clearInterval(timerInterval);
    
    // Reset semua posisi dan efek
    resetPosisi();
    
    // Buat ulang buah di pohon
    ubahBuah();
    
    // Reset data
    resetData();
}

// Fungsi reset data
function resetData() {
    fallTime.textContent = '-';
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Buat pohon dari PNG
    const treeImg = buatPohonGambar();
    tree.appendChild(treeImg);
    
    // Set buah default
    ubahBuah();
    
    // Event listener untuk tombol keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !simulasiBerjalan) {
            mulaiSimulasi();
        } else if (e.key === 'Escape') {
            resetSimulasi();
        }
    });
    
    // Fallback jika gambar pohon tidak ditemukan
    treeImg.onerror = function() {
        console.log('Gambar pohon.png tidak ditemukan, menggunakan SVG fallback');
        tree.innerHTML = '';
        const fallbackTree = document.createElement('div');
        fallbackTree.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #8B4513 40%, #2E7D32 40%);
            border-radius: 100px 100px 10px 10px;
            position: relative;
        `;
        tree.appendChild(fallbackTree);
    };
});