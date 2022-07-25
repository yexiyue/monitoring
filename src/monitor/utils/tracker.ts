import userAgent from 'user-agent'

function getExtraData(){
  return {
    title:document.title,
    url:location.href,
    timesTamp:`${Date.now()}`,
    userAgent:JSON.stringify(userAgent.parse(navigator.userAgent))
  }
}

export class SendTracker{
  public url:string
  constructor(url:string){
    //上报错误信息的路径
    this.url=url
  }
  async send(data:any){
    let extraData=getExtraData()
    let log={...extraData,...data}
    try {
      return await this.fetch(log)
    } catch (error) {
      return error
    }
  }
  async fetch(data:any){
    const res=await fetch(this.url,{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    })
    return await res.json()
  }
}

