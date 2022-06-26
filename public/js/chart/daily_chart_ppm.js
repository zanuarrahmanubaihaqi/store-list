function checkedPpm() {
    const ppm_check = document.getElementById("ppm_check");
    const daily_container = document.getElementById("daily_container");
    const daily_container_ppm = document.getElementById("daily_container_ppm");
    console.log('checkedPpm', ppm_check, daily_container, daily_container_ppm);
    if (ppm_check.checked) {
        daily_container.style.display = "none";
        daily_container_ppm.style.display = "block";   
    } else {
        daily_container_ppm.style.display = "none";
        daily_container.style.display = "block";   
    }
}