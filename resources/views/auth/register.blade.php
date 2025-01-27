@extends('app')

@section('title', 'Sign up')
@section('show-navbar', false)

@section('content')
<div class="container">
    <div class="row center-form">
        <div class="col-md-4 col-sm-6">
            <h1 class="logo  logo--standalone"><a href="{{ route('home') }}" class="logo__biigle">BIIGLE</a></h1>
            <form class="well clearfix" role="form" method="POST" action="{{ url('register') }}">

                {!! Honeypot::generate('website', 'homepage') !!}

                <p class="lead text-center">{{ trans('biigle.new_acc') }}</p>
                <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <input type="email" placeholder="{{ trans('form.email') }}" class="form-control" name="email" value="{{ old('email') }}" autofocus required>
                    </div>
                    @if($errors->has('email'))
                        <span class="help-block">{{ $errors->first('email') }}</span>
                    @endif
                </div>

                <div class="form-group{{ $errors->has('firstname') ? ' has-error' : '' }}">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-user"></i>
                        </div>
                        <input type="text" placeholder="{{ trans('form.firstname') }}" class="form-control" name="firstname" value="{{ old('firstname') }}" required>
                    </div>
                    @if($errors->has('firstname'))
                        <span class="help-block">{{ $errors->first('firstname') }}</span>
                    @endif
                </div>

                <div class="form-group{{ $errors->has('lastname') ? ' has-error' : '' }}">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-user"></i>
                        </div>
                        <input type="text" placeholder="{{ trans('form.lastname') }}" class="form-control" name="lastname" value="{{ old('lastname') }}" required>
                    </div>
                    @if($errors->has('lastname'))
                        <span class="help-block">{{ $errors->first('lastname') }}</span>
                    @endif
                </div>

                <div class="form-group{{ $errors->has('affiliation') ? ' has-error' : '' }}">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-building"></i>
                        </div>
                        <input type="text" placeholder="Affiliation (institute name, company, etc.)" class="form-control" name="affiliation" value="{{ old('affiliation') }}">
                    </div>
                    @if($errors->has('affiliation'))
                        <span class="help-block">{{ $errors->first('affiliation') }}</span>
                    @endif
                </div>

                <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-lock"></i>
                        </div>
                        <input type="password" minlength="8" placeholder="{{ trans('form.password') }}" class="form-control" name="password" required>
                    </div>
                    @if($errors->has('password'))
                        <span class="help-block">{{ $errors->first('password') }}</span>
                    @endif
                </div>

                @if (View::exists('privacy'))
                    <div class="form-group{{ $errors->has('privacy') ? ' has-error' : '' }}">
                        <div class="checkbox">
                            <label>
                                <input name="privacy" type="checkbox" value="1" required @if (old('privacy')) checked @endif> I have read and agree to the <a href="{{route('privacy')}}">privacy notice</a>. This includes the use of my full name, email address and affiliation.
                            </label>
                        </div>
                        @if($errors->has('privacy'))
                            <span class="help-block">{{ $errors->first('privacy') }}</span>
                        @endif
                    </div>
                @endif

                @if (View::exists('terms'))
                    <div class="form-group{{ $errors->has('terms') ? ' has-error' : '' }}">
                        <div class="checkbox">
                            <label>
                                <input name="terms" type="checkbox" value="1" required @if (old('terms')) checked @endif> I have read and agree to the <a href="{{route('terms')}}">terms of use</a>.
                            </label>
                        </div>
                        @if($errors->has('terms'))
                            <span class="help-block">{{ $errors->first('terms') }}</span>
                        @endif
                    </div>
                @endif

                @if ($errors->has('homepage'))
                    <p class="text-danger">{{ $errors->first('homepage') }}</p>
                @endif
                @if ($errors->has('website'))
                    <p class="text-danger">{{ $errors->first('website') }}</p>
                @endif

                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                <input type="submit" class="btn btn-success btn-block" value="Sign up">

            </form>
            <p class="clearfix">
                <a href="{{ route('home') }}" class="">{{ trans('biigle.back') }}</a>
            </p>
        </div>
    </div>
</div>
@include('partials.footer', [
    'positionAbsolute' => true,
])
@endsection
