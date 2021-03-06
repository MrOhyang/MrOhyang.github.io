$(function() {

var Animation = Laya.Animation;
var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
var SoundManager = Laya.SoundManager;
var Text = Laya.Text;
var Texture = Laya.Texture;
var TiledMap = Laya.TiledMap;
var Rectangle = Laya.Rectangle;
var Browser = Laya.Browser;
var Handler = Laya.Handler;
var Stat = Laya.Stat;
var WebGL = Laya.WebGL;

window.ohyang = this;

// 是否强制横屏
var isHorizontal = true,
    win_w = isHorizontal ? Browser.clientHeight : Browser.clientWidth,
    win_h = isHorizontal ? Browser.clientWidth : Browser.clientHeight;
win_w = (Browser.clientWidth > Browser.clientHeight) ? Browser.clientWidth : Browser.clientHeight;
win_h = (Browser.clientWidth > Browser.clientHeight) ? Browser.clientHeight : Browser.clientWidth;

var title_obj = {  // 首页头部变量
    'left_btn': {},     // 返回按钮
    'logo': {},         // logo
    'msg': {},          // 期号
    'number_posi': [],  // 号码的 x 位置
    'number': []        // 排名号码
};

var startNumber = {};  // 开场的数字变化

var startMap = {},   // 地图变量
    onMap = {},      // 中间地图
    endMap = {},     // 终点地图
    numberMap = {};  // 跑道尽头号码地标

var on_map_count = 0,     // 当前地图整页的数量
    on_map_allcount = 5;  // on_map 的数量

var car_list = [];  // 车辆变量

var mp3 = {
    bg: 'res/music/paoma_bg_edit.mp3',  // 背景音乐
    di: 'res/music/di.mp3',             // 滴
    start: 'res/music/start_edit.mp3',  // start 滴
    run: 'res/music/horse_run.mp3'      // 马蹄声
};

var loading = null;  // loading 层

var rankModal = {};  // 终点排名弹框

var game_controller = {
    'is_ready': false,      // 是否资源加载完毕
    'is_loadready': false,  // 是否数据加载完毕
    'is_run': false     // 是否正在跑
};

init();           // Laya 环境 初始化
loadResource();   // 资源预加载
createMap();      // 创建地图
// createCars();     // 创建车辆
loadData();       // 加载数据 = 创建车辆+title+bottom
createLoading();  // 创造一个 loading 层

// 点击屏幕开始比赛
// startRun();
// Laya.stage.on(Laya.Event.CLICK, this, startNumberRun);
// Laya.stage.on(Laya.Event.CLICK, this, startRun);

// Laya 环境 初始化
function init() {
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#2c3b40";
    // Laya.Stat.show();
}

// 预加载资源
function loadResource() {
    var res_list = null,
        base_src = 'images/',
        btn_src = base_src + 'btn/',
        car_src = base_src + 'car/',
        number_src = base_src + 'number/',
        road_src = base_src + 'road/',
        json_src = 'res/atlas/';

    res_list = [
        base_src + 'paoma_logo.png'  // logo
        ,btn_src + 'cqssc_back_btn.png'  // 左上角返回键
        ,btn_src + 'paoma_box.png'       // 按钮背景 
        ,road_src + 'bjsc_car_number.png'  // 道路 编号
        ,road_src + 'paoma_end.png'         // 道路 终点线
        ,road_src + 'paoma_road_on.png'     // 道路 过渡地图
        ,road_src + 'paoma_road_start.png'  // 道路 终点地图
        // ,json_src + 'paoma.json'  // 马匹
        // ,mp3.bg     // 背景音乐
        // ,mp3.di     // 滴
        // ,mp3.start  // start 滴
    ];
    for (var i = 0; i <= 3; i++) {
        // 加载开场的数字变化 动画
        res_list.push(base_src + 'threeSecoond_' + i + '.png');
    }
    for (var i = 0; i < 10; i++) {
        res_list.push(car_src + 'bjsc_car_' + (i + 1) + '.png');  // 加载车辆图片
        res_list.push(number_src + (i + 1) + '.png');  // 加载顶部 的 号码
        if (i < 9) {
            res_list.push(json_src + 'paoma_0' + (i + 1) + '_160x160/paoma_0' + (i + 1) + '_160x160.png');
        } else {
            res_list.push(json_src + 'paoma_10_160x160/paoma_10_160x160.png');
        }
    }

    // 声音资源
    for (var key in mp3) {
        res_list.push({url: mp3[key], type: 'sound'});
    }

    Laya.loader.load(res_list, Handler.create(this, function() {
        console.log('加载完毕');
        game_controller.is_ready = true;
        startNumberRun();
        Laya.stage.removeChild(loading);
    }));
}

// 开场的数字变化动画
function startNumberRun() {
    if (!game_controller.is_ready || !game_controller.is_loadready || game_controller.is_run) return ;
    game_controller.is_run = true;
    startNumber.ape = new Sprite();
    Laya.stage.addChild(startNumber.ape);
    for (var i = 3; i >= 0; i--) {
        ;(function(i) {
            window.setTimeout(function() {
                var img_src = 'images/threeSecoond_' + i + '.png';

                startNumber.ape.graphics.clear();
                startNumber.ape.loadImage(img_src, -491/2, -119/2, 491, 119);
                startNumber.ape.pos(win_w / 2, win_h / 2);
                if (i == 0) {
                    SoundManager.playSound(mp3.start, 1);
                    SoundManager.playSound(mp3.run, 0);
                } else {
                    SoundManager.playSound(mp3.di, 1);
                }
            }, (3 - i) * 1000);
        })(i);
    }
    SoundManager.playMusic(mp3.bg, 1);
    SoundManager.setMusicVolume(0.8, mp3.bg);
    window.setTimeout(function() {
        Laya.stage.removeChild(startNumber.ape);
        startRun();
    }, 4000);
}

// 绘制头部 title
function initTitle(res) {
    var left_btn = title_obj.left_btn,
        logo = title_obj.logo,
        msg = title_obj.msg
        number_posi = title_obj.number_posi,
        number = title_obj.number;

    // left_btn
    left_btn.w = left_btn.h = 0.09 * win_h;
    left_btn.ape = new Sprite().loadImage('images/btn/cqssc_back_btn.png', 0, 0, left_btn.w, left_btn.h);
    left_btn.ape.pos(8, 0.01 * win_h);
    Laya.stage.addChild(left_btn.ape);

    // logo
    logo.h = 0.046 * win_h;
    logo.w = logo.h * 216 / 48;
    logo.ape = new Sprite().loadImage('images/paoma_logo.png', 0, 0, logo.w, logo.h);
    logo.ape.pos(0.16 * win_h, 0.008 * win_h);
    Laya.stage.addChild(logo.ape);

    // msg
    msg = new Text();
    msg.x = 0.16 * win_h;
    msg.y = 0.058 * win_h;
    msg.fontSize = 14;
    msg.color = '#fff';
    msg.text = '本期：' + res.period;
    Laya.stage.addChild(msg);

    // number
    for (var i = 0; i < 10; i++) {
        var obj = {
            wh: 0.07 * win_h,
            y: 0.018 * win_h,
            ape: new Sprite()
        };
        var img_src = 'images/number/' + (i + 1) + '.png';

        number_posi.push(0.34 * win_w + 0.08 * win_h * i);
        obj.ape.loadImage(img_src, 0, 0, obj.wh, obj.wh);
        obj.ape.pos(number_posi[i], obj.y);
        number.push(obj);
        Laya.stage.addChild(obj.ape);
    }
}

// 绘制底部
function initBottom(res) {
    var btn = null,
        bg = null,
        shu = null,
        y = 0.875 * win_h,
        h = 0.11 * win_h;

    // ----

    btn = new Sprite();
    bg = new Sprite();
    shu = new Sprite();
    bg.loadImage('images/btn/paoma_box.png', 0, 0, 0.35 * win_w, h);
    shu.graphics.drawRect(0.204 * win_w, 0.53 * h, 2, 0.39 * h, '#905432');
    btn.addChild(bg);
    btn.addChild(shu);

    addP(btn, '时间/期数', 0.35 * win_w);
    addP2(btn, res.time, 0, 0.2 * win_w);
    addP2(btn, res.period, 0.21 * win_w, 0.14 * win_w);

    btn.pos(0.015 * win_w, y);
    Laya.stage.addChild(btn);

    // ----

    btn = new Sprite();
    bg = new Sprite();
    shu = new Sprite();
    bg.loadImage('images/btn/paoma_box.png', 0, 0, 0.20 * win_w, h);
    shu.graphics.drawRect(0.063 * win_w, 0.53 * h, 2, 0.39 * h, '#905432');
    shu.graphics.drawRect(0.133 * win_w, 0.53 * h, 2, 0.39 * h, '#905432');
    btn.addChild(bg);
    btn.addChild(shu);

    addP(btn, '冠亚军和', 0.20 * win_w);
    addP2(btn, res.gysum[0], 0, 0.06 * win_w);
    addP2(btn, res.gysum[1], 0.07 * win_w, 0.06 * win_w);
    addP2(btn, res.gysum[2], 0.14 * win_w, 0.06 * win_w);

    btn.pos(0.390 * win_w, y);
    Laya.stage.addChild(btn);

    // ----

    btn = new Sprite();
    bg = new Sprite();
    shu = new Sprite();
    bg.loadImage('images/btn/paoma_box.png', 0, 0, 0.35 * win_w, h);
    for (var i = 0; i < 4; i++) {
        shu.graphics.drawRect((0.065 + 0.071 * i) * win_w, 0.53 * h, 2, 0.39 * h, '#905432');
    }
    btn.addChild(bg);
    btn.addChild(shu);

    addP(btn, '1~5 龙虎', 0.35 * win_w);
    for (var i = 0; i < 5; i++) {
        addP2(btn, res.longhu[i], 0.071 * i * win_w, 0.062 * win_w);
    }

    btn.pos(0.615 * win_w, y);
    Laya.stage.addChild(btn);

    // ----

    // 添加黑色标题
    function addP(btn, text, w) {
        var p = new Text();

        p.width = w;
        p.align = 'center';
        p.y = 0.01 * win_h;
        p.fontSize = 14;
        p.text = text;
        btn.addChild(p);
    }

    // 添加白色文字
    function addP2(btn, text, x, w, h) {
        var p2 = new Text();

        p2.x = x;
        p2.width = w;
        p2.y = 0.06 * win_h;
        p2.fontSize = 13;
        p2.align = 'center';
        // p2.bgColor = '#69F';
        p2.text = text;
        p2.color = '#fff';
        btn.addChild(p2);
    }
}

// 创建地图
function createMap() {
    // 加载地图
    startMap.x = onMap.x = 0;
    startMap.y = onMap.y = 0.11 * win_h;
    startMap.w = onMap.w = win_w;
    // startMap.h = onMap.h = win_w * 845 / 2001;  // 未拉伸
    startMap.h = onMap.h = 0.75 * win_h;        // 拉伸
    startMap.speed = onMap.speed = endMap.speed = win_w * 0.004;

    endMap._x = 0.129 * win_w;
    endMap.x = endMap._x + win_w;
    endMap.y = 0.257 * win_h;
    endMap.h = 0.597 * win_h;
    endMap.w = endMap.h * 65 / 451;
    endMap.speed = 0;

    numberMap.h = 0.570 * win_h;
    numberMap.w = numberMap.h * 47 / 603;
    numberMap.x = win_w - numberMap.w - 6;
    numberMap.y = 0.275 * win_h;

    startMap.ape = new Sprite();
    onMap.ape = new Sprite();
    endMap.ape = new Sprite();
    numberMap.ape = new Sprite();
    startMap.ape.loadImage('images/road/paoma_road_start.png', 0, 0, startMap.w, startMap.h);
    startMap.ape.pos(startMap.x, startMap.y);
    onMap.ape.loadImage('images/road/paoma_road_on.png', 0, 0, onMap.w, onMap.h);
    onMap.ape.loadImage('images/road/paoma_road_on.png', 0 + win_w, 0, onMap.w, onMap.h);
    onMap.ape.pos(onMap.x, onMap.y);
    endMap.ape.loadImage('images/road/paoma_end.png', 0, 0, endMap.w, endMap.h);
    endMap.ape.pos(endMap.x, endMap.y);
    numberMap.ape.loadImage('images/road/bjsc_car_number.png', 0, 0, numberMap.w, numberMap.h);
    numberMap.ape.pos(numberMap.x, numberMap.y);
    Laya.stage.addChild(onMap.ape);
    Laya.stage.addChild(startMap.ape);
    Laya.stage.addChild(endMap.ape);
    Laya.stage.addChild(numberMap.ape);
}

// 车辆 初始化
function createCars(result) {
    // var number_list = [3, 2, 1, 6, 5, 4, 9, 8, 7, 10];
    // var number_list = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    number_list = result;

    for (var i = 0; i < 10; i++) {
        var obj = {
            s: [],      // 行驶的距离 分段
            _x: -0.05 * win_w,  // 原始 x 坐标
            x: -0.05 * win_w,   // 当前 x 坐标
            his_x: [],  // 历史 x 坐标
            zhen: 0,    // 历史坐标索引
            y: 0,       // 当前 y 坐标
            speed: [],  // 速度分段
            ape: new Animation()
        };

        var temp_s = 0,      // 当前需要跑的距离
            all_temp_s = 0;  // 累计

        // 这里需要跟 on_map_allcount 数量对应上

        // 开头 1 段
        temp_s = 0.05 + 1 + 0.15 + Math.random() * (0.4 - 0.13);
        obj.s.push(temp_s);
        all_temp_s += temp_s;
        // 中间 n 段
        for (var j = 2; j <= (on_map_allcount - 1); j++) {
            temp_s = j - all_temp_s + 0.1 + Math.random() * (0.5 - 0.1);
            obj.s.push(temp_s);
            all_temp_s += temp_s;
        }
        // 结尾 1 段
        temp_s = on_map_allcount - all_temp_s + 0.25 + Math.random() * (0.6 - 0.2);
        obj.s.push(temp_s);
        all_temp_s += temp_s;

        for (var j = 0; j < on_map_allcount; j++) {
            obj.speed.push((obj.s[j] / 250 - 0.004) * win_w);
        }

        obj.w = win_w * 0.09;
        obj.h = obj.w;
        obj.is_finish = false;

        // 方法2
        var temp_x = obj.x;
            temp_end_x = endMap.x;

        obj.his_x.push(temp_x);
        for (var j = 0; j < (on_map_allcount - 1); j++) {
            for (var k = 0; k < 250; k++) {
                temp_x += obj.speed[j];
                obj.his_x.push(temp_x);
            }
        }
        for (var j = 0; j < 250; j++) {
            temp_x += obj.speed[on_map_allcount - 1];
            obj.his_x.push(temp_x);
            temp_end_x -= (0.004 * win_w);
            if (temp_x + obj.w >= temp_end_x) {
                obj.time = -temp_x;
                break;
            }
        }

        car_list.push(obj);
    }
    car_list.sort(function(a, b) {
        return a.time - b.time;
    });
    number_list.forEach(function(number, i) {
        car_list[i].number = number - 1;
    });
    car_list.sort(function(a, b) {
        return a.number - b.number;
    });
    car_list.forEach(function(car, i) {
        var img_src = 'images/car/bjsc_car_' + (car.number + 1) + '.png';

        car.y = startMap.y + win_h * 0.19 + car.number * win_h * 0.060 - car.h;

        if (i < 9) {
            car.ape.loadAtlas('res/atlas/paoma_0' + (i + 1) + '_160x160/paoma_0' + (i + 1) + '_160x160.json');
        } else {
            car.ape.loadAtlas('res/atlas/paoma_10_160x160/paoma_10_160x160.json');
        }
        car.ape.interval = 30;
        car.ape.index = 0;
        car.ape.pos(car.x, car.y);
        car.ape.scale(0.09 * win_w / 160, 0.09 * win_w / 160);
        Laya.stage.addChild(car.ape);
    });
}

// 获取数据
function loadData() {
    var res =  {
        "period": 20170426284,
        "time": "2017-04-26 22:12:00",
        "result": ["1", "7", "5", "2", "9", "6", "4", "3", "10", "8"],
        "gysum": [8, "小", "双"],
        "longhu": ["虎", "虎", "龙", "虎", "龙"]
    };

    // $.ajax({
    //     url: '/pc.php?c=pc_common&a=getPmResult',
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function(res) {
            createCars(res.result);
            initTitle(res);   // 绘制头部 title
            initBottom(res);  // 绘制底部
            game_controller.is_loadready = true;
            startNumberRun();
    //     }
    // });
}

// 创建一个 loading 层
function createLoading() {
    loading = new Sprite();
    loading.graphics.alpha(0.4);
    loading.graphics.drawRect(0, 0, win_w, win_h, '#fff');
    loading.graphics.restore();
    loading.graphics.save();
    Laya.stage.addChild(loading);
}

// 开始
function startRun() {
    car_list.forEach(function(car) {
        car.ape.play();
    });
    Laya.timer.frameLoop(1, this, carRun);       // 车辆动画
    Laya.timer.frameLoop(1, this, startMapRun);  // 起点地图动画
    Laya.timer.frameLoop(1, this, onMapRun);     // 中间地图循环动画
    Laya.timer.frameLoop(1, this, endMapRun);    // 终点地图动画
    Laya.timer.loop(500, this, sortCarRank);     // 排名号码
}

// 起点地图动画
function startMapRun() {
    startMap.x -= startMap.speed;
    startMap.ape.pos(startMap.x, startMap.y);
    if (startMap.x <= -win_w) {
        // Laya.stage.removeChild(startMap.ape);
        startMap.ape.visible = false;
        Laya.timer.clear(this, startMapRun);
    }
}

// 中间地图循环动画
function onMapRun() {
    onMap.x -= onMap.speed;
    if (onMap.x <= -win_w) {
        console.log('第' + ++on_map_count + '屏结束');
        if (on_map_count == (on_map_allcount - 1)) {
            endMap.speed = 0.004 * win_w;
            // Laya.timer.frameLoop(1, this, endMapRun);
        }
        if (on_map_count == on_map_allcount) {
            console.log('---------');
            car_list.forEach(function(car) {
                console.log(car.number, car.x, car.time);
                car.ape.stop();
                // car.ape.index = 0;
            });
            Laya.timer.clear(this, onMapRun);
            Laya.timer.clear(this, carRun);
            Laya.timer.clear(this, sortCarRank);
            musicFadeOut(0.8, mp3.bg);    // 背景音乐渐渐消失
            SoundManager.stopAllSound();  // 停止所有音效
            window.setTimeout(function() {
                showRankModal();  // 到达终点的时候弹框显示排名
            }, 1200);
            errorReport();    // 错误判断与收集
        }
        onMap.x += win_w;
    }
    onMap.ape.pos(onMap.x, onMap.y);
}

// 终点地图动画
function endMapRun() {
    endMap.x -= endMap.speed;
    if (endMap.x <= endMap._x) Laya.timer.clear(this, endMapRun);
    endMap.ape.pos(endMap.x, endMap.y);
}

// 车辆动画
function carRun() {
    car_list.forEach(function(car) {
        if (!car.his_x[car.zhen]) return ;
        car.x = car.his_x[car.zhen++];
        car.ape.pos(car.x, car.y);
        if (car.x + car.w > endMap.x) {
            // console.log('dayu');  // 可用于断点调试
        }
    });
}

// 排名号码
function sortCarRank() {
    var car_list_temp = null,
        number_posi = title_obj.number_posi,
        number = title_obj.number;

    car_list.sort(function(a, b) {
        return b.x - a.x;
    });
    car_list_temp = car_list.filter(function(car) {
        return !car.is_finish;
    });
    car_list_temp.forEach(function(car, i) {
        number[car.number].ape.pos(number_posi[10 - car_list_temp.length + i], number[0].y);
    });
}

// showRankModal();
// 到达终点的时候弹框显示排名
function showRankModal() {
    var w = (1 - 0.16 * 2) * win_w,
        h = (1 - 0.19 * 2) * win_h,
        w2 = 0,
        h2 = 0,
        path = newPath(w, h, 10),
        rank_list = null;

    // 绘制半透明白色 背景
    rankModal.bg = new Sprite();
    rankModal.bg.width = win_w;
    rankModal.bg.height = win_h;
    rankModal.bg.graphics.alpha(0.4);
    rankModal.bg.graphics.drawRect(0, 0, win_w, win_h, '#fff');
    rankModal.bg.graphics.restore();
    rankModal.bg.graphics.save();

    // 绘制 白色 圆角矩形
    rankModal.bg.graphics.alpha(1);
    rankModal.bg.graphics.drawPath(0.16 * win_w, 0.19 * win_h, path, {'fillStyle': '#FFFFFF'});
    rankModal.bg.graphics.restore();
    rankModal.bg.graphics.save();
    Laya.stage.addChild(rankModal.bg);

    // 绘制 返回按钮
    rankModal.btn_back = {
        ape: new Sprite(),
        w: 0.2 * win_w,
        h: 0.1 * win_h,
        text: new Text()
    };
    rankModal.btn_back.path = newPath(rankModal.btn_back.w, rankModal.btn_back.h, 6);
    rankModal.btn_back.ape.width = rankModal.btn_back.w;
    rankModal.btn_back.ape.height = rankModal.btn_back.h;
    rankModal.btn_back.ape.graphics.drawPath(0, 0, rankModal.btn_back.path, {'fillStyle': '#c3c3c1'});
    rankModal.btn_back.ape.graphics.restore();
    rankModal.btn_back.ape.graphics.save();
    rankModal.btn_back.text.width = rankModal.btn_back.w;
    rankModal.btn_back.text.height = rankModal.btn_back.h;
    rankModal.btn_back.text.fontSize = 16;
    rankModal.btn_back.text.text = '返回';
    rankModal.btn_back.text.align = 'center';
    rankModal.btn_back.text.valign = 'middle';
    rankModal.btn_back.ape.pos((0.5 - 0.15) * win_w - 0.5 * rankModal.btn_back.w, 0.72 * win_h - 0.5 * rankModal.btn_back.h);
    rankModal.btn_back.ape.addChild(rankModal.btn_back.text);
    Laya.stage.addChild(rankModal.btn_back.ape);

    // 绘制 重新看一遍
    rankModal.btn_replay = {
        ape: new Sprite(),
        w: 0.2 * win_w,
        h: 0.1 * win_h,
        text: new Text()
    };
    rankModal.btn_replay.path = newPath(rankModal.btn_replay.w, rankModal.btn_replay.h, 6);
    rankModal.btn_replay.ape.width = rankModal.btn_replay.w;
    rankModal.btn_replay.ape.height = rankModal.btn_replay.h;
    rankModal.btn_replay.ape.graphics.drawPath(0, 0, rankModal.btn_replay.path, {'fillStyle': '#9fd6db'});
    rankModal.btn_replay.ape.graphics.restore();
    rankModal.btn_replay.ape.graphics.save();
    rankModal.btn_replay.text.width = rankModal.btn_replay.w;
    rankModal.btn_replay.text.height = rankModal.btn_replay.h;
    rankModal.btn_replay.text.fontSize = 16;
    rankModal.btn_replay.text.text = '再看一遍';
    rankModal.btn_replay.text.align = 'center';
    rankModal.btn_replay.text.valign = 'middle';
    rankModal.btn_replay.ape.pos((0.5 + 0.15) * win_w - 0.5 * rankModal.btn_replay.w, 0.72 * win_h - 0.5 * rankModal.btn_replay.h);
    rankModal.btn_replay.ape.addChild(rankModal.btn_replay.text);
    Laya.stage.addChild(rankModal.btn_replay.ape);

    // 生成 需要绘制的车辆
    rank_list = car_list.map(function(car) {
        return {
            number: car.number,
            num_str: (car.number >= 9) ? '10' : '0' + (car.number + 1),
            x: Math.abs(car.time)
        };
    }).sort(function(a, b) {
        return b.x - a.x;
    });

    // 绘制车辆 与 号码
    w = 0.17 * win_w;
    h = w;
    w2 = w;
    h2 = w * 56 / 272;
    rankModal.car = [];
    for (var i = 0; i < 3; i++) {
        rankModal.car.push(new Sprite);
        rankModal.car[i].loadImage('images/car/horse_wing_' + rank_list[i].num_str + '.png', -0.5 * w, -0.5 * h, w, h);
        rankModal.car[i].loadImage('images/number/result_' + (i + 1) + '.png', -0.5 * w2, -2.5 * h2, w2, h2);
        Laya.stage.addChild(rankModal.car[i]);
    }
    rankModal.car[0].pos(win_w * 0.5, win_h * (0.45 - 0.035));
    rankModal.car[1].pos(win_w * (0.5 - 0.2), win_h * 0.45);
    rankModal.car[2].pos(win_w * (0.5 + 0.2), win_h * (0.45 + 0.035));

    // 事件绑定
    rankModal.bg.on(Laya.Event.CLICK, this, function(e) {
        e.stopPropagation();
    });
    rankModal.btn_back.ape.once('click', this, function() {
        window.history.go(-1);
    });
    rankModal.btn_replay.ape.once(Laya.Event.CLICK, this, function(e) {
        // remove 掉自己的弹层
        Laya.stage.removeChild(rankModal.bg);
        Laya.stage.removeChild(rankModal.btn_back.ape);
        Laya.stage.removeChild(rankModal.btn_replay.ape);
        for (var i = 0; i < 3; i++) {
            Laya.stage.removeChild(rankModal.car[i]);
        }

        on_map_count = 0;
        game_controller.is_run = false;

        car_list.forEach(function(car) {
            car.x = car._x;
            car.zhen = 0;
            car.ape.pos(car.x, car.y);
            car.ape.index = 0;
        });
        number.forEach(function(number, index) {
            number.ape.pos(number_posi[index], number.y);
        });

        startMap.x = onMap.x = 0;
        endMap.x = endMap._x + win_w;
        endMap.speed = 0;
        startMap.ape.pos(startMap.x, startMap.y);
        startMap.ape.visible = true;
        onMap.ape.pos(onMap.x, onMap.y);
        endMap.ape.pos(endMap.x, endMap.y);

        startNumberRun();
    });
}

// 错误收集
function errorReport() {
    var err_num = 0;

    car_list.forEach(function(car) {
        if (-car.x != car.time) {
            err_num++;
        }
    });

    err_data = localStorage.getItem('err_data');
    if (!err_data) {
        err_data = {
            'run_count': 0,
            'err_count': 0,
            'rank_err_count': 0,
            'rank_err_arr': [],
            'data': {}
        };
    } else {
        err_data = JSON.parse(err_data);
    }
    err_data.run_count++;
    if (err_num > 0) {
        err_data.err_count++;
        if (!err_data.data['' + err_num]) {
            err_data.data['' + err_num] = 1;
        } else {
            err_data.data['' + err_num]++;
        }
    }
    for (var i = 0; i < car_list.length; i++) {
        if (car_list[i].number != i) {
            err_data.rank_err_count++;
            var str = [];

            car_list.forEach(function(car) {
                str.push(car.number);
            });
            err_data.rank_err_arr.push(str.join(','));
            break;
        }
    }
    localStorage.setItem('err_data', JSON.stringify(err_data));
    // if (err_data.run_count < 100) {
    //     errReload();
    // }
}

// 重新加载页面
function errReload() {
    window.setTimeout(function() {
        window.location.reload();
    }, 200);
}

// --------------------- 以下是一些工具函数 ---------------------

function newPath(w, h, r) {
    return [
        ['moveTo', 0, 0, 0, 0, r],
        ['arcTo', w, 0, w, 1, r],
        ['arcTo', w, h, w - 1, h, r],
        ['arcTo', 0, h, 0, h - 1, r],
        ['arcTo', 0, 0, 1, 0, r]
    ];
}

// reFontSize 根据屏幕宽度重新定义文字大小
function reFS() {
    // body...
}

// 音乐渐渐消失
function musicFadeOut(number, src) {
    if (number >= 0.1) {
        SoundManager.setMusicVolume(number - 0.1, src);
        ;(function(number) {
            window.setTimeout(function() {
                musicFadeOut(number, src);
            }, 200);
        })(number - 0.1);
    } else {
        SoundManager.stopMusic();
    }
}

});










