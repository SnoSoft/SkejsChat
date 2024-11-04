let messageData = {};
let usernameData = {};
let usernames = new Map();

async function getMessages() {
    const promise = await fetch("sample-data/message.json");
    const messageData = await promise.json();

    return messageData;
};

async function getUsernames() {
    const promise = await fetch("sample-data/usernames.json");
    const usernameData = await promise.json();

    return usernameData;
};

function assignIdsToUsernames() {
    let usernames = new Map();
    usernameData.usernames.forEach((username) => {
        usernames.set(username.id, username.name);
    });

    return usernames;
}

async function populate() {
    messageData.messages.forEach((message) => {
        const newNode = (message.Sender_id === 1) ? sc.createNode("message-by-user") : sc.createNode("message-not-by-user");
        newNode.querySelector(".chat__message__user").textContent = `${usernames.get(message.Sender_id)}`;
        newNode.querySelector(".chat__message__contents").textContent = message.Message;
        document.querySelector(".chat__feed").appendChild(newNode);
    });
};

async function init() {
    messageData = await getMessages();
    usernameData = await getUsernames();
    usernames = assignIdsToUsernames();
    populate();
};

init();