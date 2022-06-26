class FilterCustomerClaim {

    constructor(root_url) {
        this.filter_table = root_url.concat("claim/customerclaim/filter_table");
        this.sortir_part = root_url.concat("claim/customerclaim/sortir_part/");
        this.get_ofp_files = root_url.concat("claim/customerclaim/get_ofp_files/");
        this.ofp = root_url.concat("assets/claim_customer/ofp/");
        this.get_pica_files = root_url.concat("claim/customerclaim/get_pica_files/");
        this.pica = root_url.concat("assets/claim_customer/pica/");
        this.get_pfmea_files = root_url.concat("claim/customerclaim/get_pfmea_files/");
        this.pfmea = root_url.concat("assets/claim_customer/pfmea/");
        this.simpan_pergantian_part = root_url.concat("claim/customerclaim/pergantian_part");
        this.simpan_sortir = root_url.concat("claim/customerclaim/simpan_sortir/");
    }

    main() {
        $(document).ready(() => {
            $("#table_customer_claim").DataTable({
                "oLanguage": {
                    "sSearch": "Search:",
                    "oPaginate": {
                        "sPrevious": "Previous",
                        "sNext": "Next"
                    }
                },
                "initComplete": function (settings, json) {  
                    $("#table_customer_claim").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                },
            });

            $("#table_customer_claim").on( 'column-sizing.dt', function (e, settings) {
                $(".dataTables_scrollHeadInner").css( "width", "100%" );
            });

            this.loadAllCustomerClaim();
        });
    }

    loadAllCustomerClaim() {
        $(document).ready(() => {
            $.ajax({
                type: "GET",
                url: this.filter_table,
                data: $("#filter_table").serialize(),
                dataType: "JSON",
                success: (data) => {
                    for(let i in data) {
                        let table_file_pfmea = $("#table_file_pfmea"+data[i].id_customer_claim).DataTable({
                            "oLanguage": {
                                "sSearch": "Search:",
                                "oPaginate": {
                                    "sPrevious": "Previous",
                                    "sNext": "Next"
                                }
                            },
                            "lengthChange": false,
                            "JQueryUI":true,
                            "scrollCollapse":true,
                            "paging": true,
                            "initComplete": function (settings, json) {  
                                $("#table_file_pfmea"+data[i].id_customer_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                            },
                        });
                    
                        let table_file_pica = $("#table_file_pica"+data[i].id_customer_claim).DataTable({
                            "oLanguage": {
                                    "sSearch": "Search:",
                                    "oPaginate": {
                                        "sPrevious": "Previous",
                                        "sNext": "Next"
                                    }
                                },
                                "lengthChange": false,
                                "JQueryUI":true,
                                "scrollCollapse":true,
                                "paging": true,
                                "initComplete": function (settings, json) {  
                                    $("#table_file_pica"+data[i].id_customer_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                            },
                        });

                        let table_file_ofp = $("#table_file_ofp"+data[i].id_customer_claim).DataTable({
                            "oLanguage": {
                                    "sSearch": "Search:",
                                    "oPaginate": {
                                        "sPrevious": "Previous",
                                        "sNext": "Next"
                                    }
                                },
                                "lengthChange": false,
                                "JQueryUI":true,
                                "scrollCollapse":true,
                                "paging": true,
                                "initComplete": function (settings, json) {  
                                    $("#table_file_ofp"+data[i].id_customer_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                            },
                        });
                        
                        $("#table_customer_claim").on('click', '#modal-upload-ppt'+data[i].id_customer_claim+'', function() {
                            $("#upload-ppt"+data[i].id_customer_claim).modal('show');
                        });

                        $("#table_customer_claim").on('click', '#modal-upload-ofp'+data[i].id_customer_claim+'', function() {
                            $("#upload-ofp"+data[i].id_customer_claim).modal('show');
                        });

                        $("#table_customer_claim").on('click', '#modal-pergantian-part'+data[i].id_customer_claim+'', function() {
                            $("#pergantian-part"+data[i].id_customer_claim).modal('show');
                        });

                        $("#table_customer_claim").on('click', '#modal-pfmea'+data[i].id_customer_claim+'', () => {
                            $("#pfmea"+data[i].id_customer_claim).modal('show');
                        });

                        $("#table_customer_claim").on('click', '#modal-sortir-stock'+data[i].id_customer_claim+'', () => {
                            $.ajax({
                                type: "GET",
                                url: this.sortir_part+data[i].id_customer_claim,
                                dataType: "JSON",
                                cache: false,
                                beforeSend: () => {
                                    $("#problem_part"+data[i].id_customer_claim).html("");
                                },
                                success: (data_sortir) => {
                                    let mod = data_sortir.sisa;
                                    let stock = data_sortir.stock;
                                    let ok = data_sortir.ok;
                                    let ng = data_sortir.ng;
                                    parseInt($("#ok"+data[i].id_customer_claim).val(ok));
                                    parseInt($("#ng"+data[i].id_customer_claim).val(ng));
                                    parseInt($("#sisa"+data[i].id_customer_claim).val(mod));
                                    ok = parseInt($("#ok"+data[i].id_customer_claim).val());
                                    ng = parseInt($("#ng"+data[i].id_customer_claim).val());
                                    if(mod != 0) {
                                        ok = parseInt($("#ok"+data[i].id_customer_claim).val());
                                        ng = parseInt($("#ng"+data[i].id_customer_claim).val());
                                        if(ok > 0) {
                                            $("#btn_min_ok"+data[i].id_customer_claim).attr("disabled", false);
                                        } else {
                                            $("#btn_min_ok"+data[i].id_customer_claim).attr("disabled", true);
                                        }

                                        if(ng > 0) {
                                            $("#btn_min_ng"+data[i].id_customer_claim).attr("disabled", false);
                                        } else {
                                            $("#btn_min_ng"+data[i].id_customer_claim).attr("disabled", true);
                                        }
                                        $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", false);
                                        $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", false);
                                        parseInt($("#stock"+data[i].id_customer_claim).val(stock));
                                    } else {
                                        $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", true);
                                        $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", true);
                                        $("#btn_min_ok"+data[i].id_customer_claim).attr("disabled", true);
                                        $("#btn_min_ng"+data[i].id_customer_claim).attr("disabled", true);
                                        parseInt($("#stock"+data[i].id_customer_claim).val(0));
                                    }

                                    stock = parseInt($("#stock"+data[i].id_customer_claim).val());
                                    let sisa = parseInt($("#sisa"+data[i].id_customer_claim).val());

                                    $("#stock"+data[i].id_customer_claim).keyup((e) => {
                                        stock = parseInt($(e.target).val());
                                        if(stock > 0) {
                                            $("#ok"+data[i].id_customer_claim).attr('readonly', false);
                                            $("#ng"+data[i].id_customer_claim).attr('readonly', false);
                                            $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", false);
                                            $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", false);
                                        } else {
                                            $("#ok"+data[i].id_customer_claim).attr('readonly', true);
                                            $("#ng"+data[i].id_customer_claim).attr('readonly', true);
                                            $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", true);
                                            $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", true);
                                            parseInt($("#sisa"+data[i].id_customer_claim).val(0));
                                            parseInt($(e.target).val(0));
                                        }
                                        if(ok > 0 || ng > 0) {
                                            sisa = stock - Math.abs(ok + ng);
                                            if(sisa > 0) {
                                                parseInt($("#sisa"+data[i].id_customer_claim).val(sisa));
                                            }
                                            if(stock < Math.abs(ok + ng)) {
                                                // parseInt($(e.target).val(Math.abs(ok + ng)));
                                                sisa = parseInt($("#sisa"+data[i].id_customer_claim).val(0));
                                            }

                                            if(stock >= Math.abs(ok + ng)) {
                                                sisa = stock - Math.abs(ok + ng);
                                                sisa = parseInt($("#sisa"+data[i].id_customer_claim).val(sisa));
                                            }
                                        }
                                    });

                                    $("#ok"+data[i].id_customer_claim).keyup((e) => {
                                        ok = parseInt($(e.target).val());
                                        ng = parseInt($("#ng"+data[i].id_customer_claim).val());
                                        if(ok > 0) {
                                            $("#btn_min_ok"+data[i].id_customer_claim).attr("disabled", false);
                                        } else {
                                            $("#btn_min_ok"+data[i].id_customer_claim).attr("disabled", true);
                                        }
                                        if(Math.abs(ok + ng) >= stock) {
                                            $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", true);
                                            $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", true);
                                            parseInt($("#sisa"+data[i].id_customer_claim).val(0));
                                            $("#stock"+data[i].id_customer_claim).val(Math.abs(ok + ng));
                                        } else {
                                            $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", false);
                                            $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", false);
                                            sisa = stock - Math.abs(ok + ng);
                                            parseInt($("#sisa"+data[i].id_customer_claim).val(sisa));
                                        }
                                        
                                    });


                                    $("#ng"+data[i].id_customer_claim).keyup((e) => {
                                        ng = parseInt($(e.target).val());
                                        if(ng > 0) {
                                            $("#btn_min_ng"+data[i].id_customer_claim).attr("disabled", false);
                                        } else {
                                            $("#btn_min_ng"+data[i].id_customer_claim).attr("disabled", true);
                                        }
                                        if(Math.abs(ok + ng) >= stock) {
                                            $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", true);
                                            $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", true);
                                            parseInt($("#sisa"+data[i].id_customer_claim).val(0));
                                            $("#stock"+data[i].id_customer_claim).val(Math.abs(ok + ng));
                                        } else {
                                            $("#btn_plus_ng"+data[i].id_customer_claim).attr("disabled", false);
                                            $("#btn_plus_ok"+data[i].id_customer_claim).attr("disabled", false);
                                            sisa = stock - Math.abs(ok + ng);
                                            parseInt($("#sisa"+data[i].id_customer_claim).val(sisa));
                                        }
                                        
                                    });

                                    $("#problem_part"+data[i].id_customer_claim).text(data_sortir.problem_part).css("color", "#000");
                                    $("#problem_part"+data[i].id_customer_claim).text(data_sortir.problem_part).css("font-weight", "bolder");
                                    $("#sortir-stock"+data[i].id_customer_claim).modal('show');
                                },
                                error: (jqXHR, textStatus, errorThrown) => {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                        });

                        $("#table_customer_claim").on('click', '#download_ofp_file'+data[i].id_customer_claim+'', () => {
                            $.ajax({
                                type: "GET",
                                url: this.get_ofp_files+data[i].id_customer_claim,
                                dataType: "JSON",
                                beforeSend: () => {
                                    table_file_ofp.clear().draw();
                                },
                                success: (data) => {
                                    for(let index in data) {
                                        var nomor = parseInt(index) + 1;
                                        var button_download_files = "<a target='_blank' href='"+this.ofp+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
                                        table_file_ofp.row.add([
                                            ''+nomor+'',
                                            ''+data[index].tgl_upload+'',
                                            ''+data[index].nama_file+'',
                                            ''+button_download_files+''
                                        ]).draw(false);
                                    }
                                },
                                error: (jqXHR, textStatus, errorThrown) => {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                            $("#modal_view_ofp_files"+data[i].id_customer_claim).modal('show');
                        });


                        $("#upload_ofpfile"+data[i].id_customer_claim+"").submit(function(e) {
                            e.preventDefault();
                            $(this).ajaxSubmit({
                                beforeSubmit: () => {
                                    $("#progress-bar-ofp"+data[i].id_customer_claim+"").width('0%');
                                },
                                uploadProgress: (event, position, total, percentComplete) => {
                                    $("#progress-bar-ofp"+data[i].id_customer_claim+"").width(percentComplete + '%');
                                    $("span#progress-ofp"+data[i].id_customer_claim+"").text(percentComplete+"%");
                                },
                                success: (data) => {
                                    let data_json = JSON.parse(data);
                                    let select_claim = data_json.select_claim;
                                    function closeModal() {
                                        $("#upload-ofp"+select_claim.id_customer_claim).modal('hide');
                                    }
                                    setTimeout(closeModal, 1500);
                                },
                                complete: (data) => {
                                    let data_json = JSON.parse(data.responseText);
                                    let jsonResponse = data_json.select_claim;
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
                                    function successUpload() {
                                        toastr.success('FILE OFP BERHASIL DIUPLOAD', "SUCCESS", opts);
                                        $(".enable_ofp"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                        $(".enable_ofp"+jsonResponse.id_customer_claim).attr("id", `download_ofp_file${jsonResponse.id_customer_claim}`);
                                        if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                            $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                            $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                        }
                                    }
                                    function afterUpload() {
                                        $("span.file-input-name").text("");
                                        $("#progress-bar-ofp"+jsonResponse.id_customer_claim+"").width('0%');
                                        $("#nama_file_ofp"+jsonResponse.id_customer_claim+"").val(null);
                                    }
                                    setTimeout(successUpload, 1500);
                                    setTimeout(afterUpload, 2000);
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                        });

                        $("#simpan_pergantian"+data[i].id_customer_claim+"").click((e) => {
                            e.preventDefault();
                            let tgl_pembayaran = $("#tgl_pembayaran"+data[i].id_customer_claim+"").val();
                            let no_gi_451 = $("#no_gi_451"+data[i].id_customer_claim+"").val();
                            let no_gi_945 = $("#no_gi_945"+data[i].id_customer_claim+"").val();
                            if(tgl_pembayaran != "" && no_gi_451 != "" && no_gi_945 != "") {
                                $.ajax({
                                    url: this.simpan_pergantian_part,
                                    type: "POST",
                                    data: $("#upload_pergantian"+data[i].id_customer_claim+"").serialize(),
                                    dataType: "JSON",
                                    cache: false,
                                    success: (data) => {
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
                                        toastr.success('PERGANTIAN PART BERHASIL DILAKUKAN!', "SUCCESS", opts);

                                    },
                                    complete: (data) => {
                                        let responseJSON = data.responseJSON.select_claim;
                                        let status_pergantian = "<i id='ganti-part"+responseJSON.id_customer_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i> Sudah melakukan pergantian part"
                                        $("#tgl_pembayaran"+responseJSON.id_customer_claim+"").val(null);
                                        $("#no_gi_451"+responseJSON.id_customer_claim+"").val("");
                                        $("#no_gi_945"+responseJSON.id_customer_claim+"").val("");
                                        $("#modal-pergantian-part"+responseJSON.id_customer_claim+"").remove();
                                        $("#pergantian_part"+responseJSON.id_customer_claim+"").html(status_pergantian);
                                        $("#pergantian-part"+responseJSON.id_customer_claim+"").modal('hide');
                                        if(responseJSON.ppt_file != null && responseJSON.ofp != null && responseJSON.id_pergantian_part != null && responseJSON.id_sortir_stock != null && responseJSON.id_pfmea != null) {
                                            $("#status_claim"+responseJSON.id_customer_claim).text("");
                                            $("#status_claim"+responseJSON.id_customer_claim).text("CLOSE");
                                        }
                                    },
                                    error: (jqXHR, textStatus, errorThrown) => {
                                        alert(textStatus +" "+errorThrown);
                                    }
                                });
                            } else {
                                alert("SEMUA FIELD HARUS DI ISI TERLEBIH DAHULU!!!");
                            }
                        });

                        $("#simpan_sortir"+data[i].id_customer_claim+"").click((e) => {
                            e.preventDefault();
                            let tgl_sortir = $("#tgl_sortir"+data[i].id_customer_claim+"").val();
                            let stock = $("#stock"+data[i].id_customer_claim+"").val();
                            let ok = $("#ok"+data[i].id_customer_claim+"").val();
                            let ng = $("#ng"+data[i].id_customer_claim+"").val();
                            if(tgl_sortir != "" && stock != "" && ok != "" && ng != "") {
                                $.ajax({
                                    url: this.simpan_sortir+data[i].id_customer_claim,
                                    type: "POST",
                                    data: $("#create_sortir_stock"+data[i].id_customer_claim+"").serialize(),
                                    dataType: "JSON",
                                    cache: false,
                                    success: (data) => {
                                        
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
                                        toastr.success('SORTIR STOCK BERHASIL DILAKUKAN!', "SUCCESS", opts);
                                    },
                                    complete: (data) => {
                                        let responseJSON = data.responseJSON.select_claim;
                                        let sisa_stock = data.responseJSON.sisa_stock;
                                        let status_complete;
                                        if(parseInt(sisa_stock) > 0) {
                                            status_complete = "<a href='javascript:;' id='modal-sortir-stock"+responseJSON.id_customer_claim+"' class='btn btn-success'><i class='entypo-pencil'></i></a>"
                                        } else {
                                            status_complete = "<i id='ganti-part"+responseJSON.id_customer_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i>"
                                        }
                                        
                                        $("#modal-sortir-stock"+responseJSON.id_customer_claim+"").remove();
                                        $("#tgl_sortir"+responseJSON.id_customer_claim+"").val(null);
                                        $("#type"+responseJSON.id_customer_claim+"").val("");
                                        $("#stock"+responseJSON.id_customer_claim+"").val(0);
                                        $("#ok"+responseJSON.id_customer_claim+"").val(0);
                                        $("#ng"+responseJSON.id_customer_claim+"").val(0);
                                        $("#sisa"+responseJSON.id_customer_claim+"").val(0);
                                        $("#status-sortir-stock"+responseJSON.id_customer_claim+"").html(status_complete);
                                        $("#sortir-stock"+responseJSON.id_customer_claim+"").modal('hide');
                                        if(responseJSON.ppt_file != null && responseJSON.ofp != null && responseJSON.id_pergantian_part != null && responseJSON.id_sortir_stock != null && responseJSON.id_pfmea != null) {
                                            $("#status_claim"+responseJSON.id_customer_claim).text("");
                                            $("#status_claim"+responseJSON.id_customer_claim).text("CLOSE");
                                        }
                                    },
                                    error: (jqXHR, textStatus, errorThrown) => {
                                        alert(textStatus +" "+errorThrown);
                                    }
                                });
                            } else {
                                alert("SEMUA FIELD HARUS DI ISI TERLEBIH DAHULU!!!")
                            }	
                        });

                        $("#upload_file"+data[i].id_customer_claim+"").submit(function(e) {
                            e.preventDefault();
                            $(this).ajaxSubmit({
                                beforeSubmit: () => {
                                    $("#progress-bar"+data[i].id_customer_claim+"").width('0%');
                                },
                                uploadProgress: (event, position, total, percentComplete) => {
                                    $("#progress-bar"+data[i].id_customer_claim+"").width(percentComplete + '%');
                                    $("span#progress"+data[i].id_customer_claim+"").text(percentComplete+"%");
                                },
                                success: (data) => {
                                    let data_json = JSON.parse(data);
                                    let select_claim = data_json.select_claim;
                                    let due_date = Date.parse(data_json.due_date);
                                    let dateNow = Date.parse(data_json.dateNow);
                                    function closeModal() {
                                        if(dateNow > due_date) {
                                            $("#status_color"+data[i].id_customer_claim+"").addClass('kuning');
                                        } else {
                                            $("#status_color"+data[i].id_customer_claim+"").addClass('hijau');
                                        }
                                        $("#upload-ppt"+select_claim.id_customer_claim).modal('hide');
                                    }
                                    setTimeout(closeModal, 1500);
                                },
                                complete: (data) => {
                                    let data_json = JSON.parse(data.responseText);
                                    let jsonResponse = data_json.select_claim;
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
                                    function successUpload() {
                                        toastr.success('FILE PICA BERHASIL DIUPLOAD', "SUCCESS", opts);
                                        $(".enable_pica"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                        $(".enable_pica"+jsonResponse.id_customer_claim).attr("id", `download_ppt_file${jsonResponse.id_customer_claim}`);
                                        if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                            $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                            $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                        }
                                    }
                                    function afterUpload() {
                                        $("span.file-input-name").text("");
                                        $("#progress-bar"+jsonResponse.id_customer_claim+"").width('0%');
                                        $("#nama_file"+jsonResponse.id_customer_claim+"").val(null);
                                    }
                                    setTimeout(successUpload, 1500);
                                    setTimeout(afterUpload, 2000);
                                    $("#upload-ppt"+jsonResponse.id_customer_claim+"").unbind();
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                        });

                        $("#table_customer_claim").on('click', '#download_ppt_file'+data[i].id_customer_claim+'', () => {
                            $.ajax({
                                type: "GET",
                                url: this.get_pica_files+data[i].id_customer_claim,
                                dataType: "JSON",
                                beforeSend: () => {
                                    table_file_pica.clear().draw();
                                },
                                success: (data) => {
                                    console.log(data);
                                    for(let index in data) {
                                        let nomor = parseInt(index) + 1;
                                        let button_download_files = "<a target='_blank' href='"+this.pica+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
                                        table_file_pica.row.add([
                                            ''+nomor+'',
                                            ''+data[index].tgl_upload+'',
                                            ''+data[index].nama_file+'',
                                            ''+button_download_files+''
                                        ]).draw(false);
                                    }
                                },
                                error: (jqXHR, textStatus, errorThrown) => {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                            $("#modal_view_pica_files"+data[i].id_customer_claim).modal('show');
                        });


                        $("#pfmea_file"+data[i].id_customer_claim+"").submit(function(e) {
                            e.preventDefault();
                            $(this).ajaxSubmit({
                                beforeSubmit: () => {
                                    $("#progress-bar-pfmea"+data[i].id_customer_claim+"").width('0%');
                                },
                                uploadProgress: (event, position, total, percentComplete) => {
                                    $("#progress-bar-pfmea"+data[i].id_customer_claim+"").width(percentComplete + '%');
                                    $("span#progress-pfmea"+data[i].id_customer_claim+"").text(percentComplete+"%");
                                },

                                success: (data) => {
                                    let data_json = JSON.parse(data);
                                    let select_claim = data_json.select_claim;
                                    let due_date = Date.parse(data_json.due_date);
                                    let dateNow = Date.parse(data_json.dateNow);
                                    function closeModal() {
                                        $("#pfmea"+select_claim.id_customer_claim).modal('hide');
                                    }
                                    setTimeout(closeModal, 1500);
                                },
                                complete: (data) => {
                                    let data_json = JSON.parse(data.responseText);
                                    let jsonResponse = data_json.select_claim;
                                    let fileName = data_json.file_name;
                                    let id_pfmea = jsonResponse.id_pfmea;
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
                                    function successUpload() {
                                        toastr.success('FILE PFMEA BERHASIL DIUPLOAD', "SUCCESS", opts);
                                        $(".enable_pfmea"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                        $(".enable_pfmea"+jsonResponse.id_customer_claim).attr("id", "modal_files"+jsonResponse.id_customer_claim+"");
                                        if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                            $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                            $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                        }
                                    }
                                    function afterUpload() {
                                        $("span.file-input-name").text("");
                                        $("#progress-bar-pfmea"+jsonResponse.id_customer_claim+"").width('0%');
                                        $("#nama_file_pfmea"+jsonResponse.id_customer_claim+"").val(null);
                                    }
                                    setTimeout(successUpload, 1500);
                                    setTimeout(afterUpload, 2000);
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                        });

                        $("#table_customer_claim").on('click', '#modal_files'+data[i].id_customer_claim+'', () => {
                            $.ajax({
                                type: "GET",
                                url: this.get_pfmea_files+data[i].id_customer_claim,
                                dataType: "JSON",
                                beforeSend: () => {
                                    table_file_pfmea.clear().draw();
                                },
                                success: (data) => {
                                    for(let index in data) {
                                        let nomor = parseInt(index) + 1;
                                        let button_download_files = "<a target='_blank' href='"+this.pfmea+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
                                        table_file_pfmea.row.add([
                                            ''+nomor+'',
                                            ''+data[index].tgl_upload+'',
                                            ''+data[index].nama_file+'',
                                            ''+button_download_files+''
                                        ]).draw(false);
                                    }
                                },
                                error: (jqXHR, textStatus, errorThrown) => {
                                    alert(textStatus +" "+errorThrown);
                                }
                            });
                            $("#modal_view_files"+data[i].id_customer_claim).modal('show');
                        });
                    }
                }
            });
        }); 
    }
}