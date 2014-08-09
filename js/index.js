(function(){
    var oContainer = document.getElementById('container');
    var oPrev = document.getElementById('prev');
    var oNext = document.getElementById('next');

    var ROW = 4,//行数
        COL = 6,//列数
        NUM = ROW * COL,//总个数
        BIG_IMG_WIDTH = 750,//大图宽度
        BIG_IMG_HEIGHT = 500,//大图高度
        THUMB_IMG_WIDTH = THUMB_IMG_HEIGHT = 125;//缩略图宽度和高度
    
    var bClickd = false;//用来标记是否处于图片格子状态；
    var iNow = 0;//用来显示大图데索引



    //预加载所有图片
    var iLoaded = 0;//用来记录加载完毕的图片的个数
    for(var i=1;i<=NUM;i++){
        var oBigImg = new Image();
        oBigImg.src = 'img/' + i + '.jpg';//加载大图
        oBigImg.onload = function(){
            if(++iLoaded == NUM*2){//加载完了所有的图片
                loadSuccess();
            }
        };
        var oThumbImg = new Image();
        oThumbImg.src = 'img/thumbs/' + i + '.jpg';//加载缩略图
        oThumbImg.onload = function(){
            if(++iLoaded == NUM*2){//加载完了所有的图片
                loadSuccess();
            }
        };
    }

    function loadSuccess(){
        var index = 0;//表示图片的索引
        var iColGap = (oContainer.offsetWidth-COL*THUMB_IMG_WIDTH)/(COL+1),//列与列之间的宽度
            iRowGap = (oContainer.offsetHeight-ROW*THUMB_IMG_HEIGHT)/(ROW+1);//行与行之间的宽度


        for(var i=0;i<ROW;i++){
            for(var j=0;j<COL;j++){
                var oDiv = document.createElement('div');
                oDiv.pos = {
                    left:parseInt(iColGap+j*(iColGap+THUMB_IMG_WIDTH)),
                    top:parseInt(iRowGap+i*(iRowGap+THUMB_IMG_HEIGHT))
                };
                oDiv.index = index;
                oDiv.martrix = {//矩阵对象，用来记录格子的行号和列号
                    col:j,
                    row:i
                };
                oDiv.style.left = (-Math.random()*300-200) + 'px';
                oDiv.style.top = (-Math.random()*300-200) + 'px';
                oDiv.className = 'img';

                oDiv.style.width = THUMB_IMG_WIDTH + 'px';
                oDiv.style.height = THUMB_IMG_HEIGHT + 'px';
                oDiv.style.background = 'url(img/thumbs/'+(index+1)+'.jpg)';
                oDiv.innerHTML = '<span></span>';
                oContainer.appendChild(oDiv);
                index++;
            }
        }

        var aImg = document.getElementsByClassName('img');
//        setTimeout(function(){//小技巧:用0来作为延迟时间，主要是这个时候setTimeout相当于另一个事件队列，而js是单线程的，这样就能等到上个队列执行完，才会这行这个事件队列里的；
//            aImg[23].style.left = '800px';
//            aImg[23].style.top = '400px';
//        },0);
//        console.log(aImg);
        index--;//上面的循环结束后，index的值为24，所以要先减一次
        var timer = setInterval(function(){
            aImg[index].style.left = aImg[index].pos.left + 'px';
            aImg[index].style.top = aImg[index].pos.top + 'px';
            setStyle3d(aImg[index],'transform',"rotate("+(Math.random()*40-20)+"deg)");
            
            aImg[index].addEventListener('click',clickHandle,false);
            
            index--;
            if(index == -1){
                clearInterval(timer);
            }

        },100);
        function clickHandle(){
            var oSpan;
            if(bClickd){//表示已经合并，点击则打散
                for(var i=0;i<aImg.length;i++){
                    oSpan = aImg[i].getElementsByTagName('span')[0];

                    aImg[i].style.left = aImg[i].pos.left + 'px';
                    aImg[i].style.top = aImg[i].pos.top + 'px';
                    setStyle3d(aImg[i],'transform',"rotate("+(Math.random()*40-20)+"deg)");
                    oSpan.style.opacity = 0;
                    aImg[i].className = 'img';
                }
                oPrev.style.display = oNext.style.display = 'none';

            }else{//需要合并成一张大图
                var bigImgPos = {
                    left:(oContainer.offsetWidth-BIG_IMG_WIDTH)/2,
                    top:(oContainer.offsetHeight-BIG_IMG_HEIGHT)/2
                };
                iNow = this.index;
                for(var i=0;i<aImg.length;i++){
                    oSpan = aImg[i].getElementsByTagName('span')[0];

                    oSpan.style.background = 'url(img/'+(this.index+1)+'.jpg) '+(-aImg[i].martrix.col*THUMB_IMG_WIDTH) + 'px ' + (-aImg[i].martrix.row*THUMB_IMG_HEIGHT) +'px';
                    oSpan.style.opacity = 1;
                    aImg[i].style.left = bigImgPos.left + aImg[i].martrix.col*(THUMB_IMG_WIDTH+1) + 'px';
                    aImg[i].style.top = bigImgPos.top + aImg[i].martrix.row*(THUMB_IMG_HEIGHT+1) + 'px';
                    setStyle3d(aImg[i],'transform','rotate(0deg)');
                    aImg[i].className = "img piece";
                }
                oPrev.style.display = oNext.style.display = 'block';
            }
            bClickd = !bClickd;
        }
        oPrev.onclick = oNext.onclick = function(){
            if(this == oPrev){
                iNow--;
                if(iNow == -1){
                    iNow = NUM - 1;
                }
            }else{
                iNow++;
                if(iNow == NUM){
                    iNow = 0;
                }
            }
            var arr =[];
            for(var i=0;i<NUM;i++){
                arr.push(i);
            }
            arr.sort(function(){//一个小技巧，产生乱序排序
                return Math.random() - 0.5;
            });
            var timer = setInterval(function(){
                var item = arr.pop();
                aImg[item].getElementsByTagName('span')[0].style.background = 'url(img/'+(iNow+1)+'.jpg) '+(-aImg[item].martrix.col*THUMB_IMG_WIDTH) + 'px ' + (-aImg[item].martrix.row*THUMB_IMG_HEIGHT) + 'px';
                if(arr.length == 0){
                    clearInterval(timer);
                }
            },30);
        };
    }

    function setStyle3d(elem,attr,value){
        ['Webkit','Moz','Ms','O',''].forEach(function(prefix){
            elem.style[prefix+attr.charAt(0).toUpperCase()+attr.substr(1)] = value;
        });
    }

})();