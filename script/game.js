var recordpath;

//卡片路径
var card="../image/game/card_";
//页面加载完成
apiready = function(){

    //监听断网
    api.addEventListener({
        name:'offline'
    }, function(ret, err){
        api.toast({msg:'你的网络断开了',location:'middle'});
    });
    api.addEventListener({
        name:'online'
    }, function(ret, err){
        api.toast({msg:'已重新连接到网络',location:'middle'});
        api.stopPlay();
            var ws = new WebSocket("ws://card.dcwen.top:8282");
            ws.close();
            api.openWin({
                name: '主页',
                url: '../html/home.html',
                animation: {
                  type:winChange,
                  duration:500
                },
                slidBackEnabled:false,
                delay:100,
                reload:true,
            });
            setTimeout(function(){
              api.closeWin({
                  name: '游戏'
              });
            },2000)
    });

    //fs 文件操作模块
    var fs = api.require('fs');

    //Vue
    var app = new Vue({
      el:"#app",
      data:{
        //是否是观战
        iswatch:false,
        //client_id
        client_id:"",
        //开始按钮状态  0-隐藏  1-未准备  2-可开始
        canstart:0,
        //广告 --- 桌面背景
        adbg:{
          backgroundImage:"url(../image/game/game_bg.png)"
        },
        //广告 --- 牌背面
        adback:"../image/game/card_back1.png",
        //声音参数
        voice:$api.getStorage("voice"),
        music:$api.getStorage("music"),
        putonghua:1,// 1普通话 0方言
        voiceson:false,//是否展开预置语音文件
        //游戏是否进行中...
        start:false,
        //是否是结束画面
        isend:false,
        //是否是最终局结束画面
        isover:false,
        //最终局的样式class
        isoverclass:"",//isoverclass 表示最终局效果
        //当局游戏参数
        gameinfo:{
          gametype:"",  //游戏类型   1.黑桃5上庄  2.霸王庄  3.瞎子模式
          isboom:"", //炸弹翻倍   true 翻倍    false 不翻倍
          gamechoice:"", //游戏选择   1.随机庄     2.霸王庄
          onoff:true,//开关  true 开   false 关
          roomid:"",//房间ID
          roomcode:"",//房间号
          rounds:"",//总局数
          round:"",//当前局
          double:1,//当前倍率
          booms:"",//炸弹数量
          endround:"../image/game/gameend_1.png",//当前局数图片
          showpoker:"",//是否显示手牌  1.显示  2.不显示
        },
        isfinal:false,//是否是最终局
        //设置区域
        setting:{
          onoff:false,//开关   true 开    false 关
        },
        //游戏准备区域
        ready:{
          isready:false, //是否准备了
          isstart:false, //是否可以开始游戏
          tip:"等待其他玩家",//准备游戏区域提示
        },
        //录音时间
        recordTime:"",
        //是否在录音
        isrecord:false,
        //等待的玩家
        waits:[
          //{id:"1",header:"../image/home_header.jpg",name:"某某某啊大多数",isready:false,isagree:true},
        ],
        //游戏设置
        gamesetting:{
          isshow:false,
        },


        //是否出牌中
        isout:false,
        //该谁出牌
        whoout:"null",// up 上   left左  right右   down自己
        //我的手牌  !!!!!!!!!!!!!!!!!!
        mypoker:[
           //{id:0,src:card+0+'.png',selected:false},
          // {id:1,src:card+1+'.png',selected:false},
          // {id:2,src:card+2+'.png',selected:false},
          // {id:3,src:card+3+'.png',selected:false,first:true},
        ],
        //出牌
        outpoker:[
        ],
        //手牌偏移值
        pyz:"9%",
        //4位玩家的信息
        allplayer:[
          {
            order:1,//打牌顺序 1表示自己 2表示右边 3表示上边 4表示左边
            header:"../image/home_header.jpg",//玩家头像
            name:"加载中",//玩家姓名
            pokers:10,//剩余牌数
            score:"加载中",//当前积分
            cid:"",//用户id
            lineorder:"",//线上顺序
            scorenow:"0",//当局积分
            pokersarr:"",
          },
          {
            order:2,//打牌顺序 1表示自己 2表示右边 3表示上边 4表示左边
            header:"../image/home_header.jpg",//玩家头像
            name:"加载中",//玩家姓名
            pokers:10,//剩余牌数
            score:"加载中",//当前积分
            pokersarr:[{},{},{},{},{},{},{},{},{},{}],
            cid:"",//用户id
            lineorder:"",//线上顺序
            scorenow:"0",//当局积分
          },
          {
            order:3,//打牌顺序 1表示自己 2表示右边 3表示上边 4表示左边
            header:"../image/home_header.jpg",//玩家头像
            name:"加载中",//玩家姓名
            pokers:10,//剩余牌数
            score:"加载中",//当前积分
            pokersarr:[{},{},{},{},{},{},{},{},{},{}],
            cid:"",//用户id
            lineorder:"",//线上顺序
            scorenow:"0",//当局积分
          },
          {
            order:4,//打牌顺序 1表示自己 2表示右边 3表示上边 4表示左边
            header:"../image/home_header.jpg",//玩家头像
            name:"加载中",//玩家姓名
            pokers:10,//剩余牌数
            score:"加载中",//当前积分
            pokersarr:[{},{},{},{},{},{},{},{},{},{}],
            cid:"",//用户id
            lineorder:"",//线上顺序
            scorenow:"0",//当局积分
          },
        ],
        //结算页面展示信息
        endinfo:[
          // {
          //
          //   name:"加载中",//玩家姓名
          //   score:"加载中",//当前积分
          //   scorenow:"0",//当局积分
          // },
        ],
        //动画提示类型
        animatetip:"",
        //压牌
        backpoker:[
          // {id:0,src:card+0+'.png'},
          // {id:0,src:card+0+'.png'},
          // {id:0,src:card+0+'.png'},
          // {id:0,src:card+0+'.png'},
        ],
        //是否压牌
        isback:false,
        //出牌按钮单次点击
        outonetime:true,
        //过和春天的样式切换
        passanimatestyle:{}, //上面是过牌  下面是报单
        // {
        //   width:'8%',
        //   height:'15%',
        //   position: 'absolute',
        //   z-index: '99999',
        //   display:'none',
        // },
        // {
        //   width:'16%',
        //   height:'11%',
        //   position: 'absolute',
        //   z-index: '99999',
        //   display:'none',
        // }
        //是否正在播放预置录音中
        isplayaudio:false,
        //解散房间的提示
        cleartip:"",
        //解散房间的间隔
        cleartime:false,
        //滑动选择起点
        siliderstart:0,
        //滑动选择终点
        siliderend:0,
        //是否为touch事件
        istouch:false,
        //提示出牌的总数组
        tippoker:"",
        //提示出牌的下标
        tippokerindex:0,
      },
      methods:{
        //房主点击开始游戏
        ownerstartgame:function(){
          var that = this;
          //进度框
          var t = setTimeout(function(){
            api.showProgress({
                title: '游戏开始中',
                modal: true,
                animationType: 'zoom',
            });
          },1000)
          setTimeout(function(){
            api.hideProgress();
          },5000)
          $api.post(o_url + 'start_game',{
            values:{
              cid:$api.getStorage("token"),
              room_id:app.gameinfo.roomid,
            }
          },function(ret){
            clearTimeout(t);
            api.hideProgress();
            if(ret.error == 1){
              api.toast({msg:ret.msg,location:'middle'});
            }else {
              that.canstart = 0;
            }
          },'json');
        },
        //获取提示
        gettips:function(){
          var that = this;
          that.mypoker.forEach(function(e){
            e.selected = false;
          })
          var newarr = JSON.stringify(this.tippoker[this.tippokerindex])
          newarr = newarr.replace('[',"")
          newarr = newarr.replace(']',"")
          var arr = newarr.split(",");
          for(var i=0,len=arr.length;i<len;i++){
            that.mypoker.forEach(function(e){
              if(e.id == arr[i]){
                e.selected = true;
                if($api.dom('#firstpoker') != null){
                  $api.dom('#firstpoker').style.top = "-60%";
                }
              }
            })
          }

          this.tippokerindex++;
          if(this.tippokerindex == this.tippoker.length){
            this.tippokerindex = 0;
          }
        },
        //touch牌的事件
        touchstart:function(e){
          this.siliderstart = e.touches[0].screenX;
          $api.dom('.silidertip').style.display = "block";
        },
        //touch牌的事件
        touch:function(e){
          var min = $api.dom('#down').offsetLeft;
          var max = min + $api.dom('#down').clientWidth;
          this.istouch = true;
          this.siliderend = e.touches[0].screenX;
          if(this.siliderend >= max){
            this.siliderend = max;
          }else if(this.siliderend <= min){
            this.siliderend = min;
          }
          $api.dom('.silidertip').style.width = Math.abs(this.siliderstart - this.siliderend) + 'px';
          if(this.siliderstart > this.siliderend){
            $api.dom('.silidertip').style.left = this.siliderend + 'px'
          }else {
            $api.dom('.silidertip').style.left = this.siliderstart + 'px';
          }
        },
        //touch牌的事件
        touchend:function(e){
          $api.dom('.silidertip').style.display = "none";
          $api.dom('.silidertip').style.width = "0";
          if(this.istouch == false){return;}
          var that = this;
          var allpoker = $api.domAll('.nowmypoker');
          var father = $api.dom('.poker').offsetLeft;
          var grand = $api.dom('#down').offsetLeft;
          for(var i=0,len=allpoker.length;i<len;i++){
            var left = grand  + allpoker[i].offsetLeft;
            var width = allpoker[i].clientWidth/2;
            var right = left + width;
            if((right > that.siliderstart && left < that.siliderend)||(left < that.siliderstart && right > that.siliderend)){
                that.mypoker.forEach(function(e){
                  if(e.id == allpoker[i].id){
                    e.selected = !e.selected;
                    if($api.dom('#firstpoker') != null){
                      if($api.dom('#firstpoker').style.top == "-40%" && e.first == true || e.first == true && $api.dom('#firstpoker').style.top == ""){
                        $api.dom('#firstpoker').style.top = "-60%";
                      }else if($api.dom('#firstpoker').style.top == "-60%" && e.first == true){
                        $api.dom('#firstpoker').style.top = "-40%";
                      }
                    }
                  }
                })
            }
          }
          this.istouch = false;
        },
        //全局点击
        allclick:function(){
          setTimeout(function(){
            api.closeFrame({
                name: '游戏详情'
            });
          },80)
          $api.dom(".setting").style.right = "-100px";
          $api.dom(".game-set").style.transform = "rotate(180deg)";
          $api.dom(".records").style.right = "-100%";
        },
        //分享结果
        shareresulit:function(){
          var wx = api.require('wx');
          var text = "";
          this.endinfo.forEach(function(e){
            text = text  +e.name + ": " + e.score + "\n\r";
          })
          wx.shareText({
              apiKey: '',
              scene: 'session',
              text: text
          }, function(ret, err) {
              if (ret.status) {
                  api.toast({msg:'分享成功',location:'middle'});
              } else {
                  api.toast({msg:'分享失败',location:'middle'});
              }
          });
        },
        //分享房间
        shareroom:function(){
          var room_id  = this.gameinfo.roomid;
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
        //选牌
        choicepoker:function(e){
          if($api.dom('#firstpoker') != null){
            if($api.dom('#firstpoker').style.top == "-40%" && e.first == true || e.first == true && $api.dom('#firstpoker').style.top == ""){
              $api.dom('#firstpoker').style.top = "-60%";
            }else if($api.dom('#firstpoker').style.top == "-60%" && e.first == true){
              $api.dom('#firstpoker').style.top = "-40%";
            }
          }

          for(var i=0,len=this.mypoker.length;i<len;i++){
            if(e.id == this.mypoker[i].id){
              this.mypoker[i].selected = !this.mypoker[i].selected;
            }
          }
        },
        //出牌
        surepoker:function(){
          if(this.outonetime == false){return}
          this.outonetime = false;
          var that = this;
          setTimeout(function(){
            that.outonetime = true;
          },1000)
          var that = this;
          var outer = {};
          var index = 0;
          for(var i=this.mypoker.length;i>0;i--){
            if(this.mypoker[i-1].selected == true){
              outer[index] = this.mypoker[i-1].id;
              index++;
            }
          }
          var outerstr = $api.jsonToStr(outer)
          //进度框
          var t = setTimeout(function(){
            api.showProgress({
                title: '出牌中',
                modal: true,
                animationType: 'zoom',
            });
          },1000)
          setTimeout(function(){
            api.hideProgress();
          },5000)
          $api.post(o_url + 'send_card',{
            values:{
              cid:$api.getStorage("token"),
              room_id:that.gameinfo.roomid,
              card_arr_id:outerstr,
            }
          },function(ret){
            clearTimeout(t);
            api.hideProgress();
            if(ret.error == 0){
              that.outpoker = [];
              $api.dom("#out").className = 'downout';
              for(var i=that.mypoker.length;i>0;i--){
                if(that.mypoker[i-1].selected == true){
                  that.outpoker.push(that.mypoker[i-1]);
                  that.mypoker.splice(i-1,1);
                }
              }
              that.outpoker.reverse();
            }else {
              api.toast({msg:ret.msg,location:'middle'});
            }
          },'json');

        },
        //开始游戏
        startgame:function(){
          var arr = this.mypoker;
          this.pokeranimate(arr);
        },
        //发牌动画
        pokeranimate:function(arr){
          app.outpoker = [];
          app.backpoker = [];
          app.isend = false;
          if(this.gameinfo.gametype == 3){
            this.isback = true;
          }
          var n = 0;
          var that = this;
          this.allplayer[1].pokersarr = [];
          this.allplayer[2].pokersarr = [];
          this.allplayer[3].pokersarr = [];
          this.mypoker = [];
          var inter = setInterval(function(){
            that.start = true;
            var nullobj = {};
            that.allplayer[1].pokersarr.push(nullobj);
            that.allplayer[2].pokersarr.push(nullobj);
            that.allplayer[3].pokersarr.push(nullobj);
            that.mypoker.push(arr[n]);
            n++;
            if(n >= 10){
              clearInterval(inter);
            }
            if(n <= 4 ){
              var o = {};
              o.src = that.adback;
              that.backpoker.push(o)
            }
          },100)
        },
        //展示当局游戏的信息
        showGameTip:function(){
            setTimeout(function(){
              api.openFrame({
                  name: "游戏详情",
                  url: './gameinfo.html',
                  rect: {
                    x:10,
                    y:30,
                    w:160,
                    h:240,
                  },
                  progress:{
                    type:"default",
                    title:"加载中",
                    text:"请稍候..."
                  },
                  animation:{
                    type:winChange
                  },
                  pageParam:{
                    gametype:app.gameinfo.gametype,
                    isboom:app.gameinfo.isboom,
                    gamechoice:app.gameinfo.gamechoice,
                    showpoker:app.gameinfo.showpoker,
                  },
              });
            },100)
        },
        //设置区域出入
        showSetting:function(){
          var that = this;
          setTimeout(function(){
            $api.dom(".records").style.right = "-100%";
            that.voiceson = false;
            $api.dom(".setting").style.right = 0;
            $api.dom(".game-set").style.transform = "rotate(0deg)";
          },10)
        },
        //关闭设置区域
        closeSetting:function(){
          var that = this;
          setTimeout(function(){
            $api.dom(".setting").style.right = "-100%";
            $api.dom(".game-set").style.transform = "rotate(180deg)";
          },10)
        },
        //录音
        recording:function(){
          this.recordTime = new Date();
          this.isrecord = true;
          setTimeout(function(){
            var el = $api.dom("#recordbg");
            $api.attr(el,'class','bg');
          },10)
          var name = Date.parse(new Date());
          var audioRecorder = api.require('audioRecorder');
          recordpath = 'fs://recorder/'+name+'.pcm';
          audioRecorder.startRecord({
              channel:2,
              sampleRates:16000,
              savePath:'fs://recorder/'+name+'.pcm',
              format:'pcm'
          }, function(ret, err){
              //alert(JSON.stringify(ret));
          });
        },
        //停止录音
        stoprecord:function(){
          var that = this;
          this.recordTime = new Date() - this.recordTime;
          this.isrecord = false;
          var el = $api.dom("#recordbg");
          $api.attr(el,'class','');
          if(this.recordTime < 1000){
            api.toast({msg:'录音时间太短',location:'middle'});
            return;
          }else if(this.recordTime > 60000){
            api.toast({msg:'录音时间超过60s',location:'middle'});
            return;
          }else {
            var audioRecorder = api.require('audioRecorder');
            audioRecorder.stopRecord(function(ret){
                if (ret.status == true) {
                    var path = recordpath;
                    var audioRecorder = api.require('audioRecorder');
                    var name = Date.parse(new Date());
                    audioRecorder.covertToMp3({
                              channel:2,
                              sampleRates:16000,
                              quality:9,
                              originalFilePath: path,
                              mp3FilePath: 'fs://recorder/'+name+'.mp3'
                    }, function(ret) {
                      // fs.remove({
                      //     path: path
                      // });
                      api.ajax({
                          url: o_url + 'save_radio',
                          method: 'post',
                          data: {
                              values: {
                                  room_id:that.gameinfo.roomid,
                                  cid:$api.getStorage("token"),
                              },
                              files: {
                                  radio: 'fs://recorder/'+name+'.mp3'
                              }
                          }
                      }, function(ret) {
                        //
                        // fs.remove({
                        //     path: 'fs://recorder/'+name+'.mp3'
                        // });
                      });
                    });




                    // voices(path,function(){
                    //   setTimeout(function(){
                    //     fs.remove({
                    //         path: path
                    //     }, function(ret, err) {
                    //         if (ret.status) {
                    //
                    //         }
                    //     });
                    //   },3000)
                    // });
                }
            });

          }
        },
        //确认解散房间
        agreeclear:function(k){
          var that = this;
          var type = "";
          if(k==0){
            type = 'no';
          }else {
            type = 'yes';
          }
          $api.post(o_url + 'del_room',{
            values:{
              cid:$api.getStorage("token"),
              room_id:that.gameinfo.roomid,
              answer_type:type
            }
          },function(ret){
            //alert(JSON.stringify(ret));
            if(ret.error == 0){
              $api.dom("#clear-left").style.display = 'none';
              $api.dom("#clear-right").style.display = 'none';
            }
          },'json')
        },
        //解散房间
        outgame:function(){
          if(this.cleartime == true){
            api.toast({msg:'不要操作太频繁哦!',location:'middle'});
            return;
          }
          setTimeout(function(){
            app.cleartime = true;
          },10000)
          var that = this;
          $api.post(o_url + 'alert_agree',{
            values:{
              cid:$api.getStorage("token"),
              room_id:that.gameinfo.roomid
            }
          },function(ret){
              if(ret.msg == 'lt_one'){
                sure('解散房间','确定要解散房间吗?',function(){
                  //进度框
                  var t = setTimeout(function(){
                    api.showProgress({
                        title: '解散中',
                        modal: true,
                        animationType: 'zoom',
                    });
                  },1000)
                  setTimeout(function(){
                    api.hideProgress();
                  },5000)
                  $api.post(o_url + 'del_room',{
                    values:{
                      cid:$api.getStorage("token"),
                      room_id:that.gameinfo.roomid,
                    }
                  },function(ret){
                    clearTimeout(t);
                    api.hideProgress();
                    api.toast({msg:ret.msg,location:'middle'});
                    if(ret.error == 0){
                      api.stopPlay();
                      api.openWin({
                          name: '主页',
                          url: '../html/home.html',
                          animation: {
                            type:winChange,
                            duration:500
                          },
                          slidBackEnabled:false,
                          delay:100,
                          reload:true
                      });
                      setTimeout(function(){
                        api.closeWin({
                            name: '游戏'
                        });
                      },2000)
                    }
                  },'json')
                })
              }else if(ret.msg == 'ok'){
                //启动定时
                var data = '{"type":"del_room","room_id":'+that.gameinfo.roomid+',"cid":"'+ $api.getStorage("token") +'"}';
                ws.send(data)
              }else if(ret.error != 0){
                api.toast({msg:ret.msg,location:'middle'});
              }
          },'json')
        },
        //退出房间
        outroom:function(){
          sure('离开房间','确定要离开房间吗?',function(){
            api.stopPlay();
            ws.close();
            api.openWin({
                name: '主页',
                url: '../html/home.html',
                animation: {
                  type:winChange,
                  duration:500
                },
                slidBackEnabled:false,
                delay:100,
                reload:true,
            });
            setTimeout(function(){
              api.closeWin({
                  name: '游戏'
              });
            },2000)
          });
        },
        //玩家准备
        readygame:function(){
          var that = this;
          if(this.ready.isready == true){return}
          var that = this;
          //进度框
          var t = setTimeout(function(){
            api.showProgress({
                title: '准备中',
                modal: true,
                animationType: 'zoom',
            });
          },1000)
          setTimeout(function(){
            api.hideProgress();
          },5000)
          $api.post(o_url + 'connect',{
            values:{
              client_id:that.client_id,
              cid:$api.getStorage('token'),
              type:"inner",
              room_id:that.gameinfo.roomid,
            }
          },function(ret){
            clearTimeout(t);
            api.hideProgress();
            if(ret.error == 0){
              //加入房间
              that.waits = [];
              var selfs = {};
              selfs.id = ret.msg.self.player_id;
              selfs.header = ret.msg.self.avatar;
              selfs.name = ret.msg.self.name;
              selfs.isready = true;
              that.waits.push(selfs);
              for(var key in ret.msg.others){
                var other = {};
                other.id = ret.msg.others[key].player_id;
                other.header = ret.msg.others[key].avatar;
                other.name = ret.msg.others[key].name;
                if (ret.msg.others[key].is_prepare == 'no'){
                  other.isready = true;
                }else {
                  other.isready = true;
                }
                that.waits.push(other);
              }
              that.waits[0].isready = true;
              that.ready.isready = true;

                if(ret.msg.type == 'turn_back'){
                  app.canstart = 0;
                  app.start = true;
                  app.mypoker = [];
                  ret.msg.my_card_now.card.forEach(function(e,i){
                    var obj = {};
                    obj.id = e;
                    obj.src = card+e+'.png';
                    obj.selected = false;
                    if(ret.msg.my_card_now.first_card_id === e){
                      obj.first = true;
                    }else{
                      obj.first = false;
                    }
                    app.mypoker.push(obj);
                  })

                  app.gameinfo.round = ret.msg.round_times;
                  app.gameinfo.double = ret.msg.bombs;
                  var all = ret.msg.all_player_info;
                  for(var i in all){
                    if(all[i].player_id == ret.msg.self_id){
                      app.allplayer = [];
                      var obj = {};
                      obj.order = 1;
                      obj.cid = ret.msg.self_id;
                      obj.header = all[i].player_avatar;
                      obj.name = all[i].player_name;
                      obj.pokers = all[i].card_nums;
                      obj.score = all[i].round_score;
                      obj.lineorder = all[i].player_order;
                      app.allplayer.push(obj);
                    }
                  }
                  for(var i in all){
                    if(all[i].player_order == app.allplayer[0].lineorder+1 || all[i].player_order == app.allplayer[0].lineorder-3){
                      var obj = {};
                      obj.score = all[i].round_score;
                      obj.order = 2;
                      obj.cid = all[i].player_id;
                      obj.header = all[i].player_avatar;
                      obj.name = all[i].player_name;
                      obj.pokers = all[i].card_nums;
                      var len = all[i].card_nums;
                      obj.pokersarr = [];
                      for(var j=0;j<len;j++){
                        var o = {};
                        obj.pokersarr.push(o);
                      }
                      obj.lineorder = all[i].player_order;
                      app.allplayer.push(obj);
                    }
                  }
                  for(var i in all ){
                    if(all[i].player_order == app.allplayer[0].lineorder+2 || all[i].player_order == app.allplayer[0].lineorder-2) {
                      var obj = {};
                      obj.order = 3;
                      obj.cid = all[i].player_id;
                      obj.header = all[i].player_avatar;
                      obj.name = all[i].player_name;
                      obj.pokers = all[i].card_nums;
                      var len = all[i].card_nums;
                      obj.pokersarr = [];
                      for(var j=0;j<len;j++){
                        var o = {};
                        obj.pokersarr.push(o);
                      }
                      obj.score = all[i].round_score;
                      obj.lineorder = all[i].player_order;
                      app.allplayer.push(obj);
                    }
                  }
                  for(var i in all){
                    if(all[i].player_order == app.allplayer[0].lineorder+3 || all[i].player_order == app.allplayer[0].lineorder-1){
                      var obj = {};
                      obj.order = 4;
                      obj.cid = all[i].player_id;
                      obj.header = all[i].player_avatar;
                      obj.name = all[i].player_name;
                      obj.pokers = all[i].card_nums;
                      var len = all[i].card_nums;
                      obj.pokersarr = [];
                      for(var j=0;j<len;j++){
                        var o = {};
                        obj.pokersarr.push(o);
                      }
                      obj.score = all[i].round_score;
                      obj.lineorder = all[i].player_order;
                      app.allplayer.push(obj);
                    }
                  }

                  var r = ret.msg.round_times;
                  app.gameinfo.round = r;

                  var cards = ret.msg.last_player_card;
                  var zhuang = ret.msg.zhuang_card;
                  app.outpoker = [];
                  for(var i in cards){
                    var obj = {};
                    obj.id = cards[i];
                    if(cards[i] === zhuang){
                      obj.first = true;
                    }
                    obj.src = card + cards[i] + '.png';
                    app.outpoker.push(obj);
                  }

                  var id = ret.msg.last_player_id;
                  for(var i=0;i<4;i++){
                    if(app.allplayer[i].cid== id){
                      switch(app.allplayer[i].order){
                        case 1:
                            $api.dom("#out").className = 'downout';
                            break;
                        case 2:
                            $api.dom("#out").className = 'rightout';
                            break;
                        case 3:
                            $api.dom("#out").className = 'upout';
                            break;
                        case 4:
                            $api.dom("#out").className = 'leftout';
                            break;
                      }
                    }
                  }
                  setTimeout(function(){
                    if(app.gameinfo.gametype == 3){
                      app.isback = true;
                      for(var i=0;i<4;i++){
                        var obj = {src:app.adback};
                        app.backpoker.push(obj);
                      }
                    }
                    app.allplayer.forEach(function(e){
                      if(e.lineorder == ret.msg.first_order ){
                        switch(e.order){
                          case 1:
                              app.whoout = 'downouttip';
                              app.isout = true;
                              break;
                          case 2:
                              app.whoout = 'rightouttip';
                              app.isout = false;
                              break;
                          case 3:
                              app.whoout = 'upouttip';
                              app.isout = false;
                              break;
                          case 4:
                              app.whoout = 'leftouttip';
                              app.isout = false;
                              break;
                        }
                      }
                    })
                  },500)
                  return;
                }
            }else {
              api.toast({msg:ret.msg,location:'middle'});
            }
          },'json');
        },
        //弹出游戏设置
        showgameset:function(){
          this.gamesetting.isshow = true;
        },
        //关闭游戏设置
        closegameset:function(){
          this.gamesetting.isshow = false;
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
          else{this.music = 1;$api.setStorage("music",app.music);music_bg(2);};
        },
        //语言选择
        voicechoose:function(str){
          if(str == "方言"){
            app.putonghua = 0;
          }else if (str == "普通话"){
            app.putonghua = 1;
          }
        },
        //展示预设语音文件
        showvoices:function(){
          setTimeout(function(){
            $api.dom(".setting").style.right = "-100px";
            $api.dom(".game-set").style.transform = "rotate(180deg)";
            $api.dom(".records").style.right = "0";
          },10)
        },
        //动画提示效果
        animating:function(e){
          switch(e){
            case '炸弹':
                this.animatetip = "../image/game/game_boom.png";
                if(app.isplayaudio == true){return;}
                poker_voices('zd');
              break;
            case '春天':
                this.animatetip = "../image/game/game_spring.png";
              break;
            case '顺子':
                this.animatetip = "../image/game/game_order.png";
                if(app.isplayaudio == true){return;}
                poker_voices('lz');
              break;
            case '飞机':
                this.animatetip = "../image/game/game_plane.png";
                if(app.isplayaudio == true){return;}
                poker_voices('fj')
                break;
            case '连对':
                this.animatetip = "../image/game/game_ld.png";
                if(app.isplayaudio == true){return;}
                poker_voices('ld')
                break;
          }

          $api.dom("#animate").style.display="block";
          setTimeout(function(){
            $api.dom("#animate").className = 'animated bounceIn';
          },10)
          setTimeout(function(){
            $api.dom("#animate").className = 'animated fadeOut';
          },1000)
          setTimeout(function(){
            $api.dom("#animate").className = "";
            $api.dom("#animate").style.display="none";
          },2000)
        },
        //过牌动画
        passanimate:function(k){
          $api.dom("#passanimate").style.display="block";
            poker_voices('pass');
            switch(k){
              case 1:
                  $api.dom("#passanimate").className = 'animated bounceIn passbottom';
                  break;
              case 2:
                  $api.dom("#passanimate").className = 'animated bounceIn passright';
                  break;
              case 3:
                  $api.dom("#passanimate").className = 'animated bounceIn passtop';
                  break;
              case 4:
                  $api.dom("#passanimate").className = 'animated bounceIn passleft';
                  break;
            }
            setTimeout(function(){
              $api.dom("#passanimate").className = 'animated fadeOut';
              $api.dom("#passanimate").style.display="none";
            },1400)
        },
        //播放预置语音
        playvoice:function(n){
          setTimeout(function(){
            $api.dom(".records").style.right = "-100%";
          },100)
          if(this.isplayaudio == true){
            api.toast({msg:"别着急,歇息一会儿",location:'middle'});
            return;
          }
          this.isplayaudio = true;
          var that = this;
          setTimeout(function(){
            that.isplayaudio = false;
          },5000)
          this.showvoices();
          var data = '{"type":"voice","cid":"'+ this.allplayer[0].cid +'","sex":'+ $api.getStorage("usersex") +',"room_id":'+ this.gameinfo.roomid +',"vid":'+ n +'}';
          ws.send(data);
        },
        //结算页面点击继续
        gamegoon:function(){

          if(app.waits[0].isready == true){
            api.toast({msg:"您已经准备了",location:'middle'});
            return;
          }
          app.waits[0].isready = true;
          $api.post(o_url + 'prepare',{
            values:{
              cid:$api.getStorage("token"),
              room_id:app.gameinfo.roomid,
            }
          },function(ret){
            if(ret.msg == 'ok'){
              app.waits[0].isready = true;
            }else if(ret.error == 1){
              app.waits[0].isready = false;
            }
          },'json');
        },
      },
      watch:{
          //监听手牌张数 调整位置居中
          mypoker:function(n,o){
            this.pyz = 9 - (n.length - 10)*3 + "%";
          },
          //监听当前对局是否是最后一局
          gameinfo: {
            handler: function (newVal) {
              if(newVal.rounds == newVal.round){
                  app.isfinal = true;
              }
            },
            deep: true
          },
      }
    })


    //沉浸式体验
    // var sj = document.querySelector('#app');
    // $api.fixStatusBar(sj);

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
    music_bg(2);
    //获取房间信息
    app.gameinfo.roomid = api.pageParam.roomid;
    app.gameinfo.roomcode = api.pageParam.roomcode;
    app.gameinfo.gametype = api.pageParam.gametype;
    app.gameinfo.isboom = api.pageParam.isboom;
    app.gameinfo.gamechoice = api.pageParam.gamechoice;
    app.gameinfo.rounds = api.pageParam.rounds;
    app.gameinfo.showpoker = api.pageParam.showpoker;
    var owner = api.pageParam.owner;
    if(owner == true){
      app.canstart = 2;
    }else {
      app.canstart = 0;
    }
    //获取牌面和桌面
    $api.post(o_url + 'table_card_pic',{
      values:{
      }
    },function(ret){
       app.adback= o_url + ret.msg.card_pic;
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
        if(data.client_id){
          app.client_id = data.client_id;
        }
        switch(type){

            // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
            //当前客户初始化绑定
            //JSON.parse(jsonstr); //可以将json字符串转换成json对象
            //JSON.stringify(jsonobj); //可以将json对象转换成json对符串
            case 'init':
                $api.post(o_url + 'inner_room',{
                  values:{
                    client_id:data.client_id,
                    cid:$api.getStorage("token"),
                    room_id:app.gameinfo.roomid,
                  }
                },function(ret){
                  if(ret.error == 1){
                    api.toast({msg:ret.msg,location:'middle'});
                  }else if(ret.msg.ajax_type == 'show_ready_player'){

                    var obj = ret.msg.all_ready_people;
                    //{id:"1",header:"../image/home_header.jpg",name:"某某某啊大多数",isready:false,isagree:true},
                    for(var key in obj){
                      var player = {};
                      player.id = obj[key].player_id;
                      player.header = obj[key].avatar;
                      player.name = obj[key].name;
                      player.isready = true;
                      app.waits.push(player);
                    }
                  }else if(ret.msg.ajax_type == 'start_connect'){
                    app.readygame();
                  }else if(ret.msg.ajax_type == 'show_game_info'){
                    app.canstart = 0;
                    var all_p = ret.msg.prepare_player_info;
                    for(var key in all_p){
                      var other = {};
                      other.id = all_p[key].player_id;
                      other.header = all_p[key].avatar;
                      other.name = all_p[key].name;
                      if (all_p[key].is_prepare == 'no'){
                        other.isready = true;
                      }else {
                        other.isready = true;
                      }
                      app.waits.push(other);
                    }
                    setTimeout(function(){
                      $api.dom('.record').style.display = "none";
                      $api.dom('.record2').style.display = "none";
                      $api.dom('.watchgame').style.display = "block";
                      app.iswatch = true;
                    },50)
                    app.start = true;
                    var all = ret.msg.all_player_info;
                    for(var key in all){
                      var i = all[key].player_order;
                      app.allplayer[i].lineorder = all[key].player_order;
                      app.allplayer[i].order = i+1;
                      app.allplayer[i].header = all[key].player_avatar;
                      app.allplayer[i].name = all[key].player_name;
                      app.allplayer[i].pokers = all[key].card_nums;
                      app.allplayer[i].score = all[key].round_score;
                      app.allplayer[i].pokersarr = [];
                      for(var j=0,len=all[key].card_nums;j<len;j++){
                        var obj = {src:app.adback};
                        if(i == 0){
                          app.mypoker.push(obj)
                        }else{
                          app.allplayer[i].pokersarr.push(obj)
                        }
                      }
                      app.allplayer[i].cid = all[key].player_id;

                    }

                    app.gameinfo.round = ret.msg.round_times;
                    app.gameinfo.double = ret.msg.bombs;

                    var cards = ret.msg.last_player_card;
                    app.outpoker = [];
                    for(var i in cards){
                      var obj = {};
                      obj.id = cards[i];
                      obj.src = card + cards[i] + '.png';
                      app.outpoker.push(obj);
                    }

                    var id = ret.msg.last_player_id;
                    for(var i=0;i<4;i++){
                      if(app.allplayer[i].cid== id){
                        switch(app.allplayer[i].order){
                          case 1:
                              $api.dom("#out").className = 'downout';
                              break;
                          case 2:
                              $api.dom("#out").className = 'rightout';
                              break;
                          case 3:
                              $api.dom("#out").className = 'upout';
                              break;
                          case 4:
                              $api.dom("#out").className = 'leftout';
                              break;
                        }
                      }
                    }

                  }
                },'json');
                break;
            //别人进入房间
            case 'add_player':
                var newp = {};
                newp.id = data.player_id;
                newp.header = data.avatar;
                newp.name = data.name;
                newp.isready = true;
                app.waits.push(newp);
                app.waits.forEach(function(e){
                  if(e.id == newp.id){
                    var doms = $api.domAll('.herder-border');
                    if(doms.length > 0){
                      app.allplayer.forEach(function(ele){
                        if(newp.id == ele.cid){
                          var index = ele.order - 1;
                          $api.attr(doms[index],'class','');
                          $api.attr(doms[index],'class','herder-border');
                        }
                      })
                    }
                  }
                })
                api.toast({msg:"玩家"+newp.name+"上桌啦",location:'middle'});
                break;
            //别人离开房间
            case 'rm_player':
                for(var i=app.waits.length-1;i>=0;i--){
                  if(app.waits[i].id == data.data.player_id){
                    var doms = $api.domAll('.herder-border');
                    if(doms.length > 0){
                      app.allplayer.forEach(function(e){
                        if(app.waits[i].id == e.cid){
                          var index = e.order - 1;
                          $api.attr(doms[index],'class','herder-border offline');
                        }
                      })
                    }
                    api.toast({msg:"玩家"+app.waits[i].name+"离开房间",location:'middle'});
                    app.waits.splice(i,1);
                  }
                }
                break;
            //房间被解散
            case 'warning':
                  sure('解散房间','房主已经解散房间,确定退出吗?',function(){
                        api.stopPlay();
                        api.openWin({
                            name: '主页',
                            url: '../html/home.html',
                            animation: {
                              type:winChange,
                              duration:500
                            },
                            slidBackEnabled:false,
                            delay:100,
                            reload:true
                        });
                        setTimeout(function(){
                          api.closeWin({
                              name: '游戏'
                          });
                        },2000)
                  });
                break;
            //有人准备了
            case 'ready_player':
                app.waits.forEach(function(e){
                  if(e.id == data.cid){
                    e.isready = true;
                  }
                })
                break;
            //开始游戏
            case 'start_game':
                app.mypoker = [];
                for(var i=0,len=data.card.length;i<len;i++){
                  var obj = {};
                  obj.id = data.card[i];
                  obj.src = card+data.card[i]+'.png';
                  obj.selected = false;
                  if(data.card[i] === data.first_card_id){
                    obj.first = true;
                  }else{
                    obj.first = false;
                  }
                  app.mypoker.push(obj);
                }
                break;
            //获取玩家信息
            case 'show_player':
                for(var i in data){
                  if(data[i].player_id == app.waits[0].id){
                    app.allplayer[0].cid = app.waits[0].id;
                    app.allplayer[0].order = 1;
                    app.allplayer[0].header = data[i].player_avatar;
                    app.allplayer[0].pokers = 10;
                    app.allplayer[0].score = data[i].round_score;
                    app.allplayer[0].name = data[i].player_name;
                    app.allplayer[0].lineorder = data[i].player_order;
                  }
                }
                for(var i in data){
                  if(data[i].player_order == app.allplayer[0].lineorder+1 || data[i].player_order == app.allplayer[0].lineorder-3){
                    app.allplayer[1].order = 2;
                    app.allplayer[1].header = data[i].player_avatar;
                    app.allplayer[1].pokers = data[i].card_nums;
                    app.allplayer[1].score = data[i].round_score;
                    app.allplayer[1].name = data[i].player_name;
                    app.allplayer[1].lineorder = data[i].player_order;
                    app.allplayer[1].cid = data[i].player_id;
                  }else if(data[i].player_order == app.allplayer[0].lineorder+2 || data[i].player_order == app.allplayer[0].lineorder-2){
                    app.allplayer[2].order = 3;
                    app.allplayer[2].header = data[i].player_avatar;
                    app.allplayer[2].pokers = data[i].card_nums;
                    app.allplayer[2].score = data[i].round_score;
                    app.allplayer[2].name = data[i].player_name;
                    app.allplayer[2].lineorder = data[i].player_order;
                    app.allplayer[2].cid = data[i].player_id;
                  }else if(data[i].player_order == app.allplayer[0].lineorder+3 || data[i].player_order == app.allplayer[0].lineorder-1){
                    app.allplayer[3].order = 4;
                    app.allplayer[3].header = data[i].player_avatar;
                    app.allplayer[3].pokers = data[i].card_nums;
                    app.allplayer[3].score = data[i].round_score;
                    app.allplayer[3].name = data[i].player_name;
                    app.allplayer[3].lineorder = data[i].player_order;
                    app.allplayer[3].cid = data[i].player_id;
                  }
                }
                app.startgame();
                break;
            //显示本庄庄家
            case 'pin_first':
                setTimeout(function(){
                  app.allplayer.forEach(function(e){
                    if(e.lineorder == data.first_order ){
                      switch(e.order){
                        case 1:
                            app.whoout = 'downouttip';
                            app.isout = false;
                            setTimeout(function(){
                              $api.post(o_url + 'pass_pin_next',{
                                values:{
                                  cid:$api.getStorage("token"),
                                  room_id:app.gameinfo.roomid
                                }
                              },function(ret){
                                if(ret.error == 0){
                                  $api.post(o_url + 'tip_card',{
                                    values:{
                                      cid:$api.getStorage("token"),
                                      room_id:app.gameinfo.roomid
                                    }
                                  },function(ret){
                                    if(ret){
                                      app.isout = true;
                                      app.tippoker = ret;
                                      app.tippokerindex = 0;
                                    }
                                  },'json');
                                }
                              },'json');
                            },1000)
                            break;
                        case 2:
                            app.whoout = 'rightouttip';
                            app.isout = false;
                            break;
                        case 3:
                            app.whoout = 'upouttip';
                            app.isout = false;
                            break;
                        case 4:
                            app.whoout = 'leftouttip';
                            app.isout = false;
                            break;
                      }
                    }
                  })
                },500)
                break;
            //出牌
            case 'send_card':
                var type = data.cardType;
                var cards = data.sendCard;
                var zhuang = data.first_card_id;
                switch(type){
                  case 'AAAA':
                      app.animating('炸弹');
                      break;
                  case 'AAABBB':
                      app.animating('飞机');
                      break;
                  case 'ABC':
                      app.animating('顺子');
                      break;
                  case 'AABB':
                      if(cards.length >2){
                        app.animating('连对');
                      }else {
                        var k ;
                        for(var i in cards){
                          k = cards[i];
                        }
                        k = k%11;
                        if(app.isplayaudio == true){return;}
                        switch(k){
                          case 0:
                              poker_voices('2A')
                              break;
                          case 1:
                              poker_voices('2K');
                              break;
                          case 2:
                              poker_voices('2Q');
                              break;
                          case 3:
                              poker_voices('2J');
                              break;
                          case 4:
                              poker_voices('210');
                              break;
                          case 5:
                              poker_voices('29');
                              break;
                          case 6:
                              poker_voices('28');
                              break;
                          case 7:
                              poker_voices('27');
                              break;
                          case 8:
                              poker_voices('26');
                              break;
                          case 9:
                              poker_voices('25');
                              break;
                          case 10:
                              poker_voices('24');
                              break;
                        }
                      }
                      //
                      break;
                  case 'A':
                      var j ;
                      for(var i in cards){
                        j = cards[i];
                      }
                      j = j%11;
                      switch(j){
                        case 0:
                            poker_voices('A');
                            break;
                        case 1:
                            poker_voices('K');
                            break;
                        case 2:
                            poker_voices('Q');
                            break;
                        case 3:
                            poker_voices('J');
                            break;
                        case 4:
                            poker_voices('10');
                            break;
                        case 5:
                            poker_voices('9');
                            break;
                        case 6:
                            poker_voices('8');
                            break;
                        case 7:
                            poker_voices('7');
                            break;
                        case 8:
                            poker_voices('6');
                            break;
                        case 9:
                            poker_voices('5');
                            break;
                        case 10:
                            poker_voices('4');
                            break;
                      }
                      break;
                }

                app.outpoker = [];
                for(var i in cards){
                  var obj = {};
                  obj.id = cards[i];
                  if(cards[i] === zhuang){
                    obj.first = true;
                  }
                  obj.src = card + cards[i] + '.png';
                  app.outpoker.push(obj);
                }
                var id = data.player_id;
                for(var i=0;i<4;i++){
                  if(app.allplayer[i].cid== id){
                    switch(app.allplayer[i].order){
                      case 1:
                          $api.dom("#out").className = 'downout';
                          break;
                      case 2:
                          $api.dom("#out").className = 'rightout';
                          break;
                      case 3:
                          $api.dom("#out").className = 'upout';
                          break;
                      case 4:
                          $api.dom("#out").className = 'leftout';
                          break;
                    }
                  }
                }
                break;
            //改变用户信息
            case 'change_card_nums':
                var id = data.player_id;
                var ps = data.self_card_nums_now;
                for(var i=0,len=app.allplayer.length;i<len;i++){
                  if(app.iswatch == true){
                    app.mypoker = [];
                  }else{
                    if(app.allplayer[i].cid== id){
                      app.allplayer[i].pokers = ps;
                      app.allplayer[i].pokersarr = [];
                      for(var j=0;j<ps;j++){
                        var obj = {};
                        app.allplayer[i].pokersarr.push(obj);
                      }
                    }
                  }

                }
                break;
            //改变对局
            case 'change_round':
                var r = data.round_times;
                app.gameinfo.round = r;
                break;
            //打不起
            case 'pass_player':
                var id = data.player_id;

                break;
            //时间到自动出牌
            case 'auto_send_card':
                //data.auto_card
                var arr = data.auto_card;
                var index = 0;
                var outer = {};
                for(var i=0,len=arr.length;i<len;i++){
                  outer[index] = arr[i];
                  index++;
                }
                 //alert('长按了页面');
                 var outerstr = $api.jsonToStr(outer)
                 //进度框
                 var t = setTimeout(function(){
                   api.showProgress({
                       title: '自动出牌中',
                       modal: true,
                       animationType: 'zoom',
                   });
                 },1000)
                 setTimeout(function(){
                   api.hideProgress();
                 },5000)
                 $api.post(o_url + 'send_card',{
                   values:{
                     cid:$api.getStorage("token"),
                     room_id:app.gameinfo.roomid,
                     card_arr_id:outerstr,
                   }
                 },function(ret){
                   clearTimeout(t);
                   api.hideProgress();
                   if(ret.error == 0){
                     app.outpoker = [];
                     $api.dom("#out").className = 'downout';
                     for(var i=0,len=arr.length;i<len;i++){
                       for(var j=app.mypoker.length;j>0;j--){
                          if(arr[i] == app.mypoker[j-1].id){
                            app.outpoker.push(app.mypoker[j-1]);
                            app.mypoker.splice(j-1,1)
                          }
                       }
                     }
                     app.outpoker.reverse();
                   }
                 })
                break;
          //结束本轮游戏
          case 'round_end':
              var pokers = data.pressCard;
              app.backpoker = [];
              for(var i=0,len=pokers.length;i<len;i++){
                var obj = {};
                obj.id = pokers[i];
                obj.src = card + pokers[i] + '.png';
                app.backpoker.push(obj)
              }
              for(var i=0,len=app.waits.length;i<len;i++){
                app.waits[i].isready = false;
              }
              music_over();
              setTimeout(function(){
                app.isend = true;
                app.endinfo = [];
                if(data.round_times == 'last_round'){
                  app.gameinfo.round = app.gameinfo.rounds;
                  app.isover = true;
                  app.isoverclass = 'isoverclass';
                }else {
                  app.gameinfo.round = data.round_times;
                }

                var datas = data.score_info;
                for(var i=0,len=datas.length;i<len;i++){
                  var obj = {};
                  obj.name = datas[i].name;
                  obj.score = datas[i].all_score;
                  obj.scorenow = datas[i].score;
                  app.endinfo.push(obj);
                }
                app.gameinfo.double = data.boom_rank;
                app.gameinfo.booms = data.boom_times;
                app.gameinfo.endround = "../image/game/gameend_" + app.gameinfo.round + ".png";

                //显示剩余手牌
                var pokerdata = data.round_end_card
                console.log(JSON.stringify(data.round_end_card))
                for(var i in pokerdata){
                  var arrs = []
                  for (var j=0,len=pokerdata[i].card.length; j<len; j++){
                    var obj = {
                      id: pokerdata[i].card[j],
                      src: card + pokerdata[i].card[j] + '.png'
                    }
                    arrs.push(obj)
                  }
                  if(pokerdata[i].player_order == app.allplayer[0].lineorder+1 || pokerdata[i].player_order == app.allplayer[0].lineorder-3){
                    //{id:0,src:card+0+'.png',selected:false},
                    app.allplayer[1].pokersarr = arrs;
                  }else if(pokerdata[i].player_order == app.allplayer[0].lineorder+2 || pokerdata[i].player_order == app.allplayer[0].lineorder-2){
                    app.allplayer[2].pokersarr = arrs;
                  }else if(pokerdata[i].player_order == app.allplayer[0].lineorder+3 || pokerdata[i].player_order == app.allplayer[0].lineorder-1){
                    app.allplayer[3].pokersarr = arrs;
                  }
                }
                console.log(JSON.stringify(app.allplayer))
              },1000)
              break;
          //改变倍率
          case 'change_bomb':
              app.gameinfo.double = data.bombs;
              break;
          //过牌特效命令
          case 'show_pic':
              var ml = data.pic_type;
              var cid = data.who_pass_id;
              if(ml == 'pass'){
                //app.animating('过');
                app.passanimatestyle =   {
                    width:'8%',
                    height:'15%',
                    position: 'absolute',
                    zIndex: '99999',
                    display:'none',
                    backgroundImage:'url(../image/game/game_pass.png)',
                    backgroundSize:"100% 100%",
                  };
              }else{
                app.passanimatestyle = {
                  width:'20%',
                  height:'24%',
                  position: 'absolute',
                  zIndex: '99999',
                  display:'none',
                  backgroundImage:'url(../image/game/game_onlyone.png)',
                  backgroundSize:"100% 100%",
                };
                setTimeout(function(){
                  music_warning();
                },20)
              }
              for(var i=0,len=app.allplayer.length;i<len;i++){
                if(app.allplayer[i].cid == cid){
                  switch(app.allplayer[i].order){
                    case 1:
                        app.passanimate(1)
                        break;
                    case 2:
                        app.passanimate(2)
                        break;
                    case 3:
                        app.passanimate(3)
                        break;
                    case 4:
                        app.passanimate(4)
                        break;
                  }
                }
              }
              break;
          //播放预置语音
          case 'play_radio':
              var sex = data.sex;
              var vid = data.vid;
              var id = data.cid;
              if($api.getStorage("voice") == 0 || $api.getStorage("voice") == false){
                //
              }else{
                app.allplayer.forEach(function(e){
                  if(e.cid == id){
                    $api.dom('#talking').style.display = "block";
                    setTimeout(function(){
                      $api.dom('#talking').style.display = "none";
                    },2500)
                    var el = $api.dom('#talking');
                    switch(e.order){
                      case 1:
                          $api.attr(el,'class','downtalking');
                          break;
                      case 2:
                          $api.attr(el,'class','righttalking');
                          break;
                      case 3:
                          $api.attr(el,'class','uptalking');
                          break;
                      case 4:
                          $api.attr(el,'class','lefttalking');
                          break;
                    }
                  }
                })
              }
              if(sex == 0){
                sex = 'g';
              }else {
                sex = 'b';
              }
              var src = "widget://wgt/voice/r_"+ sex +"_"+ vid +".mp3";
              voices(src,function(){
                $api.dom('#talking').style.display = "none";
              });
              break;
          //IP提醒
          case 'show_same_ip':
              setTimeout(function(){
                api.toast({msg:data.msg,location:'middle'});
              },2000)
              break;
          //申请解散房间
          case 'show_agree_alert':

              app.cleartip =  data.msg;
              var id = data.player_id;
              $api.dom("#clear").style.display = "block";
              app.cleartime = true;
              setTimeout(function(){
                app.cleartime = false;
                $api.dom("#clear").style.display = "none";
              },31000)
              $api.dom("#clear-left").style.display = 'block';
              $api.dom("#clear-right").style.display = 'block';
              app.waits.forEach(function(e){
                if(e.id == id){
                  e.isagree = 1;
                }else{
                  e.isagree = 2;
                }
              })
              if(app.waits[0].id == id){
                $api.dom("#clear-left").style.display = 'none';
                $api.dom("#clear-right").style.display = 'none';
              }
              break;
          //别人对房间做了什么
          case 'say_yes_no':
              var id = data.player_id;
              var type = data.agree_type;
              if(type == 'yes'){
                type = 1;
              }else if (type == 'no'){
                $api.dom("#clear").style.display = 'none';
                var name = "";
                app.waits.forEach(function(e){
                  if(e.id == id){
                    name = e.name;
                  }
                })
                api.toast({msg:name+"拒绝了房间解散!",location:'middle'});
                type = 0;
                return;
              }
              for(var i=0,len=app.waits.length;i<len;i++){
                if(app.waits[i].id == id){
                  var obj = app.waits[i];
                  obj.isagree = type;
                  Vue.set(app.waits, i, obj)
                }
              }
              break;
          //该房间已经解散
          case 'agree_close_alert':
              sure('解散房间','房间已经被解散,确定退出吗?',function(){
                    api.stopPlay();
                    api.openWin({
                        name: '主页',
                        url: '../html/home.html',
                        animation: {
                          type:winChange,
                          duration:500
                        },
                        slidBackEnabled:false,
                        delay:100,
                        reload:true
                    });
                    setTimeout(function(){
                      api.closeWin({
                          name: '游戏'
                      });
                    },2000)
              });
              break;
          //解散发起者发送删除定时命令
          case 'del_room_time':
              //删除定时
              var data = '{"type":"del_room_time","room_id":'+app.gameinfo.roomid+',"cid":"'+ $api.getStorage("token") +'"}';
              ws.send(data)
              break;
          //播放语音
          case 'play_voice':
              var id = data.cid;
              if($api.getStorage("voice") == 0 || $api.getStorage("voice") == false){
              }else{
                app.allplayer.forEach(function(e){
                  if(e.cid == id){
                    $api.dom('#talking').style.display = "block";
                    var el = $api.dom('#talking');
                    switch(e.order){
                      case 1:
                          $api.attr(el,'class','downtalking');
                          break;
                      case 2:
                          $api.attr(el,'class','righttalking');
                          break;
                      case 3:
                          $api.attr(el,'class','uptalking');
                          break;
                      case 4:
                          $api.attr(el,'class','lefttalking');
                          break;
                    }
                  }
                })
              }
              playvoice(data.voice_url);
              break;
          //观战者开始游戏
          case 'watch_start_game':
              setTimeout(function(){
                $api.dom('.record').style.display = "none";
                $api.dom('.record2').style.display = "none";
                $api.dom('.watchgame').style.display = "block";
                app.iswatch = true;
              },50)
              app.start = true;
              var all = data.all_player_info;
              for(var key in all){
                var i = all[key].player_order;
                app.allplayer[i].lineorder = all[key].player_order;
                app.allplayer[i].order = i+1;
                app.allplayer[i].header = all[key].player_avatar;
                app.allplayer[i].name = all[key].player_name;
                app.allplayer[i].pokers = all[key].card_nums;
                app.allplayer[i].score = all[key].round_score;
                app.allplayer[i].pokersarr = [];
                for(var j=0,len=all[key].card_nums;j<len;j++){
                  var obj = {src:app.adback};
                  if(i == 0){
                    app.mypoker.push(obj)
                  }else{
                    app.allplayer[i].pokersarr.push(obj)
                  }
                }
                app.allplayer[i].cid = all[key].player_id;

              }
              app.gameinfo.round = data.round_times;
              app.gameinfo.double = data.bombs;

              var cards = data.last_player_card;
              app.outpoker = [];
              for(var i in cards){
                var obj = {};
                obj.id = cards[i];
                obj.src = card + cards[i] + '.png';
                app.outpoker.push(obj);
              }

              var id = data.last_player_id;
              for(var i=0;i<4;i++){
                if(app.allplayer[i].cid== id){
                  switch(app.allplayer[i].order){
                    case 1:
                        $api.dom("#out").className = 'downout';
                        break;
                    case 2:
                        $api.dom("#out").className = 'rightout';
                        break;
                    case 3:
                        $api.dom("#out").className = 'upout';
                        break;
                    case 4:
                        $api.dom("#out").className = 'leftout';
                        break;
                  }
                }
              }
              break;

        }
    };




    //禁止长按退出
    api.addEventListener({
        name:'longpress'
    }, function(ret, err){
       return false;
    });



};
//检测对象是否在数组中
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
