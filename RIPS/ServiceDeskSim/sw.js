// sw.js
const CHUNKS = {
    'index.wasm': { total: 2, prefix: 'index.wasm.part' },
    'index.pck':  { total: 7, prefix: 'index.pck.part' }
};

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
    const url = event.request.url;
    const target = Object.keys(CHUNKS).find(key => url.endsWith(key));

    // If Godot asks for index.wasm or index.pck, hijack the request!
    if (target) {
        event.respondWith((async () => {
            try {
                const config = CHUNKS[target];
                const promises = [];
                
                // Fetch all pieces at the same time
                for (let i = 1; i <= config.total; i++) {
                    promises.push(fetch(`${config.prefix}${i}`).then(r => {
                        if (!r.ok) throw new Error(`Chunk ${config.prefix}${i} missing.`);
                        return r.arrayBuffer();
                    }));
                }
                
                const buffers = await Promise.all(promises);
                
                // Calculate total byte size to stitch cleanly
                const totalLength = buffers.reduce((acc, b) => acc + b.byteLength, 0);
                const combined = new Uint8Array(totalLength);
                
                let offset = 0;
                for (const b of buffers) {
                    combined.set(new Uint8Array(b), offset);
                    offset += b.byteLength;
                }

                const mime = target.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
                
                // Hand the stitched binary array back to Godot seamlessly
                return new Response(combined, {
                    headers: { 
                        'Content-Type': mime,
                        'Cross-Origin-Resource-Policy': 'cross-origin'
                    }
                });
            } catch (err) {
                return new Response("Failed to stitch chunks: " + err.message, { status: 500 });
            }
        })());
    }
});