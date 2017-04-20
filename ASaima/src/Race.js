var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
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

var on_map_count = 0;  // 地图整页的数量

var car_list = [];  // 车辆变量

var rankModal = {};  // 终点排名弹框

var game_controller = {
    is_run: false  // 是否正在跑
};

/*

// 加载
function loadResource() {
    var imgsrc_list = [],
        base_src = 'images/',
        btn_src = base_src + 'btn/',
        number_src = base_src + 'number/';

    for (var i = 0; i < 3; i++) {
        // 加载开场的数字变化 动画
        imgsrc_list.push(base_src + 'threeSecoond_' + (i + 1) + '.png');
    }
    for (var i = 0; i < 10; i++) {
        // 加载顶部 的 号码
        imgsrc_list.push(number_src + 'bjsc_card_' + (i + 1) + '.png');
    }
    imgsrc_list.push(btn_src + 'cqssc_back_btn.png');  // 左上角返回键
    imgsrc_list.push(btn_src + 'bjsc_logo.png');  // logo
    imgsrc_list.push(btn_src + 'bjsc_box.png');  // 按钮背景
}

// Laya 环境 初始化
function init() {
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#fff";
}

Laya.loader.load(
    ['images/threeSecoond_1.png'],
    Handler.create(this, printFinished)
);

*/

init();        // Laya 环境 初始化
initTitle();   // 绘制头部 title
initBottom();  // 绘制底部
createMap();   // 创建地图
createCars();  // 创建车辆

// 点击屏幕开始比赛
// Laya.stage.once(Laya.Event.CLICK, this, startRun);
// startRun();
Laya.stage.on(Laya.Event.CLICK, this, startNumberRun);

// Laya 环境 初始化
function init() {
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#dbd030";
}

// 开场的数字变化动画
function startNumberRun() {
    if (game_controller.is_run) return ;
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
            }, (3 - i) * 1000);
        })(i);
    }
    window.setTimeout(function() {
        Laya.stage.removeChild(startNumber.ape);
        startRun();
    }, 4000);
}

// 绘制头部 title
function initTitle() {
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
    logo.ape = new Sprite().loadImage('images/bjsc_logo.png', 0, 0, logo.w, logo.h);
    logo.ape.pos(0.16 * win_h, 0.008 * win_h);
    Laya.stage.addChild(logo.ape);

    // msg
    msg = new Text();
    msg.x = 0.16 * win_h;
    msg.y = 0.058 * win_h;
    msg.fontSize = 14;
    msg.color = '#000';
    msg.text = '本期：612751';
    Laya.stage.addChild(msg);

    // number
    for (var i = 0; i < 10; i++) {
        var obj = {
            wh: 0.07 * win_h,
            y: 0.018 * win_h,
            ape: new Sprite()
        };
        var img_src = 'images/number/bjsc_card_' + (i + 1) + '.png';

        number_posi.push(0.30 * win_w + 0.08 * win_h * i);
        obj.ape.loadImage(img_src, 0, 0, obj.wh, obj.wh);
        obj.ape.pos(number_posi[i], obj.y);
        number.push(obj);
        Laya.stage.addChild(obj.ape);
    }
}

// 绘制底部
function initBottom() {
    var btn = null,
        bg = null,
        y = 0.875 * win_h,
        h = 0.11 * win_h;

    // ----

    btn = new Sprite();
    bg = new Sprite();
    bg.loadImage('images/btn/bjsc_box.png', 0, 0, 0.35 * win_w, h);
    btn.addChild(bg);

    addP(btn, '时间/期数', 0.13 * win_w);
    addP2(btn, '612751', 0.25 * win_w);
    addP2(btn, '2017-04-16 14:42', 0.03 * win_w);

    btn.pos(0.015 * win_w, y);
    Laya.stage.addChild(btn);

    // ----

    btn = new Sprite();
    bg = new Sprite();
    bg.loadImage('images/btn/bjsc_box.png', 0, 0, 0.20 * win_w, h);
    btn.addChild(bg);

    addP(btn, '冠亚军和', 0.06 * win_w);
    addP2(btn, '11', 0.02 * win_w);
    addP2(btn, '小', 0.09 * win_w);
    addP2(btn, '单', 0.16 * win_w);

    btn.pos(0.390 * win_w, y);
    Laya.stage.addChild(btn);

    // ----

    btn = new Sprite();
    bg = new Sprite();
    bg.loadImage('images/btn/bjsc_box.png', 0, 0, 0.35 * win_w, h);
    btn.addChild(bg);

    addP(btn, '1~5 龙虎', 0.13 * win_w);
    addP2(btn, '虎', 0.02 * win_w);
    addP2(btn, '虎', (0.02 + 0.072 * 1) * win_w);
    addP2(btn, '龙', (0.02 + 0.072 * 2) * win_w);
    addP2(btn, '虎', (0.02 + 0.072 * 3) * win_w);
    addP2(btn, '虎', (0.02 + 0.072 * 4) * win_w);

    btn.pos(0.615 * win_w, y);
    Laya.stage.addChild(btn);

    // ----

    // 添加黑色标题
    function addP(btn, text, x) {
        var p = new Text();

        p.x = x;
        p.y = 0.01 * win_h;
        p.fontSize = 14;
        p.text = text;
        btn.addChild(p);
    }

    // 添加白色文字
    function addP2(btn, text, x) {
        var p2 = new Text();

        p2.x = x;
        p2.y = 0.06 * win_h;
        p2.fontSize = 13;
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
    endMap.y = 0.286 * win_h;
    endMap.h = 0.557 * win_h;
    endMap.w = endMap.h * 36 / 417;
    endMap.speed = 0;

    numberMap.h = 0.532 * win_h;
    numberMap.w = numberMap.h * 47 / 603;
    numberMap.x = win_w - numberMap.w - 6;
    numberMap.y = 0.304 * win_h;

    startMap.ape = new Sprite();
    onMap.ape = new Sprite();
    endMap.ape = new Sprite();
    numberMap.ape = new Sprite();
    startMap.ape.loadImage('images/road/bjsc_road_start.png', 0, 0, startMap.w, startMap.h);
    startMap.ape.pos(startMap.x, startMap.y);
    onMap.ape.loadImage('images/road/bjsc_road_on.png', 0, 0, onMap.w, onMap.h);
    onMap.ape.loadImage('images/road/bjsc_road_on.png', 0 + win_w, 0, onMap.w, onMap.h);
    onMap.ape.pos(onMap.x, onMap.y);
    endMap.ape.loadImage('images/road/bjsc_end.png', 0, 0, endMap.w, endMap.h);
    endMap.ape.pos(endMap.x, endMap.y);
    numberMap.ape.loadImage('images/road/bjsc_car_ number.png', 0, 0, numberMap.w, numberMap.h);
    numberMap.ape.pos(numberMap.x, numberMap.y);
    Laya.stage.addChild(onMap.ape);
    Laya.stage.addChild(startMap.ape);
    Laya.stage.addChild(endMap.ape);
    Laya.stage.addChild(numberMap.ape);
}

// 车辆 初始化
function createCars() {
    var number_list = [3, 2, 1, 6, 5, 4, 9, 8, 7, 10];
    // var number_list = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    for (var i = 0; i < 10; i++) {
        var obj = {
            s: [],
            x: 16,
            his_x: [],
            zhen: 0,
            y: startMap.y + win_h * 0.193 + i * win_h * 0.056,
            speed: [],
            ape: new Sprite()
        };
        var s1 = s2 = s3 = 0;

        obj.s.push(1 + 0.15 + Math.random() * (0.4 - 0.13));
        obj.s.push(2 - obj.s[0] + 0.1 + Math.random() * (0.5 - 0.1));
        obj.s.push(3 - obj.s[0] - obj.s[1] + 0.2 + Math.random() * (0.6 - 0.2));

        obj.speed.push((obj.s[0] / 250 - 0.004) * win_w);
        obj.speed.push((obj.s[1] / 250 - 0.004) * win_w);
        obj.speed.push((obj.s[2] / 250 - 0.004) * win_w);

        obj.w = win_w * 0.09;
        obj.h = obj.w * 65 / 180;
        obj.is_finish = false;

        /*  // 方法1
        var temp_x = obj.x;
            temp_end_x = endMap.x;
        for (var j = 0; j < 250; j++) temp_x += obj.speed[0];
        for (var j = 0; j < 250; j++) temp_x += obj.speed[1];
        for (var j = 0; j < 250; j++) {
            temp_x += obj.speed[2];
            // if (j >= 2) {
                temp_end_x -= (0.004 * win_w);
            // }
            if (temp_x + obj.w >= temp_end_x) {
                obj.time = -temp_x;
                break;
            }
        }*/

        // 方法2
        var temp_x = obj.x;
            temp_end_x = endMap.x;
        obj.his_x.push(temp_x);
        for (var j = 0; j < 250; j++) {
            temp_x += obj.speed[0];
            obj.his_x.push(temp_x);
        }
        for (var j = 0; j < 250; j++) {
            temp_x += obj.speed[1];
            obj.his_x.push(temp_x);
        }
        for (var j = 0; j < 250; j++) {
            temp_x += obj.speed[2];
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
    car_list.forEach(function(car) {
        var img_src = 'images/car/bjsc_car_' + (car.number + 1) + '.png';

        car.y = startMap.y + win_h * 0.193 + car.number * win_h * 0.056;
        car.ape.loadImage(img_src, 0, -car.h / 2, car.w, car.h);
        car.ape.pos(car.x, car.y);
        Laya.stage.addChild(car.ape);
    });
}

// 开始
function startRun() {
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
        if (on_map_count == 2) {
            endMap.speed = 0.004 * win_w;
            // Laya.timer.frameLoop(1, this, endMapRun);
        }
        if (on_map_count == 3) {
            console.log('---------');
            car_list.forEach(function(car) {
                console.log(car.number, car.x, car.time);
            });
            Laya.timer.clear(this, onMapRun);
            Laya.timer.clear(this, carRun);
            Laya.timer.clear(this, sortCarRank);
            window.setTimeout(function() {
                showRankModal();  // 到达终点的时候弹框显示排名
            }, 1000);
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
    });
    /*if (on_map_count >= 1) {
        for (var i = 0; i < car_list.length; i++) {
            car_list[i].x += car_list[i].speed[on_map_count];
            car_list[i].ape.pos(car_list[i].x, car_list[i].y);
            if (car_list[i].x + car_list[i].w >= endMap.x) {
                if (!car_list[i].is_finish) {
                    sortCarRank();
                    car_list[i].speed[car_list[i].speed.length - 1] = 0;
                    car_list[i].is_finish = true;
                }
            } else {
                i++;
                break;
            }
        }
        for (; i < car_list.length; i++) {
            car_list[i].x += car_list[i].speed[on_map_count];
            car_list[i].ape.pos(car_list[i].x, car_list[i].y);
        }
    } else {
        car_list.forEach(function(car) {
            car.x += car.speed[on_map_count];
            car.ape.pos(car.x, car.y);
        });
    }*/
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
    rankModal.btn_back.ape.graphics.drawPath(-0.5 * rankModal.btn_back.w, -0.5 * rankModal.btn_back.h, rankModal.btn_back.path, {'fillStyle': '#ccc'});
    rankModal.btn_back.ape.graphics.restore();
    rankModal.btn_back.ape.graphics.save();
    rankModal.btn_back.text.width = rankModal.btn_back.w;
    rankModal.btn_back.text.height = rankModal.btn_back.h;
    rankModal.btn_back.text.fontSize = 16;
    rankModal.btn_back.text.text = '返回';
    rankModal.btn_back.text.align = 'center';
    rankModal.btn_back.text.valign = 'middle';
    rankModal.btn_back.text.pos(-0.5 * rankModal.btn_back.w, -0.5 * rankModal.btn_back.h);
    rankModal.btn_back.ape.pos((0.5 - 0.15) * win_w, 0.72 * win_h);
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
    rankModal.btn_replay.ape.graphics.drawPath(-0.5 * rankModal.btn_replay.w, -0.5 * rankModal.btn_replay.h, rankModal.btn_replay.path, {'fillStyle': '#bdd'});
    rankModal.btn_replay.ape.graphics.restore();
    rankModal.btn_replay.ape.graphics.save();
    rankModal.btn_replay.text.width = rankModal.btn_replay.w;
    rankModal.btn_replay.text.height = rankModal.btn_replay.h;
    rankModal.btn_replay.text.fontSize = 16;
    rankModal.btn_replay.text.text = '再看一遍';
    rankModal.btn_replay.text.align = 'center';
    rankModal.btn_replay.text.valign = 'middle';
    rankModal.btn_replay.text.pos(-0.5 * rankModal.btn_replay.w, -0.5 * rankModal.btn_replay.h);
    rankModal.btn_replay.ape.pos((0.5 + 0.15) * win_w, 0.72 * win_h);
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
    w = 0.15 * win_w;
    h = w * 153 / 272;
    w2 = w;
    h2 = w * 56 / 272;
    rankModal.car = [];
    for (var i = 0; i < 3; i++) {
        rankModal.car.push(new Sprite);
        rankModal.car[i].loadImage('images/car/bjsc_wing_' + rank_list[i].num_str + '.png', -0.5 * w, -0.5 * h, w, h);
        rankModal.car[i].loadImage('images/number/result_' + (i + 1) + '.png', -0.5 * w2, -3.5 * h2, w2, h2);
        Laya.stage.addChild(rankModal.car[i]);
    }
    rankModal.car[0].pos(win_w * 0.5, win_h * (0.5 - 0.035));
    rankModal.car[1].pos(win_w * (0.5 - 0.2), win_h * 0.5);
    rankModal.car[2].pos(win_w * (0.5 + 0.2), win_h * (0.5 + 0.035));

    // 事件绑定
    rankModal.bg.on(Laya.Event.CLICK, this, function(e) {
        e.stopPropagation();
    });
    rankModal.btn_back.ape.once('click', this, function() {
        window.location.reload();
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
            car.x = 16;
            car.zhen = 0;
            car.ape.pos(car.x, car.y);
        });

        startMap.x = onMap.x = 0;
        endMap.x = endMap._x + win_w;
        endMap.speed = 0;
        startMap.ape.pos(startMap.x, startMap.y);
        startMap.ape.visible = true;
        onMap.ape.pos(onMap.x, onMap.y);
        endMap.ape.pos(endMap.x, endMap.y);
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










