const redis = require('redis');
const { promisify } = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const expirationTime = 3600;


async function getPostData(key){

    const getAsync = promisify(client.hget).bind(client);
    const data = await getAsync('post',key);
    return JSON.parse(data);
}

function setPostData(feild, key, data){
    client.hset(feild , key, JSON.stringify(data), function (err, response) {
        if (err) {
         console.log(err);
        }
    });
}

function deletePostData(feild, key){
    client.hdel(feild , key, function (err, response) {
        if (err) {
         console.log(err);
        }
    });
}

function setUserPostData(key,data){
    let feild = key+'user';
    client.hset( feild, JSON.stringify(data),'', function (err, response) {
        if (err) {
         console.log(err);
        }
    });
}

async function getUserPostData(key){
    let feild = key+'user';
    const getAsync = promisify(client.hgetall).bind(client);
    const data = await getAsync(feild);
    return data;
}




module.exports = { getPostData, setPostData, setUserPostData, getUserPostData, deletePostData };

