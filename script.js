let hugInterval;
let hugProgress = 0;
const HUG_GOAL = 100;

const DAILY_MEMORIES = {
    7: { // Rose Day
        left: [{ src: 'image1.jpg', cap: 'My Pillu ❤️' }, { src: 'image2.jpg', cap: 'That Smile...' }],
        right: [{ src: 'image3.jpg', cap: 'Awww ❤️' }, { src: 'image4.jpg', cap: 'Always You!' }]
    },
    8: { // Propose Day
        left: [{ src: 'image9.jpg', cap: 'The most beautiful couple ❤️' }, { src: 'image10.jpg', cap: 'Cutie Patooties' }],
        right: [{ src: 'image11.jpg', cap: 'Birthday vibes ❤️' }, { src: 'image12.jpg', cap: 'Our First Date' }]
    },
    // Skipping chocolate day
    // 9: { // Chocolate Day (Update these with new photos later!)
    //     left: [{src: 'image1.jpg', cap: 'Sweetest person'}, {src: 'image3.jpg', cap: 'My happiness'}],
    //     right: [{src: 'image2.jpg', cap: 'Chocolate Sweet'}, {src: 'image4.jpg', cap: 'Pillu ❤️'}]
    // }
    10: {
        left: [{ src: 'image13.jpg', cap: 'Meli cutu pillu ❤️' }],
        right: [{ src: 'image14.jpg', cap: 'Awwww, Umuuahhhhh' }]
    }
    // Add 10, 11, 12, 13, 14 as you get more photos!
};

function showSuccessPhotos(day) {
    const memories = DAILY_MEMORIES[day];
    if (!memories) return;

    const leftContainer = document.getElementById('left-photos');
    const rightContainer = document.getElementById('right-photos');

    const createMarkup = (photos) => photos.map(p => `
        <div class="polaroid">
            <img src="${p.src}">
            <div class="caption">${p.cap}</div>
        </div>
    `).join('');

    leftContainer.innerHTML = createMarkup(memories.left);
    rightContainer.innerHTML = createMarkup(memories.right);

    // Fade in
    leftContainer.classList.remove('hidden');
    rightContainer.classList.remove('hidden');
    setTimeout(() => {
        leftContainer.style.opacity = '1';
        rightContainer.style.opacity = '1';
    }, 100);
}

// --- INITIALIZATION ---
let currentProgress = parseInt(localStorage.getItem('valentineProgress')) || 6;
const DEBUG_MODE = false;

window.onload = () => {
    // Default to 7 for the first-time experience
    let savedProgress = parseInt(localStorage.getItem('valentineProgress')) || 7;

    // 1. Find the actual highest day released according to the current time
    let latestReleasedByClock = 6;
    for (let d = 14; d >= 7; d--) {
        if (isDayReleased(d)) {
            latestReleasedByClock = d;
            break;
        }
    }

    // 2. Automatic Transition Logic:
    // If she is still on the teaser (6) but Day 7 has arrived, move her to 7.
    if (savedProgress < 7 && latestReleasedByClock >= 7) {
        savedProgress = 7;
    }
    // 3. Security Check:
    // If her saved day hasn't been released yet (cheating), bring her back to today.
    else if (!isDayReleased(savedProgress) && !DEBUG_MODE) {
        savedProgress = latestReleasedByClock;
    }

    showDay(savedProgress);
};

function showDay(dayNumber) {
    // 1. Hide all sections
    document.querySelectorAll('.day-section').forEach(s => s.classList.add('hidden'));

    // 2. HIDE SIDEBARS by default whenever a new day is loaded
    const leftSide = document.getElementById('left-photos');
    const rightSide = document.getElementById('right-photos');
    leftSide.classList.add('hidden');
    leftSide.style.opacity = '0';
    rightSide.classList.add('hidden');
    rightSide.style.opacity = '0';

    const target = document.getElementById(`section-${dayNumber}`);
    if (target) {
        target.classList.remove('hidden');
        updateSidebar(dayNumber);

        // Only init games for current day
        if (dayNumber === 8) initProposeDay();
        if (dayNumber === 9) initChocolateDay();
        if (dayNumber === 10) initTeddySqueeze();
    }
}

function handleDayComplete(nextDay) {
    // 1. Save that she finished the CURRENT day's task
    localStorage.setItem(`finishedDay${nextDay - 1}`, "true");

    // 2. Check if the next day is actually released yet
    if (isDayReleased(nextDay)) {
        currentProgress = nextDay;
        localStorage.setItem('valentineProgress', nextDay);
        showDay(nextDay);
    } else {
        // Next day is locked by time
        showLockedModal(nextDay);
    }
}

function showLockedModal(day) {
    // 1. Calculate the date string for the next day
    const nextDate = new Date(2026, 1, day).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });

    // 2. Identify which day she just finished (the previous day)
    const finishedDay = day - 1;

    // 3. Find the success card for the day she just finished
    // Mapping IDs to their respective sections
    const successCardIds = {
        7: 'message-card',
        8: 'propose-success',
        9: 'chocolate-success',
        10: 'teddy-success'
    };

    const activeCardId = successCardIds[finishedDay];
    const card = document.getElementById(activeCardId);

    if (card) {
        // Change the paragraph text inside the active card
        const p = card.querySelector('p');
        if (p) {
            p.innerHTML = `<span style="color: #ff4d6d; font-weight: bold;">Mission Accomplished! ❤️</span><br>
                           You've unlocked everything for today. The next chapter will bloom on <b>${nextDate}</b>.`;
        }

        // Find the button inside this card and disable it
        const btn = card.querySelector('button');
        if (btn) {
            btn.innerText = "Locked until " + nextDate;
            btn.style.opacity = "0.6";
            btn.style.cursor = "not-allowed";
            btn.onclick = null; // Remove the click event
        }
    }
}



// ========================================================================================================


// --- TIME GATE CONFIGURATION ---
const RELEASE_DATES = {
    6: "2026-02-01", // Already released
    7: "2026-02-07",
    8: "2026-02-08",
    9: "2026-02-09",
    10: "2026-02-10",
    11: "2026-02-11",
    12: "2026-02-12",
    13: "2026-02-13",
    14: "2026-02-14"
};

function isDayReleased(dayNumber) {
    if (DEBUG_MODE) return true;

    const now = new Date();

    // Engineering Note: Months are 0-indexed in JS (Jan = 0, Feb = 1)
    // This creates a date object for Midnight Local Time on that day
    const targetDate = new Date(2026, 1, dayNumber);

    // Example: Feb 7 at 00:00:00 IST
    return now >= targetDate;
}



// --- 1. CONFIGURATION & STATE ---
const compliments = ["Beautiful", "My Love", "Meri Pillu", "Gorgeous", "The Best", "Queen", "Mine", "Love you", "Meri Bhisma", "Meri Jaan"];
let roseCount = 0;
const goal = 10;
let isFinished = false;

// --- 2. HELPER FUNCTIONS ---

// Function to create the container for petals if it doesn't exist
function createPetalContainer() {
    let container = document.getElementById('petal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'petal-container';
        document.body.appendChild(container);
    }
    return container;
}

// Function to create a single falling petal
function createPetal(isInitial = false) {
    const container = createPetalContainer();
    const petal = document.createElement('div');
    petal.className = 'petal';

    const size = Math.random() * 15 + 10 + 'px';
    const startPosition = Math.random() * window.innerWidth + 'px';
    const fallDuration = Math.random() * 5 + 5;

    // Negative delay starts them mid-screen for the initial load
    const delay = isInitial ? -(Math.random() * fallDuration) : 0;

    petal.style.width = size;
    petal.style.height = size;
    petal.style.left = startPosition;
    petal.style.animationDuration = fallDuration + 's';
    petal.style.animationDelay = delay + 's';

    const colors = ['#ff4d6d', '#ff758f', '#ff85a1', '#fecdd3'];
    petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, (fallDuration + Math.max(0, delay)) * 1000);
}

function completeRoseDay() {
    isFinished = true;

    showSuccessPhotos(7);

    // 4. Trigger the fade-in after the browser renders the display change
    setTimeout(() => {
        leftSide.style.opacity = '1';
        rightSide.style.opacity = '1';
    }, 100);

    // 5. Show the central message card
    setTimeout(() => {
        const messageCard = document.getElementById('message-card');
        messageCard.classList.remove('hidden');
        setTimeout(() => messageCard.classList.add('show'), 100);
    }, 1500); // Delay the card slightly so she sees the photos first
}

// Simple function to scatter hearts across the screen once
function spawnInitialHeartBurst() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'compliment'; // Reuse our floating animation
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = Math.random() * window.innerHeight + 'px';
            heart.style.fontSize = '2rem';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// --- 3. EVENT LISTENERS ---

// Replace the click event listener section with this:
document.getElementById('garden-container').addEventListener('click', (e) => {
    if (isFinished) return;

    // 1. Create the Rose Image
    const rose = document.createElement('img');
    rose.className = 'rose';

    // Using a high-quality transparent PNG of a red rose
    rose.src = "rose_image.png";

    // Adjusting size: we'll set a base width and scale it
    const baseWidth = 60;
    const randomScale = 0.8 + Math.random() * 0.6; // Scale between 0.8x and 1.4x

    rose.style.width = baseWidth + 'px';
    rose.style.left = (e.clientX - (baseWidth * randomScale) / 2) + 'px';
    rose.style.top = (e.clientY - (baseWidth * randomScale) / 2) + 'px';
    rose.style.transform = `scale(${randomScale})`;

    document.getElementById('garden-container').appendChild(rose);

    // 2. Add a Floating Compliment
    const comp = document.createElement('div');
    comp.className = 'compliment';
    comp.textContent = compliments[Math.floor(Math.random() * compliments.length)];
    comp.style.left = e.clientX + 'px';
    comp.style.top = e.clientY + 'px';
    document.body.appendChild(comp);
    setTimeout(() => comp.remove(), 2000);

    // 3. Update logic
    roseCount++;
    const countDisplay = document.getElementById('count');
    if (countDisplay) countDisplay.textContent = roseCount;

    if (roseCount >= goal) completeRoseDay();
});

// --- 4. EXECUTION (Running the code) ---

// 1. "Pre-warm" the screen with petals already falling
for (let i = 0; i < 30; i++) {
    createPetal(true);
}

// 2. Start the continuous petal drop
setInterval(() => createPetal(false), 300);

function updateSidebar(currentDay) {
    for (let i = 7; i <= 14; i++) {
        const node = document.getElementById(`node-${i}`);
        if (!node) continue;

        if (i < currentDay) {
            // Completed days get a heart
            node.className = "day-node completed";
            node.innerHTML = "❤️";
        } else if (i === currentDay) {
            // Current day is highlighted
            node.className = "day-node active";
            node.innerHTML = i;
        } else {
            // Future days remain locked
            node.className = "day-node locked";
            node.innerHTML = i;
        }
    }
}

function initChocolateDay() {
    const grid = document.getElementById('chocolate-grid');
    // Using your uploaded images
    const images = ['image5.JPG', 'image6.jpg', 'image7.jpg', 'image8.jpg'];
    const cardsData = [...images, ...images]; // 8 cards total

    cardsData.sort(() => Math.random() - 0.5); // Shuffle

    let flippedCards = [];
    let matchedPairs = 0;

    grid.innerHTML = ''; // Clear the grid

    cardsData.forEach((imgSrc) => {
        const card = document.createElement('div');
        card.className = 'chocolate-card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">🍫</div>
                <div class="card-back"><img src="${imgSrc}"></div>
            </div>
        `;

        card.addEventListener('click', () => {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                card.classList.add('flipped');
                flippedCards.push({ card, imgSrc });

                if (flippedCards.length === 2) {
                    if (flippedCards[0].imgSrc === flippedCards[1].imgSrc) {
                        matchedPairs++;
                        flippedCards = [];
                        if (matchedPairs === images.length) {
                            // showSuccessPhotos(9);
                            setTimeout(() => {
                                document.getElementById('chocolate-success').classList.remove('hidden');
                                document.getElementById('chocolate-success').classList.add('show');
                                spawnInitialHeartBurst();
                            }, 600);
                        }
                    } else {
                        setTimeout(() => {
                            flippedCards.forEach(c => c.card.classList.remove('flipped'));
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
        });
        grid.appendChild(card);
    });
}

function initTeddySqueeze() {
    const bear = document.getElementById('hug-teddy');
    const bearStage = document.getElementById('teddy-stage-squeeze');
    const meterFill = document.getElementById('hug-meter-fill');

    // Configuration
    const baseScale = 1;
    const maxExtraScale = 3.5; // This will make the bear 4.5x its size at the end

    bearStage.addEventListener('mousedown', startSqueeze);
    window.addEventListener('mouseup', stopSqueeze);

    function startSqueeze() {
        if (hugProgress >= HUG_GOAL) return;

        hugInterval = setInterval(() => {
            hugProgress += 1;

            // 1. Update Meter
            meterFill.style.width = hugProgress + "%";

            // 2. DYNAMIC SCALING
            // As hugProgress goes 0 -> 100, scale goes 1 -> 4.5
            let currentScale = baseScale + (hugProgress / 100) * maxExtraScale;
            bear.style.transform = `scale(${currentScale})`;

            // 3. Effects
            if (hugProgress % 4 === 0) spawnHugHeart();

            if (hugProgress >= HUG_GOAL) {
                finishHug();
            }
        }, 50); // 5 Seconds total
    }

    function stopSqueeze() {
        clearInterval(hugInterval);

        // Reset scale and progress if they let go early
        if (hugProgress < HUG_GOAL) {
            hugProgress = 0;
            meterFill.style.width = "0%";
            bear.style.transform = `scale(1)`;
        }
    }

    function spawnHugHeart() {
        const heartContainer = document.getElementById('hug-heart-container');
        const heart = document.createElement('div');
        heart.className = 'hug-heart';
        heart.innerHTML = '❤️';

        // As the bear grows, spread hearts further out
        const spread = 200 + (hugProgress * 2);
        const randomX = (Math.random() - 0.5) * spread;

        heart.style.left = `calc(50% + ${randomX}px)`;
        heart.style.top = '50%';

        heartContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }

    function finishHug() {
        showSuccessPhotos(10);
        clearInterval(hugInterval);
        // Keep the bear at full size for a moment of triumph

        const successCard = document.getElementById('teddy-success');
        successCard.classList.remove('hidden');
        setTimeout(() => successCard.classList.add('show'), 100);

        spawnInitialHeartBurst();
    }
}