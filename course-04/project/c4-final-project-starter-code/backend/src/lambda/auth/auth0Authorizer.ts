import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

//import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'

import { JwtPayload } from '../../auth/JwtPayload'

//import fetch from 'node-fetch'

//const fetch = require('node-fetch')

//const NodeRSA = require('node-rsa')

//const Crypto = require('crypto')


const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://dev-ccxcidoz.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  
  const token = getToken(authHeader)
  
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  
  // https://dev.to/kleeut/building-a-verify-jwt-function-in-typescript-e6d
  
  const [rawHead, rawBody, signature] = token.split(".")

  function decodeAndJsonParse<T>(base64: string): T {
    // Decode the JSON string from Base 64
    const json = new Buffer(base64, "base64").toString("ascii");
    // Return the parsed object
    return JSON.parse(json);
  }
  
  
  const parsedHead = decodeAndJsonParse<{ alg: string; kid: string }>(rawHead);

  if (parsedHead.alg !== "RS256") {
    console.log("The algoritham is not correct");
  }

  //type JWKS = {
  //  keys: JWK[]
  //}
  //type JWK = {
  //  alg: string;
  //  kty: string;
  //  use: string;
  //  n: string;
  //  e: string;
  //  kid: string;
  //  x5t: string;
  //  x5c: string[];
  //}
  
  // https://dev.to/kleeut/building-a-verify-jwt-function-in-typescript-e6d
  // https://www.npmjs.com/package/node-fetch
  
  //const jwksresponse = await fetch(jwksUrl)

  //const jwks: JWKS = await jwksresponse.json() as JWKS

  //const jwk = jwks.keys.find((key) => key.kid === parsedHead.kid)
  
  //  if (!jwk) {
  //    console.log("Key is not matched...")
  //  }

  //const key = new NodeRSA(
  //    {
  //      n: Buffer.from(jwk.n),
  //      e: Buffer.from(jwk.e),
  //    },
  //    "components-public"
  //  );
    // Export the key into the desired formats
  //const pem = key.exportKey("pkcs8-public-pem");
    
  //const verifyObject = Crypto.createVerify("RSA-SHA256");

    // Write the base64 encoded head the . character and the base64 encoded body to the stream.
  //  verifyObject.write(rawHead + "." + rawBody);
  // Close the stream
  //  verifyObject.end();

  //  const base64Signature = Buffer.from(signature, "base64").toString("base64");

  //  const signatureIsValid = verifyObject.verify(pem, base64Signature, "base64");

    

    //if (signatureIsValid) return signatureIsValid
    

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}