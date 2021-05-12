// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //获取访问参数
  let id = event.id
  let text = event.text
  let state = event.state
  let pageIndex = event.pageIndex
  let pageSize = event.pageSize
  let type = event.type

  //拼接查询条件
  let where = {
    // state: _.gt(0)
  };
  if(id){
    where._id = id
  }
  if(text){
    text = decodeURI(text);
    where.text = db.RegExp({
      regexp: text,  //从搜索栏中获取的value作为规则进行匹配。
      options: 'i',  //大小写不区分
    });
  }
  if(state!=undefined && state!=-1){
    where.state = Number(state)
  }
  if(!pageIndex){
    pageIndex = 0
  }
  if(!pageSize){
    pageSize = 100
  }

  try{
    // let res = await db.collection(type).where(where)
    //         .skip(pageIndex*pageSize).limit(pageSize).get();
    let res = await db.collection(type).aggregate()
            .match(where)
            .addFields({
              type: type,
            })
            .skip(pageIndex*pageSize).limit(pageSize)
            .end();
    // 查总条数
    const countResult = await db.collection(type).where(where).count();
    const total = countResult.total;
    res.total = total;
    res.type = type;
    return res;
  }catch(e){
    console.log(e);
    return e.message;
  }
}