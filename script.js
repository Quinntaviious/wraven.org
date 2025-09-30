// ========================================================================
// WRAVEN.ORG MAIN JAVASCRIPT - ENHANCED EDITION
// ========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeParticleEffect();
    initializeScrollEffects();
    // Cursor glow removed for cleaner experience
    setupLogoFallback();
    setupWRAVENModal();
    setupClickHandlers();
    startRealTimeUpdates();
    getUserIP();
    registerServiceWorker();
    
    // Smooth fade-in on page load
    setTimeout(() => {
        document.querySelector('.main-interface').style.opacity = '1';
    }, 100);

    // --------------------------------------------------------------------
    // 1. PARTICLE EFFECT FOR BACKGROUND
    // --------------------------------------------------------------------
    function initializeParticleEffect() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.5'; // Increased from 0.3 for better visibility
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 1; // Slightly larger particles
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.6 + 0.3; // Increased opacity range
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            
            draw() {
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function init() {
            particles = [];
            const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100); // More particles
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 150)})`; // Slightly more visible connections
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        init();
        animate();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrameId);
        });
    }

    // --------------------------------------------------------------------
    // 2. SCROLL-BASED ANIMATIONS
    // --------------------------------------------------------------------
    function initializeScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.grid-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    // --------------------------------------------------------------------
    // 3. CUSTOM CURSOR GLOW EFFECT - DISABLED FOR CLEANER LOOK
    // --------------------------------------------------------------------
    /*
    function initializeCursorGlow() {
        // Cursor glow disabled - kept for future reference
    }
    */

    // --------------------------------------------------------------------
    // 4. SYSTEM UPTIME & LAST UPDATE
    // --------------------------------------------------------------------
    const updateSystemUptime = () => {
        const uptimeElement = document.querySelector('.uptime-code');
        const lastUpdateElement = document.querySelector('.footer-stat-value code:not(.uptime-code)');
        
        if (uptimeElement) {
            // Calculate uptime from November 30th, 2024 at 3pm EST
            const startTime = new Date('2024-11-30T15:00:00-05:00');
            const now = new Date();
            const uptimeMs = now.getTime() - startTime.getTime();
            const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
            uptimeElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        
        if (lastUpdateElement) {
            const now = new Date();
            const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[estTime.getMonth()];
            const day = estTime.getDate();
            const year = estTime.getFullYear();
            const hours = String(estTime.getHours()).padStart(2, '0');
            const mins = String(estTime.getMinutes()).padStart(2, '0');
            lastUpdateElement.textContent = `${month} ${day} ${year} ${hours}:${mins} EST`;
        }
    };

    // --------------------------------------------------------------------
    // 5. REAL-TIME UPDATES (Uptime, Dashboard, etc)
    // --------------------------------------------------------------------
    const startRealTimeUpdates = () => {
        setInterval(checkDashboardStatus, 5 * 60 * 1000); // Check dashboard every 5 min
        setInterval(updateSystemUptime, 1000); // Update uptime every second
        updateSystemUptime();
    };

    // --------------------------------------------------------------------
    // 6. LOGO FALLBACK (Image/Text)
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
    // 7. GET USER IP (Async, Tries Multiple Services)
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
    // 8. MODAL SETUP (What is WRAVEN?)
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
                // Add fade-in animation
                modal.style.animation = 'fadeIn 0.3s ease';
            });
        }
        
        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
    };

    // --------------------------------------------------------------------
    // 9. CLICK HANDLERS (Threats, Projects) WITH ENHANCED EFFECTS
    // --------------------------------------------------------------------
    const setupClickHandlers = () => {
        // Threat items open public dashboard with ripple effect
        document.querySelectorAll('.threat-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                // Don't interfere with link clicks
                if (e.target.tagName === 'A') return;
                createRipple(e, item);
                setTimeout(() => {
                    window.open('https://public.wraven.org', '_blank');
                }, 150);
            });
        });
        
        // Completed projects open blog
        document.querySelectorAll('.project-card').forEach(project => {
            const statusElement = project.querySelector('.project-status');
            if (statusElement && statusElement.textContent.trim() === 'COMPLETED') {
                project.addEventListener('click', (e) => {
                    createRipple(e, project);
                    setTimeout(() => {
                        window.open('https://blog.wraven.org', '_blank');
                    }, 150);
                });
                project.style.cursor = 'pointer';
                project.classList.add('clickable');
            }
        });
        
        // Add ripple effect to buttons
        document.querySelectorAll('.hero-btn, .access-btn, .tool-btn, .link-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!btn.href && !btn.onclick) return; // Skip if not interactive
                createRipple(e, btn);
            });
        });
    };
    
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Add ripple animation to CSS
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.9);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------
    // 10. DASHBOARD STATUS CHECK (Cloudflare Error Detection)
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
                    <a href="https://public.wraven.org" target="_blank" class="dashboard-link">Live</a>
                `;
            } else {
                feedStatus.innerHTML = `
                    <span class="status-dot status-offline"></span>
                    <a href="https://public.wraven.org" target="_blank" class="dashboard-link dashboard-offline">Offline</a>
                `;
            }
        }
    }

    // --------------------------------------------------------------------
    // 11. SERVICE WORKER REGISTRATION & UPDATE NOTIFICATION
    // --------------------------------------------------------------------
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
            position: fixed; top: 20px; right: 20px; 
            background: linear-gradient(135deg, var(--bg-card), var(--bg-tertiary));
            color: var(--text-primary);
            padding: 16px 20px; border-radius: 10px; 
            border: 2px solid var(--accent-blue); 
            font-size: 14px; z-index: 10000;
            cursor: pointer; transition: all 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
            animation: slideInRight 0.5s ease;
        `;
        notification.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: 600;">🔄 New version available!</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Click to refresh</div>
        `;
        notification.addEventListener('click', () => window.location.reload());
        notification.addEventListener('mouseenter', () => {
            notification.style.transform = 'translateY(-5px)';
            notification.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.5)';
        });
        notification.addEventListener('mouseleave', () => {
            notification.style.transform = 'translateY(0)';
            notification.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.3)';
        });
        document.body.appendChild(notification);
        setTimeout(() => { 
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 10000);
    }
    
    // Add slide animations
    if (!document.getElementById('slide-style')) {
        const style = document.createElement('style');
        style.id = 'slide-style';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------
    // 12. INTERACTIVE EFFECTS (Tool/Link/Threat/Project Buttons)
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
    // 10. DYNAMIC STYLE INJECTION (Selected State, PWA Notification, etc)
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
    // 11. KEYBOARD SHORTCUTS (Escape, Ctrl/Cmd+R)
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
    // 12. BACK TO TOP BUTTON
    // --------------------------------------------------------------------
    const setupBackToTop = () => {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        const toggleBackToTop = () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', toggleBackToTop);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    // --------------------------------------------------------------------
    // 13. ENHANCED TERMINAL ANIMATION
    // --------------------------------------------------------------------
    const enhanceTerminalAnimation = () => {
        const typingElement = document.querySelector('.typing-effect');
        if (!typingElement) return;
        
        const originalText = typingElement.textContent;
        let currentText = '';
        let index = 0;
        
        const typeWriter = () => {
            if (index < originalText.length) {
                currentText += originalText.charAt(index);
                typingElement.textContent = currentText;
                index++;
                setTimeout(typeWriter, 100 + Math.random() * 50); // Realistic typing speed
            } else {
                // Reset after pause
                setTimeout(() => {
                    currentText = '';
                    index = 0;
                    typingElement.textContent = '';
                    setTimeout(typeWriter, 1000);
                }, 3000);
            }
        };
        
        // Start typing animation after initial delay
        setTimeout(() => {
            typingElement.textContent = '';
            typeWriter();
        }, 2000);
    };
    
    // --------------------------------------------------------------------
    // 14. LOADING STATE IMPROVEMENTS
    // --------------------------------------------------------------------
    const enhanceLoadingStates = () => {
        // Add loading states for images
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
            }
        });
        
        // Simulate loading for threat feed items
        const threatItems = document.querySelectorAll('.threat-item');
        threatItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 200 * (index + 1));
        });
    };

    // --------------------------------------------------------------------
    // 15. INITIALIZE MAIN INTERFACE
    // --------------------------------------------------------------------
    function initializeInterface() {
        setupLogoFallback();
        getUserIP();
        setupWRAVENModal();
        setupClickHandlers();
        checkDashboardStatus();
        startRealTimeUpdates();
        setupBackToTop();
        enhanceTerminalAnimation();
        enhanceLoadingStates();
    }
    initializeInterface();

    // --------------------------------------------------------------------
    // (END)
    // --------------------------------------------------------------------
});
