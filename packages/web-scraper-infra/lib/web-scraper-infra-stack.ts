import { formattedArticleBucket } from "@newslet/infra-consts";
import { Stack, type StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

export class WebScraperInfraStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const _bucket = new Bucket(this, "webscraper-formatted-articles", {
			bucketName: formattedArticleBucket,
		});
	}
}
