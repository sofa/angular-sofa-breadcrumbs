'use strict';

describe('sofa.breadbrumbs', function () {

    var element, $compile, $rootScope, $location;

    beforeEach(module('sofa.breadcrumbs', function($provide) {
        $provide.factory('urlParserService', function () {
            return {
                getCategoryUrlId: function () {
                    return 'test';
                },
                isRootCategory: function () {
                    return true;
                },
                isView: function () {
                    return false;
                }
            };
        });
    }));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$location_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $location = _$location_;
    }));


    it('should display the html list', function () {
        $rootScope.testData = [{
            title: 'test',
            link: '/test'
        }];
        element = $compile('<sofa-breadcrumbs data="testData"/>')($rootScope);
        $rootScope.$digest();
        element = element.find('li').find('a');
        expect(element.html()).toEqual('test');
    });

    it('should change the path when clicking a link', function () {
        spyOn($location, 'path');
        $rootScope.testData = [{
            title: 'test',
            link: '/test'
        }];
        element = $compile('<sofa-breadcrumbs data="testData"/>')($rootScope);
        $rootScope.$digest();
        element.find('li').find('a').triggerHandler('click');
        expect($location.path).toHaveBeenCalled();
    });
});
