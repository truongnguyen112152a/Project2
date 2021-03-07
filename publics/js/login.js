function myLogin() {
    var email = $("#intEmail").val()
    var password = $("#intPassword").val()
    if(email && password) {
        return $.ajax({
            url: "/user/login",
            method: "POST",
            data: {
                email,
                password
            }
        })
        .then((data) => {
            if(!data.error) {
                setCookie("token", data.token, 1.2)
                alert(data.messenger)
                if(data.value) return window.location.href = "/home-admin"
                return alert("bạn không phải admin")
            }
            alert(data.messenger)
            if(confirm("bạn có muốn đăng ký") == true) {
                return window.location.href = "/sign-up"
            }
        }).catch((err) => {
            alert(err)
        });
    }
    return alert("không được để trống")
}
function mySignUp() {
    window.location.href = "/sign-up"
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}