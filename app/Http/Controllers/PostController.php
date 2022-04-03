<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdatePost;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    //Listagem de todos os posts
    public function index()
    {
        $posts = Post::latest()->paginate();

        return view('admin.posts.index', compact('posts'));
    }

    public function create()
    {
        return view('admin.posts.create');
    }
    //Cria posts existentes
    public function store(StoreUpdatePost $request)
    {

        $posts = Post::create($request->all());
        //  , [
        // "title" => "nullable",
        // "content" => "nullable",
        //    ]
        // );
        return redirect()->route('posts.index')->with('message', 'Post editado com sucesso');
    }
    //Mostra posts existentes
    public function show($id)
    {
        // $post = Post::where('id', $id)->first();

        if (!$post = Post::find($id)) {
            return redirect()->route('posts.index');
        };
        return view('admin.posts.show', compact('post'));

    }
    //apaga posts existentes
    public function destroy($id)
    {
        if (!$posts = Post::find($id)) {
            return redirect()->route('posts.index');
        }

        $posts->delete();
        return redirect()->route('posts.index')->with('message', 'Post deletado com sucesso');

    }
    //Edita posts existentes
    public function edit($id)
    {
        // $post = Post::where('id', $id)->first();

        if (!$posts = Post::find($id)) {
            return redirect()->back();
        };
        return view('admin.posts.edit', compact('posts'));

    }
    //Atualiza posts existentes
    public function update(StoreUpdatePost $request, $id)
    {
        // $post = Post::where('id', $id)->first();

        if (!$post = Post::find($id)) {
            return redirect()->back();
        };
        // return view('admin.posts.edit', compact('post'));
        $post->update($request->all());

        return redirect()->route('posts.index')->with('message', 'Post editado com sucesso');
    }

    //filtra & pesquisa posts
    public function search(Request $request)
    {
        $filters = $request->except('_token');
        $posts = Post::where("title", "=", $request->search)
            ->orWhere("content", "LIKE", "%{$request->search}%")
            ->paginate();
        return view('admin.posts.index', compact('posts', 'filters'));
    }
}