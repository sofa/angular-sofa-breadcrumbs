
angular.module('sofa.breadcrumbs', [
        'sofa-breadcrumbs.tpl.html',
        'sofa.urlParserService',
        'sofa.urlConstructionService',
        'sofa.couchService'
    ]);

angular.module('sofa.breadcrumbs')
    .directive('sofaBreadcrumbs', function($location, urlParserService, urlConstructionService, couchService) {

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
    });
