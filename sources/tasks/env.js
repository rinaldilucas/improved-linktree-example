module.exports = function() {
    return {
        root: './',
        temp: './.temp/compress',
        source: './sources',
        develop: './develop',
        dist: './docs',
        url: {
            hml: 'www.homolog.com',
            prod: 'www.production.com',
        },
        base: 'https://production.com',
    };
};
