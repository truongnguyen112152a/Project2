showAllData()
// lưu các select trên trang
let arrInfor = [1, 1]
let arrBook = [1, 0]
// biến lưu STT
let stt = 1
// lưu sự thay đổi khi tạo mới data
var arrAdd = [1]
// số lượng data trên một trang
let numPage = 6
// số page trên một Tab
let pageTab = 4
// tổng số Tab
let arrTab = [1]
// lưu tổng số trang
let totalPage = [1]
// lưu số trang hiện tại
let arrCurrentPage = [1, 0]
// lưu số trang hiện tại để Next
let arrNext = [1, 1]
// lưu số trang hiện tại để Back
let arrBack = [1, 1]

// ẩn hiện select
$(".data-user").click(function() {
    $(this).addClass("style")
    $(".data-book").removeClass("style")
    $(".content-book").addClass("hide")
    $(".content-infor").removeClass("hide")
    showAllData()
})
$(".data-book").click(function() {
    $(this).addClass("style")
    $(".data-user").removeClass("style")
    $(".content-infor").addClass("hide")
    $(".content-book").removeClass("hide")
    showAllData()
})

// lấy toàn bộ data
function showAllData() {
    var token = getCookie("token")
    $.ajax({
        url: "/admin/" + token,
        method: "GET",
        headers: {
            "authorization" : "Bearer " + token
        }
    })
        .then((data) => {
            // tạo tự động data
            countData(data.value.length)
            // chia số page hiển thị dữ liệu (làm tròn lên) => tổng số trang
            let sumPage = Math.ceil(data.value.length / numPage)
            // kiểm tra mảng lưu tổng số trang
            if(totalPage.length >= 2) totalPage.pop()
            // lưu tổng số trang vào mảng
            totalPage.push(sumPage)
            // hiển số page trên một tab
            numPageOnTab(totalPage[1], 1)
            // kiểm tra mảng lưu tổng số tab
            if(arrTab.length >= 2) arrTab.pop()
            // chia tổng số trang cho số trang trên một tab => tổng số tab
            let totalTab = Math.ceil(sumPage / pageTab)
            // lưu tổng số tab vào mảng 
            arrTab.push(totalTab)
            $("#list-user").empty()
            stt = 1
            if (!data.error) {
                for (i in data.value) {
                    $("#list-user").append(
                        `
                        <tr class="table-light">
                            <th id="stt" scope="row">${stt++}</th>
                            <td>${data.value[i].email}</td>
                            <td>${data.value[i].username}</td>
                            <td>${data.value[i]._id}</td>
                            <td>
                                <button onclick=myDetail('${data.value[i]._id}') type="button" class="btn btn-warning">Chi tiết</button>
                                <button onclick=myDelete('${data.value[i]._id}') type="button" class="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    `
                    )
                    // thêm giá trị đạt đến giới hạn data trên một trang
                    if (stt === (numPage + 1)) return null
                }
            }
        }).catch((err) => {
            alert(err)
        });
}

// hiển thị theo số trang
function showDataOfPage() {
    var token = getCookie("token")
    $.ajax({
        url: "/admin/page/" + arrCurrentPage[1] + "/" + token,
        method: "GET"
    })
        .then((data) => {
            $("#list-user").empty()
            stt = arrCurrentPage[1] * numPage - numPage + 1
            if (!data.error) {
                for (i in data.value) {
                    $("#list-user").append(
                        `
                            <tr class="table-light">
                                <th id="stt" scope="row">${stt++}</th>
                                <td>${data.value[i].email}</td>
                                <td>${data.value[i].username}</td>
                                <td>${data.value[i]._id}</td>
                                <td>
                                    <button onclick=myDetail('${data.value[i]._id}') type="button" class="btn btn-warning">Chi tiết</button>
                                    <button onclick=myDelete('${data.value[i]._id}') type="button" class="btn btn-danger">Xóa</button>
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

// tạo số page trên một tab

function numPageOnTab(data1,data2) {
    $(".number-page").empty()
    let i = 1
    let z = null
    if(data2 === 2 && data1 < 4) z = data1 + 1
    if(data2 === 1) z = 5
    if(data2 === 2) {
        i = data1  
        z = i + 4
        if(z > totalPage[1]) z = totalPage[1] + 1
    }
    for ( i; i < z; i++) {
        $(".number-page").append(
            `
            <button id="idBtn" type="button" class="btn btn-outline-secondary" onclick="myPage.call(this)">${i}</button>
            `
        )
    }
    if(data2 === 1) {
        $(".number-page button:first").addClass("bg-button")
    }
}

// Back,Next tab
let count1 = [1, 0]
function myBack() {
    if(count1[1] <= 0) return null
    if(count1[1] > 0) {
        let x = count1[1]
        count1.pop() 
        x--
        count1.push(x)
        currentPage(x * 4 + pageTab)
        numPageOnTab(x * 4 + 1, 2)
        showDataOfPage()
        return checkButtonBack()
    } 
    return null
}
function myNext() {
    if(count1[1] >= arrTab[1] -1) return null
    if(count1[1] < arrTab[1] - 1) {
        let x = count1[1]
        count1.pop()
        x++
        count1.push(x)
        currentPage(x * 4 + 1)
        numPageOnTab(x * 4 + 1, 2)
        showDataOfPage()
        return checkButtonNext()
    }
    return null
}

// vị trí button đầu tiên của tab
function currentPage(data) {
    arrCurrentPage.pop()
    if (arrCurrentPage.length > 2) return null
    return arrCurrentPage.push(data)
}

// chuyển trang
function myPage() {
    removeCssBtn()
    let numPage = $(this).text()
    currentPage(numPage)
    $(this).addClass("bg-button")
    return showDataOfPage()
}

// chuyển đến phần detail
function myDetail(data) {
    $(".parent").addClass("hide")
    $(".detail").removeClass("hide")
    $("#list-user").empty()
    var token = getCookie("token")
    $.ajax({
        url: "/admin/detail/" + data  + "/" + token,
        method: "GET"
    })
    .then((data) => {
        if(!data.error) {
            $("#list-user").append(
                `
                    <tr class="table-primary">
                        <td class="add-class">${data.value[0].email}</td>
                        <td class="add-class">${data.value[0].username}</td>
                        <td class="add-class">${data.value[0].phone}</td>
                        <td>
                            <button onclick=myChange('${data.value[0]._id}') id="btn-create" type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModal">Thay đổi</button>
                        </td>
                    </tr>
                `
            )                
        }
    }).catch((err) => {
        alert(err)
    });
}
function myChange() {
    let arrEmail = $(".add-class")
    let arrSum = []
    for(let i = 0; i < arrEmail.length; i++) {
    arrSum.push(arrEmail[i].textContent)
    }
    $("#email").val(`${arrSum[0]}`)
    $("#username").val(`${arrSum[1]}`)
    $("#phone").val(`${arrSum[2]}`)
    $("#phone").val()
}
function doneChange() {
    let email = $("#email").val().trim()
    let username = $("#username").val().trim()
    let phone = $("#phone").val().trim()
    let password = $("#password").val().trim()
    if(!(email && username && phone && password)) {
        return alert("không được để trống")
    }
    if(!(((!isNaN(phone)) && typeof Number(phone) === "number") &&
    ((!isNaN(password)) && typeof Number(password) === "number"))) {            
        return alert("phone và password phải là số")
    }
    $.ajax({
        url: "/user/" + urlId,
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
            alert(data.messenger)
            return myDetail()
        }
        return alert(data.messenger)
    }).catch((err) => {
        alert(err)
    });
}
$("#back").click(() => {
    $(".detail").addClass("hide")
    $(".parent").removeClass("hide")
    return showAllData()
})
// xóa data
function myDelete(data) {
    if(confirm("Bạn có muốn xóa không ?") == true) {
        $.ajax({
            url: "/user/" + data,
            method: "DELETE"
        })
        .then((data) => {
            if(!data.error) {
                alert("xóa dữ liệu thành công")
                return showDataOfPage()
            }
        }).catch((err) => {
            alert(err)
        });
    }
}

// tạo mới data
function sumArr(data) {
    if (data.length === 2) data.pop()
    if (data.length > 2) return 1
    return data.push(2)
}
function subArr(data) {
    if (data.length === 2) return data.pop()
}
// chọn thay đổi
function toAdd() {
    if (arrAdd.length !== 2) {
        $("#int-email").val("")
        $("#int-username").val("")
        $("#int-phone").val("")
        $("#int-school").val("")
        $("#int-password").val("")
    }
}
// click thay đổi trên ô modal
function doneAdd() {
    let email = $("#int-email").val()
    let username = $("#int-username").val()
    let phone = $("#int-phone").val()
    let school = $("#int-school").val()
    let password = $("#int-password").val()
    if (!(email && username && phone && school && password)) {
        alert("không được để trống")
        return sumArr(arrAdd)
    }
    if (!(((!isNaN(phone)) && typeof Number(phone) === "number") &&
        ((!isNaN(password)) && typeof Number(password) === "number"))) {
        alert("phone và password phải là số")
        return sumArr(arrAdd)
    }
    $.ajax({
        url: "/user",
        method: "POST",
        data: {
            email,
            username,
            phone,
            school,
            password
        }
    })
        .then((data) => {
            if (!data.error) {
                alert("tạo dữ liệu thành công")
                showDataOfPage()
                return subArr(arrAdd)
            }
            alert("email này đã tồn tại")
            return sumArr(arrAdd)
        }).catch((err) => {
            alert(err)
        });
}

// thoát về login
$("#logout").click(() => {
    if (confirm("Bạn có muốn thoát hay không?")) {
        setCookie("token", "", -1)
        window.location.href = "/login"
    }
})

// trang trí button

function checkButtonNext() {
    $(".number-page button:first").addClass("bg-button")
}
function checkButtonBack() {
    $(".number-page button:last").addClass("bg-button")
}

function removeCssBtn() {
    $("* #idBtn").removeClass("bg-button")
}
// tạo tự động data
let arrCount = [1]
function countData(data) {
    if (arrCount.length === 2) arrCount.pop()
    return arrCount.push(data)
}
function autoData() {
    for (let i = arrCount[1] + 1; i < (arrCount[1] + 10); i++) {
        let email = `truong${i}@gmail.com`
        let username = `truong${i}`
        let phone = i
        let password = i
        $.ajax({
            url: "/user/sign-up",
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
                    return showDataOfPage()
                }
                alert("tạo tự động data")
                return window.location.href = window.location.href
            }).catch((err) => {
                alert(err)
            });
    }

}
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