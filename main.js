const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain;
const service = require('./proto/chat_grpc_pb')
const chat = require('./proto/chat_pb')
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
    let client = new service.ChatServerClient('localhost:11912', grpc.credentials.createInsecure())
    let note = new chat.Note()
    note.setMessage('Hello from electron')
    console.log('sending note to server')
    client.sendNote(note, function(err, response) {
        console.log('received reply', response);
    });

    let request = new chat.Empty();

    let call = client.chatStream(request, (error, response) => {
        console.log('Server response to everybody: ' + '[' + response.getName()+ ']: ' + response.getNote());
        // Send content to window
        // ipc.send('hello','a string', 10);
        // win.webContents.on('did-finish-load', ()=>{
        //     win.webContents.send('ping', 'whoooooooh!');
        // });
    });

    call.on('data', response => {
        console.log(' Response from server - Message: [' + response.getName() + ']: ' + response.getMessage());
        // Send content to window
        win.webContents.on('did-finish-load', ()=>{
            win.webContents.send('ping', '[' + response.getName() + ']: ' + response.getMessage());
        });
    });

    call.on('error', error => {
        console.error(error);
    });

    call.on('end', () => {
        console.log('Client: This is the END');
    });

}

app.on('ready', createWindow)
