jQuery(document).ready(($) => {
    console.log('change_chart');
    $("#parts_defect").css("display", "none");
    $("#annual_monthly").css("display", "none");
    
    $("#select_chart").change((e) => {
        let get_value = $(e.target).val();
        if(get_value === '1') {
            $("#annual_monthly").css("display", "block");
            $("#parts_defect").css("display", "none");
            $("#daily").css("display", "none");
        } else if(get_value === '2') {
            $("#daily").css("display", "none");
            $("#annual_monthly").css("display", "none");
            $("#parts_defect").css("display", "block");
        } else {
            if(get_value === '3') {
                $("#annual_monthly").css("display", "none");
                $("#parts_defect").css("display", "none");
                $("#daily").css("display", "block");
            }
        }
    });
});