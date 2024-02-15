import { Worker, isMainThread, parentPort } from 'worker_threads';
import path from "path";

if (isMainThread) {
  // This code runs in the main thread

  console.log('Main thread starting...');

  let res_path = path.join(__dirname,"Child","worker_thread.js");

  // Create a new worker thread
  const worker = new Worker(res_path);

  // Listen for messages from the worker
  worker.on('message', message => {
    console.log('Message from worker:', message);
  });

  // Send a message to the worker
  worker.postMessage('Hello from main thread!');
}