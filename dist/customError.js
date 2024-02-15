"use strict";
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.operationalError = false;
        this.status = "fail";
        if (statusCode > 500) {
            this.operationalError = true;
            this.status = "error";
        }
        Error.captureStackTrace(this, this.constructor);
    }
}
console.log(new CustomError("Custom error", 503));
console.log(new CustomError("Custom error", 401));
