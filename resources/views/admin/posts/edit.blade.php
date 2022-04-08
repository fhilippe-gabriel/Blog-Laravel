@extends('admin.layouts.app')
@section('title', 'Editar Post')
@section('content')
    <h1>Editar Post <strong>{{ $posts->title }}</strong></h1>

    <form action="{{ route('posts.update', $posts->id) }}" method="post" enctype="multipart/form-data">
        @method('put')
        @include('admin.posts._partials.form')
    </form>
@endsection
