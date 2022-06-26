function detail_chart(root_url, full_date, date_start, date_end, count_customer_claim) {
    // if(typeof(timer_daily) != "undefined" && timer_daily !== null) {
    //     clearInterval(timer_daily);        
    // }
    // if(typeof(timer_daily_ppm) != "undefined" && timer_daily_ppm !== null) {
    //     clearInterval(timer_daily_ppm);        
    // }
    // if(typeof(timer_annual) != "undefined" && timer_annual !== null) {
    //     clearInterval(timer_annual);        
    // }
    // if(typeof(timer_monthly) != "undefined" && timer_monthly !== null) {
    //     clearInterval(timer_monthly);        
    // }
    jQuery(document).ready(($) => {
        let filter_chart = root_url.concat('/claim/customerclaim/filter_chart');
        let chart_per_part = root_url.concat('/claim/customerclaim/chart_per_part');
        console.log('detail_chart', filter_chart, chart_per_part);
        $("#filter_chart :checkbox").change(function() {
            console.log('filter_chart chcekbox is change');
			if ($(this).is(':checked')) {
				$("#year_list").css("display", "none");
				$("#month_list").css("display", "none");
				$("#choose_customer").css("display", "none");
				$("#date_custome").css("display", "block");
			} else {
				$("#year_list").css("display", "block");
				$("#month_list").css("display", "block");
				$("#choose_customer").css("display", "block");
				$("#date_custome").css("display", "none");
			}
        });
        
        $('#table-1').DataTable({
			"oLanguage": {
				"sSearch": "Search:",
				"oPaginate": {
					"sPrevious": "Previous",
					"sNext": "Next"
				}
			},
			"pageLength": 10,
			"lengthChange": true
        });
        
        $("#select_part").change((e) => {
            console.log('select_part is change');
			let part = $(e.target).val();
			let select_part = $("#part").val(part);
			let date_range = $("#date_ranges").val();
			const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
			let year = $("#year").val();
			let month = $("#month option:selected").text();
			let start = $("[name=daterangepicker_start]").val();
			let end = $("[name=daterangepicker_end]").val();
			let start_date = new Date(start);
			let end_date = new Date(end);
			let formart_start = start_date.getDate()+" "+months[start_date.getMonth()]+" "+start_date.getFullYear();
			let formart_end = end_date.getDate()+" "+months[end_date.getMonth()]+" "+end_date.getFullYear();
			let caption;
			if(date_range != "") {
				if(year != "" && month != "") {
					$("#start").val("");
					$("#end").val("");
					caption = year+" - "+month;
				} else if(year != "") {
					$("#start").val("");
					$("#end").val("");
					caption = year;
				} else if(month != "") {
					$("#start").val("");
					$("#end").val("");
					caption = month;
				} else {
					caption = formart_start+" - "+formart_end;
				}
			} else {
				if(year != "" && month != "") {
					caption = year+" - "+month;
				} else if(year != "") {
					caption = year;
				} else if(month != "") {
					caption = month;
				} else {
					caption = full_date;
				}
			}
			$.ajax({
				type: "GET",
				url: filter_chart,
				data: $("#filter_chart").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading").trigger('click');
				},
				success: function(data_filter) {
                    console.log('data_filter 1', data_filter);
					FusionCharts.ready(function() {
						const chartData = [];
						let obj = data_filter.result;
                        console.log('obj 1', obj);
						for(let key in obj) {
							if(obj[key] > 0) {
								let initData = {
									"label": key,
									"value": obj[key],
								}
								chartData.push(initData);
							}
						}

						let label;
						if(chartData.length > 10) {
							label = "rotate";
						} else {
							label = "wrap";
						}
						var revenueChart = new FusionCharts({
							type: 'column2d',
							renderAt: 'container',
							width: '100%',
							height: '490',
							dataFormat: 'json',
							dataSource: {
                                "chart": {
                                    "caption": "REJECTIONS "+part+" - QTY",
                                    "subCaption": caption,
                                    "xAxisname": "Rejection Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                },
                                "data": chartData
							}
						});
                        // revenueChart;
                        revenueChart.render();
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").modal('show');
				}
			});
        });
        
        $("#filter_chart").on('change', 'select#year', function(e) {
            console.log('filter_chart year change');
            $("#date_ranges").val(null);
            $("#start").val(null);
            $("#end").val(null);
            let part = $("#part").val();
            let year = $(e.target).val();
            let month = $("#month option:selected").text();
            
            let date_range = $("#date_ranges").val();
            if(date_range != "") {
                if(year != "" && month != "") {
                    caption = year+" - "+month;
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = month;
                } else {
                    caption = formart_start+" - "+formart_end;
                }
            } else {
                if(year != "" && month != "") {
                    caption = year+" - "+month;
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = month;
                } else {
                    caption = full_date;
                }
            }
            
            $.ajax({
                type: "GET",
                url: filter_chart,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading").trigger('click');
                },
                success: function(data_filter) {
                    console.log('data_filter ini', data_filter);
                    FusionCharts.ready(function() {
                        const chartData = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                chartData.push(initData);
                            }
                        }

                        let label;
                        if(chartData.length > 10) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                            "chart": {
                                "caption": "REJECTIONS "+part+" - QTY",
                                "subCaption": caption,
                                "xAxisname": "Rejection Name",
                                "pYAxisName": "QTY",
                                "sYAxisName": "",
                                "numberPrefix": "",
                                "theme": "fusion",
                                "showValues": "0",
                                "exportenabled": "1",
                                "exportfilename": "Customer Claim Chart",
                                "labelDisplay": label,
                            },
                            "data": chartData
                            }
                        });
                        revenueChart.render();
                    });

                    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });


            $.ajax({
                type: "GET",
                url: chart_per_part,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_chart_part").trigger('click');
                },
                success: function(data_filter) {
                    console.log('data_filter chart_per_part', data_filter);
                    FusionCharts.ready(function() {
                        const chartDataPart = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            let defect = parseInt(obj[key]);
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                let dataValue = {
                                    "value": obj[key],
                                }
                                chartDataPart.push(initData);
                            }
                        }
                        let label;
                        if(chartDataPart.length > 6) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container_partChart',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "ALL REJECTION PARTS - QTY",
                                    "subCaption": caption,
                                    "xAxisname": "Part Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                    "palettecolors": "#29c3be"
                                },
                                "data":chartDataPart
                                
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });

        });


        $("#filter_chart").on('change', 'select#proses', function(e) {
            console.log('filter_chart proses change');
            $("#date_ranges").val(null);
            $("#start").val(null);
            $("#end").val(null);
            let proses = $("#proses").val();
            let part = $("#part").val();
            let year = $("#year").val();
            let month = $("#month option:selected").text();
            let date_range = $("#date_ranges").val();
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
            var start = $("[name=daterangepicker_start]").val();
            var end = $("[name=daterangepicker_end]").val();
            var start_date = new Date(start);
            var end_date = new Date(end);
            var formart_start = start_date.getDate()+" "+months[start_date.getMonth()]+" "+start_date.getFullYear();
            var formart_end = end_date.getDate()+" "+months[end_date.getMonth()]+" "+end_date.getFullYear();
            if(date_range != "") {
                if(year != "" && month != "" && proses != "") {
                    caption = proses+" ("+year+" - "+month+")";
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = month;
                } else {
                    caption = formart_start+" - "+formart_end;
                }
            } else {
                if(year != "" && month != "" && proses != "") {
                    caption = proses+" ("+year+" - "+month+")";
                } else if(year != "" && proses != "") {
                    caption = proses+" - "+year;
                } else if(month != "" && proses != "") {
                    caption = proses +" ("+date_start+month+" - "+date_end+month+")";
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = date_start+month+" - "+date_end+month;
                } else {
                    caption = proses +" ("+full_date+")";
                }
            }

            $.ajax({
                type: "GET",
                url: filter_chart,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function(data_filter) {
                    $("#reloading").trigger('click');
                },
                success: function(data_filter) {
                    console.log('filter_chart uno', filter_chart);
                    FusionCharts.ready(function() {
                        const chartData = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                chartData.push(initData);
                            }
                        }

                        let label;
                        if(chartData.length > 10) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                            "chart": {
                                "caption": "REJECTIONS "+part+" - QTY",
                                "subCaption": caption,
                                "xAxisname": "Rejection Name",
                                "pYAxisName": "QTY",
                                "sYAxisName": "",
                                "numberPrefix": "",
                                "theme": "fusion",
                                "showValues": "0",
                                "exportenabled": "1",
                                "exportfilename": "Customer Claim Chart",
                                "labelDisplay": label,
                            },
                            "data": chartData
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });

            $.ajax({
                type: "GET",
                url: chart_per_part,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_chart_part").trigger('click');
                },
                success: function(data_filter) {
                    console.log('filter_chart chart_per_part uno', filter_chart);
                    FusionCharts.ready(function() {
                        const chartDataPart = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            let defect = parseInt(obj[key]);
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                let dataValue = {
                                    "value": obj[key],
                                }
                                chartDataPart.push(initData);
                            }
                        }
                        let label;
                        if(chartDataPart.length > 6) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container_partChart',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "ALL REJECTION PARTS - QTY",
                                    "subCaption": caption,
                                    "xAxisname": "Part Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                    "palettecolors": "#29c3be"
                                },
                                "data":chartDataPart
                                
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        });

        $("#filter_chart").on('change', 'select#month', function(e) {
            console.log('filter_chart month change');
            $("#date_ranges").val(null);
            $("#start").val(null);
            $("#end").val(null);
            let part = $("#part").val();
            let year = $("#year").val();
            let month = $("#month option:selected").text();
            let date_range = $("#date_ranges").val();
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
            var start = $("[name=daterangepicker_start]").val();
            var end = $("[name=daterangepicker_end]").val();
            var start_date = new Date(start);
            var end_date = new Date(end);
            var formart_start = start_date.getDate()+" "+months[start_date.getMonth()]+" "+start_date.getFullYear();
            var formart_end = end_date.getDate()+" "+months[end_date.getMonth()]+" "+end_date.getFullYear();
            if(date_range != "") {
                if(year != "" && month != "") {
                    caption = year+" - "+month;
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = month;
                } else {
                    caption = formart_start+" - "+formart_end;
                }
            } else {
                if(year != "" && month != "") {
                    caption = year+" - "+month;
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = date_start+month+" - "+date_end+month;
                } else {
                    caption = full_date;
                }
            }

            $.ajax({
                type: "GET",
                url: filter_chart,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading").trigger('click');
                },
                success: function(data_filter) {
                    console.log('filter_chart usna', filter_chart);
                    FusionCharts.ready(function() {
                        const chartData = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                chartData.push(initData);
                            }
                        }

                        let label;
                        if(chartData.length > 10) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                            "chart": {
                                "caption": "REJECTIONS "+part+" - QTY",
                                "subCaption": caption,
                                "xAxisname": "Rejection Name",
                                "pYAxisName": "QTY",
                                "sYAxisName": "",
                                "numberPrefix": "",
                                "theme": "fusion",
                                "showValues": "0",
                                "exportenabled": "1",
                                "exportfilename": "Customer Claim Chart",
                                "labelDisplay": label,
                            },
                            "data": chartData
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });

            $.ajax({
                type: "GET",
                url: chart_per_part,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_chart_part").trigger('click');
                },
                success: function(data_filter) {
                    FusionCharts.ready(function() {
                        const chartDataPart = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            let defect = parseInt(obj[key]);
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                let dataValue = {
                                    "value": obj[key],
                                }
                                chartDataPart.push(initData);
                            }
                        }
                        let label;
                        if(chartDataPart.length > 6) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container_partChart',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "ALL REJECTION PARTS - QTY",
                                    "subCaption": caption,
                                    "xAxisname": "Part Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                    "palettecolors": "#29c3be"
                                },
                                "data":chartDataPart
                                
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        });

        $("#ganti_customer, #ganti_customer2").change((e) => {
            console.log('ganti_customer or ganti_customer2 change');
            let val_id_customer = $(e.target).val();
            let set_Id_Customer = $("#id_customer").val(val_id_customer);
            let idCustomer = $("#id_customer").val();
            $("#date_ranges").val(null);
            $("#start").val(null);
            $("#end").val(null);
            let part = $("#part").val();
            let year = $("#year").val();
            let nama_customer = $("#ganti_customer option:selected").text();
            let month = $("#month option:selected").text();
            let date_range = $("#date_ranges").val();
            if(nama_customer != "") {
                nama_customer = "("+nama_customer+")";
            } else {
                nama_customer = "";
            }
            if(date_range != "") {
                if(year != "" && month != "") {
                    caption = year+" - "+month;
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = month;
                } else {
                    caption = formart_start+" - "+formart_end;
                }
            } else {
                if(year != "" && month != "") {
                    caption = year+" - "+month;
                } else if(year != "") {
                    caption = year;
                } else if(month != "") {
                    caption = month;
                } else {
                    caption = full_date;
                }
            }

            $.ajax({
                type: "GET",
                url: filter_chart,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading").trigger('click');
                },
                success: function(data_filter) {
                    console.log('ganti_customer or ganti_customer2 filter_chart', data_filter);
                    FusionCharts.ready(function() {
                        const chartData = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                chartData.push(initData);
                            }
                        }

                        let label;
                        if(chartData.length > 10) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "REJECTIONS "+part+" - QTY "+nama_customer,
                                    "subCaption": caption,
                                    "xAxisname": "Rejection Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                },
                                "data": chartData
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });

            $.ajax({
                type: "GET",
                url: chart_per_part,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_chart_part").trigger('click');
                },
                success: function(data_filter) {
                    console.log('ganti_customer or ganti_customer2 chart_per_part', data_filter);
                    FusionCharts.ready(function() {
                        const chartDataPart = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            let defect = parseInt(obj[key]);
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                let dataValue = {
                                    "value": obj[key],
                                }
                                chartDataPart.push(initData);
                            }
                        }
                        let label;
                        if(chartDataPart.length > 6) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container_partChart',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "ALL REJECTION PARTS - QTY "+nama_customer,
                                    "subCaption": caption,
                                    "xAxisname": "Part Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                    "palettecolors": "#29c3be"
                                },
                                "data":chartDataPart		
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        });


        $(".applyBtn").click(function() {
            $("#year").val(null);
            $("#month").val(null);
            var part = $("#part").val();
            $("select option[value='"+part+"']").attr("selected","selected");
            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
            var start = $("[name=daterangepicker_start]").val();
            var end = $("[name=daterangepicker_end]").val();
            var start_date = new Date(start);
            var end_date = new Date(end);
            var formart_start = start_date.getDate()+" "+months[start_date.getMonth()]+" "+start_date.getFullYear();
            var formart_end = end_date.getDate()+" "+months[end_date.getMonth()]+" "+end_date.getFullYear();
            $("#start").attr("value", start);
            $("#end").attr("value", end);
            $.ajax({
                type: "GET",
                url: filter_chart,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function(data_filter) {
                    $("#reloading").trigger('click');
                },
                success: function(data_filter) {
                    FusionCharts.ready(function() {
                        const chartData = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                chartData.push(initData);
                            }
                        }

                        let label;
                        if(chartData.length > 10) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                            "chart": {
                                "caption": "REJECTIONS "+part+" - QTY",
                                "subCaption": formart_start+" - "+formart_end,
                                "xAxisname": "Rejection Name",
                                "pYAxisName": "QTY",
                                "sYAxisName": "",
                                "numberPrefix": "",
                                "theme": "fusion",
                                "showValues": "0",
                                "exportenabled": "1",
                                "exportfilename": "Customer Claim Chart",
                                "labelDisplay": label,
                            },
                            "data": chartData
                            }
                        });
                        revenueChart.render();
                    });
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });

            $.ajax({
                type: "GET",
                url: chart_per_part,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_chart_part").trigger('click');
                },
                success: function(data_filter) {
                    FusionCharts.ready(function() {
                        const chartDataPart = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            let defect = parseInt(obj[key]);
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                let dataValue = {
                                    "value": obj[key],
                                }
                                chartDataPart.push(initData);
                            }
                        }
                        let label;
                        if(chartDataPart.length > 6) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container_partChart',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "ALL REJECTION PARTS - QTY",
                                    "subCaption": formart_start+" - "+formart_end,
                                    "xAxisname": "Part Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                    "palettecolors": "#29c3be"
                                },
                                "data":chartDataPart
                                
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        });

        function initChartPart() {
            console.log('initChartPart');
            $.ajax({
                type: "GET",
                url: chart_per_part,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_chart_part").trigger('click');
                },
                success: function(data_filter) {
                    console.log('initChartPart data_filter', data_filter);
                    FusionCharts.ready(function() {
                        const chartDataPart = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            let defect = parseInt(obj[key]);
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                let dataValue = {
                                    "value": obj[key],
                                }
                                chartDataPart.push(initData);
                            }
                        }
                        let label;
                        if(chartDataPart.length > 6) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container_partChart',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                            "chart": {
                                "caption": "ALL REJECTION PARTS - QTY",
                                "subCaption": full_date,
                                "xAxisname": "Part Name",
                                "pYAxisName": "QTY",
                                "sYAxisName": "",
                                "numberPrefix": "",
                                "theme": "fusion",
                                "showValues": "0",
                                "exportenabled": "1",
                                "exportfilename": "Customer Claim Chart",
                                "labelDisplay": label,
                                "palettecolors": "#29c3be"
                            },
                            
                            "data":chartDataPart
                            
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        }

        function initChartRejection() {
            console.log('initChartRejection');
            $.ajax({
                type: "GET",
                url: filter_chart,
                data: $("#filter_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading").trigger('click');
                },
                success: function(data_filter) {
                    console.log('initChartRejection filter_chart data_filter', data_filter);
                    FusionCharts.ready(function() {
                        const chartData = [];
                        let obj = data_filter.result;
                        for(let key in obj) {
                            if(obj[key] > 0) {
                                let initData = {
                                    "label": key,
                                    "value": obj[key],
                                }
                                chartData.push(initData);
                            }
                        }

                        let label;
                        if(chartData.length > 10) {
                            label = "rotate";
                        } else {
                            label = "wrap";
                        }
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'container',
                            width: '100%',
                            height: '490',
                            dataFormat: 'json',
                            dataSource: {
                            "chart": {
                                "caption": "REJECTIONS - QTY",
                                "subCaption": full_date,
                                "xAxisname": "Rejection Name",
                                "pYAxisName": "QTY",
                                "sYAxisName": "",
                                "numberPrefix": "",
                                "theme": "fusion",
                                "showValues": "0",
                                "exportenabled": "1",
                                "exportfilename": "Customer Claim Chart",
                                "labelDisplay": label,
                            },
                            "data": chartData
                            }
                        });
                        revenueChart.render();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        }

        $("#reset_part").click(function() {
            $("#year").val(null);
            $("#month").val(null);
            $("#start").val(null);
            $("#end").val(null);
            $("#date_ranges").val(null);
            initChartPart();
        });

        $("#reset_rejection").click(function() {
            $("#part").val(null);
            $("#year").val(null);
            $("#month").val(null);
            $("#start").val(null);
            $("#end").val(null);
            $("#date_ranges").val(null);
            initChartRejection();
        });

        initChartPart();
        initChartRejection();

        var countInitChartRejection = count_customer_claim;
		function initRealTimeChartRejection() {
            console.log('initRealTimeChartRejection');
			let part = $("#part").val();
			let date_range = $("#date_ranges").val();
			const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
			let year = $("#year").val();
			let month = $("#month option:selected").text();
			let start = $("[name=daterangepicker_start]").val();
			let end = $("[name=daterangepicker_end]").val();
			let start_date = new Date(start);
			let end_date = new Date(end);
			let formart_start = start_date.getDate()+" "+months[start_date.getMonth()]+" "+start_date.getFullYear();
			let formart_end = end_date.getDate()+" "+months[end_date.getMonth()]+" "+end_date.getFullYear();
			let caption;
			if(date_range != "") {
				if(year != "" && month != "") {
					$("#start").val("");
					$("#end").val("");
					caption = year+" - "+month;
				} else if(year != "") {
					$("#start").val("");
					$("#end").val("");
					caption = year;
				} else if(month != "") {
					$("#start").val("");
					$("#end").val("");
					caption = month;
				} else {
					caption = formart_start+" - "+formart_end;
				}
			} else {
				if(year != "" && month != "") {
					caption = year+" - "+month;
				} else if(year != "") {
				    caption = year;
				} else if(month != "") {
					caption = month;
				} else {
					caption = full_date;
				}
			}
			$.ajax({
				type: "GET",
				url: filter_chart,
				data: $("#filter_chart").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading").trigger('click');
				},
				success: function(data_filter) {
                    console.log('initRealTimeChartRejection data_filter', data_filter);
					let get_count_customer_claim = data_filter.count_customer_claim;
					if(countInitChartRejection != get_count_customer_claim) {
						countInitChartRejection = get_count_customer_claim;
						FusionCharts.ready(function() {
							const chartData = [];
							let obj = data_filter.result;
							for(let key in obj) {
								if(obj[key] > 0) {
									let initData = {
										"label": key,
										"value": obj[key],
									}
									chartData.push(initData);
								}
							}
							let label;
							if(chartData.length > 10) {
								label = "rotate";
							} else {
								label = "wrap";
							}
							var revenueChart = new FusionCharts({
								type: 'column2d',
								renderAt: 'container',
								width: '100%',
								height: '490',
								dataFormat: 'json',
								dataSource: {
								"chart": {
									"caption": "REJECTIONS - QTY",
									"subCaption": caption,
									"xAxisname": "Rejection Name",
									"pYAxisName": "QTY",
									"sYAxisName": "",
									"numberPrefix": "",
									"theme": "fusion",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Customer Claim Chart",
									"labelDisplay": label,
								},
								"data": chartData
								}
							});
                            revenueChart.render();
						});
					} else {
						countInitChartRejection = get_count_customer_claim;
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").modal('show');
				}
			});
        }
        
        var countInitChartPart = count_customer_claim;
		function initRealTimeChartPart() {
            console.log('initRealTimeChartPart');
		    let part = $("#part").val();
			let date_range = $("#date_ranges").val();
			const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
			let year = $("#year").val();
			let month = $("#month option:selected").text();
			let start = $("[name=daterangepicker_start]").val();
			let end = $("[name=daterangepicker_end]").val();
			let start_date = new Date(start);
			let end_date = new Date(end);
			let formart_start = start_date.getDate()+" "+months[start_date.getMonth()]+" "+start_date.getFullYear();
			let formart_end = end_date.getDate()+" "+months[end_date.getMonth()]+" "+end_date.getFullYear();
			let caption;
			if(date_range != "") {
				if(year != "" && month != "") {
				    $("#start").val("");
					$("#end").val("");
					caption = year+" - "+month;
				} else if(year != "") {
					$("#start").val("");
					$("#end").val("");
					caption = year;
				} else if(month != "") {
					$("#start").val("");
					$("#end").val("");
					caption = month;
				} else {
					caption = formart_start+" - "+formart_end;
				}
		    } else {
				if(year != "" && month != "") {
					caption = year+" - "+month;
				} else if(year != "") {
					caption = year;
				} else if(month != "") {
					caption = month;
				} else {
					caption = full_date
				}
			}
			$.ajax({
			    type: "GET",
				url: chart_per_part,
				data: $("#filter_chart").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_chart_part").trigger('click');
				},
				success: function(data_filter) {
                    console.log('initRealTimeChartPart data_filter', data_filter);
					let get_count_customer_claim = data_filter.count_customer_claim;
					if(countInitChartPart != get_count_customer_claim) {
						countInitChartPart = get_count_customer_claim;
						FusionCharts.ready(function() {
							const chartDataPart = [];
							let obj = data_filter.result;
							for(let key in obj) {
								let defect = parseInt(obj[key]);
								if(obj[key] > 0) {
									let initData = {
										"label": key,
										"value": obj[key],
									}
									let dataValue = {
									    "value": obj[key],
									}
									chartDataPart.push(initData);
								}
							}
							let label;
							if(chartDataPart.length > 6) {
								label = "rotate";
							} else {
								label = "wrap";
							}
							var revenueChart = new FusionCharts({
								type: 'column2d',
								renderAt: 'container_partChart',
								width: '100%',
								height: '490',
								dataFormat: 'json',
								dataSource: {
                                    "chart": {
                                        "caption": "ALL REJECTION PARTS - QTY",
                                        "subCaption": caption,
                                        "xAxisname": "Part Name",
                                        "pYAxisName": "QTY",
                                        "sYAxisName": "",
                                        "numberPrefix": "",
                                        "theme": "fusion",
                                        "showValues": "0",
                                        "exportenabled": "1",
                                        "exportfilename": "Customer Claim Chart",
                                        "labelDisplay": label,
                                        "palettecolors": "#29c3be"
                                    },
                                    "data":chartDataPart	
								}
							});
                            revenueChart.render();
						});
					} else {
						countInitChartPart = get_count_customer_claim;
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").modal('show');
				}
            });
        }
        
        function filter_status_claim() {
            $("#filter_chart").on('change', 'select#status_claim', function(e) {
                console.log('filter_chart status_claim change');
                let part = $("#part").val();
                let year = $("#year").val();
                let status = $($(this)).val();
                let month = $("#month option:selected").text();
                let date_range = $("#date_ranges").val();
                console.log('filter_status_claim prop', part, year, status, month, date_range);
                if(date_range != "") {
                    if(year != "" && month != "") {
                        caption = year+" - "+month;
                    } else if(year != "") {
                        caption = year;
                    } else if(month != "") {
                        caption = month;
                    } else {
                        caption = formart_start+" - "+formart_end;
                    }
                } else {
                    if(year != "" && month != "") {
                        caption = year+" - "+month;
                    } else if(year != "") {
                        caption = year;
                    } else if(month != "") {
                        caption = month;
                    } else {
                        caption = full_date;
                    }
                }
                console.log('caption', caption);
                $.ajax({
                    type: "GET",
                    url: chart_per_part,
                    data: $("#filter_chart").serialize(),
                    dataType: "JSON",
                    cache: false,
                    beforeSend: function() {
                        $("#reloading_chart_part").trigger('click');
                    },
                    success: function(data_filter) {
                        // setInterval(function(){
                            console.log('status_claim chart_per_part data_filter', data_filter);
                        // }, 2000);
                        FusionCharts.ready(function() {
                            const chartDataPart = [];
                            let obj = data_filter.result;
                            for(let key in obj) {
                                let defect = parseInt(obj[key]);
                                if(obj[key] > 0) {
                                    let initData = {
                                        "label": key,
                                        "value": obj[key],
                                    }
                                    let dataValue = {
                                        "value": obj[key],
                                    }
                                    chartDataPart.push(initData);
                                }
                            }
                            console.log('chartDataPart changed', chartDataPart);
                            let label;
                            if(chartDataPart.length > 6) {
                                label = "rotate";
                            } else {
                                label = "wrap";
                            }
                            var revenueChart = new FusionCharts({
                                type: 'column2d',
                                renderAt: 'container_partChart',
                                width: '100%',
                                height: '490',
                                dataFormat: 'json',
                                dataSource: {
                                "chart": {
                                    "caption": "ALL REJECTION PARTS - QTY",
                                    "subCaption": caption,
                                    "xAxisname": "Part Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                    "palettecolors": "#29c3be"
                                },
                                
                                "data":chartDataPart
                                
                                }
                            });
                            revenueChart.render();
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#error_text").text(textStatus +" "+errorThrown);
                        $("#modal-error-ajax").modal('show');
                    }
                });

                $.ajax({
                    type: "GET",
                    url: filter_chart,
                    data: $("#filter_chart").serialize(),
                    dataType: "JSON",
                    cache: false,
                    beforeSend: function(data_filter) {
                        $("#reloading").trigger('click');
                    },
                    success: function(data_filter) {
                        console.log('filter_status_claim filter_chart data_filter', data_filter);
                        FusionCharts.ready(function() {
                            const chartData = [];
                            const chartValue = [];
                            let obj = data_filter.result;
                            for(let key in obj) {
                                if(obj[key] > 0) {
                                    let initData = {
                                        "label": key,
                                        "value": obj[key],
                                    }
                                    chartData.push(initData);
                                }
                            }
                            console.log('filter_chart chartData', chartData);
                            let label;
                            if(chartData.length > 10) {
                                label = "rotate";
                            } else {
                                label = "wrap";
                            }
                            var revenueChart = new FusionCharts({
                                type: 'column2d',
                                renderAt: 'container',
                                width: '100%',
                                height: '490',
                                dataFormat: 'json',
                                dataSource: {
                                "chart": {
                                    "caption": "REJECTIONS - QTY",
                                    "subCaption": caption,
                                    "xAxisname": "Rejection Name",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Customer Claim Chart",
                                    "labelDisplay": label,
                                },
                                "data": chartData
                                }
                            });
                            revenueChart.render();
                        });
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#error_text").text(textStatus +" "+errorThrown);
                        $("#modal-error-ajax").modal('show');
                    }
                });
            });
        }

        filter_status_claim();

        /* ini sebenernya dipake cuma ngeberatin jadi di tutup */
        /*
        timer_part = setInterval(initRealTimeChartPart, 7000);
		$("#body_chart_part").hover(
			function() {
				clearInterval(timer_part);
			},
			function() {
				timer_part = setInterval(initRealTimeChartPart, 7000);
			}
		);

		timer_rejection = setInterval(initRealTimeChartRejection, 7000);
		$("#body_chart_rejection").hover(
			function() {
				clearInterval(timer_rejection);
			},
			function() {
				timer_rejection = setInterval(initRealTimeChartRejection, 7000);
			}
        );
        */
        /* eof ini sebenernya dipake cuma ngeberatin jadi di tutup */
    });
}