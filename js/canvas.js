$(function(){
    var canvas=$('canvas');
    var box=$('.box');
    var top=$('.top');
    var cobj=canvas[0].getContext('2d');
    var x=box.width();
    var y=box.height();
    canvas.attr({width:x,height:y});

    var menu=$('.menu-list');
    menu.hover(function(){
        $(this).find('li').finish();
        $(this).find('li').fadeIn(300);
    },function(){
        $(this).find('li').finish();
        $(this).find('li').fadeOut(300);
    })
    var obj=new shape(top[0],canvas[0],cobj,$('.selectArea'));
    menu.eq(0).find('li').click(function(){
        var index=$(this).index('li');
        if(index==1){
            if(window.confirm('是否保存')) {
                location.href = canvas[0].toDataURL().replace("data:image/png", "data:stream/octet");
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }else if(index==2){

        }else if(index==3){
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            if(obj.history.length>0){
                var last=obj.history.pop();
                cobj.putImageData(last,0,0);
            }else{
                alert('无法返回');
            }
        }else if(index==4){
            location.href=canvas[0].toDataURL().replace("data:image/png", "data:stream/octet");
        }
    });
    menu.eq(1).find('li').click(function(){
        if($(this).attr('data-role')!='pen'){
            obj.shapes=$(this).attr('data-role');
            obj.draw();
        }else{
            obj.pen();
        }
    })
    menu.eq(2).find('li').click(function(){
        obj.type=$(this).attr('data-type');
        obj.draw();
    })
    menu.eq(3).find('input').change(function(){
        obj.borderColor=$(this).val();
        obj.draw();
    })
    menu.eq(4).find('input').change(function(){
        obj.bgColor=$(this).val();
        obj.draw();
    })
    menu.eq(5).find('li').click(function(){
        obj.lineWidth=$(this).attr('data-type');
        obj.draw();
    })
    menu.eq(6).find('li').click(function(){
        var wd=$(this).attr('data-type');
        var hg=$(this).attr('data-type');
        $('.eraser').css({
            width:wd,
            height:hg,
            display:'block'
        });
        obj.eraser($('.eraser'));
    })
    menu.eq(7).click(function(){
        obj.select($('.selectArea'));
    })
})