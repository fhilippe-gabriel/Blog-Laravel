<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdatePost;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::get();

        return view('admin.posts.index', compact('posts'));
    }

    public function create()
    {
        return view('admin.posts.create');
    }

    public function store(StoreUpdatePost $request)
    {

        $post = Post::create($request->all());
        //  , [
        // "title" => "nullable",
        // "content" => "nullable",
        //    ]
        // );
        return redirect()->route('posts.index')->with('message', 'Post editado com sucesso');
    }

    public function show($id)
    {
        // $post = Post::where('id', $id)->first();

        if (!$post = Post::find($id)) {
            return redirect()->route('posts.index');
        };
        return view('admin.posts.show', compact('post'));

    }

    public function destroy($id)
    {
        if (!$post = Post::find($id)) {
            return redirect()->route('posts.index');
        }

        $post->delete();
        return redirect()->route('posts.index')->with('message', 'Post deletado com sucesso');

    }

    public function edit($id)
    {
        // $post = Post::where('id', $id)->first();

        if (!$post = Post::find($id)) {
            return redirect()->back();
        };
        return view('admin.posts.edit', compact('post'));

    }
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
}