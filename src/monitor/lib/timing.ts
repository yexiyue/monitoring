import {SendTracker} from "../utils/tracker";
import { onload } from "../utils/onload";
import getLastEvent from "../utils/getLastEvent";
import { getSelector } from "../utils/getSelector";
const tracker=new SendTracker('http://localhost:3000/api/error/timing')
const tracker1=new SendTracker('http://localhost:3000/api/error/performance')
export function injectTiming(){
  let FMP:PerformanceEntry,LCP:PerformanceEntry;
  //获取FMP
  new PerformanceObserver((entryList,observer)=>{
    let perfEntries=entryList.getEntries();
    FMP=perfEntries[0];
    observer.disconnect();//不再观察了
  }).observe({entryTypes:['element']})//观察页面中的有意义的元素
  //获取LCP
  new PerformanceObserver((entries,observer)=>{
    let perfEntries=entries.getEntries();
    LCP=perfEntries[0]
    observer.disconnect()
  }).observe({entryTypes:['largest-contentful-paint']})//观察页面中最大的元素
  //获取FID
  new PerformanceObserver((entries,observer)=>{
    let firstInput:any=entries.getEntries()[0]
    console.log('FID',firstInput)
    let lastEvent=getLastEvent()
    if(firstInput){
      let inputDelay=firstInput.processingStart-firstInput.startTime
      let duration=firstInput.duration
      if(inputDelay>0||duration>0){
        const tracker=new SendTracker('http://localhost:3000/api/error/performance/FID')
        tracker.send({
          kind:'experience',
          type:'firstInputDelay',
          inputDelay:''+inputDelay,
          duration:''+duration,
          startTime:''+firstInput.startTime,
          selector:lastEvent?getSelector(lastEvent.path || lastEvent.target):''
        })
      }
    }
    observer.disconnect()
  }).observe({type:'first-input',buffered:true})//观察第一次交互

  onload(function(){
    setTimeout(()=>{
      let p2=performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      const {
        fetchStart,
        connectStart,
        connectEnd,
        domainLookupStart,
        domainLookupEnd,
        requestStart,
        responseStart,
        responseEnd,
        loadEventStart,
        loadEventEnd,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
      }=p2[0]

      let obj={
        kind:'experience',//用户体验指标
        type:'timing',//统计每个阶段的时间
        connectTime:connectEnd-connectStart,//tcp连接时间
        ttfbTime:responseStart-requestStart,//从客户端发起请求到接收响应的时间
        responseTime:responseEnd-requestStart,//响应读取时间
        parseDOMTime:loadEventStart-domInteractive,//dom解析时间
        domConnectLoadedTime:domContentLoadedEventEnd-domContentLoadedEventStart,//dom加载事件时间
        timeToInteractive:domInteractive-fetchStart,//首次可交互时间
        loadTime:loadEventEnd-fetchStart,//完整的加载时间
        dnsTime:domainLookupEnd-domainLookupStart,//dns加载时间
        whiteScreen:responseEnd-fetchStart,//白屏时间
      }
      tracker.send(obj)
      /* console.log(obj) */

      let FP=performance.getEntriesByName('first-paint')[0]
      let FCP=performance.getEntriesByName('first-contentful-paint')[0]
      //开始发送性能指标
      tracker1.send({
        kind:'experience',//用户体验指标
        type:'paint',//统计每个阶段的时间
        firstPaint:''+FP.startTime,
        firstContentfulPaint:''+FCP.startTime,
        firstMeaningfulPaint:''+FMP.startTime,
        largestContentfulPaint:''+LCP.startTime
      })

    },3000)
  })
}