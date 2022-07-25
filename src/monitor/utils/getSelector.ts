export function getSelector(paths:any[]){

  if(Array.isArray(paths)){
    //先反转再过滤
    return paths.reverse().filter(element=>{
      //把document和window过滤掉
      return element!==document && element!==window
    }).map(element=>{
      //返回选择器
      if(element.id){//id等级更高
        return `${element.nodeName.toLowerCase()}#${element.id}`
      }else if(element.className&&typeof element.className==='string'){
        //齐次是类名
        return `${element.nodeName.toLowerCase()}.${element.className}`
      }else{
        //最后是标签名
        return element.nodeName.toLowerCase()
      }
    }).join(' ');
  }
}