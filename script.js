const API_KEY = 'b9e5f4bb8b4a4001baf09352da5bd70c';

// --- SMOOTH MAGNETIC CURSOR LOGIC ---
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
let mX = 0, mY = 0, oX = 0, oY = 0;

window.addEventListener('mousemove', e => {
    mX = e.clientX; 
    mY = e.clientY;
    // Inner dot moves instantly
    dot.style.left = mX + 'px'; 
    dot.style.top = mY + 'px';
});

// Smooth Lerp for the outer ring
function lerpCursor() {
    oX += (mX - oX) * 0.15;
    oY += (mY - oY) * 0.15;
    outline.style.left = oX + 'px';
    outline.style.top = oY + 'px';
    requestAnimationFrame(lerpCursor);
}
lerpCursor();

// --- UI INTERACTION FUNCTIONS ---
function addCursorEvents() {
    // Triggers the expand effect on hover
    document.querySelectorAll('.interactive, .card, button, input, span, a').forEach(el => {
        el.onmouseenter = () => outline.classList.add('cursor-active');
        el.onmouseleave = () => outline.classList.remove('cursor-active');
    });
}

function toggleNav(id) {
    document.getElementById(id).classList.toggle('active');
}

function updateInfo() {
    const hrs = new Date().getHours();
    const greet = document.getElementById('dynamic-greeting');
    if (hrs < 12) greet.innerText = "Good Morning";
    else if (hrs < 18) greet.innerText = "Good Afternoon";
    else greet.innerText = "Good Evening";

    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('full-date').innerText = new Date().toLocaleDateString('en-US', options).toUpperCase();
}

// --- NEWS & SHARING LOGIC ---
async function fetchNews(q = "") {
    const grid = document.getElementById('news-grid');
    const url = q ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&apiKey=${API_KEY}`
                  : `https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        grid.innerHTML = data.articles.map((art, index) => {
            const newsUrl = encodeURIComponent(art.url);
            const newsTitle = encodeURIComponent(art.title);
            
            return `
            <div class="card interactive">
                <div class="share-container">
                    <div class="share-trigger interactive" onclick="toggleShareMenu(${index})">
                        <i class="fas fa-ellipsis-v"></i>
                    </div>
                    <div id="share-menu-${index}" class="share-menu">
                        <a class="interactive" href="https://wa.me/?text=${newsTitle}%20${newsUrl}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                        <a class="interactive" href="https://twitter.com/intent/tweet?url=${newsUrl}&text=${newsTitle}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
                        <a class="interactive" href="https://www.facebook.com/sharer/sharer.php?u=${newsUrl}" target="_blank"><i class="fab fa-facebook"></i> Facebook</a>
                        <a class="interactive" href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i> Instagram</a>
                    </div>
                </div>
                <img style="width:100%; height:160px; object-fit:cover;" src="${art.urlToImage || 'https://via.placeholder.com/400x200'}" alt="img">
                <div style="padding:20px;">
                    <h3 style="font-size:0.9rem; line-height:1.3; margin-bottom:10px;">${art.title}</h3>
                    <a href="${art.url}" target="_blank" class="interactive" style="color:var(--accent); font-size:0.7rem; font-weight:800; text-decoration:none;">READ INTEL →</a>
                </div>
            </div>`;
        }).join('');
        
        addCursorEvents(); // Re-attach cursor hover logic to new cards
    } catch (e) { 
        console.error("API Error:", e); 
    }
}

function toggleShareMenu(index) {
    // Close all other share menus first
    document.querySelectorAll('.share-menu').forEach((menu, i) => {
        if(i !== index) menu.classList.remove('active');
    });
    const menu = document.getElementById(`share-menu-${index}`);
    menu.classList.toggle('active');
}

// Close share menus when clicking outside
window.addEventListener('click', (e) => {
    if (!e.target.closest('.share-container')) {
        document.querySelectorAll('.share-menu').forEach(menu => menu.classList.remove('active'));
    }
});

function handleSearch() {
    const v = document.getElementById('search-input').value;
    if (v.trim()) {
        fetchNews(v);
        window.scrollTo({top: window.innerHeight * 0.7, behavior: 'smooth'});
    }
}

function quickSearch(tag) {
    document.getElementById('search-input').value = tag;
    handleSearch();
    // Close sidebar after clicking a suggestion
    document.querySelectorAll('.side-nav').forEach(n => n.classList.remove('active'));
}

function setMode(m) {
    document.body.className = m;
    toggleNav('left-nav');
}

// Initialize System
window.onload = () => {
    updateInfo();
    fetchNews();
    addCursorEvents();
};