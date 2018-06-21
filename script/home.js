var app;
//页面加载完成
apiready = function(){


    //推送测试
    // api.require('tencentPush').registerPush(function(ret, err) {
    //     if (ret.status) {
    //         alert("注册成功，token为：" + ret.token);
    //     } else {
    //         alert("注册失败，错误码：" + err.code + "，错误信息：" + err.msg);
    //     }
    // });
    // // 添加本地通知
    // var tencentPush = api.require('tencentPush');
    // var params = {
    //     title: "欢迎",                           // 标题
    //     content: "欢迎来到 --  四川跑得快",                  // 内容
    //     date: "20170810",                         // 日期
    //     hour: "16",                               // 时间
    //     min: "35",                                // 分钟
    //     customContent: "{\"key\":\"value\"}",     // 自定义key-value
    //     activity: "",                             // 打开的activity
    //     ring: 1,                                  // 是否响铃
    //     vibrate: 1                                // 是否振动
    // };
    // var resultCallback = function(ret, err) {
    //     if (ret.status) {
    //         alert("添加通知成功，通知id：" + ret.notiId);
    //     } else {
    //         alert("添加本地通知失败，错误码：" + err.code + "，错误信息：" + err.msg);
    //     }
    // };
    // tencentPush.addlocalNotification(params, resultCallback);



    //vue
    app = new Vue({
      el:"#app",
      data:{
        //头像
        header: {
          backgroundImage: 'url('+$api.getStorage("useravatar")+')',
        },
        //性别 true男 false女
        sex:parseInt($api.getStorage("usersex")),
        //用户姓名
        username:$api.getStorage("username"),
        //用户ID
        userid:$api.getStorage("userid"),
        //账户余额
        money:$api.getStorage("userdiamond"),
        //广告按钮背景
        advbg:{backgroundImage:'url(../image/home_checked.png)',zIndex:'999'},
        //房间按钮背景
        roombg:{backgroundImage:'url(../image/home_uncheck.png)',zIndex:'998'},
        //滚动消息
        new_tip:"",
        //最新资讯
        news:"",
        //更多选项是否显示
        show_more:false,
        //显示新闻还是房间列表 true表示新闻
        is_news:true,
        //是否有房间列表
        hasroom:false,
        //房间列表
        roomlists:[
          //{roomid:1,rounds:10,mans:0,roomcode:'000001'},
        ],
        //没有房间列表时的提示
        roomtip:"还没有房间,快去新建房间吧!",
        //声音参数
        voice:$api.getStorage("voice"),
        music:$api.getStorage("music"),

      },
      methods:{
        //全局点击
        allclick:function(){
          this.show_more = false;
          music_nomal();
        },
        //分享房间
        shareroom:function(e){
          var room_id = e.roomid;
          $api.post(o_url + 'get_room',{
            values:{
              room_id:room_id
            }
          },function(ret){
            var roomcode = ret.msg.room_code;
            var type = "";
            switch(ret.msg.room_type){
              case "0":
                  type = "黑桃5上庄"
                  break;
              case "1":
                  type = "霸王庄"
                  break;
              case "2":
                  type = "压牌模式/随机庄"
                  break;
              case "3":
                  type = "压牌模式/霸王庄"
                  break;
            }
            var boom = "";
            switch(ret.msg.double){
              case "0":
                  boom = "不翻倍"
                  break;
              case "1":
                  boom = "翻倍"
                  break;
            }
            var title = "邀请您进入" +roomcode + "号房间!"
            var str = "类型：" + type +　"," + "炸弹：" + boom + "," + "局数：" + ret.msg.round_times + "局";

            var wx = api.require('wx');
            wx.isInstalled(function(ret, err) {
                if (ret.installed) {
                  wx.shareWebpage({
                      apiKey: '',
                      scene: 'session',
                      title: title,
                      description: str,
                      thumb : 'widget://res/iconfont-touxiang.png',
                      contentUrl: 'http://www.oumaikeji.com'
                  }, function(ret, err) {
                    if (ret.status) {
            					//alert(JSON.stringify(ret))
                      api.toast({msg:'分享成功',location:'middle'});
            				} else {
            					//alert(JSON.stringify(err))
                      api.toast({msg:'分享失败,请重试',location:'middle'});
            				}
                  });
                } else {
                    api.toast({msg:'您还未安装微信',location:'middle'});
                }
            });
          },'json');




        },
        //开关更多选项
        showmore:function(){
          var that = this;
          setTimeout(function(){
            that.show_more = true;
          },10)
        },
        //选择新闻
        checkadv:function(){
          if(this.show_more == true){app.show_more = false}
          this.is_news = true;
          this.advbg = {backgroundImage:'url(../image/home_checked.png)',zIndex:'999'};
          this.roombg = {backgroundImage:'url(../image/home_uncheck.png)',zIndex:'998'};
        },
        //选择房间
        checkroom:function(){
          if(this.show_more == true){app.show_more = false}
          this.is_news = false;
          this.roombg = {backgroundImage:'url(../image/home_checked.png)',zIndex:'999'};
          this.advbg = {backgroundImage:'url(../image/home_uncheck.png)',zIndex:'998'};
        },
        //弹出框
        newpage:function(name,url){
          if(this.show_more == true){app.show_more = false}
          api.openFrame({
              name: name,
              url: './'+url+'.html',
              rect: {
                x:0,
                y:0,
                w:'auto',
                h:'auto',
              },
              progress:{
                type:"default",
                title:"加载中",
                text:"请稍候..."
              },
              animation:{
                type:winChange,
                duration:300,
              },
              delay:100,
          });
        },
        //设置
        set:function(){
          if(this.show_more == true){app.show_more = false}
          $api.dom("#set").style.display = "block";
        },
        //获取滚动消息
        getnewtip:function(){
          $api.post(o_url + 'news_show',{
            values:{
            }
          },function(ret){
            app.new_tip = ret.msg.newsRoll;
            app.news = ret.msg.news;
          },'json');
        },
        //关闭设置
        closeme:function(){
          $api.dom("#set").style.display = "none";
        },
        //打开关闭音效
        voiceswitch:function(e){
          if(e == 1){this.voice = 0}
          else{this.voice = 1};
          $api.setStorage("voice",app.voice);
        },
        //打开关闭音乐
        musicswitch:function(e){
          if(e == 1){this.music = 0;api.stopPlay();$api.setStorage("music",app.music);}
          else{this.music = 1;$api.setStorage("music",app.music);music_bg(1);};
        },
        //切换账号
        chengeuser:function(){
          $api.clearStorage();
          api.stopPlay();
          api.openWin({
              name: '登录',
              url: '../index.html',
              slidBackEnabled:false,
              animation: {
                type:winChange,
                duration:500
              },
              slidBackEnabled:false,
              delay:100,
              reload:true
          },function(){
            api.closeWin({name:"主页"});
          });
        },
        //加入房间
        joinroom:function(id,code){
          var that = this;
          //进度框
          var t = setTimeout(function(){
            api.showProgress({
                title: '加入中',
                modal: true,
                animationType: 'zoom',
            });
          },1000)
          setTimeout(function(){
            api.hideProgress();
          },5000)
          $api.post(o_url + 'join_room',{
            values:{
              cid:$api.getStorage("token"),
              room_code:code,
            }
          },function(ret){
            clearTimeout(t);
            api.hideProgress();
            if(ret.error == 0){
              api.stopPlay();
              var roomid,gametype,isboom,gamechoice,rounds,owner;
              owner = ret.msg.start_btn;
              if(ret.msg.double == 1){
                isboom = true;
              }else {
                isboom = false;
              }
              roomid = id;
              switch(ret.msg.room_type){
                case "0":
                  gametype = 1;
                  gamechoice = 0;
                  break;
                case "1":
                  gametype = 2;
                  gamechoice = 0;
                  break;
                case "2":
                  gametype = 3;
                  gamechoice = 1;
                  break;
                case "3":
                  gametype = 3;
                  gamechoice = 2;
                  break;
              }
              rounds = ret.msg.round_times;
              api.openWin({
                  name: '游戏',
                  url: '../html/game.html',
                  animation: {
                    type:winChange,
                    duration:500
                  },
                  pageParam:{
                    roomid:roomid,
                    roomcode:code,
                    gametype:gametype,
                    isboom:isboom,
                    gamechoice:gamechoice,
                    rounds:rounds,
                    showpoker:ret.msg.showpoker,
                    owner:owner
                  },
                  slidBackEnabled:false,
                  delay:100,
                  reload:true
              });
              setTimeout(function(){
                api.closeWin({
                    name: '主页'
                });
              },2000)
            }else {
              api.toast({msg:ret.msg,location:'middle'});
            }
          },'json');
        },
      },
      watch:{
        //监听房间列表长度
        roomlists:function(n,o){
          if(n.length == 0){
            this.hasroom = false;
          }else {
            this.hasroom = true;
          }
        },
      }
    })




    //设置全屏
    api.setFullScreen({
        fullScreen: true
    });
    //设置横屏
    api.setScreenOrientation({
        orientation: 'auto_landscape'
    });
    //点击两次返回
    ExitApp();
    //IOS快速点击   andriod慎用!!
    FastClick.attach(document.body);
    //背景音乐
    music_bg(1);
    //获取滚动消息
    app.getnewtip();
    //重新加载数据
    reloaddata();
    //获取房间列表
    $api.post(o_url + 'room_page',{
      values:{
        cid:$api.getStorage('token'),
      }
    },function(ret){
      //更新信息
      app.roomlists = [];
      for(var i=0,len=ret.msg.length;i<len;i++){
        var o = {};
        o.roomid = ret.msg[i].room_id;
        o.roomcode = ret.msg[i].room_code;
        o.rounds = ret.msg[i].round_times;
        o.mans = ret.msg[i].onlineNums;
        app.roomlists.push(o);
      }
    },'json');

  
    //即时通讯
    ws.onmessage = function(e){
        // json数据转换成js对象
        var data;
        var type;
        if(isJSON(e.data)){
            data = JSON.parse(e.data);
            type=data.type;
        }
        switch(type){
            // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
            //当前客户初始化绑定
            //JSON.parse(jsonstr); //可以将json字符串转换成json对象
            //JSON.stringify(jsonobj); //可以将json对象转换成json对符串
            case 'init':
                $api.post(o_url + 'connect',{
                  values:{
                    client_id:data.client_id,
                    cid:$api.getStorage('token'),
                    type:"outter",
                  }
                },function(ret){
                  //console.log(ret.msg)
                },'json');
                break;
            case 'msg' :
                //console.log(data.msg)
                break;
            //改变房间人数
            case 'change_nums':
                app.roomlists.forEach(function(e){
                  if(parseInt(e.roomid) == parseInt(data.room_id)){
                    e.mans = data.player_nums;
                  }
                })
                break;
            //改变房间列表
            case 'rm_room':
                for(var i=app.roomlists.length-1;i>=0;i--){
                    if (app.roomlists[i].roomid == data.room_id) {
                        app.roomlists.splice(i,1);
                    }
                }
                break;
          }
      };




};

//关闭音乐
function closemusic(){
  api.stopPlay();
}
//重载数据
function reloaddata(){
  $api.post(o_url + 'player_info',{
    values:{
      cid:$api.getStorage('token'),
    }
  },function(ret){
    //保存信息
    $api.setStorage("useravatar",ret.msg.avatar);
    $api.setStorage("username",ret.msg.name);
    $api.setStorage("userid",ret.msg.player_id);
    $api.setStorage("usersex",ret.msg.sex);
    $api.setStorage("token",ret.msg.token);
    $api.setStorage("userdiamond",ret.msg.diamond);
    //更新信息
    app.money = $api.getStorage("userdiamond");
  },'json');
}
