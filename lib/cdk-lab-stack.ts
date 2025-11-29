import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";

export class CdkLabStack extends cdk.Stack {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- S3 Bucket ---
    const myBucket = new s3.Bucket(this, "MyStudentBucket", {
      bucketName: `dhruv-${this.account}-cdk-bucket`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // --- DynamoDB Table ---
    const myTable = new dynamodb.Table(this, "MyDynamoDBTable", {
      tableName: "DhruvCdkTable",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // --- Lambda Function ---
    this.lambdaFunction = new lambda.Function(this, "HelloLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Test message for API!" })
          };
        };
      `),
      environment: {
        TABLE_NAME: myTable.tableName,
        BUCKET_NAME: myBucket.bucketName,
      },
    });

    // Permissions
    myTable.grantReadWriteData(this.lambdaFunction);
    myBucket.grantReadWrite(this.lambdaFunction);

    // API Gateway
    new apigateway.LambdaRestApi(this, "HelloApi", {
      handler: this.lambdaFunction,
      proxy: true,
    });
  }
}
