function initKissDay() {
    // 1. Reset State: Hide everything except messages
    document.getElementById('kiss-map-stage').classList.add('hidden');
    document.getElementById('kiss-camera-stage').classList.add('hidden');
    document.getElementById('kiss-success').classList.add('hidden');
    
    const messageStage = document.getElementById('kiss-messages');
    messageStage.classList.remove('hidden');
    messageStage.style.opacity = '1';

    const messages = [
        "Happy Kiss Day, Pillu ❤️",
        "I know we are far right now...",
        "We should have been closer...",
        "Because then, I would have kissed you so sooo harddd. 💋"
    ];

    let msgIndex = 0;
    const textDisplay = document.getElementById('kiss-text-display');

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
            // Once messages finish, move to Map
            setTimeout(showKissMapStage, 1000);
        }
    }
    showNextMessage();
}

function showKissMapStage() {
    // Hide Messages
    document.getElementById('kiss-messages').classList.add('hidden');
    
    // Show Map Stage
    const mapStage = document.getElementById('kiss-map-stage');
    mapStage.classList.remove('hidden');

    // Initialize Leaflet Map (Standard logic)
    const pune = [18.5204, 73.8567];
    const bangalore = [12.9716, 77.5946];
    
    const mapContainer = L.DomUtil.get('kiss-map');
    if (mapContainer != null) { mapContainer._leaflet_id = null; }

    const map = L.map('kiss-map').setView([15.7, 75.7], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    L.marker(pune).addTo(map).bindPopup('Pillu in Pune 🌸');
    L.marker(bangalore).addTo(map).bindPopup('Me in Bangalore 🏠');
    L.polyline([pune, bangalore], {color: '#ff4d6d', weight: 5, dashArray: '10, 10'}).addTo(map);
    
    document.getElementById('kiss-distance-info').innerText = "Distance: ~840 km";
    document.getElementById('start-kiss-btn').onclick = startKissCameraStage;
}

async function startKissCameraStage() {
    // Hide Map
    document.getElementById('kiss-map-stage').classList.add('hidden');
    
    // Show Camera
    document.getElementById('kiss-camera-stage').classList.remove('hidden');

    const video = document.getElementById('kiss-video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
        detectKiss(video);
    } catch (err) {
        document.getElementById('kiss-status').innerText = "Camera access denied. 🥺";
    }
}

function detectKiss(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('kiss-status');
    const crying = document.getElementById('kiss-overlay-crying');

    const checkFrame = () => {
        if (video.paused || video.ended || video.readyState < 4) {
            requestAnimationFrame(checkFrame);
            return;
        }

        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(video, 0, 0, 50, 50);

        const frame = ctx.getImageData(0, 0, 50, 50);
        let totalBrightness = 0;

        for (let i = 0; i < frame.data.length; i += 4) {
            totalBrightness += (0.299 * frame.data[i] + 0.587 * frame.data[i + 1] + 0.114 * frame.data[i + 2]);
        }

        const avgBrightness = totalBrightness / (frame.data.length / 4);

        if (avgBrightness < 50 && avgBrightness > 0.1) {
            status.innerText = "KISS DETECTED! Sending love... 💋";
            status.style.color = "#4BB543";
            crying.style.display = 'none';

            setTimeout(() => {
                const stream = video.srcObject;
                if (stream) stream.getTracks().forEach(track => track.stop());
                finishKissDay();
            }, 1500);
        } else {
            status.innerText = "Give me a kiss, Pillu... 🥺";
            requestAnimationFrame(checkFrame);
        }
    };

    checkFrame();
}

function finishKissDay() {
    // 1. Hide the camera/map stages
    document.getElementById('kiss-camera-stage').classList.add('hidden');
    document.getElementById('kiss-map-stage').classList.add('hidden');
    document.getElementById('kiss-messages').classList.add('hidden');

    // 2. Force scroll to top so centering works perfectly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. Enable Success Mode
    const container = document.getElementById('kiss-day-container');
    container.classList.add('success-mode');

    // 4. Show the Card
    const successCard = document.getElementById('kiss-success');
    successCard.classList.remove('hidden');
    setTimeout(() => successCard.classList.add('show'), 100);

    // 5. Success Effects
    // if (music) music.play();
    if (typeof showSuccessPhotos === 'function') showSuccessPhotos(13);
    if (typeof spawnInitialHeartBurst === 'function') spawnInitialHeartBurst();
}