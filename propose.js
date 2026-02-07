function initProposeDay() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const successCard = document.getElementById('propose-success');
    const memeWrapper = document.getElementById('meme-wrapper');

    function popCryImage() {
        const cryImg = document.createElement('img');
        cryImg.src = "me_cry.jpeg";
        cryImg.className = "cry-photo";

        const x = Math.random() * (window.innerWidth - 80);
        const y = Math.random() * (window.innerHeight - 80);

        cryImg.style.left = x + 'px';
        cryImg.style.top = y + 'px';

        document.body.appendChild(cryImg);
    }

    if (noBtn) {
        noBtn.addEventListener('mouseover', () => {
            const padding = 50;
            const newX = Math.random() * (window.innerWidth - noBtn.offsetWidth - padding);
            const newY = Math.random() * (window.innerHeight - noBtn.offsetHeight - padding);

            noBtn.style.position = 'fixed';
            noBtn.style.left = newX + 'px';
            noBtn.style.top = newY + 'px';

            popCryImage();
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            if (window.showSuccessPhotos) window.showSuccessPhotos(8);

            const music = document.getElementById('happy-music');
            if (music) {
                music.play().catch(error => console.log("Audio play failed:", error));
            }

            // 1. Remove crying images
            const cryPhotos = document.querySelectorAll('.cry-photo');
            cryPhotos.forEach(photo => photo.remove());

            // 2. Hide the question and buttons
            document.querySelector('.btn-group').style.display = 'none';
            document.querySelector('.romantic-title').style.display = 'none';

            // 3. SHOW THE HAPPY CAT GIF
            memeWrapper.classList.remove('hidden');

            // 4. Show Success Card
            successCard.classList.remove('hidden');
            successCard.classList.add('show');

            if (typeof spawnInitialHeartBurst === 'function') {
                spawnInitialHeartBurst();
            }
        });
    }
}