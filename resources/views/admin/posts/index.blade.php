<a href="{{ route('posts.create') }}">New post</a>
<br>

@if (session('message'))
    <div class="">
        {{ session('message') }}
    </div>
@endif

<h1>Posts </h1>

<form action="{{ route('posts.search') }}" method="post">
    @csrf
    <input type="text" name="search" placeholder="Pesquisar">
    <button type="submit">Search</button>
</form>

@foreach ($posts as $post)
    <p>
        {{ $post->title }}
        [
        <a href="{{ route('posts.show', $post->id) }}">Ver</a> |
        <a href="{{ route('posts.edit', $post->id) }}">Editar</a>
        ]
    </p>
@endforeach

<br>
@if (isset($filters))
    {{ $posts->appends($filters)->links() }}
@else
    {{ $posts->links() }}
@endif
