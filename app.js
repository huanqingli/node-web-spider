/**
 * Created by Muc on 17/3/14.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');
var routes = require('./routes');

var app = express();

// mongoose
mongoose.Promise = Promise;
mongoose.connect(config.mongodb);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// 监听端口，启动程序
app.listen(config.port, function () {
    console.log(`listening on port ${config.port}`);
});

