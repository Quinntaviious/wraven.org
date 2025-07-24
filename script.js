// ========================================================================
// WRAVEN.ORG MAIN JAVASCRIPT
// Cleaned, organized, and commented for clarity and maintainability
// ========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // --------------------------------------------------------------------
    // 1. GLOBAL STATE
    // --------------------------------------------------------------------
    let detectedIP = 'Unknown';

    // --------------------------------------------------------------------
    // 2. SYSTEM UPTIME & LAST UPDATE
    // --------------------------------------------------------------------
    const updateSystemUptime = () => {
        const uptimeElement = document.querySelector('.uptime');
        const lastUpdateElement = document.querySelector('.last-update');
        if (uptimeElement) {
            // Calculate uptime from November 30th, 2024 at 3pm
            const startTime = new Date('2024-11-30T15:00:00');
            const now = new Date();
            const uptimeMs = now.getTime() - startTime.getTime();
            const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
            uptimeElement.innerHTML = `Uptime: <code class="uptime-code">${days}d ${hours}h ${minutes}m ${seconds}s</code>`;
        }
        if (lastUpdateElement) {
            const now = new Date();
            const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
                ' ' + now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' EST';
            lastUpdateElement.textContent = `Last updated: ${timestamp}`;
        }
    };

    // --------------------------------------------------------------------
    // 3. REAL-TIME UPDATES (Uptime, Dashboard, etc)
    // --------------------------------------------------------------------
    const startRealTimeUpdates = () => {
        setInterval(checkDashboardStatus, 5 * 60 * 1000); // Check dashboard every 5 min
        setInterval(updateSystemUptime, 1000); // Update uptime every second
        updateSystemUptime();
    };

    // --------------------------------------------------------------------
    // 4. LOGO FALLBACK (Image/Text)
    // --------------------------------------------------------------------
    const setupLogoFallback = () => {
        const logoImage = document.querySelector('.logo-image');
        const logoText = document.querySelector('.logo-text');
        if (logoImage && logoText) {
            logoImage.addEventListener('error', () => {
                logoImage.style.display = 'none';
                logoText.style.display = 'inline';
            });
            logoImage.addEventListener('load', () => {
                logoImage.style.display = 'block';
                logoText.style.display = 'none';
            });
        }
    };

    // --------------------------------------------------------------------
    // 5. GET USER IP (Async, Tries Multiple Services)
    // --------------------------------------------------------------------
    const getUserIP = async () => {
        const ipElement = document.getElementById('user-ip');
        try {
            const services = [
                'https://api.ipify.org?format=json',
                'https://ipapi.co/json/',
                'https://httpbin.org/ip'
            ];
            for (const service of services) {
                try {
                    const response = await fetch(service);
                    const data = await response.json();
                    const ip = data.ip || data.origin || 'Unknown';
                    ipElement.textContent = ip;
                    return;
                } catch (error) { continue; }
            }
            ipElement.textContent = 'Unavailable';
        } catch (error) {
            ipElement.textContent = 'Error';
        }
    };

    // --------------------------------------------------------------------
    // 6. MODAL SETUP (What is WRAVEN?)
    // --------------------------------------------------------------------
    const setupWRAVENModal = () => {
        const modal = document.getElementById('wraven-modal');
        const btn = document.getElementById('what-is-wraven-btn');
        const closeBtn = document.querySelector('.modal-close');
        // Open via URL param
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('modal') === 'about') {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            history.replaceState({}, document.title, window.location.pathname);
        }
        // Open modal
        if (btn) {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    };

    // --------------------------------------------------------------------
    // 7. CLICK HANDLERS (Threats, Projects)
    // --------------------------------------------------------------------
    const setupClickHandlers = () => {
        // Threat items open public dashboard
        document.querySelectorAll('.threat-item').forEach(item => {
            item.addEventListener('click', () => {
                window.open('https://public.wraven.org', '_blank');
            });
        });
        // Completed projects open blog
        document.querySelectorAll('.project-card').forEach(project => {
            const statusElement = project.querySelector('.project-status');
            if (statusElement && statusElement.textContent.trim() === 'COMPLETED') {
                project.addEventListener('click', () => {
                    window.open('https://blog.wraven.org', '_blank');
                });
                project.style.cursor = 'pointer';
                project.classList.add('clickable');
            }
        });
    };

    // --------------------------------------------------------------------
    // 8. DASHBOARD STATUS CHECK (Cloudflare Error Detection)
    // --------------------------------------------------------------------
    async function checkDashboardStatus() {
        try {
            const response = await fetch('https://dashboard.wraven.org', { 
                method: 'GET',
                cache: 'no-store',
                signal: AbortSignal.timeout(10000)
            });
            if (response.ok || response.status >= 400) {
                const text = await response.text();
                const isCloudflareError = 
                    text.includes('502 Bad gateway') || 
                    text.includes('503 Service Temporarily Unavailable') ||
                    text.includes('504 Gateway timeout') ||
                    text.includes('520 Web server is returning an unknown error') ||
                    text.includes('521 Web server is down') ||
                    text.includes('522 Connection timed out') ||
                    text.includes('523 Origin is unreachable') ||
                    text.includes('524 A timeout occurred') ||
                    text.includes('525 SSL handshake failed') ||
                    (text.includes('cloudflare') && text.includes('error')) ||
                    text.includes('CF-RAY');
                updateDashboardStatus(!isCloudflareError);
                return;
            }
        } catch (error) {
            // CORS fallback
            if (error.name === 'TypeError' && error.message.includes('CORS')) {
                try {
                    await fetch('https://dashboard.wraven.org', { 
                        method: 'HEAD',
                        mode: 'no-cors',
                        cache: 'no-store',
                        signal: AbortSignal.timeout(8000)
                    });
                    updateDashboardStatus(true);
                    return;
                } catch {}
            }
            updateDashboardStatus(false);
        }
    }
    function updateDashboardStatus(isOnline) {
        const feedStatus = document.querySelector('.feed-status');
        if (feedStatus) {
            if (isOnline) {
                feedStatus.innerHTML = `
                    <span class="status-dot status-live"></span>
                    <a href="https://public.wraven.org" target="_blank" class="dashboard-link">WATCHTOWER Dashboard Online</a>
                `;
            } else {
                feedStatus.innerHTML = `
                    <span class="status-dot status-offline"></span>
                    <a href="https://public.wraven.org" target="_blank" class="dashboard-link dashboard-offline">WATCHTOWER Dashboard Offline</a>
                `;
            }
        }
    }

    // --------------------------------------------------------------------
    // 9. SERVICE WORKER REGISTRATION & UPDATE NOTIFICATION
    // --------------------------------------------------------------------
    registerServiceWorker();
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                if (registration.waiting) showUpdateNotification();
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    }
                });
            } catch {}
        }
    }
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: var(--bg-tertiary); color: var(--text-primary);
            padding: 12px 16px; border-radius: 6px; border: 1px solid var(--accent-blue); font-size: 14px; z-index: 10000;
            cursor: pointer; transition: all 0.3s ease;`;
        notification.innerHTML = `
            <div style="margin-bottom: 8px;">🔄 New version available!</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Click to refresh</div>
        `;
        notification.addEventListener('click', () => window.location.reload());
        document.body.appendChild(notification);
        setTimeout(() => { if (notification.parentNode) notification.remove(); }, 10000);
    }

    // --------------------------------------------------------------------
    // 10. INTERACTIVE EFFECTS (Tool/Link/Threat/Project Buttons)
    // --------------------------------------------------------------------
    const addInteractiveEffects = () => {
        // Tool button click flash
        document.querySelectorAll('.tool-btn').forEach(button => {
            button.addEventListener('click', function() {
                this.style.background = 'rgba(30, 144, 255, 0.1)';
                setTimeout(() => { this.style.background = ''; }, 200);
            });
        });
        // Link button click flash
        document.querySelectorAll('.link-btn').forEach(link => {
            link.addEventListener('click', function() {
                this.style.background = 'rgba(30, 144, 255, 0.1)';
                setTimeout(() => { this.style.background = ''; }, 200);
            });
        });
        // Threat item selection effect
        const threatItems = document.querySelectorAll('.threat-item');
        threatItems.forEach(item => {
            item.addEventListener('click', function() {
                threatItems.forEach(t => t.classList.remove('selected'));
                this.classList.add('selected');
                this.style.transform = 'scale(1.02)';
                setTimeout(() => { this.style.transform = ''; }, 150);
            });
        });
        // Project card click effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'translateY(-2px)';
                setTimeout(() => { this.style.transform = ''; }, 200);
            });
        });
    };
    addInteractiveEffects();

    // --------------------------------------------------------------------
    // 11. DYNAMIC STYLE INJECTION (Selected State, PWA Notification, etc)
    // --------------------------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
        .threat-item.selected {
            border-left-color: var(--accent-blue) !important;
            background: rgba(30, 144, 255, 0.08) !important;
        }
        .project-card:hover,
        .tool-btn:hover,
        .link-btn:hover {
            transform: translateY(-1px);
        }
        .access-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .pwa-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            padding: 16px 20px;
            border-radius: 8px;
            border: 1px solid var(--accent-blue);
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .pwa-notification .pwa-icon { font-size: 24px; flex-shrink: 0; }
        .pwa-notification .pwa-message { flex: 1; line-height: 1.4; }
        .pwa-notification .pwa-dismiss {
            background: none; border: none; color: var(--text-secondary); font-size: 18px; cursor: pointer;
            padding: 0; margin-left: 8px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
            border-radius: 50%; transition: all 0.2s ease;
        }
        .pwa-notification .pwa-dismiss:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        .pwa-install-btn {
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer;
            transition: all 0.3s ease; font-weight: 500; margin-left: 12px;
        }
        .pwa-install-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    // --------------------------------------------------------------------
    // 12. KEYBOARD SHORTCUTS (Escape, Ctrl/Cmd+R)
    // --------------------------------------------------------------------
    document.addEventListener('keydown', function(e) {
        // Escape: clear threat selection
        if (e.key === 'Escape') {
            document.querySelectorAll('.threat-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
        }
        // Ctrl/Cmd+R: fake refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            const threatItems = document.querySelectorAll('.threat-item');
            threatItems.forEach(item => { item.style.opacity = '0.5'; });
            setTimeout(() => {
                threatItems.forEach(item => { item.style.opacity = '1'; });
            }, 500);
        }
    });

    // --------------------------------------------------------------------
    // 13. STATUS INDICATOR ANIMATION (Pulse)
    // --------------------------------------------------------------------
    const animateStatusIndicators = () => {
        document.querySelectorAll('.status-dot').forEach(dot => {
            if (dot.classList.contains('status-live')) {
                setInterval(() => {
                    dot.style.opacity = '0.4';
                    setTimeout(() => { dot.style.opacity = '1'; }, 500);
                }, 2000);
            }
        });
    };
    setTimeout(animateStatusIndicators, 4000);

    // --------------------------------------------------------------------
    // 14. INITIALIZE MAIN INTERFACE
    // --------------------------------------------------------------------
    function initializeInterface() {
        setupLogoFallback();
        getUserIP();
        setupWRAVENModal();
        setupClickHandlers();
        checkDashboardStatus();
        startRealTimeUpdates();
    }
    initializeInterface();

    // --------------------------------------------------------------------
    // (END)
    // --------------------------------------------------------------------
});
