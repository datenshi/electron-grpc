const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain;
const service = require('./proto/proto/chat2_grpc_pb')
const chat = require('./proto/proto/chat2_pb')
const grpc = require('grpc')

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.removeMenu();
    // Open the DevTools.
    win.webContents.openDevTools({
        mode: "detach"
    })
    // and load the index.html of the app.
    win.loadFile('index.html')

    // gRPC stuff
    let client = new service.ChatClient('localhost:5001', grpc.credentials.createInsecure())
    let note = new chat.Message()
    note.setUser('ElectronUser')
    note.setText('Hello from electron')
    console.log('sending note to server')
    client.send(note, function(err, response) {
        console.log('received reply', response);
    });

    let request = new chat.Message();
    request.setUser('Empty User')
    request.setText('Empty Text')

    let call = client.join(request, (error, response) => {
        console.log('Server response to everybody: ' + '[' + response.getUser()+ ']: ' + response.getText());
    });

    ipc.on('send-message', (event, args) => {
        console.log('Send-message from renderer process: ', args);
        let note = new chat.Message()
        note.setUser('ElectronUser')
        note.setText(args)
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

app.on('ready', createWindow)
