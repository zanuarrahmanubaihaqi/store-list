function daily_chart(root_url, count_customer_claim) {
    jQuery(document).ready(($) => {
        let url_target = root_url.concat('dashboard/filter_by_daily');
        var daily_count_customer_claim = count_customer_claim;
        function realTimeDailyChart(bulan = "", tahun = "") {
            $.ajax({
                type: "GET",
                url: url_target,
                data: $("#filter_daily_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: () => {
                    $("#reloading_daily").trigger("click");
                },
                success: (data_daily) => {
                    function load_chart_daily() {
                        let data_daily_count_customer_claim = data_daily.count_customer_claim;
                        if(daily_count_customer_claim != data_daily_count_customer_claim) {
                            daily_count_customer_claim = data_daily_count_customer_claim;
                            FusionCharts.ready(() => {
                                const chartValueDaily = [];
                                const chartLinkedDaily = [];
                                let daily = data_daily.daily;
                                let keys = Object.keys(daily);
                                let defects = data_daily.defects;
                                let linked = data_daily.linked;
                                let month;
                                let year;
                                if(bulan != "") {
                                    month = bulan;
                                } else {
                                    month = data_daily.bulan;
                                }
                                
                                if(tahun != "") {
                                    year = tahun;
                                } else {
                                    year = data_daily.tahun;;
                                }

                                keys.sort((a, b) => {
                                    return a - b;
                                });

                                let index = 0;
                                for(let key in keys) {
                                    let defectIndex = defects[index];
                                    let defect_name = Object.keys(defectIndex);
                                    let value_label_linked = [];
                                    for(let i in defect_name) {
                                        let label_value_linked = {
                                            "label": defect_name[i],
                                            "value": defectIndex[defect_name[i]],
                                        }
                                        value_label_linked.push(label_value_linked);
                                    }

                                    let dataValue = {
                                        "label": keys[key],
                                        "value": daily[keys[key]],
                                        "link": "newchart-xml-"+linked[index]	
                                    }

                                    let dataLinked = {
                                        "id": linked[index],
                                        "linkedchart": {
                                            "chart": {
                                                "caption": "Defects",
                                                "subcaption": linked[index]+" - "+month+" - "+year,
                                                "xaxisname": "Defects",
                                                "yaxisname": "QTY",
                                                "numberprefix": "",
                                                "theme": "fusion",
                                                "rotateValues": "0",
                                            },
                                            "data": value_label_linked
                                        }
                                    }
                                    chartValueDaily.push(dataValue);
                                    chartLinkedDaily.push(dataLinked);
                                    index += 1;
                                }
                                var revenueChart = new FusionCharts({
                                    type: 'column2d',
                                    renderAt: 'daily_container',
                                    width: '100%',
                                    height: '380',
                                    dataFormat: 'json',
                                    dataSource: {
                                        "chart": {
                                            "caption": "Daily Defect Chart - QTY",
                                            "subCaption": month+" - "+year,
                                            "xAxisname": "Date",
                                            "pYAxisName": "QTY",
                                            "numberPrefix": "",
                                            "theme": "fusion",
                                            "showValues": "0",
                                            "exportenabled": "1",
                                            "exportfilename": "Daily Defect Chart - QTY"
                                        },
                                        "data": chartValueDaily,
                                        "linkeddata": chartLinkedDaily,
                                    }
                                });
                                revenueChart.render();
                            });
                        } else {
                            daily_count_customer_claim = data_daily_count_customer_claim;
                        }
                    }
                    load_chart_daily();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").show();
                }
            });
        }

        function initDailyChart(bulan = "", tahun = "") {
            $.ajax({
                type: "GET",
                url: url_target,
                data: $("#filter_daily_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: () => {
                    $("#reloading_daily").trigger("click");
                },
                success: (data_daily) => {
                    function load_chart_daily() {
                        FusionCharts.ready(() => {
                            const chartValueDaily = [];
                            const chartLinkedDaily = [];
                            let daily = data_daily.daily;
                            let keys = Object.keys(daily);
                            let defects = data_daily.defects;
                            let linked = data_daily.linked;
                            let month;
                            let year;
                            if(bulan != "") {
                                month = bulan;
                            } else {
                                month = data_daily.bulan;
                            }
                                
                            if(tahun != "") {
                                year = tahun;
                            } else {
                                year = data_daily.tahun;;
                            }

                            keys.sort((a, b) => {
                                return a - b;
                            });

                            let index = 0;
                            for(let key in keys) {
                                let defectIndex = defects[index];
                                let defect_name = Object.keys(defectIndex);
                                let value_label_linked = [];
                                for(let i in defect_name) {
                                    let label_value_linked = {
                                        "label": defect_name[i],
                                        "value": defectIndex[defect_name[i]],
                                    }
                                    value_label_linked.push(label_value_linked);
                                }

                                let dataValue = {
                                    "label": keys[key],
                                    "value": daily[keys[key]],
                                    "link": "newchart-xml-"+linked[index]	
                                }

                                let dataLinked = {
                                    "id": linked[index],
                                    "linkedchart": {
                                    "chart": {
                                        "caption": "Defects",
                                        "subcaption": linked[index]+" - "+month+" - "+year,
                                        "xaxisname": "Defects",
                                        "yaxisname": "QTY",
                                        "numberprefix": "",
                                        "theme": "fusion",
                                        "rotateValues": "0",
                                    },
                                    "data": value_label_linked
                                    }
                                }
                                chartValueDaily.push(dataValue);
                                chartLinkedDaily.push(dataLinked);
                                index += 1;
                            }
                            var revenueChart = new FusionCharts({
                                type: 'column2d',
                                renderAt: 'daily_container',
                                width: '100%',
                                height: '380',
                                dataFormat: 'json',
                                dataSource: {
                                    "chart": {
                                        "caption": "Daily Defect Chart - QTY",
                                        "subCaption": month+" - "+year,
                                        "xAxisname": "Date",
                                        "pYAxisName": "QTY",
                                        "numberPrefix": "",
                                        "theme": "fusion",
                                        "showValues": "0",
                                        "exportenabled": "1",
                                        "exportfilename": "Daily Defect Chart - QTY"
                                    },
                                    "data": chartValueDaily,
                                    "linkeddata": chartLinkedDaily,
                                }
                            });
                            revenueChart.render();
                        });
                    }
                    load_chart_daily();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").modal('show');
                }
            });
        }

        let timer_daily = setInterval(realTimeDailyChart, 5000);
		$("#daily_body_chart").hover(
			function() {
				clearInterval(timer_daily);
			},
			function() {
				timer_daily = setInterval(realTimeDailyChart, 5000);
			}
        );
        
        initDailyChart();
        
        function filter_daily() {
            $("#daily_status_claim, #daily_proses, #daily_ganti_customer, #year_daily, #month_daily, #daily_ganti_part").change(() => {
                let array_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                let year = $("#year_daily").val();
                let month = $("#month_daily").val();
                let date = new Date();
                let now_year = date.getFullYear();
                let now_month = array_month[date.getMonth()];
                if(month != "" || month == null) {
                    month = array_month[month - 1];
                } else {
                    month = now_month;
                }
        
                if(year != "" || year == null) {
                    year = year;
                } else {
                    year = now_year;
                }
                $("#d_year").val(year);
                $("#d_month").val(month);
                initDailyChart(month, year);
            });
        }

        function refresh_daily_chart() {
            $("#refresh_daily").click(() => {
                let array_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                let year = $("#year_daily").val();
                let month = $("#month_daily").val();
                let date = new Date();
                let now_year = date.getFullYear();
                let now_month = array_month[date.getMonth()];
                if(month != "" || month == null) {
                    month = array_month[month - 1];
                } else {
                    month = now_month;
                }
        
                if(year != "" || year == null) {
                    year = year;
                } else {
                    year = now_year;
                }
                $("#d_year").val(year);
                $("#d_month").val(month);
                initDailyChart(month, year);
            });
        }
        filter_daily();
        refresh_daily_chart();
    });
}