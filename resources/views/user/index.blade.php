@extends('layouts.admin')

@section('css')
  <style media="screen">
  #table_daily {
    /* overflow-x: auto;
    overflow-y: visible; */
  }
  </style>
@endsection

@section('main-content')

  @if (Session::has('message'))
    <div class="alert alert-success" role="alert">
      {{Session::get('message')}}
    </div>
  @endif
    <!-- Page Heading -->
    <div class="row">
      <div class="col">
        <h1 class="h3 mb-4 text-gray-800">Data User</h1>
      </div>
      <div class="col">
        <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#add_modal" name="button">Tambah</button>
      </div>
    </div>

    <div class="row justify-content-center">

        <div class="col-lg-12">

            <div class="card shadow mb-4">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table" id="table_daily">
                    <thead>
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Nama</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach ($users as $data)
                        <tr>
                          <td>{{ $data->id }}</td>
                          <td>{{ $data->name }}</td>
                        </tr>

                        <div class="modal fade" id="edit_modal{{$data->id}}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <form action="{{route('user_management.update', $data->id)}}" method="get">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel">Edit User {{$data->name}}</h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                  @csrf
                                  <div class="form-group">
                                    <label>Nama</label>
                                    <input type="text" name="name" class="form-control" value="{{$data->name}}">
                                  </div>
                                  <div class="form-group">
                                    <label>E-Mail</label>
                                    <input type="text" name="email" class="form-control" value="{{$data->email}}">
                                  </div>
                                  <div class="row">
                                    <div class="col">
                                      <div class="form-group">
                                        <label>Username</label>
                                        <input type="text" name="username" class="form-control" value="{{$data->username}}">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                  <button type="submit" class="btn btn-primary">Save</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      @endforeach
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="add_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form action="{{route('user_management.store')}}" method="post">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Tambah User</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              @csrf
              <div class="form-group">
                <label>Nama</label>
                <input type="text" name="name" class="form-control">
              </div>
              <div class="form-group">
                <label>E-Mail</label>
                <input type="text" name="email" class="form-control">
              </div>
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" class="form-control">
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <label>Password</label>
                    <input type="text" name="password" class="form-control">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
@endsection

@section('js')
  <script type="text/javascript">
  $(document).ready( function () {
    $('#table_daily').DataTable({
      responsive: true,
      sDom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',
    });
  });
  </script>
@endsection
