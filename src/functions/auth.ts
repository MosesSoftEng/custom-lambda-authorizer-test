import {APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from 'aws-lambda';

import {middyfy} from '@libs/lambda';

// TODO: Add function docs.
export const authFun = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	// TODO: Implement custom authorizer logic here
	const token = event.authorizationToken;
	const methodArn = event.methodArn;

	if(token === 'sample-token-here') {
		return {
			principalId: 'user',
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Deny',
						Resource: methodArn,
					},
				],
			},
		};
	}

	// Return an authorization response indicating whether the request is authorized
	return {
		principalId: 'user',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Allow',
					Resource: methodArn,
				},
			],
		},
	};
};

const auth = middyfy(authFun);
export {auth};
