var Sprite  = Laya.Sprite;
var Stage   = Laya.Stage;
var Texture = Laya.Texture;
var Browser = Laya.Browser;
var Handler = Laya.Handler;
var WebGL   = Laya.WebGL;

// 是否强制横屏
var isHorizontal = true,
    win_w = isHorizontal ? Browser.clientHeight : Browser.clientWidth,
    win_h = isHorizontal ? Browser.clientWidth : Browser.clientHeight;

init();  // Laya 环境 初始化

var horse_list = [];

// 创建马匹
horse_list.push(initHorse(0, 40));
horse_list.push(initHorse(0, 140));
horse_list.push(initHorse(0, 240));

startRun();  // 开始赛马

// ---------- 函数定义 start ----------

// Laya 环境 初始化
function init() {
    console.log(win_w, win_h);
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#eee";
}

// 马匹 初始化
function initHorse(_x, _y) {
    var obj = {
        o: {x: 144 / 2, y: 155 / 2},
        x: _x ? _x : 0,
        y: _y ? _y : 0,
        du: 0,
        xuan: 0,
        x_add: ~~(Math.random() * 3) + 1,
        du_add: ~~(Math.random() * 11) + 5,
        is_finish: false,  // 是否跑到了终点
        ape: new Sprite()
    };

    obj.ape.loadImage('images/hourse.png', 0, 0);
    obj.ape.pivot(obj.o.x, obj.o.y);
    obj.x += obj.o.x;
    obj.y += obj.o.y;
    obj.ape.pos(obj.x, obj.y);
    Laya.stage.addChild(obj.ape);
    return obj;
}

// 开始赛马
function startRun() {
    Laya.timer.frameLoop(1, this, run);  // 开始赛马
}

// 赛马
function run() {
    clearFlag = false;
    horse_list.forEach(function(horse, i) {
        if (!horse.is_finish) {
            horse.x += horse.x_add;
            horse.y -= 3 * Math.sin(horse.du * 0.0174);
            horse.du += horse.du_add;

            // 判断是否结束
            if (horse.x >= win_w - 80) {
                clearFlag = true;
                horse.x = win_w - 80;
                horse.is_finish = true;
            }

            // 动画
            horse.ape.rotation = 26 * Math.sin(horse.du * 0.0174);
            // horse.ape.rotation = 26 * Math.cos(horse.du / 2 * 0.0174);
            horse.ape.pos(horse.x, horse.y);
        }
    });

    if (clearFlag) {
        var temp = horse_list.filter(function(horse) {
            return horse.is_finish == false;
        });

        if (temp.length <= 0) {
            Laya.timer.clear(this, run);
        }
    }
}