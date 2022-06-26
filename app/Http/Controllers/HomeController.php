<?php

namespace App\Http\Controllers;

use App\User;
use App\Loging;
use App\RestoModel;
use App\RestoOperationalModel;
use App\Level;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $users = User::count();
        $resto = RestoModel::getRestoData();
        $user_name = auth()->user()->name;
        $user = [
          'user_name' => $user_name,
        ];

        return view('home', compact('resto', 'user'));
    }

    public function getUserData($id) {
      $data = User::getUserData($id);

      return $data;
    }

    public function get_notification_data() {
      $user_id = auth()->user()->id;
      $log = Log::where('id', $user_id)->orderBy('id', 'DESC')->get();
      return $log;
    }

    public function get_notification_detail($user_id) {
      $logs = Log::where('id', $user_id)->orderBy('id', 'DESC')->get();
      return view('notification_detail', compact('logs'));
    }

    public function notification_seen($user_id) {
      $log = Log::where('id', $user_id)->update([
        'aksi' => 'hit notification_seen'
      ]);
      return 'success';
      // return $user_id;
    }

    public function welcome() {
      return view('welcome');
    }

}
