$(function(){
    //播放列表
    var audio=$('audio').get(0);
    datebase=[{path:'G.E.M.邓紫棋-画(Live Piano Session II).mp3',name:'G.E.M.邓紫棋-画(Live Piano Session II)',geshou:"邓紫棋",duration:'02:48'},
        {path:'那英-默-(电影《何以笙箫默》插曲).mp3',name:'默-(电影《何以笙箫默》插曲)',geshou:'那英',duration:'05:25'},
        {path:'小提琴 - 卡农.mp3',name:'卡农',geshou:'小提琴',duration:'14:59'},
        {path:'庄心妍-真的不容易.mp3',name:'真的不容易',geshou:'庄心妍',duration:'03:18'},
        {path:'算你狠.mp3',name:'算你狠',geshou:'陈小春',duration:'02:47'},
        {path:'最好的我们.mp3',name:'最好的我们',geshou:'陈小春',duration:'03:34'},
        {path:'Almost Lover.mp3',name:'Almost Lover',geshou:'Almost',duration:'04:30'}];
     $('.open-list div').text(datebase.length)

    function fang(){
        $(datebase).each(function(i,v){
            $('<li date-id='+i+'><span class="song-name">'+v.name+'</span><span class="singer">'+v.geshou+'</span><span class="duration">'+v.duration+'</span><div class="opration"><div class="like"></div><div class="share"></div><div class="shoucang"></div><div class="delete"></div></div></li>').appendTo('.playlist .list')
        });
    }
     fang();
    //播放函数
    function playing(){
        $('.list li').removeClass('playing')
        $('.list li').eq(index).addClass('playing')
        var pre="mp3/"+datebase[index].path;
        $(audio).attr('src',pre);
        var name=$('.list li').eq(index).find('.song-name').text();
        var singer=$('.list li').eq(index).find('.singer').text();
        var duration=$('.list li').eq(index).find('.duration').text();
        $('.center #music-name').text(name)
        $('.center .singer').text(singer)
        $('.center .music-date').text(duration)
        audio.play()
    }
    //切换歌曲
    var previous=$('.bar .previous');
    var next=$('.bar .next');

    var index=0;
    //点击选中列表中的歌
    $('.list').on('click','li',function(){
        var next=parseInt($(this).attr('date-id'))
        if(audio.paused){
            bofang.addClass('paused')
        }
        $('.audio-pic').addClass('move')
            index=next;
            playing();
    })
    next.on('click',function(){
        var max=$('.list li').length;
        $('.open-list div').text(max);
        index+=1;
        if(index== max){
            index=0;
        }
        playing();
    })
    previous.on('click',function(){
        var max=$('.list li').length;
        $('.open-list div').text(max);
        index-=1;
        if(index==-1){
            index=max-1;
        }
        playing();
    })


    //播放暂停
    var bofang=$('.bar .plays');
    bofang.on('click',function(){
        if(audio.paused){
            audio.play();
            playing()
        }else{
            audio.pause();
        }
        $(this).toggleClass('paused')
        $('.audio-pic').toggleClass('move')
    })
    //转化时间为分秒函数
    function format(a){
        var m=parseInt(a/60);
        var s=parseInt(a%60);
          m=(m<10)?('0'+m):m;
          s=(s < 10)?( '0' + s):s;
        var time=m + ":" + s;
        return time;
    }

    //删除
    $('.list li .opration').on('click','.delete',function(){
        var id=$(this).closest('li').attr('date-id');
        $(this).closest('li').remove();   //删除最靠近他的父元素
        datebase.splice(id,1)               //删除数据
        audio.src='';                   //清理地址
        $('.bofang').removeClass('paused')         //还原播放按钮
        $('.center #music-name').text('听我想听的歌');    //清理歌曲信息
        $('.center .singer').text('qq音乐');
        $('.center .music-date').text('....');
        var max=$('.list li').length;
        $('.open-list div').text(max);
        playing()
    });
	// 点击静音
    var regulate= $('.volome-regulate')
	$(".volome .volome-mute").on("click",function(){
         $(this).toggleClass("jingyin")
          if(!$(this).attr('ov')){
              //添加自定义属性保存之前音量大小
          	$(this).attr('ov',audio.volume);
          	audio.volume=0;
		  }else{
		  	audio.volume=$(this).attr('ov');
		  	$(this).removeAttr('ov');
		 }
	})
    // 点击设置音量
    var w=regulate.width()
    $(document).on('mousedown',false)
    regulate.on('click',function(e){
        if(e.offsetX<=0){
            e.offsetX=0
        }
        audio.volume= e.offsetX /$(this).width();
    })
    // 点击改变音量条的界面
    $(audio).on('volumechange',function(){
        if(audio.volume===0){
            $(".volome-mute").addClass('jingyin')
        }else{
            $(".volome-mute").removeClass('jingyin')
        }
        $('.volome-op').css({left:audio.volume*w-$('.volome-op').width()/2})
        $('.volome-bar').css({width:audio.volume*w})
    })
    $(audio).triggerHandler('volumechange')
    // 音量拖动
    $('.volome-regulate .volome-op').on('click',function(e){
        e.stopPropagation();
    })
    $('.volome-regulate .volome-op').on('mousedown',function(e){
        regulate.addClass('moving')
        regulate.on('mousemove',function(e){
            var v=(e.pageX-regulate.offset().left)/regulate.width();
            v=(v>1)?1:v;
            v=(v<0)?0:v;
            audio.volume=v;

        })
        $(document).on('mouseup',function(){
            regulate.removeClass('moving')
            regulate.off('mousemove')
        })
    })

    $(audio).on('ended',function(){
        playing()
    })

    //播放进度拖动

        var bgbar=$('.play-bar');
        var current=$('.play-bar .play-current');
        var playop=$('.play-bar .yuan');
        var bgw=bgbar.width();
        bgbar.on('click',function(e){
            audio.currentTime=(e.pageX-$(this).offset().left)/bgw*audio.duration;
        })
        playop.on('mousedown',function(e){
            e.preventDefault();
            bgbar.on('mousemove',function(e){
                var ww=(e.pageX-bgbar.offset().left)/bgw*audio.duration;
                ww=ww>=audio.duration?audio.duration:ww;
                ww=ww<=0?0:ww;
                audio.currentTime=ww;
            });
            $(document).on('mouseup',function(){
                bgbar.off('mousemove');
                $(document).off('mouseup')
            })
        })

        audio.ontimeupdate=function(){
            $('.dangqian').text(format(audio.currentTime));
            $('.zongshijian').text(format(audio.duration));
            var w=audio.currentTime/audio.duration*bgw;
            current.width(w);

            playop.css({left:w-playop.width()/2})
        }

    // 进度条时间
    var show=$('.show-time');
    bgbar.on('mouseover',function(e){
        e.preventDefault;
        // alert(1)
        show.css('display','block')
        var ww=e.pageX-bgbar.offset().left;
        show.css({left:ww-show.width()/2})
        bgbar.on('mousemove',function(e){
            var ww=e.pageX-bgbar.offset().left;
            show.css({left:ww-show.width()/2})
            var ct=ww/bgw*audio.duration;
            show.find('p').html(format(ct))
        })
    });
    bgbar.on('mouseout',function(e){
        bgbar.off('mousemove')
        show.css('display','none')
    })
    playop.on('click',function(e){
        e.stopPropagation();
    })
    // //播放顺序
    // $('.circle-brt').on('click',function(){
    //     $('.play-order-select').addClass('active')
    // })
    // $('.ordered-brt').on('click',function(){
    //     $('.this').removeClass('active')
    //     index+=1;
    //     if(index== datebase.length){
    //         index=0;
    //     }
    //     $(audio).on('ended');
    // })
    // $('.unordered-brt').on('click',function(){
    //     $('.this').removeClass('active')
    //     index=Math.floor(Math.random()*$(datebase).length)
    //     $(audio).on('ended');
    // });
    // $('.cycle-singer-brt').on('click',function(){
    //     $('.this').removeClass('active')
    //     index=index;
    //     $(audio).on('ended');
    // })
    //播放模式
    var order=$('.play-order-select .ordered-brt');
    var unorder=$('.play-order-select .unordered-brt');
    var single=$('.play-order-select .cycle-singer-brt');
    var cycle=$('.play-order-select .cycle-brt');
    var select=$('.play-order-select')
    var change=$(".bar .circle-brt")
    change.on('click',function(e){
        e.preventDefault;
        select.css('display','block');
    })
    order.on('click',function(){
        change.attr('class','circle-brt');
        select.css('display','none');
        change.addClass('ordered-brt');
    })
    unorder.on('click',function(){
        change.attr('class','circle-brt');
        select.css('display','none');
        change.addClass('unordered-brt');

    })
    single.on('click',function(){
        change.attr('class','circle-brt');
        select.css('display','none');
        change.addClass('cycle-singer-brt');

    })
    cycle.on('click',function(){
        change.attr('class','circle-brt');
        select.css('display','none');
        change.addClass('cycle-brt');

    })
//列表播放
$(audio).on('ended',function(){
    if(change.hasClass('unordered-brt')){
        index=Math.floor(Math.random()*datebase.length);
    }
    if(change.hasClass('cycle-singer-brt')){
    }
    if(change.hasClass('cycle-brt')||change.hasClass('ordered-brt')){
        index+=1;
        if(index== datebase.length){
            index=0;
        }
    }
    if(!index||index>=datebase.length){
        index=0;
    }
    playing()
})

    //展开 收起s
    var openlist=$('.open-list');
    var op2=$('.playlist .close')
    var list=$('.playlist');
    openlist.on('click',function(){
        list.toggleClass('shouqi')
    })
    op2.on('click',function(){
        list.addClass('shouqi')
    })
})


