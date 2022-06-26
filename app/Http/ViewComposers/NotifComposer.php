<?php

namespace App\Http\ViewComposers;

use Illuminate\View\View;
use App\Loging;

class NotifComposer
{
    public function compose(View $view)
    {
        if (auth()->check()) {
          $user_id = auth()->user()->id;
          $logs = Loging::where('id', $user_id)->orderBy('id', 'DESC')->get();
          $view->with('logs', $logs);
        } else {
          $logs = '';
          $view->with('logs', $logs);
        }
    }
}
