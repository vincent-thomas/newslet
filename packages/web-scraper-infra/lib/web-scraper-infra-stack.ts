import { Stack, type StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import * as eventBridge from "aws-cdk-lib/aws-events";
import * as eventBridgeTargets from "aws-cdk-lib/aws-events-targets";
import { Code, Function as Lambda, Runtime } from "aws-cdk-lib/aws-lambda";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
export class WebScraperInfraStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const stack = Stack.of(this);

		const lambdaRole = new Role(
			this,
			`cdk-patterns-${stack.stackName}-lambda-execution-role`,
			{
				assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
				roleName: `cdk-patterns-${stack.stackName}-lambda-execution-role`,
				description:
					"Lambda function execution role that allows the function to write to CloudWatch",
				managedPolicies: [
					ManagedPolicy.fromManagedPolicyArn(
						this,
						"cloudwatch-full-access",
						"arn:aws:iam::aws:policy/CloudWatchFullAccess",
					),
				],
			},
		);

		const lambdaHandler = new Lambda(
			this,
			`cdk-patterns-${stack.stackName}-lambda-function`,
			{
				runtime: Runtime.NODEJS_18_X,
				code: Code.fromAssetImage("packages/web-scraper-v2"),
				handler: "index.handler",
				functionName: `cdk-patterns-${stack.stackName}-lambda-function`,
				role: lambdaRole,
			},
		);

		// UTC & 24hr syntax
		const CRON_EXPRESSION = {
			minute: "0",
			hour: "9",
		};

		const eventBridgeRule = new eventBridge.Rule(
			this,
			`cdk-patterns-${stack.stackName}-eventbridge-rule`,
			{
				ruleName: `cdk-patterns-${stack.stackName}-eventbridge-rule`,
				schedule: eventBridge.Schedule.cron(CRON_EXPRESSION),
				targets: [
					new eventBridgeTargets.LambdaFunction(lambdaHandler, {
						retryAttempts: 2, // Max number of retries for Lambda invocation
					}),
				],
			},
		);

		eventBridgeTargets.addLambdaPermission(eventBridgeRule, lambdaHandler);

		// const _bucket = new Bucket(this, "webscraper-formatted-articles", {
		// 	bucketName: formattedArticleBucket,
		// });
	}
}
