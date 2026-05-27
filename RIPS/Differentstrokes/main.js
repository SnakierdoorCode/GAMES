const originalFetch = window.fetch;

function mergeFiles(fileParts) {
    return new Promise((resolve, reject) => {
        let buffers = [];

        function fetchPart(index) {
            if (index >= fileParts.length) {
                let totalLength = buffers.reduce((acc, b) => acc + b.byteLength, 0);
                let combinedArray = new Uint8Array(totalLength);
                let offset = 0;
                for (let b of buffers) {
                    combinedArray.set(new Uint8Array(b), offset);
                    offset += b.byteLength;
                }
                resolve(combinedArray.buffer);
                return;
            }
            originalFetch(fileParts[index]).then((response) => {
                if (!response.ok) throw new Error("Missing part: " + fileParts[index]);
                return response.arrayBuffer();
            }).then((data) => {
                buffers.push(data);
                fetchPart(index + 1);
            }).catch(reject);
        }
        fetchPart(0);
    });
}

function getParts(file, start, end) {
    let parts = [];
    for (let i = start; i <= end; i++) {
        parts.push(file + ".part" + i);
    }
    return parts;
}

const rootBuildPath = "Build/";

Promise.all([
    mergeFiles(getParts(rootBuildPath + "Build/DifferentStrokesWeb.data.unityweb", 1, 2)),
    mergeFiles(getParts(rootBuildPath + "Build/DifferentStrokesWeb.wasm.unityweb", 1, 3))
]).then(([dataBuffer, wasmBuffer]) => {
    window.fetch = async function (url, ...args) {
        let urlStr = typeof url === 'string' ? url : (url && url.url) || '';

        if (urlStr.endsWith("TreesHateYou_Web.data.br")) {
            return new Response(dataBuffer, {
                status: 200,
                statusText: "OK",
                headers: { "Content-Type": "application/octet-stream" }
            });
        } else if (urlStr.endsWith("TreesHateYou_Web.wasm.br") || urlStr.endsWith("build.wasm")) {
            return new Response(wasmBuffer, {
                status: 200,
                statusText: "OK",
                headers: { "Content-Type": "application/wasm" }
            });
        } else {
            return originalFetch(url, ...args);
        }
    };

    if (typeof window.unityRunFunction === "function") {
        window.unityRunFunction();
    }
}).catch(function(err) {
    console.error("Failed to pre-load game assets:", err);
});