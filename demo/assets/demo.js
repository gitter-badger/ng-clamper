'use strict';

angular.module('app', [
	'ngSanitize',
	'ngI18n',
	'ngI18nLangSelect',
  'ng-clamper'
])

.config(function(I18NProvider) {
		var i18nConfig = {
			langsDir: 'assets/lang/',
			langs: [{
				locale: 'en-us',
				flag: 'us',
				name: 'English'
			}, {
				locale: 'pt-pt',
				flag: 'pt',
				name: 'Portuguese'
			}]
		};
		I18NProvider.config(i18nConfig);
	})
	.controller('AppController', ['$interval', '$rootScope', '$sce', '$filter', 'I18N', function AppCtrl($interval, $rootScope, $sce, $filter, I18N) {
		var app = this;
		app.loaded = true;
		app.author = 'Kevin Chappell';
		app.yourName = app.author.substring(0, app.author.indexOf(' '));
		app.maintainedBy = $sce.trustAsHtml($filter('i18n')('maintainedBy'));
		app.hotdogCount = 3;
		app.introClamp = {
			clamp: 3,
			toggle: true,
			end: '&hellip;'
		};
		app.secondsSinceOpen = 0;
		app.date = function() {
			var date = new Date();
			return date.toLocaleDateString($rootScope.lang);
		};

		$interval(function() {
			app.secondsSinceOpen++;
		}, 1000);

	}]);


// Boiler plate language selector
angular.module('ngI18nLangSelect', ['ngI18n'])
	.directive('langSelect', function langSelect() {

		return {
			restrict: 'E',
			replace: true,
			template: '<ul class="language-select"><li ng-repeat="lang in LangSelectCtrl.languages" class="{{lang.locale}}" ng-click="LangSelectCtrl.changeLang(lang)"><div class="flag flag-{{lang.flag}}" title="{{lang.name}}" id="{{lang.flag}}"></div></li></ul>',
			controller: 'LangSelectController as LangSelectCtrl'
		};
	})
	.controller('LangSelectController', ['I18N', '$document', '$filter', function LangSelectCtrl(I18N, $document, $filter) {
		var langSelect = this,
			toast = function(text) {
				var body = $document.find('body').eq(0),
				toast = angular.element('<div class="toast">'+text+'</div>');
				body.append(toast);
			};
		langSelect.languages = I18N.getLangs();
		langSelect.changeLang = function(lang) {
			// we can pass a callback to setCurrent
			I18N.setCurrent(lang.locale, function() {
				toast($filter('i18n')('toast.loaded', lang.name));
			});
		};
	}]);
