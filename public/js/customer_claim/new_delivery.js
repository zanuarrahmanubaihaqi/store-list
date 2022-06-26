function delivery(root_url, role) {
    let save_delivery = root_url.concat('claim/customerclaim/save_delivery');
    let get_data = root_url.concat('delivery/delivery/get_data');
    let edit_data = root_url.concat('delivery/delivery/update_data');
    let delete_data = root_url.concat('delivery/delivery/delete_data');
    jQuery(document).ready(($) => {
        const delivery_table = $('#delivery_table');
        // loadTableDelivery(get_data, delivery_table);
        // selectProses();
        // spinner();
        // saveDelivery(get_data, save_delivery, delivery_table);

        // $("#delivery_table").on( 'column-sizing.dt', function (e, settings) {
        //     $(".dataTables_scrollHeadInner").css( "width", "100%" );
        // });
    });
}


function selectProses() {
    const proses_deliv = $("#proses_deliv");
    proses_deliv.change(() => {
        getProsesVal = proses_deliv.val();
        selectCustomer(getProsesVal);
    });
}

function selectCustomer(proses) {
    let customer_deliv = $("#customer_deliv");
    customer_deliv.empty();
    if(proses === "PI") {
        customer_deliv.append($('<option></option>').val("AHM").html("AHM"));
        customer_deliv.append($('<option></option>').val("AVI").html("AVI"));
        customer_deliv.append($('<option></option>').val("ADM").html("ADM"));
        customer_deliv.append($('<option></option>').val("DNIA").html("DNIA"));
        customer_deliv.append($('<option></option>').val("HMMI").html("HMMI"));
        customer_deliv.append($('<option></option>').val("YUTAKA").html("YUTAKA"));
        customer_deliv.append($('<option></option>').val("TACI").html("TACI"));
        customer_deliv.append($('<option></option>').val("TAM").html("TAM"));
        customer_deliv.append($('<option></option>').val("TMMIN").html("TMMIN"));
        customer_deliv.append($('<option></option>').val("AWP").html("AWP"));
    } else if(proses === "PT") {
        customer_deliv.append($('<option></option>').val("AHM").html("AHM"));
        customer_deliv.append($('<option></option>').val("AVI").html("AVI"));
        customer_deliv.append($('<option></option>').val("YUTAKA").html("YUTAKA"));
        customer_deliv.append($('<option></option>').val("TAM").html("TAM"));
        customer_deliv.append($('<option></option>').val("ADM").html("ADM"));
    } else if(proses === "SB") {
        customer_deliv.append($('<option></option>').val("AHM").html("AHM"));
        customer_deliv.append($('<option></option>').val("IAMI").html("IAMI"));
        customer_deliv.append($('<option></option>').val("SUZUKI").html("SUZUKI"));
        customer_deliv.append($('<option></option>').val("ADM").html("ADM"));
    } else if(proses === "BM") {
        customer_deliv.append($('<option></option>').val("SUZUKI").html("SUZUKI"));
        customer_deliv.append($('<option></option>').val("ADM").html("ADM"));
    }
}

function loadTableDelivery(get_data, delivery_table) {
    delivery_table.DataTable({
        "oLanguage": {
            "sSearch": "Search:",
            "oPaginate": {
                "sPrevious": "Previous",
                "sNext": "Next"
            }
        },
        "initComplete": function (settings, json) {  
            $("#delivery_table").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
        },
        ajax: {
            "url": get_data,
            "type": "GET"
        },
        destroy: true,
        processing: true,
        deferRender: true,
        columns: [
            {
                data: 'no'
            },
            {
                data: 'tgl_delivery'
            },
            {
                data: 'qty'
            },
            {
                data: 'proses'
            },
            {
                data: 'customer'
            }
        ]
    });
}

function saveDelivery(get_data, save_delivery, delivery_table) {
    $("#save_qty").click((e) => {
        e.preventDefault();
        let qty_val = $("#qty").val();
        let tgl_deliv = $("#tgl_deliv").val();
        if(qty_val != "" && tgl_deliv != "") {
            let test = 0;
            $.ajax({
                url: save_delivery,
                type: "POST",
                data: $("#input_delivery").serialize(),
                dataType: "JSON",
                cache: false,
                success: function(data) {
                    var opts = {
                        "closeButton": true,
                        "debug": false,
                        "positionClass": "toast-top-right",
                        "onclick": null,
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "5000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut"
                    };
                    toastr.success('DELIVERY SUKSES TERSIMPAN', "SUCCESS", opts);
                },
                complete: function() {
                    $("#tgl_deliv").val(null);
                    $("#qty").val(1);
                    $("#form_delivery").find("#btn_min").attr("disabled", true);
                    $("#form_delivery").modal('hide');
                    loadTableDelivery(get_data, delivery_table);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(textStatus +" "+errorThrown);
                }
            });
        } else {
            alert("TANGGAL DELIVERY TIDAK BOLEH KOSONG!");
        }
    });
}

function spinner() {
    $('.input-spinner').find('[type="text"]').keyup(function() {
        var value = $(this).val();
        var isNum = $.isNumeric(value);
        if($(this).val() == "" || $(this).val() <= 0 || !isNum) {
            $(this).val(0);
        } else if($(this).val() > 0) {
             $(this).val().replace(0,'');
           }

        if($(this).val()!=0) {
            var text = $(this).val();
            if(text.slice(0,1)==0) {
                $(this).val(text.slice(1,text.length));   
            }
          }
    });
}

function formatDate(date) {
    let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
                "September", "Oktober", "November", "Desember"];
    let d = new Date(date),
        month = '' + (bulan[d.getMonth()]),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join(' ');
}