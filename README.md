## Reference guides:

1. Install protocol buffers compiler: https://grpc.io/docs/protoc-installation/

2. Install gRPC module (I assume Node is already installed in the system): 
```
$ npm i grpc
$ npm i grpc-tools
```
3. Dynamic implementation of gRPC and protocol buffers: https://grpc.io/docs/languages/node/basics/

NOTE: current project uses static implementation so some refactor must be done in the code to achive it.

## Build JavaScript libraries

Commmand to build the JavaScript files using the .proto file, **remember to adjust paths and filenames of required**:

```
protoc -I=. ./proto/chat2.proto --js_out=import_style=commonjs,binary:./server --grpc_out=./server 
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
```

There is another option to do it using different compiler, **remember to adjust paths and filenames of required**:

```
$ ./gen-proto.sh
```

## Develop notes for ELECTRON client: (NOTE: run everything from the project root folder) 

1. First we remove package-lock.json to prevent conflicts: 
```
rm package-lock.json 
```
2. Install modules: 
```
npm install electron-rebuild 
```
3. Rebuild: 
```
./node_modules/.bin/electron-rebuild 
```
4. Start the client (the server must be running/listening first) 
```
npm start 
```

## Reference project: 
https://github.com/datenshi/electron-grpc
