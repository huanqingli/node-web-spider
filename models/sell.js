/**
 * Created by Muc on 17/3/15.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sell = new Schema({
    area: String,
    price: String,
    garden: String,
    year: String,
});

module.exports=mongoose.model('sell_info', Sell);