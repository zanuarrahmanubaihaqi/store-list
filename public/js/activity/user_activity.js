function user_activity(root_url, count_aktivitas, id_user) {
    let target_url = root_url.concat("/aktivitasuser/aktivitas/get_data_aktivitas");
    let cnt_aktivitas = count_aktivitas;
    jQuery( document ).ready( function($) {
		let table_aktivitas = $('#table-aktivitas').DataTable({
			"oLanguage": {
				"sSearch": "Search:",
				"oPaginate": {
					"sPrevious": "Previous",
					"sNext": "Next"
				}
			},
            "server-side":true,
			"JQueryUI":true,
            "scrollCollapse":true,
            "initComplete": function (settings, json) {  
                $("#table-aktivitas").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
            },
        });
        
        let table_skeleton = $('#table_skeleton2').DataTable({
			"oLanguage": {
				"sSearch": "Search:",
				"oPaginate": {
					"sPrevious": "Previous",
					"sNext": "Next"
				}
			},
            "server-side":true,
			"JQueryUI":true,
            "scrollCollapse":true,
            "initComplete": function (settings, json) {  
                $("#table_skeleton2").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
            },
        });

        function load_data_aktivitas() {
            $.ajax({
                type: "GET",
                url: target_url,
                dataType: "JSON",
                cache: false,
                beforeSend: (data) => {
                    
                },
                success: (data) => {
                    // console.log(data);
                    let banyak_data = data.count_aktivitas;
                    let get_data = data.data_aktivitas;
                    let last_record = data.last_record;
                    function show_table() {
                        $("#skeleton-table2").removeClass("show-skeleton-table");
                        $("#skeleton-table2").addClass("remove-skeleton-table");
                        $("#main-table2").removeClass("hide-main-table");
                        $("#main-table2").addClass("show-main-table");
                    }
                    if(cnt_aktivitas != banyak_data) {
                        cnt_aktivitas = banyak_data;
                        let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
                        "September", "Oktober", "November", "Desember"];
                        $("#main-table2").removeClass("show-main-table");
                        $("#main-table2").addClass("hide-main-table");
                        $("#skeleton-table2").addClass("show-skeleton-table");
                        table_aktivitas.clear().draw();
                        function formatDate(date) {
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
                        let nomor = 1;
                        for(let i in get_data) {
                            let tanggal_aktivitas = formatDate(get_data[i].tgl);
                            table_aktivitas.row.add([
                                ''+nomor+'',
                                ''+get_data[i].full_name+'',
                                ''+get_data[i].aktivitas+'',
                                ''+tanggal_aktivitas+'',
                                ''+get_data[i].jam+''
                            ]);
                            table_aktivitas.draw();
                            nomor++;
                        }
                        if(last_record != null) {
                            if(last_record.id_users != id_user) {
                                var opts = {
                                    "closeButton": true,
                                    "debug": false,
                                    "positionClass": "toast-top-full-width",
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
                                toastr.success(last_record.full_name+" "+last_record.aktivitas, "SUCCESS", opts);
                            }
                        }
                        
                        setTimeout(show_table, 1500);
                    } else {
                        setTimeout(show_table, 1500);
                        cnt_aktivitas = banyak_data;
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        }

        function load_Initdata_aktivitas() {
            $.ajax({
                type: "GET",
                url: target_url,
                dataType: "JSON",
                cache: false,
                beforeSend: () => {
                    table_aktivitas.clear().draw();
                },
                success: (data) => {
                    let bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
                    "September", "Oktober", "November", "Desember"];
                    let get_data = data.data_aktivitas;
                    function show_table() {
                        $("#skeleton-table2").addClass("remove-skeleton-table");
                        $("#main-table2").removeClass("hide-main-table");
                        $("#main-table2").addClass("show-main-table");
                    }
                    function formatDate(date) {
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
                    let nomor = 1;
                    for(let i in get_data) {
                        let tanggal_aktivitas = formatDate(get_data[i].tgl);
                        table_aktivitas.row.add([
                            ''+nomor+'',
                            ''+get_data[i].full_name+'',
                            ''+get_data[i].aktivitas+'',
                            ''+tanggal_aktivitas+'',
                            ''+get_data[i].jam+''
                        ]);
                        table_aktivitas.draw();
                        nomor++;
                    }
                    setTimeout(show_table, 1500);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        }

        // load_Initdata_aktivitas();
        // load_data_aktivitas();
        var looped_aktivitas = $('#looped_aktivitas').val();
        timer_aktivitas = setInterval(load_data_aktivitas, 2000);
        clearInterval(timer_aktivitas);
        looped_aktivitas == 0 ? clearInterval(timer_aktivitas) : setTimeout(function(){timer_aktivitas = setInterval(load_data_aktivitas, 2000)}, 15000);
	});
}