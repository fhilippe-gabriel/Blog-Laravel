<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdatePost;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        $data = $request->all();
        if ($request->image->isValid()) {
            $nameImage = Str::of($request->title)->slug('-') . '.' . $request->image->getClientOriginalExtension();
            $image = $request->file("image")->storeAs('posts', $nameImage);
            $data['image'] = $image;
        }

        Post::create($data);
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
        if (!$post = Post::find($id)) {
            return redirect()->route('posts.index');

        }

        if (Storage::exists($post->image)) {
            Storage::delete($post->image);
        }
        $post->delete();
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
        }

        $data = $request->all();

        if ($request->image->isValid()) {
            if (Storage::exists($post->image)) {
                Storage::delete($post->image);
            }

            $nameImage = Str::of($request->title)->slug('-') . '.' . $request->image->getClientOriginalExtension();
            $image = $request->file("image")->storeAs('posts', $nameImage);
            $data['image'] = $image;
        }

        // return view('admin.posts.edit', compact('post'));
        $post->update($data);

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