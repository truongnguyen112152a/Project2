// *** Quản lý thư viện

// số book hiển thị trên một page
var numBook = 5
// lưu tổng số page
var totalBook = [1]
// lưu tổng số tab book
var arrTabBook = [1]


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
            buttonBook(totalBook[1], 1)

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
                            <td>
                                <button onclick=myDetail('${data.value[i]._id}') type="button" class="btn btn-warning">Chi tiết</button>
                                <button onclick=myDelete('${data.value[i]._id}') type="button" class="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    `
                    )
                    // thêm giá trị đạt đến giới hạn book trên một trang
                    if (stt === (numBook + 1)) return null
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
function buttonBook(data1,data2) {
    $(".book-number-page").empty()
    let i = 1
    let z = null
    if(data1 < 4) z = data1 + 1
    if(data2 === 2) {
        i = data1  
        z = i + 4
        if(z > totalPage[1]) z = totalPage[1] + 1
    }
    console.log(z);
    for ( i; i < z; i++) {
        $(".book-number-page").append(
            `
            <button id="btnBook" type="button" class="btn btn-outline-secondary" onclick="myPageBook.call(this)">${i}</button>
            `
        )
    }
    if(data2 === 1) {
        $(".book-number-page button:first").addClass("bg-button")
    }
}

function show() {
    console.log("ok");
}