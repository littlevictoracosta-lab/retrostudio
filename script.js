// --- OWNER SETTINGS ---
const admins = ["DynaStudio", "TrustedFriend"]; 

let games = JSON.parse(localStorage.getItem('retroGames')) || [];

// --- LOGIN & SIGNUP ---
function handleSignup() {
    const u = document.getElementById('u-name').value;
    const p = document.getElementById('u-pass').value;
    if(!u || !p) return alert("Fill in details");
    if(localStorage.getItem(u)) return alert("User exists!");
    localStorage.setItem(u, JSON.stringify({pass: p}));
    alert("Signed up!");
}

function handleLogin() {
    const u = document.getElementById('u-name').value;
    const p = document.getElementById('u-pass').value;

    if(localStorage.getItem("ban_" + u)) return alert("THIS ACCOUNT IS TERMINATED.");

    const data = localStorage.getItem(u);
    if(data && JSON.parse(data).pass === p) {
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'flex';
        document.getElementById('user-display').innerText = u;

        if(admins.includes(u)) document.getElementById('admin-btn').style.display = 'block';
        updateAnnouncements();
        renderGames();
    } else { alert("Invalid login!"); }
}

// --- COMMAND CONSOLE LOGIC ---
window.addEventListener("keydown", (e) => {
    const currentUser = document.getElementById('user-display').innerText;
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

// --- THE MASTER COMMAND LIST ---
function executeCommand(input) {
    let args = input.split(" ");
    let cmd = args[0].toLowerCase();
    let target = args[1];
    let message = args.slice(1).join(" ");

    switch(cmd) {
        case "/help":
            alert("COMMANDS:\n/ban [user]\n/unban [user]\n/alert [text]\n/clearalerts\n/wipegames\n/shutdown");
            break;
        
        case "/ban":
            localStorage.setItem("ban_" + target, "true");
            alert(target + " banned.");
            break;

        case "/unban":
            localStorage.removeItem("ban_" + target);
            alert(target + " unbanned.");
            break;

        case "/alert":
            localStorage.setItem('announcement', "[SYSTEM]: " + message);
            updateAnnouncements();
            break;

        case "/clearalerts":
            localStorage.removeItem('announcement');
            updateAnnouncements();
            break;

        case "/wipegames":
            if(confirm("Wipe all games?")) {
                localStorage.removeItem('retroGames');
                location.reload();
            }
            break;

        case "/shutdown":
            localStorage.setItem('announcement', "PLATFORM SHUTTING DOWN FOR MAINTENANCE");
            updateAnnouncements();
            break;

        default:
            alert("Unknown command. Type /help");
    }
}

// --- DASHBOARD FUNCTIONS ---
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