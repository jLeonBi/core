<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="{{ cachebust_asset('favicon.ico') }}">
    @hasSection('title')
        <title>@yield('title') - BIIGLE</title>
    @else
        <title>BIIGLE</title>
    @endif
    @hasSection('description')
        <meta name="description" content="@yield('description')">
    @else
        <meta name="description" content="The Bio-Image Indexing and Graphical Labelling Environment is a web service for the efficient and rapid annotation of still images.">
    @endif

    <link href="{{ cachebust_asset('assets/styles/main.css') }}" rel="stylesheet">
    @stack('styles')
</head>
<body>
    @section('show-navbar')
        @include('partials.navbar')
    @show
    @include('partials.messages')
    @yield('content')

    <script src="{{ cachebust_asset('assets/scripts/main.js') }}"></script>
    <script type="text/javascript">
        Vue.http.options.root = '{{url('/')}}';
        Vue.http.headers.common['X-CSRF-TOKEN'] = '{{csrf_token()}}';
    </script>
    @stack('scripts')
</body>
</html>
