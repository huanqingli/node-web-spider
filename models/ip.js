/**
 * Created by Muc on 17/3/15.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ip = new Schema({
    proxyIp: String,
});

module.exports=mongoose.model('proxy_ip', Ip);