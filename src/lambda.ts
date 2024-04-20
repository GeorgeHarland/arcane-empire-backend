import serverless from 'aws-serverless-express';
import app from './app';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const server = serverless.createServer(app);

exports.handler = (event: APIGatewayProxyEvent, context: Context) => {
  console.log('Event path:', event.path);
  console.log('Event:', JSON.stringify(event, null, 2));

  // serverless.proxy(server, event, context);
  return serverless.proxy(server, event, context, 'PROMISE').promise;
};
