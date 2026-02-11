const MAZE_SIZE = 10;
let playerPos = [9, 0]; // Start: Bottom Left

// 5 Tasks placed strictly on the path
const TASKS = [
    { pos: [8, 1], img: 'hug_image1.jpg', city: 'Lonavala', cleared: false },
    { pos: [6, 3], img: 'hug_image2.jpg', city: 'Pune', cleared: false },
    { pos: [9, 8], img: 'hug_image3.jpg', city: 'varkala', cleared: false },
    { pos: [4, 7], img: 'hug_image4.jpg', city: 'Mumbai', cleared: false },
    { pos: [1, 9], img: 'hug_image5.jpg', city: 'Nagpur', cleared: false }
];

// A single, complex winding path from (9,0) to (0,9)
const COMPLEX_PATH = [
    // Bottom snake
    "9,0", "9,1", "9,2", "8,1", "7,1", "7,0", "6,0",
    // Middle climb
    "6,1", "6,2", "6,3", "7,3", "8,3", "8,4", "8,6", "9,6",
    // Right snake
    "9,7", "9,8", "9,9", "8,9", "7,9", "6,9", "6,8", "6,7",
    // Top-right approach
    "5,7", "4,7", "3,7", "3,8", "3,9", "2,9", "1,9", "0,9",

    "9,5", "8,5", "7,5", "6,5", "5,5", "4,5", "3,5", "2,5", "1,5", "0,5",

    "0,6", "0,7"
];

function initHugDay() {
    const board = document.getElementById('maze-board');
    board.innerHTML = '';

    // Generate the 10x10 grid
    for (let r = 0; r < MAZE_SIZE; r++) {
        for (let c = 0; c < MAZE_SIZE; c++) {
            const cell = document.createElement('div');
            cell.id = `cell-${r}-${c}`;

            if (COMPLEX_PATH.includes(`${r},${c}`)) {
                cell.className = 'maze-cell path';
                cell.onclick = () => movePlayer(r, c);
            } else {
                cell.className = 'maze-cell wall';
            }
            board.appendChild(cell);
        }
    }
    updateMazeUI();
}

function movePlayer(r, c) {
    const dr = Math.abs(r - playerPos[0]);
    const dc = Math.abs(c - playerPos[1]);

    // Check if the cell is adjacent and part of the path
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        const task = TASKS.find(t => t.pos[0] === r && t.pos[1] === c && !t.cleared);

        if (task) {
            openMazeTask(task);
            return;
        }

        playerPos = [r, c];
        updateMazeUI();

        // Final Destination: (0,9)
        if (r === 0 && c === 9) {
            setTimeout(finishMaze, 500);
        }
    }
}

function openMazeTask(task) {
    activeTask = task;
    const modal = document.getElementById('maze-modal');
    document.getElementById('task-image').src = task.img;
    document.getElementById('modal-error').classList.add('hidden');
    modal.classList.remove('hidden');
    // Focus the input
    setTimeout(() => document.getElementById('city-guess').focus(), 100);
}

function checkMazeTask() {
    const input = document.getElementById('city-guess');
    const guess = input.value.toLowerCase().trim();

    if (guess === activeTask.city.toLowerCase()) {
        // 1. Completely hide the quiz elements
        document.getElementById('modal-content-wrapper').style.display = 'none';

        // 2. Show celebration (now with a matching glass background)
        const celebration = document.getElementById('modal-celebration');
        celebration.classList.remove('hidden');

        // 3. Optional: Add a little 'correct' sound if you have one
        // new Audio('correct.mp3').play();

        setTimeout(() => {
            activeTask.cleared = true;
            playerPos = [activeTask.pos[0], activeTask.pos[1]];

            // 4. Reset for next task
            document.getElementById('maze-modal').classList.add('hidden');
            celebration.classList.add('hidden');
            document.getElementById('modal-content-wrapper').style.display = 'block';

            input.value = '';
            updateMazeUI();

            if (playerPos[0] === 0 && playerPos[1] === 9) finishMaze();
        }, 2000); // Increased to 2 seconds so she can see the animation

    } else {
        const error = document.getElementById('modal-error');
        error.classList.remove('hidden');
        // Shake the whole modal
        const modal = document.getElementById('maze-modal');
        modal.classList.add('shake');
        setTimeout(() => modal.classList.remove('shake'), 500);
    }
}

function updateMazeUI() {
    document.querySelectorAll('.maze-cell').forEach(c => {
        c.classList.remove('sejal-node', 'me-node', 'task-node');
        c.innerHTML = ''; // Clear previous emojis
    });

    // Sejal (Player)
    const playerCell = document.getElementById(`cell-${playerPos[0]}-${playerPos[1]}`);
    playerCell.classList.add('sejal-node');
    playerCell.innerHTML = '👧';

    // Me (Target)
    const homeCell = document.getElementById('cell-0-9');
    homeCell.classList.add('me-node');
    homeCell.innerHTML = '🏠';

    // Tasks (Checkpoints)
    TASKS.forEach(t => {
        if (!t.cleared) {
            const taskCell = document.getElementById(`cell-${t.pos[0]}-${t.pos[1]}`);
            taskCell.classList.add('task-node');
            taskCell.innerHTML = '🎁';
        }
    });
}

function finishMaze() {
    // 1. Hide the Maze UI
    const mazeArea = document.getElementById('maze-container');
    if (mazeArea) mazeArea.classList.add('hidden');

    // 2. Show the Success Container
    const successContainer = document.getElementById('hug-success-container');
    if (successContainer) {
        successContainer.classList.remove('hidden');
        // Ensure it uses flex to center the middle card
        successContainer.style.display = "flex";
    }

    // 3. Trigger sidebar photos for Day 12 from script.js

    console.log("Attempting to show success photos for Day 12");
    showSuccessPhotos(12);

    // 4. Animate the central card in
    setTimeout(() => {
        const card = document.getElementById('hug-success-card');
        if (card) card.classList.add('show');
    }, 100);

    // 5. Celebration Effects
    if (typeof spawnInitialHeartBurst === 'function') spawnInitialHeartBurst();

    // const music = document.getElementById('happy-music');
    // if (music) music.play().catch(e => console.log("Music interaction required"));
}