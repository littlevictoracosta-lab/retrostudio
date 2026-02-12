// --- OWNER SETTINGS ---
const admins = ["DynaStudio", "TrustedFriend"]; 

let games = JSON.parse(localStorage.getItem('retroGames')) || [];
let currentUser = null;

// --- AUTHENTICATION ---
function handleSignup() {
    const u = document.getElementById('u-name').value;
    const p = document.getElementById('u-pass').value;
    if(!u || !p) return alert("Fill in details");
    if(localStorage.getItem(u)) return alert("User exists!");

    // Start users with 10 Tix
    const userData = { pass: p, tix: 10 };
    localStorage.setItem(u, JSON.stringify(userData));
    alert("Signed up! You got 10 Tix starter bonus.");
}

function handleLogin() {
    const u = document.getElementById('u-name').value;
    const p = document.getElementById('u-pass').value;

    if(localStorage.getItem("ban_" + u)) return alert("BANNED.");

    const data = localStorage.getItem(u);
    if(data && JSON.parse(data).pass === p) {
        currentUser = u;
        const userData = JSON.parse(data);
        
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'flex';
        document.getElementById('user-display').innerText = u;
        
        updateTixDisplay(userData.tix);

        if(admins.includes(u)) document.getElementById('admin-btn').style.display = 'block';
        updateAnnouncements();
        renderGames();
    } else { alert("Invalid login!"); }
}

function updateTixDisplay(amount) {
    document.getElementById('tix-display').innerText = "🎟️ " + amount;
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
        let amount = parseInt(args[2]);
        let data = JSON.parse(localStorage.getItem(target));
        if(data) {
            data.tix += amount;
            localStorage.setItem(target, JSON.stringify(data));
            if(target === currentUser) updateTixDisplay(data.tix);
            alert("Gave " + amount + " Tix to " + target);
        }
    }
    
    if(cmd === "/ban") {
        localStorage.setItem("ban_" + args[1], "true");
        alert(args[1] + " banned.");
    }

    if(cmd === "/alert") {
        localStorage.setItem('announcement', "[SYSTEM]: " + args.slice(1).join(" "));
        updateAnnouncements();
    }
}

// --- HELPER FUNCTIONS ---
function showTab(t) {
    ['games-tab', 'develop-tab', 'admin-tab'].forEach(id => document.getElementById(id).style.display = 'none');
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
