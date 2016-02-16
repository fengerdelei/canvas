function shape(canvas,canvas1,cobj,selectObj){
    this.canvas=canvas;
    this.canvas1=canvas1;
    this.cobj=cobj;
    this.bgColor='#000';
    this.borderColor='#000';
    this.lineWidth=1;
    this.type='stroke';
    this.shapes='line';
    this.history=[];
    this.selectObj=selectObj;
}
var arr=[];
shape.prototype={
    init:function(){
        this.selectObj.css('display','none');
        if(this.temp){
            this.history.push(this.cobj.getImageData(0,0,this.canvas1.width,this.canvas1.height));
            this.temp=null;
        }
        this.cobj.fillStyle=this.bgColor;
        this.cobj.strokeStyle=this.borderColor;
        this.cobj.lineWidth=this.lineWidth;
    },
    line:function(x,y,x1,y1){
        this.init();
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
        this.cobj.closePath();
    },
    rect:function(x,y,x1,y1){
        this.init();
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    arc:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.init();
        this.cobj.beginPath();
        this.cobj.arc(x,y,r,0,Math.PI*2);
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    star:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/2;
        this.init();
        this.cobj.beginPath();
        this.cobj.moveTo(x+r,y);
        for(var i=0;i<10;i++){
            if(i%2==0){
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r);
            }else{
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1);
            }
        }
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    draw:function(){
        var that=this;
        that.init();
        that.canvas.onmousedown=function(e){
            var startX= e.offsetX;
            var startY= e.offsetY;
            e.preventDefault();
            that.canvas.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.canvas1.width,that.canvas1.height);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endX= e.offsetX;
                var endY= e.offsetY;
                that[that.shapes](startX,startY,endX,endY);
            }
            that.canvas.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvas1.width,that.canvas1.height))
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            }
        }
    },
    pen:function(){
        var that=this;
        that.init();
        that.canvas.onmousedown=function(e){
            var startX= e.offsetX;
            var startY= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startX,startY);
            that.canvas.onmousemove=function(e){
                var endX= e.offsetX;
                var endY= e.offsetY;
                that.cobj.lineTo(endX,endY);
                that.cobj.stroke();
            };
            that.canvas.onmouseup=function(){
                //that.cobj.closePath();

                that.history.push(that.cobj.getImageData(0,0,that.canvas1.width,that.canvas1.height));
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            };
        };
    },
    eraser:function(obj){
        var that=this;
        that.init();
        that.canvas.onmousemove=function(e) {
            var ox = e.offsetX;
            var oy = e.offsetY;
            var w = obj.width();
            var h = obj.height();
            var lefts = (ox - w / 2);
            var tops = (oy - h / 2);
            if(lefts<0){
                lefts=0;
            }
            if(tops<0){
                tops=0;
            }
            if(lefts>that.canvas1.width-w){
                lefts=that.canvas1.width-w;
            }
            if(tops>that.canvas1.height-h){
                tops=that.canvas1.height-h;
            }
            console.log(that.canvas1.width);
            obj.css({
                left: lefts,
                top: tops
            })
        }
        that.canvas.onmousedown = function () {
            that.canvas.onmousemove = function (e) {
                var ox = e.offsetX;
                var oy = e.offsetY;
                var w = obj.width();
                var h = obj.height();
                var lefts = (ox - w/2);
                var tops = (oy - h/2) ;
                obj.css({
                    left: lefts,
                    top: tops,
                    display:'block'
                })
                that.cobj.clearRect(lefts, tops, w, h);
            }
            that.canvas.onmouseup = function () {
                obj.css('display','none');
                that.history.push(that.cobj.getImageData(0,0,that.canvas1.width,that.canvas1.height))
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
            }
        }
    },
    select:function(selectAreaObj){
        var that=this;
        that.init();
        that.canvas.onmousedown=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var minx,miny, wd,hg;
            that.canvas.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=ox>endx?endx:ox;
                miny=oy>endy?endy:oy;
                wd=Math.abs(endx-ox);
                hg=Math.abs(endy-oy);
                selectAreaObj.css({
                    width:wd,
                    height:hg,
                    left:minx,
                    top:miny,
                    display:'block'
                })
            }
            that.canvas.onmouseup = function () {
                that.temp=that.cobj.getImageData(minx,miny,wd,hg);
                that.cobj.clearRect(minx,miny,wd,hg);
                that.history.push(that.cobj.getImageData(0,0,that.canvas1.width,that.canvas1.height))
                that.canvas.onmousemove = null;
                that.canvas.onmouseup = null;
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,wd,hg,selectAreaObj);
            }
        }
    },
    drag:function(x,y,w,h,selectAreaObj){
        var that=this;
        that.canvas.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor='move';
            }else{
                that.canvas.style.cursor='default';
            }
        }
        that.canvas.onmousedown=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx=ox-x;
            var cy=oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor='move';
            }else{
                that.canvas.style.cursor='default';
                return;
            }
            that.canvas.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.canvas1.width,that.canvas1.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                if(lefts<0){
                    lefts=0;
                }
                if(tops<0){
                    tops=0;
                }
                if(lefts>that.canvas1.width-w){
                    lefts=that.canvas1.width-w;
                }
                if(tops>that.canvas1.height-h){
                    tops=that.canvas1.height-h;
                }
                selectAreaObj.css({
                    left:lefts,
                    top:tops
                })
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
            }
            that.canvas.onmouseup=function(){
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
                that.drag(x,y,w,h,selectAreaObj);
            }
        }
    }
}