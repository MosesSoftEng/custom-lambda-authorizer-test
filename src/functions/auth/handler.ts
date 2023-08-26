import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";


/**
 * Custom token authorizer function for API Gateway.
 *
 * @param {APIGatewayTokenAuthorizerEvent} event - The event object from API Gateway
 * @returns {Promise<APIGatewayAuthorizerResult>} The authorization result
 */
export const auth = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	/**
	 * Extract the token from the Authorization header
	 * @type {string}
	 */
	const token = event.authorizationToken.split(" ")[1];

	/**
	 * The ARN of the requested resource
	 * @type {string}
	 */
	const methodArn = event.methodArn;

	/**
	 * Determine whether the request is allowed based on the token
	 * @type {boolean}
	 */
	const allow = token === "sample-token-here";

	/**
	 * The policy document for the authorization response
	 * @type {APIGatewayAuthorizerResult}
	 */
	const policyDocument: APIGatewayAuthorizerResult = {
		principalId: "user",
		policyDocument: {
			Version: "2012-10-17",
			Statement: [
				{
					Action: "execute-api:Invoke",
					Effect: allow ? "Allow" : "Deny",
					Resource: methodArn,
				},
			],
		},
	};

	return policyDocument;
};
