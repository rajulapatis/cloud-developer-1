import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { INSPECT_MAX_BYTES } from 'buffer'
const AWS = require('aws-sdk')
const uuid = require('uuid')
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const itemId = uuid.v4()

    const newItem = {
      todoId: itemId,
      createdAt: newTodo.createdAt,
      name: newTodo.name,
      dueDate: newTodo.dueDate,
      done: newTodo.done,
      attachmentUrl: newTodo.attachmentUrl,
      userId: getUserId
    }
    
    await docClient.put({
      TableName: todosTable,
      Item: newItem 
    }).promise()


     return {
       statusCode: 201,
      headers:{'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Credentials': true},
      body: JSON.stringify({
        item: newItem
      })} 
  }
)

handler.use(
  cors({
    credentials: true
  })
)
