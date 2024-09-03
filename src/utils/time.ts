// 封装一个函数：获取一个结果：当前是早上| 上午｜下午｜晚上
export const getTime = () => {
  let message = ''
  // 通过内置构造函数Date
  let hours = new Date().getHours()
  if (hours <= 8) {
    message = '早上'
  } else if (hours <= 11) {
    message = '上午'
  } else if (hours <= 13) {
    message = '中午'
  } else if (hours <= 17) {
    message = '下午'
  } else if (hours <= 19) {
    message = '傍晚'
  } else if (hours <= 23) {
    message = '晚上'
  } else if (hours < 4) {
    message = '凌晨'
  }
  return message
}
