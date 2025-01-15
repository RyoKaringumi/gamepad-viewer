let canvas, ctx;

function init() {
    canvas = document.getElementById('gamepadCanvas');
    ctx = canvas.getContext('2d');
    window.addEventListener('gamepadconnected', onGamepadConnected);
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);
}

function onGamepadConnected(event) {
    console.log('Gamepad connected:', event.gamepad);
    update();
}

function onGamepadDisconnected(event) {
    console.log('Gamepad disconnected:', event.gamepad);
}

function update() {
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        ctx.fillText(`Gamepad ${gp.index}: ${gp.id}`, 10, 30 * (i + 1));
        for (let j = 0; j < gp.buttons.length; j++) {
            const button = gp.buttons[j];
            ctx.fillText(`Button ${j}: ${button.pressed}`, 10, 30 * (i + 1) + 20 * (j + 1));
        }
        for (let j = 0; j < gp.axes.length; j++) {
            const axis = gp.axes[j];
            ctx.fillText(`Axis ${j}: ${axis.toFixed(2)}`, 10, 30 * (i + 1) + 20 * (gp.buttons.length + j + 1));
        }
    }

    requestAnimationFrame(update);
}

window.onload = init;
