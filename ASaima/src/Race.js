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

// 是否强制横屏
var isHorizontal = true,
    win_w = isHorizontal ? Browser.clientHeight : Browser.clientWidth,
    win_h = isHorizontal ? Browser.clientWidth : Browser.clientHeight;

var title_obj = {  // 首页头部变量
    'left_btn': {},     // 返回按钮
    'logo': {},         // logo
    'msg': {},          // 期号
    'number_posi': [],  // 号码的 x 位置
    'number': []        // 排名号码
};

var startMap = {},   // 地图变量
    onMap = {},      // 中间地图
    endMap = {},     // 终点地图
    numberMap = {};  // 跑道尽头号码地标

var on_map_count = 0;  // 地图整页的数量

var car_list = [];  // 车辆变量

init();        // Laya 环境 初始化
initTitle();   // 绘制头部 title
initBottom();  // 绘制底部
createMap();   // 创建地图
createCars();  // 创建车辆

// 点击屏幕开始比赛
Laya.stage.once(Laya.Event.CLICK, this, startRun);

// Laya 环境 初始化
function init() {
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#dbd030";
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
    var number_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // var number_list = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    for (var i = 0; i < 10; i++) {
        var obj = {
            s: [],
            x: 16,
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

        var temp_x = obj.x;
            temp_end_x = endMap.x;
        for (var j = 0; j < 250; j++) temp_x += obj.speed[0];
        for (var j = 0; j < 250; j++) temp_x += obj.speed[1];
        for (var j = 0; j < 250; j++) {
            temp_x += obj.speed[2];
            if (j >= 2) {
                temp_end_x -= endMap.speed;
            }
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
    Laya.timer.loop(500, this, sortCarRank);     // 排名号码
}

// 起点地图动画
function startMapRun() {
    startMap.x -= startMap.speed;
    startMap.ape.pos(startMap.x, startMap.y);
    if (startMap.x <= -win_w) {
        Laya.stage.removeChild(startMap.ape);
        Laya.timer.clear(this, startMapRun);
    }
}

// 中间地图循环动画
function onMapRun() {
    onMap.x -= onMap.speed;
    if (onMap.x <= -win_w) {
        console.log('第' + ++on_map_count + '屏结束');
        if (on_map_count == 2) {
            Laya.timer.frameLoop(1, this, endMapRun);
        }
        if (on_map_count == 3) {
            // console.log('---------');
            // car_list.forEach(function(car) {
            //     console.log(car.number, car.x, car.time);
            // });
            Laya.timer.clear(this, onMapRun);
            Laya.timer.clear(this, carRun);
            Laya.timer.clear(this, sortCarRank);
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
    if (on_map_count >= 1) {
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
    }
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










