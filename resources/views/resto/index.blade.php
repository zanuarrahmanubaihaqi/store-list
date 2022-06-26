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
        <h1 class="h3 mb-4 text-gray-800">Daftar Restoran</h1>
      </div>
      <div class="col">
        @if ($user_level == 1)
          <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#add_modal" name="button">Tambah</button>
        @endif
      </div>
    </div>

    <div class="row justify-content-center">

        <div class="col-lg-12">

            <div class="card shadow mb-4">
                <div class="card-body">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-4">
                                <label for="ro_resto_name">Nama Resto</label>
                                <input type="text" class="form-control" id="ro_resto_name" name="ro_resto_name"> 
                            </div>
                            <div class="col-2">
                                <label for="ro_close_minute">Waktu Buka</label>
                                <select class="form-control" id="ro_open_identifier" name="ro_open_identifier" onchange="setOpenTime();">
                                    <option value="0">-</option>
                                    <option value="am">am</option>
                                    <option value="pm">pm</option>
                                </select>
                            </div>  
                            <div class="col-3">
                                <label for="ro_open_hour">Jam Buka</label>
                                <input type="text" class="form-control" id="ro_open_hour" name="ro_open_hour" value="0" max="12" min="0" maxlength="2" readonly>
                            </div>
                            <div class="col-3">
                                <label for="ro_open_minute">Menit Buka</label>
                                <input type="text" class="form-control" id="ro_open_minute" name="ro_open_minute" value="0" max="60" min="0" maxlength="2" readonly>
                            </div>                                                   
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col-4">
                                <label for="date">Tanggal Buka</label>
                                <input type="date" class="form-control" id="search_date" name="search_date">      
                            </div>
                            <div class="col-2">
                                <label for="ro_close_minute">Waktu Tutup</label>
                                <select class="form-control" id="ro_close_identifier" name="ro_close_identifier" onchange="setCloseTime();">
                                    <option value="0">-</option>
                                    <option value="pm">pm</option>
                                    <option value="am">am</option>
                                </select>
                            </div>
                            <div class="col-3">
                                <label for="ro_close_hour">Jam Tutup</label>
                                <input type="text" class="form-control" id="ro_close_hour" name="ro_close_hour" value="0" max="12" min="0" maxlength="2" readonly>
                            </div>
                            <div class="col-3">
                                <label for="ro_close_minute">Menit Tutup</label>
                                <input type="text" class="form-control" id="ro_close_minute" name="ro_close_minute" value="0" max="60" min="0" maxlength="2" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="float: right;">
                        <p style="color: red;vertical-align: middle;">*dapat diisikan semua atau salah satu &nbsp; </p>
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

            <div class="card shadow mb-4" id="card_table_daily">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table" id="table_daily">
                    <thead>
                      <tr>
                        <th scope="col">No</th>
                        <th scope="col">Nama Restoran</th>
                        <th scope="col">Aksi</th>
                      </tr>
                    </thead>
                    <tbody id="the_body">
                        @php
                          $i = 1;
                        @endphp
                        @foreach ($resto as $data)
                            <tr>
                              <td>{{ $i }}</td>
                              <td>{{ $data->resto_name }}</td>
                              <td>
                                  <button data-toggle="modal" data-target="#detail_modal" class="btn btn-success btn-sm" name="button" onclick="showDetail({{ $data->resto_id }});">Detail</button>
                                  <!-- <button data-toggle="modal" data-target="#edit_modal" class="btn btn-primary btn-sm" name="button">Edit</button> -->
                                  <!-- <a href="{{route('resto.delete', $data->resto_id)}}" onclick="return confirm('Yakin ingin menghapus obat ini ?');" class="btn btn-danger btn-sm" name="button">Hapus</a> -->
                                  <!-- <button data-toggle="modal" data-target="#edit_modal" class="btn btn-danger btn-sm" name="button">Hapus</button> -->
                              </td>
                            </tr>
                            @php
                              $i++;
                            @endphp
                        @endforeach
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="detail_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Detail Resto</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="content_detail">
              
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="add_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form action="{{route('resto.store')}}" method="POST">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Tambah Resto</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="clearAddModal();">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              @csrf
              <div class="form-group">
                <label>Nama Resto</label>
                <input type="text" name="resto_name" id="resto_name" class="form-control">
                <input type="hidden" name="temp_hari" id="temp_hari" value="1">
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col-6">
                    <label for="ro_day_open1">Hari Buka</label>
                    <select class="form-control" id="ro_day_open1" name="ro_day_open1">
                        <option value="1">Mon</option>
                        <option value="2">Tue</option>
                        <option value="3">Wed</option>
                        <option value="4">Thu</option>
                        <option value="5">Fri</option>
                        <option value="6">Sat</option>
                        <option value="7">Sun</option>
                    </select> 
                  </div>
                  <div class="col-6">
                    <label for="ro_day_close1">Hari Tutup</label>
                    <select class="form-control" id="ro_day1_close" name="ro_day_close1">
                        <option value="1">Mon</option>
                        <option value="2">Tue</option>
                        <option value="3">Wed</option>
                        <option value="4">Thu</option>
                        <option value="5">Fri</option>
                        <option value="6">Sat</option>
                        <option value="7">Sun</option>
                    </select> 
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                    <div class="col-3">
                        <label for="ro_open_identifier">Waktu Buka</label>
                        <select class="form-control" id="ro_open_identifier1" name="ro_open_identifier1">
                            <option value="0">-</option>
                            <option value="am">am</option>
                            <option value="pm">pm</option>
                        </select>
                    </div>  
                    <div class="col-3">
                        <label for="ro_open_hour1">Jam Buka</label>
                        <input type="text" class="form-control" id="ro_open_hour1" name="ro_open_hour1" value="0" max="12" min="0" maxlength="2">
                    </div>
                    <div class="col-3">
                        <label for="ro_open_minute1">Menit Buka</label>
                        <input type="text" class="form-control" id="ro_open_minute1" name="ro_open_minute1" value="0" max="60" min="0" maxlength="2">
                    </div>                                                   
                </div>
              </div>
              <div class="form-group">
                <div class="row">
                    <div class="col-3">
                        <label for="ro_close_identifier1">Waktu Tutup</label>
                        <select class="form-control" id="ro_close_identifier1" name="ro_close_identifier1">
                            <option value="0">-</option>
                            <option value="am">am</option>
                            <option value="pm">pm</option>
                        </select>
                    </div>  
                    <div class="col-3">
                        <label for="ro_close_hour1">Jam Tutup</label>
                        <input type="text" class="form-control" id="ro_close_hour1" name="ro_close_hour1" value="0" max="12" min="0" maxlength="2">
                    </div>
                    <div class="col-3">
                        <label for="ro_close_minute1">Menit Tutup</label>
                        <input type="text" class="form-control" id="ro_close_minute1" name="ro_close_minute1" value="0" max="60" min="0" maxlength="2">
                    </div>                                                   
                </div>
              </div>
              <div id="content_hari">
                
              </div>
              <div class="form-group">
                <button type="button" class="btn btn-success" onclick="addHari();">Tambah Hari</button> <button type="button" class="btn btn-warning" onclick="removeHari();">Hapus Hari</button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="clearAddModal();">Cancel</button>
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
    $('#show_data_button').css('display', 'block');
    tableDaily = $('#table_daily').DataTable({
                    responsive: true,
                    sDom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',
                  });
    $('#table_daily_filter').css('display', 'none');
  });

  function clearData() {
    window.location.reload();
  }

  function addHari() {
    var jmlHari = $('#temp_hari').val();
    var ke = parseInt(jmlHari) + 1;
    $('#temp_hari').val(ke);

    if (ke == 8) {
      return false;
    }

    content = ""
    content +=  '<div id="content_hari' + ke + '" class="add-hari">' + 
                  '<div class="form-group">' +
                    '<div class="row">' +
                      '<div class="col-6">' +
                        '<label for="ro_day_open"' + ke + '>Hari Buka</label>' +
                        '<select class="form-control" id="ro_day_open"' + ke + ' name="ro_day_open"' + ke + '>' +
                            '<option value="1">Mon</option>' +
                            '<option value="2">Tue</option>' +
                            '<option value="3">Wed</option>' +
                            '<option value="4">Thu</option>' +
                            '<option value="5">Fri</option>' +
                            '<option value="6">Sat</option>' +
                            '<option value="7">Sun</option>' +
                        '</select>' +
                      '</div>' +
                      '<div class="col-6">' +
                        '<label for="ro_day_close' + ke + '">Hari Tutup</label>' +
                        '<select class="form-control" id="ro_day' + ke + '_close" name="ro_day_close' + ke + '">' +
                            '<option value="1">Mon</option>' +
                            '<option value="2">Tue</option>' +
                            '<option value="3">Wed</option>' +
                            '<option value="4">Thu</option>' +
                            '<option value="5">Fri</option>' +
                            '<option value="6">Sat</option>' +
                            '<option value="7">Sun</option>' +
                        '</select>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<div class="row">' +
                        '<div class="col-3">' +
                            '<label for="ro_open_identifier' + ke + '">Waktu Buka</label>' +
                            '<select class="form-control" id="ro_open_identifier' + ke + '" name="ro_open_identifier' + ke + '">' +
                                '<option value="0">-</option>' +
                                '<option value="am">am</option>' +
                                '<option value="pm">pm</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="col-3">' +
                            '<label for="ro_open_hour' + ke + '">Jam Buka</label>' +
                            '<input type="text" class="form-control" id="ro_open_hour' + ke + '" name="ro_open_hour' + ke + '" value="0" max="12" min="0" maxlength="2">' +
                        '</div>' +
                        '<div class="col-3">' +
                            '<label for="ro_open_minute' + ke + '">Menit Buka</label>' +
                            '<input type="text" class="form-control" id="ro_open_minute' + ke + '" name="ro_open_minute' + ke + '" value="0" max="60" min="0" maxlength="2">' +
                        '</div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<div class="row">' +
                        '<div class="col-3">' +
                            '<label for="ro_close_identifier' + ke + '">Waktu Tutup</label>' +
                            '<select class="form-control" id="ro_close_identifier' + ke + '" name="ro_close_identifier' + ke + '">' +
                                '<option value="0">-</option>' +
                                '<option value="am">am</option>' +
                                '<option value="pm">pm</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="col-3">' +
                            '<label for="ro_close_hour' + ke + '">Jam Tutup</label>' +
                            '<input type="text" class="form-control" id="ro_close_hour' + ke + '" name="ro_close_hour' + ke + '" value="0" max="12" min="0" maxlength="2">' +
                        '</div>' +
                        '<div class="col-3">' +
                            '<label for="ro_close_minute' + ke + '">Menit Tutup</label>' +
                            '<input type="text" class="form-control" id="ro_close_minute' + ke + '" name="ro_close_minute' + ke + '" value="0" max="60" min="0" maxlength="2">' +
                        '</div>' +                                           
                    '</div>' +
                  '</div>' +
                '</div>';
    $('#content_hari').append(content);
  }

  function removeHari() {
    var jmlHari = $('#temp_hari').val();

    if (parseInt(jmlHari) == 1) {
      return false;
    }

    $('#content_hari' + parseInt(jmlHari)).remove(); 
  }

  function setOpenTime() {
    if ($('#ro_open_identifier').val() != 0) {
      $('#ro_open_hour').removeAttr('readonly');
      $('#ro_open_minute').removeAttr('readonly');
    } else {
      $('#ro_open_hour').attr('readonly', true);
      $('#ro_open_minute').attr('readonly', true);
    }
  }

  function setCloseTime() {
    if ($('#ro_close_identifier').val() != 0) {
      $('#ro_close_hour').removeAttr('readonly');
      $('#ro_close_minute').removeAttr('readonly');
    } else {
      $('#ro_close_hour').attr('readonly', true);
      $('#ro_close_minute').attr('readonly', true);
    }
  }

  function showData() {
    var restoName = $('#ro_resto_name').val();
    var openHour = $('#ro_open_hour').val();
    var openMinute = $('#ro_open_minute').val();
    var openIdentifier = $('#ro_open_identifier').val() == 0 ? "" : $('#ro_open_identifier').val();
    var searchDate = $('#search_date').val();
    var closeHour = $('#ro_close_hour').val();
    var closeMinute = $('#ro_close_minute').val();
    var closeIdentifier = $('#ro_close_identifier').val() == 0 ? "" : $('#ro_close_identifier').val();
    const jsonData = JSON.stringify({
                      "ro_resto_name" : restoName, 
                      "ro_open_hour" : openHour, 
                      "ro_open_minute" : openMinute, 
                      "ro_open_identifier" : openIdentifier, 
                      "search_date" : searchDate, 
                      "ro_close_hour" : closeHour, 
                      "ro_close_minute" : closeMinute, 
                      "ro_close_identifier" : closeIdentifier
                    });
    var url = '{{ url('resto/get-filtered/') }}' + '/' + jsonData;
    var konten = "";

    if (!restoName && !openHour && !openMinute && !openIdentifier && !searchDate && !closeHour && !closeMinute && !closeIdentifier) {
      alert('Parameter pencarian tidak ada!');
      return false;
    }
    $('#show_data_button').css('display', 'none');
    tableDaily.destroy();
    tableDaily.clear().draw();
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
        createdRow: function(row, data, index) {
            question = "Yakin ingin menghapus resto ini ?";
            urlDelete = "{{ route('resto.delete', '') }}"+"/";
            urlDelete += data.resto_id;
            dataHtml=  '<button data-toggle="modal" data-target="#detail_modal" class="btn btn-success btn-sm" name="button" onclick="showDetail(' + data.resto_id + ');">Detail</button> ';
            // dataHtml+=      '<button data-toggle="modal" data-target="#edit_modal" class="btn btn-primary btn-sm" name="button">Edit</button> ';
            // dataHtml+=      '<button data-toggle="modal" data-target="#edit_modal" class="btn btn-danger btn-sm" name="button">Hapus</button>';

                $("td", row).eq(2).html(dataHtml);
            
        },
        columns: [
          { "data" : "resto_id" },
          { "data" : "resto_name" },
          { "data" : "resto_name" }
        ]
    });
    $('#table_daily_filter').css('display', 'none');
  }

  function showDetail(id) {
    var url = '{{ url('resto/get-detail/') }}' + '/' + id;
    detcontent = "";
    $('#detcontent').remove();
    $.ajax({
      type : "GET",
      url : url,
      dataType : 'JSON',
      success : function(e) {
        var i;
        detcontent += '<div id="detcontent">' +
                        '<div class="form-group">' +
                          '<label style="font-size : 14px; font-weight : bold;">' + e[0].resto_name +'</label>' +
                        '</div>' +
                        '<div class="form-group">';
        for (i = 0; i < e.length; ++i) {
          open_hour = (e[i].ro_open_hour).toString().length > 1 ? e[i].ro_open_hour : '0' + e[i].ro_open_hour;
          open_minute = (e[i].ro_open_minute).toString().length > 1 ? e[i].ro_open_minute : '0' + e[i].ro_open_minute;
          close_hour = (e[i].ro_close_hour).toString().length > 1 ? e[i].ro_close_hour : '0' + e[i].ro_close_hour;
          close_minute = (e[i].ro_close_minute).toString().length > 1 ? e[i].ro_close_minute : '0' + e[i].ro_close_minute;
          detcontent += '<label>' + e[i].ro_day + ', </label>' +
                          ' ' + open_hour + ':' + open_minute + ' ' + e[i].ro_open_time_identifier + ' - ' + close_hour + ':' + close_minute + ' ' + e[i].ro_close_time_identifier + '<br>';
        }

        detcontent += '</div>' +
                      '</div>';
        $('#content_detail').append(detcontent);
      }
    });    
  }

  function clearAddModal() {
    $('.add-hari').remove();
    $('#resto_name').val();
    $('#ro_day_open1').val(1);
    $('#ro_day_close1').val(1);
    $('#ro_open_identifier1').val(0);
    $('#ro_close_identifier1').val(0);
    $('#ro_open_hour1').val(0);
    $('#ro_open_minute1').val(0);
    $('#ro_close_hour1').val(0);
    $('#ro_close_minute1').val(0);
  }
  </script>
@endsection
