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
        <h1 class="h3 mb-4 text-gray-800">Data Order</h1>
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
                        <th scope="col">ID User</th>
                        <th scope="col">Tgl Transaksi</th>
                        <th scope="col">Deskripsi</th>
                        <th scope="col">Debit/Credit</th>
                        <th scope="col">Jml Bayar</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach ($order as $data)
                      @php
                        $date = date("Y-m-d", strtotime($data->created_at));
                      @endphp
                        <tr>
                          <td>{{ $data->order_user_id}}</td>
                          <td>{{ $date }}</td>
                          <td>{{ $data->order_desc }}</td>
                          <td>{{ $data->order_status }}</td>
                          <td>{{ $data->order_amount }}</td>
                        </tr>
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
          <form action="{{route('order.tambah')}}" method="post">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Tambah Transaksi</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              @csrf
              <div class="form-group">
                <label>Nama</label>
                  <select class="form-control" id="user_id" name="user_id">
                    <option value="0">-</option>
                    @foreach ($user as $usr)
                      @if ($usr->id != 1)
                        <option value="{{ $usr->id }}">{{ $usr->name }}</option>
                      @endif
                    @endforeach
                  </select>
              </div>
              <div class="form-group">
                <label>Transaksi</label>
                  <select class="form-control" id="product_id" name="product_id" onchange="setOrderStatus()">
                    <option value="0">-</option>
                    @foreach ($product as $prd)
                        <option value="{{ $prd->product_id }}">{{ $prd->product_transaction_name }}</option>
                    @endforeach
                  </select>
              </div>
              <div class="form-group">
                <label>Debit/Credit</label>
                <input type="text" id="debcrd" name="debcrd" class="form-control" readonly>
                <input type="hidden" id="order_desc" name="order_desc">
              </div>
              <div class="form-group">
                <label>Jumlah Bayar</label>
                <input type="text" id="order_amount" name="order_amount" class="form-control">
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

  function setOrderStatus() {
    var product_id = $('#product_id').val();
    var url = '{{ url('product/get-data/') }}';
    var status = "";
    var desc = "";

    $.ajax({
      type : "GET",
      url : url,
      dataType : 'JSON',
      success : function(e) {
        var i;
        for (i = 0; i < e.length; ++i) {
            if (e[i].product_id == product_id) {
              status = e[i].product_type;
              status = status.substring(0, 1);
              desc = e[i].product_transaction_name;
            }
        }
        $('#debcrd').val(status);
        $('#order_desc').val(desc);
      }
    });
  }
  </script>
@endsection
