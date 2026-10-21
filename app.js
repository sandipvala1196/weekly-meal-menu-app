// Data Constants
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const meals = ["Breakfast", "Lunch", "Dinner"];

let currentFilter = "All";

let menuData = JSON.parse(localStorage.getItem('weeklyMenuData')) || {
    Monday: { Breakfast: { dish: 'Aloo Paratha', note: 'Serve with fresh curd' }, Lunch: { dish: 'Gujarati Thali', note: 'Less oil in Shak' }, Dinner: { dish: 'Khichdi Kadhi', note: '' } },
    Tuesday: { Breakfast: { dish: 'Poha & Tea', note: 'Add lemon' }, Lunch: { dish: 'Roti & Bhindi Fry', note: '' }, Dinner: { dish: 'Fix Thali', note: '' } },
    Wednesday: { Breakfast: { dish: 'Upma', note: '' }, Lunch: { dish: 'Dal Fry & Rice', note: '' }, Dinner: { dish: 'Dosa / Uttapam', note: 'Sambhar extra' } },
    Thursday: { Breakfast: { dish: 'Idli Sambhar', note: '' }, Lunch: { dish: 'Paneer Butter Masala & Naan', note: 'Special lunch' }, Dinner: { dish: 'Light Soup & Salad', note: '' } },
    Friday: { Breakfast: { dish: 'Sandwich', note: 'Toasted' }, Lunch: { dish: 'Chole Bhature', note: '' }, Dinner: { dish: 'Pizza / Pasta', note: 'Weekend special' } }
};

// Canvas Floating Particles Animation
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const icons = ['🍲', '🥗', '🥞', '🍳', '☕', '🍕', '🌮'];
    const particles = Array.from({ length: 18 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 16,
        speedY: Math.random() * 0.4 + 0.1,
        icon: icons[Math.floor(Math.random() * icons.length)],
        opacity: Math.random() * 0.4 + 0.1
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.font = `${p.size}px serif`;
            ctx.globalAlpha = p.opacity;
            ctx.fillText(p.icon, p.x, p.y);
            p.y -= p.speedY;
            if (p.y < -30) {
                p.y = canvas.height + 30;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Dark/Light Theme Toggle
function setupTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        toggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-moon text-sm"></i>' : '<i class="fa-solid fa-sun text-sm text-amber-500"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.remove('dark');
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun text-sm text-amber-500"></i>';
    }
}

// Password Eye Toggle
function togglePassword(inputId, eyeId) {
    const pwd = document.getElementById(inputId);
    const icon = document.getElementById(eyeId);
    if (!pwd || !icon) return;
    if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.className = 'fa-regular fa-eye-slash';
    } else {
        pwd.type = 'password';
        icon.className = 'fa-regular fa-eye';
    }
}

// Auth Tab Switching (Sign In vs Register)
function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const formUserPass = document.getElementById('formUserPass');
    const formMobile = document.getElementById('formMobile');
    const formRegister = document.getElementById('formRegister');
    const modeSwitchContainer = document.getElementById('modeSwitchContainer');

    if (!tabLogin || !tabRegister) return;

    if (tab === 'login') {
        tabLogin.className = "flex-1 py-2 rounded-lg text-xs font-semibold transition bg-amber-500 text-white shadow";
        tabRegister.className = "flex-1 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition";
        if (modeSwitchContainer) modeSwitchContainer.classList.remove('hidden');
        switchLoginMode('userpass');
    } else {
        tabRegister.className = "flex-1 py-2 rounded-lg text-xs font-semibold transition bg-amber-500 text-white shadow";
        tabLogin.className = "flex-1 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition";
        if (modeSwitchContainer) modeSwitchContainer.classList.add('hidden');
        if (formUserPass) formUserPass.classList.add('hidden');
        if (formMobile) formMobile.classList.add('hidden');
        if (formRegister) formRegister.classList.remove('hidden');
    }
}

// Login Mode Switching (Username/Password vs Mobile Number OTP)
function switchLoginMode(mode) {
    const modeUserPass = document.getElementById('modeUserPass');
    const modeMobile = document.getElementById('modeMobile');
    const formUserPass = document.getElementById('formUserPass');
    const formMobile = document.getElementById('formMobile');

    if (!modeUserPass || !modeMobile) return;

    if (mode === 'userpass') {
        modeUserPass.className = "text-amber-400 border-b-2 border-amber-400 pb-1 font-semibold";
        modeMobile.className = "text-slate-400 hover:text-slate-200 pb-1";
        if (formUserPass) formUserPass.classList.remove('hidden');
        if (formMobile) formMobile.classList.add('hidden');
    } else {
        modeMobile.className = "text-amber-400 border-b-2 border-amber-400 pb-1 font-semibold";
        modeUserPass.className = "text-slate-400 hover:text-slate-200 pb-1";
        if (formMobile) formMobile.classList.remove('hidden');
        if (formUserPass) formUserPass.classList.add('hidden');
    }
}

// Universal Submit Handler
function handleAuthSubmit(e) {
    e.preventDefault();
    window.location.href = 'dashboard.html';
}

// Dashboard Tab Rendering
function renderTabs() {
    const tabContainer = document.getElementById('dayTabs');
    if (!tabContainer) return;

    const list = ["All", ...days];
    tabContainer.innerHTML = list.map(day => `
        <button onclick="filterDay('${day}')" class="px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${currentFilter === day ? 'bg-amber-500 text-white shadow-md' : 'glass-card text-slate-400 hover:text-white'}">
            ${day}
        </button>
    `).join('');
}

function filterDay(day) {
    currentFilter = day;
    renderTabs();
    renderDashboard();
}

// Dashboard Grid Rendering
function renderDashboard() {
    const grid = document.getElementById('weeklyGrid');
    if (!grid) return;

    const displayDays = currentFilter === 'All' ? days : [currentFilter];

    grid.innerHTML = displayDays.map(day => `
        <div class="glass-card rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 class="font-bold text-amber-400 flex items-center gap-2">
                    <i class="fa-regular fa-calendar text-xs"></i> ${day}
                </h3>
                <span class="text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">Mon - Fri</span>
            </div>

            <div class="space-y-3">
                ${meals.map(meal => {
                    const item = menuData[day][meal];
                    const hasDish = item && item.dish.trim() !== '';
                    return `
                        <div class="bg-slate-900/40 dark:bg-slate-900/40 rounded-xl p-3 border border-white/5 relative group hover:border-amber-500/30 transition">
                            <div class="flex justify-between items-start mb-1">
                                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${meal}</span>
                                <button onclick="openEditModal('${day}', '${meal}')" class="text-slate-400 hover:text-amber-400 text-xs transition">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </div>
                            <div class="text-sm font-medium ${hasDish ? 'text-slate-100' : 'text-slate-500 italic'}">
                                ${hasDish ? item.dish : 'Not planned'}
                            </div>
                            ${item && item.note ? `
                                <div class="mt-2 text-xs text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 flex items-start gap-1.5">
                                    <i class="fa-solid fa-sticky-note text-amber-400 mt-0.5 text-[10px]"></i>
                                    <span>${item.note}</span>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// Modal Handlers
function openEditModal(day, meal) {
    const modalDay = document.getElementById('modalDay');
    const modalMeal = document.getElementById('modalMeal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDish = document.getElementById('modalDish');
    const modalNote = document.getElementById('modalNote');
    const editModal = document.getElementById('editModal');

    if (!editModal) return;

    modalDay.value = day;
    modalMeal.value = meal;
    modalTitle.innerText = `Edit ${day} - ${meal}`;
    modalDish.value = menuData[day][meal].dish || '';
    modalNote.value = menuData[day][meal].note || '';
    editModal.classList.remove('hidden');
}

function closeModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) editModal.classList.add('hidden');
}

function saveModalData(e) {
    e.preventDefault();
    const day = document.getElementById('modalDay').value;
    const meal = document.getElementById('modalMeal').value;
    const dish = document.getElementById('modalDish').value.trim();
    const note = document.getElementById('modalNote').value.trim();

    menuData[day][meal] = { dish, note };
    localStorage.setItem('weeklyMenuData', JSON.stringify(menuData));
    closeModal();
    renderDashboard();
}

// WhatsApp Menu Sharing
function shareOnWhatsApp() {
    let text = "🍽️ *MealCraft - Weekly Menu* 🍽️\n\n";

    days.forEach(day => {
        text += `📅 *${day.toUpperCase()}*\n`;
        meals.forEach(meal => {
            const item = menuData[day][meal];
            if (item && item.dish) {
                text += `  • *${meal}:* ${item.dish}\n`;
                if (item.note) {
                    text += `    📝 _Note:_ ${item.note}\n`;
                }
            } else {
                text += `  • *${meal}:* -\n`;
            }
        });
        text += "\n";
    });

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    setupTheme();
    renderTabs();
    renderDashboard();
});