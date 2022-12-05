window.onload = function() {
    fetch("http://localhost:5000/data.json", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
        document.getElementById("json").innerHTML = JSON.stringify(data);
    });

    fetch("http://localhost:5000/myxml.xml", { method: "GET" })
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("xml").innerHTML = data;
        console.log('xml fetched');
    });
}