@extends('admin.layouts.app')
@section('title', 'Ver Post')
@section('content')
    <h1>Detalhes do Post{{ $post->title }}</h1>
    <ul>
        <li>
            <strong>Numeração:</strong>
            {{ $post->id }}
        </li>
        <li>
            <strong>Título:</strong>
            {{ $post->title }}
        </li>
        <li>
            <strong>Conteudo:</strong>
            {{ $post->content }}
        </li>
        <li>
            <strong>Criado:</strong>
            {{ $post->created_at }}
        </li>
        <li>
            <strong>Editado:</strong>
            {{ $post->updated_at }}
        </li>
    </ul>

    <form action="{{ route('posts.destroy', $post->id) }}" method="post">
        @csrf
        <input type="hidden" name="_method" value="DELETE">
        <button type="submit">Deletar Post: {{ $post->id }}</button>
    </form>

@endsection
