function customer_claim_table(root_url) {
    jQuery(document).ready(($) => {
        let filter_table = root_url.concat("claim/customerclaim/filter_table");
        let sortir_part = root_url.concat("claim/customerclaim/sortir_part/");
        let get_ofp_files = root_url.concat("claim/customerclaim/get_ofp_files/");
        let ofp = root_url.concat("assets/claim_customer/ofp/");
        let get_pica_files = root_url.concat("claim/customerclaim/get_pica_files/");
        let pica = root_url.concat("assets/claim_customer/pica/");
        let get_pfmea_files = root_url.concat("claim/customerclaim/get_pfmea_files/");
        let pfmea = root_url.concat("assets/claim_customer/pfmea/");
        let simpan_pergantian_part = root_url.concat("claim/customerclaim/pergantian_part");
        let simpan_sortir = root_url.concat("claim/customerclaim/simpan_sortir/");
        let table_customer_claim = $("#table_customer_claim").DataTable({
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
                                            "paging": false,
                                            "initComplete": function (settings, json) {  
                                                $("#table_customer_claim").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                            },
                                        });
            
            

            $("#table_customer_claim").on( 'column-sizing.dt', function (e, settings) {
                $(".dataTables_scrollHeadInner").css( "width", "100%" );
            });

            let table_skeleton = $("#table_skeleton").DataTable({
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
                                            "paging": false,
                                            "initComplete": function (settings, json) {  
                                                $("#table_skeleton").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                            },
                                        });
        

            function formatDate(date) {
                let d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('- v54v45v');
            }
            
            // FILTER TABLE USING AJAX
            function load_all_customer_claim() {
                let new_date = new Date();
                let dateNow = formatDate(new_date);
                $.ajax({
                    type: "GET",
                    url: filter_table,
                    data: $("#filter_table").serialize(),
                    dataType: "JSON",
                    beforeSend: () => {
                        $("#main-table").removeClass("show-main-table");
                        $("#main-table").addClass("hide-main-table");
                        $("#skeleton-table").addClass("show-skeleton-table");
                        // table_customer_claim.clear().destroy();
                        table_customer_claim.clear().draw();
                    },
                    success: (data) => {
                        function show_table() {
                            $("#skeleton-table").removeClass("show-skeleton-table");
                            $("#skeleton-table").addClass("remove-skeleton-table");
                            $("#main-table").removeClass("hide-main-table");
                            $("#main-table").addClass("show-main-table");
                        }
                        let uniq = 1;
                        for(let i in data) {
                            let no = parseInt(i) + 1;
                            let create_date = new Date(data[i].tgl_input);
                            create_date.setDate(create_date.getDate() + 3);
                            let year = create_date.getFullYear();
                            let increment_month = create_date.getMonth() + 1
                            let month = ('0' + increment_month).slice(-2);
                            let day = ('0' + create_date.getDate()).slice(-2);
                            let due_date = `${year}-${month}-${day}`;
                            let date_now = Date.parse(dateNow);
                            let parse_due_date = Date.parse(due_date);
                            let ofp_upload = "<a href='javascript:;' id='modal-upload-ofp"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-upload'></i></a>";
                            let button_upload = "<a href='javascript:;' id='modal-upload-ppt"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-upload'></i></a>";
                            let pergantian_part;
                            let button_download;
                            let ofp_download;
                            let upload_pfmea = "<a href='javascript:;' id='modal-pfmea"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-upload'></i></a>";
                            let see_pfmea;
                            let sortir_stock;
                            if(data[i].ppt_file == null) {
                                // button_download = "<a disabled class='btn btn-success btn-icon icon-left' id='download_ppt_file"+data[i].id_customer_claim+"'> Download<i class='entypo-download'></i></a>";
                                button_download = "<a class='btn btn-success enable_pica"+data[i].id_customer_claim+"' id='download_ppt_file"+data[i].id_customer_claim+"' disabled><i class='entypo-eye'></i></a>";
                            } else {
                                if(data[i].ppt_file != null) {
                                    button_download  = "<a href='javascript:;' id='download_ppt_file"+data[i].id_customer_claim+"' class='btn btn-success'><i class='entypo-eye'></i></a>";
                                }		
                            }

                            if(data[i].ofp == null) {
                                ofp_download = "<a class='btn btn-red enable_ofp"+data[i].id_customer_claim+"' id='download_ofp_file"+data[i].id_customer_claim+"' disabled><i class='entypo-eye'></i></a>";
                            } else {
                                if(data[i].ofp != null) {
                                    ofp_download  = "<a href='javascript:;' id='download_ofp_file"+data[i].id_customer_claim+"' class='btn btn-red'><i class='entypo-eye'></i></a>";
                                }		
                            }

                            if(data[i].id_pergantian_part == null) {
                                pergantian_part = "<a href='javascript:;' id='modal-pergantian-part"+data[i].id_customer_claim+"' class='btn btn-info btn-icon icon-left'><i class='entypo-pencil'></i> Pergantian part</a>";
                            } else {
                                if(data[i].id_pergantian_part != null) {
                                    pergantian_part = "<i id='ganti-part"+data[i].id_customer_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i> Sudah melakukan pergantian part";
                                }
                            }

                            if(data[i].id_sortir_stock == null) {
                                sortir_stock = "<a href='javascript:;' id='modal-sortir-stock"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-pencil'></i></a>";
                            } else {
                                if(data[i].id_sortir_stock != null) {
                                    if(data[i].sisa > 0) {
                                        sortir_stock = "<a href='javascript:;' id='modal-sortir-stock"+data[i].id_customer_claim+"' class='btn btn-success'><i class='entypo-pencil'></i></a>";
                                    } else {
                                        if(data[i].sisa == 0) {
                                            sortir_stock = "<i id='ganti-part"+data[i].id_customer_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i>";
                                        }
                                    }
                                    
                                }
                            }

                            if(data[i].id_pfmea == null) {
                                see_pfmea = "<a class='btn btn-info enable_pfmea"+data[i].id_customer_claim+"' disabled><i class='entypo-eye'></i></a>";
                            } else {
                                if(data[i].id_pfmea != null) {
                                    see_pfmea  = "<a href='javascript:;' id='modal_files"+data[i].id_customer_claim+"' class='btn btn-info'><i class='entypo-eye'></i></a>";
                                }
                            }

                            if(data[i].ofp != null && data[i].id_pergantian_part != null && data[i].id_sortir_stock != null && data[i].ppt_file != null && data[i].id_pfmea != null) {
                                data[i].status = 'CLOSE';
                            }

                            if(data[i].card == "#N/A") {
                                data[i].card = '-'
                            }

                            
                        }

                        setTimeout(show_table, 500);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        alert(textStatus +" "+errorThrown);
                    },
                    complete: (data) => {
                        function load_uniqID() {
                                let sign = 1;
                                for(let i in data.responseJSON) {
                                    let create_date = new Date(data.responseJSON[i].tgl_input);
                                    create_date.setDate(create_date.getDate() + 3);
                                    let year = create_date.getFullYear();
                                    let increment_month = create_date.getMonth() + 1
                                    let month = ('0' + increment_month).slice(-2);
                                    let day = ('0' + create_date.getDate()).slice(-2);
                                    let due_date = `${year}-${month}-${day}`;
                                    let date_now = Date.parse(dateNow);
                                    let parse_due_date = Date.parse(due_date);
                                    let id_claim = data.responseJSON[i].id_customer_claim;
                                    let uniqID = "status_color"+id_claim;
                                    let id_card = "card-"+sign;
                                    let status = "status_claim"+id_claim;
                                    let card = data.responseJSON[i].card;
                                    let pergantian_part = "pergantian_part"+id_claim;
                                    let status_sortir_stock = "status-sortir-stock"+id_claim;
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(7)").attr("id", uniqID);
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(14)").attr("id", id_card);
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(6)").attr("class", "proses");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(5)").attr("class", "proses");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(3)").attr("class", "no_surat_claim");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(11)").attr("class", "pica");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(9)").attr("class", "centered");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(9)").attr("id", pergantian_part);
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(10)").attr("class", "centered");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(10)").attr("id", status_sortir_stock);
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(13)").attr("class", "centered");
                                    $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(13)").attr("id", status);
                                    $("#status_claim"+id_claim+"").addClass("status");
                                    if(date_now > parse_due_date) {
                                        if(data.responseJSON[i].ppt_file != null) {
                                            $("#"+uniqID).addClass("kuning");
                                        } else {
                                            $("#"+uniqID).addClass("red");
                                        }
                                    } else {
                                        if(data.responseJSON[i].ppt_file != null) {
                                            $("#"+uniqID).addClass("hijau");
                                        } else {
                                            $("#"+uniqID).addClass("text-align");
                                        }
                                    }

                                    if(card == 'Green Card') {
                                        $("#"+id_card).addClass("hijau");
                                    } else if(card == 'Yellow Card') {
                                        $("#"+id_card).addClass("kuning");
                                    } else {
                                        if(card == 'Red Card') {
                                            $("#"+id_card).addClass("red");
                                        } else {
                                            $("#"+id_card).addClass("netral");
                                        }
                                    }
                                    sign += 1;

                                    var table_file_pfmea = $("#table_file_pfmea"+id_claim).DataTable({
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
                                            $("#table_file_pfmea"+id_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                        },
                                        
                                    });
                                
                                    var table_file_pica = $("#table_file_pica"+id_claim).DataTable({
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
                                                $("#table_file_pica"+id_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                            },
                                    });

                                    var table_file_ofp = $("#table_file_ofp"+id_claim).DataTable({
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
                                                $("#table_file_ofp"+id_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                            },
                                    });

                                    var table_sortir_problem = $("#table_sortir_problem"+id_claim).DataTable({
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
                                        "paging": false,
                                        "initComplete": function (settings, json) {  
                                            $("#table_sortir_problem"+id_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                        },
                                    });

                                    var table_sortir_stock = $("#table_sortir_stock"+id_claim).DataTable({
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
                                        "paging": false,
                                        "initComplete": function (settings, json) {  
                                            $("#table_sortir_stock"+id_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                        },
                                    });

                                    $("#table_customer_claim").on('click', '#modal-upload-ppt'+id_claim+'', function() {
                                        $("#upload-ppt"+id_claim).modal('show');
                                    });

                                    $("#table_customer_claim").on('click', '#modal-upload-ofp'+id_claim+'', function() {
                                        $("#upload-ofp"+id_claim).modal('show');
                                    });

                                    $("#table_customer_claim").on('click', '#modal-pergantian-part'+id_claim+'', function() {
                                        $("#pergantian-part"+id_claim).modal('show');
                                    });

                                    $("#table_customer_claim").on('click', '#modal-pfmea'+id_claim+'', () => {
                                        $("#pfmea"+id_claim).modal('show');
                                    });

                                    $("#table_customer_claim").on('click', '#modal-sortir-stock'+id_claim+'', function() {
                                        $.ajax({
                                            type: "GET",
                                            url: sortir_part+id_claim,
                                            dataType: "JSON",
                                            cache: false,
                                            beforeSend: () => {
                                                $("#problem_part"+id_claim).html("");
                                            },
                                            success: (data_sortir) => {
                                                $("#problem_part"+id_claim).html("");
                                                let mod = data_sortir.sisa;
                                                let stock = data_sortir.stock;
                                                let ok = data_sortir.ok;
                                                let ng = data_sortir.ng;
                                                parseInt($("#ok"+id_claim).val(ok));
                                                parseInt($("#ng"+id_claim).val(ng));
                                                parseInt($("#sisa"+id_claim).val(mod));
                                                ok = parseInt($("#ok"+id_claim).val());
                                                ng = parseInt($("#ng"+id_claim).val());
                                                if(mod != 0) {
                                                    ok = parseInt($("#ok"+id_claim).val());
                                                    ng = parseInt($("#ng"+id_claim).val());
                                                    if(ok > 0) {
                                                        $("#btn_min_ok"+id_claim).attr("disabled", false);
                                                    } else {
                                                        $("#btn_min_ok"+id_claim).attr("disabled", true);
                                                    }

                                                    if(ng > 0) {
                                                        $("#btn_min_ng"+id_claim).attr("disabled", false);
                                                    } else {
                                                        $("#btn_min_ng"+id_claim).attr("disabled", true);
                                                    }

                                                    // $("#ok"+id_claim).attr('readonly', false);
                                                    // $("#ng"+id_claim).attr('readonly', false);
                                                    $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                    $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                    parseInt($("#stock"+id_claim).val(stock));
                                                } else {
                                                    // $("#ok"+id_claim).attr('readonly', true);
                                                    // $("#ng"+id_claim).attr('readonly', true);
                                                    $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                    $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                    $("#btn_min_ok"+id_claim).attr("disabled", true);
                                                    $("#btn_min_ng"+id_claim).attr("disabled", true);
                                                    parseInt($("#stock"+id_claim).val(0));
                                                }

                                                stock = parseInt($("#stock"+id_claim).val());
                                                let sisa = parseInt($("#sisa"+id_claim).val());

                                                $("#stock"+id_claim).keyup((e) => {
                                                    stock = parseInt($(e.target).val());
                                                    if(stock > 0) {
                                                        $("#ok"+id_claim).attr('readonly', false);
                                                        $("#ng"+id_claim).attr('readonly', false);
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                    } else {
                                                        $("#ok"+id_claim).attr('readonly', true);
                                                        $("#ng"+id_claim).attr('readonly', true);
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                        parseInt($("#sisa"+id_claim).val(0));
                                                        parseInt($(e.target).val(0));
                                                    }
                                                    if(ok > 0 || ng > 0) {
                                                        sisa = stock - Math.abs(ok + ng);
                                                        if(sisa > 0) {
                                                            parseInt($("#sisa"+id_claim).val(sisa));
                                                        }
                                                        if(stock < Math.abs(ok + ng)) {
                                                            // parseInt($(e.target).val(Math.abs(ok + ng)));
                                                            sisa = parseInt($("#sisa"+id_claim).val(0));
                                                            
                                                        }

                                                        if(stock >= Math.abs(ok + ng)) {
                                                            sisa = stock - Math.abs(ok + ng);
                                                            sisa = parseInt($("#sisa"+id_claim).val(sisa));
                                                        }
                                                    }
                                                });

                                                $("#ok"+id_claim).keyup((e) => {
                                                    ok = parseInt($(e.target).val());
                                                    ng = parseInt($("#ng"+id_claim).val());
                                                    // console.log(ok);
                                                    if(ok > 0) {
                                                        $("#btn_min_ok"+id_claim).attr("disabled", false);
                                                    } else {
                                                        $("#btn_min_ok"+id_claim).attr("disabled", true);
                                                    }
                                                    if(Math.abs(ok + ng) >= stock) {
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                        // $("#ng"+id_claim).attr("readonly", true);
                                                        // $("#ok"+id_claim).attr("readonly", true);
                                                        parseInt($("#sisa"+id_claim).val(0));
                                                        $("#stock"+id_claim).val(Math.abs(ok + ng));
                                                    } else {
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                        // $("#ok"+id_claim).attr("readonly", false);
                                                        // $("#ng"+id_claim).attr("readonly", false);
                                                        console.log(ng);
                                                        sisa = stock - Math.abs(ok + ng);
                                                        
                                                        parseInt($("#sisa"+id_claim).val(sisa));
                                                    }
                                                    
                                                });


                                                $("#ng"+id_claim).keyup((e) => {
                                                    ng = parseInt($(e.target).val());
                                                    if(ng > 0) {
                                                        $("#btn_min_ng"+id_claim).attr("disabled", false);
                                                    } else {
                                                        $("#btn_min_ng"+id_claim).attr("disabled", true);
                                                    }
                                                    if(Math.abs(ok + ng) >= stock) {
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                        // $("#ng"+id_claim).attr("readonly", true);
                                                        // $("#ok"+id_claim).attr("readonly", true);
                                                        parseInt($("#sisa"+id_claim).val(0));
                                                        $("#stock"+id_claim).val(Math.abs(ok + ng));
                                                    } else {
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                        // $("#ng"+id_claim).attr("readonly", false);
                                                        // $("#ok"+id_claim).attr("readonly", false);
                                                        sisa = stock - Math.abs(ok + ng);
                                                        parseInt($("#sisa"+id_claim).val(sisa));
                                                    }
                                                    
                                                });

                                                let label = ["label-primary", "label-secondary", "label-success",
                                                    "label-info", "label-warning", "label-danger"];
                                                    
                                                for(let i in data_sortir.problem_part) {
                                                    let problem = "<div class='label "+label[Math.floor(Math.random() * label.length)]+" tooltip-primary' data-toggle='tooltip' data-placement='top' title='' data-original-title='Tooltip on top'>"+data_sortir.problem_part[i]+"</div>";
                                                    $("#problem_part"+id_claim).append(problem);
                                                }
                                                $("#sortir-stock"+id_claim).modal('show');
                                            },
                                            error: (jqXHR, textStatus, errorThrown) => {
                                                alert(textStatus +" "+errorThrown);
                                            }
                                        });
                                    });

                                    $("#table_customer_claim").on('click', '#download_ofp_file'+id_claim+'', () => {
                                        $.ajax({
                                            type: "GET",
                                            url: get_ofp_files+id_claim,
                                            dataType: "JSON",
                                            beforeSend: () => {
                                                table_file_ofp.clear().draw();
                                            },
                                            success: (data) => {
                                                for(let index in data) {
                                                    let nomor = parseInt(index) + 1;
                                                    let button_download_files = "<a target='_blank' href='"+ofp+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
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
                                        $("#modal_view_ofp_files"+id_claim).modal('show');
                                    });
                                    

                                    $("#table_customer_claim").on('click', '#download_ppt_file'+id_claim+'', () => {
                                        $.ajax({
                                            type: "GET",
                                            url: get_pica_files+id_claim,
                                            dataType: "JSON",
                                            beforeSend: () => {
                                                table_file_pica.clear().draw();
                                            },
                                            success: (data) => {
                                                for(let index in data) {
                                                    let nomor = parseInt(index) + 1;
                                                    let button_download_files = "<a target='_blank' href='"+pica+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
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
                                        $("#modal_view_pica_files"+id_claim).modal('show');
                                    });

                                    $("#table_customer_claim").on('click', '#modal_files'+id_claim+'', function() {
                                        $.ajax({
                                            type: "GET",
                                            url: get_pfmea_files+id_claim,
                                            dataType: "JSON",
                                            beforeSend: () => {
                                                table_file_pfmea.clear().draw();
                                            },
                                            success: (data) => {
                                                for(let index in data) {
                                                    let nomor = parseInt(index) + 1;
                                                    let button_download_files = "<a target='_blank' href='"+pfmea+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
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
                                        $("#modal_view_files"+id_claim).modal('show');
                                    });

                                    $("#upload_file"+id_claim+"").submit(function(e) {
                                        e.preventDefault();
                                        $(this).ajaxSubmit({
                                            beforeSubmit: () => {
                                                $("#progress-bar"+id_claim+"").width('0%');
                                            },
                                            uploadProgress: (event, position, total, percentComplete) => {
                                                $("#progress-bar"+id_claim+"").width(percentComplete + '%');
                                                $("span#progress"+id_claim+"").text(percentComplete+"%");
                                            },
                                            success: (data) => {
                                                let data_json = JSON.parse(data);
                                                let select_claim = data_json.select_claim;
                                                let due_date = Date.parse(data_json.due_date);
                                                let dateNow = Date.parse(data_json.dateNow);
                                                function closeModal() {
                                                    if(dateNow > due_date) {
                                                        $("#status_color"+id_claim+"").addClass('kuning');
                                                    } else {
                                                        $("#status_color"+id_claim+"").addClass('hijau');
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
                                                    $("#download_ppt_file"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                                    if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                                        $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                                        $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                                    }
                                                }
                                                function afterUpload() {
                                                    $("span.file-input-name").text("");
                                                    $("#progress-bar"+id_claim+"").width('0%');
                                                    $("#nama_file"+id_claim+"").val(null);
                                                }
                                                setTimeout(successUpload, 1500);
                                                setTimeout(afterUpload, 2000);
                                                $("#upload-ppt"+id_claim+"").unbind();
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                alert(textStatus +" "+errorThrown);
                                                // $("#error_text").text(textStatus +" "+errorThrown);
                                                // $("#modal-error-ajax").modal('show');;
                                            }
                                        });
                                    });


                                    $("#upload_ofpfile"+id_claim+"").submit(function(e) {
                                        e.preventDefault();
                                        $(this).ajaxSubmit({
                                            beforeSubmit: () => {
                                                $("#progress-bar-ofp"+id_claim+"").width('0%');
                                            },
                                            uploadProgress: (event, position, total, percentComplete) => {
                                                
                                                $("#progress-bar-ofp"+id_claim+"").width(percentComplete + '%');
                                                $("span#progress-ofp"+id_claim+"").text(percentComplete+"%");
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
                                                    $("#download_ofp_file"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                                    if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                                        $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                                        $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                                    }
                                                }
                                                function afterUpload() {
                                                    $("span.file-input-name").text("");
                                                    $("#progress-bar-ofp"+id_claim+"").width('0%');
                                                    $("#nama_file_ofp"+id_claim+"").val(null);
                                                }
                                                setTimeout(successUpload, 1500);
                                                setTimeout(afterUpload, 2000);
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                alert(textStatus +" "+errorThrown);
                                                // $("#error_text").text(textStatus +" "+errorThrown);
                                                // $("#modal-error-ajax").modal('show');;
                                            }
                                        });
                                    });

                                    $("#simpan_pergantian"+id_claim+"").click((e) => {
                                        e.preventDefault();
                                        let tgl_pembayaran = $("#tgl_pembayaran"+id_claim+"").val();
                                        let no_gi_451 = $("#no_gi_451"+id_claim+"").val();
                                        let no_gi_945 = $("#no_gi_945"+id_claim+"").val();
                                        if(tgl_pembayaran != "" && no_gi_451 != "" && no_gi_945 != "") {
                                            $.ajax({
                                                url: simpan_pergantian_part,
                                                type: "POST",
                                                data: $("#upload_pergantian"+id_claim+"").serialize(),
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
                                                    let status_pergantian = "<i id='ganti-part"+id_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i> Sudah melakukan pergantian part"
                                                    $("#tgl_pembayaran"+id_claim+"").val(null);
                                                    $("#no_gi_451"+id_claim+"").val("");
                                                    $("#no_gi_945"+id_claim+"").val("");
                                                    $("#modal-pergantian-part"+id_claim+"").remove();
                                                    $("#pergantian_part"+id_claim+"").html(status_pergantian);
                                                    $("#pergantian-part"+id_claim+"").modal('hide');
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

                                    $("#simpan_sortir"+id_claim+"").click((e) => {
                                        e.preventDefault();
                                        let tgl_sortir = $("#tgl_sortir"+id_claim+"").val();
                                        let stock = $("#stock"+id_claim+"").val();
                                        let ok = $("#ok"+id_claim+"").val();
                                        let ng = $("#ng"+id_claim+"").val();
                                        if(tgl_sortir != "" && stock != "" && ok != "" && ng != "") {
                                            $.ajax({
                                                url: simpan_sortir+id_claim,
                                                type: "POST",
                                                data: $("#create_sortir_stock"+id_claim+"").serialize(),
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
                                                    console.log(data);
                                                    let responseJSON = data.responseJSON.select_claim;
                                                    let sisa_stock = data.responseJSON.sisa_stock;
                                                    let status_complete;
                                                    if(parseInt(sisa_stock) > 0) {
                                                        status_complete = "<a href='javascript:;' id='modal-sortir-stock"+responseJSON.id_customer_claim+"' class='btn btn-success'><i class='entypo-pencil'></i></a>"
                                                    } else {
                                                        status_complete = "<i id='ganti-part"+id_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i>"
                                                    }
                                                    
                                                    $("#modal-sortir-stock"+id_claim+"").remove();
                                                    $("#tgl_sortir"+id_claim+"").val(null);
                                                    $("#type"+id_claim+"").val("");
                                                    $("#stock"+id_claim+"").val(0);
                                                    $("#ok"+id_claim+"").val(0);
                                                    $("#ng"+id_claim+"").val(0);
                                                    $("#sisa"+id_claim+"").val(0);
                                                    $("#status-sortir-stock"+id_claim+"").html(status_complete);
                                                    $("#sortir-stock"+id_claim+"").modal('hide');
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
                                    
                                    $("#pfmea_file"+id_claim+"").submit(function(e) {
                                        e.preventDefault();
                                        $(this).ajaxSubmit({
                                            beforeSubmit: () => {
                                                $("#progress-bar-pfmea"+id_claim+"").width('0%');
                                            },
                                            uploadProgress: (event, position, total, percentComplete) => {
                                                $("#progress-bar-pfmea"+id_claim+"").width(percentComplete + '%');
                                                $("span#progress-pfmea"+id_claim+"").text(percentComplete+"%");
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
                                                    $(".enable_pfmea"+jsonResponse.id_customer_claim).attr("id", "modal_files"+id_pfmea+"");
                                                    if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                                        $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                                        $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                                    }
                                                }
                                                function afterUpload() {
                                                    $("span.file-input-name").text("");
                                                    $("#progress-bar-pfmea"+id_claim+"").width('0%');
                                                    $("#nama_file_pfmea"+id_claim+"").val(null);
                                                }
                                                setTimeout(successUpload, 1500);
                                                setTimeout(afterUpload, 2000);
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                alert(textStatus +" "+errorThrown);
                                            }
                                        });
                                    });
                                }	
                            }

                        load_uniqID();
                    },
                });
            }

            function filter_customer_in_table() {
                $("#table_ganti_customer, #table_ganti_part, #table_year, #banyak_data").change((e)=> {
                    let new_date = new Date();
                    let dateNow = formatDate(new_date);
                    $.ajax({
                        type: "GET",
                        url: filter_table,
                        data: $("#filter_table").serialize(),
                        dataType: "JSON",
                        beforeSend: () => {
                            $("#main-table").removeClass("show-main-table");
                            $("#main-table").addClass("hide-main-table");
                            $("#skeleton-table").addClass("show-skeleton-table");
                            table_customer_claim.clear().draw();
                        },
                        success: (data) => {
                            function show_table() {
                                $("#skeleton-table").removeClass("show-skeleton-table");
                                $("#skeleton-table").addClass("remove-skeleton-table");
                                $("#main-table").removeClass("hide-main-table");
                                $("#main-table").addClass("show-main-table");
                            }
                            let uniq = 1;
                            for(let i in data) {
                                let no = parseInt(i) + 1;
                                let create_date = new Date(data[i].tgl_input);
                                create_date.setDate(create_date.getDate() + 3);
                                let year = create_date.getFullYear();
                                let increment_month = create_date.getMonth() + 1
                                let month = ('0' + increment_month).slice(-2);
                                let day = ('0' + create_date.getDate()).slice(-2);
                                let due_date = `${year}-${month}-${day}`;
                                let date_now = Date.parse(dateNow);
                                let parse_due_date = Date.parse(due_date);
                                let ofp_upload = "<a href='javascript:;' id='modal-upload-ofp"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-upload'></i></a>";
                                let button_upload = "<a href='javascript:;' id='modal-upload-ppt"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-upload'></i></a>";
                                let pergantian_part;
                                let button_download;
                                let ofp_download;
                                let upload_pfmea = "<a href='javascript:;' id='modal-pfmea"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-upload'></i></a>";
                                let see_pfmea;
                                let sortir_stock;
                                if(data[i].ppt_file == null) {
                                    // button_download = "<a disabled class='btn btn-success btn-icon icon-left' id='download_ppt_file"+data[i].id_customer_claim+"'> Download<i class='entypo-download'></i></a>";
                                    button_download = "<a class='btn btn-success enable_pica"+data[i].id_customer_claim+"' id='download_ppt_file"+data[i].id_customer_claim+"' disabled><i class='entypo-eye'></i></a>";
                                } else {
                                    if(data[i].ppt_file != null) {
                                        button_download  = "<a href='javascript:;' id='download_ppt_file"+data[i].id_customer_claim+"' class='btn btn-success'><i class='entypo-eye'></i></a>";
                                    }		
                                }

                                if(data[i].ofp == null) {
                                    ofp_download = "<a class='btn btn-red enable_ofp"+data[i].id_customer_claim+"' id='download_ofp_file"+data[i].id_customer_claim+"' disabled><i class='entypo-eye'></i></a>";
                                } else {
                                    if(data[i].ofp != null) {
                                        ofp_download  = "<a href='javascript:;' id='download_ofp_file"+data[i].id_customer_claim+"' class='btn btn-red'><i class='entypo-eye'></i></a>";
                                    }		
                                }

                                if(data[i].id_pergantian_part == null) {
                                    pergantian_part = "<a href='javascript:;' id='modal-pergantian-part"+data[i].id_customer_claim+"' class='btn btn-info btn-icon icon-left'><i class='entypo-pencil'></i> Pergantian part</a>";
                                } else {
                                    if(data[i].id_pergantian_part != null) {
                                        pergantian_part = "<i id='ganti-part"+data[i].id_customer_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i> Sudah melakukan pergantian part";
                                    }
                                }

                                if(data[i].id_sortir_stock == null) {
                                    sortir_stock = "<a href='javascript:;' id='modal-sortir-stock"+data[i].id_customer_claim+"' class='btn btn-blue'><i class='entypo-pencil'></i></a>";
                                } else {
                                    if(data[i].id_sortir_stock != null) {
                                        if(data[i].sisa > 0) {
                                            sortir_stock = "<a href='javascript:;' id='modal-sortir-stock"+data[i].id_customer_claim+"' class='btn btn-success'><i class='entypo-pencil'></i></a>";
                                        } else {
                                            if(data[i].sisa == 0) {
                                                sortir_stock = "<i id='ganti-part"+data[i].id_customer_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i>";
                                            }
                                        }
                                        
                                    }
                                }

                                if(data[i].id_pfmea == null) {
                                    see_pfmea = "<a class='btn btn-info enable_pfmea"+data[i].id_customer_claim+"' disabled><i class='entypo-eye'></i></a>";
                                } else {
                                    if(data[i].id_pfmea != null) {
                                        see_pfmea  = "<a href='javascript:;' id='modal_files"+data[i].id_customer_claim+"' class='btn btn-info'><i class='entypo-eye'></i></a>";
                                    }
                                }

                                if(data[i].ofp != null && data[i].id_pergantian_part != null && data[i].id_sortir_stock != null && data[i].ppt_file != null && data[i].id_pfmea != null) {
                                    data[i].status = 'CLOSE';
                                }

                                if(data[i].card == "#N/A") {
                                    data[i].card = '-'
                                }

                                table_customer_claim.row.add([
                                    ''+uniq+'',
                                    ''+data[i].tgl_input+'',
                                    ''+data[i].no_surat_claim+'',
                                    ''+data[i].nama_part+'',
                                    ''+data[i].type+'',
                                    ''+data[i].proses+'',
                                    ''+due_date+'',
                                    ''+ofp_upload+' '+ofp_download+'',
                                    ''+pergantian_part+'',
                                    ''+sortir_stock+'',
                                    ''+button_upload+' '+button_download+'',
                                    ''+upload_pfmea+' '+see_pfmea+'',
                                    ''+data[i].status+'',
                                    ''+data[i].card+''
                                ]).draw(false);
                                uniq += 1;
                            }

                            setTimeout(show_table, 500);
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            alert(textStatus +" "+errorThrown);
                        },
                        complete: (data) => {
                            function load_uniqID() {
                                    let sign = 1;
                                    for(let i in data.responseJSON) {
                                        let create_date = new Date(data.responseJSON[i].tgl_input);
                                        create_date.setDate(create_date.getDate() + 3);
                                        let year = create_date.getFullYear();
                                        let increment_month = create_date.getMonth() + 1
                                        let month = ('0' + increment_month).slice(-2);
                                        let day = ('0' + create_date.getDate()).slice(-2);
                                        let due_date = `${year}-${month}-${day}`;
                                        let date_now = Date.parse(dateNow);
                                        let parse_due_date = Date.parse(due_date);
                                        let id_claim = data.responseJSON[i].id_customer_claim;
                                        let uniqID = "status_color"+id_claim;
                                        let id_card = "card-"+sign;
                                        let status = "status_claim"+id_claim;
                                        let card = data.responseJSON[i].card;
                                        let pergantian_part = "pergantian_part"+id_claim;
                                        let status_sortir_stock = "status-sortir-stock"+id_claim;
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(7)").attr("id", uniqID);
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(14)").attr("id", id_card);
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(6)").attr("class", "proses");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(5)").attr("class", "proses");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(3)").attr("class", "no_surat_claim");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(11)").attr("class", "pica");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(9)").attr("class", "centered");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(9)").attr("id", pergantian_part);
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(10)").attr("class", "centered");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(10)").attr("id", status_sortir_stock);
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(13)").attr("class", "centered");
                                        $("#table_customer_claim tr:nth-child("+sign+") td:nth-child(13)").attr("id", status);
                                        $("#status_claim"+id_claim+"").addClass("status");
                                        if(date_now > parse_due_date) {
                                            if(data.responseJSON[i].ppt_file != null) {
                                                $("#"+uniqID).addClass("kuning");
                                            } else {
                                                $("#"+uniqID).addClass("red");
                                            }
                                        } else {
                                            if(data.responseJSON[i].ppt_file != null) {
                                                $("#"+uniqID).addClass("hijau");
                                            } else {
                                                $("#"+uniqID).addClass("text-align");
                                            }
                                        }

                                        if(card == 'Green Card') {
                                            $("#"+id_card).addClass("hijau");
                                        } else if(card == 'Yellow Card') {
                                            $("#"+id_card).addClass("kuning");
                                        } else {
                                            if(card == 'Red Card') {
                                                $("#"+id_card).addClass("red");
                                            } else {
                                                $("#"+id_card).addClass("netral");
                                            }
                                        }
                                        sign += 1;


                                        // var table_file_pica_filter = $("#table_file_pica"+id_claim).DataTable({
                                        //     "oLanguage": {
                                        //         "sSearch": "Search:",
                                        //         "oPaginate": {
                                        //             "sPrevious": "Previous",
                                        //             "sNext": "Next"
                                        //         }
                                        //     },
                                        //     "lengthChange": false,
                                        //     "JQueryUI":true,
                                        //     "scrollCollapse":true,
                                        //     "paging": true,
                                        //     "initComplete": function (settings, json) {  
                                        //         $("#table_file_pica"+id_claim).wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
                                        //     },
                                        // });

                                        $("#table_customer_claim").on('click', '#modal-upload-ppt'+id_claim+'', function() {
                                            $("#upload-ppt"+id_claim).modal('show');
                                        });

                                        $("#table_customer_claim").on('click', '#modal-upload-ofp'+id_claim+'', function() {
                                            $("#upload-ofp"+id_claim).modal('show');
                                        });

                                        $("#table_customer_claim").on('click', '#modal-pergantian-part'+id_claim+'', function() {
                                            $("#pergantian-part"+id_claim).modal('show');
                                        });

                                        $("#table_customer_claim").on('click', '#modal-pfmea'+id_claim+'', () => {
                                            $("#pfmea"+id_claim).modal('show');
                                        });

                                        $("#table_customer_claim").on('click', '#modal-sortir-stock'+id_claim+'', function() {
                                            $.ajax({
                                                type: "GET",
                                                url: sortir_part+id_claim,
                                                dataType: "JSON",
                                                cache: false,
                                                beforeSend: () => {
                                                    $("#problem_part"+id_claim).html("");
                                                },
                                                success: (data_sortir) => {
                                                    $("#problem_part"+id_claim).html("");
                                                    let mod = data_sortir.sisa;
                                                    let stock = data_sortir.stock;
                                                    let ok = data_sortir.ok;
                                                    let ng = data_sortir.ng;
                                                    parseInt($("#ok"+id_claim).val(ok));
                                                    parseInt($("#ng"+id_claim).val(ng));
                                                    parseInt($("#sisa"+id_claim).val(mod));
                                                    ok = parseInt($("#ok"+id_claim).val());
                                                    ng = parseInt($("#ng"+id_claim).val());
                                                    if(mod != 0) {
                                                        ok = parseInt($("#ok"+id_claim).val());
                                                        ng = parseInt($("#ng"+id_claim).val());
                                                        if(ok > 0) {
                                                            $("#btn_min_ok"+id_claim).attr("disabled", false);
                                                        } else {
                                                            $("#btn_min_ok"+id_claim).attr("disabled", true);
                                                        }
    
                                                        if(ng > 0) {
                                                            $("#btn_min_ng"+id_claim).attr("disabled", false);
                                                        } else {
                                                            $("#btn_min_ng"+id_claim).attr("disabled", true);
                                                        }
    
                                                        // $("#ok"+id_claim).attr('readonly', false);
                                                        // $("#ng"+id_claim).attr('readonly', false);
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                        parseInt($("#stock"+id_claim).val(stock));
                                                    } else {
                                                        // $("#ok"+id_claim).attr('readonly', true);
                                                        // $("#ng"+id_claim).attr('readonly', true);
                                                        $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                        $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                        $("#btn_min_ok"+id_claim).attr("disabled", true);
                                                        $("#btn_min_ng"+id_claim).attr("disabled", true);
                                                        parseInt($("#stock"+id_claim).val(0));
                                                    }
    
                                                    stock = parseInt($("#stock"+id_claim).val());
                                                    let sisa = parseInt($("#sisa"+id_claim).val());
    
                                                    $("#stock"+id_claim).keyup((e) => {
                                                        stock = parseInt($(e.target).val());
                                                        if(stock > 0) {
                                                            $("#ok"+id_claim).attr('readonly', false);
                                                            $("#ng"+id_claim).attr('readonly', false);
                                                            $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                            $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                        } else {
                                                            $("#ok"+id_claim).attr('readonly', true);
                                                            $("#ng"+id_claim).attr('readonly', true);
                                                            $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                            $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                            parseInt($("#sisa"+id_claim).val(0));
                                                            parseInt($(e.target).val(0));
                                                        }

                                                        if(ok > 0 || ng > 0) {
                                                            sisa = stock - Math.abs(ok + ng);
                                                            if(sisa > 0) {
                                                                parseInt($("#sisa"+id_claim).val(sisa));
                                                            }
                                                            if(stock < Math.abs(ok + ng)) {
                                                                // parseInt($(e.target).val(Math.abs(ok + ng)));
                                                                sisa = parseInt($("#sisa"+id_claim).val(0));
                                                                
                                                            }
    
                                                            if(stock >= Math.abs(ok + ng)) {
                                                                sisa = stock - Math.abs(ok + ng);
                                                                sisa = parseInt($("#sisa"+id_claim).val(sisa));
                                                            }
                                                        }
                                                    });
    
                                                    $("#ok"+id_claim).keyup((e) => {
                                                        ok = parseInt($(e.target).val());
                                                        ng = parseInt($("#ng"+id_claim).val());
                                                        // console.log(ok);
                                                        if(ok > 0) {
                                                            $("#btn_min_ok"+id_claim).attr("disabled", false);
                                                        } else {
                                                            $("#btn_min_ok"+id_claim).attr("disabled", true);
                                                        }
                                                        if(Math.abs(ok + ng) >= stock) {
                                                            $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                            $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                            // $("#ng"+id_claim).attr("readonly", true);
                                                            // $("#ok"+id_claim).attr("readonly", true);
                                                            parseInt($("#sisa"+id_claim).val(0));
                                                            $("#stock"+id_claim).val(Math.abs(ok + ng));
                                                        } else {
                                                            $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                            $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                            // $("#ok"+id_claim).attr("readonly", false);
                                                            // $("#ng"+id_claim).attr("readonly", false);
                                                            console.log(ng);
                                                            sisa = stock - Math.abs(ok + ng);
                                                            
                                                            parseInt($("#sisa"+id_claim).val(sisa));
                                                        }
                                                        
                                                    });
    
    
                                                    $("#ng"+id_claim).keyup((e) => {
                                                        ng = parseInt($(e.target).val());
                                                        if(ng > 0) {
                                                            $("#btn_min_ng"+id_claim).attr("disabled", false);
                                                        } else {
                                                            $("#btn_min_ng"+id_claim).attr("disabled", true);
                                                        }
                                                        if(Math.abs(ok + ng) >= stock) {
                                                            $("#btn_plus_ng"+id_claim).attr("disabled", true);
                                                            $("#btn_plus_ok"+id_claim).attr("disabled", true);
                                                            // $("#ng"+id_claim).attr("readonly", true);
                                                            // $("#ok"+id_claim).attr("readonly", true);
                                                            parseInt($("#sisa"+id_claim).val(0));
                                                            $("#stock"+id_claim).val(Math.abs(ok + ng));
                                                        } else {
                                                            $("#btn_plus_ng"+id_claim).attr("disabled", false);
                                                            $("#btn_plus_ok"+id_claim).attr("disabled", false);
                                                            // $("#ng"+id_claim).attr("readonly", false);
                                                            // $("#ok"+id_claim).attr("readonly", false);
                                                            sisa = stock - Math.abs(ok + ng);
                                                            parseInt($("#sisa"+id_claim).val(sisa));
                                                        }
                                                        
                                                    });
    
                                                    let label = ["label-primary", "label-secondary", "label-success",
                                                        "label-info", "label-warning", "label-danger"];
                                                        
                                                    for(let i in data_sortir.problem_part) {
                                                        let problem = "<div class='label "+label[Math.floor(Math.random() * label.length)]+" tooltip-primary' data-toggle='tooltip' data-placement='top' title='' data-original-title='Tooltip on top'>"+data_sortir.problem_part[i]+"</div>";
                                                        $("#problem_part"+id_claim).append(problem);
                                                    }
                                                    $("#sortir-stock"+id_claim).modal('show');
                                                },
                                                error: (jqXHR, textStatus, errorThrown) => {
                                                    alert(textStatus +" "+errorThrown);
                                                }
                                            });
                                        });

                                        // $("#table_customer_claim").on('click', '#download_ofp_file'+id_claim+'', () => {
                                        //     $.ajax({
                                        //         type: "GET",
                                        //         url: get_ofp_files+id_claim,
                                        //         dataType: "JSON",
                                        //         beforeSend: () => {
                                        //             table_file_ofp.clear().draw();
                                        //         },
                                        //         success: (data) => {
                                        //             for(let index in data) {
                                        //                 let nomor = parseInt(index) + 1;
                                        //                 let button_download_files = "<a target='_blank' href='"+ofp+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
                                        //                 table_file_ofp.row.add([
                                        //                     ''+nomor+'',
                                        //                     ''+data[index].tgl_upload+'',
                                        //                     ''+data[index].nama_file+'',
                                        //                     ''+button_download_files+''
                                        //                 ]).draw(false);
                                        //             }
                                        //         },
                                        //         error: (jqXHR, textStatus, errorThrown) => {
                                        //             alert(textStatus +" "+errorThrown);
                                        //         }
                                        //     });
                                        //     $("#modal_view_ofp_files"+id_claim).modal('show');
                                        // });
                                        
    
                                        $("#table_customer_claim").on('click', '#download_ppt_file'+id_claim+'', () => {
                                            // $.ajax({
                                            //     type: "GET",
                                            //     url: get_pica_files+id_claim,
                                            //     dataType: "JSON",
                                            //     beforeSend: () => {
                                            //         table_file_pica_filter.clear().draw();
                                            //     },
                                            //     success: (data) => {
                                            //         for(let index in data) {
                                            //             let nomor = parseInt(index) + 1;
                                            //             let button_download_files = "<a target='_blank' href='"+pica+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
                                            //             table_file_pica_filter.row.add([
                                            //                 ''+nomor+'',
                                            //                 ''+data[index].tgl_upload+'',
                                            //                 ''+data[index].nama_file+'',
                                            //                 ''+button_download_files+''
                                            //             ]).draw(false);
                                            //         }
                                            //     },
                                            //     error: (jqXHR, textStatus, errorThrown) => {
                                            //         alert(textStatus +" "+errorThrown);
                                            //     }
                                            // });
                                            $("#modal_view_pica_files"+id_claim).modal('show');
                                        });
    
                                        // $("#table_customer_claim").on('click', '#modal_files'+id_claim+'', function() {
                                        //     $.ajax({
                                        //         type: "GET",
                                        //         url: get_pfmea_files+id_claim,
                                        //         dataType: "JSON",
                                        //         beforeSend: () => {
                                        //             table_file_pfmea.clear().draw();
                                        //         },
                                        //         success: (data) => {
                                        //             for(let index in data) {
                                        //                 let nomor = parseInt(index) + 1;
                                        //                 let button_download_files = "<a target='_blank' href='"+pfmea+data[index].nama_file+"' class='btn btn-blue'><i class='entypo-download'></i></a>";
                                        //                 table_file_pfmea.row.add([
                                        //                     ''+nomor+'',
                                        //                     ''+data[index].tgl_upload+'',
                                        //                     ''+data[index].nama_file+'',
                                        //                     ''+button_download_files+''
                                        //                 ]).draw(false);
                                        //             }
                                        //         },
                                        //         error: (jqXHR, textStatus, errorThrown) => {
                                        //             alert(textStatus +" "+errorThrown);
                                        //         }
                                        //     });
                                        //     $("#modal_view_files"+id_claim).modal('show');
                                        // });

                                        // $("#upload_file"+id_claim+"").submit(function(e) {
                                        //     e.preventDefault();
                                        //     $(this).ajaxSubmit({
                                        //         beforeSubmit: () => {
                                        //             $("#progress-bar"+id_claim+"").width('0%');
                                        //         },
                                        //         uploadProgress: (event, position, total, percentComplete) => {
                                        //             $("#progress-bar"+id_claim+"").width(percentComplete + '%');
                                        //             $("span#progress"+id_claim+"").text(percentComplete+"%");
                                        //         },
                                        //         success: (data) => {
                                        //             let data_json = JSON.parse(data);
                                        //             let select_claim = data_json.select_claim;
                                        //             let due_date = Date.parse(data_json.due_date);
                                        //             let dateNow = Date.parse(data_json.dateNow);
                                        //             function closeModal() {
                                        //                 if(dateNow > due_date) {
                                        //                     $("#status_color"+id_claim+"").addClass('kuning');
                                        //                 } else {
                                        //                     $("#status_color"+id_claim+"").addClass('hijau');
                                        //                 }
                                        //                 $("#upload-ppt"+select_claim.id_customer_claim).modal('hide');
                                        //             }
                                        //             setTimeout(closeModal, 1500);
                                        //         },
                                        //         complete: (data) => {
                                        //             let data_json = JSON.parse(data.responseText);
                                        //             let jsonResponse = data_json.select_claim;
                                        //             var opts = {
                                        //                 "closeButton": true,
                                        //                 "debug": false,
                                        //                 "positionClass": "toast-top-right",
                                        //                 "onclick": null,
                                        //                 "showDuration": "300",
                                        //                 "hideDuration": "1000",
                                        //                 "timeOut": "5000",
                                        //                 "extendedTimeOut": "1000",
                                        //                 "showEasing": "swing",
                                        //                 "hideEasing": "linear",
                                        //                 "showMethod": "fadeIn",
                                        //                 "hideMethod": "fadeOut"
                                        //             };
                                        //             function successUpload() {
                                        //                 toastr.success('FILE PICA BERHASIL DIUPLOAD', "SUCCESS", opts);
                                        //                 $("#download_ppt_file"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                        //                 if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                        //                     $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                        //                     $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                        //                 }
                                        //             }
                                        //             function afterUpload() {
                                        //                 $("span.file-input-name").text("");
                                        //                 $("#progress-bar"+id_claim+"").width('0%');
                                        //                 $("#nama_file"+id_claim+"").val(null);
                                        //             }
                                        //             setTimeout(successUpload, 1500);
                                        //             setTimeout(afterUpload, 2000);
                                        //             $("#upload-ppt"+id_claim+"").unbind();
                                        //         },
                                        //         error: function(jqXHR, textStatus, errorThrown) {
                                        //             alert(textStatus +" "+errorThrown);
                                        //             // $("#error_text").text(textStatus +" "+errorThrown);
                                        //             // $("#modal-error-ajax").modal('show');;
                                        //         }
                                        //     });
                                        // });

                                        // $("#upload_ofpfile"+id_claim+"").submit(function(e) {
                                        //     e.preventDefault();
                                        //     $(this).ajaxSubmit({
                                        //         beforeSubmit: () => {
                                        //             $("#progress-bar-ofp"+id_claim+"").width('0%');
                                        //         },
                                        //         uploadProgress: (event, position, total, percentComplete) => {
                                                    
                                        //             $("#progress-bar-ofp"+id_claim+"").width(percentComplete + '%');
                                        //             $("span#progress-ofp"+id_claim+"").text(percentComplete+"%");
                                        //         },
                                        //         success: (data) => {
                                        //             let data_json = JSON.parse(data);
                                        //             let select_claim = data_json.select_claim;
                                        //             function closeModal() {
                                        //                 $("#upload-ofp"+select_claim.id_customer_claim).modal('hide');
                                        //             }
                                        //             setTimeout(closeModal, 1500);
                                        //         },
                                        //         complete: (data) => {
                                        //             let data_json = JSON.parse(data.responseText);
                                        //             let jsonResponse = data_json.select_claim;
                                        //             var opts = {
                                        //                 "closeButton": true,
                                        //                 "debug": false,
                                        //                 "positionClass": "toast-top-right",
                                        //                 "onclick": null,
                                        //                 "showDuration": "300",
                                        //                 "hideDuration": "1000",
                                        //                 "timeOut": "5000",
                                        //                 "extendedTimeOut": "1000",
                                        //                 "showEasing": "swing",
                                        //                 "hideEasing": "linear",
                                        //                 "showMethod": "fadeIn",
                                        //                 "hideMethod": "fadeOut"
                                        //             };
                                        //             function successUpload() {
                                        //                 toastr.success('FILE OFP BERHASIL DIUPLOAD', "SUCCESS", opts);
                                        //                 $("#download_ofp_file"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                        //                 if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                        //                     $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                        //                     $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                        //                 }
                                        //             }
                                        //             function afterUpload() {
                                        //                 $("span.file-input-name").text("");
                                        //                 $("#progress-bar-ofp"+id_claim+"").width('0%');
                                        //                 $("#nama_file_ofp"+id_claim+"").val(null);
                                        //             }
                                        //             setTimeout(successUpload, 1500);
                                        //             setTimeout(afterUpload, 2000);
                                        //         },
                                        //         error: function(jqXHR, textStatus, errorThrown) {
                                        //             alert(textStatus +" "+errorThrown);
                                        //             // $("#error_text").text(textStatus +" "+errorThrown);
                                        //             // $("#modal-error-ajax").modal('show');;
                                        //         }
                                        //     });
                                        // });

                                        // $("#simpan_pergantian"+id_claim+"").click((e) => {
                                        //     e.preventDefault();
                                        //     let tgl_pembayaran = $("#tgl_pembayaran"+id_claim+"").val();
                                        //     let no_gi_451 = $("#no_gi_451"+id_claim+"").val();
                                        //     let no_gi_945 = $("#no_gi_945"+id_claim+"").val();
                                        //     if(tgl_pembayaran != "" && no_gi_451 != "" && no_gi_945 != "") {
                                        //         $.ajax({
                                        //             url: simpan_pergantian_part,
                                        //             type: "POST",
                                        //             data: $("#upload_pergantian"+id_claim+"").serialize(),
                                        //             dataType: "JSON",
                                        //             cache: false,
                                        //             success: (data) => {
                                        //                 var opts = {
                                        //                     "closeButton": true,
                                        //                     "debug": false,
                                        //                     "positionClass": "toast-top-right",
                                        //                     "onclick": null,
                                        //                     "showDuration": "300",
                                        //                     "hideDuration": "1000",
                                        //                     "timeOut": "5000",
                                        //                     "extendedTimeOut": "1000",
                                        //                     "showEasing": "swing",
                                        //                     "hideEasing": "linear",
                                        //                     "showMethod": "fadeIn",
                                        //                     "hideMethod": "fadeOut"
                                        //                 };
                                        //                 toastr.success('PERGANTIAN PART BERHASIL DILAKUKAN!', "SUCCESS", opts);
    
                                        //             },
                                        //             complete: (data) => {
                                        //                 let responseJSON = data.responseJSON.select_claim;
                                        //                 let status_pergantian = "<i id='ganti-part"+id_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i> Sudah melakukan pergantian part"
                                        //                 $("#tgl_pembayaran"+id_claim+"").val(null);
                                        //                 $("#no_gi_451"+id_claim+"").val("");
                                        //                 $("#no_gi_945"+id_claim+"").val("");
                                        //                 $("#modal-pergantian-part"+id_claim+"").remove();
                                        //                 $("#pergantian_part"+id_claim+"").html(status_pergantian);
                                        //                 $("#pergantian-part"+id_claim+"").modal('hide');
                                        //                 if(responseJSON.ppt_file != null && responseJSON.ofp != null && responseJSON.id_pergantian_part != null && responseJSON.id_sortir_stock != null && responseJSON.id_pfmea != null) {
                                        //                     $("#status_claim"+responseJSON.id_customer_claim).text("");
                                        //                     $("#status_claim"+responseJSON.id_customer_claim).text("CLOSE");
                                        //                 }
                                        //             },
                                        //             error: (jqXHR, textStatus, errorThrown) => {
                                        //                 alert(textStatus +" "+errorThrown);
                                        //             }
                                        //         });
                                        //     } else {
                                        //         alert("SEMUA FIELD HARUS DI ISI TERLEBIH DAHULU!!!");
                                        //     }
                                        // });

                                        $("#simpan_sortir"+id_claim+"").click((e) => {
                                            e.preventDefault();
                                            let tgl_sortir = $("#tgl_sortir"+id_claim+"").val();
                                            let stock = $("#stock"+id_claim+"").val();
                                            let ok = $("#ok"+id_claim+"").val();
                                            let ng = $("#ng"+id_claim+"").val();
                                            if(tgl_sortir != "" && stock != "" && ok != "" && ng != "") {
                                                $.ajax({
                                                    url: simpan_sortir+id_claim,
                                                    type: "POST",
                                                    data: $("#create_sortir_stock"+id_claim+"").serialize(),
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
                                                            status_complete = "<i id='ganti-part"+id_claim+"' class='entypo-check' style='color: #21bf73; font-weight: bold; font-size: 15px;'></i>"
                                                        }
                                                        
                                                        $("#modal-sortir-stock"+id_claim+"").remove();
                                                        $("#tgl_sortir"+id_claim+"").val(null);
                                                        $("#type"+id_claim+"").val("");
                                                        $("#stock"+id_claim+"").val(0);
                                                        $("#ok"+id_claim+"").val(0);
                                                        $("#ng"+id_claim+"").val(0);
                                                        $("#sisa"+id_claim+"").val(0);
                                                        $("#status-sortir-stock"+id_claim+"").html(status_complete);
                                                        $("#sortir-stock"+id_claim+"").modal('hide');
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


                                        // $("#pfmea_file"+id_claim+"").submit(function(e) {
                                        //     e.preventDefault();
                                        //     $(this).ajaxSubmit({
                                        //         beforeSubmit: () => {
                                        //             $("#progress-bar-pfmea"+id_claim+"").width('0%');
                                        //         },
                                        //         uploadProgress: (event, position, total, percentComplete) => {
                                        //             $("#progress-bar-pfmea"+id_claim+"").width(percentComplete + '%');
                                        //             $("span#progress-pfmea"+id_claim+"").text(percentComplete+"%");
                                        //         },
    
                                        //         success: (data) => {
                                        //             let data_json = JSON.parse(data);
                                        //             let select_claim = data_json.select_claim;
                                        //             let due_date = Date.parse(data_json.due_date);
                                        //             let dateNow = Date.parse(data_json.dateNow);
                                        //             function closeModal() {
                                        //                 $("#pfmea"+select_claim.id_customer_claim).modal('hide');
                                        //             }
                                        //             setTimeout(closeModal, 1500);
                                        //         },
                                        //         complete: (data) => {
                                        //             let data_json = JSON.parse(data.responseText);
                                        //             let jsonResponse = data_json.select_claim;
                                        //             let fileName = data_json.file_name;
                                        //             let id_pfmea = jsonResponse.id_pfmea;
                                        //             var opts = {
                                        //                 "closeButton": true,
                                        //                 "debug": false,
                                        //                 "positionClass": "toast-top-right",
                                        //                 "onclick": null,
                                        //                 "showDuration": "300",
                                        //                 "hideDuration": "1000",
                                        //                 "timeOut": "5000",
                                        //                 "extendedTimeOut": "1000",
                                        //                 "showEasing": "swing",
                                        //                 "hideEasing": "linear",
                                        //                 "showMethod": "fadeIn",
                                        //                 "hideMethod": "fadeOut"
                                        //             };
                                        //             function successUpload() {
                                        //                 toastr.success('FILE PFMEA BERHASIL DIUPLOAD', "SUCCESS", opts);
                                        //                 $(".enable_pfmea"+jsonResponse.id_customer_claim).removeAttr("disabled");
                                        //                 $(".enable_pfmea"+jsonResponse.id_customer_claim).attr("id", "modal_files"+id_pfmea+"");
                                        //                 if(jsonResponse.ppt_file != null && jsonResponse.ofp != null && jsonResponse.id_pergantian_part != null && jsonResponse.id_sortir_stock != null && jsonResponse.id_pfmea != null) {
                                        //                     $("#status_claim"+jsonResponse.id_customer_claim).text("");
                                        //                     $("#status_claim"+jsonResponse.id_customer_claim).text("CLOSE");
                                        //                 }
                                        //             }
                                        //             function afterUpload() {
                                        //                 $("span.file-input-name").text("");
                                        //                 $("#progress-bar-pfmea"+id_claim+"").width('0%');
                                        //                 $("#nama_file_pfmea"+id_claim+"").val(null);
                                        //             }
                                        //             setTimeout(successUpload, 1500);
                                        //             setTimeout(afterUpload, 2000);
                                        //         },
                                        //         error: function(jqXHR, textStatus, errorThrown) {
                                        //             alert(textStatus +" "+errorThrown);
                                        //         }
                                        //     });
                                        // });
                                    }	
                                }

                            load_uniqID();
                        },
                    });
                });
            }
            filter_customer_in_table();
            load_all_customer_claim();
    });
}