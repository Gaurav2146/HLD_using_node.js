import { Worker, isMainThread, parentPort } from 'worker_threads';

if (isMainThread) {
  // This code runs in the main thread

  console.log('Main thread starting...');

} else {
  // This code runs in the worker thread

  console.log('Worker thread starting...');

  // Listen for messages from the main thread
  parentPort?.on('message', message => {
    console.log('Message from main thread:', message);

    // Send a message back to the main thread
    parentPort?.postMessage('Hello from worker thread!');
  });
}