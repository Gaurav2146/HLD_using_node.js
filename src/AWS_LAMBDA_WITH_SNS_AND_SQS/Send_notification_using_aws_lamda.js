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
const aws_sdk_2 = require("aws-sdk");
const aws_sdk_3 = require("aws-sdk");
// Initialize AWS SDK
const sqs = new aws_sdk_1.SQS({ region: 'your-region' });
const ses = new aws_sdk_2.SES({ region: 'your-region' });
const sns = new aws_sdk_3.SNS({ region: 'your-region' });
// Lambda handler function
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Process incoming messages
        for (const record of event.Records) {
            const messageBody = JSON.parse(record.body);
            // Send email using Amazon SES
            const emailParams = {
                Destination: {
                    ToAddresses: [messageBody.recipientEmail]
                },
                Message: {
                    Body: {
                        Text: {
                            Data: messageBody.message
                        }
                    },
                    Subject: {
                        Data: messageBody.subject
                    }
                },
                Source: 'your-sender-email'
            };
            yield ses.sendEmail(emailParams).promise();
            // Send SMS using Amazon SNS
            const smsParams = {
                Message: messageBody.message,
                PhoneNumber: messageBody.recipientPhoneNumber
            };
            yield sns.publish(smsParams).promise();
        }
        return { statusCode: 200, body: 'Messages sent successfully' };
    }
    catch (error) {
        console.error('Error sending messages:', error);
        return { statusCode: 500, body: 'Error sending messages' };
    }
});
exports.handler = handler;
