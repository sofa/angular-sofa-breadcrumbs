/**
 * angular-sofa-breadcrumbs - v0.1.0 - Wed Feb 11 2015 13:04:21 GMT+0100 (CET)
 * http://www.sofa.io
 *
 * Copyright (c) 2014 CouchCommerce GmbH (http://www.couchcommerce.com / http://www.sofa.io) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA.IO COUCHCOMMERCE SDK (WWW.SOFA.IO)
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (angular) {
angular.module('sofa-breadcrumbs.tpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('sofa-breadcrumbs.tpl.html',
    '<ul>\n' +
    '    <li class="sofa-breadcrumbs__entry" \n' +
    '        ng-repeat="entry in data">\n' +
    '        <a ng-click="navigateTo(entry)" ng-bind="entry.title"></a>\n' +
    '    </li>\n' +
    '</ul>\n' +
    '');
}]);


angular.module('sofa.breadcrumbs', [
        'sofa-breadcrumbs.tpl.html',
        'sofa.urlParserService',
        'sofa.urlConstructionService',
        'sofa.couchService'
    ]);

angular.module('sofa.breadcrumbs')
    .directive('sofaBreadcrumbs', ["$location", "urlParserService", "urlConstructionService", "couchService", function($location, urlParserService, urlConstructionService, couchService) {

        'use strict';

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'sofa-breadcrumbs.tpl.html',
            scope: {
                data: '=?'
            },
            link: function($scope) {

                var categoryToLinkTitleList = function(category){
                    var list = [];

                    var doIt = function(currentCategory){
                        if(currentCategory.parent){
                            list.unshift({
                                title: currentCategory.label,
                                link: currentCategory.getOriginFullUrl()
                            });

                            doIt(currentCategory.parent);
                        }
                    };

                    doIt(category);

                    return list;
                };

                var prependRootLink = function(list){
                    //get rid of hardcoded stuff
                    list.unshift({
                        title: 'Startseite',
                        link: '/'
                    });

                    return list;
                };

                $scope.navigateTo = function(entry){
                    $location.path(entry.link);
                };

                $scope.$watch(function(){
                    return $location.path();
                }, function(){
                    if(!urlParserService.isRootCategory() ||
                        urlParserService.isView('categories') ||
                        urlParserService.isView('products') ||
                        urlParserService.isView('product')){

                        var categoryUrlId = urlParserService.getCategoryUrlId();

                        couchService
                            .getCategory(categoryUrlId)
                            .then(function(category){
                                var data = prependRootLink(
                                                categoryToLinkTitleList(category));

                                if (urlParserService.isView('products')){
                                    data.pop();
                                }

                                $scope.data = data;
                            });
                    }
                });
            }
        };
    }]);
}(angular));
