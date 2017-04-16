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
createMap();   // 创建地图
createCars();  // 创建车辆

// 点击屏幕开始比赛
Laya.stage.on(Laya.Event.CLICK, this, startRun);

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
    msg.text = '本期：20170416';
    Laya.stage.addChild(msg);

    // number
    for (var i = 0; i < 10; i++) {
        var obj = {
            wh: 0.08 * win_h,
            y: 0.016 * win_h,
            ape: new Sprite()
        };
        var img_src = 'images/number/bjsc_card_' + (i + 1) + '.png';

        number_posi.push(0.28 * win_w + 0.09 * win_h * i);
        obj.ape.loadImage(img_src, 0, 0, obj.wh, obj.wh);
        obj.ape.pos(number_posi[i], 0.016 * win_h);
        number.push(obj);
        Laya.stage.addChild(obj.ape);
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
    startMap.speed = onMap.speed = win_w * 0.004;

    numberMap.h = 0.532 * win_h;
    numberMap.w = numberMap.h * 47 / 603;
    numberMap.x = win_w - numberMap.w - 6;
    numberMap.y = 0.304 * win_h;

    startMap.ape = new Sprite();
    onMap.ape = new Sprite();
    numberMap.ape = new Sprite();
    startMap.ape.loadImage('images/road/bjsc_road_start.png', 0, 0, startMap.w, startMap.h);
    startMap.ape.pos(startMap.x, startMap.y);
    onMap.ape.loadImage('images/road/bjsc_road_on.png', 0, 0, onMap.w, onMap.h);
    onMap.ape.loadImage('images/road/bjsc_road_on.png', 0 + win_w, 0, onMap.w, onMap.h);
    onMap.ape.pos(onMap.x, onMap.y);
    numberMap.ape.loadImage('images/road/bjsc_car_ number.png', 0, 0, numberMap.w, numberMap.h);
    numberMap.ape.pos(numberMap.x, numberMap.y);
    Laya.stage.addChild(onMap.ape);
    Laya.stage.addChild(startMap.ape);
    Laya.stage.addChild(numberMap.ape);
}

// 车辆 初始化
function createCars() {
    for (var i = 0; i < 10; i++) {
        var obj = {
            x: 16,
            y: startMap.y + win_h * 0.165 + i * win_h * 0.056,
            speed: [],
            ape: new Sprite()
        };
        obj.speed.push(Math.random() * 0.002 * win_w);
        for (var j = 0; j < 2; j++) {
            obj.speed.push((Math.random() * 0.002 - 0.001) * win_w);
        }
        var img_src = 'images/car/bjsc_car_' + (i + 1) + '.png';

        car_list.push(obj);
        // obj.h = win_h * 0.06;
        // obj.w = obj.h * 180 / 65;
        obj.w = win_w * 0.09;
        obj.h = obj.w * 65 / 180;
        obj.number = i;
        obj.ape.loadImage(img_src, 0, 0, obj.w, obj.h);
        obj.ape.pos(obj.x, obj.y);
        Laya.stage.addChild(obj.ape);
    }
}

// 开始
function startRun() {
    Laya.timer.frameLoop(1, this, startMapRun);  // 起点地图动画
    Laya.timer.frameLoop(1, this, onMapRun);     // 中间地图循环动画
    Laya.timer.frameLoop(1, this, carRun);       // 车辆动画
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
        if (on_map_count == 3) {
            Laya.timer.clear(this, onMapRun);
            Laya.timer.clear(this, carRun);
        }
        onMap.x += win_w;
    }
    onMap.ape.pos(onMap.x, onMap.y);
}

// 车辆动画
function carRun() {
    car_list.forEach(function(car) {
        car.x += car.speed[on_map_count];
        car.ape.pos(car.x, car.y);
    });
}

// 排名号码
function sortCarRank() {
    car_list.sort(function(a, b) {
        return b.x - a.x;
    });
    car_list.forEach(function(car, i) {
        title_obj.number[car.number].ape.pos(title_obj.number_posi[i], title_obj.number[0].y);
    });
}










