import getLastEvent from '../utils/getLastEvent'
import { getSelector } from '../utils/getSelector'
import {SendTracker} from '../utils/tracker'
const tracker=new SendTracker('http://localhost:3000/api/error/js')
export function injectJsError(){
  //监控全局未捕获的错误
  window.addEventListener('error',(ev:any)=>{
    let lastEvent=getLastEvent()//获取最后一个交互事件
    // console.log(lastEvent)
    let log={
      kind:'stability',//监控指标的大类
      type:'error',//小类型 这是一个错误
      errorType:'jsError',//js执行错误
      message:ev.message,//报错信息
      filename:ev.filename,//那个文件报错了
      position:`${ev.lineno}:${ev.colno}`,//哪行哪列报错
      stack:getLines(ev.error.stack),//调用的堆栈
      selector:lastEvent?getSelector(lastEvent.path):'',//代表最后一个操作的元素
    }
    //向服务器发送错误信息
    tracker.send(log)
    
  })
  
  //捕获promise错误
  window.addEventListener('unhandledrejection',(ev)=>{
    // console.log(ev)
    let lastEvent=getLastEvent();
    let message='';
    let filename='';
    let lineno=0;
    let colno=0;
    let stack=''
    let reason=ev.reason
    if(typeof reason==='string'){
      //说明是reject错误
      message=reason
    }else if(typeof reason==='object'){
      message=reason.message
      //说明是一个错误对象
      if(reason.stack){
        let matchReasult=reason.stack.match(/at\s*(.*):(\d+):(\d+)\s/)
        filename=matchReasult[1]
        lineno=matchReasult[2]
        colno=matchReasult[3]
      }
      stack=getLines(reason.stack)
    }
    //上报promise错误信息
    tracker.send({
      kind:'stability',//监控指标的大类
      type:'error',//小类型 这是一个错误
      errorType:'promiseError',//js执行错误
      message:message,//报错信息
      filename:filename,//那个文件报错了
      position:`${lineno}:${colno}`,//哪行哪列报错
      stack:stack,//调用的堆栈
      selector:lastEvent?getSelector(lastEvent.path):'',//代表最后一个操作的元素
    })
  })
  function getLines(stack:string){
    //对调用堆栈进行处理
    return stack.split('\n').slice(1).map(x=>x.replace(/^\s+at\s+/g,'')).join('^')
  }
}