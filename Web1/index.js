function submit() {
    wrongFieldX.textContent = "";
    wrongFieldY.textContent = "";
    wrongFieldR.textContent = "";
    if (checkX() & checkY() & checkR()) {
        document.getElementsByName("check_box").forEach(x => {
            if (x.checked) {
                let data ="?x=";
                data+= x.value;
                data += "&y=" + parseFloat(document.getElementById("Y").value.substring(0, 10).replace(',', '.'));
                data += "&r=" + parseFloat(document.getElementById("R").value.substring(0, 10).replace(',', '.'));
                send_request('GET', 'processing.php', data)
            }
        })
    }
}

//TODO:из методов валидации возвращать только строчки
//TODO:доработать неверную обработку запросов на пхп
function clear() {
    wrongFieldX.textContent = "";
    wrongFieldY.textContent = "";
    wrongFieldR.textContent = "";
    send_request('GET', 'clear.php');
    $("#result_table tr:gt(0)").remove();
}

function start() {
    send_request('GET', 'processing.php');
    $("#result_table tr:gt(0)").remove();
}

function checkX() {
    let x = document.getElementsByName("check_box");
    let counter = 0
    x.forEach(x => {
        if (x.checked)
            counter++
    })
    if (counter === 0) {
        wrongFieldX.textContent = "Вы должны выбрать хотя бы 1 значение X";
        return false
    }
    return true;

}

function checkY() {
    let yButtons = document.getElementById("Y");
    if (yButtons.value.trim() === "") {
        wrongFieldY.textContent = "Поле Y должно быть заполнено";
        return false;
    }
    yButtons.value = yButtons.value.substring(0, 10).replace(',', '.');
    if (!(yButtons.value && !isNaN(yButtons.value))) {
        wrongFieldY.textContent = "Y должен быть числом!";
        return false;
    }
    if (!((yButtons.value >= -3) && (yButtons.value <= 5))) {
        wrongFieldY.textContent = "Y должен принадлежать промежутку: (-3; 5)!";
        return false;
    }
    return true;
}

function checkR() {
    let r = document.getElementById("R");
    if (r.value.trim() === "") {
        wrongFieldR.textContent = "Поле R должно быть заполнено";
        return false;
    }
    r.value = r.value.substring(0, 10).replace(',', '.');
    if (!(r.value && !isNaN(r.value))) {
        wrongFieldR.textContent = "R должен быть числом!";
        return false;
    }
    if (!((r.value >= 1) && (r.value <= 3))) {
        wrongFieldR.textContent = "R должен принадлежать промежутку: (1; 3)!";
        return false;
    }
    return true;
}

function send_request(method, url, params = '') {
    let p = new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest()
        xhttp.open(method, url + params)
        xhttp.onload = () => {
            if (xhttp.status >= 400)
                reject()
            else
                resolve(xhttp)
        }
        xhttp.onerror = () => {
            reject(xhttp)
        }
        xhttp.send();
    }).then(xhttp => {
        $("#result_table tr:gt(0)").remove();
        let par = xhttp.responseText;
        if (par !== "remove") {
            let result = JSON.parse(xhttp.responseText);
            for (let i in result.response) {
                let newRow = '<tr>';
                newRow += '<td>' + result.response[i].xval + '</td>';
                newRow += '<td>' + result.response[i].yval + '</td>';
                newRow += '<td>' + result.response[i].rval + '</td>';
                if (result.response[i].out === "True") {
                    newRow += '<td><div style="color:#279327">' + result.response[i].out + '</div></td>';
                } else {

                    newRow += '<td><div style="color:#e11a1a">' + result.response[i].out + '</div></td>';
                }
                newRow += '<td>' + result.response[i].sendingTime + '</td>';
                newRow += '<td>' + result.response[i].totalProcessingTime + '</td>';
                newRow += '</tr>';
                $('#result_table').append(newRow);
            }
        }
        // $('#result_table tr:last').after(response);
    }).catch((xhttp) => {
        if (xhttp.status === 400)
            alert("неверный запрос")
        else
            alert("неожиданная ошибка")
    })
}


document.getElementById("send-button").addEventListener("click", submit);
document.getElementById("clear-button").addEventListener("click", clear);
start();
let wrongFieldX = document.getElementById("wrong_field_X");
let wrongFieldY = document.getElementById("wrong_field_Y");
let wrongFieldR = document.getElementById("wrong_field_R");