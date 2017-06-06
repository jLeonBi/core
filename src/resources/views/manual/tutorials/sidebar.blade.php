@extends('manual.base')
@inject('modules', 'Biigle\Services\Modules')

@section('manual-title') Sidebar @stop

@section('manual-content')
    <div class="row">
        <p class="lead">
            All sidebar tabs of the annotation tool explained.
        </p>

        <h3><a name="annotations-tab"></a> <i class="fa fa-map-marker"></i> Annotations</h3>

        <p>
            The annotations tab shows a list of all annotations on the current image, grouped by their label. A click on a label expands the list item to show all annotations that have this label attached. Each annotation is represented by the icon of the shape of the annotation and the user who attached the label to the annotation. A click on an annotation list item selects the annotation. A selected annotation is highlighted both on the image an in the annotations list. A double click on an annotation in the list will make the viewport pan and zoom to show the annotation on the image.
        </p>
        <p class="text-center">
            <a href="{{asset('vendor/annotations/images/manual/sidebar_annotations_1.jpg')}}"><img src="{{asset('vendor/annotations/images/manual/sidebar_annotations_1.jpg')}}" width="50%"></a>
        </p>
        <p>
            An annotation can have multiple labels by multiple users attached to it. This means that there may be multiple highlighted items in the annotation list for a single selected annotation.
        </p>
        <p>
            At the very top of the annotations tab there is the annotation filter. Annotations can be filtered by label, user, shape or annotation session. You can use the filter e.g. to display only your own annotations on the images. Whenever the annotation filter is active, the button of the annotations tab will be highlighted so you don't forget the active filter.
        </p>
        <p class="text-center">
            <a href="{{asset('vendor/annotations/images/manual/sidebar_annotations_2.jpg')}}"><img src="{{asset('vendor/annotations/images/manual/sidebar_annotations_2.jpg')}}" width="50%"></a>
        </p>

        <h3><a name="label-trees-tab"></a> <i class="fa fa-tags"></i> Label Trees</h3>

        <p>
            The label trees tab shows all label trees that are available for the image. Here you can find and choose the labels you want to attach to new or existing annotations. Use the search field at the top to quickly find labels of deeply nested label trees. Mark up to ten labels as favorites to quickly select them with the <code>0</code>-<code>9</code> keys of your keyboard. To select a label as favorite, click the <i class="fa fa-star-o"></i> icon next to the label in the label tree. Now it will appear in the "Favorites" label tree at the top and can be selected with a shortcut key. Click the <i class="fa fa-star"></i> icon of a favorite label to remove it from the favorites.
        </p>

        @foreach ($modules->getMixins('annotationsManualSidebarLabelTrees') as $module => $nestedMixins)
            @include($module.'::annotationsManualSidebarLabelTrees')
        @endforeach

        <h3><a name="color-adjustment-tab"></a> <i class="fa fa-adjust"></i> Color Adjustment</h3>

        <p>
            The color adjustment tab allows you to manipulate some of the visual properties of the image. This can make finding interesting objects or regions on the image easier and quicker, e.g. if the images are very dark or have a low contrast.
        </p>

        <h4>Brightness/Contrast</h4>

        <p>
            These are arguably the most important properties that can be adjusted on an image. Choose a brightness value larger than 0 to increase the brightness of the image. A value lower than 0 decreases the brightness. Adjusting the contrast works just the same. You can also adjust the brightness individually for each color channel of the image. Click on the <i class="glyphicon glyphicon-tasks"></i> button and the slider for the brightness will expand into three sliders for the red, green and blue color channels. Press the button again to get back to adjusting the brightness for all color channels at once.
        </p>

        <h4>Hue</h4>

        <p>
            Adjusting the hue will "rotate" the colors of the whole image. Blue pixels my become green or red pixels may become blue, depending on the position of the hue slider. This can be useful not only for people with dyschromatopsia but for others as well since the human visual system can differentiate between more shades of green than any other color.
        </p>

        <h4>Saturation/Vibrance</h4>

        <p>
            Increasing the saturation will make the colors more "loud". Decreasing it will eventually result in a black and white image. In contrast to that increasing the vibrance will only affect colors that are not highly saturated already. Decreasing it will <em>only</em> affect the highly saturated colors.
        </p>

        <div class="panel panel-warning">
            <div class="panel-body text-warning">
                Color adjustment is unavailable for remote images and images that are too large to be handled by the graphics processing unit of your machine (<span id="texture-size-remark">your machine can handle images up to <span id="texture-size"></span> px</span>).
            </div>
        </div>
        <script type="text/javascript">
            try {
                var gl = document.createElement('canvas').getContext('webgl');
                var size = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                document.getElementById('texture-size').innerHTML = size + ' &times; ' + size;
            } catch (e) {
                document.getElementById('texture-size-remark').innerHTML = 'your machine can handle no color adjustment at all as it doesn\'t support WebGL';
            }
        </script>

        <h3><a name="settings-tab"></a> <i class="fa fa-cog"></i> Settings</h3>

        <p>
            The settings tab allows you to customize the annotation tool and provides some advanced features.
        </p>
        <p>
            Click the <i class="glyphicon glyphicon-camera"></i> capture screenshot button to get a screenshot of the currently visible area as a downloadable image. Note that the screenshot does not include the whole image but only the visible area of your current viewport.
        </p>

        <div class="panel panel-warning">
            <div class="panel-body text-warning">
                Capturing screenshots is not available for remote images due to security reasons. You can use the usual way of capturing a screenshot of your whole screen in this case.
            </div>
        </div>

        <p>
            The annotation opacity slider allows you to make annotations more transparent or hide them completely. Note that this setting will be remembered permanently so don't be confused if no annotations show up the next time you open an image in the annotation tool.
        </p>

        <p>
            See the <a href="{{route('manual-tutorials', ['annotations', 'navigating-images'])}}">Navigating Images</a> section for more information on <a href="{{route('manual-tutorials', ['annotations', 'navigating-images'])}}#volare">Volare</a> and <a href="{{route('manual-tutorials', ['annotations', 'navigating-images'])}}#lawnmower-mode">Lawnmower Mode</a>.
        </p>

        <p>
            The mouse position switch controls the display of an additional map overlay that shows the current position of the cursor on the image in pixels.
        </p>

        @foreach ($modules->getMixins('annotationsManualSidebarSettings') as $module => $nestedMixins)
            @include($module.'::annotationsManualSidebarSettings')
        @endforeach
    </div>
@endsection
