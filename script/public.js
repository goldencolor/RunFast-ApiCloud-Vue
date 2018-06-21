var o_url = "http://card.dcwen.top/";//服务器地址

//ios 和 android 的配置
var winChange = 'push'; //窗口切换效果  ios  ripple    android movein

var systemType = $api.systemType;

if (systemType == 'ios'){

    winChange = 'movein';

}else if (systemType == 'android'){

    winChange = 'ripple';

}



//card.jsljjx.cn
//点击两次返回退出程序
//改禁止退出
function ExitApp() {
    var ci = 0;
    var time1, time2;
    api.addEventListener({
        name : 'keyback'
    });
}



//*******************************************  音乐区
var on_music = 1; //背景音乐开关
var on_voice = 1; //音效开关
var on_reg = 1; // 1为普通话  0为方言

//预设
if($api.getStorage("voice") == null || $api.getStorage("voice") == ""){
  $api.setStorage("voice",on_voice);
}else{
  on_voice = $api.getStorage("voice");
}
if($api.getStorage("music") == null || $api.getStorage("music") == ""){
  $api.setStorage("music",on_voice);
}else{
  on_music = $api.getStorage("music");
}
if($api.getStorage("reg") == null || $api.getStorage("reg") == ""){
  $api.setStorage("reg",on_reg);
}else{
  on_reg = $api.getStorage("reg");
}


//背景音乐
function music_bg(k){
  api.stopPlay();
  if($api.getStorage("music")==0){return;}
  api.startPlay({
     path: 'widget://wgt/music/bg'+k+'.mp3'
  },function(ret, err) {
    if (ret){
        music_bg(k);
    }
  });
}

//语音
function voices(src,func){
  if($api.getStorage("voice")==0){return;}
  if($api.getStorage("voice") == false){retuen;}
  $api.setStorage("voice",0)
  var audio = api.require('audio');
  audio.play({
      path: src
  },function(ret,err){
      if(ret.complete ==true){
        $api.setStorage("voice",1)
        func();
      }
  });
}

//根据男女播放打牌语音
function poker_voices(src){
  if($api.getStorage("voice")==0){return;}
  if($api.getStorage("voice") == false){retuen;}
  var sex = $api.getStorage("usersex")
  var sextext;
  if(sex == 0){
    sextext = 'g_';
  }else{
    sextext = 'b_';
  }
  console.log(sextext + src + ".mp3");
  var audio = api.require('audio');
  audio.play({
      path: 'widget://wgt/voice/' + sextext + src + ".mp3"
  });
}

//播放录音
//语音
function playvoice(src){
  $api.setStorage("voice",0)
  var netAudio = api.require('netAudio');
  netAudio.play({
      path: o_url + src
  }, function(ret, err) {
    if(ret.complete ==true){
      $api.setStorage("voice",1)
      $api.dom('#talking').style.display = "none";
    }
  });
}

//音频资源部分
//普通音效
function music_nomal(){
  if($api.getStorage("voice")==0){return;}
  if($api.getStorage("voice") == false){retuen;}
  var audio = api.require('audio');
  audio.play({
      path: 'widget://wgt/music/nomal.mp3'
  });
}
//小音效
function music_small(){
  if($api.getStorage("voice")==0){return;}
  if($api.getStorage("voice") == false){retuen;}
  var audio = api.require('audio');
  audio.play({
      path: 'widget://wgt/music/small.mp3'
  });
}
//结束音效
function music_over(){
  if($api.getStorage("voice")==0){return;}
  if($api.getStorage("voice") == false){retuen;}
  var audio = api.require('audio');
  audio.play({
      path: 'widget://wgt/music/over.mp3'
  });
}
//警告音效
function music_warning(){
  if($api.getStorage("voice")==0){return;}
  if($api.getStorage("voice") == false){retuen;}
  var audio = api.require('audio');
  audio.play({
      path: 'widget://wgt/music/warning.mp3'
  });
}

/*--------------------------------------------------------------------------*/

function sure(title,content,fun){
  //提示框
  var dialogBox = api.require('dialogBox');
  dialogBox.sendMessage({
      texts: {
          title: title,
          content: content,
          leftBtnTitle: '取消',
          rightBtnTitle: '确认'
      },
      styles: {
          bg: 'rgba(0,0,0,0.5)',
          w: 300,
          content: {
              color: '#fff',
              size: 14
          },
          left: {
              marginB: 7,
              marginL: 20,
              w: 130,
              h: 35,
              corner: 2,
              bg: '#FF8C00',
              color: '#fff',
              size: 12
          },
          right: {
              marginB: 7,
              marginL: 10,
              w: 130,
              h: 35,
              corner: 2,
              bg: '#32CD32',
              color: '#fff',
              size: 12
          }
      }
  }, function(ret) {
      dialogBox.close({
          dialogName: 'sendMessage'
      });
      if (ret.eventType == 'right') {
        fun();
      }
  });
}


/* --------------------------------------------------------------------- */

//即时通讯

var ws = new WebSocket("ws://card.dcwen.top:8282");


function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}


/* ------------------------------------------------------------------------- */

//时间戳转换
function getLocalTime(timestamp) {
    return timestampFormat( timestamp );
}
function timestampFormat( timestamp ) {
    function zeroize( num ) {
        return (String(num).length == 1 ? '0' : '') + num;
    }

    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
    var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
    var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

    if ( timestampDiff < 60 ) { // 一分钟以内
        return "刚刚";
    } else if( timestampDiff < 3600 ) { // 一小时前之内
        return Math.floor( timestampDiff / 60 ) + "分钟前";
    } else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
        return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
        if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);
        } else if ( curDate.getFullYear() == Y ) {
            return  zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return  Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        }
    }
}
