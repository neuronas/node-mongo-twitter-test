## Node Mongo Twitter test

al ejecutar el servidor recopila twits con el texto "javascript" y los almacena en base de datos,
además expone un metodo GET "filter"

ejemplo de búsqueda por hastag "nodejs":

`/filter?hashtag=nodejs&limit=10&pageNumber=1`

todos los resultados (maximo 100 por pagina):

`/filter?limit=10&pageNumber=1`

todos los parametros que acepta:

`/filter?userName=dailyJsPackages&userMention=RobertCooper_RC&hashtag=nodejs&limit=10&pageNumber=1`


---

>**Requiere:**
>* node >= 7.10
>* [Docker](https://www.docker.com/community-edition) (para persistencia de datos con mongoDB)

### Api

la api es un servidor NODE con Express que acepta metodos REST,
se utilizaron las siguientes librerias:

* [Mongo DB](http://mongodb.github.io/node-mongodb-native) (mongo para node)
* [Mongoose](https://github.com/Automattic/mongoose) (ORM)
* [twit](https://github.com/ttezel/twit) (para consumir la api de twitter)



**instalar dependencias**

desde el directorio raíz ejecutar:
```bash
$ npm install --save
```

### Iniciar servidor MongoDB con Docker
( omitir este paso si ya se tiene un servidor mongoDB y configurar el acceso al mismo en el siguiente paso )
* [Docker / Mongo](https://hub.docker.com/_/mongo/)


**descarga imagen Docker y corre el servidor mongoDB (mongod) en un Container**
```bash
docker run --name some-mongo -d mongo
```
**re-run exited container**
( para volver a correr el mismo container después de cerrarlo y no perder los datos guardados)
```bash
docker start -a -i `docker ps -q -l`
```
**conectar mongo shell**
( abre un Container bash con mongo shell y se conecta al Container mongoDB que esta corriendo )
en una consola separada ejecutar:
```bash
docker run -it --link some-mongo:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT"'
```


### Configurar servidor API


**configurar access tokens twitter**

el metodo de autenticación con la api de twitter es "user context" (no application context)

primero, [crear aplicacion twitter ](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens),

una vez creada la aplicación copiar el consumer key/secret y el token key/secret
* [https://apps.twitter.com](https://apps.twitter.com/) (pestaña "Keys and Access Tokens")

crear un archivo .env en el directorio raíz con las siguientes variables de ambiente y sus respectivos valores:

```js
PORT=4000

TWITTER_CONSUMER_KEY="Consumer Key"
TWITTER_CONSUMER_SECRET="Consumer Secret"
TWITTER_ACCESS_TOKEN_KEY="Access Key"
TWITTER_ACCESS_TOKEN_SECRET="Access Secret"


DB_HOST=mongodb://172.17.0.2
DB_PORT=27017
DB_NAME=twitsdb
```

**iniciar el servidor**

desde el directorio raíz ejecutar:
```bash
$ node index.js
```

se accede al recurso por:

http://localhost:4000
