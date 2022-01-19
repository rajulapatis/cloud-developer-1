import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as AWS from 'aws-sdk'


import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
       
    const url = getUploadUrl(todoId)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
      uploadUrl: url
      })
    }
    
  }
)

function getUploadUrl (todoId: String)
    {
      return s3.getSignedUrl('putObject',
                     {Bucket: bucketName,
                      Key: todoId,
                      Expires: urlExpiration})
    }

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
