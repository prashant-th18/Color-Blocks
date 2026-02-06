// Replace your existing propose.js with this:
function initProposeDay() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const successCard = document.getElementById('propose-success');
    const proposeContainer = document.getElementById('propose-container');

    // Function to create one small crying photo in a random spot
    function popCryImage() {
        const cryImg = document.createElement('img');
        cryImg.src = "me_cry.jpeg"; // The photo you uploaded
        cryImg.className = "cry-photo";

        // Random coordinates within the window
        const x = Math.random() * (window.innerWidth - 80);
        const y = Math.random() * (window.innerHeight - 80);

        cryImg.style.left = x + 'px';
        cryImg.style.top = y + 'px';

        document.body.appendChild(cryImg);
    }

    if (noBtn) {
        noBtn.addEventListener('mouseover', () => {
            // 1. Move the button (Existing logic)
            const padding = 50;
            const newX = Math.random() * (window.innerWidth - noBtn.offsetWidth - padding);
            const newY = Math.random() * (window.innerHeight - noBtn.offsetHeight - padding);

            noBtn.style.position = 'fixed';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';

            // 2. Pop one crying image
            popCryImage();
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            if(window.showSuccessPhotos) window.showSuccessPhotos(8);
            
            // Remove all the "cry" images when she finally says Yes
            const cryPhotos = document.querySelectorAll('.cry-photo');
            cryPhotos.forEach(photo => photo.remove());

            document.querySelector('.btn-group').style.display = 'none';
            document.querySelector('.romantic-title').style.display = 'none';
            successCard.classList.remove('hidden');
            successCard.classList.add('show');
            
            if (typeof spawnInitialHeartBurst === 'function') {
                spawnInitialHeartBurst();
            }
        });
    }
}