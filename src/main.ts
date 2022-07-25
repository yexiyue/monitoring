import './style.css'
import './monitor/index'
let btns=document.getElementsByTagName('button')

btns[0].onclick=()=>{
  //@ts-ignore
  window.someVar.error='error'//故意抛出错误
}
btns[1].onclick=()=>{
  /* new Promise((resolve,reject)=>{
    //@ts-ignore
    window.someVar.error='erroe'
  }) */
  return Promise.reject('error')
}

/* btns[3].onclick=async ()=>{
  let res=await fetch('http://localhost:3000/api',{method:'get'})
  console.log(await res.text())
}

btns[2].onclick=async ()=>{
  let res=await fetch('http://localhost:3000/api',{method:'post'})
  console.log(await res.text())
} */

btns[3].onclick=async ()=>{
  let xhr=new XMLHttpRequest()
  xhr.open('POST','http://localhost:3000/api')
  xhr.setRequestHeader('Content-Type','application/json')
  xhr.send(JSON.stringify({
    id:123
  }))
  xhr.onreadystatechange=(ev)=>{
    if(xhr.readyState<4){
      return
    }
    if(xhr.status>200&&xhr.status<300){
      console.log(xhr.response)
    }
  }
}

btns[2].onclick=async ()=>{
  let xhr=new XMLHttpRequest()
  xhr.open('GET','http://localhost:3000/api?id=1')
  xhr.send()
  xhr.onreadystatechange=(ev)=>{
    if(xhr.readyState<4){
      return
    }
    if(xhr.status>200&&xhr.status<300){
      console.log(xhr.response)
    }
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  let start=Date.now()
  while((Date.now()-start)<1000){}
})