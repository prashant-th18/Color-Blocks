function initHugDay() {
    const messages = [
        "Happy Hug Day, Pillu ❤️",
        "I know we are far right now...",
        "We should have been closer...",
        "Because then, I would have hugged you so sooo harddd. 🫂"
    ];

    let msgIndex = 0;
    const textDisplay = document.getElementById('hug-text-display');

    // Start with messages
    function showNextMessage() {
        if (msgIndex < messages.length) {
            textDisplay.style.opacity = '0';
            setTimeout(() => {
                textDisplay.innerText = messages[msgIndex];
                textDisplay.style.opacity = '1';
                msgIndex++;
                setTimeout(showNextMessage, 3000);
            }, 500);
        } else {
            setTimeout(showMapStage, 1000);
        }
    }

    showNextMessage();
}

function showMapStage() {
    document.getElementById('hug-messages').classList.add('hidden');
    document.getElementById('hug-map-stage').classList.remove('hidden');

    // Initialize Map (Pune & Bangalore coordinates)
    const pune = [18.5204, 73.8567];
    const bangalore = [12.9716, 77.5946];

    const map = L.map('map').setView([15.7, 75.7], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markerP = L.marker(pune).addTo(map).bindPopup('Pillu in Pune 🌸');
    const markerB = L.marker(bangalore).addTo(map).bindPopup('Me in Bangalore 🏠');

    const line = L.polyline([pune, bangalore], { color: '#ff4d6d', weight: 5, dashArray: '10, 10' }).addTo(map);

    document.getElementById('distance-info').innerText = "Distance: ~840 km";

    document.getElementById('start-hug-btn').onclick = startCameraStage;
}

async function startCameraStage() {
    document.getElementById('hug-map-stage').classList.add('hidden');
    document.getElementById('hug-camera-stage').classList.remove('hidden');

    const video = document.getElementById('hug-video');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        detectHug(video);
    } catch (err) {
        document.getElementById('hug-status').innerText = "Please enable camera for the hug! ❤️";
    }
}

function detectHug(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('hug-status');
    const crying = document.getElementById('hug-overlay-crying');

    const checkFrame = () => {
        if (video.paused || video.ended || video.readyState < 4) {
            requestAnimationFrame(checkFrame);
            return;
        }

        // Using a tiny canvas for performance
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(video, 0, 0, 50, 50);

        const frame = ctx.getImageData(0, 0, 50, 50);
        console.log(frame);
        let totalBrightness = 0;

        for (let i = 0; i < frame.data.length; i += 4) {
            // Standard Luminance Formula: 0.299R + 0.587G + 0.114B
            const r = frame.data[i];
            const g = frame.data[i + 1];
            const b = frame.data[i + 2];
            totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
        }

        const avgBrightness = totalBrightness / (frame.data.length / 4);

        // --- DEBUG LOGGING ---
        // Open your console (F12) to see this number!
        console.log("Current Brightness:", Math.floor(avgBrightness));

        // Relaxed Threshold: Try 50 instead of 30.
        // If your console shows 40 when covered, change this to 60.
        if (avgBrightness < 50) {
            status.innerText = "HUG DETECTED! Sending warmth... ❤️";
            status.style.color = "#4BB543"; // Success Green
            crying.style.display = 'none';

            setTimeout(() => {
                const stream = video.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                finishHugDay();
            }, 1500);
        } else {
            status.innerText = "Please hug meeee... 🥺";
            requestAnimationFrame(checkFrame);
        }
    };

    checkFrame();
}

function finishHugDay() {
    // 1. Hide the camera stage
    document.getElementById('hug-camera-stage').classList.add('hidden');
    
    // 2. Enable "Success Mode" on the container to center everything
    const container = document.getElementById('hug-day-container');
    container.classList.add('success-mode');

    // 3. Show the Success Card
    const successCard = document.getElementById('hug-success');
    successCard.classList.remove('hidden');
    // Force a small delay to ensure the 'show' transition triggers
    setTimeout(() => successCard.classList.add('show'), 50);

    // 5. Trigger standard success effects
    if (typeof showSuccessPhotos === 'function') showSuccessPhotos(12);
    if (typeof spawnInitialHeartBurst === 'function') spawnInitialHeartBurst();
}