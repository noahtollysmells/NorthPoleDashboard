document.addEventListener('DOMContentLoaded', () => {
    const countdownEl = document.getElementById('countdown');
    const miniClock = document.getElementById('miniClock');
    const weatherEl = document.getElementById('weather');
    const giftEl = document.getElementById('giftQueue');
    const giftBar = document.getElementById('giftBar');
    const reindeerEl = document.getElementById('reindeer');
    const reindeerBar = document.getElementById('reindeerBar');
    const tempEl = document.getElementById('workshopTemp');
    const thermoFill = document.getElementById('thermoFill');
    const nnResult = document.getElementById('nnResult');
    const nameInput = document.getElementById('nameInput');
    const checkBtn = document.getElementById('checkBtn');
    const nnHistoryEl = document.getElementById('nnHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const themeToggle = document.getElementById('themeToggle');
    const snowContainer = document.getElementById('snow-container');

    function updateCountdown() {
        const now = new Date();
        const year = now.getFullYear();
        const target = new Date(`December 25, ${year} 00:00:00`);
        if (now > target) target.setFullYear(year + 1);
        const diff = target - now;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
    }

    function updateMiniClock() {
        const d = new Date();
        miniClock.textContent = d.toLocaleTimeString();
    }

    function safeWeather() {
        const options = ['Snowing -12°C', 'Light snow -8°C', 'Blizzard -18°C', 'Cloudy -5°C'];
        weatherEl.textContent = options[Math.floor(Math.random() * options.length)];
    }

    fetch('https://wttr.in/North+Pole?format=3').then(r => r.text()).then(t => {
        weatherEl.textContent = t;
    }).catch(() => safeWeather());

    let gifts = Math.floor(3000 + Math.random() * 7000);
    function updateGifts() {
        gifts = Math.max(0, gifts - Math.floor(Math.random() * 30));
        animateValue(giftEl, gifts);
        const pct = Math.min(100, Math.round((1 - gifts / 10000) * 100));
        giftBar.style.width = pct + '%';
    }

    let readiness = 80 + Math.floor(Math.random() * 20);
    function updateReindeer() {
        readiness = Math.max(0, Math.min(100, readiness + Math.floor(Math.random() * 7 - 3)));
        animateValue(reindeerEl, readiness);
        reindeerBar.style.width = readiness + '%';
    }

    let temp = -10 + Math.floor(Math.random() * 6);
    function updateTemp() {
        temp += Math.floor(Math.random() * 3 - 1);
        temp = Math.max(-25, Math.min(5, temp));
        animateValue(tempEl, temp);
        const fill = Math.round(((temp + 25) / 30) * 100);
        thermoFill.style.width = fill + '%';
    }

    function pickNice(name) {
        const list = ['Nice 🎁', 'Naughty ❌', 'Borderline 😬'];
        return list[Math.floor(Math.random() * list.length)];
    }

    checkBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name) return;
        const verdict = pickNice(name);
        const text = `${name} is: ${verdict}`;
        nnResult.textContent = text;
        const entry = {name, verdict, when: Date.now()};
        const raw = localStorage.getItem('nnHistory');
        const arr = raw ? JSON.parse(raw) : [];
        arr.unshift(entry);
        while (arr.length > 10) arr.pop();
        localStorage.setItem('nnHistory', JSON.stringify(arr));
        renderHistory();
    });

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkBtn.click();
    });

    function renderHistory() {
        const raw = localStorage.getItem('nnHistory');
        const arr = raw ? JSON.parse(raw) : [];
        nnHistoryEl.innerHTML = '';
        arr.forEach(item => {
            const li = document.createElement('li');
            const time = new Date(item.when).toLocaleTimeString();
            li.textContent = `${time} — ${item.name}: ${item.verdict}`;
            nnHistoryEl.appendChild(li);
        });
        if (arr.length === 0) nnHistoryEl.innerHTML = '<li>No checks yet</li>';
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('nnHistory');
        renderHistory();
    });

    function applyTheme(theme) {
        if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        const current = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
    });

    const savedTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    applyTheme(savedTheme);

    function createFlake() {
        if (window.innerWidth < 480 && Math.random() > 0.6) return;
        const f = document.createElement('div');
        f.className = 'flake';
        const size = 4 + Math.random() * 8;
        f.style.width = size + 'px';
        f.style.height = size + 'px';
        f.style.left = Math.random() * window.innerWidth + 'px';
        f.style.top = '-20px';
        f.style.opacity = 0.3 + Math.random() * 0.9;
        const duration = 6 + Math.random() * 8;
        f.style.transition = `transform ${duration}s linear, top ${duration}s linear, opacity ${duration}s linear`;
        snowContainer.appendChild(f);
        requestAnimationFrame(() => {
            const endX = (Math.random() - 0.5) * 200;
            f.style.transform = `translate(${endX}px, ${window.innerHeight + 50}px)`;
            f.style.top = window.innerHeight + 50 + 'px';
            f.style.opacity = 0.05;
        });
        setTimeout(() => f.remove(), (duration + 0.3) * 1000);
    }

        function drawSleigh() {
            const img = document.getElementById('sleighImg');
            const hero = document.querySelector('.hero');
            if (!img || !hero) return;
            const sleighW = img.offsetWidth || 220;
            img.style.position = 'absolute';
            img.style.top = '6px';
            let x = -sleighW;
            function frame() {
                const heroW = hero.clientWidth;
                const maxX = Math.max( heroW - Math.round(sleighW * 0.25),  Math.round(sleighW * 0.5) );
                const baseSpeed = Math.max(1, Math.round(heroW / 480));
                x += 1.2 * baseSpeed;
                if (x > maxX) x = -sleighW;
                img.style.transform = `translateX(${x}px)`;
                requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }

        function animateValue(el, to, duration = 800) {
            const start = Number(el.dataset.value || 0);
            const diff = to - start;
            const startTime = performance.now();
            function step(now) {
                const t = Math.min(1, (now - startTime) / duration);
                const val = Math.round(start + diff * t);
                el.textContent = val.toLocaleString();
                if (t < 1) requestAnimationFrame(step);
                else el.dataset.value = to;
            }
            requestAnimationFrame(step);
        }

    updateCountdown();
    updateMiniClock();
    updateGifts();
    updateReindeer();
    updateTemp();
    renderHistory();
    drawSleigh();

    setInterval(updateCountdown, 1000);
    setInterval(updateMiniClock, 1000);
    setInterval(() => { updateGifts(); updateReindeer(); updateTemp(); }, 2000);
    setInterval(createFlake, 180);
});