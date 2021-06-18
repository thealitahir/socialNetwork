const redis = require('redis');

const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);
const expirationTime = 3600;

async function getData(key){
    client.get(key,async (err, data) => {
        result = await JSON.parse(data);
    });
    return result
}


function setData(key,data){
    client.setex(key, expirationTime, JSON.stringify(data));
}

module.exports = { setData, getData };

