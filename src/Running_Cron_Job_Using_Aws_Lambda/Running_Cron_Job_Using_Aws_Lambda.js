"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const cloudwatchevents = new aws_sdk_1.CloudWatchEvents();
const lambda = new aws_sdk_1.Lambda();
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create or update a rule to schedule the Lambda function
        const ruleName = 'MyCronJobRule';
        const functionName = 'MyCronJobFunction';
        const ruleParams = {
            Name: ruleName,
            ScheduleExpression: 'cron(0 0 * * ? *)', // Run every day at  midnight UTC
        };
        const ruleResult = yield cloudwatchevents.putRule(ruleParams).promise();
        // Add the Lambda function as a target for the rule
        const addTargetParams = {
            Rule: ruleName,
            Targets: [
                {
                    Arn: process.env.AWS_LAMBDA_FUNCTION_ARN || '', // Your Lambda function ARN
                    Id: functionName,
                },
            ],
        };
        yield cloudwatchevents.putTargets(addTargetParams).promise();
        console.log(`Scheduled cron job "${functionName}" successfully.`);
    }
    catch (error) {
        console.error('Error scheduling cron job:', error);
        throw error;
    }
});
exports.handler = handler;
