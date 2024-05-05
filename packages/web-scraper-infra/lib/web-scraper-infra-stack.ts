import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class WebScraperInfraStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const bucket = new Bucket(this, "webscraper-formatted-articles");

		// const queue = new sqs.Queue(this, "WebScraperInfraQueue", {
		// 	visibilityTimeout: Duration.seconds(300),
		// });

		// const topic = new sns.Topic(this, "WebScraperInfraTopic");

		// topic.addSubscription(new subs.SqsSubscription(queue));
	}
}
