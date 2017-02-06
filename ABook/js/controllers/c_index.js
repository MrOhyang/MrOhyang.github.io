// 首页控制器
define(['zepto'], function($) {
    var exports = {
        init: init
    };

    // 初始化函数
    function init() {
        var dom_includes = $('include'),
            dom_includes_len = dom_includes.length,
            url = '';

        for (var i = 0; i < dom_includes.length; i++) {
            url = dom_includes.eq(i).attr('src');

            ;(function(index) {
                $.get(url, function(res) {
                    var el = $(res);
                    dom_includes.eq(index).html(el);
                    Rainbow.color(el, function() {
                    });
                });
            })(i);
            
        }
    }

    return exports;
});