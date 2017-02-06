requirejs.config({
    baseUrl: 'js',
    urlArgs: '201702031001',
    paths: {
        // lib
        // rainbow: 'lib/rainbow',
        zepto: 'lib/zepto-1.2.0.min',

        // language
        // langCss: 'lib/language/css',
        // langGeneric: 'lib/language/generic',
        // langHtml: 'lib/language/html',
        // langJs: 'lib/language/javascript',

        // controller
        ctrlIndex: 'controllers/c_index',
    },
    shim: {
        // lib
        // rainbow: {exports: 'Rainbow'},
        zepto: {exports: '$'},
    }
});