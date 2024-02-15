"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
if (worker_threads_1.isMainThread) {
    // This code runs in the main thread
    console.log('Main thread starting...');
    let res_path = path_1.default.join(__dirname, "Child", "worker_thread.js");
    // Create a new worker thread
    const worker = new worker_threads_1.Worker(res_path);
    // Listen for messages from the worker
    worker.on('message', message => {
        console.log('Message from worker:', message);
    });
    // Send a message to the worker
    worker.postMessage('Hello from main thread!');
}
