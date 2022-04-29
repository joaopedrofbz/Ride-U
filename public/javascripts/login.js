window.onload = async function() {
    try {

        let product = await $.ajax({
            url: "/login",
            method: "get",
            dataType: "json"
        });
        console.log("[product] product = " + JSON.stringify(product));
        document.getElementById("email").innerHTML = clLogin.Login_email;
        document.getElementById("password").innerHTML = clLogin.Login_password;
         } catch (err) {
        console.log(err);
        let mainElem = document.getElementById("main");
        if (err.status == 404)
            mainElem.innerHTML =
            "<h1>" + err.responseJSON.msg + "</h1>" + "<h2>Please select an existing product</h2>";
        else mainElem.innerHTML =
            "<h1>Server problems, please try later</h1>";
    }
}