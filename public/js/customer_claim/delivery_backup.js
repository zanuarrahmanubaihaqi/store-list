function delivery(root_url) {
    let save_delivery = root_url.concat('claim/customerclaim/save_delivery');
    let get_data = root_url.concat('delivery/delivery/get_data');
    jQuery(document).ready(($) => {
        let table_delivery = $("#table_delivery1").DataTable({
            "oLanguage": {
                "sSearch": "Search:",
                "oPaginate": {
                    "sPrevious": "Previous",
                    "sNext": "Next"
                }
            },
            "JQueryUI":true,
            "lengthChange": false,
            "scrollCollapse":true,
            "paging": false,
            "initComplete": function (settings, json) {  
                $("#table_delivery1").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
            },
        });

        let table_delivery_skeleton = $("#table_delivery_skeleton").DataTable({
            "oLanguage": {
                "sSearch": "Search:",
                "oPaginate": {
                    "sPrevious": "Previous",
                    "sNext": "Next"
                }
            },
            "JQueryUI":true,
            "lengthChange": false,
            "scrollCollapse":true,
            "paging": false,
            "initComplete": function (settings, json) {  
                $("#table_delivery_skeleton").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
            },
        });

        
        $("#form_delivery").find("#btn_min").attr("disabled", true);
		$("#form_delivery").find("#btn_plus").click(function add() {
			$("#form_delivery").find("#btn_min").attr("disabled", false);
		});

		$("#form_delivery").find("#btn_min").click(function subst() {
			let val_qty = $("#qty").val();
			if(val_qty < 2) {
				$("#form_delivery").find("#btn_min").attr("disabled", true);
			}
        });
		$("#input_delivery").on('click', '#save_qty', function(e) {
			e.preventDefault();
            let qty_val = $("#qty").val();
            let tgl_deliv = $("#tgl_deliv").val();
            if(qty_val != "" && tgl_deliv != "") {
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
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert(textStatus +" "+errorThrown);
                        // $("#error_text").text(textStatus +" "+errorThrown);
                        // $("#modal-error-ajax").modal('show');;
                    }
                });
            } else {
                alert("TANGGAL DELIVERY TIDAK BOLEH KOSONG!");
            }
		});

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

            return [day, month, year].join('-');
        }

        function formatDateEdit(date) {
            
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [day, month, year].join('/');
        }

        function listing() {
            $.ajax({
                type: "GET",
                url: get_data,
                dataType: "JSON",
                beforeSend: () => {
                    table_delivery.clear().draw();
                    $("#modal-edit-delivery").html("");
                },
                success: (data) => {
                    function show_table() {
                        $("#skeleton-delivery-table").addClass("remove-skeleton-table");
                        $("#main-delivery-table").removeClass("hide-main-table");
                        $("#main-delivery-table").addClass("show-main-table");
                    }
                    let nomor = 1; 
                    for(let i in data) {
                        let modal_edit_deliv;
                        let btn_edit = "<a href='javascript:;' id='edit-deliv"+data[i].id_delivery+"' class='btn btn-blue icon-left'><i class='entypo-pencil'></i> Edit Delivery</a>";
                        let btn_delete = "<a href='javascript:;' id='modal-delete-deliv"+data[i].id_delivery+"' class='btn btn-danger icon-left'><i class='entypo-trash'></i> Delete Delivery</a>";
                        modal_edit_deliv += 
                        "<div class='modal fade' id='modal-edit-deliv"+data[i].id_delivery+"'>"+
                            "<div class='modal-dialog'>"+
                                "<div class='modal-content'>"+
                                    "<div class='modal-header'>"+
                                       "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"+
                                        "<h4 class='modal-title'>Edit Delivery</h4>"+
                                    "</div>"+
                                    "<form role='form' class='form-horizontal' id='update_delivery"+data[i].id_delivery+"' method='POST'></form>"+
                                    "<div class='modal-body'>"+
                                        "<div class='row'>"+
                                            "<div class='col-md-12'>"+
                                                "<div class='form-group'>"+
                                                    "<label class='col-sm-3 control-label'>Tanggal Delivery</label>"+
                                                    "<div class='col-sm-4'>"+
                                                       " <div class='input-group'>"+
                                                            "<input type='text' class='form-control datepicker' name='tgl_delivery' id='tgl_delivery"+data[i].id_delivery+"' value='"+formatDateEdit(data[i].tgl_delivery)+"' data-format='dd.mm.yyyy' placeholder='06.11.2019' required>"+
                                                            "<div class='input-group-addon'>"+
                                                                "<a href='#'><i class='entypo-calendar'></i></a>"+
                                                            "</div>"+
                                                        "</div>"+
                                                    "</div>"+
                                                "</div>"+
                                                "<br/>"+

                                                "<div class='form-group'>"+
													"<label class='col-sm-5 control-label'>Quantity</label>"+
													"<div class='input-spinner col-sm-3'>"+
														"<button type='button' class='btn btn-blue' id='btn_min"+data[i].id_delivery+"'>-</button>"+
														"<input type='text' id='qty"+data[i].id_delivery+"' name='qty' value='"+data[i].qty+"' class='form-control size-1' value='1' data-min='1'/>"+
														"<button type='button' class='btn btn-blue' id='btn_plus"+data[i].id_delivery+"'>+</button>"+
													"</div>"+
												"</div>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+

                                    "<div class='modal-footer'>"+
										"<button type='button' id='close_sortir"+data[i].id_delivery+"' class='btn btn-danger' data-dismiss='modal'>Batal</button>"+
										"<button type='submit' id='simpan_sortir"+data[i].id_delivery+"' class='btn btn-primary'>Update</button>"
									"</div>"+
                                    "</form>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
                        table_delivery.row.add([
                            ''+nomor+'',
                            ''+formatDate(data[i].tgl_delivery)+'',
                            ''+data[i].qty+'',
                            ''+btn_edit+' '+btn_delete+'',
                        ]);
                        table_delivery.draw(false);
                        $("#modal-edit-delivery").append(modal_edit_deliv);
                        $("#table_delivery1 tr:nth-child("+nomor+") td:nth-child(4)").attr("class", "centered1");
                        $("#table_delivery1").on('click', '#edit-deliv'+data[i].id_delivery+'', function() {
                            $("#modal-edit-deliv"+data[i].id_delivery).modal('show');
                        });
                        $("#tgl_delivery"+data[i].id_delivery).datepicker({
                            altFormat: "yy-mm-dd",
                        });
                        nomor++;
                    }
                    setTimeout(show_table, 2500);
                },
                complete: (data) => {

                },
                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);
                    // $("#error_text").text(textStatus +" "+errorThrown);
                    // $("#modal-error-ajax").modal('show');;
                }
            });
        }

        listing();
    });
}