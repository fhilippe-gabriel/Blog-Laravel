<a href="{{ route('posts.create') }}">New post</a>
<h1>Posts </h1>


@foreach ($posts as $post)
    <p>{{ $post->title }}
        <a href="{{ route('posts.show', $post->id) }}">Ver</a>
    </p>
@endforeach
