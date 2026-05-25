const originalFetch = window.fetch;

// Absolute jsDelivr CDN path where your files actually live
const cdnBaseUrl = "https://cdn.jsdelivr.net/gh/SnakierdoorCode/GAMES@main/Ports/Thats-not-my-neighbor/";

function mergeFiles(fileParts) {
    return new Promise((resolve, reject) => {
        let buffers = [];

        function fetchPart(index) {
            if (index >= fileParts.length) {
                let mergedBlob = new Blob(buffers);
                let mergedFileUrl = URL.createObjectURL(mergedBlob);
                resolve(mergedFileUrl);
                return;
            }
            
            // FIX: Forces the browser to load from jsDelivr, not the local host domain
            const absoluteUrl = cdnBaseUrl + fileParts[index];

            // Use originalFetch here so your background worker doesn't intercept itself
            originalFetch(absoluteUrl).then((response) => {
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

Promise.all([
    mergeFiles(getParts("thats-not-my-neighbor.pck", 1, 23)),
    mergeFiles(getParts("thats-not-my-neighbor.wasm", 1, 3))
]).then(([pckUrl, wasmUrl]) => {
    window.fetch = async function (url, ...args) {
        const urlString = typeof url === 'string' ? url : (url.url || "");

        if (urlString.endsWith("thats-not-my-neighbor.pck")) {
            return originalFetch(pckUrl, ...args);
        } else if (urlString.endsWith("thats-not-my-neighbor.wasm")) {
            return originalFetch(wasmUrl, ...args);
        } else {
            return originalFetch(url, ...args);
        }
    };
    window.godotrunfunction();
});
