class CustomerClaim {

    constructor(root_url) {
        this.getCustomerClaim = root_url.concat("/claim/customerclaim/getCustomerClaim");
    }

    main() {
        $(document).ready(() => {
            console.log('this main');
            var urlx = "";
            const table_customer_claim = $('#table_customer_claim');
            this.loadTableCustomerClaim(table_customer_claim, urlx);
            this.filterTable(table_customer_claim);
            $("#table_customer_claim").on( 'column-sizing.dt', function (e, settings) {
                $(".dataTables_scrollHeadInner").css( "width", "100%" );
            });
        });
    }

    loadTableCustomerClaim(table_customer_claim, urlx, customer = "", proses = "") {
        urlx = this.getCustomerClaim + "/" + customer + "/" + proses;
        table_customer_claim.DataTable({
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
            ajax: {
                "url": urlx,
                "type": "GET",
            },
            destroy: true,
            processing: true,
            deferRender: true,
            columns: [
                {
                    data: 'no'
                },
                {
                    data: 'tgl_input'
                },
                {
                    data: 'no_sap'
                },
                {
                    data: 'nama_part'
                },
                {
                    data: 'type'
                },
                {
                    data: 'proses'
                },
                {
                    data: 'due_date'
                },
                {
                    data: 'ofp'
                },
                {
                    data: 'pergantian_part'
                },
                {
                    data: 'sortir_stock'
                },
                {
                    data: 'pica'
                },
                {
                    data: 'pfmea'
                },
                {
                    data: 'status'
                },
                {
                    data: 'card'
                }
            ]
        });
    }

    filterTable(table_customer_claim) {
        const filter_customer = $("#filter_customer");
        const proses = $("#proses");
        filter_customer.change(() => {
            const getCustomerVal = filter_customer.val();
            const getProsesVal = proses.val();
            this.filter(table_customer_claim, getCustomerVal, getProsesVal);
        });

        proses.change(() => {
            let getCustomerVal = filter_customer.val();
            const getProsesVal = proses.val();
            this.filter(table_customer_claim, getCustomerVal = 'all', getProsesVal);
        });
    }

    filter(table_customer_claim, customer, proses) {
        var urlx = "";
        this.loadTableCustomerClaim(table_customer_claim, urlx, customer, proses);
    }

}