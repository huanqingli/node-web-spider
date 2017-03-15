/**
 * Created by Muc on 17/3/14.
 */
const request = require('request');
const express = require('express');
const router = express.Router();
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const config = require('../config');
const Ip = require('../models/ip');
const Sell = require('../models/sell');

router.get('/proxy',(req, res, next) => {
    function checkProxy(proxy) {
        return request({
            url: 'http://cd.lianjia.com/ershoufang/pg1ng1nb1l1/',
            proxy: "http://" + proxy['ip'] + ":" + proxy['port'],
            timeout: 5000,  //2s没有返回则视为代理不行
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/55.0.2883.9 Safari/537.3'
            }
        }, function (error, response, body) {
            if(!error) {
                if (response.statusCode == 200) {
                    console.log(response.request['proxy']['href'], "useful!");
                    Ip.create({proxyIp:response.request['proxy']['href']});
                } else {
                    console.log(response.request['proxy']['href'], "failed!");
                }
            }
        });
    }

    request({
        url:'http://www.xicidaili.com/nn/1',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/55.0.2883.9 Safari/537.3'
        } }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var trs = $("#ip_list tr");
            for(var i=1;i<trs.length;i++){
                var proxy = {};
                var tr = trs.eq(i);
                var tds = tr.children("td");
                proxy['ip'] = tds.eq(1).text();
                proxy['port'] = tds.eq(2).text();
                var speed = tds.eq(6).children("div").attr("title");
                speed = speed.substring(0, speed.length-1);
                var connectTime = tds.eq(7).children("div").attr("title");
                connectTime = connectTime.substring(0, connectTime.length-1);
                if(speed <= 5 && connectTime <= 1) { //用速度和连接时间筛选一轮
                    checkProxy(proxy);
                }
            }
        }
    })

});


const pageNum = 50;
router.get('/sell_price', (req, res, next) => {
    var allHouseInfo = async function (area) {
        var j=1 ;
        while(j<= pageNum){
            await new Promise(
                function (resolve, reject) {
                    request({
                        url:'http://chengdu.anjuke.com/sale/'+area+'/b54-p'+j,
                        // proxy: ips[Math.floor(Math.random()*ips.length)].proxyIp,
                        // timeout: 2000,
                        headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/55.0.2883.9 Safari/537.3'
                    } }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(body);
                            var lists = $('#houselist-mod li');
                            for(var i=0;i<lists.length;i++){
                                var info = {
                                    area:lists.eq(i).find('.details-item').children('span').eq(0).text().slice(0,-2),
                                    price:lists.eq(i).find('.details-item').children('span').eq(2).text().slice(0,-4),
                                    year:lists.eq(i).find('.details-item').children('span').eq(4).text().slice(0,4),
                                    garden:lists.eq(i).find('.details-item').eq(1).children('span').attr('title').split('[')[0].slice(0,-2)
                                };
                                Sell.create(info);
                                // console.log(info)
                            }
                            j+=1;
                            resolve()
                        } else{
                            console.log(error);
                            resolve()
                        }
                    })
                }
            )
        }
    };
    allHouseInfo("gaoxin");
    allHouseInfo("wuhou");
    allHouseInfo("qingyang");
    allHouseInfo("jinjiang");
    allHouseInfo("chenghua");
    allHouseInfo("jinniu");
    allHouseInfo("longquanyi");
});

module.exports = router;