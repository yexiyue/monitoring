import {SendTracker} from "../utils/tracker";
const tracker=new SendTracker('http://localhost:3000/api/error/xhr')

export function injectXHR(){
  let XMLHTTPRequest:any=window.XMLHttpRequest
  let oldOpen=XMLHttpRequest.prototype.open
  XMLHTTPRequest.prototype.open=function(method,url,async){
    //上报请求就不用拦截了
    if(!(/\/error\/xhr$/.test(url))){
      this.logData={method,url,async}
    }
    //@ts-ignore
    return oldOpen.apply(this,Array.prototype.slice.call(arguments))
  }
  let oldSend=XMLHttpRequest.prototype.send
  let startTime
  XMLHTTPRequest.prototype.send=function(body){
    //如果这个对象存在则需要监控
    if(this.logData){
      startTime=Date.now()
      let handler=(type)=>(ev)=>{
        let duration=Date.now()-startTime;
        let status=this.status;
        let statusText=this.statusText;
        tracker.send({
          kind:'stability',//监控指标的大类
          type:'xhr',//小类型 这是一个错误
          errorType:ev.type,//js执行错误
          pathname:this.logData.url,
          status:status+'-'+statusText,
          duration:`${duration}`,
          response:this.response?JSON.stringify(this.response):'',
          params:body||''
        })
      }
      this.addEventListener('load',handler('load'),false)
      this.addEventListener('error',handler('error'),false)
      this.addEventListener('abort',handler('abort'),false)
    }
    //@ts-ignore
    return oldSend.apply(this,Array.prototype.slice.call(arguments))
  }
}