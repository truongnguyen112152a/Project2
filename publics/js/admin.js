
// ẩn hiện select trên thanh menu
$(".data-user").click(function() {
    $(this).addClass("style")
    $(".data-book").removeClass("style")
    $(".content-book").addClass("hide")
    $(".content-infor").removeClass("hide")
    $(".detail-book").addClass("hide")
})
$(".data-book").click(function() {
    $(this).addClass("style")
    $(".data-user").removeClass("style")
    $(".content-infor").addClass("hide")
    $(".content-book").removeClass("hide")
    $(".detail").addClass("hide")
})

// *** Quản lý thông tin
showAllData()

// biến lưu STT
let stt = 1

// lưu sự thay đổi khi tạo mới data,nếu thay đổi thành công thì ô modal không có giá trị
// nếu thay đổi thất bại thì ô modal vẫn lưu giá trị trong ô input
var arrAdd = [1]

// số lượng data trên một page
let numPage = 6

// số page trên một Tab
let pageTab = 4

// tổng số Tab
let arrTab = [1]

// lưu tổng số page
let totalPage = [1]

// nhớ page 1 khi back từ detail => home
let arrCurrentLoad = [1]

// lưu số page hiện tại
let arrCurrentPage = [1, 0]

// lưu số page hiện tại để Next
let arrNext = [1, 1]
// lưu số page hiện tại để Back
let arrBack = [1, 1]

// lấy toàn bộ data
function showAllData() {
    var token = getCookie("token")
    $.ajax({
        url: "/author/" + token,
        method: "GET",
        headers: {
            "authorization" : "Bearer " + token
        }
    })
        .then((data) => {
            // tạo tự động data
            countData(data.value.length)
            // chia tổng số data cho số data/page (làm tròn lên) => tổng số page
            let sumPage = Math.ceil(data.value.length / numPage)
            // kiểm tra mảng lưu tổng số page
            if(totalPage.length >= 2) totalPage.pop()
            // lưu tổng số page vào mảng
            totalPage.push(sumPage)

            // hiển thị số button trên một tab
            numPageOnTab(totalPage[1], 1)
            
            // chia tổng số page cho số page/tab => tổng số tab
            let totalTab = Math.ceil(sumPage / pageTab)
            // kiểm tra mảng lưu tổng số tab
            if(arrTab.length >= 2) arrTab.pop()
            // lưu tổng số tab vào mảng 
            arrTab.push(totalTab)

            // nhớ page1 trước khi back từ detail => home
            if(arrCurrentLoad.length >= 2) arrCurrentLoad.pop()
            arrCurrentLoad.push(1)
            $("#list-user-data").empty()
            stt = 1
            if (!data.error) {
                for (i in data.value) {
                    $("#list-user-data").append(
                        `
                        <tr class="table-light">
                            <th id="stt" scope="row">${stt++}</th>
                            <td>${data.value[i].email}</td>
                            <td>${data.value[i].username}</td>
                            <td class="btn-value">
                                <button onclick=myDetail('${data.value[i]._id}') type="button" class="btn btn-warning">Chi tiết</button>
                                <button onclick=myDelete('${data.value[i]._id}') type="button" class="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    `
                    )
                    // giới hạn data trên một page
                    if (stt === (numPage + 1)) return null
                }
            }
        }).catch((err) => {
            alert(err)
        });
}

// hiển thị data theo số page
function showDataOfPage(data) {
    var token = getCookie("token")
    $.ajax({
        url: "/author/page/" + arrCurrentPage[1] + "/" + token,
        method: "GET"
    })
        .then((data) => {
            $("#list-user-data").empty()
            stt = arrCurrentPage[1] * numPage - numPage + 1
            if (!data.error) {
                for (i in data.value) {
                    $("#list-user-data").append(
                        `
                            <tr class="table-light">
                                <th id="stt" scope="row">${stt++}</th>
                                <td>${data.value[i].email}</td>
                                <td>${data.value[i].username}</td>
                                <td class="btn-value">
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

// tạo số button trên một tab
// data2 vị trí truyền tham số cho function
// data2 = 1 => data1 tổng số page
// data2 = 2 => data1 vị trí kết thúc trên tab
function numPageOnTab(data1,data2) {
    $(".number-page").empty()
    let i = 1
    let z = 5
    if(data1 < 4) z = data1 + 1
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

// chuyển page
function myPage() {
    if(arrCurrentLoad.length >= 2) arrCurrentLoad.pop()
    removeCssBtn()
    let numPage = $(this).text()
    currentPage(numPage)
    $(this).addClass("bg-button")
    if(numPage === 1) return showAllData()
    return showDataOfPage()
}

// chuyển đến phần detail
function myDetail(data) {
    $(".content-infor").addClass("hide")
    $(".detail").removeClass("hide")
    $("#list-user-detail").empty()
    var token = getCookie("token")
    $.ajax({
        url: "/author/detail/" + data  + "/" + token,
        method: "GET"
    })
    .then((data) => {
        if(!data.error) {
            $("#list-user-detail").append(
                `
                    <tr class="table-light">
                        <td class="add-class">${data.value[0].email}</td>
                        <td class="add-class">${data.value[0].username}</td>
                        <td class="add-class">${data.value[0].phone}</td>
                        <td class="btn-value">
                            <button onclick=myChange('${data.value[0]._id}') id="btn-change" type="button" class="btn btn-info" data-toggle="modal" data-target="#modalChange">Thay đổi</button>
                        </td>
                    </tr>
                `
            )                
        }
    }).catch((err) => {
        alert(err)
    });
}
// thay đổi data

// lưu ID khi thay đổi data
var arrIdToChange = [1]
function myChange(data) {
    if(arrIdToChange.length >= 2) arrIdToChange.pop()
    arrIdToChange.push(data)
    let arrEmail = $(".add-class")
    let arrSum = []
    for(let i = 0; i < arrEmail.length; i++) {
    arrSum.push(arrEmail[i].textContent)
    }
    $("#change-email").val(`${arrSum[0]}`)
    $("#change-username").val(`${arrSum[1]}`)
    $("#change-phone").val(`${arrSum[2]}`)
    $("#change-password").val("")
}

// hoàn thành thay đổi data
function doneChange() {
    var token = getCookie("token")
    let email = $("#change-email").val().trim()
    let username = $("#change-username").val().trim()
    let phone = $("#change-phone").val().trim()
    let password = $("#change-password").val().trim()
    if(!(email && username && phone && password)) {
        return alert("không được để trống change")
    }
    if(!(((!isNaN(phone)) && typeof Number(phone) === "number") &&
    ((!isNaN(password)) && typeof Number(password) === "number"))) {            
        return alert("phone và password phải là số")
    }
    $.ajax({
        url: "/author/" + arrIdToChange[1] + "/" + token,
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
            return myDetail(arrIdToChange[1])
        }
        return alert(data.message)
    }).catch((err) => {
        alert(err)
    });
}
// back từ detail => home
$("#back").click(() => {
    $(".detail").addClass("hide")
    $(".content-infor").removeClass("hide")
    if(arrCurrentLoad[1] === 1) return showAllData()
    return showDataOfPage()
})
// xóa data
function myDelete(data) {
    var token = getCookie("token")
    if(confirm("Bạn có muốn xóa không ?") == true) {
        $.ajax({
            url: "/author/" + data + "/" + token,
            method: "DELETE"
        })
        .then((data) => {
            if(!data.error) {
                alert(data.message)
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
    return data.push(1)
}
function subArr(data) {
    if (data.length >= 2) return data.pop()
}
// chọn add data
function toAdd() {
    if (arrAdd.length >= 2) {
        $("#add-email").val("")
        $("#add-username").val("")
        $("#add-phone").val("")
        $("#add-school").val("")
        $("#add-password").val("")
    }
}
// hoàn thành add data
function doneAdd() {
    let email = $("#add-email").val().trim()
    let username = $("#add-username").val().trim()
    let phone = $("#add-phone").val().trim()
    let password = $("#add-password").val().trim()
    if (!(email && username && phone && password)) {
        alert("không được để trống add")
        return sumArr(arrAdd)
    }
    if (!(((!isNaN(phone)) && typeof Number(phone) === "number") &&
        ((!isNaN(password)) && typeof Number(password) === "number"))) {
        alert("phone và password phải là số")
        return sumArr(arrAdd)
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
                showDataOfPage()
                return sumArr(arrAdd)
            }
            alert(data.message)
            return subArr(arrAdd)
        }).catch((err) => {
            alert(err)
        });
}

// thoát về login
$("#logout").click(() => {
    if (confirm("Bạn có muốn thoát hay không?")) {
        setCookie("token", "", -1)
        return window.location.href = "/login"
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

// *** Quản lý thư viện

showAllBook()

// số book hiển thị trên một page
var numBook = 6
// lưu tổng số page
var totalBook = [1]
// lưu tổng số tab book
var arrTabBook = [1]
// lưu sự thay đổi khi tạo mới book
var arrAddBook = [1]


// lấy toàn bộ book
function showAllBook() {
    var token = getCookie("token")
    $.ajax({
        url: "/book/" + token,
        method: "GET",
        headers: {
            "authorization" : "Bearer " + token
        }
    })
        .then((data) => {
            var arrSingleEmail = []
            var arrValueName = []
            var arrValueEmail = []
            var y = 0
            var z = 0
            for(i = 0; i < data.value.length; i++) {
                if(arrSingleEmail.some(value => value.email === data.value[i].email)) continue 
                arrSingleEmail.push(data.value[i]) 
            }
            for(i = 0; i < arrSingleEmail.length; i++) {
                arrValueEmail.push(arrSingleEmail[i].email)
            }
            for(i = 0; i < arrSingleEmail.length; i++) {
                arrValueName.push([])
            }
            for(i = 0; i < arrSingleEmail.length; i++) {
                for(x = 0; x < data.value.length; x++) {
                    z++
                    if(arrSingleEmail[i].email === data.value[x].email) arrValueName[y].push(data.value[x].name)
                    if(z === data.value.length - 1) z = 0
                }
                y++
            }
            // chia tổng dữ liệu cho số dữ liệu/page => tổng số page
            let sumBook = Math.ceil(arrSingleEmail.length / numBook)
            // kiểm tra mảng lưu tổng số page
            if(totalBook.length >= 2) totalPage.pop()
            // lưu tổng số page vào mảng
            totalBook.push(sumBook)

            // hiển số button trên một tab
            // buttonBook(totalBook[1], 1)

            // chia tổng số page cho số page trên một tab => tổng số tab
            let totalTab = Math.ceil(sumBook / pageTab)
            // kiểm tra mảng lưu tổng số tab
            if(arrTabBook.length >= 2) arrTabBook.pop()
            // lưu tổng số tab vào mảng 
            arrTabBook.push(totalTab)
            // kiểm tra mảng lưu số page khi load
            if(arrCurrentLoad.length >= 2) arrCurrentLoad.pop()
            // lưu tổng số tab vào mảng 
            arrCurrentLoad.push(1)
            $("#list-user-book").empty()
            stt = 1
            if (!data.error) {
                for (let i = 0; i < arrValueEmail.length; i++) {
                    $("#list-user-book").append(
                        `
                        <tr class="table-light">
                            <th id="stt" scope="row">${stt++}</th>
                            <td>${arrValueEmail[i]}</td>
                            <td>${arrValueName[i]}</td>
                            <td class="btn-value">
                                <button onclick=myDetailBook('${arrValueEmail[i]}') type="button" class="btn btn-warning">Chi tiết</button>
                            </td>
                        </tr>
                    `
                    )
                    // thêm giá trị đạt đến giới hạn book trên một trang
                    // if (stt === (numBook + 1)) return null
                }
            }
        }).catch((err) => {
            alert(err)
        });
}

// tạo số button trên một tab
// data2 vị trí truyền tham số cho function
// data2 = 1 => data1 tổng số page
// data2 = 2 => data1 vị trí kết thúc trên tab
// function buttonBook(data1,data2) {
//     $(".book-number-page").empty()
//     let i = 1
//     let z = null
//     if(data1 < 4) z = data1 + 1
//     if(data2 === 2) {
//         i = data1  
//         z = i + 4
//         if(z > totalPage[1]) z = totalPage[1] + 1
//     }
//     for ( i; i < z; i++) {
//         $(".book-number-page").append(
//             `
//             <button id="btnBook" type="button" class="btn btn-outline-secondary" onclick="myPageBook.call(this)">${i}</button>
//             `
//         )
//     }
//     if(data2 === 1) {
//         $(".book-number-page button:first").addClass("bg-button")
//     }
// }

// số thứ tự book
var sttBook = 1
// lưu email của book khi thay đổi
var emailBook = [1]
// hiển thị toàn bộ thư viện của một user
function myDetailBook(email) {
    if(emailBook.length >= 2) emailBook.pop()
    emailBook.push(email)
    $(".email-book").text(`${email}`)
    $(".content-book").addClass("hide")
    $(".detail-book").removeClass("hide")
    $("#list-book-detail").empty()
    var token = getCookie("token")
    $.ajax({
        url: "/book/detail/" + email + "/" + token,
        method: "GET"
    })
    .then((data) => {
        sttBook = 1
        if(!data.error) {
            for(i = 0; i < data.value.length; i++) {
                $("#list-book-detail").append(
                    `
                        <tr class="table-light">
                            <td class="add-class-book">${sttBook++}</td>
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
// trở lại trang book
$("#back-book").click(() => {
    $(".detail-book").addClass("hide")
    $(".detail").addClass("hide")
    $(".content-infor").addClass("hide")
    $(".content-book").removeClass("hide")
    if(arrCurrentLoad[1] === 1) return showAllData()
    return showDataOfPage()
})

// tạo mới book
function sumArrBook(data) {
    if (data.length === 2) data.pop()
    if (data.length > 2) return 1
    return data.push(1)
}
function subArrBook(data) {
    if (data.length >= 2) return data.pop()
}
// chọn add book
function toAddBook() {
    if (arrAddBook.length >= 2) {
        $("#add-email-book").val("")
        $("#add-name-book").val("")
    }
}
// hoàn thành add book
function doneAddBook() {
    let email = $("#add-email-book").val().trim()
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
                showAllBook()
                return sumArrBook(arrAddBook)
            }
            alert(data.message)
            return subArrBook(arrAddBook)
        }).catch((err) => {
            alert(err)
        });
}

// thay đổi book
// lưu ID khi thay đổi data
var idToChangeBook = [1]
function myChangeBook(id, name) {
    if(idToChangeBook.length >= 2) idToChangeBook.pop()
    idToChangeBook.push(id)
    $("#change-name-book").val(`${name}`)
}

// hoàn thành thay đổi
function doneChangeBook() {
    var token = getCookie("token")
    let id = idToChangeBook[1]
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
            showAllBook()
            return myDetailBook(emailBook[1])
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
                showAllBook()
                return myDetailBook(emailBook[1])
            }
        }).catch((err) => {
            alert(err)
        });
    }
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
                    return showDataOfPage()
                }
                alert(data.message)
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