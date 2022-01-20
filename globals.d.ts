export {};

declare global{
  var connections:{
    [user_id:string]:{
      userRefs:[user_id:string]
      socket:WebSocket
    }
  }
}