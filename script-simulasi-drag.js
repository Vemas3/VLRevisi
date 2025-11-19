// Variabel global
let draggedObject = null;
let objectCount = 0;

// Inisialisasi drag and drop
function initDragAndDrop() {
    const dragObjects = document.querySelectorAll('.drag-object');
    const simulationArea = document.getElementById('simulationArea');
    
    // Event listeners untuk objek drag
    dragObjects.forEach(obj => {
        obj.addEventListener('dragstart', handleDragStart);
        obj.addEventListener('dragend', handleDragEnd);
    });
    
    // Event listeners untuk area drop
    simulationArea.addEventListener('dragover', handleDragOver);
    simulationArea.addEventListener('drop', handleDrop);
}

// Handle drag start
function handleDragStart(e) {
    draggedObject = this;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.type);
    e.dataTransfer.effectAllowed = 'copy';
}

// Handle drag end
function handleDragEnd() {
    this.classList.remove('dragging');
    draggedObject = null;
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    
    if (!draggedObject) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Buat objek baru di posisi drop
    createDroppedObject(
        draggedObject.dataset.type,
        draggedObject.dataset.src,
        x, y
    );
    
    // Update counter
    objectCount++;
    updateObjectCount();
}

// Update object count display
function updateObjectCount() {
    document.getElementById('objectCount').textContent = objectCount;
}

// Buat objek yang sudah di-drop
function createDroppedObject(type, src, x, y) {
    const droppedObj = document.createElement('div');
    droppedObj.className = 'dropped-object';
    droppedObj.dataset.type = type;
    
    // Atur posisi
    droppedObj.style.left = (x - 40) + 'px';
    droppedObj.style.top = (y - 40) + 'px';
    
    // Buat gambar
    const img = document.createElement('img');
    img.src = src;
    img.alt = type;
    img.onerror = function() {
        // Fallback jika gambar tidak ditemukan
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, #ff6b6b, #ffa726);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
        `;
        fallback.textContent = getFallbackIcon(type);
        droppedObj.appendChild(fallback);
    };
    
    droppedObj.appendChild(img);
    
    // Tambah label
    const label = document.createElement('div');
    label.className = 'object-label';
    label.textContent = getObjectName(type);
    droppedObj.appendChild(label);
    
    // Buat draggable untuk memindahkan objek
    makeDraggable(droppedObj);
    
    // Tambah ke area simulasi
    document.getElementById('simulationArea').appendChild(droppedObj);
}

// Buat objek yang sudah di-drop bisa dipindahkan
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.style.zIndex = '1000';
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + 'px';
        element.style.left = (element.offsetLeft - pos1) + 'px';
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.zIndex = '10';
    }
}

// Helper functions
function getFallbackIcon(type) {
    const icons = {
        'manusia': '👦',
        'mobil': '🚗',
        'bola': '🏀',
        'magnet': '🧲',
        'paku': '📌',
        'pegas': '🌀',
        'beban': '⚖️',
        'meja': '🪑',
        'aspal': '🛣️',
        'tanah': '🌱'
    };
    return icons[type] || '📦';
}

function getObjectName(type) {
    const names = {
        'manusia': 'Manusia',
        'mobil': 'Mobil',
        'bola': 'Bola',
        'magnet': 'Magnet',
        'paku': 'Paku',
        'pegas': 'Pegas',
        'beban': 'Beban',
        'meja': 'Meja',
        'aspal': 'Aspal',
        'tanah': 'Tanah'
    };
    return names[type] || 'Objek';
}