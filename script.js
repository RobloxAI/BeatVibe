// Add this at the beginning of the file, after any existing code
function updateFeatureCounter() {
  const featureCards = document.querySelectorAll('.card');
  const count = featureCards.length - 1; // Subtract 1 as requested
  const counterElement = document.getElementById('feature-counter');
  counterElement.textContent = `${count}+ amazing features!`;
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', updateFeatureCounter);

// Add this to initialize keytrend button state on page load
document.addEventListener('DOMContentLoaded', updateKeytrendButtonState);

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close");

// Load saved data
let plannerTasks = JSON.parse(localStorage.getItem("plannerTasks")) || [];
let scheduleEvents = JSON.parse(localStorage.getItem("scheduleEvents")) || [];
let socialPosts = JSON.parse(localStorage.getItem("socialPosts")) || [];
let progressData = JSON.parse(localStorage.getItem("progressData")) || { beatsStarted: 0, beatsFinished: 0, goal: 10 };
let gearList = JSON.parse(localStorage.getItem("gearList")) || [];
let lyrics = localStorage.getItem("lyrics") || "";
let savedKeywords = JSON.parse(localStorage.getItem("savedKeywords")) || [];
let savedFeatures = JSON.parse(localStorage.getItem("savedFeatures")) || [];
let currentTheme = localStorage.getItem('theme') || 'cyberpunk';
let currentMode = localStorage.getItem('mode') || 'neon';
let brightness = localStorage.getItem('brightness') || 90;

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Track login state
let isLoggedIn = false;

// Function to update keytrend button state
function updateKeytrendButtonState() {
  const keytrendButton = document.querySelector('#keytrend-card .feature-button');
  if (keytrendButton) {
    keytrendButton.disabled = !isLoggedIn;
  }
}

// Load plugin and studio data
let plugins = JSON.parse(localStorage.getItem('plugins')) || [];
let studioSetup = JSON.parse(localStorage.getItem('studioSetup')) || {
    budget: 0,
    roomDimensions: { width: 0, length: 0 },
    equipment: []
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the Test One button
    const testOneButton = document.getElementById('test-one-button');
    if (testOneButton) {
        testOneButton.addEventListener('click', function() {
            openModal(`
                <div style="height: 300px; display: flex; justify-content: center; align-items: center;">
                    <h2 style="color: #00ffff;">This is a blank screen</h2>
                </div>
            `);
        });
    }

    // Set up modal close functionality
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Get the Sample Organizer button
    const sampleOrganizerButton = document.getElementById('sample-organizer-button');
    if (sampleOrganizerButton) {
        sampleOrganizerButton.addEventListener('click', openSampleOrganizer);
    }

    // Plugin Manager Feature
    const pluginManagerBtn = document.getElementById('plugin-manager-button');
    if (pluginManagerBtn) {
        pluginManagerBtn.addEventListener('click', openPluginManager);
    }

    const studioPlannerBtn = document.getElementById('studio-planner-button');
    if (studioPlannerBtn) {
        studioPlannerBtn.addEventListener('click', openStudioPlanner);
    }
});

// Sample management
let samples = JSON.parse(localStorage.getItem('samples')) || [];

function addSample() {
    const name = document.getElementById('sample-name').value;
    const tags = document.getElementById('sample-tags').value.split(',').map(tag => tag.trim());
    const category = document.getElementById('sample-category').value;
    
    if (!name) return;
    
    const sample = {
        id: Date.now(),
        name,
        tags,
        category,
        dateAdded: new Date().toLocaleDateString()
    };
    
    samples.push(sample);
    localStorage.setItem('samples', JSON.stringify(samples));
    renderSamples();
    
    // Clear inputs
    document.getElementById('sample-name').value = '';
    document.getElementById('sample-tags').value = '';
}

function deleteSample(id) {
    samples = samples.filter(sample => sample.id !== id);
    localStorage.setItem('samples', JSON.stringify(samples));
    renderSamples();
}

function renderSamples() {
    const samplesList = document.getElementById('samples-list');
    if (!samplesList) return;
    
    samplesList.innerHTML = `
        <div style="display: grid; gap: 10px;">
            ${samples.map(sample => `
                <div class="sample-item" style="
                    background: rgba(0,0,0,0.2);
                    padding: 15px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <h3 style="color: #00ffff; margin: 0;">${sample.name}</h3>
                        <p style="margin: 5px 0; color: #b8b8b8;">
                            Category: ${sample.category}<br>
                            Tags: ${sample.tags.join(', ')}<br>
                            Added: ${sample.dateAdded}
                        </p>
                    </div>
                    <button onclick="deleteSample(${sample.id})" class="feature-button">Delete</button>
                </div>
            `).join('')}
        </div>
    `;
}

function exportSampleList() {
    const exportText = samples.map(sample => 
        `Sample: ${sample.name}\nCategory: ${sample.category}\nTags: ${sample.tags.join(', ')}\nDate Added: ${sample.dateAdded}\n\n`
    ).join('---\n');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function openModal(content) {
    const modal = document.getElementById('modal');
    if (!modal) return;
    // Hide the feature counter
    const featureCounter = document.getElementById('feature-counter');
    if (featureCounter) featureCounter.style.display = 'none';
    // Set the modal content
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
  modalBody.innerHTML = content;
    }
    // Show the modal
    modal.style.display = 'block';
    // Hide all recommended and maintenance badges when modal is opened
    document.querySelectorAll('.recommended-badge, .maintenance-badge').forEach(badge => {
        badge.style.display = 'none';
    });
    // Set up close button functionality
    const closeButton = modal.querySelector('.close');
    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
            // Show all badges when modal is closed
            document.querySelectorAll('.recommended-badge, .maintenance-badge').forEach(badge => {
                badge.style.display = 'flex';
            });
            // Show the feature counter again
            if (featureCounter) featureCounter.style.display = '';
        };
    }
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            // Show all badges when modal is closed
            document.querySelectorAll('.recommended-badge, .maintenance-badge').forEach(badge => {
                badge.style.display = 'flex';
            });
            // Show the feature counter again
            if (featureCounter) featureCounter.style.display = '';
        }
    };
}

closeBtn.onclick = () => {
  modal.style.display = "none";
  // Show all badges when modal is closed
  document.querySelectorAll('.recommended-badge').forEach(badge => {
    badge.style.display = 'flex';
  });
  // Show the feature counter again
  const featureCounter = document.getElementById('feature-counter');
  if (featureCounter) featureCounter.style.display = '';
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    // Show all badges when modal is closed
    document.querySelectorAll('.recommended-badge').forEach(badge => {
      badge.style.display = 'flex';
    });
    // Show the feature counter again
    const featureCounter = document.getElementById('feature-counter');
    if (featureCounter) featureCounter.style.display = '';
  }
};

// Search Features
function searchFeatures() {
  const searchInput = document.getElementById("feature-search").value.toLowerCase();
  const featureCards = document.querySelectorAll(".card");
  featureCards.forEach(card => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    card.style.display = title.includes(searchInput) ? "block" : "none";
  });
}

// Plan feature
document.getElementById("plan-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Plan Your Success</h2>
    <input type="text" id="task-input" placeholder="Add a task...">
    <button onclick="addTask()">Add Task</button>
    <ul id="task-list" style="text-align: left; font-size: 1.2em;"></ul>
  `);
  renderTasks();
};

function addTask() {
  const taskInput = document.getElementById("task-input").value;
  if (taskInput) {
    plannerTasks.push({ text: taskInput, checked: false });
    localStorage.setItem("plannerTasks", JSON.stringify(plannerTasks));
    renderTasks();
    document.getElementById("task-input").value = "";
  }
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  plannerTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.checked ? "checked" : ""} onchange="toggleTask(${index})">
      ${task.text}
      ${task.checked ? `<span class="remove-btn" onclick="removeTask(${index})">×</span>` : ""}
    `;
    taskList.appendChild(li);
  });
}

function toggleTask(index) {
  plannerTasks[index].checked = !plannerTasks[index].checked;
  localStorage.setItem("plannerTasks", JSON.stringify(plannerTasks));
  renderTasks();
}

function removeTask(index) {
  plannerTasks.splice(index, 1);
  localStorage.setItem("plannerTasks", JSON.stringify(plannerTasks));
  renderTasks();
}

// Schedule feature
document.getElementById("schedule-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Schedule Your Drops</h2>
    <input type="text" id="event-name" placeholder="Event (e.g., Beat Drop)">
    <input type="number" id="event-day" min="1" max="31" placeholder="Day (1-31)">
    <button onclick="addEvent()">Add</button>
    <div id="calendar" class="calendar"></div>
  `);
  renderCalendar();
};

function renderCalendar() {
    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Navigation controls
    const navigation = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <button onclick="changeMonth(-1)" class="feature-button">&lt; Previous</button>
            <h2 style="color: #00ffff; margin: 0;">${months[currentMonth]} ${currentYear}</h2>
            <button onclick="changeMonth(1)" class="feature-button">Next &gt;</button>
        </div>
    `;

    // Calendar header
    const header = `
        <div class="calendar-grid">
            <div class="calendar-header">Sun</div>
            <div class="calendar-header">Mon</div>
            <div class="calendar-header">Tue</div>
            <div class="calendar-header">Wed</div>
            <div class="calendar-header">Thu</div>
            <div class="calendar-header">Fri</div>
            <div class="calendar-header">Sat</div>
        </div>
    `;

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get stored events
    const events = JSON.parse(localStorage.getItem('calendar-events') || '{}');
    const monthKey = `${currentYear}-${currentMonth}`;
    const monthEvents = events[monthKey] || {};

    // Generate calendar days
    let days = '';
    let dayCount = 1;
    const today = new Date();

    // Create weeks
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                days += '<div class="calendar-day empty"></div>';
            } else if (dayCount > daysInMonth) {
                days += '<div class="calendar-day empty"></div>';
            } else {
                const isToday = dayCount === today.getDate() && 
                               currentMonth === today.getMonth() && 
                               currentYear === today.getFullYear();
                
                const dayEvents = monthEvents[dayCount] || [];
                const eventsList = dayEvents.map(event => 
                    `<div class="calendar-event">
                        <span class="event-text">${event}</span>
                        <span class="event-delete" onclick="removeEvent('${dayCount}', ${dayEvents.indexOf(event)})">×</span>
                    </div>`
                ).join('');

                days += `
                    <div class="calendar-day ${isToday ? 'today' : ''}">
                        <div class="day-header">
                            <span class="day-number">${dayCount}</span>
                            <button onclick="addEvent(${dayCount})" class="add-event-btn">+</button>
                        </div>
                        <div class="events-container">
                            ${eventsList}
                        </div>
                    </div>`;
                dayCount++;
            }
        }
    }

    modalBody.innerHTML = `
        <div class="calendar-container">
            ${navigation}
            ${header}
            <div class="calendar-grid">
                ${days}
            </div>
        </div>
    `;
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function addEvent(day) {
    const modalBody = document.getElementById('modal-body');
    const currentContent = modalBody.innerHTML;
    
    modalBody.innerHTML = `
        <div class="event-input-container" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(26, 26, 46, 0.95);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            z-index: 1000;
            text-align: center;
        ">
            <h3 style="color: #00ffff; margin-bottom: 15px;">Add Event for Day ${day}</h3>
            <input type="text" 
                   id="new-event-input" 
                   placeholder="Enter event details..."
                   style="width: 300px; margin-bottom: 15px;"
                   autofocus>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="saveEvent(${day})" class="feature-button">Add</button>
                <button onclick="cancelAddEvent()" class="feature-button" style="background: rgba(255, 0, 255, 0.2);">Cancel</button>
            </div>
        </div>
        ${currentContent}
    `;

    // Focus the input
    document.getElementById('new-event-input').focus();

    // Add enter key listener
    document.getElementById('new-event-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEvent(day);
        }
    });
}

function saveEvent(day) {
    const eventInput = document.getElementById('new-event-input');
    const event = eventInput.value.trim();
    
    if (event) {
        const events = JSON.parse(localStorage.getItem('calendar-events') || '{}');
        const monthKey = `${currentYear}-${currentMonth}`;
        
        if (!events[monthKey]) {
            events[monthKey] = {};
        }
        if (!events[monthKey][day]) {
            events[monthKey][day] = [];
        }
        
        events[monthKey][day].push(event);
        localStorage.setItem('calendar-events', JSON.stringify(events));
    }
    
    renderCalendar();
  }

function cancelAddEvent() {
    renderCalendar();
}

// Update the removeEvent function to use a similar style
function removeEvent(day, index) {
    const modalBody = document.getElementById('modal-body');
    const currentContent = modalBody.innerHTML;
    
    modalBody.innerHTML = `
        <div class="event-input-container" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(26, 26, 46, 0.95);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #ff00ff;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
            z-index: 1000;
            text-align: center;
        ">
            <h3 style="color: #ff00ff; margin-bottom: 15px;">Delete Event?</h3>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="confirmRemoveEvent('${day}', ${index})" class="feature-button" style="background: rgba(255, 0, 255, 0.2);">Delete</button>
                <button onclick="cancelAddEvent()" class="feature-button">Cancel</button>
            </div>
        </div>
        ${currentContent}
    `;
}

function confirmRemoveEvent(day, index) {
    const events = JSON.parse(localStorage.getItem('calendar-events') || '{}');
    const monthKey = `${currentYear}-${currentMonth}`;
    
    if (events[monthKey] && events[monthKey][day]) {
        events[monthKey][day].splice(index, 1);
        if (events[monthKey][day].length === 0) {
            delete events[monthKey][day];
        }
    }
    
    localStorage.setItem('calendar-events', JSON.stringify(events));
  renderCalendar();
}

// Gear Hub feature
document.getElementById("gearhub-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Gear Hub</h2>
    <p>Your one-stop shop for production tools!</p>
    <button onclick="openDistributionTools()">Distribution Tools</button>
    <p>Explore platforms to get your music out there.</p>
    <button onclick="openMusicGear()">Music Gear</button>
    <p>Find top-tier production equipment.</p>
    <button onclick="openOnlineTools()">Online Tools</button>
    <p>Boost your workflow with digital resources.</p>
  `);
};

function openDistributionTools() {
  openModal(`
    <h2>Distribution Tools</h2>
    <p><strong>Unchained Music</strong>: Free distribution to 200+ platforms with no upfront costs—keep 100% of your royalties while they earn through DeFi interest. Perfect for indie artists breaking free!<br>
      <a href="https://www.unchainedmusic.io?fpr=beatvibe" target="_blank"><button>Sign Up</button></a></p>
    <p><strong>DistroKid</strong>: Unlimited uploads for $22.99/year—fast, reliable, and artist-friendly. Use our link for a 7% discount and get on Spotify, TikTok, and more in days!<br>
      <a href="https://distrokid.com/vip/seven/7689867" target="_blank"><button>Get 7% Off</button></a></p>
  `);
}

function openMusicGear() {
  openModal(`
    <h2>Music Gear</h2>
    <p>Explore must-have equipment to elevate your production game!</p>
    <p><strong>Focusrite Scarlett 2i2</strong>: A top-tier audio interface for crystal-clear recordings.<br>
      <a href="https://focusrite.com/en/audio-interface/scarlett" target="_blank"><button>Learn More</button></a></p>
    <p><strong>AKAI MPC One</strong>: Standalone beat-making power for hands-on creativity.<br>
      <a href="https://www.akaipro.com/mpc-one" target="_blank"><button>Learn More</button></a></p>
  `);
}

function openOnlineTools() {
  openModal(`
    <h2>Online Tools</h2>
    <p>Coming soon—digital resources to level up your production!</p>
  `);
}

// Beat Shop feature
document.getElementById("beatshop-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Premium Beats Shop</h2>
    <div class="beatshop-container">
      <div class="beatshop-header">
        <h3>🎵 Featured Beats</h3>
        <p>Limited Time Offer - All Beats Under $1!</p>
      </div>
      
      <div class="beat-grid">
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track?id=21927529" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track?id=22156621" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track?id=22156676" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track?id=22613621" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track?id=22622539" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track/?id=21825466" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track/?id=21786538" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track/?id=21668796" width="100%" height="156"></iframe>
        </div>
        <div class="beat-item">
          <iframe src="https://www.beatstars.com/embed/track/?id=21528961" width="100%" height="156"></iframe>
        </div>
      </div>

      <div class="beatshop-footer">
        <p>🎧 All beats include:</p>
        <ul>
          <li>✓ Untagged WAV file</li>
          <li>✓ Instant delivery</li>
          <li>✓ Basic lease rights</li>
          <li>✓ Commercial use allowed</li>
        </ul>
        <div class="sale-banner">
          <span class="sale-text">TODAY'S SPECIAL OFFER</span>
          <span class="timer" id="sale-timer">Ends at midnight: 23:59:59</span>
        </div>
      </div>
    </div>
  `);
  document.getElementById('modal-body').classList.add('beatshop');
  startSaleTimer();
};

function startSaleTimer() {
  const timerElement = document.getElementById('sale-timer');
  
  function updateTimer() {
    // Calculate time until next midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    let timeLeft = midnight - now;
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Update the timer display
    timerElement.textContent = `Ends at midnight: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // If we've reached midnight, reset the timer
    if (timeLeft <= 0) {
      timeLeft = 24 * 60 * 60 * 1000; // Reset to 24 hours
    }
  }
  
  // Update immediately and then every second
  updateTimer();
  setInterval(updateTimer, 1000);
}

// Price Your Beats feature
document.getElementById("price-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Price Your Beats</h2>
    <input type="number" id="views" placeholder="Expected Views">
    <input type="number" id="revenue" placeholder="Desired Revenue ($)">
    <label for="sell-rate">Sell-Through Rate: <span id="rate-value">0.5%</span></label>
    <input type="range" id="sell-rate" min="0.1" max="100" step="0.1" value="0.5" oninput="updateRate(this.value)">
    <button onclick="calculatePrice()">Calculate</button>
    <button onclick="showRateHelp()">How do I find my rate?</button>
    <p id="price-result"></p>
  `);
};

function updateRate(value) {
  document.getElementById("rate-value").textContent = `${value}%`;
}

function calculatePrice() {
  const views = parseInt(document.getElementById("views").value);
  const revenue = parseInt(document.getElementById("revenue").value);
  const sellRate = parseFloat(document.getElementById("sell-rate").value) / 100;
  if (views > 0 && revenue > 0) {
    const sales = views * sellRate;
    const pricePerBeat = (revenue / sales).toFixed(2);
    document.getElementById("price-result").innerHTML = 
      `Price your beat at $${pricePerBeat} to reach $${revenue} with ${views} views and ${sellRate * 100}% sell-through.`;
  } else {
    document.getElementById("price-result").innerHTML = "Please enter valid numbers.";
  }
}

function showRateHelp() {
  openModal(`
    <div class="rate-help">
      <p>Take your <strong>number of sales</strong> and divide it by your <strong>total views</strong>, then multiply by 100 for your percentage. For example, 5 sales from 1000 views = (5 / 1000) * 100 = <strong>0.5%</strong>. Most producers rock rates under 1%, so tweak that slider to match your vibe!</p>
    </div>
  `);
}

// Social Media Planner feature
document.getElementById("social-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Social Media Planner</h2>
    <input type="text" id="post-content" placeholder="Post Content (e.g., New beat drop!)">
    <select id="platform">
      <option value="youtube">YouTube</option>
      <option value="instagram">Instagram</option>
      <option value="tiktok">TikTok</option>
    </select>
    <input type="number" id="post-day" min="1" max="31" placeholder="Day (1-31)">
    <button onclick="addPost()">Schedule Post</button>
    <div id="post-list" style="text-align: left; font-size: 1.2em;"></div>
  `);
  renderPosts();
};

function addPost() {
  const content = document.getElementById("post-content").value;
  const platform = document.getElementById("platform").value;
  const day = parseInt(document.getElementById("post-day").value);
  if (content && day >= 1 && day <= 31) {
    socialPosts.push({ content, platform, day });
    localStorage.setItem("socialPosts", JSON.stringify(socialPosts));
    renderPosts();
    document.getElementById("post-content").value = "";
    document.getElementById("post-day").value = "";
  }
}

function renderPosts() {
  const postList = document.getElementById("post-list");
  postList.innerHTML = "<h3>Scheduled Posts</h3>";
  socialPosts.forEach((post, index) => {
    const div = document.createElement("div");
    div.innerHTML = `${post.day}: [${post.platform}] ${post.content} <span class="remove-btn" onclick="removePost(${index})">×</span>`;
    postList.appendChild(div);
  });
}

function removePost(index) {
  socialPosts.splice(index, 1);
  localStorage.setItem("socialPosts", JSON.stringify(socialPosts));
  renderPosts();
}

// Viral Score feature
document.getElementById("viral-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Viral Score Calculator</h2>
    <label>Tempo (BPM):</label><input type="number" id="tempo" placeholder="e.g., 120"><br>
    <label>Genre:</label><select id="genre">
      <option value="trap">Trap</option>
      <option value="pop">Pop</option>
      <option value="lofi">Lo-Fi</option>
      <option value="hiphop">Hip-Hop</option>
      <option value="edm">EDM</option>
      <option value="rnb">R&B</option>
      <option value="rock">Rock</option>
      <option value="jazz">Jazz</option>
      <option value="reggae">Reggae</option>
      <option value="drill">Drill</option>
      <option value="house">House</option>
    </select><br>
    <label>Hook Length (seconds):</label><input type="number" id="hook" placeholder="e.g., 15"><br>
    <button onclick="calculateViralScore()">Calculate</button>
    <p id="viral-result"></p>
  `);
};

function calculateViralScore() {
  const tempo = parseInt(document.getElementById("tempo").value);
  const genre = document.getElementById("genre").value;
  const hook = parseInt(document.getElementById("hook").value);
  if (tempo && hook) {
    let score = 0;
    let feedback = "";
    if (tempo >= 100 && tempo <= 140) score += 30;
    else if (tempo >= 80 && tempo < 100) score += 15;
    else score += 5;
    if (["trap", "pop", "edm", "drill"].includes(genre)) score += 25;
    else if (["hiphop", "rnb", "house"].includes(genre)) score += 15;
    else score += 10;
    if (hook <= 15) score += 35;
    else if (hook <= 25) score += 20;
    else score += 10;
    score = Math.min(score, 100);
    if (score >= 80) feedback = "This beat's a viral banger—perfect for TikTok domination!";
    else if (score >= 60) feedback = "Strong potential—shorten the hook or tweak the tempo to seal the deal.";
    else if (score >= 40) feedback = " Decent vibe—needs a catchier hook to go big.";
    else feedback = "Low viral odds—rework it for shorter, trendier appeal.";
    document.getElementById("viral-result").innerHTML = `Viral Score: ${score}/100. ${feedback}`;
  } else {
    document.getElementById("viral-result").innerHTML = "Please enter all fields!";
  }
}

// Progress Tracker feature
document.getElementById("progress-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Progress Tracker</h2>
    <div id="progress-stats">
      <p>Beats Started: <span id="beats-started">${progressData.beatsStarted}</span></p>
      <p>Beats Finished: <span id="beats-finished">${progressData.beatsFinished}</span></p>
      <p>Monthly Goal: <span id="goal">${progressData.goal}</span></p>
      <p>Progress: <span id="progress-percent">${Math.round((progressData.beatsFinished / progressData.goal) * 100)}%</span></p>
    </div>
    <input type="number" id="new-goal" placeholder="Set New Goal">
    <button onclick="updateGoal()">Update Goal</button>
    <button onclick="addStarted()">+1 Started</button>
    <button onclick="addFinished()">+1 Finished</button>
    <button onclick="subtractStarted()">-1 Started</button>
    <button onclick="subtractFinished()">-1 Finished</button>
    <button onclick="deleteAllProgress()">Delete All</button>
  `);
};

function updateGoal() {
  const newGoal = parseInt(document.getElementById("new-goal").value);
  if (newGoal > 0) {
    progressData.goal = newGoal;
    localStorage.setItem("progressData", JSON.stringify(progressData));
    updateProgressDisplay();
  }
}

function addStarted() {
  progressData.beatsStarted++;
  localStorage.setItem("progressData", JSON.stringify(progressData));
  updateProgressDisplay();
}

function addFinished() {
  progressData.beatsFinished++;
  localStorage.setItem("progressData", JSON.stringify(progressData));
  updateProgressDisplay();
}

function subtractStarted() {
  if (progressData.beatsStarted > 0) {
    progressData.beatsStarted--;
    localStorage.setItem("progressData", JSON.stringify(progressData));
    updateProgressDisplay();
  }
}

function subtractFinished() {
  if (progressData.beatsFinished > 0) {
    progressData.beatsFinished--;
    localStorage.setItem("progressData", JSON.stringify(progressData));
    updateProgressDisplay();
  }
}

function deleteAllProgress() {
  progressData = { beatsStarted: 0, beatsFinished: 0, goal: 10 };
  localStorage.setItem("progressData", JSON.stringify(progressData));
  updateProgressDisplay();
}

function updateProgressDisplay() {
  document.getElementById("beats-started").textContent = progressData.beatsStarted;
  document.getElementById("beats-finished").textContent = progressData.beatsFinished;
  document.getElementById("goal").textContent = progressData.goal;
  document.getElementById("progress-percent").textContent = `${Math.round((progressData.beatsFinished / progressData.goal) * 100)}%`;
}

// Beat Name Generator
document.getElementById("name-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Beat Name Generator</h2>
    <input type="text" id="vibe" placeholder="Vibe (e.g., dark, chill)">
    <select id="genre">
      <option value="trap">Trap</option>
      <option value="pop">Pop</option>
      <option value="lofi">Lo-Fi</option>
      <option value="hiphop">Hip-Hop</option>
      <option value="edm">EDM</option>
      <option value="rnb">R&B</option>
      <option value="rock">Rock</option>
      <option value="jazz">Jazz</option>
      <option value="reggae">Reggae</option>
      <option value="drill">Drill</option>
      <option value="house">House</option>
    </select>
    <button onclick="generateName()">Generate</button>
    <p id="name-result"></p>
  `);
};

function generateName() {
  const vibe = document.getElementById("vibe").value.toLowerCase() || "dope";
  const genre = document.getElementById("genre").value;
  const prefixes = {
    dark: ["Shadow", "Phantom", "Dusk", "Eclipse", "Grim", "Noir", "Abyss"],
    chill: ["Frost", "Velvet", "Haze", "Dawn", "Breeze", "Mellow", "Calm"],
    hype: ["Blaze", "Rush", "Storm", "Thunder", "Vortex", "Ignite", "Boom"],
    default: ["Midnight", "Golden", "Neon", "Cosmic", "Crystal", "Rogue", "Vibe"]
  };
  const suffixes = {
    dark: ["Void", "Shade", "Fury", "Crypt", "Drift", "Night", "Gloom"],
    chill: ["Vibes", "Wave", "Glow", "Chill", "Mist", "Dreams", "Flow"],
    hype: ["Pulse", "Drop", "Riser", "Heat", "Zone", "Crash", "Peak"],
    default: ["Flow", `${genre}in'`, "Bounce", "Spark", "Rush", "Eclipse", "Tune"]
  };
  const vibeKey = ["dark", "chill", "hype"].includes(vibe) ? vibe : "default";
  const prefix = prefixes[vibeKey][Math.floor(Math.random() * prefixes[vibeKey].length)];
  const suffix = suffixes[vibeKey][Math.floor(Math.random() * suffixes[vibeKey].length)];
  document.getElementById("name-result").innerHTML = `Generated Name: "${prefix} ${suffix}"`;
}

// Inspiration Dice
document.getElementById("dice-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Inspiration Dice</h2>
    <button class="dice-button" onclick="rollDice()">Roll Dice</button>
    <p id="dice-result"></p>
  `);
};

function rollDice() {
  const bpms = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180];
  const elements = [
    "vocal chop", "808 bass", "synth lead", "piano", "flute", "guitar", "strings", "brass",
    "pad", "arp", "kick roll", "hi-hat pattern", "snare fill", "percussion", "choir", "bell",
    "organ", "sax", "vinyl crackle", "reverse cymbal"
  ];
  const bpm = bpms[Math.floor(Math.random() * bpms.length)];
  const element = elements[Math.floor(Math.random() * elements.length)];
  document.getElementById("dice-result").innerHTML = `Try this: ${bpm} BPM with a ${element}.`;
}

// Gear Wishlist
document.getElementById("gear-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Gear Wishlist</h2>
    <input type="text" id="gear-name" placeholder="Gear (e.g., MPC One)">
    <input type="number" id="gear-cost" placeholder="Cost ($)">
    <button onclick="addGear()">Add Gear</button>
    <ul id="gear-list" style="text-align: left; font-size: 1.2em;"></ul>
  `);
  renderGear();
};

function addGear() {
  const name = document.getElementById("gear-name").value;
  const cost = parseInt(document.getElementById("gear-cost").value);
  if (name && cost > 0) {
    gearList.push({ name, cost });
    localStorage.setItem("gearList", JSON.stringify(gearList));
    renderGear();
    document.getElementById("gear-name").value = "";
    document.getElementById("gear-cost").value = "";
  }
}

function renderGear() {
  const gearListEl = document.getElementById("gear-list");
  gearListEl.innerHTML = "";
  gearList.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.cost} <span class="remove-btn" onclick="removeGear(${index})">×</span>`;
    gearListEl.appendChild(li);
  });
}

function removeGear(index) {
  gearList.splice(index, 1);
  localStorage.setItem("gearList", JSON.stringify(gearList));
  renderGear();
}

// Freestyle Lyric Pad
document.getElementById("lyric-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Freestyle Lyric Pad</h2>
    <textarea id="lyric-text" placeholder="Drop your rhymes here...">${lyrics}</textarea>
    <button onclick="saveLyrics()">Save</button>
  `);
};

function saveLyrics() {
  lyrics = document.getElementById("lyric-text").value;
  localStorage.setItem("lyrics", lyrics);
}

// Beat Tag Maker
document.getElementById("tag-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Beat Tag Maker</h2>
    <input type="text" id="tag-name" placeholder="Your Name (e.g., Thaker)">
    <select id="tag-style">
      <option value="hype">Hype</option>
      <option value="chill">Chill</option>
      <option value="dark">Dark</option>
    </select>
    <button onclick="generateTag()">Generate Tag</button>
    <p id="tag-result"></p>
  `);
};

function generateTag() {
  const name = document.getElementById("tag-name").value || "Thaker";
  const style = document.getElementById("tag-style").value;
  const tags = {
    hype: [`Yo, it's ${name} on the beat!`, `${name} in the house, let's go!`, `Drop it, ${name} made this!`],
    chill: [`${name} with the smooth vibes.`, `Laid back beats by ${name}.`, `${name} on the chill tip.`],
    dark: [`${name} brings the shadows.`, `Dark vibes by ${name}.`, `Creepin' with ${name} beats.`]
  };
  const tag = tags[style][Math.floor(Math.random() * tags[style].length)];
  document.getElementById("tag-result").innerHTML = `Generated Tag: "${tag}"`;
}

// Loop/Sample Library
document.getElementById("loop-card").querySelector(".feature-button").onclick = () => {
  openLoopLibrary();
};

function openLoopLibrary() {
  const content = `
    <h2>Loop & Sample Library</h2>
    <div class="loop-library">
      <h3>Free Drum Loops</h3>
      <ul>
        <li><a href="https://splice.com/sounds/free-samples" target="_blank">Splice Free Samples</a></li>
        <li><a href="https://samplefocus.com/" target="_blank">Sample Focus</a></li>
        <li><a href="https://soundpacks.com/free-sound-packs/" target="_blank">Soundpacks.com</a></li>
      </ul>
      
      <h3>Free Melodic Loops</h3>
      <ul>
        <li><a href="https://looperman.com/loops" target="_blank">Looperman</a></li>
        <li><a href="https://freesound.org/" target="_blank">Freesound</a></li>
        <li><a href="https://www.musicradar.com/news/tech/free-music-samples-download-loops-hits-and-multis-627820" target="_blank">MusicRadar</a></li>
      </ul>
      
      <h3>Free One-Shots</h3>
      <ul>
        <li><a href="https://www.landr.com/free-samples" target="_blank">LANDR</a></li>
        <li><a href="https://99sounds.org/" target="_blank">99Sounds</a></li>
        <li><a href="https://www.producerspot.com/download-free-samples-loops-kits" target="_blank">ProducerSpot</a></li>
      </ul>
    </div>
  `;
  openModal(content);
  document.getElementById('modal-body').classList.add('loop-library');
}

// Feedback Button
function openFeedback() {
  window.open("https://form.typeform.com/to/JYlQIGKa", "_blank");
}

// Trending Keyword Finder feature
document.getElementById("keytrend-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Trending Keyword Finder</h2>
    <p>Find trending keywords for your beats and analyze their potential.</p>
    
    <div class="keytrend-search">
      <input type="text" id="keyword-search" placeholder="Enter a keyword (e.g., 'trap beat', 'artist type beat')">
      <select id="time-filter" class="time-filter">
        <option value="all">All Time</option>
        <option value="year">Past Year</option>
        <option value="month">Past Month</option>
        <option value="week">Past Week</option>
        <option value="day">Today</option>
    </select>
      <button onclick="analyzeKeyword()">Analyze</button>
    </div>
    
    <div id="keytrend-results" class="keytrend-results">
      <p>Enter a keyword above to see analytics and suggestions.</p>
    </div>
    
    <div class="saved-keywords">
      <h3>Saved Keywords</h3>
      <div id="saved-list" class="saved-list">
        ${renderSavedKeywords()}
      </div>
    </div>
  `);
  document.getElementById('modal-body').classList.add('keytrend-analyzer');
};

function renderSavedKeywords() {
  if (savedKeywords.length === 0) {
    return "<p>No saved keywords yet. Analyze and save keywords to see them here.</p>";
  }
  
  return savedKeywords.map(keyword => 
    `<div class="keyword-tag" onclick="analyzeKeyword('${keyword}')">${keyword} <span class="remove-btn" onclick="event.stopPropagation(); removeKeyword('${keyword}')">×</span></div>`
  ).join('');
}

function removeKeyword(keyword) {
  savedKeywords = savedKeywords.filter(k => k !== keyword);
  localStorage.setItem("savedKeywords", JSON.stringify(savedKeywords));
  document.getElementById('saved-list').innerHTML = renderSavedKeywords();
}

function saveKeyword(keyword) {
  if (!savedKeywords.includes(keyword)) {
    savedKeywords.push(keyword);
    localStorage.setItem("savedKeywords", JSON.stringify(savedKeywords));
    document.getElementById('saved-list').innerHTML = renderSavedKeywords();
  }
}

function analyzeKeyword(presetKeyword) {
  const searchInput = presetKeyword || document.getElementById("keyword-search").value;
  
  if (!searchInput) {
    alert("Please enter a keyword to analyze");
    return;
  }
  
  const resultsDiv = document.getElementById("keytrend-results");
  resultsDiv.innerHTML = '<div class="loading-spinner"></div><p>Analyzing keyword data...</p>';
  
  // YouTube API key
  const apiKey = 'AIzaSyCvt8U2pZ7dPelPPcbBGsTlgWhiLWq6JEQ';
  
  // Make real API calls to YouTube
  fetchYouTubeData(searchInput, apiKey)
    .then(data => {
      displayResults(searchInput, data);
    })
    .catch(error => {
      resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

// Function to fetch data from YouTube API
async function fetchYouTubeData(keyword, apiKey) {
  try {
    // Get the time filter value
    const timeFilter = document.getElementById("time-filter").value;
    
    // Calculate the date based on the selected time filter
    const now = new Date();
    let publishedAfter;
    
    switch(timeFilter) {
      case 'day':
        publishedAfter = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        publishedAfter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        publishedAfter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        publishedAfter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        publishedAfter = null;
    }
    
    // Build the API URL with time filter if specified
    let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=10&key=${apiKey}`;
    if (publishedAfter) {
      apiUrl += `&publishedAfter=${publishedAfter.toISOString()}`;
    }
    
    const searchResponse = await fetch(apiUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.error) {
      throw new Error(searchData.error.message);
    }
    
    // Get video statistics for the top results
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const statsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`);
    const statsData = await statsResponse.json();
    
    // Calculate metrics
    const totalResults = searchData.pageInfo.totalResults;
    const competition = calculateCompetition(statsData.items);
    const trendDirection = determineTrendDirection(statsData.items);
    const exampleVideo = findBestExampleVideo(statsData.items);
    const relatedKeywords = generateRelatedKeywords(keyword);
    
    return {
      totalResults,
      competition,
      trendDirection,
      exampleVideo,
      relatedKeywords,
      suggestedKeywords: generateKeywordList(keyword),
      timeFilter: timeFilter // Include the time filter in the response
    };
  } catch (error) {
    console.error("YouTube API Error:", error);
    throw error;
  }
}

// Calculate competition level based on video statistics
function calculateCompetition(videos) {
  if (!videos || videos.length === 0) return 0.5;
  
  // Calculate average views, likes, and comments
  const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || 0), 0);
  const avgViews = totalViews / videos.length;
  
  // Adjust competition calculation to use 250k as threshold
  const normalizedViews = Math.min(avgViews / 250000, 1); // Changed from 500k to 250k
  return normalizedViews * 0.9; // Reduced discount from 20% to 10%
}

// Determine if the trend is rising, falling, or neutral
function determineTrendDirection(videos) {
  if (!videos || videos.length === 0) return 'neutral';
  
  // Check publish dates to see if there's an increase in recent videos
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const recentVideos = videos.filter(video => {
    const publishDate = new Date(video.snippet.publishedAt);
    return publishDate > oneMonthAgo;
  });
  
  const recentRatio = recentVideos.length / videos.length;
  
  if (recentRatio > 0.6) return 'up';
  if (recentRatio < 0.3) return 'down';
  return 'neutral';
}

// Find the best example video to show
function findBestExampleVideo(videos) {
  if (!videos || videos.length === 0) {
    return {
      title: "No videos found",
      views: 0,
      channel: "Unknown",
      thumbnail: "https://via.placeholder.com/320x180.png?text=No+Video+Found"
    };
  }
  
  // Sort by views and get the top one
  const sortedVideos = [...videos].sort((a, b) => 
    parseInt(b.statistics.viewCount || 0) - parseInt(a.statistics.viewCount || 0)
  );
  
  const topVideo = sortedVideos[0];
  return {
    title: topVideo.snippet.title,
    views: parseInt(topVideo.statistics.viewCount || 0),
    channel: topVideo.snippet.channelTitle,
    thumbnail: topVideo.snippet.thumbnails.medium.url,
    videoId: topVideo.id
  };
}

// Display the results in the UI
function displayResults(keyword, data) {
  const resultsDiv = document.getElementById("keytrend-results");
  const searchVolume = data.totalResults;
  const competition = data.competition;
  const trendDirection = data.trendDirection;
  const exampleVideo = data.exampleVideo;
  const relatedKeywords = data.relatedKeywords;
  const suggestedKeywords = data.suggestedKeywords;
  const timeFilter = data.timeFilter;
  
  // Get time period text
  const timePeriodText = {
    all: "All Time",
    year: "Past Year",
    month: "Past Month",
    week: "Past Week",
    day: "Today"
  }[timeFilter];
  
  // Calculate a more reasonable bar height for search volume
  const volumeBarHeight = Math.min(Math.log10(searchVolume) * 30, 180);
  
  // Format large numbers properly
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };
  
  resultsDiv.innerHTML = `
    <h3>Results for "${keyword}" (${timePeriodText})</h3>
    
    <div class="keytrend-metrics">
      <div class="metric-card">
        <h3>Search Volume</h3>
        <div class="value">${formatNumber(searchVolume)}</div>
        <div class="trend-direction ${trendDirection === 'up' ? 'trend-up' : (trendDirection === 'down' ? 'trend-down' : 'trend-neutral')}">
          ${trendDirection === 'up' ? '↑ Rising' : (trendDirection === 'down' ? '↓ Falling' : '→ Stable')}
        </div>
      </div>
      
      <div class="metric-card">
        <h3>Competition</h3>
        <div class="value">${Math.round(competition * 100)}%</div>
        <div class="trend-direction ${competition < 0.5 ? 'trend-up' : (competition > 0.8 ? 'trend-down' : 'trend-neutral')}">
          ${competition < 0.5 ? 'Low' : (competition > 0.8 ? 'High' : 'Medium')}
        </div>
      </div>
      
      <div class="metric-card">
        <h3>Potential</h3>
        <div class="value">${calculatePotential(searchVolume, competition)}/10</div>
        <div class="trend-direction ${trendDirection === 'up' ? 'trend-up' : 'trend-neutral'}">
          ${trendDirection === 'up' ? 'Good Opportunity' : 'Worth Considering'}
        </div>
      </div>
    </div>
    
    <div class="visualization-container">
      <div class="bar" style="left: 20%; height: ${volumeBarHeight}px;">
        <div class="bar-label">Search Volume</div>
      </div>
      <div class="bar" style="left: 50%; height: ${competition * 180}px;">
        <div class="bar-label">Competition</div>
      </div>
      <div class="bar" style="left: 80%; height: ${calculatePotential(searchVolume, competition) * 18}px;">
        <div class="bar-label">Potential</div>
      </div>
    </div>
    
    <div class="related-keywords">
      <h3>Related Keywords</h3>
      <div>
        ${relatedKeywords.map(kw => `<span class="keyword-tag" onclick="analyzeKeyword('${kw}')">${kw}</span>`).join('')}
      </div>
    </div>
    
    <div class="example-video">
      <h3>Example Trending Video</h3>
      <img src="${exampleVideo.thumbnail}" alt="Video thumbnail" class="video-thumbnail">
      <p><strong>${exampleVideo.title}</strong></p>
      <p>${exampleVideo.views.toLocaleString()} views • ${exampleVideo.channel}</p>
      ${exampleVideo.videoId ? `<a href="https://www.youtube.com/watch?v=${exampleVideo.videoId}" target="_blank" class="feature-button">Watch Video</a>` : ''}
    </div>
    
    <div class="copy-keywords">
      <h3>Suggested Keywords List</h3>
      <p>Copy and paste these keywords for your video description:</p>
      <textarea class="keywords-textarea" readonly>${suggestedKeywords}</textarea>
      <button onclick="copyToClipboard('.keywords-textarea')">Copy to Clipboard</button>
    </div>
    
    <button onclick="saveKeyword('${keyword}')" class="feature-button">Save This Keyword</button>
  `;
}

function calculatePotential(volume, competition) {
  // Simple algorithm to calculate potential score out of 10
  const volumeScore = Math.min(volume / 2000, 5); // Max 5 points for volume
  const competitionScore = 5 * (1 - competition); // Max 5 points for low competition
  return Math.round(volumeScore + competitionScore);
}

function generateRelatedKeywords(keyword) {
  // Generate related keywords based on the input
  const baseKeywords = keyword.toLowerCase().split(' ');
  const genres = ['trap', 'drill', 'lofi', 'boom bap', 'rnb', 'pop', 'club', 'dark', 'emotional'];
  const artists = ['drake', 'travis scott', 'kendrick lamar', 'j cole', 'future', 'lil baby', 'metro boomin'];
  const descriptors = ['hard', 'chill', 'melodic', 'aggressive', 'smooth', 'ambient', 'bouncy'];
  
  const related = [];
  
  // Add genre variations
  genres.slice(0, 3).forEach(genre => {
    if (!keyword.includes(genre)) {
      related.push(`${genre} ${keyword}`);
    }
  });
  
  // Add artist variations
  artists.slice(0, 3).forEach(artist => {
    if (!keyword.includes(artist)) {
      related.push(`${artist} type ${keyword}`);
    }
  });
  
  // Add descriptor variations
  descriptors.slice(0, 3).forEach(descriptor => {
    if (!keyword.includes(descriptor)) {
      related.push(`${descriptor} ${keyword}`);
    }
  });
  
  // Return 5-8 random related keywords
  return shuffleArray(related).slice(0, 5 + Math.floor(Math.random() * 4));
}

function generateKeywordList(keyword) {
  // Generate a comprehensive list of keywords for copying
  const baseKeyword = keyword.toLowerCase();
  const genres = ['trap', 'drill', 'lofi', 'boom bap', 'rnb', 'hip hop', 'rap', 'pop'];
  const artists = ['drake', 'travis scott', 'kendrick lamar', 'j cole', 'future', 'lil baby', 'metro boomin'];
  const descriptors = ['hard', 'chill', 'melodic', 'aggressive', 'smooth', 'ambient', 'bouncy'];
  const years = ['2023', '2024'];
  
  let keywordList = [
    baseKeyword,
    `${baseKeyword} instrumental`,
    `${baseKeyword} beat`,
    `${baseKeyword} type beat`,
    `free ${baseKeyword}`,
  ];
  
  // Add genre combinations
  genres.slice(0, 4).forEach(genre => {
    if (!baseKeyword.includes(genre)) {
      keywordList.push(`${genre} ${baseKeyword}`);
      keywordList.push(`${baseKeyword} ${genre} beat`);
    }
  });
  
  // Add artist combinations
  artists.slice(0, 4).forEach(artist => {
    if (!baseKeyword.includes(artist)) {
      keywordList.push(`${artist} type ${baseKeyword}`);
      keywordList.push(`${baseKeyword} ${artist} type beat`);
    }
  });
  
  // Add year combinations
  years.forEach(year => {
    keywordList.push(`${baseKeyword} ${year}`);
    keywordList.push(`${baseKeyword} beat ${year}`);
  });
  
  // Add some descriptor combinations
  descriptors.slice(0, 4).forEach(descriptor => {
    if (!baseKeyword.includes(descriptor)) {
      keywordList.push(`${descriptor} ${baseKeyword}`);
    }
  });
  
  // Shuffle and join with commas
  return shuffleArray(keywordList).join(', ');
}

function copyToClipboard(selector) {
  const element = document.querySelector(selector);
  element.select();
  document.execCommand('copy');
  alert('Copied to clipboard!');
}

function capitalizeFirstLetter(string) {
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function toggleSaveFeature(featureId) {
  const star = document.querySelector(`#${featureId}-card .save-star`);
  const featureTitle = document.querySelector(`#${featureId}-card h2`).textContent;
  const featureDesc = document.querySelector(`#${featureId}-card p`).textContent;
  
  if (savedFeatures.some(f => f.id === featureId)) {
    // Remove from saved features
    savedFeatures = savedFeatures.filter(f => f.id !== featureId);
    star.classList.remove('saved');
  } else {
    // Add to saved features
    savedFeatures.push({
      id: featureId,
      title: featureTitle,
      description: featureDesc
    });
    star.classList.add('saved');
  }
  
  localStorage.setItem("savedFeatures", JSON.stringify(savedFeatures));
  renderSavedFeatures();
}

function toggleSidebar() {
  const sidebar = document.getElementById('saved-features-sidebar');
  sidebar.classList.toggle('show');
}

function renderSavedFeatures() {
  const savedList = document.getElementById('saved-features-list');
  if (savedFeatures.length === 0) {
    savedList.innerHTML = '<p>No saved features yet. Click the star on any feature to save it here!</p>';
    return;
  }
  
  savedList.innerHTML = savedFeatures.map(feature => `
    <div class="saved-feature" onclick="document.querySelector('#${feature.id}-card .feature-button').click()">
      <h3>${feature.title}</h3>
      <p>${feature.description}</p>
    </div>
  `).join('');
}

window.onload = function() {
  // Initialize saved feature stars
  savedFeatures.forEach(feature => {
    const star = document.querySelector(`#${feature.id}-card .save-star`);
    if (star) star.classList.add('saved');
  });
  renderSavedFeatures();
  
  // Apply saved settings
  applyTheme();
  applyMode();
  applyBrightness();
};

function toggleSettings() {
  document.getElementById('settings-panel').classList.toggle('show');
}

function setTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  applyTheme();
}

function setMode(mode) {
  currentMode = mode;
  localStorage.setItem('mode', mode);
  applyMode();
}

function adjustBrightness(value) {
  brightness = value;
  localStorage.setItem('brightness', value);
  document.querySelector('.brightness-value').textContent = `${value}%`;
  applyBrightness();
}

function applyTheme() {
  const root = document.documentElement;
  const theme = getThemeColors(currentTheme);
  
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--accent', theme.accent);
  
  // Apply theme classes
  document.body.className = `theme-${currentTheme} mode-${currentMode}`;
  
  // Update neon effects based on theme
  document.querySelectorAll('.neon-border').forEach(el => {
    el.style.borderColor = theme.primary;
    el.style.boxShadow = `0 0 15px ${theme.primary}, 0 0 30px ${theme.secondary}`;
  });
  
  // Update text colors
  document.querySelectorAll('.neon-text').forEach(el => {
    el.style.textShadow = `0 0 5px ${theme.secondary}, 0 0 15px ${theme.primary}, 0 0 30px ${theme.secondary}`;
  });
}

function applyMode() {
  const root = document.documentElement;
  const mode = getModeColors(currentMode);
  
  root.style.setProperty('--bg', mode.bg);
  root.style.setProperty('--card-bg', mode.cardBg);
  root.style.setProperty('--text', mode.text);
  root.style.setProperty('--border', mode.border);
  
  // Apply mode classes
  document.body.className = `theme-${currentTheme} mode-${currentMode}`;
  
  // Update card backgrounds
  document.querySelectorAll('.card').forEach(card => {
    card.style.background = mode.cardBg;
  });
}

function applyBrightness() {
  const root = document.documentElement;
  const brightnessValue = brightness / 100;
  
  // Apply brightness to neon effects
  document.querySelectorAll('.neon-border').forEach(el => {
    el.style.opacity = brightnessValue;
  });
  
  document.querySelectorAll('.neon-text').forEach(el => {
    el.style.opacity = brightnessValue;
  });
  
  // Apply brightness to stars and nebula
  document.querySelectorAll('.stars, .nebula').forEach(el => {
    el.style.opacity = brightnessValue * 0.3;
  });
}

function getThemeColors(theme) {
  const themes = {
    cyberpunk: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffd700'
    },
    inferno: {
      primary: '#ff4d4d',
      secondary: '#ff8c00',
      accent: '#ffcc00'
    },
    forest: {
      primary: '#00ff9d',
      secondary: '#006644',
      accent: '#99ff99'
    },
    ocean: {
      primary: '#00ccff',
      secondary: '#0066cc',
      accent: '#99ffff'
    },
    aurora: {
      primary: '#ff66ff',
      secondary: '#66ffcc',
      accent: '#ccff99'
    },
    sunset: {
      primary: '#ff9966',
      secondary: '#ff66cc',
      accent: '#ffcc99'
    }
  };
  return themes[theme] || themes.cyberpunk;
}

function getModeColors(mode) {
  const modes = {
    neon: {
      bg: '#1a1a2e',
      cardBg: '#16213e',
      text: '#ffffff',
      border: '#00ffff'
    },
    dark: {
      bg: '#121212',
      cardBg: '#1e1e1e',
      text: '#ffffff',
      border: '#333333'
    },
    light: {
      bg: '#f5f5f5',
      cardBg: '#ffffff',
      text: '#333333',
      border: '#dddddd'
    }
  };
  return modes[mode] || modes.neon;
}

// Melody Pattern Generator
document.getElementById("melody-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Melody Pattern Generator</h2>
    <div class="melody-generator">
      <div class="controls">
        <select id="melody-style">
      <option value="trap">Trap</option>
          <option value="rnb">R&B</option>
      <option value="pop">Pop</option>
      <option value="lofi">Lo-Fi</option>
    </select>
        <select id="melody-length">
          <option value="4">4 Bars</option>
          <option value="8">8 Bars</option>
          <option value="16">16 Bars</option>
        </select>
        <button onclick="generateMelody()">Generate</button>
      </div>
      <div id="melody-result" class="melody-display"></div>
      <div class="melody-tips">
        <h3>Pattern Guide:</h3>
        <ul>
          <li>X = Note Hit</li>
          <li>- = Rest</li>
          <li>~ = Slide/Glide</li>
          <li>* = Accent</li>
        </ul>
      </div>
    </div>
  `);
};

function generateMelody() {
  const style = document.getElementById("melody-style").value;
  const length = parseInt(document.getElementById("melody-length").value);
  
  const patterns = {
    trap: ["X-X-", "X--X", "X~--", "X*--"],
    rnb: ["X-~X", "X--~", "X~X-", "X*X-"],
    pop: ["X-XX", "XX-X", "X*XX", "XX~X"],
    lofi: ["X~~X", "X-~-", "X~X~", "X*~-"]
  };
  
  let melody = "";
  for (let i = 0; i < length; i++) {
    melody += patterns[style][Math.floor(Math.random() * patterns[style].length)];
  }
  
  const result = document.getElementById("melody-result");
  result.innerHTML = `
    <div class="pattern-grid">
      ${melody.split("").map(note => `<div class="note ${note !== '-' ? 'active' : ''}">${note}</div>`).join("")}
    </div>
    <div class="pattern-info">
      <p>Style: ${style.toUpperCase()}</p>
      <p>Length: ${length} Bars</p>
      <button onclick="exportMelody('${melody}')" class="export-btn">Export Pattern</button>
    </div>
  `;
}

function exportMelody(melody) {
  const element = document.createElement('a');
  const file = new Blob([
    `Melody Pattern Export\n` +
    `Generated by BeatVibe\n` +
    `Date: ${new Date().toLocaleString()}\n\n` +
    `Pattern:\n${melody}\n\n` +
    `Legend:\n` +
    `X = Note Hit\n` +
    `- = Rest\n` +
    `~ = Slide/Glide\n` +
    `* = Accent`
  ], {type: 'text/plain'});
  
  element.href = URL.createObjectURL(file);
  element.download = `melody-pattern-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Drum Pattern Generator
document.getElementById("drum-pattern-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Drum Pattern Generator</h2>
    <div class="drum-generator">
      <div class="controls">
        <select id="drum-style">
          <option value="trap">Trap</option>
          <option value="hiphop">Hip Hop</option>
          <option value="rnb">R&B</option>
          <option value="house">House</option>
        </select>
        <select id="pattern-complexity">
          <option value="simple">Simple</option>
          <option value="medium">Medium</option>
          <option value="complex">Complex</option>
        </select>
        <button onclick="generateDrumPattern()">Generate</button>
      </div>
      <div id="drum-result" class="drum-pattern-display"></div>
      <div class="pattern-info">
        <p>Pattern Guide:</p>
        <ul>
          <li>K = Kick</li>
          <li>S = Snare</li>
          <li>H = Hi-hat</li>
          <li>C = Clap</li>
    </ul>
      </div>
      <button onclick="exportDrumPattern()" class="export-btn">Export Pattern</button>
    </div>
  `);
};

function generateDrumPattern() {
  const style = document.getElementById("drum-style").value;
  const complexity = document.getElementById("pattern-complexity").value;
  
  const patterns = {
    trap: {
      simple: {
        kick:   "K---K---K---K---",
        snare:  "----S-------S---",
        hihat:  "H-H-H-H-H-H-H-H-"
      },
      medium: {
        kick:   "K--KK--K-K--K---",
        snare:  "----S-------S-S-",
        hihat:  "H-HHH-H-H-HHH-H-"
      },
      complex: {
        kick:   "K-KKK--KK-K-K-K-",
        snare:  "----S--S----S-S-",
        hihat:  "HHHHHHHHHHHHHHHH"
      }
    },
    hiphop: {
      simple: {
        kick:   "K---K---K---K---",
        snare:  "----S-------S---",
        hihat:  "H-H-H-H-H-H-H-H-"
      },
      medium: {
        kick:   "K---K-K-K---K-K-",
        snare:  "----S-------S---",
        hihat:  "H-H-HHH-H-H-HHH-"
      },
      complex: {
        kick:   "K-K-K-KKK---K-K-",
        snare:  "----S--S----S-S-",
        hihat:  "HHHHHHHHHHHHHHHH"
      }
    }
  };
  
  const result = document.getElementById("drum-result");
  const pattern = patterns[style][complexity];
  
  result.innerHTML = `
    <div class="drum-grid">
      ${Object.entries(pattern).map(([drum, sequence]) => `
        <div class="drum-row">
          <span>${drum}</span>
          ${sequence.split('').map(hit => 
            `<div class="drum-hit ${hit !== '-' ? 'active' : ''}">${hit}</div>`
          ).join('')}
        </div>
      `).join('')}
    </div>
  `;
  
  // Store the current pattern for export
  window.currentDrumPattern = pattern;
}

// Drum Pattern Generator Export Function
function exportDrumPattern() {
    const drumPattern = generateDrumPattern(); // Assuming this function generates the drum pattern
    const midiData = convertDrumPatternToMIDI(drumPattern); // Convert to MIDI format
    downloadMIDI(midiData, 'drum_pattern.mid'); // Function to download MIDI file
}

// Function to convert drum pattern to MIDI format
function convertDrumPatternToMIDI(pattern) {
    // Logic to convert drum pattern data to MIDI format
}

function exportDrumPattern() {
  if (!window.currentDrumPattern) return;
  
  const pattern = window.currentDrumPattern;
  const style = document.getElementById("drum-style").value;
  const complexity = document.getElementById("pattern-complexity").value;
  
  const element = document.createElement('a');
  const file = new Blob([
    `Drum Pattern Export\n` +
    `Generated by BeatVibe\n` +
    `Date: ${new Date().toLocaleString()}\n\n` +
    `Style: ${style}\n` +
    `Complexity: ${complexity}\n\n` +
    `Pattern:\n` +
    Object.entries(pattern).map(([drum, sequence]) => 
      `${drum}: ${sequence}`
    ).join('\n') +
    `\n\nLegend:\n` +
    `K = Kick\n` +
    `S = Snare\n` +
    `H = Hi-hat\n` +
    `C = Clap`
  ], {type: 'text/plain'});
  
  element.href = URL.createObjectURL(file);
  element.download = `drum-pattern-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Audio Converter
document.getElementById("audio-converter-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Audio Converter</h2>
    <div class="converter">
      <div class="upload-section">
        <input type="file" id="audio-file" accept="audio/*" class="neon-input">
      </div>
      <div class="controls">
        <select id="output-format">
          <option value="wav">WAV</option>
          <option value="mp3">MP3</option>
          <option value="ogg">OGG</option>
          <option value="flac">FLAC</option>
        </select>
        <select id="audio-quality">
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality</option>
        </select>
        <button onclick="convertAudio()">Convert</button>
      </div>
      <div id="conversion-status"></div>
    </div>
  `);
};

function convertAudio() {
  const file = document.getElementById("audio-file").files[0];
  const format = document.getElementById("output-format").value;
  const quality = document.getElementById("audio-quality").value;
  
  if (!file) {
    alert("Please select an audio file to convert");
    return;
  }
  
  const status = document.getElementById("conversion-status");
  status.innerHTML = `<p>Converting ${file.name} to ${format.toUpperCase()}...</p>`;
  
  // Simulate conversion process
  setTimeout(() => {
    status.innerHTML += `<p>Conversion complete! Click below to download.</p>`;
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "export-btn";
    downloadBtn.textContent = "Download Converted File";
    downloadBtn.onclick = () => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = `converted-${Date.now()}.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    status.appendChild(downloadBtn);
  }, 2000);
}

// File Optimizer
document.getElementById("file-optimizer-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>File Size Optimizer</h2>
    <div class="optimizer">
      <div class="upload-section">
        <input type="file" id="optimize-file" accept="audio/*,video/*" class="neon-input">
      </div>
      <div class="controls">
        <select id="target-size">
          <option value="small">Small (< 10MB)</option>
          <option value="medium">Medium (< 50MB)</option>
          <option value="large">Large (< 100MB)</option>
        </select>
        <select id="optimize-quality">
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality</option>
        </select>
        <button onclick="optimizeFile()">Optimize</button>
      </div>
      <div id="optimization-status"></div>
    </div>
  `);
};

function optimizeFile() {
  const file = document.getElementById("optimize-file").files[0];
  const targetSize = document.getElementById("target-size").value;
  const quality = document.getElementById("optimize-quality").value;
  
  if (!file) {
    alert("Please select a file to optimize");
    return;
  }
  
  const status = document.getElementById("optimization-status");
  status.innerHTML = `<p>Optimizing ${file.name}...</p>`;
  
  // Simulate optimization process
  setTimeout(() => {
    status.innerHTML += `<p>Optimization complete! Click below to download.</p>`;
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "export-btn";
    downloadBtn.textContent = "Download Optimized File";
    downloadBtn.onclick = () => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = `optimized-${Date.now()}.${file.name.split('.').pop()}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    status.appendChild(downloadBtn);
  }, 2000);
}

// Chord Generator
document.getElementById("chord-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Chord Generator</h2>
    <div class="chord-generator">
      <div class="controls">
        <select id="chord-key">
          <option value="C">C</option>
          <option value="G">G</option>
          <option value="D">D</option>
          <option value="A">A</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="Bb">Bb</option>
          <option value="Eb">Eb</option>
        </select>
        <select id="chord-scale">
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          <option value="harmonic">Harmonic Minor</option>
          <option value="melodic">Melodic Minor</option>
        </select>
        <select id="chord-style">
          <option value="basic">Basic</option>
          <option value="jazz">Jazz</option>
          <option value="emotional">Emotional</option>
          <option value="lofi">Lo-Fi</option>
        </select>
        <button onclick="generateChords()">Generate</button>
      </div>
      <div id="chord-result" class="chord-display"></div>
      <div class="chord-tips">
        <h3>Tips:</h3>
        <ul>
          <li>Try different keys to find the perfect range</li>
          <li>Experiment with scales for different moods</li>
          <li>Mix styles for unique progressions</li>
    </ul>
      </div>
      <button onclick="exportChords()" class="export-btn">Export Progression</button>
    </div>
  `);
};

function generateChords() {
  const key = document.getElementById("chord-key").value;
  const scale = document.getElementById("chord-scale").value;
  const style = document.getElementById("chord-style").value;
  
  const progressions = {
    basic: {
      major: ["I", "IV", "V", "I"],
      minor: ["i", "iv", "v", "i"],
      harmonic: ["i", "V", "VI", "i"],
      melodic: ["i", "IV", "V", "i"]
    },
    jazz: {
      major: ["IImaj7", "V7", "Imaj7", "VI7"],
      minor: ["ii7b5", "V7", "i7", "VI7"],
      harmonic: ["i7", "V7b9", "VImaj7", "ii7b5"],
      melodic: ["i7", "IV7", "V7", "i7"]
    },
    emotional: {
      major: ["I", "vi", "IV", "V"],
      minor: ["i", "VI", "III", "VII"],
      harmonic: ["i", "VI", "V", "i"],
      melodic: ["i", "IV", "VII", "III"]
    },
    lofi: {
      major: ["Imaj7", "IVmaj7", "iii7", "VI7"],
      minor: ["i7", "iv7", "VII7", "VI7"],
      harmonic: ["i7", "VImaj7", "V7", "i7"],
      melodic: ["i7", "IVmaj7", "V7", "i7"]
    }
  };
  
  const chordMap = {
    C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
    G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
    D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
    A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
    E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
    F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
    Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
    Eb: ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"]
  };
  
  const progression = progressions[style][scale];
  const result = document.getElementById("chord-result");
  
  // Store current progression for export
  window.currentProgression = {
    key,
    scale,
    style,
    progression
  };
  
  result.innerHTML = `
    <div class="progression">
      ${progression.map(chord => `<div class="chord">${chord}</div>`).join('')}
    </div>
    <p class="progression-info">
      Key: ${key} ${scale}<br>
      Style: ${style}
    </p>
  `;
}

// Chord Generator Export Function
function exportChords() {
    const chordProgression = generateChords(); // Assuming this function generates the chord progression
    const midiData = convertChordsToMIDI(chordProgression); // Convert to MIDI format
    downloadMIDI(midiData, 'chord_progression.mid'); // Function to download MIDI file
}

// Function to convert chords to MIDI format
function convertChordsToMIDI(chords) {
    // Logic to convert chord data to MIDI format
}

// Function to download MIDI file
function downloadMIDI(midiData, filename) {
    const blob = new Blob([midiData], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function exportAnalysis() {
  const content = document.getElementById("trend-results").innerText;
  
  const element = document.createElement('a');
  const file = new Blob([
    `Trending Sound Analysis\n` +
    `Generated by BeatVibe\n` +
    `Date: ${new Date().toLocaleString()}\n\n` +
    content
  ], {type: 'text/plain'});
  
  element.href = URL.createObjectURL(file);
  element.download = `trend-analysis-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Reference Matcher
document.getElementById("reference-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Reference Track Matcher</h2>
    <div class="reference-matcher">
      <div class="upload-section">
        <div class="track-input">
          <h3>Your Track</h3>
          <input type="file" id="your-track" accept="audio/*" class="neon-input">
        </div>
        <div class="track-input">
          <h3>Reference Track</h3>
          <input type="file" id="ref-track" accept="audio/*" class="neon-input">
        </div>
      </div>
      <div class="analysis-options">
        <button onclick="analyzeAudio()" class="analyze-btn">Analyze</button>
      </div>
      <div id="analysis-result" class="analysis-display">
        <div class="meter-container">
          <div class="meter-header">
            <h3>Loudness Match</h3>
            <span class="meter-value">0%</span>
          </div>
          <div class="meter-wrapper">
            <div class="meter" id="loudness-meter"></div>
          </div>
        </div>
        <div class="meter-container">
          <div class="meter-header">
            <h3>Frequency Balance</h3>
            <span class="meter-value">0%</span>
          </div>
          <div class="meter-wrapper">
            <div class="meter" id="freq-meter"></div>
          </div>
        </div>
        <div class="meter-container">
          <div class="meter-header">
            <h3>Stereo Width</h3>
            <span class="meter-value">0%</span>
          </div>
          <div class="meter-wrapper">
            <div class="meter" id="stereo-meter"></div>
          </div>
        </div>
        <div class="meter-container">
          <div class="meter-header">
            <h3>Dynamic Range</h3>
            <span class="meter-value">0%</span>
          </div>
          <div class="meter-wrapper">
            <div class="meter" id="dynamics-meter"></div>
          </div>
        </div>
        <button onclick="exportAnalysis()" class="export-btn" id="export-btn" style="display: none;">Export Analysis</button>
      </div>
    </div>
  `);
};

function analyzeAudio() {
  const yourTrack = document.getElementById("your-track").files[0];
  const refTrack = document.getElementById("ref-track").files[0];
  
  if (!yourTrack || !refTrack) {
    alert("Please upload both tracks to analyze");
    return;
  }
  
  // Simulate analysis with random values
  const meters = ["loudness-meter", "freq-meter", "stereo-meter", "dynamics-meter"];
  const values = {};
  
  meters.forEach(meter => {
    const match = Math.random() * 100;
    values[meter] = match.toFixed(1);
    const meterEl = document.getElementById(meter);
    meterEl.style.width = `${match}%`;
    meterEl.style.background = 
      match > 90 ? "linear-gradient(90deg, var(--primary), var(--secondary))" : 
      match > 70 ? "linear-gradient(90deg, var(--accent), var(--primary))" : 
      "linear-gradient(90deg, #ff0000, #ff6600)";
    
    // Update meter value display
    meterEl.closest('.meter-container').querySelector('.meter-value').textContent = `${match.toFixed(1)}%`;
  });
  
  // Show export button
  document.getElementById('export-btn').style.display = 'block';
  
  // Store values for export
  window.analysisValues = values;
}

function exportAnalysis() {
  if (!window.analysisValues) return;
  
  const element = document.createElement('a');
  const file = new Blob([
    `Reference Track Analysis Report\n` +
    `Generated by BeatVibe\n` +
    `Date: ${new Date().toLocaleString()}\n\n` +
    `Analysis Results:\n` +
    `Loudness Match: ${window.analysisValues['loudness-meter']}%\n` +
    `Frequency Balance: ${window.analysisValues['freq-meter']}%\n` +
    `Stereo Width: ${window.analysisValues['stereo-meter']}%\n` +
    `Dynamic Range: ${window.analysisValues['dynamics-meter']}%\n\n` +
    `Recommendations:\n` +
    `- Adjust levels to match reference track loudness\n` +
    `- Balance frequency spectrum using EQ\n` +
    `- Check stereo width with correlation meter\n` +
    `- Monitor dynamic range with compressor`
  ], {type: 'text/plain'});
  
  element.href = URL.createObjectURL(file);
  element.download = `track-analysis-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Contract Generator
document.getElementById("contract-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Contract Generator</h2>
    <div class="contract-generator">
      <div class="contract-form">
        <div class="form-group">
          <label>License Type:</label>
          <select id="license-type">
            <option value="basic">Basic License</option>
            <option value="premium">Premium License</option>
            <option value="exclusive">Exclusive Rights</option>
            <option value="custom">Custom Agreement</option>
          </select>
        </div>
        <div class="form-group">
          <label>Producer Name:</label>
          <input type="text" id="producer-name" placeholder="Your name">
        </div>
        <div class="form-group">
          <label>Beat Title:</label>
          <input type="text" id="beat-title" placeholder="Name of the beat">
        </div>
        <div class="form-group">
          <label>Price:</label>
          <input type="number" id="price" placeholder="License price">
        </div>
        <div class="form-group">
          <label>Usage Rights:</label>
          <div class="checkbox-group">
            <label><input type="checkbox" id="right-streaming" checked> Streaming</label>
            <label><input type="checkbox" id="right-performance"> Live Performance</label>
            <label><input type="checkbox" id="right-music-video"> Music Video</label>
            <label><input type="checkbox" id="right-broadcast"> Broadcasting</label>
          </div>
        </div>
        <button onclick="generateContract()" class="generate-btn">Generate Contract</button>
      </div>
      <div id="contract-preview" class="contract-preview"></div>
    </div>
  `);
};

function generateContract() {
  const licenseType = document.getElementById("license-type").value;
  const producerName = document.getElementById("producer-name").value;
  const beatTitle = document.getElementById("beat-title").value;
  const price = document.getElementById("price").value;
  
  if (!producerName || !beatTitle || !price) {
    alert("Please fill in all required fields");
    return;
  }
  
  const rights = {
    streaming: document.getElementById("right-streaming").checked,
    performance: document.getElementById("right-performance").checked,
    musicVideo: document.getElementById("right-music-video").checked,
    broadcast: document.getElementById("right-broadcast").checked
  };
  
  const contractText = `
    BEAT LICENSE AGREEMENT
    
    Date: ${new Date().toLocaleDateString()}
    
    This agreement is made between:
    Producer: ${producerName} ("Licensor")
    And: [Artist Name] ("Licensee")
    
    For the musical composition: "${beatTitle}"
    License Type: ${licenseType.toUpperCase()}
    Price: $${price}
    
    GRANTED RIGHTS:
    ${rights.streaming ? '✓ Digital Streaming Rights' : ''}
    ${rights.performance ? '✓ Live Performance Rights' : ''}
    ${rights.musicVideo ? '✓ Music Video Rights' : ''}
    ${rights.broadcast ? '✓ Broadcasting Rights' : ''}
    
    Terms and Conditions:
    1. The Licensor grants the Licensee the right to use the Beat in accordance with the terms specified above.
    2. The Licensor maintains ownership of the underlying composition.
    3. Credit must be given as: "Prod. by ${producerName}"
    4. This license is non-transferable.
    
    [Additional terms based on license type...]
  `;
  
  const preview = document.getElementById("contract-preview");
  preview.innerHTML = `
    <div class="contract-text">${contractText.replace(/\n/g, '<br>')}</div>
    <button onclick="exportContract('${encodeURIComponent(contractText)}')" class="export-btn">Export Contract</button>
  `;
}

function exportContract(contractText) {
  const element = document.createElement('a');
  const file = new Blob([decodeURIComponent(contractText)], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = `beat-license-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Best Posting Time Analyzer
document.getElementById("posttime-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Best Posting Time Analyzer</h2>
    <div class="posttime-analyzer">
      <div class="platform-select">
        <button onclick="analyzePlatform('youtube')" class="platform-btn">YouTube</button>
        <button onclick="analyzePlatform('tiktok')" class="platform-btn">TikTok</button>
        <button onclick="analyzePlatform('instagram')" class="platform-btn">Instagram</button>
      </div>
      <div class="timezone-select">
        <label>Your Timezone:</label>
        <select id="timezone" onchange="updateTimes()">
          <option value="-8">Pacific Time (PT)</option>
          <option value="-5">Eastern Time (ET)</option>
          <option value="0">GMT</option>
          <option value="1">Central European Time (CET)</option>
          <option value="5.5">Indian Standard Time (IST)</option>
        </select>
      </div>
      <div id="timing-results" class="timing-results">
        <p>Select a platform to see optimal posting times</p>
      </div>
    </div>
  `);
};

function analyzePlatform(platform) {
  const timezone = parseInt(document.getElementById("timezone").value);
  const results = document.getElementById("timing-results");
  
  const platformData = {
    youtube: {
      weekday: [
        {time: "15:00", engagement: "High"},
        {time: "19:00", engagement: "Peak"},
        {time: "22:00", engagement: "High"}
      ],
      weekend: [
        {time: "10:00", engagement: "High"},
        {time: "16:00", engagement: "Peak"},
        {time: "20:00", engagement: "High"}
      ]
    },
    tiktok: {
      weekday: [
        {time: "6:00", engagement: "High"},
        {time: "10:00", engagement: "Peak"},
        {time: "22:00", engagement: "High"}
      ],
      weekend: [
        {time: "11:00", engagement: "High"},
        {time: "17:00", engagement: "Peak"},
        {time: "23:00", engagement: "High"}
      ]
    },
    instagram: {
      weekday: [
        {time: "11:00", engagement: "High"},
        {time: "14:00", engagement: "Peak"},
        {time: "21:00", engagement: "High"}
      ],
      weekend: [
        {time: "9:00", engagement: "High"},
        {time: "15:00", engagement: "Peak"},
        {time: "20:00", engagement: "High"}
      ]
    }
  };
  
  results.innerHTML = `
    <h3>${platform.toUpperCase()} Best Posting Times</h3>
    <div class="timing-grid">
      <div class="timing-column">
        <h4>Weekdays</h4>
        ${platformData[platform].weekday.map(slot => `
          <div class="time-slot ${slot.engagement.toLowerCase()}">
            <span class="time">${adjustTime(slot.time, timezone)}</span>
            <span class="engagement">${slot.engagement}</span>
          </div>
        `).join('')}
      </div>
      <div class="timing-column">
        <h4>Weekends</h4>
        ${platformData[platform].weekend.map(slot => `
          <div class="time-slot ${slot.engagement.toLowerCase()}">
            <span class="time">${adjustTime(slot.time, timezone)}</span>
            <span class="engagement">${slot.engagement}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <button onclick="exportTimings('${platform}')" class="export-btn">Export Schedule</button>
  `;
}

function adjustTime(time, timezone) {
  const [hours, minutes] = time.split(':').map(Number);
  let adjustedHours = hours + timezone;
  
  // Handle day wraparound
  if (adjustedHours >= 24) adjustedHours -= 24;
  if (adjustedHours < 0) adjustedHours += 24;
  
  // Convert to 12-hour format
  let period = adjustedHours >= 12 ? 'PM' : 'AM';
  let hours12 = adjustedHours % 12;
  if (hours12 === 0) hours12 = 12; // Convert 0 to 12 for 12 AM
  
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function exportTimings(platform) {
  const timezone = document.getElementById("timezone").options[
    document.getElementById("timezone").selectedIndex
  ].text;
  
  const content = document.getElementById("timing-results").innerText;
  
  const element = document.createElement('a');
  const file = new Blob([
    `Optimal Posting Times for ${platform.toUpperCase()}\n` +
    `Generated by BeatVibe\n` +
    `Timezone: ${timezone}\n\n` +
    content
  ], {type: 'text/plain'});
  
  element.href = URL.createObjectURL(file);
  element.download = `posting-schedule-${platform}-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Trending Sound Analyzer
document.getElementById("trending-sound-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Trending Sound Analyzer</h2>
    <div class="sound-analyzer">
      <div class="search-section">
        <input type="text" id="sound-search" placeholder="Search sound or paste TikTok URL">
        <button onclick="analyzeTrendingSound()" class="analyze-btn">Analyze</button>
      </div>
      <div class="filter-section">
        <select id="trend-duration">
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="all">All Time</option>
        </select>
        <select id="trend-category">
          <option value="all">All Categories</option>
          <option value="music">Music</option>
          <option value="remix">Remixes</option>
          <option value="viral">Viral Sounds</option>
        </select>
      </div>
      <div id="trend-results" class="trend-results">
        <p>Enter a sound to analyze its trend potential</p>
      </div>
    </div>
  `);
};

function analyzeTrendingSound() {
  const sound = document.getElementById("sound-search").value;
  const duration = document.getElementById("trend-duration").value;
  const category = document.getElementById("trend-category").value;
  
  if (!sound) {
    alert("Please enter a sound to analyze");
    return;
  }
  
  const results = document.getElementById("trend-results");
  results.innerHTML = '<div class="loading">Analyzing trend data...</div>';
  
  // Simulate analysis with random data
  setTimeout(() => {
    const trendScore = Math.floor(Math.random() * 40) + 60;
    const viralPotential = Math.floor(Math.random() * 100);
    const recentVideos = Math.floor(Math.random() * 50000) + 10000;
    const avgViews = Math.floor(Math.random() * 100000) + 50000;
    
    results.innerHTML = `
      <div class="trend-metrics">
        <div class="metric">
          <h3>Trend Score</h3>
          <div class="score-circle ${trendScore > 80 ? 'high' : 'medium'}">
            ${trendScore}%
          </div>
        </div>
        <div class="metric">
          <h3>Viral Potential</h3>
          <div class="progress-bar">
            <div class="progress" style="width: ${viralPotential}%"></div>
          </div>
          <span>${viralPotential}%</span>
        </div>
      </div>
      
      <div class="trend-stats">
        <div class="stat">
          <label>Recent Videos</label>
          <span>${recentVideos.toLocaleString()}</span>
        </div>
        <div class="stat">
          <label>Average Views</label>
          <span>${avgViews.toLocaleString()}</span>
        </div>
      </div>
      
      <div class="trend-recommendations">
        <h3>Recommendations</h3>
        <ul>
          <li>Best time to use: ${trendScore > 80 ? 'Now!' : 'Within next week'}</li>
          <li>Recommended content: ${category === 'music' ? 'Dance/Performance' : 'Creative/Remix'}</li>
          <li>Target audience: ${Math.random() > 0.5 ? 'Gen Z' : 'Millennials'}</li>
        </ul>
      </div>
      
      <button onclick="exportTrendAnalysis()" class="export-btn">Export Analysis</button>
    `;
  }, 1500);
}

function exportTrendAnalysis() {
  const content = document.getElementById("trend-results").innerText;
  
  const element = document.createElement('a');
  const file = new Blob([
    `Trending Sound Analysis\n` +
    `Generated by BeatVibe\n` +
    `Date: ${new Date().toLocaleString()}\n\n` +
    content
  ], {type: 'text/plain'});
  
  element.href = URL.createObjectURL(file);
  element.download = `trend-analysis-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Cross Platform Post Formatter
document.getElementById("cross-post-card").querySelector(".feature-button").onclick = () => {
  openModal(`
    <h2>Cross Platform Formatter</h2>
    <div class="post-formatter">
      <div class="input-section">
        <textarea id="original-post" placeholder="Enter your post content here..." rows="4"></textarea>
        <div class="post-options">
          <label>Include:</label>
          <label><input type="checkbox" id="include-hashtags" checked> Hashtags</label>
          <label><input type="checkbox" id="include-emojis" checked> Emojis</label>
          <label><input type="checkbox" id="include-links" checked> Links</label>
        </div>
      </div>
      
      <div class="platform-formats">
        <div class="format-column">
          <h3>TikTok</h3>
          <div id="tiktok-preview" class="preview"></div>
          <button onclick="copyFormat('tiktok')" class="copy-btn">Copy</button>
        </div>
        
        <div class="format-column">
          <h3>Instagram</h3>
          <div id="instagram-preview" class="preview"></div>
          <button onclick="copyFormat('instagram')" class="copy-btn">Copy</button>
        </div>
        
        <div class="format-column">
          <h3>YouTube</h3>
          <div id="youtube-preview" class="preview"></div>
          <button onclick="copyFormat('youtube')" class="copy-btn">Copy</button>
        </div>
      </div>
      
      <button onclick="formatAllPlatforms()" class="format-btn">Format for All Platforms</button>
    </div>
  `);
  
  // Add event listener for real-time formatting
  document.getElementById("original-post").addEventListener("input", formatAllPlatforms);
};

function formatAllPlatforms() {
  const originalPost = document.getElementById("original-post").value;
  const includeHashtags = document.getElementById("include-hashtags").checked;
  const includeEmojis = document.getElementById("include-emojis").checked;
  const includeLinks = document.getElementById("include-links").checked;
  
  if (!originalPost) {
    return;
  }
  
  // Format for each platform
  const formats = {
    tiktok: formatForTikTok(originalPost, includeHashtags, includeEmojis),
    instagram: formatForInstagram(originalPost, includeHashtags, includeEmojis, includeLinks),
    youtube: formatForYouTube(originalPost, includeHashtags, includeEmojis, includeLinks)
  };
  
  // Update previews
  Object.keys(formats).forEach(platform => {
    document.getElementById(`${platform}-preview`).innerHTML = formats[platform].replace(/\n/g, '<br>');
  });
}

function formatForTikTok(text, hashtags, emojis) {
  let formatted = text;
  
  // TikTok specific formatting
  formatted = formatted.slice(0, 150); // TikTok character limit
  
  if (hashtags) {
    formatted += "\n\n#fyp #producer #beatmaker #music";
  }
  
  if (emojis) {
    formatted = formatted.replace(/beat/gi, "beat 🎵");
    formatted = formatted.replace(/fire/gi, "fire 🔥");
  }
  
  return formatted;
}

function formatForInstagram(text, hashtags, emojis, links) {
  let formatted = text;
  
  // Instagram specific formatting
  formatted = formatted.slice(0, 2200); // Instagram character limit
  
  if (hashtags) {
    formatted += "\n\n.\n.\n.\n#producer #beatmaker #musicproducer #beats #trap #hiphop #music";
  }
  
  if (emojis) {
    formatted = formatted.replace(/beat/gi, "beat 🎵");
    formatted = formatted.replace(/fire/gi, "fire 🔥");
  }
  
  if (links) {
    formatted += "\n\nLink in bio 🔗";
  }
  
  return formatted;
}

function formatForYouTube(text, hashtags, emojis, links) {
  let formatted = text;
  
  // YouTube specific formatting
  if (emojis) {
    formatted = formatted.replace(/beat/gi, "beat 🎵");
    formatted = formatted.replace(/fire/gi, "fire 🔥");
  }
  
  if (links) {
    formatted += "\n\n📱 Follow me:\nInstagram: [Your IG]\nTikTok: [Your TikTok]";
  }
  
  if (hashtags) {
    formatted += "\n\n#producer #beats #musicproduction #trapbeats";
  }
  
  return formatted;
}

function copyFormat(platform) {
  const content = document.getElementById(`${platform}-preview`).innerText;
  navigator.clipboard.writeText(content).then(() => {
    alert(`Copied ${platform} format to clipboard!`);
  });
}

// Melody Generator Export Function
function exportMelody() {
    const melodyPattern = generateMelody(); // Assuming this function generates the melody pattern
    const midiData = convertMelodyToMIDI(melodyPattern); // Convert to MIDI format
    downloadMIDI(midiData, 'melody_pattern.mid'); // Function to download MIDI file
}

// Function to convert melody to MIDI format
function convertMelodyToMIDI(melody) {
    // Logic to convert melody data to MIDI format
}

// Plugin Manager Feature
function openPluginManager() {
    const modalContent = `
        <div class="plugin-manager">
            <h2>Plugin Manager</h2>
            <div class="add-plugin-form" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <input type="text" id="plugin-name" class="neon-input" placeholder="Plugin Name" style="margin-right: 10px;">
                <select id="plugin-type" class="neon-input" style="margin-right: 10px;">
                    <option value="Instrument">Instrument</option>
                    <option value="Effect">Effect</option>
                    <option value="Utility">Utility</option>
                    <option value="MIDI">MIDI</option>
                </select>
                <input type="text" id="plugin-version" class="neon-input" placeholder="Version" style="margin-right: 10px;">
                <button onclick="addPlugin()" class="feature-button">Add Plugin</button>
            </div>
            <div class="plugin-filters" style="margin: 20px 0;">
                <input type="text" id="plugin-search" class="neon-input" placeholder="Search plugins..." 
                       onkeyup="filterPlugins()" style="width: 200px;">
                <select onchange="filterByType(this.value)" class="neon-input" style="margin-left: 10px;">
                    <option value="All">All Types</option>
                    <option value="Instrument">Instruments</option>
                    <option value="Effect">Effects</option>
                    <option value="Utility">Utilities</option>
                    <option value="MIDI">MIDI</option>
                </select>
            </div>
            <div id="plugins-list" style="margin-top: 20px;"></div>
            <button onclick="exportPluginList()" class="feature-button" style="margin-top: 20px;">Export List</button>
        </div>
    `;
    openModal(modalContent);
    renderPlugins();
}

function addPlugin() {
    const name = document.getElementById('plugin-name').value;
    const type = document.getElementById('plugin-type').value;
    const version = document.getElementById('plugin-version').value;

    if (!name) return;

    plugins.push({
        id: Date.now(),
        name,
        type,
        version,
        dateAdded: new Date().toLocaleDateString()
    });

    localStorage.setItem('plugins', JSON.stringify(plugins));
    renderPlugins();
    
    // Clear inputs
    document.getElementById('plugin-name').value = '';
    document.getElementById('plugin-version').value = '';
}

function renderPlugins(filteredPlugins = null) {
    const pluginsList = document.getElementById('plugins-list');
    const displayPlugins = filteredPlugins || plugins;

    pluginsList.innerHTML = displayPlugins.map(plugin => `
        <div class="plugin-item" style="
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <div>
                <h3 style="color: #00ffff; margin: 0;">${plugin.name}</h3>
                <p style="margin: 5px 0; color: #b8b8b8;">
                    Type: ${plugin.type}<br>
                    Version: ${plugin.version}<br>
                    Added: ${plugin.dateAdded}
                </p>
            </div>
            <button onclick="deletePlugin(${plugin.id})" class="feature-button">Delete</button>
        </div>
    `).join('');
}

function deletePlugin(id) {
    plugins = plugins.filter(plugin => plugin.id !== id);
    localStorage.setItem('plugins', JSON.stringify(plugins));
    renderPlugins();
}

function filterPlugins() {
    const searchTerm = document.getElementById('plugin-search').value.toLowerCase();
    const filteredPlugins = plugins.filter(plugin => 
        plugin.name.toLowerCase().includes(searchTerm) ||
        plugin.type.toLowerCase().includes(searchTerm)
    );
    renderPlugins(filteredPlugins);
}

function filterByType(type) {
    if (type === 'All') {
        renderPlugins();
        return;
    }
    const filteredPlugins = plugins.filter(plugin => plugin.type === type);
    renderPlugins(filteredPlugins);
}

function exportPluginList() {
    const exportText = plugins.map(plugin => 
        `Plugin: ${plugin.name}\nType: ${plugin.type}\nVersion: ${plugin.version}\nAdded: ${plugin.dateAdded}\n\n`
    ).join('---\n');
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plugin-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Studio Setup Planner Feature
function openStudioPlanner() {
    const modalContent = `
        <div class="studio-planner">
            <h2>Studio Setup Planner</h2>
            
            <div class="budget-section" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <h3 style="color: #00ffff;">Budget Planning</h3>
                <input type="number" id="budget-input" class="neon-input" 
                       placeholder="Enter your budget" value="${studioSetup.budget}"
                       onchange="updateBudget(this.value)" style="width: 200px;">
                <div id="budget-breakdown" style="margin-top: 15px;"></div>
            </div>

            <div class="room-section" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <h3 style="color: #00ffff;">Room Layout</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="number" id="room-width" class="neon-input" 
                           placeholder="Width (ft)" value="${studioSetup.roomDimensions.width}"
                           onchange="updateRoomDimensions('width', this.value)">
                    <input type="number" id="room-length" class="neon-input" 
                           placeholder="Length (ft)" value="${studioSetup.roomDimensions.length}"
                           onchange="updateRoomDimensions('length', this.value)">
                </div>
                <div id="room-recommendations"></div>
            </div>

            <div class="equipment-section" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <h3 style="color: #00ffff;">Equipment Checklist</h3>
                <div class="equipment-form" style="margin-bottom: 15px;">
                    <input type="text" id="equipment-name" class="neon-input" 
                           placeholder="Equipment name" style="margin-right: 10px;">
                    <input type="number" id="equipment-cost" class="neon-input" 
                           placeholder="Estimated cost" style="margin-right: 10px;">
                    <button onclick="addEquipment()" class="feature-button">Add</button>
                </div>
                <div id="equipment-list"></div>
            </div>

            <button onclick="exportStudioPlan()" class="feature-button" style="margin-top: 20px;">Export Plan</button>
        </div>
    `;
    openModal(modalContent);
    renderStudioPlan();
}

function updateBudget(value) {
    studioSetup.budget = parseFloat(value) || 0;
    localStorage.setItem('studioSetup', JSON.stringify(studioSetup));
    renderStudioPlan();
}

function updateRoomDimensions(dimension, value) {
    studioSetup.roomDimensions[dimension] = parseFloat(value) || 0;
    localStorage.setItem('studioSetup', JSON.stringify(studioSetup));
    renderStudioPlan();
}

function addEquipment() {
    const name = document.getElementById('equipment-name').value;
    const cost = parseFloat(document.getElementById('equipment-cost').value) || 0;

    if (!name) return;

    studioSetup.equipment.push({
        id: Date.now(),
        name,
        cost,
        purchased: false
    });

    localStorage.setItem('studioSetup', JSON.stringify(studioSetup));
    renderStudioPlan();
    
    // Clear inputs
    document.getElementById('equipment-name').value = '';
    document.getElementById('equipment-cost').value = '';
}

function toggleEquipment(id) {
    const equipment = studioSetup.equipment.find(e => e.id === id);
    if (equipment) {
        equipment.purchased = !equipment.purchased;
        localStorage.setItem('studioSetup', JSON.stringify(studioSetup));
        renderStudioPlan();
    }
}

function deleteEquipment(id) {
    studioSetup.equipment = studioSetup.equipment.filter(e => e.id !== id);
    localStorage.setItem('studioSetup', JSON.stringify(studioSetup));
    renderStudioPlan();
}

function renderStudioPlan() {
    // Render budget breakdown
    const budgetBreakdown = document.getElementById('budget-breakdown');
    const totalCost = studioSetup.equipment.reduce((sum, e) => sum + e.cost, 0);
    const remaining = studioSetup.budget - totalCost;
    
    budgetBreakdown.innerHTML = `
        <p>Total Budget: $${studioSetup.budget.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
        <p style="color: ${remaining >= 0 ? '#00ff00' : '#ff0000'}">
            Remaining: $${remaining.toFixed(2)}
        </p>
    `;

    // Render room recommendations
    const roomRecommendations = document.getElementById('room-recommendations');
    const {width, length} = studioSetup.roomDimensions;
    const area = width * length;
    
    roomRecommendations.innerHTML = `
        <p>Room Area: ${area.toFixed(2)} sq ft</p>
        <ul style="list-style: none; padding: 0;">
            ${area < 120 ? '<li>⚠️ Room might be too small for optimal acoustics</li>' : ''}
            ${width/length > 1.6 || length/width > 1.6 ? '<li>⚠️ Room proportions might cause acoustic issues</li>' : ''}
            <li>💡 Recommended speaker placement: ${Math.min(width, length)/3}ft from walls</li>
        </ul>
    `;

    // Render equipment list
    const equipmentList = document.getElementById('equipment-list');
    equipmentList.innerHTML = studioSetup.equipment.map(equipment => `
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
        ">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" ${equipment.purchased ? 'checked' : ''}
                       onchange="toggleEquipment(${equipment.id})"
                       style="margin-right: 10px;">
                <span style="${equipment.purchased ? 'text-decoration: line-through;' : ''}">${equipment.name}</span>
            </div>
            <div>
                <span style="margin-right: 15px;">$${equipment.cost.toFixed(2)}</span>
                <button onclick="deleteEquipment(${equipment.id})" class="feature-button">Delete</button>
            </div>
        </div>
    `).join('');
}

function exportStudioPlan() {
    const {width, length} = studioSetup.roomDimensions;
    const area = width * length;
    const totalCost = studioSetup.equipment.reduce((sum, e) => sum + e.cost, 0);
    const remaining = studioSetup.budget - totalCost;

    const exportText = `STUDIO SETUP PLAN\n\n` +
        `Budget Summary:\n` +
        `- Total Budget: $${studioSetup.budget.toFixed(2)}\n` +
        `- Total Cost: $${totalCost.toFixed(2)}\n` +
        `- Remaining: $${remaining.toFixed(2)}\n\n` +
        `Room Dimensions:\n` +
        `- Width: ${width}ft\n` +
        `- Length: ${length}ft\n` +
        `- Area: ${area.toFixed(2)} sq ft\n\n` +
        `Equipment List:\n` +
        studioSetup.equipment.map(e => 
            `- ${e.name} ($${e.cost.toFixed(2)}) ${e.purchased ? '[PURCHASED]' : ''}`
        ).join('\n');

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studio-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function openSampleOrganizer() {
    const modalContent = `
        <div class="sample-organizer">
            <h2>Sample Organizer</h2>
            <div class="controls">
                <input type="text" id="sample-name" class="neon-input" placeholder="Sample Name">
                <input type="text" id="sample-tags" class="neon-input" placeholder="Tags (comma-separated)">
                <select id="sample-category" class="neon-input">
                    <option value="Drums">Drums</option>
                    <option value="Melody">Melody</option>
                    <option value="Bass">Bass</option>
                    <option value="FX">FX</option>
                    <option value="Vocals">Vocals</option>
                    <option value="Other">Other</option>
                </select>
                <button onclick="addSample()" class="feature-button">Add Sample</button>
                <button onclick="exportSampleList()" class="feature-button">Export List</button>
            </div>
            <div id="samples-list" style="margin-top: 20px;"></div>
        </div>
    `;
    openModal(modalContent);
    renderSamples();
}

function openPluginManager() {
    const modalContent = `
        <div class="plugin-manager">
            <h2>Plugin Manager</h2>
            <div class="add-plugin-form" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <input type="text" id="plugin-name" class="neon-input" placeholder="Plugin Name" style="margin-right: 10px;">
                <select id="plugin-type" class="neon-input" style="margin-right: 10px;">
                    <option value="Instrument">Instrument</option>
                    <option value="Effect">Effect</option>
                    <option value="Utility">Utility</option>
                    <option value="MIDI">MIDI</option>
                </select>
                <input type="text" id="plugin-version" class="neon-input" placeholder="Version" style="margin-right: 10px;">
                <button onclick="addPlugin()" class="feature-button">Add Plugin</button>
            </div>
            <div class="plugin-filters" style="margin: 20px 0;">
                <input type="text" id="plugin-search" class="neon-input" placeholder="Search plugins..." 
                       onkeyup="filterPlugins()" style="width: 200px;">
                <select onchange="filterByType(this.value)" class="neon-input" style="margin-left: 10px;">
                    <option value="All">All Types</option>
                    <option value="Instrument">Instruments</option>
                    <option value="Effect">Effects</option>
                    <option value="Utility">Utilities</option>
                    <option value="MIDI">MIDI</option>
                </select>
            </div>
            <div id="plugins-list" style="margin-top: 20px;"></div>
            <button onclick="exportPluginList()" class="feature-button" style="margin-top: 20px;">Export List</button>
        </div>
    `;
    openModal(modalContent);
    renderPlugins();
}

function openStudioPlanner() {
    const modalContent = `
        <div class="studio-planner">
            <h2>Studio Setup Planner</h2>
            
            <div class="budget-section" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <h3 style="color: #00ffff;">Budget Planning</h3>
                <input type="number" id="budget-input" class="neon-input" 
                       placeholder="Enter your budget" value="${studioSetup.budget}"
                       onchange="updateBudget(this.value)" style="width: 200px;">
                <div id="budget-breakdown" style="margin-top: 15px;"></div>
            </div>

            <div class="room-section" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <h3 style="color: #00ffff;">Room Layout</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="number" id="room-width" class="neon-input" 
                           placeholder="Width (ft)" value="${studioSetup.roomDimensions.width}"
                           onchange="updateRoomDimensions('width', this.value)">
                    <input type="number" id="room-length" class="neon-input" 
                           placeholder="Length (ft)" value="${studioSetup.roomDimensions.length}"
                           onchange="updateRoomDimensions('length', this.value)">
                </div>
                <div id="room-recommendations"></div>
            </div>

            <div class="equipment-section" style="margin: 20px 0; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;">
                <h3 style="color: #00ffff;">Equipment Checklist</h3>
                <div class="equipment-form" style="margin-bottom: 15px;">
                    <input type="text" id="equipment-name" class="neon-input" 
                           placeholder="Equipment name" style="margin-right: 10px;">
                    <input type="number" id="equipment-cost" class="neon-input" 
                           placeholder="Estimated cost" style="margin-right: 10px;">
                    <button onclick="addEquipment()" class="feature-button">Add</button>
                </div>
                <div id="equipment-list"></div>
            </div>

            <button onclick="exportStudioPlan()" class="feature-button" style="margin-top: 20px;">Export Plan</button>
        </div>
    `;
    openModal(modalContent);
    renderStudioPlan();
}

function openAlbumArtGenerator() {
    const modalContent = `
        <div class="album-art-generator">
            <h2>Album Art Generator</h2>
            <div class="controls" style="margin: 20px 0;">
                <input type="text" id="art-prompt" class="neon-input" placeholder="Describe your album art idea">
                <select id="art-style" class="neon-input">
                    <option value="modern">Modern</option>
                    <option value="retro">Retro</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="abstract">Abstract</option>
                    <option value="photo">Photographic</option>
                </select>
                <input type="text" id="art-text" class="neon-input" placeholder="Text to include (optional)">
                <button onclick="generateAlbumArt()" class="feature-button">Generate Art</button>
            </div>
            <div id="art-preview" style="margin: 20px 0; min-height: 300px;"></div>
            <button onclick="exportAlbumArt()" class="feature-button">Export Art</button>
        </div>
    `;
    openModal(modalContent);
}

function openBeatVisualizer() {
    const modalContent = `
        <h2>Beat Video Visualizer</h2>
        <div class="visualizer-container">
            <div class="upload-section">
                <input type="file" id="audio-file" accept="audio/*">
                <button onclick="startVisualization()">Start Visualization</button>
            </div>
            <div class="visualization-section">
                <canvas id="visualizer-canvas"></canvas>
            </div>
            <div class="controls-section">
                <select id="visualization-style">
                    <option value="waveform">Waveform</option>
                    <option value="frequency">Frequency Bars</option>
                    <option value="circular">Circular</option>
                    <option value="particles">Particles</option>
                </select>
                <button onclick="stopVisualization()">Stop</button>
            </div>
        </div>
    `;
    openModal(modalContent);
}

function openLogoGenerator() {
    const modalContent = `
        <div class="logo-generator">
            <h2>Logo Generator</h2>
            <div class="controls" style="margin: 20px 0;">
                <input type="text" id="producer-name" class="neon-input" placeholder="Your producer name">
                <select id="logo-style" class="neon-input">
                    <option value="neon">Neon</option>
                    <option value="minimal">Minimal</option>
                    <option value="graffiti">Graffiti</option>
                    <option value="tech">Tech</option>
                    <option value="vintage">Vintage</option>
                </select>
                <input type="text" id="logo-color" class="neon-input" placeholder="Primary color">
                <button onclick="generateLogo()" class="feature-button">Generate Logo</button>
            </div>
            <div id="logo-preview" style="margin: 20px 0; min-height: 200px;"></div>
            <button onclick="exportLogo()" class="feature-button">Export Logo</button>
        </div>
    `;
    openModal(modalContent);
}

function openVoiceEffects() {
    const modalContent = `
        <div class="voice-effects">
            <h2>Beat Tag Voice Effects</h2>
            <div class="controls" style="margin: 20px 0;">
                <input type="file" id="voice-file" accept="audio/*" class="neon-input">
                <div class="effects-list" style="margin: 20px 0;">
                    <label><input type="checkbox" id="effect-reverb"> Reverb</label>
                    <label><input type="checkbox" id="effect-delay"> Delay</label>
                    <label><input type="checkbox" id="effect-pitch"> Pitch Shift</label>
                    <label><input type="checkbox" id="effect-distortion"> Distortion</label>
                </div>
                <div class="effect-controls" id="effect-controls"></div>
                <button onclick="previewEffect()" class="feature-button">Preview</button>
                <button onclick="applyEffects()" class="feature-button">Apply Effects</button>
            </div>
            <div id="waveform-preview" style="margin: 20px 0; min-height: 100px;"></div>
            <button onclick="exportVoiceTag()" class="feature-button">Export Tag</button>
        </div>
    `;
    openModal(modalContent);
}

function openStyleAnalyzer() {
    const modalContent = `
        <div class="style-analyzer">
            <h2>Artist Style Analyzer</h2>
            <div class="controls" style="margin: 20px 0;">
                <input type="text" id="artist-name" class="neon-input" placeholder="Enter artist name">
                <input type="file" id="reference-track" accept="audio/*" class="neon-input" multiple>
                <button onclick="analyzeStyle()" class="feature-button">Analyze Style</button>
            </div>
            <div class="analysis-results" style="margin: 20px 0;">
                <div id="key-elements"></div>
                <div id="sound-signature"></div>
                <div id="genre-influence"></div>
                <div id="production-techniques"></div>
            </div>
            <button onclick="exportAnalysis()" class="feature-button">Export Analysis</button>
        </div>
    `;
    openModal(modalContent);
}

// Helper functions for the new features
async function generateAlbumArt() {
    const prompt = document.getElementById('art-prompt').value;
    const style = document.getElementById('art-style').value;
    const text = document.getElementById('art-text').value;
    const preview = document.getElementById('art-preview');
    
    if (!prompt) {
        alert('Please enter a description for your album art');
        return;
    }
    
    preview.innerHTML = '<div class="loading-spinner"></div>';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        try {
            // Create a canvas for the simulated AI art
            const imageSize = 400;
            const canvas = document.createElement('canvas');
            canvas.width = imageSize;
            canvas.height = imageSize;
            const ctx = canvas.getContext('2d');
            
            // Create gradient background based on style
            const gradients = {
                modern: ['#00ffff', '#ff00ff'],
                retro: ['#ff8800', '#ff0066'],
                minimalist: ['#ffffff', '#eeeeee'],
                abstract: ['#00ff99', '#6600ff'],
                photo: ['#333333', '#666666']
            };
            
            const gradient = ctx.createLinearGradient(0, 0, imageSize, imageSize);
            gradient.addColorStop(0, gradients[style][0]);
            gradient.addColorStop(1, gradients[style][1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, imageSize, imageSize);
            
            // Add style-specific effects
            switch(style) {
                case 'modern':
                    // Add geometric shapes
                    for(let i = 0; i < 5; i++) {
                        ctx.beginPath();
                        ctx.moveTo(Math.random() * imageSize, Math.random() * imageSize);
                        ctx.lineTo(Math.random() * imageSize, Math.random() * imageSize);
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 5;
                        ctx.stroke();
                    }
                    break;
                    
                case 'retro':
                    // Add retro sun and grid
                    ctx.beginPath();
                    ctx.arc(imageSize/2, imageSize/2, 100, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffff00';
                    ctx.fill();
                    for(let i = 0; i < imageSize; i += 40) {
                        ctx.beginPath();
                        ctx.moveTo(0, i);
                        ctx.lineTo(imageSize, i);
                        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                    break;
                    
                case 'minimalist':
                    // Simple shape
                    ctx.beginPath();
                    ctx.arc(imageSize/2, imageSize/2, 100, 0, Math.PI * 2);
                    ctx.fillStyle = '#000000';
                    ctx.fill();
                    break;
                    
                case 'abstract':
                    // Random shapes
                    for(let i = 0; i < 10; i++) {
                        ctx.beginPath();
                        ctx.arc(
                            Math.random() * imageSize,
                            Math.random() * imageSize,
                            Math.random() * 50 + 20,
                            0,
                            Math.PI * 2
                        );
                        ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, 0.5)`;
                        ctx.fill();
                    }
                    break;
                    
                case 'photo':
                    // Simulated photo effect
                    ctx.fillStyle = 'rgba(0,0,0,0.5)';
                    ctx.fillRect(40, 40, imageSize-80, imageSize-80);
                    break;
            }
            
            // Add text if provided
            if (text) {
                ctx.font = '30px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, imageSize/2, imageSize/2);
            }
            
            // Store the generated image URL for export
            window.generatedAlbumArt = canvas.toDataURL('image/png');
            
            // Display the generated image
            preview.innerHTML = `
                <img src="${window.generatedAlbumArt}" alt="Generated album art" style="max-width: 100%; border-radius: 10px;">
                <div class="generation-info" style="margin-top: 15px;">
                    <p><strong>Style:</strong> ${style}</p>
                    <p><strong>Prompt:</strong> ${prompt}</p>
                    ${text ? `<p><strong>Text:</strong> ${text}</p>` : ''}
                </div>
                <p style="color: #ff00ff; margin-top: 15px;">AI Generation Preview</p>
            `;
        } catch (error) {
            preview.innerHTML = `<div class="error-message">Error generating album art: ${error.message}</div>`;
        }
    }, 1500); // 1.5 second delay to simulate API call
}

async function generateLogo() {
    const name = document.getElementById('producer-name').value;
    const style = document.getElementById('logo-style').value;
    const color = document.getElementById('logo-color').value || '#00ffff';
    const preview = document.getElementById('logo-preview');
    
    if (!name) {
        alert('Please enter your producer name');
        return;
    }
    
    preview.innerHTML = '<div class="loading-spinner"></div>';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        try {
            const imageSize = 300;
            const canvas = document.createElement('canvas');
            canvas.width = imageSize;
            canvas.height = imageSize;
            const ctx = canvas.getContext('2d');
            
            // Create background
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, imageSize, imageSize);
            
            // Add style-based effects
            switch(style) {
                case 'neon':
                    // Neon glow effect
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = color;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(30, 30, imageSize-60, imageSize-60);
                    
                    // Add some neon accents
                    ctx.beginPath();
                    ctx.moveTo(50, 50);
                    ctx.lineTo(imageSize-50, imageSize-50);
                    ctx.stroke();
                    break;
                    
                case 'minimal':
                    // Simple geometric logo
                    ctx.fillStyle = color;
                    ctx.fillRect(50, 50, imageSize-100, imageSize-100);
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(70, 70, imageSize-140, imageSize-140);
                    break;
                    
                case 'graffiti':
                    // Graffiti style with multiple layers
                    for(let i = 0; i < 3; i++) {
                        ctx.fillStyle = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${0.3 + i * 0.2})`;
                        ctx.fillRect(40 + i*20, 40 + i*20, imageSize-80-i*40, imageSize-80-i*40);
                    }
                    break;
                    
                case 'tech':
                    // Tech style with circuit-like patterns
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    for(let i = 0; i < 5; i++) {
                        ctx.strokeRect(20 + i*20, 20 + i*20, imageSize-40-i*40, imageSize-40-i*40);
                        ctx.beginPath();
                        ctx.moveTo(20 + i*20, imageSize/2);
                        ctx.lineTo(imageSize-20-i*20, imageSize/2);
                        ctx.stroke();
                    }
                    break;
                    
                case 'vintage':
                    // Vintage style with circular design
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.arc(imageSize/2, imageSize/2, 100, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(imageSize/2, imageSize/2, 80, 0, Math.PI * 2);
                    ctx.stroke();
                    // Add some vintage decorations
                    for(let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        ctx.beginPath();
                        ctx.moveTo(
                            imageSize/2 + Math.cos(angle) * 90,
                            imageSize/2 + Math.sin(angle) * 90
                        );
                        ctx.lineTo(
                            imageSize/2 + Math.cos(angle) * 110,
                            imageSize/2 + Math.sin(angle) * 110
                        );
                        ctx.stroke();
                    }
                    break;
            }
            
            // Add producer name with style-specific font
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            switch(style) {
                case 'neon':
                    ctx.font = 'bold 30px Arial';
                    ctx.fillStyle = color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = color;
                    break;
                case 'minimal':
                    ctx.font = '30px Arial';
                    ctx.fillStyle = color;
                    break;
                case 'graffiti':
                    ctx.font = 'bold italic 30px Arial';
                    ctx.fillStyle = '#ffffff';
                    break;
                case 'tech':
                    ctx.font = 'bold 30px monospace';
                    ctx.fillStyle = color;
                    break;
                case 'vintage':
                    ctx.font = 'bold 30px serif';
                    ctx.fillStyle = color;
                    break;
            }
            ctx.fillText(name, imageSize/2, imageSize/2);
            
            // Store the generated logo URL for export
            window.generatedLogo = canvas.toDataURL('image/png');
            
            // Display the generated logo
            preview.innerHTML = `
                <img src="${window.generatedLogo}" alt="Generated logo" style="max-width: 100%; border-radius: 10px;">
                <div class="generation-info" style="margin-top: 15px;">
                    <p><strong>Style:</strong> ${style}</p>
                    <p><strong>Color:</strong> ${color}</p>
                </div>
                <p style="color: #ff00ff; margin-top: 15px;">AI Generation Preview</p>
            `;
        } catch (error) {
            preview.innerHTML = `<div class="error-message">Error generating logo: ${error.message}</div>`;
        }
    }, 1500); // 1.5 second delay to simulate API call
}

async function analyzeStyle() {
    const artistName = document.getElementById('artist-name').value;
    const audioFiles = document.getElementById('reference-track').files;
    const results = document.querySelector('.analysis-results');
    
    if (!artistName || audioFiles.length === 0) {
        alert('Please enter artist name and upload at least one reference track');
        return;
    }
    
    results.innerHTML = '<div class="loading-spinner"></div>';
    
    // Simulate API call with setTimeout
    setTimeout(async () => {
        try {
            // Extract basic audio features
            const audioFeatures = await extractAudioFeatures(audioFiles);
            
            // Simulate AI analysis with predefined elements
            const analysis = {
                keyElements: [
                    'Distinctive use of ' + (Math.random() > 0.5 ? 'melody' : 'rhythm'),
                    'Complex ' + (Math.random() > 0.5 ? 'harmonic' : 'rhythmic') + ' patterns',
                    'Unique sound design',
                    'Signature ' + (Math.random() > 0.5 ? 'bass' : 'drum') + ' patterns'
                ],
                soundSignature: `${artistName}'s style is characterized by ${
                    Math.random() > 0.5 ? 'innovative sound design' : 'unique melodic patterns'
                } and ${
                    Math.random() > 0.5 ? 'powerful rhythmic elements' : 'atmospheric textures'
                }.`,
                genreInfluences: [
                    'Modern Trap',
                    'Electronic',
                    'Hip Hop',
                    Math.random() > 0.5 ? 'R&B' : 'Pop'
                ],
                productionTechniques: [
                    'Advanced ' + (Math.random() > 0.5 ? 'compression' : 'EQ') + ' techniques',
                    'Creative use of ' + (Math.random() > 0.5 ? 'reverb' : 'delay'),
                    'Distinctive ' + (Math.random() > 0.5 ? 'sample processing' : 'synthesis'),
                    'Unique ' + (Math.random() > 0.5 ? 'mixing' : 'mastering') + ' approach'
                ]
            };
            
            // Display the results
            results.innerHTML = `
                <div id="key-elements">
                    <h3>Key Elements</h3>
                    <ul>
                        ${analysis.keyElements.map(element => `<li>${element}</li>`).join('')}
                    </ul>
                </div>
                <div id="sound-signature">
                    <h3>Sound Signature</h3>
                    <p>${analysis.soundSignature}</p>
                </div>
                <div id="genre-influence">
                    <h3>Genre Influences</h3>
                    <ul>
                        ${analysis.genreInfluences.map(genre => `<li>${genre}</li>`).join('')}
                    </ul>
                </div>
                <div id="production-techniques">
                    <h3>Production Techniques</h3>
                    <ul>
                        ${analysis.productionTechniques.map(technique => `<li>${technique}</li>`).join('')}
                    </ul>
                </div>
                <p style="color: #ff00ff; margin-top: 15px;">AI Analysis Preview</p>
            `;
        } catch (error) {
            results.innerHTML = `<div class="error-message">Error analyzing style: ${error.message}</div>`;
        }
    }, 2000); // 2 second delay to simulate API call
}

// Helper function to extract audio features
async function extractAudioFeatures(files) {
    const features = [];
    
    for (const file of files) {
        // Create AudioContext
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Read file
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Create analyzers
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Extract features
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
        
        features.push({
            name: file.name,
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate,
            numberOfChannels: audioBuffer.numberOfChannels,
            frequencyData: Array.from(frequencyData)
        });
    }
    
    return features;
}

// Export functions
function exportAlbumArt() {
    if (!window.generatedAlbumArt) {
        alert('Please generate album art first');
        return;
    }
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = window.generatedAlbumArt;
    link.download = `album-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportLogo() {
    if (!window.generatedLogo) {
        alert('Please generate a logo first');
        return;
    }
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = window.generatedLogo;
    link.download = `logo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportVoiceTag() {
    // Implementation for exporting voice tag
}

function applyEffects() {
    // Implementation for applying voice effects
}

async function generateVisualization() {
    const audioFile = document.getElementById('audio-file').files[0];
    const style = document.getElementById('visual-style').value;
    const backgroundColor = document.getElementById('background-color').value;
    const preview = document.getElementById('visualization-preview');
    
    if (!audioFile) {
        alert('Please upload an audio file');
        return;
    }
    
    preview.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        
        // Read the file
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Create source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Set up canvas
        preview.innerHTML = '<canvas id="visualizer-canvas"></canvas>';
        const canvas = document.getElementById('visualizer-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = preview.offsetWidth;
        canvas.height = 300;
        
        // Set up visualization data
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Get frequency data
            analyser.getByteFrequencyData(dataArray);
            
            // Clear canvas
            ctx.fillStyle = backgroundColor || '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw visualization based on style
            switch(style) {
                case 'waveform':
                    drawWaveform(ctx, dataArray, canvas.width, canvas.height);
                    break;
                case 'bars':
                    drawBars(ctx, dataArray, canvas.width, canvas.height);
                    break;
                case 'circular':
                    drawCircular(ctx, dataArray, canvas.width, canvas.height);
                    break;
                case 'particles':
                    drawParticles(ctx, dataArray, canvas.width, canvas.height);
                    break;
            }
        }
        
        // Start audio and animation
        source.start(0);
        animate();
        
    } catch (error) {
        preview.innerHTML = `<div class="error-message">Error creating visualization: ${error.message}</div>`;
    }
}

// Visualization drawing functions
function drawWaveform(ctx, data, width, height) {
    ctx.beginPath();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    
    const sliceWidth = width / data.length;
    let x = 0;
    
    for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

function drawBars(ctx, data, width, height) {
    const barWidth = width / data.length * 2;
    let x = 0;
    
    for (let i = 0; i < data.length; i++) {
        const barHeight = data[i] / 255 * height;
        
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, '#ff00ff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

function drawCircular(ctx, data, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    ctx.beginPath();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < data.length; i++) {
        const angle = (i / data.length) * Math.PI * 2;
        const amplitude = data[i] / 255;
        const x = centerX + Math.cos(angle) * (radius + amplitude * 50);
        const y = centerY + Math.sin(angle) * (radius + amplitude * 50);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.stroke();
}

function drawParticles(ctx, data, width, height) {
    const particles = 100;
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < particles; i++) {
        const amplitude = data[i % data.length] / 255;
        const angle = (i / particles) * Math.PI * 2;
        const radius = amplitude * Math.min(width, height) / 2;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 255, 255, ${amplitude})`;
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize flashcard variables at the top level
let currentCardIndex = 0;
let currentCategory = 'basics';

const flashcards = {
    basics: [
        { question: "What is a note?", answer: "A single sound with a specific pitch and duration" },
        { question: "What is a measure?", answer: "A segment of time containing a specific number of beats" },
        { question: "What is tempo?", answer: "The speed or pace of a piece of music" },
        { question: "What is pitch?", answer: "How high or low a note sounds" },
        { question: "What is rhythm?", answer: "The pattern of beats and durations in music" }
    ],
    scales: [
        { question: "What is a major scale?", answer: "A scale with the pattern: whole, whole, half, whole, whole, whole, half" },
        { question: "What is a minor scale?", answer: "A scale with the pattern: whole, half, whole, whole, half, whole, whole" },
        { question: "What is a pentatonic scale?", answer: "A five-note scale commonly used in blues and rock" },
        { question: "What is the relative minor of C major?", answer: "A minor" },
        { question: "What is a chromatic scale?", answer: "A scale that includes all twelve notes in an octave" }
    ],
    chords: [
        { question: "What is a triad?", answer: "A three-note chord built of thirds" },
        { question: "What is a major chord?", answer: "A chord with a root, major third, and perfect fifth" },
        { question: "What is a minor chord?", answer: "A chord with a root, minor third, and perfect fifth" },
        { question: "What is a seventh chord?", answer: "A four-note chord built of thirds" },
        { question: "What is a diminished chord?", answer: "A chord with a root, minor third, and diminished fifth" }
    ],
    rhythm: [
        { question: "What is an eighth note?", answer: "A note that gets half a beat in 4/4 time" },
        { question: "What is a rest?", answer: "A period of silence in music" },
        { question: "What is syncopation?", answer: "Emphasis on weak beats or off-beats" },
        { question: "What is a time signature?", answer: "Numbers at the start of a piece showing beats per measure and note value" }
    ]
};

// Remove flashcards functions and replace with maintenance message
function openTheoryFlashcards() {
    const modalContent = `
        <h2>Music Theory Flashcards</h2>
        <div style="text-align: center; padding: 40px;">
            <p style="font-size: 1.2em; color: #00ffff; margin-bottom: 20px;">
                This feature is currently under maintenance.
            </p>
            <p style="color: #fff;">
                We're working on improving the flashcards experience. Please check back later!
            </p>
        </div>
    `;
    openModal(modalContent);
}

// Remove other flashcard functions
// function loadFlashcards(category) { ... }
// function updateCard() { ... }
// function nextCard() { ... }
// function prevCard() { ... }
// function flipCard() { ... }
// function setCategory(category) { ... }

function openDAWShortcuts() {
    const modalContent = `
        <h2>DAW Shortcut Guide</h2>
        <div class="shortcuts-container">
            <div class="daw-selector">
                <select id="daw-selector" onchange="loadShortcuts()">
                    <option value="fl-studio">FL Studio</option>
                    <option value="ableton">Ableton Live</option>
                    <option value="logic-pro">Logic Pro</option>
                    <option value="pro-tools">Pro Tools</option>
                    <option value="bandlab">BandLab</option>
                </select>
            </div>
            <div class="shortcuts-list" id="shortcuts-list">
                <!-- Shortcuts will be loaded here -->
            </div>
            <div class="shortcut-search">
                <input type="text" id="shortcut-search" placeholder="Search shortcuts..." onkeyup="searchShortcuts()">
            </div>
        </div>
    `;
    openModal(modalContent);
    loadShortcuts();
}

function loadShortcuts() {
    const daw = document.getElementById('daw-selector').value;
    const shortcutsList = document.getElementById('shortcuts-list');
    let shortcuts = {};

    switch(daw) {
        case 'fl-studio':
            shortcuts = {
                'Play/Pause': 'Space',
                'Stop': 'Shift + Space',
                'Record': 'F9',
                'Save': 'Ctrl + S',
                'New Pattern': 'Ctrl + N',
                'Add Channel': 'Ctrl + T',
                'Mixer': 'F9',
                'Piano Roll': 'F7',
                'Playlist': 'F5',
                'Browser': 'Alt + F8',
                'Undo': 'Ctrl + Z',
                'Redo': 'Ctrl + Y',
                'Cut': 'Ctrl + X',
                'Copy': 'Ctrl + C',
                'Paste': 'Ctrl + V',
                'Delete': 'Delete',
                'Select All': 'Ctrl + A',
                'Split': 'Ctrl + E',
                'Merge': 'Ctrl + M',
                'Quantize': 'Ctrl + Q'
            };
            break;
        case 'ableton':
            shortcuts = {
                'Play/Pause': 'Space',
                'Stop': 'Ctrl + L',
                'Record': 'Ctrl + Shift + R',
                'Save': 'Ctrl + S',
                'New Track': 'Ctrl + Shift + T',
                'New Scene': 'Ctrl + Shift + I',
                'Mixer': 'Ctrl + Alt + L',
                'Piano Roll': 'Ctrl + Alt + P',
                'Browser': 'Ctrl + Alt + B',
                'Undo': 'Ctrl + Z',
                'Redo': 'Ctrl + Y',
                'Cut': 'Ctrl + X',
                'Copy': 'Ctrl + C',
                'Paste': 'Ctrl + V',
                'Delete': 'Delete',
                'Select All': 'Ctrl + A',
                'Split': 'Ctrl + E',
                'Merge': 'Ctrl + J',
                'Quantize': 'Ctrl + Shift + U'
            };
            break;
        case 'logic-pro':
            shortcuts = {
                'Play/Pause': 'Space',
                'Stop': 'Command + .',
                'Record': 'R',
                'Save': 'Command + S',
                'New Track': 'Command + Option + N',
                'New Region': 'Command + R',
                'Mixer': 'Command + 2',
                'Piano Roll': 'Command + 4',
                'Browser': 'Command + 5',
                'Undo': 'Command + Z',
                'Redo': 'Command + Shift + Z',
                'Cut': 'Command + X',
                'Copy': 'Command + C',
                'Paste': 'Command + V',
                'Delete': 'Delete',
                'Select All': 'Command + A',
                'Split': 'Command + T',
                'Merge': 'Command + J',
                'Quantize': 'Command + Q'
            };
            break;
        case 'pro-tools':
            shortcuts = {
                'Play/Pause': 'Space',
                'Stop': 'Command + .',
                'Record': 'F12',
                'Save': 'Command + S',
                'New Track': 'Command + Shift + N',
                'New Region': 'Command + R',
                'Mixer': 'Command + =',
                'Piano Roll': 'Command + 4',
                'Browser': 'Command + 5',
                'Undo': 'Command + Z',
                'Redo': 'Command + Shift + Z',
                'Cut': 'Command + X',
                'Copy': 'Command + C',
                'Paste': 'Command + V',
                'Delete': 'Delete',
                'Select All': 'Command + A',
                'Split': 'Command + E',
                'Merge': 'Command + J',
                'Quantize': 'Command + 0'
            };
            break;
        case 'bandlab':
            shortcuts = {
                'Play/Pause': 'Space',
                'Stop': 'Esc',
                'Record': 'R',
                'Save': 'Ctrl + S',
                'New Track': 'Ctrl + T',
                'New Region': 'Ctrl + R',
                'Mixer': 'Ctrl + M',
                'Piano Roll': 'Ctrl + P',
                'Browser': 'Ctrl + B',
                'Undo': 'Ctrl + Z',
                'Redo': 'Ctrl + Y',
                'Cut': 'Ctrl + X',
                'Copy': 'Ctrl + C',
                'Paste': 'Ctrl + V',
                'Delete': 'Delete',
                'Select All': 'Ctrl + A',
                'Split': 'Ctrl + E',
                'Merge': 'Ctrl + J',
                'Quantize': 'Ctrl + Q',
                'Add Effect': 'Ctrl + E',
                'Add Instrument': 'Ctrl + I',
                'Add Loop': 'Ctrl + L',
                'Export': 'Ctrl + Shift + E',
                'Share': 'Ctrl + Shift + S'
            };
            break;
    }

    let html = '';
    for (const [action, shortcut] of Object.entries(shortcuts)) {
        html += `
            <div class="shortcut-item">
                <h4>${action}</h4>
                <p>${shortcut}</p>
            </div>
        `;
    }
    shortcutsList.innerHTML = html;
}

function searchShortcuts() {
    const searchTerm = document.getElementById('shortcut-search').value.toLowerCase();
    const shortcutItems = document.querySelectorAll('.shortcut-item');
    
    shortcutItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const shortcut = item.querySelector('p').textContent.toLowerCase();
        const isVisible = title.includes(searchTerm) || shortcut.includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
    });
}

function openPluginTutorials() {
    const modalContent = `
        <h2>Plugin Tutorial Library</h2>
        <div class="tutorials-container">
            <div class="tutorial-category">
                <h3>EQ Tutorials</h3>
                <div class="tutorial-grid">
                    <div class="tutorial-card">
                        <div class="tutorial-thumbnail">
                            <img src="https://img.youtube.com/vi/FRm9qTmQHKo/maxresdefault.jpg" alt="EQ Basics">
                        </div>
                        <div class="tutorial-content">
                            <h4>EQ Basics</h4>
                            <p>Learn the fundamentals of equalization and how to use EQ effectively in your mixes.</p>
                            <a href="https://www.youtube.com/watch?v=FRm9qTmQHKo" target="_blank" class="tutorial-link">Watch Tutorial</a>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-thumbnail">
                            <img src="https://img.youtube.com/vi/sHR7R-TY7NE&t=156s/maxresdefault.jpg" alt="Advanced EQ Techniques">
                        </div>
                        <div class="tutorial-content">
                            <h4>Advanced EQ Techniques</h4>
                            <p>Master advanced equalization techniques for professional-quality mixes.</p>
                            <a href="https://www.youtube.com/watch?v=sHR7R-TY7NE&t=156s" target="_blank" class="tutorial-link">Watch Tutorial</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tutorial-category">
                <h3>Compression Tutorials</h3>
                <div class="tutorial-grid">
                    <div class="tutorial-card">
                        <div class="tutorial-thumbnail">
                            <img src="https://img.youtube.com/vi/lgCYjek5_JY/maxresdefault.jpg" alt="Compression Fundamentals">
                        </div>
                        <div class="tutorial-content">
                            <h4>Compression Fundamentals</h4>
                            <p>Understanding the basics of audio compression and its role in mixing.</p>
                            <a href="https://www.youtube.com/watch?v=lgCYjek5_JY" target="_blank" class="tutorial-link">Watch Tutorial</a>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-thumbnail">
                            <img src="https://img.youtube.com/vi/ksJRgK3viMc/maxresdefault.jpg" alt="Advanced Compression">
                        </div>
                        <div class="tutorial-content">
                            <h4>Advanced Compression</h4>
                            <p>Learn advanced compression techniques for dynamic control and creative effects.</p>
                            <a href="https://www.youtube.com/watch?v=ksJRgK3viMc" target="_blank" class="tutorial-link">Watch Tutorial</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tutorial-category">
                <h3>Reverb Tutorials</h3>
                <div class="tutorial-grid">
                    <div class="tutorial-card">
                        <div class="tutorial-thumbnail">
                            <img src="https://img.youtube.com/vi/ml5B79roLm0&t=103s/maxresdefault.jpg" alt="Reverb Basics">
                        </div>
                        <div class="tutorial-content">
                            <h4>Reverb Basics</h4>
                            <p>Master the fundamentals of reverb and space in your mixes.</p>
                            <a href="https://www.youtube.com/watch?v=ml5B79roLm0&t=103s" target="_blank" class="tutorial-link">Watch Tutorial</a>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-thumbnail">
                            <img src="https://img.youtube.com/vi/yxoq5nCAvHI/maxresdefault.jpg" alt="Creative Reverb">
                        </div>
                        <div class="tutorial-content">
                            <h4>Creative Reverb</h4>
                            <p>Explore creative uses of reverb for unique sound design and mixing effects.</p>
                            <a href="https://www.youtube.com/watch?v=yxoq5nCAvHI" target="_blank" class="tutorial-link">Watch Tutorial</a>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    `;
    openModal(modalContent);
}

function openProducerDictionary() {
    const modalContent = `
        <h2>Producer Dictionary</h2>
        <div class="dictionary-container">
            <div class="dictionary-search">
                <input type="text" id="dictionary-search" placeholder="Search terms..." onkeyup="searchDictionary()">
            </div>
            <div class="dictionary-categories">
                <button class="category-btn" onclick="filterDictionary('all')">All</button>
                <button class="category-btn" onclick="filterDictionary('mixing')">Mixing</button>
                <button class="category-btn" onclick="filterDictionary('mastering')">Mastering</button>
                <button class="category-btn" onclick="filterDictionary('sound-design')">Sound Design</button>
            </div>
            <div class="term-category">
                <h3>Mixing Terms</h3>
                <div class="term-item">
                    <h4>Compression</h4>
                    <p>Reducing the dynamic range of an audio signal by lowering the volume of loud sounds and raising the volume of quiet sounds.</p>
                </div>
                <div class="term-item">
                    <h4>Equalization (EQ)</h4>
                    <p>Adjusting the balance between different frequency components in an audio signal.</p>
                </div>
                <div class="term-item">
                    <h4>Reverb</h4>
                    <p>An effect that simulates the reflection of sound waves off surfaces, creating a sense of space.</p>
                </div>
            </div>
            <div class="term-category">
                <h3>Mastering Terms</h3>
                <div class="term-item">
                    <h4>Loudness</h4>
                    <p>The perceived volume level of a track, measured in LUFS (Loudness Units Full Scale).</p>
                </div>
                <div class="term-item">
                    <h4>Stereo Width</h4>
                    <p>The perceived width of the stereo field, controlled by the difference between left and right channels.</p>
                </div>
                <div class="term-item">
                    <h4>Limiting</h4>
                    <p>A form of compression that prevents audio from exceeding a certain threshold, used to increase overall loudness.</p>
                </div>
            </div>
            <div class="term-category">
                <h3>Sound Design Terms</h3>
                <div class="term-item">
                    <h4>ADSR</h4>
                    <p>Attack, Decay, Sustain, Release - the four stages of a sound's envelope.</p>
                </div>
                <div class="term-item">
                    <h4>Filter</h4>
                    <p>A device that removes or emphasizes certain frequencies from a sound.</p>
                </div>
                <div class="term-item">
                    <h4>LFO</h4>
                    <p>Low Frequency Oscillator - used to modulate parameters over time.</p>
                </div>
            </div>
        </div>
    `;
    openModal(modalContent);
}

function searchDictionary() {
    const searchTerm = document.getElementById('dictionary-search').value.toLowerCase();
    const termItems = document.querySelectorAll('.term-item');
    
    termItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
        item.style.display = isVisible ? 'block' : 'none';
    });
}

function filterDictionary(category) {
    const termItems = document.querySelectorAll('.term-item');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category) {
            btn.classList.add('active');
        }
    });
    
    termItems.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            const itemCategory = item.closest('.term-category').querySelector('h3').textContent.toLowerCase();
            item.style.display = itemCategory.includes(category) ? 'block' : 'none';
        }
    });
}

function openBeatPerformance() {
    const modalContent = `
        <h2>Beat Performance Tracker</h2>
        <div class="analytics-container">
            <div class="input-group">
                <label>Beat Title:</label>
                <input type="text" id="beat-title" placeholder="Enter beat title">
            </div>
            <div class="input-group">
                <label>Release Date:</label>
                <input type="date" id="beat-release-date">
            </div>
            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>Streams</h3>
                    <input type="number" id="streams" placeholder="Total streams">
                </div>
                <div class="metric-card">
                    <h3>Downloads</h3>
                    <input type="number" id="downloads" placeholder="Total downloads">
                </div>
                <div class="metric-card">
                    <h3>Licenses</h3>
                    <input type="number" id="licenses" placeholder="Number of licenses">
                </div>
                <div class="metric-card">
                    <h3>Revenue</h3>
                    <input type="number" id="revenue" placeholder="Total revenue">
                </div>
            </div>
            <div class="chart-container">
                <canvas id="performance-chart"></canvas>
            </div>
            <div class="analysis-results">
                <h3>Performance Analysis</h3>
                <div id="performance-analysis"></div>
            </div>
            <button class="analyze-button" onclick="analyzeBeatPerformance()">Analyze Performance</button>
            <button class="export-button" onclick="exportBeatAnalysis()">Export Analysis</button>
        </div>
    `;
    openModal(modalContent);
}

function openReleaseImpact() {
    const modalContent = `
        <h2>Release Impact Analyzer</h2>
        <div class="analytics-container">
            <div class="input-group">
                <label>Release Title:</label>
                <input type="text" id="release-title" placeholder="Enter release title">
            </div>
            <div class="input-group">
                <label>Release Date:</label>
                <input type="date" id="release-date">
            </div>
            <div class="input-group">
                <label>Release Type:</label>
                <select id="release-type">
                    <option value="single">Single</option>
                    <option value="ep">EP</option>
                    <option value="album">Album</option>
                </select>
            </div>
            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>Pre-Save Goal</h3>
                    <input type="number" id="pre-save-goal" placeholder="Target pre-saves">
                </div>
                <div class="metric-card">
                    <h3>Marketing Budget</h3>
                    <input type="number" id="marketing-budget" placeholder="Budget amount">
                </div>
                <div class="metric-card">
                    <h3>Social Media Reach</h3>
                    <input type="number" id="social-reach" placeholder="Follower count">
                </div>
                <div class="metric-card">
                    <h3>Previous Release Performance</h3>
                    <input type="number" id="previous-performance" placeholder="Previous streams">
                </div>
            </div>
            <div class="chart-container">
                <canvas id="impact-chart"></canvas>
            </div>
            <div class="analysis-results">
                <h3>Impact Analysis</h3>
                <div id="impact-analysis"></div>
            </div>
            <button class="analyze-button" onclick="analyzeReleaseImpact()">Analyze Impact</button>
            <button class="export-button" onclick="exportImpactAnalysis()">Export Analysis</button>
        </div>
    `;
    openModal(modalContent);
}

function analyzeBeatPerformance() {
    const streams = parseInt(document.getElementById('streams').value) || 0;
    const downloads = parseInt(document.getElementById('downloads').value) || 0;
    const licenses = parseInt(document.getElementById('licenses').value) || 0;
    const revenue = parseInt(document.getElementById('revenue').value) || 0;
    
    const analysis = document.getElementById('performance-analysis');
    let analysisText = '<div class="analysis-item">';
    
    // Calculate performance metrics
    const avgRevenuePerLicense = licenses > 0 ? revenue / licenses : 0;
    const conversionRate = streams > 0 ? (downloads / streams) * 100 : 0;
    
    analysisText += `
        <h4>Performance Metrics</h4>
        <p>• Total Streams: ${streams.toLocaleString()}</p>
        <p>• Total Downloads: ${downloads.toLocaleString()}</p>
        <p>• Number of Licenses: ${licenses.toLocaleString()}</p>
        <p>• Total Revenue: $${revenue.toLocaleString()}</p>
        <p>• Average Revenue per License: $${avgRevenuePerLicense.toLocaleString()}</p>
        <p>• Conversion Rate: ${conversionRate.toFixed(2)}%</p>
    `;
    
    // Performance insights
    analysisText += '<h4>Insights</h4>';
    if (conversionRate > 5) {
        analysisText += '<p>• Strong conversion rate indicates effective marketing</p>';
    } else {
        analysisText += '<p>• Consider improving marketing to increase conversion rate</p>';
    }
    
    if (avgRevenuePerLicense > 100) {
        analysisText += '<p>• High revenue per license suggests premium pricing strategy</p>';
    } else {
        analysisText += '<p>• Consider premium licensing options to increase revenue</p>';
    }
    
    analysisText += '</div>';
    analysis.innerHTML = analysisText;
}

function analyzeReleaseImpact() {
    const title = document.getElementById('release-title').value;
    const releaseDate = document.getElementById('release-date').value;
    const releaseType = document.getElementById('release-type').value;
    const preSaveGoal = parseInt(document.getElementById('pre-save-goal').value) || 0;
    const marketingBudget = parseInt(document.getElementById('marketing-budget').value) || 0;
    const socialReach = parseInt(document.getElementById('social-reach').value) || 0;
    const previousPerformance = parseInt(document.getElementById('previous-performance').value) || 0;
    
    const analysis = document.getElementById('impact-analysis');
    let analysisText = '<div class="analysis-item">';
    
    analysisText += `
        <h4>Release Impact Analysis for ${title}</h4>
        <p>Release Type: ${releaseType.toUpperCase()}</p>
        <p>Release Date: ${releaseDate}</p>
    `;
    
    // Calculate potential impact
    const potentialReach = socialReach * 1.5; // Estimated reach based on social media
    const estimatedStreams = previousPerformance * 1.2; // 20% growth assumption
    const marketingEfficiency = marketingBudget > 0 ? estimatedStreams / marketingBudget : 0;
    
    analysisText += `
        <h4>Projected Impact</h4>
        <p>• Potential Reach: ${potentialReach.toLocaleString()}</p>
        <p>• Estimated Streams: ${estimatedStreams.toLocaleString()}</p>
        <p>• Marketing Efficiency: ${marketingEfficiency.toFixed(2)} streams per dollar</p>
    `;
    
    // Recommendations
    analysisText += '<h4>Recommendations</h4>';
    if (preSaveGoal > potentialReach * 0.1) {
        analysisText += '<p>• Consider adjusting pre-save goal to be more achievable</p>';
    } else {
        analysisText += '<p>• Pre-save goal is realistic and achievable</p>';
    }
    
    if (marketingEfficiency < 10) {
        analysisText += '<p>• Consider optimizing marketing strategy for better ROI</p>';
    } else {
        analysisText += '<p>• Marketing strategy shows good potential ROI</p>';
    }
    
    analysisText += '</div>';
    analysis.innerHTML = analysisText;
}

function exportBeatAnalysis() {
    const title = document.getElementById('beat-title').value || 'Beat Analysis';
    const analysis = document.getElementById('performance-analysis').innerText;
    const exportData = `${title}\n\n${analysis}`;
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-analysis.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function exportMarketAnalysis() {
    const genre = document.getElementById('genre-select').value;
    const market = document.getElementById('market-select').value;
    const analysis = document.getElementById('market-gap-analysis').innerText;
    const exportData = `Market Gap Analysis: ${genre} in ${market}\n\n${analysis}`;
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-gap-analysis-${genre}-${market}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function exportImpactAnalysis() {
    const title = document.getElementById('release-title').value || 'Release Impact Analysis';
    const analysis = document.getElementById('impact-analysis').innerText;
    const exportData = `${title}\n\n${analysis}`;
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-impact-analysis.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function openCollabMatcher() {
    const modalContent = `
        <h2>Collaboration Matcher</h2>
        <div class="collab-container">
            <div class="maintenance-message">
                <h3>🚧 Under Maintenance</h3>
                <p>The Collaboration Matcher feature is currently undergoing maintenance to improve its functionality and user experience.</p>
                <p>Please check back later!</p>
            </div>
        </div>
    `;
    openModal(modalContent);
}

function findCollaborators() {
    const projectType = document.getElementById('project-type').value;
    const genre = document.getElementById('collab-genre').value;
    const experience = document.getElementById('experience-level').value;
    const location = document.getElementById('location-preference').value;
    
    const results = document.getElementById('collab-results');
    results.innerHTML = `
        <div class="collab-match">
            <h3>Potential Collaborators</h3>
            <div class="match-list">
                <div class="match-item">
                    <h4>John Doe</h4>
                    <p>• Genre: ${genre}</p>
                    <p>• Experience: ${experience}</p>
                    <p>• Location: New York</p>
                    <p>• Match Score: 95%</p>
                    <button onclick="connectWithCollaborator('John Doe')">Connect</button>
                </div>
                <div class="match-item">
                    <h4>Jane Smith</h4>
                    <p>• Genre: ${genre}</p>
                    <p>• Experience: ${experience}</p>
                    <p>• Location: Los Angeles</p>
                    <p>• Match Score: 88%</p>
                    <button onclick="connectWithCollaborator('Jane Smith')">Connect</button>
                </div>
            </div>
        </div>
    `;
}

function connectWithCollaborator(name) {
    alert(`Connection request sent to ${name}`);
}

function openYouTubeUploadAssistant() {
  openModal(`
    <h2>YouTube Upload Assistant</h2>
    <form id="yt-upload-form" class="yt-upload-form" onsubmit="event.preventDefault(); generateYouTubeMetadata();">
      <div class="input-group">
        <label>Beat Title:</label>
        <input type="text" id="yt-beat-title" required placeholder="e.g. Midnight Drive">
      </div>
      <div class="input-group">
        <label>Genre:</label>
        <input type="text" id="yt-genre" required placeholder="e.g. Trap, Lofi, Pop">
      </div>
      <div class="input-group">
        <label>Mood:</label>
        <input type="text" id="yt-mood" placeholder="e.g. Chill, Dark, Uplifting">
      </div>
      <div class="input-group">
        <label>BPM:</label>
        <input type="number" id="yt-bpm" placeholder="e.g. 140">
      </div>
      <div class="input-group">
        <label>Collaborators (optional):</label>
        <input type="text" id="yt-collaborators" placeholder="e.g. Jane Doe, DJ X">
      </div>
      <div class="input-group">
        <label>Links (Spotify, Apple, etc.):</label>
        <input type="text" id="yt-links" placeholder="Paste links, separated by commas">
      </div>
      <div class="input-group">
        <label>Release Date (optional):</label>
        <input type="date" id="yt-release-date">
      </div>
      <button class="feature-button" type="submit">Generate Metadata</button>
    </form>
    <div id="yt-upload-results"></div>
  `);
}

function generateYouTubeMetadata() {
  const title = document.getElementById('yt-beat-title').value.trim();
  const genre = document.getElementById('yt-genre').value.trim();
  const mood = document.getElementById('yt-mood').value.trim();
  const bpm = document.getElementById('yt-bpm').value.trim();
  const collaborators = document.getElementById('yt-collaborators').value.trim();
  const links = document.getElementById('yt-links').value.trim();
  const releaseDate = document.getElementById('yt-release-date').value;

  // Generate YouTube Title
  let ytTitle = `${title} | ${genre} Beat`;
  if (mood) ytTitle += ` | ${mood}`;
  if (bpm) ytTitle += ` | ${bpm} BPM`;
  if (collaborators) ytTitle += ` x ${collaborators}`;

  // Generate Description
  let description = `🎵 ${title} (${genre}${mood ? ", " + mood : ""}${bpm ? ", " + bpm + " BPM" : ""})\n`;
  description += `\nProduced by ${collaborators ? collaborators : 'You'}\n`;
  if (releaseDate) description += `Release Date: ${releaseDate}\n`;
  description += `\nStream/Download:\n`;
  if (links) {
    links.split(',').forEach(link => {
      description += `- ${link.trim()}\n`;
    });
  } else {
    description += '- [Add your links here]\n';
  }
  description += `\nSubscribe for more beats!\n#${genre.replace(/\s+/g, '')} #${mood.replace(/\s+/g, '')} #TypeBeat`;

  // Generate Tags
  let tags = [
    `${title} type beat`,
    `${genre} beat`,
    `${mood} beat`,
    `${bpm} bpm`,
    `${title} instrumental`,
    `${genre} instrumental`,
    `${title} ${genre}`
  ];
  if (collaborators) tags.push(`${collaborators} type beat`);
  tags = tags.filter(Boolean).map(t => t.toLowerCase()).join(', ');

  // Hashtags
  let hashtags = `#${genre.replace(/\s+/g, '')} #${mood.replace(/\s+/g, '')} #TypeBeat`;

  // Thumbnail suggestion (simple text-based)
  let thumbnail = `Suggested: Use bold text "${title}" with a ${genre} vibe background.`;

  // Posting checklist
  let checklist = [
    'Upload your beat video to YouTube',
    'Paste the generated title',
    'Paste the generated description',
    'Paste the generated tags',
    'Upload a custom thumbnail',
    'Set the scheduled release date/time',
    'Double-check all links and info',
    'Publish or schedule your video!'
  ];

  document.getElementById('yt-upload-results').innerHTML = `
    <div class="yt-meta-block">
      <h3>YouTube Title <button onclick="copyToClipboard('#yt-title-out')">Copy</button></h3>
      <textarea id="yt-title-out" readonly>${ytTitle}</textarea>
    </div>
    <div class="yt-meta-block">
      <h3>Description <button onclick="copyToClipboard('#yt-desc-out')">Copy</button></h3>
      <textarea id="yt-desc-out" readonly>${description}</textarea>
    </div>
    <div class="yt-meta-block">
      <h3>Tags <button onclick="copyToClipboard('#yt-tags-out')">Copy</button></h3>
      <textarea id="yt-tags-out" readonly>${tags}</textarea>
    </div>
    <div class="yt-meta-block">
      <h3>Hashtags <button onclick="copyToClipboard('#yt-hashtags-out')">Copy</button></h3>
      <textarea id="yt-hashtags-out" readonly>${hashtags}</textarea>
    </div>
    <div class="yt-meta-block">
      <h3>Thumbnail Suggestion</h3>
      <div class="yt-thumbnail-suggestion">${thumbnail}</div>
    </div>
    <div class="yt-meta-block">
      <h3>Posting Checklist</h3>
      <ul>${checklist.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
}

function copyToClipboard(selector) {
  const element = document.querySelector(selector);
  element.select();
  document.execCommand('copy');
  alert('Copied to clipboard!');
}

function openSellYourBeats() {
  openModal(`
    <h2>Sell Your Beats</h2>
    <div style="padding: 20px; text-align: center;">
      <p style="font-size: 1.2em; color: #00ffff;">Want your beat featured in the Beat Shop?</p>
      <p>Send an email to <a href="mailto:thakerdubzmusic@gmail.com" style="color:#ffd700;">thakerdubzmusic@gmail.com</a> with your beat, details, and any links you want included.</p>
      <p>We'll review your submission and get back to you as soon as possible!</p>
    </div>
  `);
}

function openBpmTapper() {
  openModal(`
    <h2>BPM Tapper</h2>
    <div style="text-align:center; padding: 20px;">
      <div id="bpm-tap-display" style="font-size:2em; margin-bottom:20px; color:#00ffff;">Tap the button to start</div>
      <button id="bpm-tap-btn" class="feature-button" style="font-size:2em; padding: 30px 60px; margin-bottom: 20px;">TAP</button>
      <div style="margin-bottom: 10px;">
        <span id="bpm-result" style="font-size:1.5em; color:#ffd700;"></span>
      </div>
      <button id="bpm-reset-btn" class="feature-button" style="background:#222; color:#fff;">Reset</button>
    </div>
  `);

  let tapTimes = [];
  let lastTap = null;

  const tapBtn = document.getElementById('bpm-tap-btn');
  const resetBtn = document.getElementById('bpm-reset-btn');
  const bpmResult = document.getElementById('bpm-result');
  const tapDisplay = document.getElementById('bpm-tap-display');

  tapBtn.onclick = () => {
    const now = Date.now();
    if (lastTap && now - lastTap > 2000) {
      // If more than 2 seconds since last tap, reset
      tapTimes = [];
      tapDisplay.textContent = 'Tap the button to start';
      bpmResult.textContent = '';
    }
    tapTimes.push(now);
    lastTap = now;
    if (tapTimes.length > 1) {
      const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgMs);
      bpmResult.textContent = `BPM: ${bpm}`;
      tapDisplay.textContent = `Keep tapping to refine...`;
    } else {
      tapDisplay.textContent = 'Keep tapping...';
    }
  };

  resetBtn.onclick = () => {
    tapTimes = [];
    lastTap = null;
    bpmResult.textContent = '';
    tapDisplay.textContent = 'Tap the button to start';
  };
}

// User authentication functions
function openLoginModal() {
  document.getElementById('login-modal').style.display = 'block';
  // Hide badges and feature counter
  document.querySelectorAll('.recommended-badge, .maintenance-badge').forEach(badge => {
    badge.style.display = 'none';
  });
  document.getElementById('feature-counter').style.display = 'none';
}

function closeLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
  document.getElementById('login-message').textContent = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  // Show badges and feature counter again
  document.querySelectorAll('.recommended-badge, .maintenance-badge').forEach(badge => {
    badge.style.display = 'flex';
  });
  document.getElementById('feature-counter').style.display = 'inline-block';
}

async function signup() {
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageElement = document.getElementById('login-message');
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    messageElement.textContent = error.message;
    messageElement.style.color = '#ff4444';
  } else {
    messageElement.textContent = 'Sign up successful! Check your email to confirm.';
    messageElement.style.color = '#00ff00';
    setTimeout(() => {
      closeLoginModal();
      updateLoginButton();
    }, 2000);
  }
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password
    });

    if (error) throw error;

    isLoggedIn = true;
    document.getElementById('login-modal').style.display = 'none';
    updateLoginButton();
    updateKeytrendButtonState(); // Add this line to update button state after login
    
    // Clear login form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  } catch (error) {
    document.getElementById('login-message').textContent = error.message;
  }
}

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    isLoggedIn = false;
    updateLoginButton();
    updateKeytrendButtonState(); // Add this line to update button state after logout
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
}

function updateLoginButton() {
  const loginButton = document.querySelector('.login-button');
  supabase.auth.getUser().then(({ data }) => {
    if (data && data.user) {
      loginButton.textContent = `Logout (${data.user.email})`;
      loginButton.onclick = logout;
    } else {
      loginButton.textContent = 'Login';
      loginButton.onclick = openLoginModal;
    }
  });
}

function loginWithProvider(provider) {
  supabase.auth.signInWithOAuth({ provider });
}

// Listen for auth state changes
supabase.auth.onAuthStateChange(updateLoginButton);
// ... rest of the existing code ...