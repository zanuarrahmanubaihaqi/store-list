function delivery(root_url, count_delivery, role, get_data_delivery) {
    let save_delivery = root_url.concat('claim/customerclaim/save_delivery');
    let get_data = root_url.concat('delivery/delivery/get_data');
    let edit_data = root_url.concat('delivery/delivery/update_data');
    let delete_data = root_url.concat('delivery/delivery/delete_data');
    let cnt_delivery = count_delivery;
    let data_delivery = JSON.parse(get_data_delivery);
    let change = false;
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
            "lengthChange": true,
            "scrollCollapse":true,
            "paging": true,
            "initComplete": function (settings, json) {  
                $("#table_delivery1").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
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

            return [day, month, year].join(' ');
        }
        function listing() {
            $.ajax({
                type: "GET",
                url: get_data,
                dataType: "JSON",
                beforeSend: () => {
                    
                },
                success: (datanya) => {
                    let data = datanya.data;
                    let count_data = datanya.count_data;
                    
                    function cek_updateData() {
                        let sum_old_data = 0;
                        let sum_new_data = 0;
                        for(let j in data_delivery) {
                            sum_old_data += parseInt(data_delivery[j].qty);
                        }

                        for(let i in data) {
                            sum_new_data += parseInt(data[i].qty);
                        }

                        if(sum_old_data != sum_new_data) {
                            data_delivery = data;
                            change = true;
                        }

                        return change;
                    }

                    function show_table() {
                        $("#skeleton-delivery-table").removeClass("show-skeleton-table");
                        $("#skeleton-delivery-table").addClass("remove-skeleton-table");
                        $("#main-delivery-table").removeClass("hide-main-table");
                        $("#main-delivery-table").addClass("show-main-table");
                    }

                    if(cnt_delivery != count_data || cek_updateData()) {
                        if(cek_updateData()) {
                            change = false;
                        }
                        
                        cnt_delivery = count_data;
                        table_delivery.clear().draw();
                        $("#main-delivery-table").removeClass("show-main-table");
                        $("#main-delivery-table").addClass("hide-main-table");
                        $("#skeleton-delivery-table").addClass("show-skeleton-table");
                        $("#modal-edit-delivery").html("");
                        $("#modal-delete-delivery").html("");
                        let nomor = 1; 
                        for(let i in data) {
                            let modal_edit_deliv = '';
                            let modal_delete_deliv = '';
                            let btn_edit;
                            let btn_delete;
                            if(role === 'User') {
                                btn_edit = "<a disabled class='btn btn-blue icon-left'><i class='entypo-pencil'></i> Edit Delivery</a>";
                            btn_delete = "<a disabled class='btn btn-danger icon-left'><i class='entypo-trash'></i> Delete Delivery</a>";
                            } else {
                                btn_edit = "<a href='javascript:;' id='edit-deliv"+data[i].id_delivery+"' class='btn btn-blue icon-left'><i class='entypo-pencil'></i> Edit Delivery</a>";
                                btn_delete = "<a href='javascript:;' id='delete-deliv"+data[i].id_delivery+"' class='btn btn-danger icon-left'><i class='entypo-trash'></i> Delete Delivery</a>";
                            }
                            
                            modal_edit_deliv += 
                            "<div class='modal fade' id='modal-edit-deliv"+data[i].id_delivery+"'>"+
                                "<div class='modal-dialog'>"+
                                    "<div class='modal-content'>"+
                                        "<div class='modal-header'>"+
                                        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"+
                                            "<h4 class='modal-title'>Edit Delivery - <b>"+formatDate(data[i].tgl_delivery)+"</b></h4>"+
                                        "</div>"+
                                    
                                        "<div class='modal-body'>"+
                                            "<div class='row'>"+
                                                "<div class='col-md-12'>"+
                                                    "<div class='form-group'>"+
                                                        "<label class='col-sm-2 control-label' style='text-align:left;'>Quantity</label>"+
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
                                            "<button type='button' id='close_delivery"+data[i].id_delivery+"' class='btn btn-danger' data-dismiss='modal'>Batal</button>"+
                                            "<button type='submit' id='update_delivery"+data[i].id_delivery+"' class='btn btn-primary'>Update</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";

                            modal_delete_deliv += 
                            "<div class='modal fade' id='modal-delete-deliv"+data[i].id_delivery+"'>"+
                                "<div class='modal-dialog'>"+
                                    "<div class='modal-content'>"+
                                        "<div class='modal-header'>"+
                                        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"+
                                            "<h4 class='modal-title'>Delete Delivery - <b>"+formatDate(data[i].tgl_delivery)+"</b></h4>"+
                                        "</div>"+
                                    
                                        "<div class='modal-body'>"+
                                            "<div class='row'>"+
                                                "<div class='col-md-12'>"+
                                                    "<h3>Anda yakin ingin menghapus delivery tanggal "+formatDate(data[i].tgl_delivery)+"?</h3>"+
                                                "</div>"+
                                            "</div>"+
                                        "</div>"+

                                        "<div class='modal-footer'>"+
                                            "<button type='button' id='close_delete_delivery"+data[i].id_delivery+"' class='btn btn-info' data-dismiss='modal'>Batal</button>"+
                                            "<button type='submit' id='delete_delivery"+data[i].id_delivery+"' class='btn btn-danger'>Delete</button>"+
                                        "</div>"+
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
                            $("#modal-delete-delivery").append(modal_delete_deliv);
                            $("#table_delivery1 tr:nth-child("+nomor+") td:nth-child(3)").attr("id", "qty_val"+data[i].id_delivery+"");
                            $("#table_delivery1 tr:nth-child("+nomor+")").attr("id", "delete_qty_val"+data[i].id_delivery+"");
                            $("#table_delivery1").on('click', '#edit-deliv'+data[i].id_delivery+'', function() {
                                $("#modal-edit-deliv"+data[i].id_delivery).modal('show');
                            });

                            $("#table_delivery1").on('click', '#delete-deliv'+data[i].id_delivery+'', function() {
                                $("#modal-delete-deliv"+data[i].id_delivery).modal('show');
                            });

                            // $("#tgl_delivery"+data[i].id_delivery).datepicker({
                            //     altFormat: "yy-mm-dd",
                            // });

                            let qty = $("#qty"+data[i].id_delivery).val();
                            $(".input-spinner").on('click', '#btn_min'+data[i].id_delivery+'', function() {
                                qty--;
                                if(qty <= 1) {
                                    $("#btn_min"+data[i].id_delivery).attr("disabled", true);
                                }
                                $("#qty"+data[i].id_delivery).val(qty);
                            });

                            $(".input-spinner").on('click', '#btn_plus'+data[i].id_delivery+'', function() {
                                qty++;
                                if(qty > 1) {
                                    $("#btn_min"+data[i].id_delivery).attr("disabled", false);
                                }
                                $("#qty"+data[i].id_delivery).val(qty);
                            });

                            $(".input-spinner").on('keyup', '#qty'+data[i].id_delivery+'', function() {
                                qty = $(this).val();
                            });

                            $('.input-spinner').find('#qty'+data[i].id_delivery+'').keyup(function() {
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

                            function update_data_delivery() {
                                $(".modal-footer").on('click', '#update_delivery'+data[i].id_delivery+'', function() {
                                    $.ajax({
                                        type: "POST",
                                        url: edit_data,
                                        dataType: "JSON",
                                        data: {
                                            id_delivery: data[i].id_delivery,
                                            tgl: formatDate(data[i].tgl_delivery),
                                            qty: qty
                                        },
                                        cache: false,
                                        beforeSend: () => {
        
                                        },
                                        success: (data_update) => {
                                            if(!data_update) {
                                                alert("Sorry, the server cannot respond. please refresh this page.")
                                                return false;
                                            }
                                            $("#qty_val"+data[i].id_delivery).text(qty);
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
                                            toastr.success('DELIVERY TANGGAL '+formatDate(data[i].tgl_delivery)+' TELAH DI EDIT', "SUCCESS", opts);
                                        },
                                        error: (jqXHR, textStatus, errorThrown) => {
                                            alert(textStatus +" "+errorThrown);
                                            // $("#error_text").text(textStatus +" "+errorThrown);
                                            // $("#modal-error-ajax").modal('show');;
                                        },
                                        complete: () => {
                                            
                                            $("#modal-edit-deliv"+data[i].id_delivery).modal('hide');
                                        }
                                    });
                                });
                            }

                            function delete_data_delivery() {
                                $(".modal-footer").on('click', '#delete_delivery'+data[i].id_delivery+'', function() {
                                    $.ajax({
                                        type: "POST",
                                        url: delete_data,
                                        dataType: "JSON",
                                        data: {
                                            id_delivery: data[i].id_delivery,
                                            tgl: formatDate(data[i].tgl_delivery)
                                        },
                                        cache: false,
                                        beforeSend: () => {

                                        },
                                        success: (data_delete) => {
                                            if(!data_delete) {
                                                alert("Sorry, the server cannot respond. please refresh this page.")
                                                return false;
                                            }
                                            notification_delete();
                                            function notification_delete() {
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
                                                toastr.error('DELIVERY TANGGAL '+formatDate(data[i].tgl_delivery)+' TELAH DI HAPUS', "SUCCESS", opts);
                                            }
                                        },
                                        error: (jqXHR, textStatus, errorThrown) => {
                                            alert(textStatus +" "+errorThrown);
                                            // $("#error_text").text(textStatus +" "+errorThrown);
                                            // $("#modal-error-ajax").modal('show');;
                                        },
                                        complete: () => {
                                            $("#modal-delete-deliv"+data[i].id_delivery).modal('hide');
                                        }
                                    });
                                });
                            }
                            
                            update_data_delivery();
                            delete_data_delivery();
                            nomor++;
                        }
                        setTimeout(show_table, 2500);
                    } else {
                        cnt_delivery = count_data;
                        setTimeout(show_table, 2500);
                    }
                    
                    
                },
                complete: (data) => {

                },
                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);

                }
            });
        }

        function initListingDelivery() {
            $.ajax({
                type: "GET",
                url: get_data,
                dataType: "JSON",
                beforeSend: () => {
                    table_delivery.clear().draw();
                    $("#main-delivery-table").removeClass("show-main-table");
                    $("#main-delivery-table").addClass("hide-main-table");
                    $("#skeleton-delivery-table").addClass("show-skeleton-table");
                    $("#modal-edit-delivery").html("");
                    $("#modal-delete-delivery").html("");
                },
                success: (datanya) => {
                    let data = datanya.data;
                    function show_table() {
                        $("#skeleton-delivery-table").removeClass("show-skeleton-table");
                        $("#skeleton-delivery-table").addClass("remove-skeleton-table");
                        $("#main-delivery-table").removeClass("hide-main-table");
                        $("#main-delivery-table").addClass("show-main-table");
                    }
                        let nomor = 1; 
                        for(let i in data) {
                            let modal_edit_deliv = '';
                            let modal_delete_deliv = '';
                            let btn_edit;
                            let btn_delete;
                            if(role === 'User') {
                                btn_edit = "<a disabled class='btn btn-blue icon-left'><i class='entypo-pencil'></i> Edit Delivery</a>";
                            btn_delete = "<a disabled class='btn btn-danger icon-left'><i class='entypo-trash'></i> Delete Delivery</a>";
                            } else {
                                btn_edit = "<a href='javascript:;' id='edit-deliv"+data[i].id_delivery+"' class='btn btn-blue icon-left'><i class='entypo-pencil'></i> Edit Delivery</a>";
                                btn_delete = "<a href='javascript:;' id='delete-deliv"+data[i].id_delivery+"' class='btn btn-danger icon-left'><i class='entypo-trash'></i> Delete Delivery</a>";
                            }
                            modal_edit_deliv += 
                            "<div class='modal fade' id='modal-edit-deliv"+data[i].id_delivery+"'>"+
                                "<div class='modal-dialog'>"+
                                    "<div class='modal-content'>"+
                                        "<div class='modal-header'>"+
                                        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"+
                                            "<h4 class='modal-title'>Edit Delivery - <b>"+formatDate(data[i].tgl_delivery)+"</b></h4>"+
                                        "</div>"+
                                    
                                        "<div class='modal-body'>"+
                                            "<div class='row'>"+
                                                "<div class='col-md-12'>"+
                                                    "<div class='form-group'>"+
                                                        "<label class='col-sm-2 control-label' style='text-align:left;'>Quantity</label>"+
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
                                            "<button type='button' id='close_delivery"+data[i].id_delivery+"' class='btn btn-danger' data-dismiss='modal'>Batal</button>"+
                                            "<button type='submit' id='update_delivery"+data[i].id_delivery+"' class='btn btn-primary'>Update</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";

                            modal_delete_deliv += 
                            "<div class='modal fade' id='modal-delete-deliv"+data[i].id_delivery+"'>"+
                                "<div class='modal-dialog'>"+
                                    "<div class='modal-content'>"+
                                        "<div class='modal-header'>"+
                                        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"+
                                            "<h4 class='modal-title'>Delete Delivery - <b>"+formatDate(data[i].tgl_delivery)+"</b></h4>"+
                                        "</div>"+
                                    
                                        "<div class='modal-body'>"+
                                            "<div class='row'>"+
                                                "<div class='col-md-12'>"+
                                                    "<h3>Anda yakin ingin menghapus delivery tanggal "+formatDate(data[i].tgl_delivery)+"?</h3>"+
                                                "</div>"+
                                            "</div>"+
                                        "</div>"+

                                        "<div class='modal-footer'>"+
                                            "<button type='button' id='close_delete_delivery"+data[i].id_delivery+"' class='btn btn-info' data-dismiss='modal'>Batal</button>"+
                                            "<button type='submit' id='delete_delivery"+data[i].id_delivery+"' class='btn btn-danger'>Delete</button>"+
                                        "</div>"+
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
                            $("#modal-delete-delivery").append(modal_delete_deliv);
                            $("#table_delivery1 tr:nth-child("+nomor+") td:nth-child(3)").attr("id", "qty_val"+data[i].id_delivery+"");
                            $("#table_delivery1 tr:nth-child("+nomor+")").attr("id", "delete_qty_val"+data[i].id_delivery+"");
                            $("#table_delivery1").on('click', '#edit-deliv'+data[i].id_delivery+'', function() {
                                $("#modal-edit-deliv"+data[i].id_delivery).modal('show');
                            });

                            $("#table_delivery1").on('click', '#delete-deliv'+data[i].id_delivery+'', function() {
                                $("#modal-delete-deliv"+data[i].id_delivery).modal('show');
                            });

                            let qty = $("#qty"+data[i].id_delivery).val();
                            $(".input-spinner").on('click', '#btn_min'+data[i].id_delivery+'', function() {
                                qty--;
                                if(qty <= 1) {
                                    $("#btn_min"+data[i].id_delivery).attr("disabled", true);
                                }
                                $("#qty"+data[i].id_delivery).val(qty);
                            });

                            $(".input-spinner").on('click', '#btn_plus'+data[i].id_delivery+'', function() {
                                qty++;
                                if(qty > 1) {
                                    $("#btn_min"+data[i].id_delivery).attr("disabled", false);
                                }
                                $("#qty"+data[i].id_delivery).val(qty);
                            });

                            $(".input-spinner").on('keyup', '#qty'+data[i].id_delivery+'', function() {
                                qty = $(this).val();
                            });

                            $('.input-spinner').find('#qty'+data[i].id_delivery+'').keyup(function() {
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

                            function update_data_delivery() {
                                $(".modal-footer").on('click', '#update_delivery'+data[i].id_delivery+'', function() {
                                    $.ajax({
                                        type: "POST",
                                        url: edit_data,
                                        dataType: "JSON",
                                        data: {
                                            id_delivery: data[i].id_delivery,
                                            tgl: formatDate(data[i].tgl_delivery),
                                            qty: qty
                                        },
                                        cache: false,
                                        beforeSend: () => {
        
                                        },
                                        success: (data_update) => {
                                            if(!data_update) {
                                                alert("Sorry, the server cannot respond. please refresh this page.")
                                                return false;
                                            }
                                            $("#qty_val"+data[i].id_delivery).text(qty);
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
                                            toastr.success('DELIVERY TANGGAL '+formatDate(data[i].tgl_delivery)+' TELAH DI EDIT', "SUCCESS", opts);
                                        },
                                        error: (jqXHR, textStatus, errorThrown) => {
                                            alert(textStatus +" "+errorThrown);
                                            // $("#error_text").text(textStatus +" "+errorThrown);
                                            // $("#modal-error-ajax").modal('show');;
                                        },
                                        complete: () => {
                                            
                                            $("#modal-edit-deliv"+data[i].id_delivery).modal('hide');
                                        }
                                    });
                                });
                            }

                            function delete_data_delivery() {
                                $(".modal-footer").on('click', '#delete_delivery'+data[i].id_delivery+'', function() {
                                    $.ajax({
                                        type: "POST",
                                        url: delete_data,
                                        dataType: "JSON",
                                        data: {
                                            id_delivery: data[i].id_delivery,
                                            tgl: formatDate(data[i].tgl_delivery)
                                        },
                                        cache: false,
                                        beforeSend: () => {

                                        },
                                        success: (data_delete) => {
                                            if(!data_delete) {
                                                alert("Sorry, the server cannot respond. please refresh this page.")
                                                return false;
                                            }
                                            notification_delete();
                                            function notification_delete() {
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
                                                toastr.error('DELIVERY TANGGAL '+formatDate(data[i].tgl_delivery)+' TELAH DI HAPUS', "SUCCESS", opts);
                                            }
                                        },
                                        error: (jqXHR, textStatus, errorThrown) => {
                                            alert(textStatus +" "+errorThrown);
                                            // $("#error_text").text(textStatus +" "+errorThrown);
                                            // $("#modal-error-ajax").modal('show');;
                                        },
                                        complete: () => {
                                            $("#modal-delete-deliv"+data[i].id_delivery).modal('hide');
                                        }
                                    });
                                });
                            }
                            
                            update_data_delivery();
                            delete_data_delivery();
                            nomor++;
                        }

                    
                    
                    setTimeout(show_table, 2500);
                },
                complete: (data) => {

                },
                error: (jqXHR, textStatus, errorThrown) => {
                    alert(textStatus +" "+errorThrown);
                }
            });
        }

        setInterval(listing, 1500);

        initListingDelivery();
    });
}