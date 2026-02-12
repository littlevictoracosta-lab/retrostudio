// --- CONFIGURATION ---
const admins = ["DynaStudio", "TrustedFriend"]; 
let games = JSON.parse(localStorage.getItem('retroGames')) || [];
let currentUser = null;

const catalogItems = [
    { id: 1, name: "VIP Tag", price: 50, icon: "🏷️" },
    { id: 2, name: "Gold Skin", price: 200, icon: "✨" },
    { id: 3, name: "Owner Cape", price: 1000, icon: "🧣" },
    { id: 4, name: "Fire Sword", price: 150, icon: "🔥" }
];

// --- AUTHENTICATION ---
function handleSignup() {
    const u = document.getElementById('u-name').value;
    const p = document.getElementById('u-pass').value;
    if(!u || !p) return alert("Enter details!");
    if(localStorage.getItem(u)) return alert("User exists!");
    
    // New users get 10 Tix and an empty Inventory
    localStorage.setItem(u, JSON.stringify({pass: p, tix: 10, inventory: []}));
    alert("Signed up! Log in to get your 10 Tix.");
}

function handleLogin() {
    const u = document.getElementById('u-name').value;
    const p = document.getElementById('u-pass').value;

    if(localStorage.getItem("ban_" + u)) return alert("ACCOUNT BANNED.");

    const data = localStorage.getItem(u);
    if(data && JSON.parse(data).pass === p) {
        currentUser = u;
        const userData = JSON.parse(data);
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'flex';
        document.getElementById('user-display').innerText = u;
        
        updateTixDisplay(userData.tix);
        if(admins.includes(u)) document.getElementById('admin-btn').style.display = 'block';
        
        renderGames();
        renderCatalog();
        updateAnnouncements();
    } else { alert("Invalid login!"); }
}

// --- CATALOG LOGIC ---
function renderCatalog() {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = "";
    catalogItems.forEach(item => {
        grid.innerHTML += `
            <div class="item-card">
                <div class="item-icon">${item.icon}</div>
                <h3>${item.name}</h3>
                <button class="buy-btn" onclick="buyItem(${item.id})">🎟️ ${item.price}</button>
            </div>`;
    });
}

function buyItem(id) {
    let data = JSON.parse(localStorage.getItem(currentUser));
    let item = catalogItems.find(i => i.id === id);

    if (data.tix < item.price) return alert("Not enough Tix!");
    if (data.inventory.includes(item.name)) return alert("Already owned!");

    data.tix -= item.price;
    data.inventory.push(item.name);
    localStorage.setItem(currentUser, JSON.stringify(data));
    updateTixDisplay(data.tix);
    alert("Purchased " + item.name + "!");
}

// --- COMMAND CONSOLE (Press ;) ---
window.addEventListener("keydown", (e) => {
    if(e.key === ";" && admins.includes(currentUser)) {
        const consoleEl = document.getElementById('cmd-console');
        consoleEl.style.display = consoleEl.style.display === 'none' ? 'block' : 'none';
        document.getElementById('cmd-box').focus();
    }
});

document.getElementById('cmd-box').addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        executeCommand(e.target.value);
        e.target.value = "";
        document.getElementById('cmd-console').style.display = 'none';
    }
});

function executeCommand(input) {
    let args = input.split(" ");
    let cmd = args[0].toLowerCase();
    
    if(cmd === "/tix") {
        let target = args[1];
        let amt = parseInt(args[2]);
        let data = JSON.parse(localStorage.getItem(target));
        if(data) {
            data.tix += amt;
            localStorage.setItem(target, JSON.stringify(data));
            if(target === currentUser) updateTixDisplay(data.tix);
            alert("Sent Tix.");
        }
    }
    
    if(cmd === "/alert") {
        localStorage.setItem('announcement', "[ALERT]: " + args.slice(1).join(" "));
        updateAnnouncements();
    }

    if(cmd === "/ban") {
        localStorage.setItem("ban_" + args[1], "true");
        alert("Banned user.");
    }
}

// --- UI HELPERS ---
function updateTixDisplay(amt) { document.getElementById('tix-display').innerText = "🎟️ " + amt; }

function showTab(t) {
    ['games-tab', 'catalog-tab', 'develop-tab', 'admin-tab'].forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(t + '-tab').style.display = 'block';
}

function openModal() { document.getElementById('game-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('game-modal').style.display = 'none'; }

function saveGame() {
    let name = document.getElementById('place-name').value;
    if(!name) return;
    games.push({name: name});
    localStorage.setItem('retroGames', JSON.stringify(games));
    closeModal();
    renderGames();
}

function renderGames() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = "";
    games.forEach(g => {
        grid.innerHTML += `<div class="game-card" data-name="${g.name.toLowerCase()}">
            <div class="thumb"></div><h3>${g.name}</h3><button class="play-btn">Join</button>
        </div>`;
    });
}

function updateAnnouncements() {
    const bar = document.getElementById('announcement-bar');
    const msg = localStorage.getItem('announcement');
    if(msg) { bar.innerText = msg; bar.style.display = 'block'; }
    else { bar.style.display = 'none'; }
}

function filterGames() {
    let s = document.getElementById('search-bar').value.toLowerCase();
    document.querySelectorAll('.game-card').forEach(c => {
        c.style.display = c.getAttribute('data-name').includes(s) ? "block" : "none";
    });
}