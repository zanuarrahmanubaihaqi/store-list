@extends('layouts.admin')

@section('css')
  <style media="screen">
    .bg-disabled {
      background-color: rgba(0,0,255,0.07);
    }
  </style>
@endsection
@section('main-content')
<div class="row">
  <div class="col">
    <h1 class="h3 mb-4 text-gray-800">Notifications</h1>
  </div>
</div>

<div class="row justify-content-center">
  <div class="col-lg-12">
    <div class="card shadow mb-4">
      <ul class="list-group">
        @foreach ($logs as $log)
          <a href="{{url('report/'.strtolower($log['report']).'/detail/'.$log['id_report'])}}"><li class="list-group-item bg-disabled" aria-disabled="true">
            {{$log['pesan']}} pada {{$log['tanggal']}}
          </li></a>
        @endforeach
      </ul>
    </div>
  </div>
</div>

@endsection

@section('js')

@endsection
