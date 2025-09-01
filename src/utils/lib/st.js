"use strict"

const NlsClient = require("./nls")
const EventBus = require("./eventEmitter")

export class SpeechTranscription {
  constructor(config) {
    this._event = new EventBus()
    this._config = config
  }

  defaultStartParams() {
    return {
      format:"pcm",
      sample_rate:16000,
      enable_intermediate_result:true,
      enable_punctuation_prediction:true,
      enable_inverse_text_normalization:true
    }
  }

  on(which, handler) {
    this._event.off(which)  //
    this._event.on(which, handler)
  }

  async start(param, enablePing, pingInterval) {
    this._client = new NlsClient(this._config)
    this._taskid = this._client.uuid()
    let req = {
      header:{
        message_id:this._client.uuid(),
        task_id:this._taskid,
        namespace:"SpeechTranscriber",
        name:"StartTranscription",
        appkey:this._config.appkey
      },
      payload: param,
      context: this._client.defaultContext()
    }

    return new Promise(async (resolve, reject) => {
      try {
        await this._client.start(
          //onmessage
          (msg, isBinary) => {
            if (!isBinary) {
              let str = msg.toString()
              //console.log("recv ", str);
              let msgObj = JSON.parse(str)
              if (msgObj.header.name === "TranscriptionStarted") {
                //console.log("emit onStart")
                this._event.emit("started", str)
                resolve(str)
              } else if (msgObj.header.name === "TranscriptionResultChanged") {
                //console.log("emit resultChanged")
                this._event.emit("changed", str)
              } else if (msgObj.header.name === "TranscriptionCompleted") {
                //console.log("emit completed")
                this._event.emit("TranscriptionCompleted", str)
              } else if (msgObj.header.name === "SentenceBegin") {
                //console.log("emit sentenceBegin")
                this._event.emit("begin", str)
              } else if (msgObj.header.name === "SentenceEnd") {
                //console.log("emit sentenceEnd")
                this._event.emit("end", str)
              } else if (msgObj.header.name === "TaskFailed") {
                //console.log("emit taskfailed")
                this._client.shutdown()
                this._client = null
                this._event.emit("TaskFailed", str)
                this._event.emit("failed", str)
              }
            }
          },
          //onclose
          ()=> {
            //console.log("emit onClose")
            this._event.emit("closed")
          })
        this._client.send(JSON.stringify(req), false)
      } catch (error) {
        reject(error)
      }
    })
  }

  async close(param) {
    if (this._client == null) {
      return new Promise((resolve, reject)=>{
        process.nextTick(()=>{
          reject("client is null")
        })
      })
    }

    let req = {
      header:{
        message_id:this._client.uuid(),
        task_id:this._taskid,
        namespace:"SpeechTranscriber",
        name:"StopTranscription",
        appkey:this._config.appkey
      },
      payload: param,
      context: this._client.defaultContext()
    }

    return new Promise((resolve, reject) => {
      this._event.off("TranscriptionCompleted") //
      this._event.on("TranscriptionCompleted",
        (msg) => {
          if (this._client) {
            this._client.clearPing()
            this._client = null
          }
          this._event.emit("completed", msg)
          resolve(msg)
        })
        this._event.off("TaskFailed")
      this._event.on("TaskFailed",
        (msg) => {
          reject(msg)
        })

      this._client.send(JSON.stringify(req), false)
    })
  }

  ctrl(param) {
    if (this._client == null) {
      throw new Error("client is null")
    }
    let req = {
      header:{
        message_id:this._client.uuid(),
        task_id:this._taskid,
        namespace:"SpeechTranscriber",
        name:"ControlTranscription",
        appkey:this._config.appkey
      },
      payload: param,
      context: this._client.defaultContext()
    }
    this._client.send(JSON.stringify(req), false)
  }

  shutdown() {
    if (this._client == null) {
      //console.log("client is null")
      return
    }

    this._client.shutdown()
  }

  sendAudio(data) {
    if (this._client == null) {
      //console.log("client is null")
      return false
    }

    this._client.send(data, true)
    return true
  }
}
export const sleep = (milSec)=> {
  return new Promise(resolve => {
    setTimeout(resolve, milSec)
  }) 
}
//module.exports = SpeechTranscription
