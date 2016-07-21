/**
 * @namespace dias.annotations
 * @ngdoc directive
 * @name annotationListItem
 * @memberOf dias.annotations
 * @description An annotation list item.
 */
angular.module('dias.annotations').directive('annotationListItem', function (annotations, mapAnnotations, USER_ID) {
		"use strict";

		return {
			controller: function ($scope, $element) {
                // cache the selected state so it is checked only once during a digest
                var selected = false;
                var annotation = $scope.a.annotation;
                var label = $scope.a.label;

                var isSelected = function () {
                    return mapAnnotations.isAnnotationSelected($scope.a.annotation);
                };

                $scope.getUsername = function () {
                    if (label.user) {
                        return label.user.firstname + ' ' + label.user.lastname;
                    }

                    return '(user deleted)';
                };

                $scope.getClass = function () {
                    return {
                        'selected': selected
                    };
                };

                $scope.getShapeClass = function () {
                    return 'icon-' + $scope.a.shape.toLowerCase();
                };

                $scope.select = function (e) {
                    mapAnnotations.toggleSelect($scope.a.annotation, e.shiftKey);
                };

                $scope.zoomTo = function () {
                    mapAnnotations.fit($scope.a.annotation);
                };

                $scope.canBeRemoved = function () {
                    return label.user && label.user.id === USER_ID;
                };

                $scope.remove = function (e) {
                    e.stopPropagation();
                    if (annotation.labels.length === 1) {
                        if (confirm('Detaching the last label will delete the annotation. Proceed?')) {
                            // detaching the last label will also delete the annotation
                            // but directly deleting the annotation is easier to
                            // implement here
                            mapAnnotations.deleteAnnotation(annotation);
                        }
                    } else {
                        annotations.removeAnnotationLabel(annotation, label);
                    }
                };

                $scope.$watch(isSelected, function (s) {
                    selected = s;
                    if (selected) {
                        $scope.scrollToElement($element);
                    } else {
                        $scope.dontScrollToElement($element);
                    }
                });

                $element.on('$destroy', function () {
                    $scope.dontScrollToElement($element);
                });
			}
		};
	}
);
