const REASONS = [
    "Your beautiful smile",
    "Your cutu cheeks",
    "Your eyes",
    "Your hair",
    "The way you support me",
    "Your passion for your work",
    "Our late night talks",
    "How you look at me",
    "Your infectious laugh",
    "Your strength and courage",
    "How you make me a better man",
    "Your perfect hugs",
    "Your ladna with other people for me",
    "Simply being YOU"
];

function initValentineDay() {
    const container = document.getElementById('reasons-container');
    container.innerHTML = '';

    REASONS.forEach((reason, index) => {
        const div = document.createElement('div');
        div.className = 'reason-heart';
        div.innerHTML = `
            <span class="num">Reason #${index + 1}</span>
            <span class="txt">${reason}</span>
        `;
        container.appendChild(div);
    });
}

function openLoveLetter() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');

    setTimeout(() => {
        document.getElementById('envelope-wrapper').classList.add('hidden');
        document.getElementById('scrapbook-stage').classList.remove('hidden');
        
        // Trigger all memory photos to appear in the sidebars for the finale
        if (typeof showSuccessPhotos === 'function') {
            // Special: Cycle through all days or show a mix
            showSuccessPhotos(14); 
        }
        
        if (typeof spawnInitialHeartBurst === 'function') spawnInitialHeartBurst();
    }, 1000);
}