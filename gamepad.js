let gamepadContainer;
let noGamepadMessage;
let previousGamepadStates = [];

function init() {
    gamepadContainer = document.getElementById('gamepadContainer');
    noGamepadMessage = document.querySelector('.no-gamepad');
    window.addEventListener('gamepadconnected', onGamepadConnected);
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
}

function onGamepadConnected(event) {
    console.log('Gamepad connected:', event.gamepad);
    update();
}

function onGamepadDisconnected(event) {
    console.log('Gamepad disconnected:', event.gamepad);
    update();
}

function update() {
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;

    let gamepadConnected = false;

    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        gamepadConnected = true;

        if (!previousGamepadStates[i] || !compareGamepadStates(previousGamepadStates[i], gp)) {
            updateGamepadInfo(i, gp);
            previousGamepadStates[i] = gp;
        }
    }

    if (!gamepadConnected) {
        noGamepadMessage.style.display = 'block';
    } else {
        noGamepadMessage.style.display = 'none';
    }

    requestAnimationFrame(update);
}

function updateGamepadInfo(index, gp) {
    let gamepadDiv = document.querySelector(`.gamepad-info[data-index="${index}"]`);
    if (!gamepadDiv) {
        gamepadDiv = document.createElement('div');
        gamepadDiv.className = 'gamepad-info';
        gamepadDiv.setAttribute('data-index', index);
        gamepadContainer.appendChild(gamepadDiv);
    }

    gamepadDiv.innerHTML = `<h2>Gamepad ${gp.index}: ${gp.id}</h2>`;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons-info';
    for (let j = 0; j < gp.buttons.length; j++) {
        const button = gp.buttons[j];
        const buttonInfo = document.createElement('p');
        buttonInfo.textContent = `Button ${j}: ${button.pressed}`;
        buttonsDiv.appendChild(buttonInfo);
    }
    gamepadDiv.appendChild(buttonsDiv);

    const axesDiv = document.createElement('div');
    axesDiv.className = 'axes-info';
    for (let j = 0; j < gp.axes.length; j++) {
        const axis = gp.axes[j];
        const axisInfo = document.createElement('p');
        axisInfo.textContent = `Axis ${j}: ${axis.toFixed(2)}`;
        axesDiv.appendChild(axisInfo);
    }
    gamepadDiv.appendChild(axesDiv);

    const stickContainer = document.createElement('div');
    stickContainer.className = 'stick-container';
    const stickCanvas = document.createElement('canvas');
    stickCanvas.width = 300;
    stickCanvas.height = 300;
    stickContainer.appendChild(stickCanvas);
    gamepadDiv.appendChild(stickContainer);

    updateStickCanvas(stickCanvas, gp.axes);
}

function compareGamepadStates(prev, curr) {
    if (prev.buttons.length !== curr.buttons.length || prev.axes.length !== curr.axes.length) {
        return false;
    }

    for (let i = 0; i < prev.buttons.length; i++) {
        if (prev.buttons[i].pressed !== curr.buttons[i].pressed) {
            return false;
        }
    }

    for (let i = 0; i < prev.axes.length; i++) {
        if (prev.axes[i] !== curr.axes[i]) {
            return false;
        }
    }

    return true;
}

function updateStickCanvas(canvas, axes) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 10;

    // Draw left stick
    const leftStickX = centerX + axes[0] * maxRadius;
    const leftStickY = centerY + axes[1] * maxRadius;
    ctx.beginPath();
    ctx.arc(leftStickX, leftStickY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw right stick
    const rightStickX = centerX + axes[2] * maxRadius;
    const rightStickY = centerY + axes[3] * maxRadius;
    ctx.beginPath();
    ctx.arc(rightStickX, rightStickY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

window.onload = init;
