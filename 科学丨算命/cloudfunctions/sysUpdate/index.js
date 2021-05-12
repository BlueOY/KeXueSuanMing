// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let id = event._id
  let text = event.text
  if(text){
    text = decodeURI(text);
  }
  let state = event.state
  if(state){
    state = parseInt(state);
  }
  let type = event.type
  
  try {
    let res = await db.collection(type).doc(id).update({
      data: {
        text: text,
        state: state,
        updateTime: new Date(),
      },
    })
    return {
      result: true,
      message: "更新成功",
    }
  } catch(e) {
    console.error(e)
    return {
      result: false,
      message: "更新失败",
      error: e.message,
    }
  }
}