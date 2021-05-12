// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let text = event.text
  if(text){
    text = decodeURI(text);
  }
  let type = event.type

  try {
    let res = await db.collection(type).add({
      // data 字段表示需新增的 JSON 数据
      data: {
        text: text,
        createTime: new Date()
      },
    });
    return {
      result: true,
      message: "新增成功",
    }
  } catch(e) {
    console.error(e)
    return {
      result: false,
      message: "新增失败",
      error: e.message,
    }
  }
}