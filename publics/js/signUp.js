function mySignUp() {
    let email = $("#email").val().trim()
    let username = $("#username").val().trim()
    let phone = $("#phone").val().trim()
    let password = $("#password").val().trim()
    if (!(email && username && phone && password)) {
        return alert("không được để trống")
    }
    if (!(((!isNaN(phone)) && typeof Number(phone) === "number") &&
        ((!isNaN(password)) && typeof Number(password) === "number"))) {
        return alert("phone và password phải là số")
    }
    $.ajax({
        url: "/author/sign-up",
        method: "POST",
        data: {
            email,
            username,
            phone,
            password
        }
    })
        .then((data) => {
            if (!data.error) {
                alert(data.message)
                return window.location.href = "/login"
            }
            return alert(data.message)
        }).catch((err) => {
            alert(err)
        });
}
