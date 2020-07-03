import {Settings} from '../import';

/**
 * Store for annotator settings
 */

// Take care when modifying these variable names as they are mentioned as
// configurable URL parameters in the documentation.
let defaults = {
    // Settings tab.
    annotationOpacity: 1.0,
    mousePosition: false,
    zoomLevel: false,
    scaleLine: false,
    labelTooltip: false,
    measureTooltip: false,
    minimap: true,
    progressIndicator: true,
    // Annotation modes tab.
    randomSamplingNumber: 9,
    regularSamplingRows: 3,
    regularSamplingColumns: 3,
};

export default new Settings({
    data: {
        urlParams: Object.keys(defaults),
        storageKey: 'biigle.annotations.settings',
        defaults: defaults,
    },
});
