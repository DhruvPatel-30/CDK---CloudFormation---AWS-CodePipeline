import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class CdkLabStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloFn = new lambda.Function(this, "HelloFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    const api = new apigwv2.HttpApi(this, "HttpApi");

    api.addRoutes({
      path: "/hello",
      methods: [apigwv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration("HelloIntegration", helloFn),
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.apiEndpoint + "/hello",
    });
  }
}
