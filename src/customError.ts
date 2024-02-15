class CustomError extends Error{

    operationalError:boolean=false;
    status:"fail"|"error"="fail";

    constructor(message:string,statusCode:number)
    {
        super(message);
        if(statusCode > 500)
        {
            this.operationalError = true;
            this.status="error";
        }
        Error.captureStackTrace(this,this.constructor)
    }

}

console.log(new CustomError("Custom error",503));
console.log(new CustomError("Custom error",401));