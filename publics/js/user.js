
// lưu sự thay đổi khi tạo mới data
var arrAdd = [1]
// lưu email
var arrEmail = [1]

$(".data-user").click(function() {
    $(this).addClass("style")
    $(".data-book").removeClass("style")
    $(".content-book").addClass("hide")
    $(".detail").removeClass("hide")
})
$(".data-book").click(function() { 
    $(this).addClass("style")
    $(".data-user").removeClass("style")
    $(".detail").addClass("hide")
    $(".content-book").removeClass("hide")
})
myDetail()
showLibrary()

// *** Quản lý thông tin => ok ok

function myDetail() {
    $(".content-infor").addClass("hide")
    $(".detail").removeClass("hide")
    $("#list-user-detail").empty()
    var token = getCookie("token")
    $.ajax({
        url: "/author/" + token,
        method: "GET"
    })
    .then((data) => {
        if(!data.error) {
            if(arrEmail.length >= 2) arrEmail.pop()
            arrEmail.push(data.value[0].email)
            $("#list-user-detail").append(
                `
                    <tr class="table-light">
                        <td class="add-class">${data.value[0].email}</td>
                        <td class="add-class">${data.value[0].username}</td>
                        <td class="add-class">${data.value[0].phone}</td>
                        <td class="btn-value">
                            <button onclick=myChange('123') id="btn-change" type="button" class="btn btn-info" data-toggle="modal" data-target="#modalChange">Thay đổi</button>
                            <button onclick=myDelete('123') type="button" class="btn btn-danger">Xóa</button>
                        </td>
                    </tr>
                `
            )   
            $(".user").text(`${data.value[0].email}`)             
        }
    }).catch((err) => {
        alert(err)
    });
}

// thay đổi thông tin
// lưu ID khi thay đổi data
function myChange() {
    let arrEmail = $(".add-class")
    let arrSum = []
    for(let i = 0; i < arrEmail.length; i++) {
    arrSum.push(arrEmail[i].textContent)
    }
    $("#add-email").val(`${arrSum[0]}`)
    $("#add-username").val(`${arrSum[1]}`)
    $("#add-phone").val(`${arrSum[2]}`)
    $("#add-password").val("")
}

// hoàn thành thay đổi
function doneChange(val) {
    var token = getCookie("token")
    let email = $("#add-email").val().trim()
    let username = $("#add-username").val().trim()
    let phone = $("#add-phone").val().trim()
    let password = $("#add-password").val().trim()
    if(!(email && username && phone && password)) {
        return alert("không được để trống add")
    }
    if(!(((!isNaN(phone)) && typeof Number(phone) === "number") &&
    ((!isNaN(password)) && typeof Number(password) === "number"))) {            
        return alert("phone và password phải là số")
    }
    $.ajax({
        url: "/author/" + val + "/" + token,
        method: "PUT",
        data: {
            email,
            username,
            phone,
            password
        }
    })
    .then((data) => {
        if(!data.error) {
            alert(data.message)
            return myDetail()
        }
        return alert(data.message)
    }).catch((err) => {
        alert(err)
    });
}

// xóa data
function myDelete(val) {
    var token = getCookie("token")
    if(confirm("Bạn có muốn xóa không ?") == true) {
        $.ajax({
            url: "/author/" + val + "/" + token,
            method: "DELETE"
        })
        .then((data) => {
            if(!data.error) {
                alert(data.message)
                return window.location.href = "/login"
            }
        }).catch((err) => {
            alert(err)
        });
    }
}

// *** Quản lý thư viện
var stt = 1
// hiển thị toàn bộ thư viện
function showLibrary() {
    $("#list-user-book").empty()
    var token = getCookie("token")
    $.ajax({
        url: "/book/" + token,
        method: "GET"
    })
    .then((data) => {
        stt = 1
        if(!data.error) {
            for(i = 0; i < data.value.length; i++) {
                $("#list-user-book").append(
                    `
                        <tr class="table-light">
                            <td class="add-class-book">${stt++}</td>
                            <td class="add-class-book">${data.value[i].name}</td>
                            <td class="add-class-book">${data.value[i].time}</td>
                            <td class="btn-value">
                                <button onclick="myChangeBook('${data.value[i]._id}', '${data.value[i].name}')" id="btn-change" type="button" class="btn btn-info" data-toggle="modal" data-target="#modalChangeBook">Thay đổi</button>
                                <button onclick=myDeleteBook('${data.value[i]._id}') type="button" class="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    `
                ) 
            }
                           
        }
    }).catch((err) => {
        alert(err)
    });
}

// tạo mới book
function sumArr(data) {
    if (data.length === 2) data.pop()
    if (data.length > 2) return 1
    return data.push(1)
}
function subArr(data) {
    if (data.length >= 2) return data.pop()
}
// chọn add book
function toAddBook() {
    if (arrAdd.length >= 2) {
        $("#add-name-book").val("")
    }
}
// hoàn thành book
function doneAddBook() {
    let email = arrEmail[1]
    let name = $("#add-name-book").val().trim()
    let date = new Date()
    let arrTime = date.toString().split(" ")
    let time = arrTime[4] + "/" + arrTime[0] + "/" + arrTime[2] + "/" + arrTime[1] + "/" + arrTime[3]
    var token = getCookie("token")
    $.ajax({
        url: "/book/" + token,
        method: "POST",
        data: {
            email,
            name,
            time
        }
    })
        .then((data) => {
            if (!data.error) {
                alert(data.message)
                showLibrary()
                return sumArr(arrAdd)
            }
            alert(data.message)
            return subArr(arrAdd)
        }).catch((err) => {
            alert(err)
        });
}

// thay đổi book
// lưu ID khi thay đổi data
var arrIdToChange = [1]
function myChangeBook(id, name) {
    if(arrIdToChange.length >= 2) arrIdToChange.pop()
    arrIdToChange.push(id)
    $("#change-name-book").val(`${name}`)
}

// hoàn thành thay đổi
function doneChangeBook() {
    var token = getCookie("token")
    let id = arrIdToChange[1]
    let name = $("#change-name-book").val().trim()
    let date = new Date()
    let arrTime = date.toString().split(" ")
    let time = arrTime[4] + "/" + arrTime[0] + "/" + arrTime[2] + "/" + arrTime[1] + "/" + arrTime[3]
    if(!name) {
        return alert("không được để trống add")
    }
    $.ajax({
        url: "/book/" + token,
        method: "PUT",
        data: {
            id,
            name,
            time
        }
    })
    .then((data) => {
        if(!data.error) {
            alert(data.message)
            return showLibrary()
        }
        return alert(data.message)
    }).catch((err) => {
        alert(err)
    });
}

// xóa book
function myDeleteBook(val) {
    var token = getCookie("token")
    if(confirm("Bạn có muốn xóa không ?") == true) {
        $.ajax({
            url: "/book/" + token,
            method: "DELETE",
            data: {
                id: val
            }
        })
        .then((data) => {
            if(!data.error) {
                alert(data.message)
                return showLibrary()
            }
        }).catch((err) => {
            alert(err)
        });
    }
}

// thoát về login
$("#logout").click(() => {
    if (confirm("Bạn có muốn thoát hay không?")) {
        setCookie("token", "", -1)
        return window.location.href = "/login"
    }
})

// làm việc với cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}