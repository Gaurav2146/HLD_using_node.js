import { SQS } from 'aws-sdk';
import { SES } from 'aws-sdk';
import { SNS } from 'aws-sdk';

// Initialize AWS SDK
const sqs = new SQS({ region: 'your-region' });
const ses = new SES({ region: 'your-region' });
const sns = new SNS({ region: 'your-region' });

// Lambda handler function
export const handler = async (event: any, context: any): Promise<any> => {
  try {
    // Process incoming messages
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);

      // Send email using Amazon SES
      const emailParams: SES.SendEmailRequest = {
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
      await ses.sendEmail(emailParams).promise();

      // Send SMS using Amazon SNS
      const smsParams: SNS.PublishInput = {
        Message: messageBody.message,
        PhoneNumber: messageBody.recipientPhoneNumber
      };
      await sns.publish(smsParams).promise();
    }

    return { statusCode: 200, body: 'Messages sent successfully' };
  } catch (error) {
    console.error('Error sending messages:', error);
    return { statusCode: 500, body: 'Error sending messages' };
  }
};