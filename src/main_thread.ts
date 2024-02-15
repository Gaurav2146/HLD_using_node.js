import { Worker, isMainThread, parentPort } from 'worker_threads';
import path from "path";

if (isMainThread) {
  // This code runs in the main thread

  console.log('Main thread starting...');

  let res_path = path.join(__dirname,"Child","worker_thread.js");

  console.log("======================================================");
  console.log(__dirname,"directory name");
  console.log(__filename,"__file name");
  console.log(res_path,"res_path");
  console.log("======================================================");

  // Create a new worker thread
  const worker = new Worker(res_path);

  // Listen for messages from the worker
  worker.on('message', message => {
    console.log('Message from worker:', message);
  });

  // Send a message to the worker
  worker.postMessage('Hello from main thread!');
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