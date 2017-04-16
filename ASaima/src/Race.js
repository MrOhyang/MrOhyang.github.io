var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
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

var startMap = {},   // 地图变量
    onMap = {},      // 中间地图
    endMap = {},     // 终点地图
    numberMap = {};  // 跑道尽头号码地标

var car_list = [];  // 车辆变量

init();        // Laya 环境 初始化
createMap();   // 创建地图
createCars();  // 创建车辆

window.setTimeout(startRun, 700);

// Laya 环境 初始化
function init() {
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#dbd030";
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

var on_map_count = 0;
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










