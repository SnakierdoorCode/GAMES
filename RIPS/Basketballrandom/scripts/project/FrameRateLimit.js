runOnStartup(async runtime => {
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

const baseValues60FPS = {
    divideSmooth_Hz: 1,
    angularOffset_Hz: 70,
    jumpPower_Hz: 85,
    jumpAddForce_Hz: 3300
};

var lastFrameTimeMs = 0;

function OnBeforeProjectStart(runtime) {
    var timestep = 1 / 60; // 60 Hz time step
    var accumulator = 0;

    requestAnimationFrame(function gameLoop(timestamp) {
        accumulator += (timestamp - lastFrameTimeMs) / 1000;
        while (accumulator > timestep) {
            accumulator -= timestep;
        }

        lastFrameTimeMs = timestamp;
        requestAnimationFrame(gameLoop);
    });

    runtime.addEventListener("tick", () => Tick(runtime));
}

function Tick(runtime) {
    // Code to run every tick
    getScreenRefreshRate(function (FPS) {
        runtime.globalVars.ScnRefreshRate = FPS;

        // Calculate adjusted values based on screen refresh rate
        const adjustedValues = calculateAdjustedValues(FPS);
		runtime.globalVars.divideSmooth_Hz = adjustedValues.divideSmooth_Hz;
		runtime.globalVars.angularOffset_Hz = adjustedValues.angularOffset_Hz;
		runtime.globalVars.jumpPower_Hz = adjustedValues.jumpPower_Hz;
		runtime.globalVars.jumpAddForce_Hz = adjustedValues.jumpAddForce_Hz;

        // Log the adjusted values for testing
        //console.log("Adjusted Values:", adjustedValues);
    });
}

function calculateAdjustedValues(currentFPS) {
    const baseFPS = 60; // Your base frame rate
    const ratio = currentFPS / baseFPS;

    return {
        divideSmooth_Hz: baseValues60FPS.divideSmooth_Hz - (ratio - 1) * 0.3, // Adjust the coefficient (0.3) based on the desired decrease
        angularOffset_Hz: baseValues60FPS.angularOffset_Hz,
        jumpPower_Hz: baseValues60FPS.jumpPower_Hz,
        jumpAddForce_Hz: Math.round(baseValues60FPS.jumpAddForce_Hz + (ratio - 1) * 9700) // Adjust the coefficient (9700) based on the desired increase
    };
}

function getScreenRefreshRate(callback, runIndefinitely) {
    let requestId = null;
    let callbackTriggered = false;
    runIndefinitely = runIndefinitely || false;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    }

    let DOMHighResTimeStampCollection = [];

    let triggerAnimation = function (DOMHighResTimeStamp) {
        DOMHighResTimeStampCollection.unshift(DOMHighResTimeStamp);

        if (DOMHighResTimeStampCollection.length > 10) {
            let t0 = DOMHighResTimeStampCollection.pop();
            let fps = Math.floor(1000 * 10 / (DOMHighResTimeStamp - t0));

            if (!callbackTriggered) {
                callback.call(undefined, fps, DOMHighResTimeStampCollection);
            }

            if (runIndefinitely) {
                callbackTriggered = false;
            } else {
                callbackTriggered = true;
            }
        }

        requestId = window.requestAnimationFrame(triggerAnimation);
    };

    window.requestAnimationFrame(triggerAnimation);

    // Stop after half second if it shouldn't run indefinitely
    if (!runIndefinitely) {
        window.setTimeout(function () {
            window.cancelAnimationFrame(requestId);
            requestId = null;
        }, 500);
    }
}