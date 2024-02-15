"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
let events = new events_1.EventEmitter();
const fun = (data) => {
    console.log(data + " is consoled inside function1");
};
const fun2 = (data) => {
    console.log(data + " is consoled inside function2");
};
events.on("Gaurav", fun);
events.on("Gaurav", (data) => {
    console.log(data, "data");
});
events.on("Gaurav", (data) => {
    console.log(data, "data");
});
events.on("Gaurav", (data) => {
    console.log(data, "data");
});
events.on("Gaurav", (data) => {
    console.log(data, "data");
});
events.emit("Gaurav", "Hello");
//Getting all event listeners
let listeners = events.listeners("Gaurav");
console.log(listeners, "listeners");
//removing single listener
events.removeListener("Gaurav", fun);
listeners = events.listeners("Gaurav");
console.log(listeners, "listeners");
//removing all event listeners
events.removeAllListeners("Gaurav");
listeners = events.listeners("Gaurav");
console.log(listeners, "listeners");
events.addListener("Gaurav", fun2);
events.emit("Gaurav", "Hello");
listeners = events.listeners("Gaurav");
console.log(listeners, "listeners");
