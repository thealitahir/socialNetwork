const redis = require('redis');
const { promisify } = require('util');
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const expirationTime = 3600;

async function getData(key,req, res){

    const getAsync = promisify(client.get).bind(client);
    const data = await getAsync(key);
    return JSON.parse(data);
}

function deleteData(key){
    client.del(key, function(err, response) {
        if (response == 1) {
           console.log("Deleted Successfully!")
        } else{
         console.log("Cannot delete")
        }
    });
}

function setData(key,data){
    client.setex(key, expirationTime, JSON.stringify(data));
}

module.exports = { setData, getData, deleteData };

