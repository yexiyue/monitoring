import {SendTracker} from "../utils/tracker";
import { onload } from "../utils/onload";
const tracker=new SendTracker('http://localhost:3000/api/error/blank')

export function injectBlankScreen(){
  let wrapperElements=['html','body','#container','.container','#app']
  let emptyPoints=0;
  //获取选择器
  function getSelector(element:Element){
    if(element.id){
      return '#'+element.id
    }else if(element.className){
      return '.'+element.className.split(' ').filter(x=>!!x).join('.')
    }else{
      return element.nodeName.toLowerCase()
    }
  }
  //统计空白元素点
  function isWrapper(element){
    let selector=getSelector(element)
    if(wrapperElements.indexOf(selector!)!=-1){
      emptyPoints++
    }
  }
  //加载完成后再判断白屏
  onload(function(){
    //获取均匀分布点
    for(let i=1;i<=9;i++){
      let xElemnts=document.elementsFromPoint(window.innerWidth*i/10,window.innerHeight/2)
      let yElemnts=document.elementsFromPoint(window.innerWidth/2,window.innerHeight*i/10)
      isWrapper(xElemnts[0])
      isWrapper(yElemnts[0])
    }
    //如果大于18个点就上报白屏
    if(emptyPoints>=18){
      let centerElement=document.elementFromPoint(window.innerWidth/2,window.innerHeight/2)
      tracker.send({
        kind:'stability',
        type:'blank',
        emptyPoints,
        screen:window.screen.width+'X'+window.screen.height,
        viewPoint:window.innerWidth+'X'+window.innerHeight,
        selector:getSelector(centerElement!)
      })
    }
  })
}