// Loading screen and initialization
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Initialize the main interface
    const initializeInterface = () => {
        isLoading = false; // Update loading state
        // Remove the loading skip listener since we're no longer loading
        document.removeEventListener('keydown', handleLoadingSkip);
        
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainInterface.classList.remove('hidden');
            mainInterface.style.opacity = '1';
            
            // Handle logo image fallback
            setupLogoFallback();
            
            // Set IP if already detected during loading
            if (detectedIP && detectedIP !== 'Unknown' && detectedIP !== 'Unavailable') {
                const ipElement = document.getElementById('user-ip');
                if (ipElement) {
                    ipElement.textContent = detectedIP;
                }
            } else {
                // Get user's IP address if not detected during loading
                getUserIP();
            }
            
            // Setup modal functionality
            setupWRAVENModal();
            
            // Check WRAVEN dashboard status
            checkDashboardStatus();
            
            // Start real-time updates
            startRealTimeUpdates();
        }, 500);
    };

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

    // Start the loading sequence
    setTimeout(updateLoadingMessage, 1000);

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
    
    // Add hover effects and interactions
    addInteractiveEffects();
});

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
    const feedStatus = document.querySelector('.feed-status');
    
    try {
        // Try to fetch from dashboard.wraven.org with no-cors to avoid CORS issues
        const response = await fetch('https://dashboard.wraven.org', { 
            mode: 'no-cors',
            method: 'HEAD'
        });
        
        // If we get here without error, the site is reachable
        updateDashboardStatus(true);
    } catch (error) {
        // If there's an error, the site is likely down
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
