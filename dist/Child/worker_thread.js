"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
if (worker_threads_1.isMainThread) {
    // This code runs in the main thread
    console.log('Main thread starting...');
}
else {
    // This code runs in the worker thread
    console.log('Worker thread starting...');
    // Listen for messages from the main thread
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', message => {
        console.log('Message from main thread:', message);
        // Send a message back to the main thread
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage('Hello from worker thread!');
    });
}
