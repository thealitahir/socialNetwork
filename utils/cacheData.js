const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const expirationTime = 3600;

async function getData(key,req, res){

    const getAsync = promisify(client.get).bind(client);
    const data = await getAsync(key);
    return JSON.parse(data);
}


function setData(key,data){
    client.setex(key, expirationTime, JSON.stringify(data));
}

module.exports = { setData, getData };

