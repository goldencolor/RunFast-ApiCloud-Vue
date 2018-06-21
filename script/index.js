//页面加载完成
apiready = function(){
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

    //判断是否已经登录过
    var login = $api.getStorage("token");

    if(login == "" || login == undefined){
      //console.log("未登录")
    }else{
      api.showProgress({
          title: '登录中',
          modal: true,
          animationType: 'zoom',
      });
      $api.post(o_url + 'player_info',{
        values:{
          cid:login,
        }
      },function(ret){

        api.hideProgress();
        if(ret.error == 1){
          api.toast({msg:ret.msg,location:'middle'});
          return;
        }
        //保存信息
        $api.setStorage("useravatar",ret.msg.avatar);
        $api.setStorage("username",ret.msg.name);
        $api.setStorage("userid",ret.msg.player_id);
        $api.setStorage("usersex",ret.msg.sex);
        $api.setStorage("token",ret.msg.token);
        $api.setStorage("userdiamond",ret.msg.diamond);

        api.openWin({
            name: '主页',
            url: './html/home.html',
            slidBackEnabled:false,
            animation: {
              type:winChange,
              duration:500
            },
            delay:500,
            reload:true
        });
      },'json');
    }

    // api.openWin({
    //     name: '游戏',
    //     url: './html/game.html',
    //     slidBackEnabled:false,
    //     animation: {
    //       type:"push",
    //       duration:500
    //     },
    //     delay:500,
    //     reload:true
    // });

    //vue
    var app = new Vue({
      el:"#app",
      data:{
        //版本号
        vision:"1.0",
        //是否打开协议
        open:false,
        //测试id
        testid:'H3qSe',
      },
      methods:{
        checkUser:function (num) {
          if(num == 1) {
            this.testid = 'TdRls'
          } else if (num == 2) {
            this.testid = 'YqUDv'
          } else if(num ==3) {
            this.testid = 'G=HAs'
          }
        },
        //登录
        login:function(){
          music_nomal();
          if($api.dom(".is_agree").checked == false){
            api.toast({msg:'请先同意用户协议',location:'middle'});
          }else {
            // $api.post(o_url + 'player_info',{
            //   values:{
            //     cid:this.testid,
            //   }
            // },function(ret){
            //   api.hideProgress();
            //   if(ret.error == 1){
            //     api.toast({msg:ret.msg,location:'middle'});
            //     return;
            //   }
            //   //保存信息
            //   $api.setStorage("useravatar",ret.msg.avatar);
            //   $api.setStorage("username",ret.msg.name);
            //   $api.setStorage("userid",ret.msg.player_id);
            //   $api.setStorage("usersex",ret.msg.sex);
            //   $api.setStorage("token",ret.msg.token);
            //   $api.setStorage("userdiamond",ret.msg.diamond);
            //
            //   api.openWin({
            //       name: '主页',
            //       url: './html/home.html',
            //       slidBackEnabled:false,
            //       animation: {
            //         type:"push",
            //         duration:500
            //       },
            //       delay:500,
            //       reload:true
            //   });
            // },'json');
            // return;
            api.showProgress({
                title: '登录中',
                modal: true,
                animationType: 'zoom',
            });
            var wx = api.require('wx');
            wx.auth({
                apiKey: ''
            }, function(ret, err) {
                if (ret.status) {
                  var code =  ret.code;
                  $api.setStorage("wxcode",code);
                  wx.getToken({
                      apiKey: '',
                      apiSecret: '',
                      code: code
                  }, function(ret, err) {
                      if (ret.status) {
                          var wxtoken = ret.accessToken;
                          var wxid = ret.openId;
                          $api.setStorage("wxtoken",code);
                          $api.setStorage("wxid",code);
                          wx.getUserInfo({
                              accessToken: wxtoken,
                              openId: wxid
                          }, function(ret, err) {
                              if (ret.status) {
                                  var userid = ret.openid;
                                  var username = ret.nickname;
                                  var usersex = ret.sex;
                                  var userprovince = ret.province;
                                  var usercity = ret.city;
                                  var usercountry = ret.country;
                                  var userheader = ret.headimgurl;
                                  console.log(o_url)
                                  $api.post(o_url + 'player_info',{
                                    values:{
                                      openid:userid,
                                      avatar:userheader,
                                      name:username,
                                      sex:usersex,
                                      addr:usercountry + "/" + userprovince + "/" + usercity
                                    }
                                  },function(ret){
                                    console.log(JSON.stringify(ret))
                                    api.hideProgress();
                                    if(ret.error == 1){
                                      api.toast({msg:ret.msg,location:'middle'});
                                      return;
                                    }
                                    //保存信息
                                    $api.setStorage("useravatar",ret.msg.avatar);
                                    $api.setStorage("username",ret.msg.name);
                                    $api.setStorage("userid",ret.msg.player_id);
                                    $api.setStorage("usersex",ret.msg.sex);
                                    $api.setStorage("token",ret.msg.token);
                                    $api.setStorage("userdiamond",ret.msg.diamond);

                                    api.openWin({
                                        name: '主页',
                                        url: './html/home.html',
                                        slidBackEnabled:false,
                                        animation: {
                                          type:winChange,
                                          duration:500
                                        },
                                        delay:500,
                                        reload:true
                                    });
                                  },'json');

                              } else {
                                  api.toast({msg:"获取用户信息失败,请重试!",location:'middle'});
                              }
                          });

                      } else {
                          api.toast({msg:"获取Token失败,请重试!",location:'middle'});
                      }
                  });
                } else {
                  alert(err.code);
                    api.toast({msg:"授权失败,请重试!",location:'middle'});
                }
            });
           }
        },
        //打开协议
        open_content:function(){
          this.open = true;
        },
        //关闭协议
        close_content:function(){
          this.open = false;
        },
        //改变测试账号
        changeuser:function(e){
          app.testid = e;
          api.toast({msg:'选择用户'+e+'成功',location:'middle'});
        },
      }
    })




};
