<h1>Novo Post</h1>

<form action="{{ route('posts.store') }}" method="post">
    @include('admin.posts._partials.form')
</form>
