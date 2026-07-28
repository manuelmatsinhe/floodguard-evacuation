document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  
  const setTheme = (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? '<span class="material-symbols-outlined">light_mode</span>' : '<span class="material-symbols-outlined">dark_mode</span>';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme === 'dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme !== 'dark');
    });
  }

  // Live Tracking System (always on dot)
  const trackingBar = document.createElement('div');
  trackingBar.className = 'live-tracking-bar';
  trackingBar.innerHTML = `
    <div class="status">
      <div class="pulse-dot" id="tracking-dot" style="background-color: var(--warning);"></div>
      <span id="tracking-text">Acquiring GPS Signal...</span>
    </div>
    <div id="tracking-coords">-- , --</div>
  `;
  document.body.insertBefore(trackingBar, document.body.firstChild);

  if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lon = position.coords.longitude.toFixed(5);
        const acc = Math.round(position.coords.accuracy);
        
        document.getElementById('tracking-dot').style.backgroundColor = 'var(--safe)';
        document.getElementById('tracking-text').innerHTML = '<strong>LIVE</strong> Tracking Active';
        document.getElementById('tracking-coords').innerText = `Lat: ${lat} | Lng: ${lon} (±${acc}m)`;
        
        // Save globally so other functions (like SOS) can use real coords immediately
        window.currentLiveCoords = { lat: position.coords.latitude, lon: position.coords.longitude };
      },
      (error) => {
        document.getElementById('tracking-dot').style.backgroundColor = 'var(--danger)';
        document.getElementById('tracking-dot').style.animation = 'none';
        document.getElementById('tracking-text').innerText = 'Tracking Offline (Permission Denied/Error)';
        document.getElementById('tracking-coords').innerText = '-- , --';
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
  } else {
    document.getElementById('tracking-dot').style.backgroundColor = 'var(--danger)';
    document.getElementById('tracking-dot').style.animation = 'none';
    document.getElementById('tracking-text').innerText = 'GPS Not Supported';
  }

  // Modal Factory
  const showModal = (title, contentHTML) => {
    const existingModal = document.getElementById('dynamic-modal');
    if(existingModal) existingModal.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'dynamic-modal';
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        ${contentHTML}
      </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    const closeBtn = modalContent.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modalOverlay.remove());
    modalOverlay.addEventListener('click', (e) => {
      if(e.target === modalOverlay) modalOverlay.remove();
    });
  };

  // 1. Emergency Protocol Button (Dashboard)
  const protocolBtn = document.querySelector('.btn-primary');
  if(protocolBtn && protocolBtn.innerText.includes('Emergency Protocol')) {
    protocolBtn.addEventListener('click', () => {
      showModal('<span class="material-symbols-outlined" style="vertical-align: middle; color: var(--danger);">emergency</span> Emergency Protocol Initiated', `
        <p>Scanning region for emergency response units...</p>
        <div style="margin: 15px 0;">
          <div class="capacity-bar"><div class="capacity-fill danger-bg" style="width: 100%; animation: pulse 1s infinite;"></div></div>
        </div>
        <p><strong>Status:</strong> Critical Alert Level</p>
        <p>Please contact the nearest emergency services if you require immediate assistance:</p>
        <ul>
          <li><span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined">local_police</span> Local Police</span> <a href="tel:911">911</a></li>
          <li><span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined">local_fire_department</span> Fire Department</span> <a href="tel:5550102">555-0102</a></li>
          <li><span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined">local_hospital</span> City General Hospital</span> <a href="tel:5550103">555-0103</a></li>
          <li><span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined">health_and_safety</span> Search & Rescue</span> <a href="tel:5550104">555-0104</a></li>
        </ul>
        <div style="margin-top: 20px; text-align: center;">
          <a href="map.html" class="btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; width: 100%;">
            <span class="material-symbols-outlined">map</span> Find Evacuation Route Now
          </a>
        </div>
      `);
    });
  }

  // 2. Preparation Checklist Button (Alerts)
  const prepBtn = document.querySelector('a[href="#"]');
  if(prepBtn && prepBtn.innerText.includes('Preparation')) {
    prepBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('<span class="material-symbols-outlined" style="vertical-align: middle;">checklist</span> Preparation Checklist', `
        <p>Ensure you have the following items ready for an immediate evacuation:</p>
        <ul style="text-align: left;">
          <li style="justify-content: flex-start; gap: 10px;"><input type="checkbox"> 3-day supply of non-perishable food</li>
          <li style="justify-content: flex-start; gap: 10px;"><input type="checkbox"> 1 gallon of water per person per day</li>
          <li style="justify-content: flex-start; gap: 10px;"><input type="checkbox"> Important documents in a waterproof bag</li>
          <li style="justify-content: flex-start; gap: 10px;"><input type="checkbox"> 7-day supply of medications</li>
          <li style="justify-content: flex-start; gap: 10px;"><input type="checkbox"> Flashlight with extra batteries</li>
        </ul>
      `);
    });
  }

  // 3. Search Shelters Button (Shelters)
  const searchSheltersBtn = document.querySelector('.search-bar-container .btn-primary');
  const searchInput = document.querySelector('.search-input');
  
  if(searchSheltersBtn && searchInput) {
    searchSheltersBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if(!query) {
        showModal('<span class="material-symbols-outlined" style="vertical-align: middle; color: var(--warning);">warning</span> Missing Information', '<p>Please enter a zip code or neighborhood to search for nearby shelters.</p>');
        return;
      }
      
      searchSheltersBtn.innerHTML = '<span class="material-symbols-outlined" style="vertical-align: middle;">hourglass_empty</span> Searching...';
      searchSheltersBtn.disabled = true;
      
      setTimeout(() => {
        searchSheltersBtn.innerHTML = 'Search Shelters';
        searchSheltersBtn.disabled = false;
        showModal('<span class="material-symbols-outlined" style="vertical-align: middle;">location_on</span> Search Results', `
          <p>Found <strong>2</strong> available shelters near <strong>${query}</strong>:</p>
          <ul>
            <li><span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined">business</span> Main City Hall (2.4 miles)</span> <strong style="color:var(--warning)">75% Full</strong></li>
            <li><span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined">school</span> High School Gym (4.1 miles)</span> <strong style="color:var(--safe)">20% Full</strong></li>
          </ul>
        `);
      }, 1000);
    });
  }

  // Analysis Form & GPS Logic
  const analysisForm = document.getElementById('analysis-form');
  const areaInput = document.getElementById('area-input');
  const analysisResult = document.getElementById('analysis-result');
  const resultStatus = document.getElementById('result-status');
  const btnGps = document.getElementById('btn-gps');

  const showResult = (locationName, isDanger = false, isWarn = false) => {
    analysisResult.hidden = false;
    resultStatus.className = 'result-status'; // reset classes
    
    if(isDanger) {
      resultStatus.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle;">warning</span> High flood risk detected near <strong>${locationName}</strong>. Evacuation recommended!`;
      resultStatus.classList.add('danger');
    } else if (isWarn) {
      resultStatus.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle;">warning</span> Moderate flood risk near <strong>${locationName}</strong>. Be prepared.`;
      resultStatus.classList.add('warning');
    } else {
      resultStatus.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle;">check_circle</span> <strong>${locationName}</strong> is currently secure. No immediate flood threat.`;
      resultStatus.classList.add('safe');
    }
  };

  if(analysisForm) {
    analysisForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const area = areaInput.value.trim().toLowerCase();
      if(!area) return;
      
      const isDanger = area.includes('danger') || area.includes('sector a');
      const isWarn = area.includes('warn');
      showResult(areaInput.value, isDanger, isWarn);
    });
  }

  if(btnGps) {
    btnGps.addEventListener('click', () => {
      btnGps.innerHTML = '<span class="material-symbols-outlined" style="vertical-align: middle;">hourglass_empty</span> Locating...';
      
      setTimeout(() => {
        btnGps.innerHTML = '<span class="material-symbols-outlined" style="vertical-align: middle;">my_location</span> Use my current GPS location';
        if(window.currentLiveCoords) {
           areaInput.value = `Lat: ${window.currentLiveCoords.lat.toFixed(4)}, Lng: ${window.currentLiveCoords.lon.toFixed(4)}`;
           showResult('Your Current Location', false, false);
        } else {
           alert('Live tracking not active yet. Please ensure location permissions are granted.');
        }
      }, 500);
    });
  }

  // Hamburger Menu Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mainNav = document.getElementById('main-nav');
  
  if(hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('open');
      mainNav.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('open');
        mainNav.classList.remove('open');
      }
    });
  }

  // Route Calculation Logic
  const btnCalcRoute = document.getElementById('btn-calc-route');
  const routeResult = document.getElementById('route-result');
  
  if(btnCalcRoute && routeResult) {
    btnCalcRoute.addEventListener('click', () => {
      btnCalcRoute.innerHTML = '<span class="material-symbols-outlined" style="vertical-align: middle;">hourglass_empty</span> Calculating Best Route...';
      btnCalcRoute.disabled = true;
      
      setTimeout(() => {
        btnCalcRoute.innerHTML = '<span class="material-symbols-outlined" style="vertical-align: middle;">directions</span> Calculate Route to Nearest Safehold';
        btnCalcRoute.disabled = false;
        
        routeResult.hidden = false;
        routeResult.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle;">check_circle</span> <strong>Route Found!</strong> Proceed safely to <strong>High School Gym</strong> via Route 4. Estimated time: 14 mins.`;
        routeResult.className = 'route-result';
      }, 1500);
    });
  }

  // Community Insights FAB & Logic
  const fab = document.createElement('button');
  fab.className = 'insight-fab';
  fab.innerHTML = '<span class="material-symbols-outlined">campaign</span> Report Insight';
  document.body.appendChild(fab);

  fab.addEventListener('click', () => {
    showModal('<span class="material-symbols-outlined" style="vertical-align: middle;">add_circle</span> Contribute Community Insight', `
      <form id="insight-form" style="display: flex; flex-direction: column; gap: 15px;">
        <div>
          <label style="font-size: 0.9rem; color: var(--text-muted);">Which page would you like to update?</label>
          <select id="insight-target-page" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-main); margin-top: 5px; font-family: inherit;">
            <option value="shelters">🏠 Shelters (e.g., Offer hosting or new shelter)</option>
            <option value="alerts">⚠️ Alerts (e.g., Report risky flood zones)</option>
            <option value="map">🗺️ Evacuation Map (e.g., Report road closures)</option>
          </select>
        </div>
        <div>
          <label style="font-size: 0.9rem; color: var(--text-muted);">Insight Type</label>
          <select id="insight-type" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-main); margin-top: 5px; font-family: inherit;">
            <option value="shelter">New Available Shelter / Hosting</option>
            <option value="water">Flood/Water Level Update</option>
            <option value="road">Road Blockage</option>
          </select>
        </div>
        <div>
          <label style="font-size: 0.9rem; color: var(--text-muted);">Location</label>
          <input type="text" id="insight-loc" placeholder="e.g. North Side Community Center" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-main); margin-top: 5px; font-family: inherit;">
        </div>
        <div>
          <label style="font-size: 0.9rem; color: var(--text-muted);">Details</label>
          <textarea id="insight-details" placeholder="What is the current situation?" required rows="3" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--input-bg); color: var(--text-main); margin-top: 5px; resize: none; font-family: inherit;"></textarea>
        </div>
        <button type="submit" class="btn-primary" id="btn-submit-insight" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px;">
          <span class="material-symbols-outlined">send</span> Submit for Verification
        </button>
      </form>
    `);

    const form = document.getElementById('insight-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetPageDropdown = document.getElementById('insight-target-page');
      const targetPageValue = targetPageDropdown.value;
      const targetPageName = targetPageDropdown.options[targetPageDropdown.selectedIndex].text.split(' ')[1]; // Extract name after emoji
      
      const type = document.getElementById('insight-type').value;
      const loc = document.getElementById('insight-loc').value;
      const details = document.getElementById('insight-details').value;
      const submitBtn = document.getElementById('btn-submit-insight');

      submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: pulse 1s infinite;">autorenew</span> Verifying via Network...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Show Success
        showModal('<span class="material-symbols-outlined" style="vertical-align: middle; color: var(--safe);">verified</span> Insight Approved!', `
          <p>Thank you! Your insight regarding <strong>${loc}</strong> has been verified and is now live on the <strong>${targetPageName}</strong> page.</p>
        `);

        // Inject dynamically based on page
        if(type === 'shelter' && window.location.pathname.includes('shelters.html')) {
          const grid = document.querySelector('.status-grid');
          if(grid) {
            const newCard = document.createElement('div');
            newCard.className = 'status-card safe shelter-card';
            newCard.style.animation = 'fadeIn 0.5s ease';
            newCard.innerHTML = `
              <div class="shelter-header">
                <h3><span class="material-symbols-outlined" style="vertical-align: bottom;">volunteer_activism</span> ${loc}</h3>
                <span class="distance">Community Added</span>
              </div>
              <div class="capacity-bar-container">
                <div class="capacity-label">
                  <span>Capacity</span>
                  <span>Open Space</span>
                </div>
                <div class="capacity-bar">
                  <div class="capacity-fill safe-bg" style="width: 10%;"></div>
                </div>
              </div>
              <p class="status-desc">${details}</p>
              <div class="action-links mt-3">
                <a href="map.html" class="btn-outline-primary btn-small">View on Map</a>
              </div>
            `;
            grid.prepend(newCard);
          }
        }
        
        if((type === 'water' || type === 'road') && window.location.pathname.includes('alerts.html')) {
          const feed = document.querySelector('.main-column');
          if(feed) {
             const titleNode = feed.querySelector('.section-title');
             const newAlert = document.createElement('div');
             newAlert.className = 'status-card warning feed-card';
             newAlert.style.animation = 'fadeIn 0.5s ease';
             newAlert.innerHTML = `
                <div class="card-header-flex">
                  <h3><span class="material-symbols-outlined" style="vertical-align: bottom; color: var(--warning);">campaign</span> ${loc} - Community Report</h3>
                  <span class="time-stamp">Just now</span>
                </div>
                <p class="status-desc">${details}</p>
             `;
             titleNode.after(newAlert);
          }
        }
      }, 1500);
    });
  });

  // ==========================================
  // SOS Validator (Ported from sos_validator.py)
  // ==========================================
  const SOS_RADIUS_METERS = 500;
  const SOS_TIME_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
  const SOS_MIN_REPORTS = 3;

  const getSOSReports = () => JSON.parse(localStorage.getItem('sos_reports') || '[]');
  const saveSOSReports = (reports) => localStorage.setItem('sos_reports', JSON.stringify(reports));

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Raio da Terra em metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const registerSOS = (lat, lon, source) => {
    const now = Date.now();
    const reports = getSOSReports();
    
    // Regista um novo SOS
    reports.push({ lat, lon, timestamp: now, source });
    
    // Limpa reports fora da janela de tempo
    const limitTime = now - SOS_TIME_WINDOW_MS;
    const recentReports = reports.filter(r => r.timestamp >= limitTime);
    saveSOSReports(recentReports);
    
    // Conta quantos reports estão dentro do raio deste novo SOS
    const neighbors = recentReports.filter(r => 
      calculateDistance(lat, lon, r.lat, r.lon) <= SOS_RADIUS_METERS
    );
    
    const zoneConfirmed = neighbors.length >= SOS_MIN_REPORTS;
    
    return {
      received: true,
      reportsInZone: neighbors.length,
      zoneConfirmed: zoneConfirmed
    };
  };

  // Inject Global SOS Button into the header navigation
  const menuContainer = document.querySelector('.menu-container');
  if(menuContainer) {
    const sosBtn = document.createElement('button');
    sosBtn.id = 'global-sos-btn';
    sosBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 20px;">sos</span> Broadcast SOS';
    sosBtn.style.cssText = 'margin-right: 15px; padding: 6px 16px; border-radius: 20px; font-weight: bold; background: var(--danger); color: white; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3); transition: all 0.2s; font-family: inherit;';
    
    // Insert before the theme toggle button
    menuContainer.insertBefore(sosBtn, document.getElementById('theme-toggle'));

    sosBtn.addEventListener('mouseover', () => sosBtn.style.transform = 'scale(1.05)');
    sosBtn.addEventListener('mouseout', () => sosBtn.style.transform = 'scale(1)');

    sosBtn.addEventListener('click', () => {
      // Prompt broadcast UI
      showModal('<span class="material-symbols-outlined" style="vertical-align: middle; color: var(--danger);">sos</span> Broadcasting SOS', `
        <p>Acquiring your location to broadcast emergency signal...</p>
        <div style="text-align: center; margin: 20px 0;">
           <span class="material-symbols-outlined" style="font-size: 40px; color: var(--danger); animation: pulse 1s infinite;">sensors</span>
        </div>
      `);

      setTimeout(() => {
        let lat, lon;
        if (window.currentLiveCoords) {
           lat = window.currentLiveCoords.lat + (Math.random() - 0.5) * 0.0001; // tiny jitter
           lon = window.currentLiveCoords.lon + (Math.random() - 0.5) * 0.0001;
        } else {
           // Fallback to simulated coord if GPS fails
           lat = -25.9692 + (Math.random() - 0.5) * 0.003; 
           lon = 32.5732 + (Math.random() - 0.5) * 0.003;
        }
        
        const result = registerSOS(lat, lon, 'web-app');
        
        // Remove loading modal
        const existingModal = document.getElementById('dynamic-modal');
        if(existingModal) existingModal.remove();

        if(result.zoneConfirmed) {
          showModal('<span class="material-symbols-outlined" style="vertical-align: middle; color: var(--danger);">warning</span> CRITICAL ZONE ALERT', `
            <div style="background: rgba(220,53,69,0.1); border-left: 4px solid var(--danger); padding: 15px; border-radius: 4px; margin-bottom: 15px;">
              <p><strong>MASS ALERT TRIGGERED</strong></p>
              <p>We have received <strong>${result.reportsInZone} SOS signals</strong> within a 500m radius in the last 10 minutes.</p>
            </div>
            <p>This zone is now mathematically marked as <strong>CRITICALLY DANGEROUS</strong> based on crowdsourced SOS validation.</p>
            <p>Emergency Services have been dispatched to the cluster: <br><code>${lat.toFixed(4)}, ${lon.toFixed(4)}</code></p>
          `);
        } else {
          showModal('<span class="material-symbols-outlined" style="vertical-align: middle; color: var(--warning);">check_circle</span> SOS Signal Broadcasted', `
            <p>Your emergency signal has been successfully registered.</p>
            <p>Currently, there are <strong>${result.reportsInZone}</strong> active report(s) in your immediate 500m radius.</p>
            <p><em>(Clicking this SOS button 3 times will trigger the mass alert validation logic)</em></p>
            <div style="margin-top: 15px;">
              <small style="color: var(--text-muted);">Simulated Coords: ${lat.toFixed(4)}, ${lon.toFixed(4)}</small>
            </div>
          `);
        }
      }, 1500);
    });
  }

  // Chatbot Logic
  const chatFab = document.createElement('button');
  chatFab.className = 'chatbot-fab';
  chatFab.innerHTML = '<span class="material-symbols-outlined">smart_toy</span>';
  document.body.appendChild(chatFab);

  const chatWindow = document.createElement('div');
  chatWindow.className = 'chatbot-window';
  chatWindow.innerHTML = `
    <div class="chat-header">
      <h3><span class="material-symbols-outlined" style="color: var(--safe);">support_agent</span> FloodGuard Assistant</h3>
      <button class="chat-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div class="chat-body" id="chat-body">
      <div class="chat-message bot">Hello! I'm the FloodGuard AI Assistant. How can I help you navigate the app or find safety today?</div>
    </div>
    <form class="chat-input-area" id="chat-form">
      <input type="text" class="chat-input" id="chat-input" placeholder="Ask a question..." autocomplete="off" required>
      <button type="submit" class="chat-send"><span class="material-symbols-outlined">send</span></button>
    </form>
  `;
  document.body.appendChild(chatWindow);

  chatFab.addEventListener('click', () => {
    chatWindow.classList.add('open');
  });

  chatWindow.querySelector('.chat-close').addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');

  const addMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if(!userText) return;

    addMessage(userText, 'user');
    chatInput.value = '';

    // Mock AI Analysis Delay
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let botResponse = "I'm sorry, I didn't quite catch that. You can ask me about finding a <strong>route</strong>, locating a <strong>shelter</strong>, viewing <strong>alerts</strong>, or initiating the <strong>emergency protocol</strong>.";

      if (lowerText.includes('route') || lowerText.includes('directions') || lowerText.includes('map') || lowerText.includes('navigate')) {
        botResponse = "To calculate a safe route, head over to the <a href='map.html' style='color:var(--primary-color); font-weight:600;'>Evacuation Map</a> and click 'Calculate Route to Nearest Safehold'. I will ensure it avoids all active flood zones.";
      } else if (lowerText.includes('shelter') || lowerText.includes('safe') || lowerText.includes('gym')) {
        botResponse = "I recommend the <strong>High School Gym</strong>. It's currently only 20% full. You can search for it on the <a href='shelters.html' style='color:var(--primary-color); font-weight:600;'>Shelters Page</a>.";
      } else if (lowerText.includes('alert') || lowerText.includes('water level') || lowerText.includes('danger')) {
        botResponse = "Currently, <strong>Sector A</strong> is under a critical evacuation order. Please check the <a href='alerts.html' style='color:var(--primary-color); font-weight:600;'>Alerts Page</a> for the live emergency feed and your preparation checklist.";
      } else if (lowerText.includes('police') || lowerText.includes('hospital') || lowerText.includes('fire') || lowerText.includes('emergency')) {
        botResponse = "If you need immediate assistance, please trigger the <strong>Emergency Protocol</strong> on the <a href='index.html' style='color:var(--primary-color); font-weight:600;'>Dashboard</a> to view local contacts (911, Search & Rescue).";
      } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        botResponse = "Hi there! Stay safe. What do you need help finding?";
      }

      addMessage(botResponse, 'bot');
    }, 600);
  });
});
