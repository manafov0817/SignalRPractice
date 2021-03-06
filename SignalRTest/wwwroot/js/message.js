"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/messages").build();

connection.on("ReceiveMessage", function (message) {

    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    var div = document.createElement("div");

    div.innerHTML = msg + "<hr />";

    document.getElementById("messages").appendChild(div);

})

connection.start().catch(function (err) {
    return console.log(err.message);
});

document.getElementById("sendButton").addEventListener("click", function (event) {

    event.preventDefault();

    var message = document.getElementById("message").value;

    var groupElement = document.getElementById("group");

    var groupValue = groupElement.options[groupElement.selectedIndex].value;

    if (groupValue == "MySelf" || groupValue == "All") {

        var method = groupValue == "MySelf" ? "SendMessageToCaller" : "SendMessageToAll";

        connection.invoke(method, message).catch(function (err) {
            console.log(err);
        })
    }
    else if (groupValue == "PrivateGroup") {
        connection.invoke("SendMessageToGroup", "PrivateGroup", message).catch(function (err) {
            return console.log(err.string);
        });
    }
    else {

        console.log("hello brada");

        connection.invoke("SendMessageToUser", groupValue, message).catch(function (err) {
            console.log(err);
        })
    }
})

connection.on("UserConnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    var option = document.createElement("option");
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);
});

connection.on("UserDisconnected", function (connectionId) {
    var groupElement = document.getElementById("group");

    for (var i = 0; i < groupElement.length; i++) {
        if (groupElement.options[i].value == connectionId) {
            groupElement.remove(i);
        }
    }
});

document.getElementById("joinGroup").addEventListener("click", function (event) {
    connection.invoke("JoinGroup", "PrivateGroup").catch(function (err) {
        return console.log(err.string);
        event.preventDefault();
    })
})  