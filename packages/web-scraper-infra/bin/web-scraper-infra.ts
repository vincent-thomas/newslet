#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebScraperInfraStack } from "../lib/web-scraper-infra-stack";

const app = new cdk.App();
new WebScraperInfraStack(app, "WebScraperInfraStack");
