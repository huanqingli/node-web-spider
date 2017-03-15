/**
 * Created by Muc on 17/2/21.
 */
module.exports = {
    port: 3007,
    session: {
        secret: 'spider',
        key: 'spider',
        maxAge: null
    },
    mongodb: 'mongodb://localhost:27017/web_spider_practice',
    token:{
        exp:60*60,
        key:"secret"
    }
};