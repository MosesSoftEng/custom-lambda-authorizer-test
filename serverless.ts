import type {AWS} from '@serverless/typescript';


const serverlessConfiguration: AWS = {
	service: 'custom-authorization',
	frameworkVersion: '3',
	plugins: ['serverless-esbuild'],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
	},
	// import the function via paths
	functions: {
		auth: {
			handler: 'src/functions/auth.auth',
		},
		hello: {
			handler: 'src/functions/hello/handler.main',
			events: [
				{
					http: {
						method: 'get',
						path: 'hello',
						authorizer: {
							name: 'MyCustomAuthorizer',
							arn: 'arn:aws:lambda:us-east-1:137627469964:function:custom-authorization-dev-auth',
							resultTtlInSeconds: 300,
							identitySource: 'method.request.header.Authorization',
							type: 'request',
						},
					},
				},
			],
		}
	},
	package: {individually: true},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: {'require.resolve': undefined},
			platform: 'node',
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
