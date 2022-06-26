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
        <h1 class="h3 mb-4 text-gray-800">Order Report</h1>
      </div>
      <div class="col">
        
      </div>
    </div>

    <div class="row justify-content-center">

        <div class="col-lg-12">

            <div class="card shadow mb-4">
                <div class="card-body">
                    <div class="form-group">
                      <label for="user_id">User</label>
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
                        <div class="row">
                            <div class="col-6">
                                <label for="date">Start Date</label>
                                <input type="date" class="form-control" id="start_date" name="start_date">
                            </div>
                            <div class="col-6">
                                <label for="date">End Date</label>
                                <input type="date" class="form-control" id="end_date" name="end_date">
                            </div>
                        </div>
                    </div>
                    <div class="row" style="float: right;">
                        <button type="reset" class="btn btn-warning" onclick="clearData();">Bersihkan</button>
                        &nbsp;
                        <button type="submit" class="btn btn-primary" id="show_data_button" onclick="showData();">Tampilkan</button>
                    </div>
                </div>
            </div>
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
                        <th scope="col">Tanggal Transaksi</th>
                        <th scope="col">Deskripsi</th>
                        <th scope="col">Credit</th>
                        <th scope="col">Debit</th>
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody id="the_body">
                      {{--
                      @foreach ($orderreport as $data)
                      @php
                        $debit = "-";
                        $credit = "-";
                        if (($data->or_credit != 0) || ($data->or_credit != "")) {
                          $credit = $data->or_credit;
                        }
                        if (($data->or_debit != 0) || ($data->or_debit != "")) {
                          $debit = $data->or_debit;
                        }
                        $date = date("Y-m-d", strtotime($data->created_at));
                      @endphp
                        <tr>
                          <td>{{ $date }}</td>
                          <td>{{ $data->order_desc }}</td>
                          <td>{{ $credit }}</td>
                          <td>{{ $debit }}</td>
                          <td>{{ $data->or_order_amount }}</td>
                        </tr>
                      @endforeach
                      --}}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
    </div>
@endsection

@section('js')
  <script type="text/javascript">
  $(document).ready( function () {
    $('#show_data_button').css('display', 'block');
    // $('#table_daily').DataTable({
    //   responsive: true,
    //   sDom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',
    // });
  });

  function clearData() {
    window.location.reload();
  }

  function showData() {
    var startDate = $('#start_date').val();
    var endDate = $('#end_date').val();
    var userId = $('#user_id').val();
    var url = '{{ url('orderreport/get-filtered/') }}' + '/' + startDate + '/' + endDate + '/' + userId;
    var konten = "";

    if (!startDate || !endDate || !user_id) {
      alert('Parameter pencarian tidak lengkap !');
      return false;
    }
    $('#show_data_button').css('display', 'none');

    $('#table_daily').DataTable({
        proccessing: true,
        serverSide: true,
        sDom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',
        ajax: {
            "url": url,
            "data": function(e) {
              // e.start_date = startDate
              // console.log(e);
              // return JSON.stringify(e);
            },
        },
        columns: [
          { "data" : "created_at" },
          { "data" : "order_desc" },
          { "data" : "or_credit" },
          { "data" : "or_debit" },
          { "data" : "or_order_amount" }
        ]
    });
  }
  </script>
@endsection
