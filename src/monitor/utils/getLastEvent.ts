let lastEvent:any;
['click','touchstart','mousedown','keydown','mouseover'].forEach(eventType=>{
  document.addEventListener(eventType,(event)=>{
    //获取最后的事件
    lastEvent=event;
  },{
    capture:true,//捕获阶段执行
    passive:true,//默认不阻止默认事件
  })
})

export default ()=>{
  return lastEvent
}