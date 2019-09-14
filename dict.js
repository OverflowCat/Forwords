const CRAWLER = require("crawler");

Array.prototype.insert = function (index, item) {
  return this.splice(index, 0, item)
}

Array.prototype.max = function () {
  var max = this[0]; 
  for (var i = 1; i < this.length; i++) if (this[i] > max) max = this[i]
  return max
}

function insertStr(str, start, newStr){
  return str.substring(0, start) + newStr + str.substring(start)
}

var c = new CRAWLER({
  maxConnections: 5,
  // This will be called for each crawled page
})

function youdaom(ctx) {
  var fetch = new Promise( function(resolve, reject) {
  var w = ctx.message.text ? ctx.message.text : ctx
  c.queue({
    uri: "http://dict.youdao.com/m/search?keyfrom=dict.mresult&q=" + w,
    callback: function (error, res, done) {
      if (error) {
        console.log(error)
      } else {
        var $ = res.$
        var listtrans = $("div.content#listtrans ul")
        var netexplanations = listtrans.slice(0, 1)
        var netex = netexplanations.text().replace(/\s/g, ' ').trim()
        var eg = listtrans.slice(1).text().trim().split("\n").map(i => {
          i = i.trim()
          const srcURLre = /[^a-zA-Z0-9-_.](https?:\/\/)?[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/gmu
          var match = i.match(srcURLre)
          if(match){match = match[0]}else{var match = ""}
          i = i.replace(srcURLre, '') + match.substring(0, 1)
          var dot = i.indexOf('.')
          if (dot >= 1) i = insertStr(i, i.indexOf('.') + 1, ' ').trim()
          return i
        }).join('\n').trim()
        var explanations = $("div.content").slice(0, 1).html().split(' ').join('').split("\n").join('').split('<br>').map(i => {
          return (insertStr(i, i.indexOf(".") + 1, " ").trim())
        }).join('\n')
        var ex = unescape(explanations.replace(/&#x/g, '%u').replace(/;/g, '')).trim()
        if (ex.indexOf("<ul>") != -1) ex = ''
        console.log(ex,eg)
        var reply = "<code>" + ex +  "</code>" + "\n\n<b>►网络释义</b>\n" + netex 
        if(eg) reply += "<b>\n\n►例句\n</b>" + eg 
        resolve(reply)
      done();
      }
    }
  })
})
  fetch.then(value => {
    return (value)
  })
}
            
              
function manchu(ctx){
  var t = ctx.message.text
  t = t.substr(7,)
  c.queue({
    uri: "http://manchu.work/dicts/search?_token=53Rv7MJZK2qwxpJe5eG5BOhozWfyKwhzJMQDzeqF&word=" + "&search_type=&type=",
    callback: function (error, res, done) {
      if (error) {
        console.log(error)
      } else {
        var $ = res.$
        var wraps = $("div.content-wrap")
        var o = []
        wraps.each((i, item) => {
      
          o[i] = $(item).children("div").text()
          o[i] += " <code>" + $(item).children("div").text() + "</code>"
          })
      
        ctx.replyWithHTML(o.join('\n'))
      }
    }
  }
  )
  
  
}

module.exports = {
  youdaom,
  manchu
}