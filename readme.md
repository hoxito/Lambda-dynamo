Instalacion:
1- clonar repositorio
2- ejecutar
```
npm install
```
3- Crear red local en docker
```
docker network create awslocal
```
4- Ejecutar el container de dynamodb
```
docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
```
5- en el shell ejecutar el codigo del archivo tabla envio.txt
```
http://localhost:8000/shell
```
6-en el proyecto luego de tener las dependencias instaladas ejecutar la api con:

```
sam local start-api --docker-network awslocal
```

7- realizar requests a la api

API REQUESTS:
