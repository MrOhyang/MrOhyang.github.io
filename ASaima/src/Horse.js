var Animation = Laya.Animation;
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

init();         // Laya 环境 初始化
createHorse();  // 创建马匹

// Laya 环境 初始化
function init() {
    Laya.init(win_w, win_h, WebGL);
    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = "showall";
    if (isHorizontal) Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
    Laya.stage.bgColor = "#fff";
    Laya.Stat.show();
}

// 创建马匹
function createHorse() {
    var test = new Sprite();
    var ani = new Animation();

    ani.loadAtlas('res/atlas/comp/paoma.json');
    ani.interval = 30;
    ani.index = 0;
    ani.play();
    ani.pos(30, 80);
    ani.scale(0.09 * win_w / 499, 0.09 * win_w / 499);
    test.addChild(ani);

    window.setTimeout(function() {
        ani.stop();
        window.setTimeout(function() {
            ani.index = 0;
        }, 300);
    }, 500);

    Laya.stage.addChild(test);
}










