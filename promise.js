const myPromises = [
    "I promise to always be your safe place. ❤️",
    "I promise to never stop annoying you with my love, hihi.",
    "I promise to support every dream you chase.",
    "I promise to hold your hand through every high and low. 🤝",
    "I promise to love you more with every heartbeat. Umuuaahhh!! 💓"
];

let keysUnlocked = 0;

function initPromiseDay() {
    const scatterArea = document.getElementById('scatter-area');
    const lockZone = document.getElementById('lock-zone');
    const heartIcon = document.getElementById('heart-lock-icon');
    const promiseDisplay = document.getElementById('active-promise');
    
    scatterArea.innerHTML = '';
    keysUnlocked = 0;
    heartIcon.classList.remove('unlocked');
    promiseDisplay.innerText = '';
    document.getElementById('promise-success').classList.add('hidden');

    for (let i = 0; i < 5; i++) {
        const key = document.createElement('div');
        key.className = 'golden-key';
        key.innerText = '🔑';
        key.draggable = true;
        key.id = `key-${i}`;

        // Get far away coordinates
        const pos = getFarAwayPosition();
        key.style.left = pos.x + 'vw';
        key.style.top = pos.y + 'vh';
        
        const randomRot = Math.floor(Math.random() * 60) - 30;
        key.style.transform = `rotate(${randomRot}deg)`;

        key.addEventListener('dragstart', (e) => {
            key.classList.add('dragging');
            e.dataTransfer.setData('text/plain', key.id);
        });

        key.addEventListener('dragend', () => key.classList.remove('dragging'));
        scatterArea.appendChild(key);
    }

    // Drag events
    lockZone.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        lockZone.classList.add('drag-over');
    });
    lockZone.addEventListener('dragleave', () => lockZone.classList.remove('drag-over'));
    lockZone.addEventListener('drop', (e) => {
        e.preventDefault();
        lockZone.classList.remove('drag-over');
        const keyId = e.dataTransfer.getData('text/plain');
        const keyElement = document.getElementById(keyId);
        if (keyElement) {
            keyElement.remove();
            unlockNextPromise();
        }
    });
}

/**
 * Calculates a random position that is NOT in the center 40% of the screen
 */
function getFarAwayPosition() {
    let x, y, isTooClose;
    do {
        x = Math.random() * 80 + 10; // 10% to 90% width
        y = Math.random() * 80 + 10; // 10% to 90% height
        
        // Check if it's in the "Danger Zone" (where title and heart are)
        // Title and Heart are roughly in the top-middle (x: 30-70, y: 0-60)
        const inTopMiddle = (x > 25 && x < 75 && y < 65);
        isTooClose = inTopMiddle;
        
    } while (isTooClose); 

    return { x, y };
}

function unlockNextPromise() {
    const promiseDisplay = document.getElementById('active-promise');
    const heartIcon = document.getElementById('heart-lock-icon');
    const fullText = myPromises[keysUnlocked];
    
    // Clear and prepare
    promiseDisplay.innerText = ""; 
    promiseDisplay.style.opacity = '1';
    
    let i = 0;
    function typeWriter() {
        if (i < fullText.length) {
            // Append the character
            promiseDisplay.innerHTML = fullText.substring(0, i + 1);
            i++;
            
            // Every 3rd character, make the heart do a tiny "thump"
            if (i % 3 === 0) {
                heartIcon.style.transform = 'scale(1.15)';
                setTimeout(() => heartIcon.style.transform = 'scale(1)', 50);
            }

            setTimeout(typeWriter, 40); // 40ms feels snappy but cute
        } else {
            // Promise finished! Increment counter
            keysUnlocked++;
            if (keysUnlocked === 5) {
                setTimeout(finishPromiseDay, 1000);
            }
        }
    }
    
    typeWriter();
}

function finishPromiseDay() {
    const heartIcon = document.getElementById('heart-lock-icon');
    const successCard = document.getElementById('promise-success');

    heartIcon.classList.add('unlocked');
    
    setTimeout(() => {
        if (typeof showSuccessPhotos === 'function') showSuccessPhotos(11);
        
        successCard.classList.remove('hidden');
        successCard.classList.add('show');

        // ADD THIS: Smoothly scroll to the success card so she sees the button
        // successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (typeof spawnInitialHeartBurst === 'function') spawnInitialHeartBurst();
    }, 1000);
}