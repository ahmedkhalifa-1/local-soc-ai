// ============ STATE ============
let chats = JSON.parse(localStorage.getItem("soc_chats") || "{}");
let currentChatId = localStorage.getItem("soc_current") || null;

const chatWindow = document.getElementById("chatWindow");
const chatList = document.getElementById("chatList");
const userInput = document.getElementById("userInput");

// ============ HELPERS ============
function isArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
}

function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid() {
    return "chat_" + Date.now();
}

function saveState() {
    localStorage.setItem("soc_chats", JSON.stringify(chats));
    localStorage.setItem("soc_current", currentChatId);
}

// ============ CHAT MANAGEMENT ============
function newChat() {
    const id = uid();
    chats[id] = { title: "New Chat", preview: "", messages: [] };
    currentChatId = id;
    saveState();
    renderChatList();
    renderMessages();
}

function clearAllChats() {
    if (!confirm("Clear all chats? / مسح كل المحادثات؟")) return;
    chats = {};
    currentChatId = null;
    saveState();
    renderChatList();
    renderMessages();
}

function selectChat(id) {
    currentChatId = id;
    saveState();
    renderChatList();
    renderMessages();
}

function renderChatList() {
    chatList.innerHTML = "";
    const ids = Object.keys(chats).sort((a, b) => b.localeCompare(a));
    ids.forEach(id => {
        const chat = chats[id];
        const item = document.createElement("div");
        item.className = "chat-item" + (id === currentChatId ? " active" : "");
        item.onclick = () => selectChat(id);
        item.innerHTML = `
            <div class="chat-item-top">
                <span>${chat.title}</span>
                <time>${chat.time || ""}</time>
            </div>
            <p>${chat.preview || "..."}</p>
        `;
        chatList.appendChild(item);
    });
}

function renderMessages() {
    chatWindow.innerHTML = "";
    if (!currentChatId || !chats[currentChatId]) return;

    chats[currentChatId].messages.forEach(m => {
        appendMessage(m.role, m.text, m.time, false);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ============ MESSAGE RENDERING ============
function appendMessage(role, text, time, animate = true) {
    const dir = isArabic(text) ? "rtl" : "ltr";

    if (role === "user") {
        const div = document.createElement("div");
        div.className = "msg user";
        div.setAttribute("dir", dir);
        div.innerHTML = `${escapeHtml(text)}<span class="msg-time">${time}</span>`;
        chatWindow.appendChild(div);
    } else {
        const row = document.createElement("div");
        row.className = "bot-row";
        row.innerHTML = `
            <div class="bot-avatar">🤖</div>
            <div class="msg bot" dir="${dir}">
                ${formatBotText(text)}
                <span class="msg-time">${time}</span>
                <div class="msg-actions">
                    <span title="Copy" onclick="copyText(this)">📋</span>
                    <span title="Like">👍</span>
                    <span title="Dislike">👎</span>
                </div>
            </div>
        `;
        chatWindow.appendChild(row);
    }

    if (animate) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function formatBotText(text) {
    // simple markdown-ish formatting: **bold**, bullet lines starting with -
    let html = escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
    return `<div class="bot-text">${html}</div>`;
}

function copyText(el) {
    const text = el.closest(".msg").querySelector(".bot-text").innerText;
    navigator.clipboard.writeText(text);
    el.textContent = "✅";
    setTimeout(() => (el.textContent = "📋"), 1200);
}

// ============ TYPING INDICATOR ============
function showTyping() {
    const row = document.createElement("div");
    row.className = "bot-row";
    row.id = "typingRow";
    row.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="msg bot">
            <div class="typing"><span></span><span></span><span></span></div>
        </div>
    `;
    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTyping() {
    const row = document.getElementById("typingRow");
    if (row) row.remove();
}

// ============ SEND MESSAGE ============
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    if (!currentChatId) newChat();

    const time = getTime();

    appendMessage("user", text, time);
    chats[currentChatId].messages.push({ role: "user", text, time });

    if (chats[currentChatId].title === "New Chat") {
        chats[currentChatId].title = text.slice(0, 28) + (text.length > 28 ? "..." : "");
    }
    chats[currentChatId].preview = text.slice(0, 40);
    chats[currentChatId].time = time;

    saveState();
    renderChatList();

    userInput.value = "";
    autoResize();
    showTyping();

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "message=" + encodeURIComponent(text)
        });

        const data = await res.json();
        hideTyping();

        const botTime = getTime();
        appendMessage("bot", data.response, botTime);
        chats[currentChatId].messages.push({ role: "bot", text: data.response, time: botTime });
        saveState();
    } catch (err) {
        hideTyping();
        const errMsg = "⚠️ Error connecting to server / خطأ في الاتصال بالسيرفر";
        appendMessage("bot", errMsg, getTime());
    }
}

// ============ INPUT EVENTS ============
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function autoResize() {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
}
userInput.addEventListener("input", autoResize);

// ============ THEME TOGGLE ============
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
    localStorage.setItem("soc_theme", document.body.classList.contains("light") ? "light" : "dark");
});

// ============ SEARCH CHATS ============
document.getElementById("searchChats").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll(".chat-item").forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(q) ? "" : "none";
    });
});

// ============ INIT ============
function init() {
    if (localStorage.getItem("soc_theme") === "light") {
        document.body.classList.add("light");
        themeToggle.textContent = "☀️";
    }

    if (Object.keys(chats).length === 0) {
        newChat();
    } else {
        if (!currentChatId || !chats[currentChatId]) {
            currentChatId = Object.keys(chats)[0];
        }
        renderChatList();
        renderMessages();
    }
}

init();