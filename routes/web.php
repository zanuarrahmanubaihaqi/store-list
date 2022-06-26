<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/welcome', function () {
    return view('welcome');
})->name('welcome');

Route::get('/underconstruction', function () {
    return view('underconstruction');
})->name('underconstruction');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
// Route::get('/home', 'HomeController@welcome')->name('home');

Route::group([
    'prefix'=>'resto',
    'as'=>'resto.'], 
        function(){
            Route::get('/', [
                'as' => 'index',
                'uses' => 'RestoController@index'
            ]);
            Route::get('/show', [
                'as' => 'show',
                'uses' => 'RestoController@show'
            ]);
            Route::post('/store', [
                'as' => 'store',
                'uses' => 'RestoController@store'
            ]);
            Route::get('/update/{id}', [
                'as' => 'update',
                'uses' => 'RestoController@update'
            ]);
            Route::get('/delete/{id}', [
                'as' => 'delete',
                'uses' => 'RestoController@delete'
            ]);
            Route::get('/get-filtered/{data}', [
                'as' => 'get-filtered',
                'uses' => 'RestoController@getFilteredData'
            ]);
            Route::get('/get-detail/{id}', [
                'as' => 'get-detail',
                'uses' => 'RestoController@getDetailResto'
            ]);
});

Route::get('clear-app', function () {
    try {
        Artisan::call('cache:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        Artisan::call('config:clear');
        return '<pre>App Cleared !</pre>';
    } catch (Exception $e) {
        report($e);
        return '<pre>Failed to clear app.</pre>';
    }
});

Route::get('phpinfo', function (){
    return view('phpinfo');
});

Route::get('emergency-logout', function (){
    Auth::logout();
    return view('welcome');
});