var Sprite  = Laya.Sprite;
var Stage   = Laya.Stage;
var Texture = Laya.Texture;
var Browser = Laya.Browser;
var Handler = Laya.Handler;
var WebGL   = Laya.WebGL;




// 不支持WebGL时自动切换至Canvas
Laya.init(Browser.clientHeight, Browser.clientWidth, WebGL);
// Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

console.log(Browser.clientWidth, Browser.clientHeight);

Laya.stage.alignV = Stage.ALIGN_MIDDLE;
Laya.stage.alignH = Stage.ALIGN_CENTER;

Laya.stage.scaleMode = "showall";
Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
Laya.stage.bgColor = "#eee";

var hourse = initObject(100);
var hourse2 = initObject(200);

run();

function initObject(_y) {
    var obj = {
        x: 72,
        y: _y,
        du: 0,
        xuan: 0,
        ape: new Sprite()
    };

    obj.ape.loadImage('images/hourse.png', obj.x, obj.y);
    obj.ape.pivot(144/2+obj.x, (117+obj.y)/2);
    Laya.stage.addChild(obj.ape);
    return obj;
}

function hourseRun() {
    // hourse.x += (Math.random() * 2) + 1;
    // hourse2.x += (Math.random() * 3) + 1;

    hourse.x += 2;
    hourse2.x += 2;

    hourse.y -= 3 * Math.sin(hourse.du * 0.0174);
    hourse.du += 10;
    
    hourse.ape.rotation = 30 * Math.sin(hourse.du * 0.0174);
    hourse.ape.pos(hourse.x, hourse.y);
    hourse2.ape.pos(hourse2.x, hourse2.y);

    if (hourse.x > Browser.clientHeight - 72) {
        hourse.x = Browser.clientHeight - 72;
        Laya.timer.clear(this, hourseRun);
    }
    if (hourse2.x > Browser.clientHeight - 72) {
        hourse2.x = Browser.clientHeight - 72;
        Laya.timer.clear(this, hourseRun);
    }
}

function run() {
    Laya.timer.frameLoop(1, this, hourseRun);
}

// showApe();
// setup();

function showApe()
{
    // 方法1：使用loadImage
    // ape.loadImage("images/hourse.png", x, 10);
    ape.pos(x, 10);
}

console.log();

// function setup() {
//     Laya.timer.frameLoop(1, this, function () {
//         x += 3;
//         console.log(x, Laya.Browser.clientWidth);
//         if (x > Laya.Browser.clientWidth) {
//             console.log('>');
//             Laya.timer.clearAll(this);
//         }
//         showApe();
//     });
// }