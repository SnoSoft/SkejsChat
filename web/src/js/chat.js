let data = {};

async function getMessages() {
    const promise = await fetch("sample-data/message.json");
    const data = await promise.json();

    return data;
}

async function populate() {
    data.messages.forEach((message) => {
        const newNode = (message.Sender_id === 1) ? sc.createNode("message-by-user") : sc.createNode("message-not-by-user");
        newNode.querySelector(".chat__message__user").innerHTML = `Sender: ${message.Sender_id}`;
        newNode.querySelector(".chat__message__contents").innerHTML = message.Message;
        document.querySelector(".chat__feed").appendChild(newNode);
    });
}

async function init() {
    data = await getMessages();
    populate();
}

init();