import { CloudWatchEvents, Lambda } from 'aws-sdk';


const cloudwatchevents = new CloudWatchEvents();
const lambda = new Lambda();


export const handler = async (): Promise<void> => {
  try {
    // Create or update a rule to schedule the Lambda function
    const ruleName = 'MyCronJobRule';
    const functionName = 'MyCronJobFunction';


    const ruleParams: CloudWatchEvents.PutRuleRequest = {
      Name: ruleName,
      ScheduleExpression: 'cron(0 0 * * ? *)', // Run every day at  midnight UTC
                                                 
    };
    const ruleResult = await cloudwatchevents.putRule(ruleParams).promise();


    // Add the Lambda function as a target for the rule
    const addTargetParams: CloudWatchEvents.PutTargetsRequest = {
      Rule: ruleName,
      Targets: [
        {
          Arn: process.env.AWS_LAMBDA_FUNCTION_ARN || '', // Your Lambda function ARN
          Id: functionName,                                           
        },
      ],
    };
    await cloudwatchevents.putTargets(addTargetParams).promise();
    console.log(`Scheduled cron job "${functionName}" successfully.`);
  } catch (error) {
    console.error('Error scheduling cron job:', error);
    throw error;
  }
};
