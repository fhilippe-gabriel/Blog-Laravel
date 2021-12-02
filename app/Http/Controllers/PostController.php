<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // check logged user
        $user = Auth::user();
        if (!is_null($user)) {
            $post = Post::where("user_id", $user->id)->get();
            if (count($post) > 0) {
                return response()->json(["status" => "success", "count" => count($post), "data" => $post], 200);
            } else {
                return response()->json(["status" => "failed", "count" => count($post), "message" => "Failed! no post found"], 200);
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        // check logged user
        $user = Auth::user();

        if (!is_null($user)) {

            // create Post
            $validator = Validator::make($request->all(), [
                "titulo" => "required",
                "conteudo" => "required",
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            $postInput = $request->all();
            $postInput['user_id'] = $user->id;

            $post = Post::create($postInput);
            if (!is_null($post)) {
                return response()->json(["status" => "success", "message" => "Success! Post created", "data" => $post]);
            } else {
                return response()->json(["status" => "failed", "message" => "Whoops! Post not created"]);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = Auth::user();
        if (!is_null($user)) {
            $post = Post::where("user_id", $user->id)->where("id", $id)->first();
            if (!is_null($post)) {
                return response()->json(["status" => "success", "data" => $post], 200);
            } else {
                return response()->json(["status" => "failed", "message" => "Failed! no Post found"], 200);
            }
        } else {
            return response()->json(["status" => "failed", "message" => "Un-authorized user"], 403);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        $input = $request->all();
        $user = Auth::user();

        if (!is_null($user)) {

            // validation
            $validator = Validator::make($request->all(), [
                "titulo" => "required",
                "conteudo" => "required",
            ]);

            if ($validator->fails()) {
                return response()->json(["status" => "failed", "validation_errors" => $validator->errors()]);
            }

            // update post
            $update = $post->update($request->all());

            return response()->json(["status" => "success", "message" => "Success! post updated", "data" => $post], 200);

        } else {
            return response()->json(["status" => "failed", "message" => "Un-authorized user"], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $user = Auth::user();

        if (!is_null($user)) {
            $post = Post::where("id", $post)->where("user_id", $user->id)->delete();
            return response()->json(["status" => "success", "message" => "Success! post deleted"], 200);
        } else {
            return response()->json(["status" => "failed", "message" => "Un-authorized user"], 403);
        }
    }
}