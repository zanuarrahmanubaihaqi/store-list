function daily_chart(root_url) {
    jQuery(document).ready(($) => {
        let url_target = root_url.concat('dashboard/filter_by_daily');
        function initDailyChart(bulan = "", tahun = "") {
            $.ajax({
                type: "GET",
                url: url_target,
                data: $("#filter_daily_chart").serialize(),
                dataType: "JSON",
                cache: false,
                beforeSend: function() {
                    $("#reloading_daily").trigger("click");
                },
                success: function(data_daily) {
                    function load_chart_daily() {
                        FusionCharts.ready(function() {
                            const chartDataDaily = [];
                            const chartValueDaily = [];
                            const chartPpmDaily = [];
                            let ppm;
                            let daily = data_daily.daily;
                            let keys = Object.keys(daily);
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
                                let defect = parseInt(daily[keys[key]]);
                                let dataLabel = {
                                    "label": keys[key],
                                }
                                let dataValue = {
                                    "value": daily[keys[key]],	
                                }
                                if(data_daily.dailyPpm[index] > 0) {
                                    ppm = (defect / parseInt(data_daily.dailyPpm[index])) * 1000000;
                                } else {
                                    ppm = 0;
                                }
                                
                                let dataPpm = {
                                    "value": ppm,
                                }
                                chartDataDaily.push(dataLabel);
                                chartValueDaily.push(dataValue);
                                chartPpmDaily.push(dataPpm);
                                index += 1;
                            }
                            var revenueChart = new FusionCharts({
                                type: 'mscombidy2d',
                                renderAt: 'daily_container',
                                width: '100%',
                                height: '380',
                                dataFormat: 'json',
                                dataSource: {
                                "chart": {
                                    "caption": "Daily Defect Chart - QTY & PPM",
                                    "subCaption": month+" - "+year,
                                    "xAxisname": "Date",
                                    "pYAxisName": "QTY",
                                    "sYAxisName": "PPM",
                                    "numberPrefix": "",
                                    "theme": "fusion",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Daily Defect Chart - QTY & PPM"
                                },
                                "categories": [{
                                    "category": chartDataDaily
                                }],
                                "dataset": [{
                                    "seriesName": "Total daily rejection",
                                    "showValues": "0",
                                    "exportenabled": "1",
                                    "exportfilename": "Daily Defect Chart - QTY & PPM",
                                    "numberSuffix": "",
                                    "data": chartValueDaily
                                }, {
                                    "seriesName": "PPM",
                                    "parentYAxis": "S",
                                    "renderAs": "line",
                                    "data": chartPpmDaily
                                }]
                                }
                            }).render();
                        });
                    }
                    load_chart_daily();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#error_text").text(textStatus +" "+errorThrown);
                    $("#modal-error-ajax").show();
                }
            });
        }
        initDailyChart();
        
        function filter_daily() {
            $("#daily_status_claim, #daily_proses, #daily_ganti_customer, #year_daily, #month_daily").change(() => {
                let array_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
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
    });
}