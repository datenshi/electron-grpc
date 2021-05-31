// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var proto_chat2_pb = require('../proto/chat2_pb.js');

function serialize_example_Message(arg) {
  if (!(arg instanceof proto_chat2_pb.Message)) {
    throw new Error('Expected argument of type example.Message');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_example_Message(buffer_arg) {
  return proto_chat2_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}


var ChatService = exports.ChatService = {
  join: {
    path: '/example.Chat/join',
    requestStream: true,
    responseStream: true,
    requestType: proto_chat2_pb.Message,
    responseType: proto_chat2_pb.Message,
    requestSerialize: serialize_example_Message,
    requestDeserialize: deserialize_example_Message,
    responseSerialize: serialize_example_Message,
    responseDeserialize: deserialize_example_Message,
  },
  send: {
    path: '/example.Chat/send',
    requestStream: false,
    responseStream: false,
    requestType: proto_chat2_pb.Message,
    responseType: proto_chat2_pb.Message,
    requestSerialize: serialize_example_Message,
    requestDeserialize: deserialize_example_Message,
    responseSerialize: serialize_example_Message,
    responseDeserialize: deserialize_example_Message,
  },
};

exports.ChatClient = grpc.makeGenericClientConstructor(ChatService);
