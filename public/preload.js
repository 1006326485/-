const KEY = '背单词'
const db = utools.dbStorage

// 读取数据
const 读取数据 = () => {
  return db.getItem(KEY)
}

// 写入数据
const 写入数据 = (data) => {
  db.setItem(KEY, data)
}

window.背单词 = {
  读取数据,
  写入数据,
}
