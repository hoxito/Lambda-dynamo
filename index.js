const { v4: uuidv4 } = require('uuid');
var AWS = require('aws-sdk');

var  handler = async ({ path,pathParameters, httpMethod, body }) => {

    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });

    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });

let re = new RegExp('^/envios.*')
// codigo de la funcion
if (re.test(path)){
    console.log("entra")
    
switch (httpMethod) {
    case 'PUT':
        const idEntrega = (pathParameters || {}).idEntrega || false;
        if (idEntrega) {
        const updateParams = {
            TableName: 'Envio',
            Key: {
                id: idEntrega
            },
            UpdateExpression: 'REMOVE pendiente',
            ConditionExpression: 'attribute_exists(pendiente)'
        }

        try {
            await docClient.update(updateParams).promise()
            return {
                statusCode: 200,
                headers: { "content-type": "text/plain" },
                body: `${idEntrega} Entregado`
            };
        } catch {
            return {
                statusCode: 500,
                headers: { "content-type": "text/plain" },
                body: `No fue posible entregar el envio`
            };
        }
    }else{return {body:"no se encontro id"}}
    case 'GET':
      

        const params = {
            TableName: 'Envio',
            IndexName: 'EnviosPendientesIndex'
        };

        try {
            const envios = await docClient.scan(params).promise()
            return {
                statusCode: 200,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(envios)
            }
        } catch (err) {
            console.log(err)
            return {
                statusCode: 500,
                headers: { "content-type": "text/plain" },
                body: 'Error get envios'
            };
        }

    case 'POST':
        console.log("entra post")
        const createParams = {
            TableName: 'Envio',
            Item: {
                id: uuidv4(),
                fechaAlta: new Date().toISOString(),
                ...JSON.parse(body),
                pendiente: new Date().toISOString(),
            }
        }

        try {
            await docClient.put(createParams).promise()
            return {
                statusCode: 200,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(createParams.Item)
            };
        } catch {
            return {
                statusCode: 500,
                headers: { "content-type": "text/plain" },
                body: 'Error creando envio'
            };
        }
    case 'DELETE':
        console.log("entra delete")
        const id = (pathParameters || {}).idDelete || false;
        if (id) {            
            const deleteParams = {
                TableName: 'Envio',
                Key:{
                    "id": id,
                },
            }
    
            try {
                await docClient.delete(deleteParams).promise()
                return {
                    statusCode: 200,
                    headers: { "content-type": "application/json" },
                    body: `${id} Cancelado`
                };
            } catch {
                return {
                    statusCode: 500,
                    headers: { "content-type": "text/plain" },
                    body: 'Error eliminando envio'
                };
            }
            }else{return {body:"no se encontro id"}}
    default:
        return {
            statusCode: 501,
            headers: { "content-type": "text/plain" },
            body: `Lo sentimos, el metodo ${httpMethod} no esta soportado`
        };
}
}else{
    return{
        statusCode: 500,
        headers: {"content-type":"text/plain"},
        body:"Lo sentimos, este path es incorrecto"
    }
}
}

exports.handler = handler;