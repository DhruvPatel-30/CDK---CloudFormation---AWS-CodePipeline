exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello This is my CDK Lambda for AWS CodePipeline!" }),
  };
};
