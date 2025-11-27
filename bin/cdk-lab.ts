#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { CdkLabStack } from "../lib/cdk-lab-stack";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();

// Lambda + API Gateway stack
new CdkLabStack(app, "CdkLabStack", {
  env: { account: "954847476805", region: "us-east-1" },
});

// CodePipeline stack
new PipelineStack(app, "PipelineStack", {
  githubConnectionArn: "arn:aws:codeconnections:us-east-2:954847476805:connection/f161276a-e4ba-4454-abca-367bcc294547",
  owner: "DhruvPatel-30",
  repo: "CDK---CloudFormation---AWS-CodePipeline",
  branch: "main",
  env: { account: "954847476805", region: "us-east-1" },
});
