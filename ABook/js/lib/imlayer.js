/**
 * Created by ouyangyibin on 2017-01-05 16:13:34
 */
define(['zepto', 'template'],
function($, template) {
    var exports = {
        msg: msg
        ,confirm: confirm
        ,prompt: prompt
        ,closeAll: closeAll
    };

    var tpl = {
        msg:
            '<div class="layer-msg">'
        +       '<p>{{text}}</p>'
        +   '</div>'
        ,confirm:
            '<div class="im-layer layer-confirm">'
        +       '<div class="confirm-modal">'
        +           '{{if title}}'
        +           '<div class="modal-title">'
        +               '<h1>{{title}}<em>×</em></h1>'
        +           '</div>'
        +           '{{/if}}'
        +           '<div class="modal-body">'
        +               '<p><em class="em-warn"></em></p>'
        +               '<p>{{msg}}</p>'
        +           '</div>'
        +           '<div class="modal-footer">'
        +               '{{if type==0}}'
        +               '<button class="btn-2 btn-cancel">取消</button>'
        +               '<button class="btn-2 btn-ok">{{btn_value}}</button>'
        +               '{{else if type==1}}'
        +               '{{each btn as item}}'
        +               '<button class="btn-{{btn_len}} {{item.class}}">{{item.name}}</button>'
        +               '{{/each}}'
        +               '{{/if}}'
        +           '</div>'
        +       '</div>'
        +   '</div>'
        ,prompt:
            '<div class="im-layer layer-prompt">'
        +       '<div class="prompt-modal">'
        +           '<div class="modal-body">'
        +                '{{text1}}<input type="number" name="">{{text2}}'
        +           '</div>'
        +           '<div class="modal-footer">'
        +               '<button class="btn-2 btn-cancel">取消</button>'
        +               '<button class="btn-2 btn-ok">确认</button>'
        +           '</div>'
        +       '</div>'
        +   '</div>'
    }

    /**
     * @desc 提示层
     * @param {object} options
     *                 类型 0.
     * @param {string} options - 提示的消息
     *                 类型 1.
     * @param {string} options.text     - 提示的消息
     * @param {string} options.delay    - 持续显示的时长 ms 默认 900ms
     * @param {string} options.duration - 动画播放的时长 ms 默认 800ms
     *
     * @param {fun}    callback         - 动画完毕后的回调
     */
    function msg(options, callback) {
        if (!options) return ;
        var strHtml = '';

        // 类型 0. 转换到 类型 1.
        if (typeof options === 'string') {
            options = {text: options};
        }
        options.delay = options.delay ? options.delay : 900;
        options.duration = options.duration ? options.duration : 800;
        callback = (typeof callback === 'function') ? callback : noop;

        try {
            strHtml = template.compile(tpl.msg)(options);
        } catch (e) {
            strHtml = '';
            ssjjLog.error('layer 渲染模板出错');
            ssjjLog.error(e);
        }
        if (strHtml == '{Template Error}') return ;
        var el = $(strHtml);

        window.setTimeout(function() {
            el.animate({
                'opacity': 0
            }, options.duration, function() {
                el.remove();
                callback();
            });
        }, options.delay);

        $('body').append(el);
    }

    /**
     * @desc 询问层
     * @param {object} options
     * @param {string} options.msg        - 询问的消息
     * @param {bool}   options.auto_close - 点击 非热区 自动销毁弹层 默认 true
     *                 类型 0. 确认&取消 按钮
     * @param {fun}    options.btn_value  - 确认键的值
     * @param {fun}    options.ok         - 成功回调
     *
     *                 类型 1. 自定义按钮
     * @param {array}  options.btn        - 按钮值, 从左到右, 现数量仅最多为 2
     * @param {string} options.btn.name   - 按钮 名称
     * @param {string} options.btn.class  - 按钮 class 名
     * @param {fun}    argument[1, +∞)    - 回调
     */
    function confirm(options) {
        var arg = arguments,
            strHtml = '',
            i = null;

        options.auto_close = (options.auto_close === undefined) ? true : options.auto_close;

        // 选择 类型 1.
        if (options.btn && toString.call(options.btn) === '[object Array]') {
            options.type = 1;
        } else {
            options.type = 0;
        }

        switch (options.type) {
            case 0:  // 类型 0.
                options.btn_value = options.btn_value ? options.btn_value : '确认';
                options.ok = (typeof options.ok === 'function') ? options.ok : noop;
                break;
            case 1:  // 类型 1.
                options.btn_len = options.btn.length;
                if (options.btn_len > 2) {
                    ssjjLog.error('layer confirm 入参按钮数量, 最多为 2');
                    return ;
                }
                for (i = 0; i < options.btn.length; i++) {
                    arguments[i + 1] = (typeof arguments[i + 1] === 'function') ? arguments[i + 1] : noop;
                }
                break;
            default:
                ssjjLog.error('layer confirm 没有这个入参组合, 请检查入参');
                return ;
                break;
        }

        try {
            strHtml = template.compile(tpl.confirm)(options);
        } catch (e) {
            strHtml = '';
            ssjjLog.error('layer 渲染模板出错');
            ssjjLog.error(e);
        }
        if (strHtml == '{Template Error}') return ;
        var el = $(strHtml);

        // 点击 非热区 自动销毁弹框 事件绑定
        if (options.auto_close) {
            // 销毁弹框
            el.one('click', function(e) {
                el.remove();
            });

            // 点击热区 阻止冒泡 阻止销毁弹框
            el.find('.confirm-modal').on('click', function(e) {
                e.stopPropagation();
            });
        }

        switch (options.type) {
            case 0:  // 类型 0.
                // 取消
                el.find('.modal-footer .btn-cancel').one('click', function(e) {
                    el.remove();
                });

                // 确定
                el.find('.modal-footer .btn-ok').one('click', function(e) {
                    el.remove();
                    options.ok();
                });
                break;
            case 1:  // 类型 1.
                el.find('.modal-footer').one('click', 'button', function(e) {
                    el.remove();
                    arg[$(this).index() + 1]();
                });
                break;
            default:
                ssjjLog.error('layer confirm 没有这个入参组合, 请检查入参');
                return ;
                break;
        }

        $('body').append(el);
    }

    /**
     * @desc 输入层
     * @param {object} options
     * @param {string} options.text1 - input 左侧 的 文字
     * @param {string} options.text2 - input 右侧 的 文字
     * @param {bool}   options.auto_close - 点击 非热区 自动销毁弹层 默认 true
     * @param {fun}    options.ok    - 成功回调
     */
    function prompt(options) {
        var strHtml = '';

        options.auto_close = (options.auto_close === undefined) ? true : options.auto_close;
        options.ok = (typeof options.ok === 'function') ? options.ok : noop;

        try {
            strHtml = template.compile(tpl.prompt)(options);
        } catch (e) {
            strHtml = '';
            ssjjLog.error('layer 渲染模板出错');
            ssjjLog.error(e);
        }
        if (strHtml == '{Template Error}') return ;
        var el = $(strHtml);

        // 点击 非热区 自动销毁弹框 事件绑定
        if (options.auto_close) {
            // 销毁弹框
            el.one('click', function(e) {
                el.remove();
            });

            // 点击热区 阻止冒泡 阻止销毁弹框
            el.children().on('click', function(e) {
                e.stopPropagation();
            });
        }

        // 确定
        el.find('.modal-footer .btn-ok').one('click', function(e) {
            var value = el.find('.modal-body input').val();

            el.remove();
            options.ok(value);
        });

        // 取消
        el.find('.modal-footer .btn-cancel').one('click', function(e) {
            el.remove();
        });

        $('body').append(el);
    }

    /**
     * @desc 关闭所有 layer 弹层, 除了 layer.msg
     * @param {string} arg - des
     */
    function closeAll() {
        $('.im-layer').remove();
    }

    return exports;
});