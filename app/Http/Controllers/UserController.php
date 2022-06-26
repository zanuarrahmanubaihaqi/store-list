<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
      $users = DB::table('users')
            ->select('*')->get();
      return view('user.index', compact('users'));
    }

    public function index_point() {
      $users = DB::table('users')
            ->select('*')->get();
      return view('user.index_point', compact('users'));
    }

    public function store(Request $request) {
      $name = $request->name;
      $username = $request->username;
      $password_text = $request->password;
      $email = $request->email;

      $get_last_id = User::select('id')
                      ->orderByDesc('id')
                      ->first();
      if ($get_last_id != null) {
          $id = $get_last_id->id;
      } else {
          $id = 0;
      }

      $data_user = [
        'id' => $id + 1,
        'name' => $name,
        'username' => $username,
        'password' => Hash::make($password_text),
        'email' => $email,
        'transaction_point' => 0,
      ];
      User::create($data_user);
      
      return redirect()->back()->with(['message' => 'User berhasil ditambahkan']);
    }

    public function update(Request $request, $user_id) {
      $name = $request->name;
      $username = $request->username;
      $level = $request->level;

      $user = User::find($user_id);
      $user->update([
        'name' => $name,
        'username' => $username,
        'password' => Hash::make($password_text),
        'email' => $email,
        'transaction_point' => 0,
      ]);
      return redirect()->back()->with(['message' => 'User berhasil diupdate']);
    }

    public function delete($id) {
      $user = User::findOrFail($id);
      if (isset($user->id)) {
        DB::delete("DELETE from usres WHERE id = " . $user->id);
        return redirect()->back()->with(['message' => 'User berhasil dihapus']);
      } else {
        return redirect()->back()->with(['message' => 'User gagal dihapus']);
      }
    }
}
