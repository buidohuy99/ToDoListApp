const signalR = require("@microsoft/signalr");

let connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_API_URL + "/signalR")
    .build();

export default connection;