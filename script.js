// Optimized initialization - Loading screen functionality commented out
document.addEventListener('DOMContentLoaded', function() {
    // LOADING SCREEN FUNCTIONALITY COMMENTED OUT
    /*
    const loadingScreen = document.getElementById('loading-screen');
    const mainInterface = document.getElementById('main-interface');
    const loadingStatus = document.querySelector('.loading-status');
    
    // Loading sequence messages
    const loadingMessages = [
        'Initializing secure connection...',
        'Detecting network configuration...',
        'Retrieving client IP address...',
        'Synchronizing with WRAVEN network...',
        'Loading dashboard components...',
        'Finalizing interface initialization...',
        'Interface ready. Welcome, Visitor.'
    ];
    
    let messageIndex = 0;
    let detectedIP = 'Unknown';
    let isLoading = true; // Track loading state for keyboard shortcuts
    */
    
    // Immediate initialization without loading screen
    let detectedIP = 'Unknown';
    let isLoading = false; // No loading state needed
    
    // LOADING SCREEN FUNCTIONALITY COMMENTED OUT
    /*
    // Update loading status messages
    const updateLoadingMessage = () => {
        if (messageIndex < loadingMessages.length - 1) {
            setTimeout(async () => {
                loadingStatus.textContent = loadingMessages[messageIndex];
                
                // Special handling for IP detection step
                if (messageIndex === 2) { // "Retrieving client IP address..."
                    try {
                        detectedIP = await getIPDuringLoading();
                        setTimeout(() => {
                            loadingStatus.textContent = `Client IP detected: ${detectedIP}`;
                        }, 500);
                        setTimeout(() => {
                            messageIndex++;
                            updateLoadingMessage();
                        }, 1000);
                        return;
                    } catch (error) {
                        detectedIP = 'Unavailable';
                        setTimeout(() => {
                            loadingStatus.textContent = 'IP detection failed, continuing...';
                        }, 500);
                        setTimeout(() => {
                            messageIndex++;
                            updateLoadingMessage();
                        }, 1000);
                        return;
                    }
                }
                
                // Special handling for dashboard components step
                if (messageIndex === 7) { // "Loading dashboard components..."
                    setTimeout(() => {
                        loadingStatus.textContent = 'Threat feed: Ready';
                    }, 300);
                    setTimeout(() => {
                        loadingStatus.textContent = 'Research projects: Ready';
                    }, 600);
                    setTimeout(() => {
                        loadingStatus.textContent = 'CTF systems: Ready';
                    }, 900);
                    setTimeout(() => {
                        messageIndex++;
                        updateLoadingMessage();
                    }, 1200);
                    return;
                }
                
                messageIndex++;
                updateLoadingMessage();
            }, messageIndex === 0 ? 500 : 400); // Faster transitions
        } else {
            // Final welcome message - keep original timing
            setTimeout(() => {
                loadingStatus.textContent = loadingMessages[messageIndex];
                setTimeout(initializeInterface, 1200);
            }, 600);
        }
    };
    */
    
    // Simulate data updates
    const simulateDataUpdates = () => {
        // CTF stats are now static team information, no random updates needed
        // Research project progress bars remain static - they represent actual project status
        // Only update them manually when projects actually progress
    };
    
    // Update system uptime
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
            const timestamp = now.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            }) + ' ' + now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            }) + ' EST';
            
            lastUpdateElement.textContent = `Last updated: ${timestamp}`;
        }
    };
    
    // Real-time updates simulation
    const startRealTimeUpdates = () => {
        // Threat timestamps are now static dates - no need to update
        
        // Check dashboard status periodically
        setInterval(checkDashboardStatus, 5 * 60 * 1000); // Check every 5 minutes
        
        // Simulate live data updates (static now)
        setInterval(simulateDataUpdates, 30000); // Update every 30 seconds
        
        // Update system uptime (now with seconds)
        updateSystemUptime();
        setInterval(updateSystemUptime, 1000); // Update every second for seconds display
    };
    
    // Initialize the main interface immediately
    const initializeInterface = () => {
        isLoading = false; // Update loading state
        
        // LOADING SCREEN MANIPULATION COMMENTED OUT
        /*
        // Remove the loading skip listener since we're no longer loading
        document.removeEventListener('keydown', handleLoadingSkip);
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainInterface.classList.remove('hidden');
            mainInterface.style.opacity = '1';
        */
        
        // Handle logo image fallback
        setupLogoFallback();
        
        // Get user's IP address
        getUserIP();
        
        // Setup modal functionality
        setupWRAVENModal();
        
        // Setup click handlers for threat items and completed projects
        setupClickHandlers();
        
        // Check WRAVEN dashboard status
        checkDashboardStatus();
        
        // Start real-time updates
        startRealTimeUpdates();
        
        // LOADING SCREEN MANIPULATION COMMENTED OUT
        /*
        }, 500);
        */
    };

    // LOADING SCREEN KEYBOARD SHORTCUT COMMENTED OUT
    /*
    // Keyboard shortcut to skip loading screen
    const handleLoadingSkip = (e) => {
        if (e.key === 'ArrowRight' && isLoading) {
            e.preventDefault();
            // Clear all existing timeouts to stop the loading sequence
            for (let i = 1; i < 10000; i++) {
                clearTimeout(i);
            }
            
            // Immediately initialize the interface
            loadingStatus.textContent = 'Loading skipped. Welcome, Operator.';
            setTimeout(initializeInterface, 200);
        }
    };
    
    // Add the loading skip listener
    document.addEventListener('keydown', handleLoadingSkip);
    */

    // Setup logo image fallback
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

    // Get user's IP address
    const getUserIP = async () => {
        const ipElement = document.getElementById('user-ip');
        
        try {
            // Try multiple IP services for reliability
            const services = [
                'https://api.ipify.org?format=json',
                'https://ipapi.co/json/',
                'https://httpbin.org/ip'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service);
                    const data = await response.json();
                    
                    // Different services return IP in different formats
                    const ip = data.ip || data.origin || 'Unknown';
                    ipElement.textContent = ip;
                    return;
                } catch (error) {
                    continue; // Try next service
                }
            }
            
            // If all services fail
            ipElement.textContent = 'Unavailable';
        } catch (error) {
            ipElement.textContent = 'Error';
        }
    };

    // Setup WRAVEN modal
    const setupWRAVENModal = () => {
        const modal = document.getElementById('wraven-modal');
        const btn = document.getElementById('what-is-wraven-btn');
        const closeBtn = document.querySelector('.modal-close');
        
        // Check if modal should be opened via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('modal') === 'about') {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // Clear the URL parameter
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

    // Setup click handlers for interactive elements
    const setupClickHandlers = () => {
        // Add click handlers for threat items
        const threatItems = document.querySelectorAll('.threat-item');
        threatItems.forEach(item => {
            item.addEventListener('click', () => {
                window.open('https://public.wraven.org', '_blank');
            });
        });

        // Add click handlers for completed projects
        const completedProjects = document.querySelectorAll('.project-card');
        completedProjects.forEach(project => {
            const statusElement = project.querySelector('.project-status');
            if (statusElement && statusElement.textContent.trim() === 'COMPLETED') {
                project.addEventListener('click', () => {
                    window.open('https://blog.wraven.org', '_blank');
                });
                // Add cursor pointer and clickable class to indicate clickability
                project.style.cursor = 'pointer';
                project.classList.add('clickable');
            }
        });
    };

    // LOADING SCREEN START COMMENTED OUT
    /*
    // Start the loading sequence
    setTimeout(updateLoadingMessage, 1000);
    */
    
    // Initialize immediately without loading screen
    initializeInterface();
    
    // Register service worker for performance and offline support
    registerServiceWorker();

    // Register service worker
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/' // Explicitly set scope
                });
                console.log('Service Worker registered successfully:', registration);
                
                // Check if there's a waiting service worker
                if (registration.waiting) {
                    console.log('Service Worker is waiting to activate');
                    showUpdateNotification();
                }
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        console.log('New service worker installing...');
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                console.log('New version available! Refresh to update.');
                                showUpdateNotification();
                            }
                        });
                    }
                });
                
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        } else {
            console.log('Service Worker not supported');
        }
    }

    // Show update notification
    function showUpdateNotification() {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            padding: 12px 16px;
            border-radius: 6px;
            border: 1px solid var(--accent-blue);
            font-size: 14px;
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="margin-bottom: 8px;">🔄 New version available!</div>
            <div style="font-size: 12px; color: var(--text-secondary);">Click to refresh</div>
        `;
        
        notification.addEventListener('click', () => {
            window.location.reload();
        });
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    // Update threat feed timestamps
// Threat timestamps are now static dates in HTML - no need for dynamic updates
// const updateThreatTimestamps = () => {
//     // Timestamps are now static dates showing threat discovery dates
    // };
    
    // Format time to HH:MM (kept for other potential uses)
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Get IP during loading (faster, simpler version)
    const getIPDuringLoading = async () => {
        try {
            // Use a fast, reliable IP service
            const response = await fetch('https://api.ipify.org?format=json', {
                signal: AbortSignal.timeout(3000) // 3 second timeout
            });
            const data = await response.json();
            return data.ip || 'Unknown';
        } catch (error) {
            // Fallback to detecting from headers or using a mock
            return 'Unavailable';
        }
    };

    // Dashboard status check
    async function checkDashboardStatus() {
        try {
            // Try a GET request first to check for Cloudflare error pages
            const response = await fetch('https://dashboard.wraven.org', { 
                method: 'GET',
                cache: 'no-store', // Force fresh request, bypass all caches
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            
            // If we get a response, check if it's a Cloudflare error page
            if (response.ok || response.status >= 400) {
                const text = await response.text();
                
                // Check for Cloudflare error page indicators
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
                    text.includes('CF-RAY'); // Cloudflare ray ID present in error pages
                
                if (isCloudflareError) {
                    console.log('Dashboard check detected Cloudflare error page - server is down');
                    updateDashboardStatus(false);
                } else {
                    console.log('Dashboard check succeeded - server is reachable');
                    updateDashboardStatus(true);
                }
                return;
            }
            
        } catch (error) {
            // If CORS blocks us, try the no-cors fallback
            if (error.name === 'TypeError' && error.message.includes('CORS')) {
                console.log('CORS blocked, trying no-cors fallback');
                try {
                    await fetch('https://dashboard.wraven.org', { 
                        method: 'HEAD',
                        mode: 'no-cors',
                        cache: 'no-store', // Force fresh request
                        signal: AbortSignal.timeout(8000)
                    });
                    // If no-cors succeeds, assume server is up (can't detect Cloudflare errors this way)
                    console.log('Dashboard check (no-cors) succeeded - assuming server is reachable');
                    updateDashboardStatus(true);
                    return;
                } catch (noCorsError) {
                    console.log('Dashboard check (no-cors) failed - server may be unreachable:', noCorsError.message);
                }
            } else {
                console.log('Dashboard check failed - server may be unreachable:', error.message);
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

    // Add interactive effects
    const addInteractiveEffects = () => {
        // Tool button clicks
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add a brief flash effect
                this.style.background = 'rgba(30, 144, 255, 0.1)';
                setTimeout(() => {
                    this.style.background = '';
                }, 200);
                
                console.log(`Accessing ${this.querySelector('.tool-name').textContent}...`);
            });
        });
        
        // Link button interactions
        const linkButtons = document.querySelectorAll('.link-btn');
        linkButtons.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add visual feedback
                this.style.background = 'rgba(30, 144, 255, 0.1)';
                setTimeout(() => {
                    this.style.background = '';
                }, 200);
                
                const linkText = this.querySelector('.link-text').textContent;
                console.log(`Navigating to ${linkText}...`);
                
            });
        });
        
        // WRAVEN info button interaction is now handled by setupWRAVENModal()
        
        // Threat item interactions
        const threatItems = document.querySelectorAll('.threat-item');
        threatItems.forEach(item => {
            item.addEventListener('click', function() {
                // Add selection effect
                threatItems.forEach(t => t.classList.remove('selected'));
                this.classList.add('selected');
                
                // Add a subtle pulse effect
                this.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                const threatTitle = this.querySelector('.threat-title').textContent;
                console.log(`Viewing details for: ${threatTitle}`);
            });
        });
        
        // Project card interactions
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                const projectName = this.querySelector('.project-name').textContent;
                console.log(`Opening project: ${projectName}`);
                
                // Add visual feedback
                this.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    };

    // Add hover effects and interactions
    addInteractiveEffects();

    // Add selected state CSS
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
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .pwa-notification .pwa-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        
        .pwa-notification .pwa-message {
            flex: 1;
            line-height: 1.4;
        }
        
        .pwa-notification .pwa-dismiss {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin-left: 8px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }
        
        .pwa-notification .pwa-dismiss:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        
        .pwa-install-btn {
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            margin-left: 12px;
        }
        
        .pwa-install-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to clear selections
        if (e.key === 'Escape') {
            document.querySelectorAll('.threat-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
        }
        
        // Ctrl/Cmd + R to simulate refresh (prevent actual refresh)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            console.log('Refreshing threat intelligence feeds...');
            
            // Add a brief loading effect to threat items
            const threatItems = document.querySelectorAll('.threat-item');
            threatItems.forEach(item => {
                item.style.opacity = '0.5';
            });
            
            setTimeout(() => {
                threatItems.forEach(item => {
                    item.style.opacity = '1';
                });
            }, 500);
        }
    });

    // Add some subtle animations for status indicators
    const animateStatusIndicators = () => {
        const statusDots = document.querySelectorAll('.status-dot');
        
        statusDots.forEach((dot, index) => {
            if (dot.classList.contains('status-live')) {
                // Pulse animation for live status
                setInterval(() => {
                    dot.style.opacity = '0.4';
                    setTimeout(() => {
                        dot.style.opacity = '1';
                    }, 500);
                }, 2000);
            }
        });
    };

    // Initialize status animations after a delay
    setTimeout(animateStatusIndicators, 4000);
});
