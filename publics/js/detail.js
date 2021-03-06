var urlId = window.location.pathname.split("/detail/")[1]
myDetail()
function myDetail() {
    $("#list-user").empty()
    $.ajax({
        url: "/user/detail/" + urlId,
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
    $("#int-email").val(`${arrSum[0]}`)
    $("#int-username").val(`${arrSum[1]}`)
    $("#int-phone").val(`${arrSum[2]}`)
    $("#int-phone").val()
}
function doneChange() {
    let email = $("#int-email").val().trim()
    let username = $("#int-username").val().trim()
    let phone = $("#int-phone").val().trim()
    let password = $("#int-password").val().trim()
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
$("#idBtnBack").click(() => {
    window.location.href = "/admin"
})