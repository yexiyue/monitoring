export function onload(callback){
  if(document.readyState==='complete'){
    callback()
  }else{
    window.onload=callback
  }
}