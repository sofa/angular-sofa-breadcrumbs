require('shared-sofa-component-tasks')(require('gulp'), {
    pkg: require('./package.json'),
    baseDir: __dirname,
    testDependencyFiles: [
        'node_modules/shared-sofa-component-tasks/node_modules/sofa-core/dist/sofaCore.angular.js',
        'node_modules/sofa-couch-service/dist/sofaCouchService.js',
        'node_modules/sofa-couch-service/dist/sofaCouchService.angular.js',
        'node_modules/sofa-url-construction-service/dist/sofaUrlConstructionService.js',
        'node_modules/sofa-url-construction-service/dist/sofaUrlConstructionService.angular.js',
        'node_modules/sofa-url-parser-service/dist/sofaUrlParserService.js',
        'node_modules/sofa-url-parser-service/dist/sofaUrlParserService.angular.js',
    ]
});
