/*
 *  ybox image gallery V.2 - image lightbox gallery plugin with jQuery
 * 
 * Copyright (c) 2009 Yeap Chee Choon(yeurus)
 * http://freelayer.net/projects/jquery-plugins/ybox/
 *
 * Licensed under  GPL V3
 * http://www.opensource.org/licenses						
 *
 *Launch:2009/10/20
 *V1:2010/4/20 tested with jQuery 1.4.2
 *V2:2011/5/31 tested with jQuery 1.6.1,fixed some bugs,added auto play function,support IE6
 */
;(function($){
       $.fn.yBox=function(options){	
              var totalEl=this.length,$Self=this;
              
              var mainBox={
                    currEl:0,
                    overlaying:false,
                    enableOriSizeEvent:false,
                    enableRestoreEvent:false,
                    topOffset:0,
                    showError:false,
                    documentHeight:'100%',
                    documentWidth:'100%',
                    style:null,
                    autoPlaying:false,
                    defaultClass:null,
                    defaultOverflowY:null,
                    conf:null,
                    intervalID:null,
                    defaults:{
                        mainWrap:'#display-area',
                        loadingImg:'images/loading2.gif',
                        maxImg:'url(images/button.png) 0px -45px',
                        minImg:'url(images/button.png) 0px -135px',
                        preImg:'url(images/button.png) 0px -90px',
                        nextImg:'url(images/button.png) 0px -180px',
                        closeImg:'url(images/button.png) 0px 0px',
                        playImg:'url(images/play.png)',
                        pauseImg:'url(images/pause.png)',
                        autoPlaySpeed:3000,
                        resizeSpeed:400,
                        bgColor:'#FFF',
                        borderSize:10,
                        autoRun:false,
                        overlay:true,
                        maxHeight:450
                    },
                     
                    setConf:function(){
                        this.conf=$.extend(this.defaults,options);
                        return this;
                    },
                     
                    cacheEl:function(){
                        this.yOverlay=$('#ybox-overlay');
                        this.yOverlayContain=$('#ybox-overlay-container');
                        this.yTrigger=$('.ybox-trigger');
                        this.yMain=$('#ybox-main');
                        this.yShowArea=$('#ybox-show-area');
                        this.yObj=$('.ybox-obj');
                        this.yNext=$('#ybox-next');
                        this.yPre=$('#ybox-pre');
                        this.yAutoPlay=$('#ybox-auto-play');
                        this.yOriSize=$('#ybox-ori-size');
                        this.yClose=$('#ybox-close');
                        this.yDisable=$('.ybox-trigger,.ybox-obj');
                        this.yDesc=$('#ybox-desc');
                        this.yWrap=$('#ybox-wrap');
                    },
                     
                    install:function(){
                        mainBox.defaultClass=$($Self).attr('class');
                        $($Self).addClass('ybox-obj');
                        this.documentHeight=$(document).height();
                        this.documentWidth=$(document).width();
                        mainBox.style='<style type="text/css" media="screen">'+
                                           '#ybox-overlay{z-index:9999;position:absolute;width:'+mainBox.documentWidth+'px;height:'+mainBox.documentHeight+'px;background:#000;}'+
                                           '#ybox-overlay-container{z-index:10000;display:none;position:absolute;width:100%;top:'+$(window).scrollTop()+'}'+
                                           '#ybox-main{display:block;background:url('+mainBox.conf.loadingImg+') no-repeat center '+mainBox.conf.bgColor+';width:200px;height:200px;position:relative;margin:0 auto;border:solid '+mainBox.conf.borderSize+'px '+mainBox.conf.bgColor+'}'+
                                           '#ybox-main:hover .ybox-trigger{width:40px;height:40px;position:absolute;opacity:0.5;filter:alpha(opacity=50);display:block}'+
                                           '#ybox-close{background:'+mainBox.conf.closeImg+';top:5px;right:5px;}'+
                                           '#ybox-ori-size{background:'+mainBox.conf.maxImg+';left:5px;top:5px;}'+
                                           '#ybox-desc{background:#000;opacity:0.7;filter:alpha(opacity=70);color:#fff;top:50px;padding:10px;-moz-border-radius: 5px;-webkit-border-radius: 5px;}'+
                                           '#ybox-pre{background:'+mainBox.conf.preImg+';bottom:5px;left:5px;}'+
                                           '#ybox-next{background:'+mainBox.conf.nextImg+';right:5px;bottom:5px;}'+
                                           '#ybox-auto-play{background:'+mainBox.conf.playImg+';left:50%;margin-left:-25px;bottom:5px;width:50px!important;height:50px!important}'+
                                           '#ybox-show-area{display:none;background:'+mainBox.conf.bgColor+'}'+
                                           '#ybox-show-area img{border:0}'+
                                           '#ybox-wrap{width:100%;height:auto}'+
                                           '.ybox-trigger{display:none}'+
                                           '.ybox-enable{cursor:pointer;}'+
                                           '.ybox-enable:hover{opacity:1!important;filter:alpha(opacity=100);filter:alpha(opacity=100)!important}'+
                                           '.ybox-active img{background:#000!important;}'+
                                           '.ybox-disable,.ybox-disable img{cursor:not-allowed;opacity:0.5;filter:alpha(opacity=50)}'+
                                        '</style>';
                    
                    
                        var elements='<div id="ybox-overlay"></div>'+
                                    '<div id="ybox-overlay-container">'+
                                    '<div id="ybox-wrap">'+
                                        '<a href="#" id="ybox-main">'+
                                            '<div id="ybox-close" title="Close" class="ybox-trigger"></div>'+
                                            '<div id="ybox-ori-size" class="ybox-trigger"></div>'+
                                                '<div id="ybox-desc" class="ybox-trigger"></div>'+
                                                '<div id="ybox-pre" title="Previous" class="ybox-trigger"></div>'+
                                                '<div id="ybox-auto-play" title="AutoPlay" class="ybox-trigger"></div>'+
                                                '<div id="ybox-next" title="Next" class="ybox-trigger"></div>'+
                                                '<div id="ybox-show-area"></div>'+
                                        '</a>'+
                                    '</div>'+
                                    '</div>';
                                         
                        $('body').prepend(elements);
                        mainBox.style=$(mainBox.style).prependTo('body');
                        mainBox.cacheEl();
                        mainBox.documentWidth=mainBox.yOverlay.fadeTo(1,0.8).css({display:'none'}).width();
                        mainBox.fixedElement();
                        mainBox.defaultOverflowY=mainBox.yOverlayContain.parent().css('overflow-y');
                        mainBox.yMain.click(function(){return false});
                        
                        if($.browser.msie && $.browser.version==6){
                            mainBox.yMain.hover(function(){
                                this.yTrigger.css('display','block');
                            },function(){
                                this.yTrigger.css('display','none');
                            });
                        }
                        return this;
                    },
                     
                    run:function(){
                        var showElement='#ybox-overlay-container';
                        if(mainBox.conf.overlay){
                            showElement+=',#ybox-overlay';
                            mainBox.overlaying=true;
                        }
                        $(showElement).fadeIn(500);
                        mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                        return this;
                    },
                     
                    eventDisable:function(el){
                        var show=false;
                        if(mainBox.yTrigger.css('display')=='block'){
                            show=true;
                        }
                        el.unbind()
                        .removeClass('ybox-enable')
                        .addClass('ybox-disable')
                        .click(function(){return false});
                        mainBox.yObj.click(function(){return false;});
                        if(!mainBox.conf.autoRun){
                            mainBox.bindCloseEvent();
                        }
                        return this;
                    },
                     
                    fixedElement:function(){
                        if($.browser.msie && $.browser.version=='6.0'){
                            $(window).scroll(function(){mainBox.yOverlayContain.css('top',$(this).scrollTop());});
                        }else{
                            mainBox.yOverlayContain.css({top:0,left:0,position:'fixed'});
                        }
                    },
                    
                    autoPlay:function(){
                       if(mainBox.currEl+1<totalEl){
                            mainBox.currEl+=1;
                            mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                        }else{
                            mainBox.currEl=0;
                            mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                        }
                    },
                     
                    eventEnable:function(){
                        if(mainBox.currEl+1<totalEl){
                            mainBox.bindNextEvent();
                        }
                        if(mainBox.currEl-1>=0){
                            mainBox.bindPreEvent();
                        }
                        if(!mainBox.conf.autoRun){
                            mainBox.bindCloseEvent();
                        }
                        if(mainBox.enableOriSizeEvent){
                            mainBox.bindOriSizeEvent();
                        }
                        if(mainBox.enableRestoreEvent){
                            mainBox.bindRestoreEvent();
                            $(window).unbind('scroll');
                        }else{
                            mainBox.fixedElement();
                        }
                        if(mainBox.autoPlaying){
                                mainBox.bindStopAutoPlayEvent();
                            }else{
                                mainBox.bindAutoPlayEvent();
                            }
                        mainBox.yDesc.removeClass('ybox-disable').addClass('ybox-enable');
                        mainBox.bindSelfEvent();
                        return this;
                    },
                     
                    bindSelfEvent:function(){
                        mainBox.yObj
                        .unbind('click.yBoxSelf')
                        .bind('click.yBoxSelf',function(){
                            mainBox.currEl=$.inArray(this,mainBox.yObj);
                            if($('#ybox-overlay').length<1){
                                mainBox.install().run();
                            }else{
                                mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                            }
                            return false;
                        })
                        .removeClass('ybox-disable')
                        .addClass('ybox-enable');
                    },
                     
                    bindNextEvent:function(){
                        mainBox.yNext
                        .unbind('click')
                        .click(function(){
                            mainBox.currEl+=1;
                            mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                            return false;
                        })
                        .removeClass('ybox-disable')
                        .addClass('ybox-enable');
                    },
                     
                    bindAutoPlayEvent:function(){
                        mainBox.yAutoPlay
                        .unbind('click')
                        .click(function(){
                            mainBox.autoPlaying=true;
                            var autoPlayFn=mainBox.autoPlay;
                            mainBox.intervalID=setInterval(autoPlayFn,mainBox.conf.autoPlaySpeed);
                            mainBox.eventEnable();
                            return false;
                        }).removeClass('ybox-disable')
                        .addClass('ybox-enable')
                        .attr('title','Start Auto Play')
                        .css('background',mainBox.conf.playImg);
                    },
                    
                    bindStopAutoPlayEvent:function(){
                        mainBox.yAutoPlay
                        .unbind('click')
                        .click(function(){
                            mainBox.autoPlaying=false;
                            clearInterval(mainBox.intervalID);
                            mainBox.eventEnable();
                            return false;
                        }).removeClass('ybox-disable')
                        .addClass('ybox-enable')
                        .attr('title','Stop Auto Play')
                        .css('background',mainBox.conf.pauseImg);;
                    },
                    
                    bindPreEvent:function(){
                        mainBox.yPre
                        .unbind('click')
                        .click(function(){
                            mainBox.currEl-=1;
                            mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                            return false;
                        })
                        .removeClass('ybox-disable')
                        .addClass('ybox-enable');
                    },
                     
                    bindOriSizeEvent:function(){
                        mainBox.yOriSize
                        .unbind('click')
                        .bind('click',function(){
                                mainBox.documentHeight=$(document).height();
                                if(!($.browser.msie && $.browser.version=='6.0')){
                                    var pos=mainBox.yOverlayContain.offset();
                                    mainBox.yOverlayContain.css({position:'absolute',top:$(window).scrollTop(),left:pos.left+'px'});
                                }
                                mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,true);
                                return false;
                        })
                        .removeClass('ybox-disable')
                        .addClass('ybox-enable')
                        .attr('title','Original Size')
                        .css('background',mainBox.conf.maxImg);
                    },
                     
                    bindRestoreEvent:function(){
                           mainBox.yOriSize
                           .unbind('click')
                           .bind('click',function(){
                                mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                                return false;
                           })
                           .removeClass('ybox-disable').addClass('ybox-enable')
                           .attr('title','Restore').css('background',mainBox.conf.minImg);
                    },
                     
                    bindCloseEvent:function(){
                        mainBox.yClose
                        .unbind('click')
                        .click(function(){
                            mainBox.yObj=$Self;
                            mainBox.eventEnable();
                            mainBox.yOverlayContain.parent().css('overflow-y',mainBox.defaultOverflowY);
                            $('#ybox-overlay,#ybox-overlay-container')
                            .fadeOut('fast',function(){mainBox.overlaying=false;})
                            .remove();
                            mainBox.yObj.attr('class',mainBox.defaultClass);
                            mainBox.style.remove();
                            if(mainBox.showError){
                                clearTimeout(mainBox.showError);
                            }
                            return false;
                        })
                        .removeClass('ybox-disable')
                        .addClass('ybox-enable');
                    },
                     
                    resize:function(width,height,max){
                        mainBox.yMain.animate({width:width,height:height},mainBox.conf.resizeSpeed,function(){
                            mainBox.yShowArea.fadeIn(300);
                            if(max){
                                mainBox.yOverlay.height($(document).height());
                                mainBox.yOverlayContain.parent().css('overflow-y','auto');
                            }else{
                                mainBox.yOverlay.height(mainBox.documentHeight);
                                mainBox.yOverlayContain.parent().css('overflow-y',mainBox.defaultOverflowY);
                                width=mainBox.yMain.innerWidth();
                            }
                            mainBox.yDesc.css({width:width-60-(width/10)*2,left:(width/10)+30-mainBox.conf.borderSize});
                            mainBox.eventEnable();
                        });
                    },
                     
                    showError:function(msg){
                        var height=mainBox.yMain.height();
                        mainBox.yShowArea
                        .css('height',height)
                        .html('<p style="text-align:center;line-height:'+height+'px;margin:0">'+msg+'</p>')
                        .fadeIn(300);
                        mainBox.eventEnable();
                     },
                     
                    loadNewImg:function(el,max){
                        mainBox.yShowArea
                        .fadeOut(300,function(){
                            var loadImg=new Image();
                            var fn=function(){
                                mainBox.showError('Unable to load image!');};
                                mainBox.showError=setTimeout(fn,30000);
                            
                                var desc=mainBox.yObj.removeClass('ybox-active')
                                                                            .eq(el)
                                                                            .addClass('ybox-active')
                                                                            .children('img')
                                                                            .attr('alt')
                                                                            .replace(/@%/g,'<')
                                                                            .replace(/%@/g,'>');
                                mainBox.yDesc.html(desc);
                                loadImg.src=mainBox.yObj[el];
                                mainBox.enableRestoreEvent=false;
                                mainBox.enableOriSizeEvent=false;
                            
                                function loadCompleted(src,width,height,max){
                                    clearTimeout(mainBox.showError);
                                    mainBox.showError=false;
                                    var maxHeight=$(window).height()-mainBox.topOffset-mainBox.conf.borderSize*2;
                                    if((!max) && height>maxHeight){
                                        width=width*(maxHeight/height);
                                        height=maxHeight;
                                        mainBox.enableOriSizeEvent=true;
                                    }else if(max){
                                        mainBox.enableRestoreEvent=true;
                                    }
                                    mainBox.yShowArea.html('<img src="'+src+'" style="height:'+height+'px" />');
                                    mainBox.resize(width,height,max);
                            }
                            if (loadImg.complete){
                                    loadCompleted(loadImg.src,loadImg.width,loadImg.height,max);
                            }else{
                                    loadImg.onload=function(){
                                        loadCompleted(loadImg.src,loadImg.width,loadImg.height,max);
                                        loadImg.onload=function(){};
                                    };
                            }
                    });
                }
        };
	     
            $(function(){
                if(mainBox.setConf().conf.autoRun){
                    mainBox.install().run();
                }else{
                    mainBox.yObj=$Self;
                    mainBox.bindSelfEvent();
                }
            });
	     
            var scrollNav={
                   conf:null,
                   countedWidth:null,
                   installed:false,
                   maxLeft:null,
                   style:null,
                   options:null,
                     
                    cacheEl:function(){
                        this.sNavItems=$('#scrollnav-items');
                        this.sNavNext=$('#scrollnav-next');
                        this.sNavPre=$('#scrollnav-pre');
                        this.sNavItemsChild=$('#scrollnav-items > .ybox-obj');
                        this.sNavItemsChild.attr('class','ybox-obj');
                        this.sNavNot=$('.not-scrollnav-obj');
                        this.sNavWrap=$('#scrollnav-wrap');
                        scrollNav.sNavNot.removeClass('ybox-obj');
                        mainBox.yObj=this.sNavItemsChild;
                        mainBox.yDisable=$('.ybox-trigger,.ybox-obj');
                    },
                     
                    enableScrollNav:function(options){
                        scrollNav.options=options;
                        $(function(){
                            scrollNav.run();
                        });
                    },
                    
                    run:function(){
                           var defaults={
                                height:200,
                                width:$(window).width(),
                                nextBg:'#000 url(images/next.jpg) no-repeat center',
                                preBg:'#000 url(images/pre.jpg) no-repeat center',
                                bgStyle:'#FFF',
                                position:'bottom'
                           };
                           scrollNav.conf=$.extend(defaults,scrollNav.options);
      
                           if(mainBox.conf.autoRun){
                                scrollNav.install(false);
                           }else{
                                scrollNav.bindSelfEvent();
                           }
                           scrollNav.bindSelfEvent();
                           mainBox.topOffset=scrollNav.conf.height;
                    },
                    
                    install:function(el){
                        scrollNav.style='<style type="text/css" media="screen">'+
                                   '#scrollnav-wrap{display:none;z-index:10000;width:100%;height:'+scrollNav.conf.height+'px;}'+
                                   '#scrollnav-pre{display:block;float:left;width:30px;height:'+scrollNav.conf.height+'px;background:'+scrollNav.conf.preBg+';cursor:pointer}'+
                                   '#scrollnav-next{display:block;float:left;width:30px;height:'+scrollNav.conf.height+'px;background:'+scrollNav.conf.nextBg+';cursor:pointer}'+
                                   '#scrollNav-main{float:left;width:'+(scrollNav.conf.width-60)+'px;height:'+scrollNav.conf.height+'px;overflow:hidden;position:relative}'+
                                   '#scrollnav-items{width:20000em;position:absolute;left:0px;height:'+scrollNav.conf.height+'px;line-height:'+scrollNav.conf.height+'px;}'+
                                   '#scrollnav-items .ybox-obj img{height:'+(scrollNav.conf.height-20)+'px;margin:5px 5px;background:'+scrollNav.conf.bgStyle+';padding:5px;border:none;}'+
                                   '</style>';
                                     
                        scrollNav.style=$(scrollNav.style).prependTo('body');
                        
                        var elements='<div id="scrollnav-wrap">'+
                                        '<a id="scrollnav-pre"></a>'+
                                        '<div id="scrollNav-main">'+
                                            '<div id="scrollnav-items"></div>'+
                                        '</div>'+
                                        '<a id="scrollnav-next"></a>'+
                                    '</div>';
                                    
                        if(scrollNav.conf.position=='top'){
                            mainBox.yOverlayContain.prepend(elements);
                        }else{
                            mainBox.yWrap.after(elements).height($(window).height()-scrollNav.conf.height);
                        }			    
                        mainBox.yObj
                        .addClass('not-scrollnav-obj')
                        .clone()
                        .prependTo('#scrollnav-items');
                          
                        scrollNav.cacheEl();
                        $('#scrollNav-main').width(this.sNavWrap.width()-60);//fix chrome $(window).width() bug
                        var $images=this.sNavItemsChild.children('img');
                        function fn(){
                            scrollNav.sNavWrap.fadeIn('slow',function(){
                                $images.attr('style','');
                                scrollNav.maxLeft=scrollNav.countWidth(scrollNav.sNavItemsChild.last())-(scrollNav.conf.width-60);
                                if(el){
                                    var self=mainBox.currEl;
                                    var toLeft=-((scrollNav.countWidth(scrollNav.sNavItemsChild.eq(self))-(scrollNav.conf.width-60)/2));
                                   
                                    mainBox.yObj
                                    .removeClass('ybox-active')
                                    .eq(self)
                                    .addClass('ybox-active');
                                  
                                    if(-toLeft>scrollNav.maxLeft){
                                        toLeft=-scrollNav.maxLeft;
                                    }
                                    if(toLeft>0){
                                        toLeft=0;
                                    }
                                    scrollNav.sNavItems.animate({left:toLeft},1000); 
                                }else{
                                    scrollNav.sNavNot.remove();
                                }
                                scrollNav.mainBoxEventReplace();
                            });
                        }
                        window.setTimeout(fn,3000);
                    },
                    
                    countWidth:function(to){
                        return $(to).position().left+$(to).width();
                    },
                    
                    mainBoxEventReplace:function(){
                        mainBox.autoPlay=scrollNav.mainBoxAutoPlay;
                        mainBox.eventEnable=function(){
                            if(mainBox.currEl+1<totalEl)
                            mainBox.bindNextEvent();
                            if(mainBox.currEl-1>=0)
                            mainBox.bindPreEvent();
                            if(!mainBox.conf.autoRun){
                                mainBox.bindCloseEvent();
                                mainBox.yClose.click(function(){scrollNav.style.remove()});
                            }
                            if(mainBox.enableOriSizeEvent){
                                mainBox.bindOriSizeEvent();
                                mainBox.yOriSize.click(function(){
                                    scrollNav.sNavWrap.slideUp(100).data('display','none');
                                    mainBox.yWrap.css('height','auto');
                                });
                            }
                            
                            if(mainBox.enableRestoreEvent){
                                mainBox.bindRestoreEvent();
                                $(window).unbind('scroll');
                            }else{
                                mainBox.fixedElement();
                          
                                if(scrollNav.sNavWrap.data('display')=='none'){
                                    mainBox.yWrap.css('height',$(window).height()-scrollNav.conf.height);
                                    scrollNav.sNavWrap.slideDown(100);
                                }
                            
                            }
                            if(mainBox.autoPlaying){
                                mainBox.bindStopAutoPlayEvent();
                            }else{
                                mainBox.bindAutoPlayEvent();
                            }
                            mainBox.yDesc.removeClass('ybox-disable').addClass('ybox-enable');			   
                            mainBox.bindSelfEvent();
                            scrollNav.bindNextEvent();
                            scrollNav.bindPreEvent();
                            scrollNav.bindSelfEvent();
                            scrollNav.mainBoxNextEvent();
                            scrollNav.mainBoxPreEvent();
                            return this;
                        };
                        mainBox.eventEnable();
                    },
       
                    bindNextEvent:function(){
                        scrollNav.sNavNext
                        .unbind('click.scrollNavNext')
                        .bind('click.scrollNavNext',function(){
                            var toLeft=scrollNav.sNavItems.css('left').replace('px','')*1-(scrollNav.conf.width-60);
                            var width=scrollNav.maxLeft;
                            if(-toLeft>width)
                            toLeft=-width;
                            scrollNav.sNavItems.animate({left:toLeft},1000);
                            return false;
                        });
                    },
                    
                    bindPreEvent:function(){
                        scrollNav.sNavPre
                        .unbind('click.scrollNavPre')
                        .bind('click.scrollNavPre',function(){
                            var toLeft=scrollNav.sNavItems.css('left').replace('px','')*1+scrollNav.conf.width-60;
                            if(toLeft>0){
                                toLeft=0;
                            }
                            scrollNav.sNavItems.animate({left:toLeft},1000);
                            return false;
                        });
                    },
                    
                    bindSelfEvent:function(){
                        mainBox.yObj
                        .unbind('click.scrollNavSelf')
                        .bind('click.scrollNavSelf',function(){
                            if($('#scrollnav-wrap').length<1){
                                scrollNav.install(true);
                            }
                        
                            var currLeft=scrollNav.sNavItems.css('left').replace('px','');
                            var selfWidth=scrollNav.countWidth(this);				
                            var toLeft=(((mainBox.yOverlay.width()-60)/2)-(selfWidth-(-currLeft)))*1+currLeft*1;
                            
                            if(-toLeft>scrollNav.maxLeft){
                                toLeft=-scrollNav.maxLeft;
                            }else if(toLeft>0){
                                toLeft=0;
                            }
                            scrollNav.sNavItems.animate({left:toLeft},1000);
                            return false;
                        });
                    },
                    
                    mainBoxAutoPlay:function(){

                        if(mainBox.currEl+1<totalEl){
                            mainBox.currEl+=1;
                            mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                        }else{
                            mainBox.currEl=0;
                            mainBox.eventDisable(mainBox.yDisable).loadNewImg(mainBox.currEl,false);
                        }
                        var currLeft=scrollNav.sNavItems.css('left').replace('px','');
                        var selfWidth=scrollNav.countWidth(scrollNav.sNavItemsChild.eq(mainBox.currEl));				
                        var toLeft=(((mainBox.yOverlay.width()-60)/2)-(selfWidth-(-currLeft)))*1+currLeft*1;
                        if(-toLeft>scrollNav.maxLeft){
                            toLeft=-scrollNav.maxLeft;
                        }else if(toLeft>0){
                            toLeft=0;
                        }
                        scrollNav.sNavItems.animate({left:toLeft},1000);
                    },
                    
                    mainBoxNextEvent:function(){
                        mainBox.yNext
                        .unbind('click.scrollNavMainNext')
                        .bind('click.scrollNavMainNext',function(){
                            var currLeft=scrollNav.sNavItems.css('left').replace('px','');
                            var selfWidth=scrollNav.countWidth(scrollNav.sNavItemsChild.eq(mainBox.currEl));				
                            var toLeft=(((mainBox.yOverlay.width()-60)/2)-(selfWidth-(-currLeft)))*1+currLeft*1;
                            if(-toLeft>scrollNav.maxLeft)
                            toLeft=-scrollNav.maxLeft;
                            else if(toLeft>0)
                            toLeft=0;
                            
                            scrollNav.sNavItems.animate({left:toLeft},1000);
                            return false;
                        });				
                    },
                    
                    mainBoxPreEvent:function(){
                           mainBox.yPre
                           .unbind('click.scrollNavMainPre')
                           .bind('click.scrollNavMainPre',function(){
                                var currLeft=scrollNav.sNavItems.css('left').replace('px','');
                                var selfWidth=scrollNav.countWidth(scrollNav.sNavItemsChild.eq(mainBox.currEl));		
                                var toLeft=(((mainBox.yOverlay.width()-60)/2)-(selfWidth-(-currLeft)))*1+currLeft*1;
                                if(-toLeft>scrollNav.maxLeft)
                                toLeft=-scrollNav.maxLeft;
                                else if(toLeft>0)
                                toLeft=0;
                                scrollNav.sNavItems.animate({left:toLeft},1000);
                                return false;
                           });				
                    }
            };
            return scrollNav;
        }
})(jQuery);