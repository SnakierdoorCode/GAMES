const originalFetch = window.fetch;

// Grabs the clean raw.statically.io root path right out of the HTML head template
const baseElement = document.querySelector('base');
const cdnBaseUrl = baseElement ? baseElement.href : "";

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
            
            // Forces absolute HTTPS connection to the raw asset edge node
            const absoluteUrl = cdnBaseUrl + fileParts[index];

            originalFetch(absoluteUrl).then((response) => {
                if (!response.ok) throw new Error("Missing part: " + fileParts[index] + " (Status: " + response.status + ")");
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

// Executes background assembly on the raw.statically node
Promise.all([
    mergeFiles(getParts("notmyneighbor.pck", 1, 19)),
    mergeFiles(getParts("notmyneighbor.wasm", 1, 2))
]).then(([pckUrl, wasmUrl]) => {
    window.fetch = async function (url, ...args) {
        const urlString = typeof url === 'string' ? url : (url.url || "");

        if (urlString.endsWith("notmyneighbor.pck")) {
            return originalFetch(pckUrl, ...args);
        } else if (urlString.endsWith("notmyneighbor.wasm")) {
            return originalFetch(wasmUrl, ...args);
        } else {
            return originalFetch(url, ...args);
        }
    };
    
    if (typeof window.godotrunfunction === 'function') {
        window.godotrunfunction();
    }
}).catch((err) => {
    console.error("Assembly failed:", err);
});
