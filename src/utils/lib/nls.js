"use strict"

const Websocket = require("ws")
const uuid  = require("./uuid")



class NlsClient {
  constructor(config) {
    if (!config || !config.url || !config.appkey || !config.token) {
      throw new Error("invalid config!")
    }
    this._config = config
  }

  start(onmessage, onclose) {
    if (typeof onmessage !== 'function') {
      throw new Error("expect function onmessage")
    }
    if (typeof onclose != 'function') {
      throw new Error("expect function onclose")
    }
    this._ws = new Websocket(this._config.url,
      {headers:{"X-NLS-Token": this._config.token},
        perMessageDeflate:false})
    this._ws.on("message", (data, isBinary) => {
      onmessage(data, isBinary)
    })
    this._ws.on("close", ()=>{
      onclose()
    })
    return new Promise((resolve, reject) => {
      this._ws.on("open", ()=>{
        resolve()
      })
      this._ws.on("error", err=>{
        reject(err)
      })
    })
  }

  send(data, isBinary) {
    if (this._ws == null) {
      return
    }
    
    this._ws.send(data)
  }


  shutdown() {
    if (this._ws == null) {
      return
    }

    this._ws.terminate()
  }

  uuid() {
    return uuid(true)
  }

  defaultContext() {
    return {
      sdk:{
        name: "nls-nodejs-sdk",
        version: "0.0.1",
        language: "nodejs"
      }
    }
  }

}

module.exports = NlsClient
