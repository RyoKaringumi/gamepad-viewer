let gamepadContainer;
let noGamepadMessage;

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

    gamepadContainer.innerHTML = '';

    let gamepadConnected = false;

    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        gamepadConnected = true;

        const gamepadDiv = document.createElement('div');
        gamepadDiv.className = 'gamepad-info';
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

        gamepadContainer.appendChild(gamepadDiv);
    }

    if (!gamepadConnected) {
        noGamepadMessage.style.display = 'block';
    } else {
        noGamepadMessage.style.display = 'none';
    }

    requestAnimationFrame(update);
}

window.onload = init;
