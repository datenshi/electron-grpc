const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;

// Static Implementation of a gRPC API Under Node.js
const service = require('./proto/proto/chat2_grpc_pb');
const chat = require('./proto/proto/chat2_pb');
const grpc = require('grpc');// Hardcode username for demo purposes

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.removeMenu();
    // Open the DevTools.
    win.webContents.openDevTools({
        mode: "detach"
    });
    // and load the index.html of the app.
    win.loadFile('index.html');

    // gRPC client creation
    let client = new service.ChatClient('localhost:50051', grpc.credentials.createInsecure());
    
    //Create the first message to be sent and also allow us to connect to the server
    let note = new chat.Message();
    note.setUser('ElectronUser'); // Hardcode username for demo purposes
    note.setText('Hello from electron');
    //Start the stream between server and client
    let call = client.join(note, (error, response) => {
        console.log('Server response to everybody: ' + '[' + response.getUser()+ ']: ' + response.getText());
    });
    // Send the first message to the server
    console.log('sending note to server');
    client.send(note, function(err, response) {
        console.log('received reply', response);
    });

    ipc.on('send-message', (event, args) => {
        console.log('Send-message from renderer process: ', args);
        let note = new chat.Message();
        note.setUser('ElectronUser'); // Hardcode username for demo purposes
        note.setText(args);
        client.send(note, function(err, response) {
            console.log('received reply', response);
        });
    })

    call.on('data', response => {
        console.log(' Response from server - Message: [' + response.getUser() + ']: ' + response.getText());
        // Send content to window
        win.webContents.on('did-finish-load', ()=>{
            console.log('sent to renderer...');
            win.webContents.send('receive-msg', '[' + response.getUser() + ']: ' + response.getText() + String.fromCharCode(13));
        });
        win.webContents.send('receive-msg', '[' + response.getUser() + ']: ' + response.getText() + String.fromCharCode(13));
    });

    call.on('error', error => {
        console.error(error);
    });

    call.on('end', () => {
        console.log('Client: This is the END');
    });

}

app.on('ready', createWindow);
