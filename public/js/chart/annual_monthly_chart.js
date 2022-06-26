function annual_monthly_chart(root_url, last_year, full_year, count_customer_claim, count_deliv) {
	// if(typeof(timer_daily) != "undefined" && timer_daily !== null) {
 //        clearInterval(timer_daily);        
 //    }
 //    if(typeof(timer_daily_ppm) != "undefined" && timer_daily_ppm !== null) {
 //        clearInterval(timer_daily_ppm);        
 //    }
 //    if(typeof(timer_part) != "undefined" && timer_part !== null) {
 //        clearInterval(timer_part);        
 //    }
 //    if(typeof(timer_rejection) != "undefined" && timer_rejection !== null) {
 //        clearInterval(timer_rejection);        
 //    }
    jQuery(document).ready(($) => {
        let filter_year = root_url.concat('/home/filter_by_year');
        let filter_month = root_url.concat('/home/filter_by_month');
        console.log('annual_monthly_chart', filter_year, filter_month);
        $("#filter_year").on('change', 'select#year_from', function(e) {
			let year_from = new Date();
			let get_year_from = year_from.getFullYear() - 9;
			let year_now = get_year_from + 9;
			let year_to = $(e.target).val();
			for(let year_from_disable = get_year_from; year_from_disable <= year_to; year_from_disable++) {
				$("#year_to option:contains("+year_from_disable+")").attr("disabled","disabled");
			}
        });
		
        $("#filter_year").on('change', 'select#year_to', function(e) {
			let year_from = $('#year_from').val();
			let year_to = $(e.target).val();
			let year;
			if(year_from == "" && year_to == "") {
				year = full_year;
			} else {
				year = year_from+" - "+year_to;
			} 

			$.ajax({
				type: "GET",
				url: filter_year,
				data: $("#filter_year").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_year").trigger("click");
				},
				success: function(data_year) {
					console.log(data_year);
					FusionCharts.ready(function() {
						const chartDataYear = [];
						const chartValueYear = [];
						const chartPpmYear = [];
						let ppm;
						let obj = data_year.dataYears;
						let index = 0;
						for(let key in obj) {
							let defect = parseInt(obj[key]);
							let dataLabel = {
								"label": key,
							}
							let dataValue = {
								"value": obj[key],	
							}
							if(data_year.ppm[index] > 0) {
								ppm = (defect / parseInt(data_year.ppm[index])) * 1000000;
							} else {
								ppm = 0;
							}
								
							let dataPpm = {
								"value": ppm,
							}
							chartDataYear.push(dataLabel);
							chartValueYear.push(dataValue);
							chartPpmYear.push(dataPpm);
							index += 1;
						}
						
						var revenueChart = new FusionCharts({
							type: 'mscombidy2d',
							renderAt: 'container_year',
							width: '100%',
							height: '380',
							dataFormat: 'json',
							dataSource: {
							"chart": {
								"caption": "Annual Rejection Graph - QTY & PPM",
								"subCaption": year,
								"xAxisname": "Year",
								"pYAxisName": "QTY",
								"sYAxisName": "PPM",
								"numberPrefix": "",
								"theme": "fusion",
								"showValues": "0",
								"exportenabled": "1",
								"exportfilename": "Annual Rejection Graph - QTY & PPM",
								"labelDisplay": "rotate",
								"lineColor": "#fc3c3c",
								"palettecolors": "#29c3be"
							},
							"categories": [{
								"category": chartDataYear
							}],
							"dataset": [{
								"seriesName": "Total annual rejection",
								"showValues": "0",
								"exportenabled": "1",
								"exportfilename": "Annual Rejection Graph - QTY & PPM",
								"numberSuffix": "",
								"data": chartValueYear
							}, {
								"seriesName": "PPM",
								"parentYAxis": "S",
								"renderAs": "line",
								"data": chartPpmYear
							}]
							}
						}).render();
					});

				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").modal('show');
				}
			});
        });
        
        $("#filter_month").on('change', 'select#year1', function(e) {
			let year = $(e.target).val();
			if(year == "" || year == null) {
				year = last_year;
			}
			$.ajax({
				type: "GET",
				url: filter_month,
				data: $("#filter_month").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_month").trigger("click");
				},
				success: function(data_filter) {
						FusionCharts.ready(function() {
							const chartDataMonth = [];
							const chartValueMonth = [];
							const chartPpmMonth = [];
							let obj = data_filter.dataMonthly;
							let index = 0;
							let ppm;
							for(let key in obj) {
								let defect = parseInt(obj[key]);
								
								let dataLabel = {
									"label": key,
								}
								let dataValue = {
									"value": obj[key],	
								}
								if(data_filter.ppm[index] > 0) {
									ppm = (defect / parseInt(data_filter.ppm[index])) * 1000000;
								} else {
									ppm = 0;
								}
								let dataPpm = {
									"value": ppm,
								}
								index += 1;
								chartDataMonth.push(dataLabel);
								chartValueMonth.push(dataValue);
								chartPpmMonth.push(dataPpm);
							}
							var revenueChart = new FusionCharts({
								type: 'mscombidy2d',
								renderAt: 'container_month',
								width: '100%',
								height: '380',
								dataFormat: 'json',
								dataSource: {
								"chart": {
									"caption": "Monthly Rejection Graph - QTY & PPM",
									"subCaption": year,
									"xAxisname": "Month",
									"pYAxisName": "QTY",
									"sYAxisName": "PPM",
									"numberPrefix": "",
									"theme": "fusion",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Monthly Rejection Graph - QTY & PPM",
									"labelDisplay": "rotate",
									"animation": "1" 
								},
								"categories": [{
									"category": chartDataMonth
								}],
								"dataset": [{
									"seriesName": "Total monthly rejection",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Monthly Rejection Graph - QTY & PPM",
									"numberSuffix": "",
									"data": chartValueMonth
								}, {
									"seriesName": "PPM",
									"parentYAxis": "S",
									"renderAs": "line",
									"data": chartPpmMonth
								}]
								}
							}).render();
						});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").show();
				}
			});
        });
        

        var monthly_count_customer_claim = count_customer_claim;
		var monthly_count_deliv = count_deliv;
		function monthly_chart() {
			let year_from = $('#year_from').val();
			let year_to = $('#year_to').val();
			let caption_year;
			if(year_from == "" && year_to == "") {
				caption_year = full_year;
			} else {
				caption_year = year_from+" - "+year_to;
			}

			let year = $("#year1").val();
			let caption;
			if(year != "") {
				caption = year;
			} else {
				caption = last_year;
			}
			$.ajax({
				type: "GET",
				url: filter_month,
				data: $("#filter_month").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_month").trigger("click");
				},
				success: function(data_filter) {
					let customer_claim_monthly = data_filter.count_customer_claim_monthly;
					let get_count_deliv = data_filter.count_deliv;
					if(monthly_count_customer_claim != customer_claim_monthly || monthly_count_deliv != get_count_deliv) {
						monthly_count_customer_claim = customer_claim_monthly;
						monthly_count_deliv = get_count_deliv;
						FusionCharts.ready(function() {
							const chartDataMonth = [];
							const chartValueMonth = [];
							const chartPpmMonth = [];
							let obj = data_filter.dataMonthly;
							let index = 0;
							let ppm;
							for(let key in obj) {
								let defect = parseInt(obj[key]);
								
								let dataLabel = {
									"label": key,
								}
								let dataValue = {
									"value": obj[key],	
								}
								if(data_filter.ppm[index] > 0) {
									ppm = (defect / parseInt(data_filter.ppm[index])) * 1000000;
								} else {
									ppm = 0;
								}
								let dataPpm = {
									"value": ppm,
								}
								index += 1;
								chartDataMonth.push(dataLabel);
								chartValueMonth.push(dataValue);
								chartPpmMonth.push(dataPpm);
							}
							var revenueChart = new FusionCharts({
								type: 'mscombidy2d',
								renderAt: 'container_month',
								width: '100%',
								height: '380',
								dataFormat: 'json',
								dataSource: {
								"chart": {
									"caption": "Monthly Rejection Graph - QTY & PPM",
									"subCaption": caption,
									"xAxisname": "Month",
									"pYAxisName": "QTY",
									"sYAxisName": "PPM",
									"numberPrefix": "",
									"theme": "fusion",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Monthly Rejection Graph - QTY & PPM",
									"labelDisplay": "rotate",
									"animation": "1" 
								},
								"categories": [{
									"category": chartDataMonth
								}],
								"dataset": [{
									"seriesName": "Total monthly rejection",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Monthly Rejection Graph - QTY & PPM",
									"numberSuffix": "",
									"data": chartValueMonth
								}, {
									"seriesName": "PPM",
									"parentYAxis": "S",
									"renderAs": "line",
									"data": chartPpmMonth
								}]
								}
							}).render();
						});
					} else {
						monthly_count_customer_claim = customer_claim_monthly;
						monthly_count_deliv = get_count_deliv;
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").show();
				}
			});
        }
        

        var annual_count_customer_claim = count_customer_claim;
		var annual_count_deliv = count_deliv;
		function annual_chart() {
			let year_from = $('#year_from').val();
			let year_to = $('#year_to').val();
			let caption_year;
			if(year_from == "" && year_to == "") {
				caption_year = full_year;
			} else {
				caption_year = year_from+" - "+year_to;
			}

			let year = $("#year1").val();
			let caption;
			if(year != "") {
				caption = year;
			} else {
				caption = last_year;
			}
			
			$.ajax({
				type: "GET",
				url: filter_year,
				data: $("#filter_year").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_year").trigger("click");
				},
				success: function(data_year) {
					let get_count_customer_claim = data_year.count_customer_claim;
					let get_count_deliv = data_year.count_deliv;
					if(annual_count_customer_claim != get_count_customer_claim || annual_count_deliv != get_count_deliv) {
						annual_count_customer_claim = get_count_customer_claim;
						annual_count_deliv = get_count_deliv;
						FusionCharts.ready(function() {
							const chartDataYear = [];
							const chartValueYear = [];
							const chartPpmYear = [];
							let ppm;
							let obj = data_year.dataYears;
							let index = 0;
							for(let key in obj) {
								let defect = parseInt(obj[key]);
								let dataLabel = {
									"label": key,
								}
								let dataValue = {
									"value": obj[key],	
								}
								if(data_year.ppm[index] > 0) {
									ppm = (defect / parseInt(data_year.ppm[index])) * 1000000;
								} else {
									ppm = 0;
								}
								
								let dataPpm = {
									"value": ppm,
								}
								chartDataYear.push(dataLabel);
								chartValueYear.push(dataValue);
								chartPpmYear.push(dataPpm);
								index += 1;
							}
							var revenueChart = new FusionCharts({
								type: 'mscombidy2d',
								renderAt: 'container_year',
								width: '100%',
								height: '380',
								dataFormat: 'json',
								dataSource: {
								"chart": {
									"caption": "Annual Rejection Graph - QTY & PPM",
									"subCaption": caption_year,
									"xAxisname": "Year",
									"pYAxisName": "QTY",
									"sYAxisName": "PPM",
									"numberPrefix": "",
									"theme": "fusion",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Annual Rejection Graph - QTY & PPM",
									"labelDisplay": "rotate",
									"lineColor": "#fc3c3c",
									"palettecolors": "#29c3be"
								},
								"categories": [{
									"category": chartDataYear
								}],
								"dataset": [{
									"seriesName": "Total annual rejection",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Annual Rejection Graph - QTY & PPM",
									"numberSuffix": "",
									"data": chartValueYear
								}, {
									"seriesName": "PPM",
									"parentYAxis": "S",
									"renderAs": "line",
									"data": chartPpmYear
								}]
								}
							}).render();
						});	
					} else {
						annual_count_customer_claim = get_count_customer_claim;
						annual_count_deliv = get_count_deliv;
					}
				},

				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").show();
				}
			});
        }
        
        function start_year_chart() {
			$.ajax({
				type: "GET",
				url: filter_year,
				data: $("#filter_year").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_year").trigger("click");
				},
				success: function(data_year) {
					console.log(data_year.dataYears);
					function load_chart_annual() {
						FusionCharts.ready(function() {
							const chartDataYear = [];
							const chartValueYear = [];
							const chartPpmYear = [];
							let ppm;
							let obj = data_year.dataYears;
							let index = 0;
							for(let key in obj) {
								let defect = parseInt(obj[key]);
								console.log(defect);
								let dataLabel = {
									"label": key,
								}
								let dataValue = {
									"value": obj[key],	
								}
								if(data_year.ppm[index] > 0) {
									ppm = (defect / parseInt(data_year.ppm[index])) * 1000000;
								} else {
									ppm = 0;
								}
								
								let dataPpm = {
									"value": ppm,
								}
								chartDataYear.push(dataLabel);
								chartValueYear.push(dataValue);
								chartPpmYear.push(dataPpm);
								index += 1;
							}
							var revenueChart = new FusionCharts({
								type: 'mscombidy2d',
								renderAt: 'container_year',
								width: '100%',
								height: '380',
								dataFormat: 'json',
								dataSource: {
								"chart": {
									"caption": "Annual Rejection Graph - QTY & PPM",
									"subCaption": full_year,
									"xAxisname": "Year",
									"pYAxisName": "QTY",
									"sYAxisName": "PPM",
									"numberPrefix": "",
									"theme": "fusion",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Annual Rejection Graph - QTY & PPM",
									"labelDisplay": "rotate",
									"lineColor": "#fc3c3c",
									"palettecolors": "#29c3be"
								},
								"categories": [{
									"category": chartDataYear
								}],
								"dataset": [{
									"seriesName": "Total annual rejection",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Annual Rejection Graph - QTY & PPM",
									"numberSuffix": "",
									"data": chartValueYear
								}, {
									"seriesName": "PPM",
									"parentYAxis": "S",
									"renderAs": "line",
									"data": chartPpmYear
								}]
								}
							}).render();
						});
					}
					load_chart_annual();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").show();
				}
			});
        }
        
        function start_monthly_chart() {
			$.ajax({
				type: "GET",
				url: filter_month,
				data: $("#filter_month").serialize(),
				dataType: "JSON",
				cache: false,
				beforeSend: function() {
					$("#reloading_month").trigger("click");
				},
				success: function(data_filter) {
					function load_data_monthly() {
						FusionCharts.ready(function() {
							const chartDataMonth = [];
							const chartValueMonth = [];
							const chartPpmMonth = [];
							let obj = data_filter.dataMonthly;
							let index = 0;
							let ppm;
							for(let key in obj) {
								let defect = parseInt(obj[key]);
								
								let dataLabel = {
									"label": key,
								}
								let dataValue = {
									"value": obj[key],	
								}
								if(data_filter.ppm[index] > 0) {
									ppm = (defect / parseInt(data_filter.ppm[index])) * 1000000;
								} else {
									ppm = 0;
								}
								let dataPpm = {
									"value": ppm,
								}
								index += 1;
								chartDataMonth.push(dataLabel);
								chartValueMonth.push(dataValue);
								chartPpmMonth.push(dataPpm);
							}
							var revenueChart = new FusionCharts({
								type: 'mscombidy2d',
								renderAt: 'container_month',
								width: '100%',
								height: '380',
								dataFormat: 'json',
								dataSource: {
								"chart": {
									"caption": "Monthly Rejection Graph - QTY & PPM",
									"subCaption": last_year,
									"xAxisname": "Month",
									"pYAxisName": "QTY",
									"sYAxisName": "PPM",
									"numberPrefix": "",
									"theme": "fusion",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Monthly Rejection Graph - QTY & PPM",
									"labelDisplay": "rotate",
									"animation": "1" 
								},
								"categories": [{
									"category": chartDataMonth
								}],
								"dataset": [{
									"seriesName": "Total monthly rejection",
									"showValues": "0",
									"exportenabled": "1",
									"exportfilename": "Monthly Rejection Graph - QTY & PPM",
									"numberSuffix": "",
									"data": chartValueMonth
								}, {
									"seriesName": "PPM",
									"parentYAxis": "S",
									"renderAs": "line",
									"data": chartPpmMonth
								}]
								}
							}).render();
						});
					}
					load_data_monthly();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$("#error_text").text(textStatus +" "+errorThrown);
					$("#modal-error-ajax").modal('show');
				}
			});
        }
        	/* ini seharusnya dipake cuma karena memperlambat jadi di komen */
        	/*
         timer_annual = setInterval(annual_chart, 7000);
			 $("#body_annual_year").hover(
			 	function() {
			 		clearInterval(timer_annual);
			 	},
			 	function() {
			 		timer_annual = setInterval(annual_chart, 7000);
			 	}
			 );

			 timer_monthly = setInterval(monthly_chart, 7000);
			 $("#body_monthly").hover(
			 	function() {
			 		clearInterval(timer_monthly);
			 	},
			 	function() {
			 		timer_monthly = setInterval(monthly_chart, 7000);
			 	}
         	);
   		*/
   		/* eof ini seharusnya dipake cuma karena memperlambat jadi di komen */
        
        $("#reset_year").click(function() {
			let year_from = new Date();
			let get_year_from = year_from.getFullYear() - 9;
			let year_now = get_year_from + 9;
			$("#annual_customer").val(null);
			$("#annual_status_claim").val(null);
			$("#year_from").val(get_year_from);
			$("#year_to").val(year_now);
			start_year_chart();
		});


		$("#reset_month").click(function() {
			let year_from = new Date();
			let get_year_from = year_from.getFullYear() - 9;
			let year_now = get_year_from + 9;
			$("#monthly_customer").val(null);
			$("#monthly_status_claim").val(null);
			$("#year1").val(year_now);
			start_monthly_chart();
        });
        
        function filter_status_claim() {
			$("#filter_status_claim").on('change', "#status_claim1", function() {
				let status_claim = $("#status_claim1").val();
				let year_from = $('#year_from').val();
				let year_to = $('#year_to').val();
				let caption_year;
				if(year_from == "" && year_to == "") {
					caption_year = full_year;
				} else {
					caption_year = year_from+" - "+year_to;
				}

				let year = $("#year1").val();
				let caption;
				
				if(year != "") {
					caption = year;
				} else {
					caption = last_year;
				}

				$("#annual_status_claim").val(status_claim);
				$("#monthly_status_claim").val(status_claim);
				// ANNUAL FILTER
				$.ajax({
					type: "GET",
					url: filter_year,
					data: $("#filter_year").serialize(),
					dataType: "JSON",
					cache: false,
					beforeSend: function() {
						$("#reloading_year").trigger("click");
                    },
                    
					success: function(data_year) {
						function load_chart_annual() {
							FusionCharts.ready(function() {
								const chartDataYear = [];
								const chartValueYear = [];
								const chartPpmYear = [];
								let ppm;
								let obj = data_year.dataYears;
								let index = 0;
								for(let key in obj) {
									let defect = parseInt(obj[key]);
									let dataLabel = {
										"label": key,
									}
									let dataValue = {
										"value": obj[key],	
									}
									if(data_year.ppm[index] > 0) {
										ppm = (defect / parseInt(data_year.ppm[index])) * 1000000;
									} else {
										ppm = 0;
									}
									
									let dataPpm = {
										"value": ppm,
									}
									chartDataYear.push(dataLabel);
									chartValueYear.push(dataValue);
									chartPpmYear.push(dataPpm);
									index += 1;
								}
								var revenueChart = new FusionCharts({
									type: 'mscombidy2d',
									renderAt: 'container_year',
									width: '100%',
									height: '380',
									dataFormat: 'json',
									dataSource: {

									"chart": {
										"caption": "Annual Rejection Graph - QTY & PPM",
										"subCaption": caption_year,
										"xAxisname": "Year",
										"pYAxisName": "QTY",
										"sYAxisName": "PPM",
										"numberPrefix": "",
										"theme": "fusion",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Annual Rejection Graph - QTY & PPM",
										"labelDisplay": "rotate",
										"lineColor": "#fc3c3c",
										"palettecolors": "#29c3be"
									},
									"categories": [{
										"category": chartDataYear
									}],
									"dataset": [{
										"seriesName": "Total annual rejection",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Annual Rejection Graph - QTY & PPM",
										"numberSuffix": "",
										"data": chartValueYear
									}, {
										"seriesName": "PPM",
										"parentYAxis": "S",
										"renderAs": "line",
										"data": chartPpmYear
									}]
									}
								}).render();
							});
						}
						load_chart_annual();
					},
					error: function(jqXHR, textStatus, errorThrown) {
						$("#error_text").text(textStatus +" "+errorThrown);
						$("#modal-error-ajax").modal('show');
					}
				});

				// MONTHLY FILTER
				$.ajax({
					type: "GET",
					url: filter_month,
					data: $("#filter_month").serialize(),
					dataType: "JSON",
					cache: false,
					beforeSend: function() {
						$("#reloading_month").trigger("click");
					},
					success: function(data_filter) {
						function load_data_monthly() {
							FusionCharts.ready(function() {
								const chartDataMonth = [];
								const chartValueMonth = [];
								const chartPpmMonth = [];
								let obj = data_filter.dataMonthly;
								let index = 0;
								let ppm;
								for(let key in obj) {
									let defect = parseInt(obj[key]);
									
									let dataLabel = {
										"label": key,
									}
									let dataValue = {
										"value": obj[key],	
									}
									if(data_filter.ppm[index] > 0) {
										ppm = (defect / parseInt(data_filter.ppm[index])) * 1000000;
									} else {
										ppm = 0;
									}
									let dataPpm = {
										"value": ppm,
									}
									index += 1;
									chartDataMonth.push(dataLabel);
									chartValueMonth.push(dataValue);
									chartPpmMonth.push(dataPpm);
								}
								var revenueChart = new FusionCharts({
									type: 'mscombidy2d',
									renderAt: 'container_month',
									width: '100%',
									height: '380',
									dataFormat: 'json',
									dataSource: {
									"chart": {
										"caption": "Monthly Rejection Graph - QTY & PPM",
										"subCaption": caption,
										"xAxisname": "Month",
										"pYAxisName": "QTY",
										"sYAxisName": "PPM",
										"numberPrefix": "",
										"theme": "fusion",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Monthly Rejection Graph - QTY & PPM",
										"labelDisplay": "rotate",
										"animation": "1" 
									},
									"categories": [{
										"category": chartDataMonth
									}],
									"dataset": [{
										"seriesName": "Total monthly rejection",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Monthly Rejection Graph - QTY & PPM",
										"numberSuffix": "",
										"data": chartValueMonth
									}, {
										"seriesName": "PPM",
										"parentYAxis": "S",
										"renderAs": "line",
										"data": chartPpmMonth
									}]
									}
								}).render();
							});
						}
						load_data_monthly();
					},
				});
			});
        }
        

        function filter_proses() {
			$("#filter_proses").on('change', "#proses1", () => {
				let proses = $("#proses1").val();

				let year_from = $('#year_from').val();
				let year_to = $('#year_to').val();
				let caption_year;
				if(year_from == "" && year_to == "") {
					caption_year = full_year;
				} else {
					caption_year = year_from+" - "+year_to;
				}

				let year = $("#year1").val();
				let caption;
				if(year != "") {
					caption = year;
				} else {
					caption = last_year;
				}

				$("#annual_proses").val(proses);
				$("#monthly_proses").val(proses);

				// ANNUAL FILTER
				$.ajax({
					type: "GET",
					url: filter_year,
					data: $("#filter_year").serialize(),
					dataType: "JSON",
					cache: false,
					beforeSend: function() {
						$("#reloading_year").trigger("click");
					},

					success: function(data_year) {
						function load_chart_annual() {
							FusionCharts.ready(function() {
								const chartDataYear = [];
								const chartValueYear = [];
								const chartPpmYear = [];
								let ppm;
								let obj = data_year.dataYears;
								let index = 0;
								let caption;
								for(let key in obj) {
									let defect = parseInt(obj[key]);
									let dataLabel = {
										"label": key,
									}
									let dataValue = {
										"value": obj[key],	
									}
									if(data_year.ppm[index] > 0) {
										ppm = (defect / parseInt(data_year.ppm[index])) * 1000000;
									} else {
										ppm = 0;
									}
									
									let dataPpm = {
										"value": ppm,
									}
									chartDataYear.push(dataLabel);
									chartValueYear.push(dataValue);
									chartPpmYear.push(dataPpm);
									index += 1;
								}
								var revenueChart = new FusionCharts({
									type: 'mscombidy2d',
									renderAt: 'container_year',
									width: '100%',
									height: '380',
									dataFormat: 'json',
									dataSource: {
									"chart": {
										"caption": "Annual Rejection Graph - QTY & PPM",
										"subCaption": caption_year,
										"xAxisname": "Year",
										"pYAxisName": "QTY",
										"sYAxisName": "PPM",
										"numberPrefix": "",
										"theme": "fusion",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Annual Rejection Graph - QTY & PPM",
										"labelDisplay": "rotate",
										"lineColor": "#fc3c3c",
										"palettecolors": "#29c3be"
									},
									"categories": [{
										"category": chartDataYear
									}],
									"dataset": [{
										"seriesName": "Total annual rejection",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Annual Rejection Graph - QTY & PPM",
										"numberSuffix": "",
										"data": chartValueYear
									}, {
										"seriesName": "PPM",
										"parentYAxis": "S",
										"renderAs": "line",
										"data": chartPpmYear
									}]
									}
								}).render();
							});
						}
						load_chart_annual();
					},
					error: function(jqXHR, textStatus, errorThrown) {
						$("#error_text").text(textStatus +" "+errorThrown);
						$("#modal-error-ajax").modal('show');
					}
				});

				// MONTHLY FILTER
				$.ajax({
					type: "GET",
					url: filter_month,
					data: $("#filter_month").serialize(),
					dataType: "JSON",
					cache: false,
					beforeSend: function(data_filter) {
						$("#reloading_month").trigger("click");
					},
					success: function(data_filter) {
						function load_data_monthly() {
							FusionCharts.ready(function() {
								const chartDataMonth = [];
								const chartValueMonth = [];
								const chartPpmMonth = [];
								let obj = data_filter.dataMonthly;
								let index = 0;
								let ppm;
								for(let key in obj) {
									let defect = parseInt(obj[key]);
									
									let dataLabel = {
										"label": key,
									}
									let dataValue = {
										"value": obj[key],	
									}
									if(data_filter.ppm[index] > 0) {
										ppm = (defect / parseInt(data_filter.ppm[index])) * 1000000;
									} else {
										ppm = 0;
									}
									let dataPpm = {
										"value": ppm,
									}
									index += 1;
									chartDataMonth.push(dataLabel);
									chartValueMonth.push(dataValue);
									chartPpmMonth.push(dataPpm);
								}
								var revenueChart = new FusionCharts({
									type: 'mscombidy2d',
									renderAt: 'container_month',
									width: '100%',
									height: '380',
									dataFormat: 'json',
									dataSource: {
									"chart": {
										"caption": "Monthly Rejection Graph - QTY & PPM",
										"subCaption": caption,
										"xAxisname": "Month",
										"pYAxisName": "QTY",
										"sYAxisName": "PPM",
										"numberPrefix": "",
										"theme": "fusion",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Monthly Rejection Graph - QTY & PPM",
										"labelDisplay": "rotate",
										"animation": "1" 
									},
									"categories": [{
										"category": chartDataMonth
									}],
									"dataset": [{
										"seriesName": "Total monthly rejection",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Monthly Rejection Graph - QTY & PPM",
										"numberSuffix": "",
										"data": chartValueMonth
									}, {
										"seriesName": "PPM",
										"parentYAxis": "S",
										"renderAs": "line",
										"data": chartPpmMonth
									}]
									}
								}).render();
							});
						}
						load_data_monthly();
					},
				});
				
			});
        }
        
        function filter_by_customer() {
			$("#filter_by_customer").on('change', "#by_customer", function() {
				let customer = $("#by_customer").val();		
				let year_from = $('#year_from').val();
				let year_to = $('#year_to').val();
				let caption_year;
				if(year_from == "" && year_to == "") {
					caption_year = full_year;
				} else {
					caption_year = year_from+" - "+year_to;
				}

				let year = $("#year1").val();
				let caption;
				if(year != "") {
					caption = year;
				} else {
					caption = last_year;
				}

				$("#annual_customer").val(customer);
				$("#monthly_customer").val(customer);

				// ANNUAL FILTER
				$.ajax({
					type: "GET",
					url: filter_year,
					data: $("#filter_year").serialize(),
					dataType: "JSON",
					cache: false,
					beforeSend: function() {
						$("#reloading_year").trigger("click");
					},

					success: function(data_year) {
						function load_chart_annual() {
							FusionCharts.ready(function() {
								const chartDataYear = [];
								const chartValueYear = [];
								const chartPpmYear = [];
								let ppm;
								let obj = data_year.dataYears;
								let index = 0;
								let caption;
								for(let key in obj) {
									let defect = parseInt(obj[key]);
									let dataLabel = {
										"label": key,
									}
									let dataValue = {
										"value": obj[key],	
									}
									if(data_year.ppm[index] > 0) {
										ppm = (defect / parseInt(data_year.ppm[index])) * 1000000;
									} else {
										ppm = 0;
									}
									
									let dataPpm = {
										"value": ppm,
									}
									chartDataYear.push(dataLabel);
									chartValueYear.push(dataValue);
									chartPpmYear.push(dataPpm);
									index += 1;
								}
								var revenueChart = new FusionCharts({
									type: 'mscombidy2d',
									renderAt: 'container_year',
									width: '100%',
									height: '380',
									dataFormat: 'json',
									dataSource: {
									"chart": {
										"caption": "Annual Rejection Graph - QTY & PPM",
										"subCaption": caption_year,
										"xAxisname": "Year",
										"pYAxisName": "QTY",
										"sYAxisName": "PPM",
										"numberPrefix": "",
										"theme": "fusion",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Annual Rejection Graph - QTY & PPM",
										"labelDisplay": "rotate",
										"lineColor": "#fc3c3c",
										"palettecolors": "#29c3be"
									},
									"categories": [{
										"category": chartDataYear
									}],
									"dataset": [{
										"seriesName": "Total annual rejection",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Annual Rejection Graph - QTY & PPM",
										"numberSuffix": "",
										"data": chartValueYear
									}, {
										"seriesName": "PPM",
										"parentYAxis": "S",
										"renderAs": "line",
										"data": chartPpmYear
									}]
									}
								}).render();
							});
						}
						load_chart_annual();
					},
					error: function(jqXHR, textStatus, errorThrown) {
						$("#error_text").text(textStatus +" "+errorThrown);
						$("#modal-error-ajax").modal('show');
					}
				});

				// MONTHLY FILTER
				$.ajax({
					type: "GET",
					url: filter_month,
					data: $("#filter_month").serialize(),
					dataType: "JSON",
					cache: false,
					beforeSend: function(data_filter) {
						$("#reloading_month").trigger("click");
					},
					success: function(data_filter) {
						function load_data_monthly() {
							FusionCharts.ready(function() {
								const chartDataMonth = [];
								const chartValueMonth = [];
								const chartPpmMonth = [];
								let obj = data_filter.dataMonthly;
								let index = 0;
								let ppm;
								for(let key in obj) {
									let defect = parseInt(obj[key]);
									
									let dataLabel = {
										"label": key,
									}
									let dataValue = {
										"value": obj[key],	
									}
									if(data_filter.ppm[index] > 0) {
										ppm = (defect / parseInt(data_filter.ppm[index])) * 1000000;
									} else {
										ppm = 0;
									}
									let dataPpm = {
										"value": ppm,
									}
									index += 1;
									chartDataMonth.push(dataLabel);
									chartValueMonth.push(dataValue);
									chartPpmMonth.push(dataPpm);
								}
								var revenueChart = new FusionCharts({
									type: 'mscombidy2d',
									renderAt: 'container_month',
									width: '100%',
									height: '380',
									dataFormat: 'json',
									dataSource: {
									"chart": {
										"caption": "Monthly Rejection Graph - QTY & PPM",
										"subCaption": caption,
										"xAxisname": "Month",
										"pYAxisName": "QTY",
										"sYAxisName": "PPM",
										"numberPrefix": "",
										"theme": "fusion",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Monthly Rejection Graph - QTY & PPM",
										"labelDisplay": "rotate",
										"animation": "1" 
									},
									"categories": [{
										"category": chartDataMonth
									}],
									"dataset": [{
										"seriesName": "Total monthly rejection",
										"showValues": "0",
										"exportenabled": "1",
										"exportfilename": "Monthly Rejection Graph - QTY & PPM",
										"numberSuffix": "",
										"data": chartValueMonth
									}, {
										"seriesName": "PPM",
										"parentYAxis": "S",
										"renderAs": "line",
										"data": chartPpmMonth
									}]
									}
								}).render();
							});
						}
						load_data_monthly();
					},
				});
			});
        }
        
        start_year_chart();
        start_monthly_chart();
        filter_status_claim();
		  filter_by_customer();
		  filter_proses();
    });
}