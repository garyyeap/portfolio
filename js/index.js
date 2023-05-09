$(function(){
    $('#main-content').css({
        height : '500px',
        background : 'url(images/loading1.gif) no-repeat center'
    })
    .children()
    .hide();
    $('#main-content').imagesLoaded(function(){

        $('#main-content').css({
            height : '',
            background : ''
        })
        .masonry({
            itemSelector: 'li',
            columnWidth: 10
        })
        .children()
        .fadeIn(300);
        
        $('.ybox')
        .yBox({autoRun:false})
        .enableScrollNav({height:100});	
    });
});