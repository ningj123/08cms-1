/**
* author : ahuing
* date   : 2015-04-10
* name   : jqDuang v1.15
* modify : 2015-9-14 18:01:17
 */
!function ($) {
    var Duang = function (self, opt) {
        this.o         = $.extend({}, Duang.defaults, opt)
        this.$self     = $(self)
        var aObj       = this.o.obj.split('|');
        this.$obj      = this.$self.find(aObj[0])
        this.$objExt   = $(aObj[1])
        // ����������л����󲻴���,����չ������Ϊ�����Ķ���,��չ�������
        if (!this.$obj.length) {
            this.$obj = this.$objExt
            this.$objExt = []
        };
        /*aObj.shift();
        if (aObj.length) this.$objExt   = $.map(aObj, function (n) {
            return $(n);
        })*/
// ����
        this.dire    = $.inArray(this.o.effect, ['left','leftLoop','leftMarqueue']) < 0 && 'top' || 'left'
        this.objAttr = this.dire == 'top' && 'height' || 'width'
        this.index   = this.o.index
        this.effect  = this.o.effect.replace(this.dire, '')
        this.L       = this.$obj.length
        // ��ҳ
        this.pages   = !this.effect 
        // ��ѭ������
        && Math.ceil((this.L - this.o.visible) / this.o.steps) + 1 
        // ѭ������
        || Math.ceil(this.L / this.o.steps); 
        
        this.WH      = {
            width    : this.$obj.outerWidth(true)
            , height : this.$obj.outerHeight(true)
        }
    }

    Duang.defaults = {
        obj           : 'li'
        , cell        : ''
        , trigger     : 'mouseover' //click mouseover
        , effect      : 'fade' //Ч�� fold left leftLoop
        , speed       : 500 //�����ٶ�
        , index       : 0 //Ĭ������
        , autoplay    : 1 //�Զ�����
        , interval    : 3000 //���ż��ʱ��
        , prevbtn     : '' //��һ��
        , nextbtn     : '' //��һ��
        , delay       : 150 //�ӳ�ʱ��,�Ż�click or mouseoverʱ�ӳ��л�
        , easing      : 'swing'
        // , wrapsize : 0 //����С
        , visible     : 1 //�ɼ�����
        , steps       : 1 //ÿ���л�������
        , overstop    : 1 //�����ͣ
        , showtit     : 0
        , pagewrap    : ''
        , btnLoop     : 1
        , wheel       : 0
        , actclass    : 'act'
    }

    Duang.prototype = {
        init : function () {
            var _this = this
            , o       = _this.o
            , $obj    = _this.$obj
            , $objP   = $obj.parent()
            , $objPP  = $objP.parent();
            
            if (_this.pages <= 1 || _this.L <= o.visible) return;
            // o.wrapsize && (_this.WH[_this.objAttr] = o.wrapsize);
            !o.speed && (_this.effect = 'fade');


            switch(_this.effect){
                case 'fade' :
                    $obj.css({
                        display : 'none'
                    }).eq(o.index).show();

                    // $objPP.css(_this.WH);
                    break;
                case 'fold' :
                    $obj.css({
                        position  : 'absolute'
                        , display : 'none'
                        , left    : 0
                        , top     : 0
                    }).eq(o.index).show();

                    var ppCss = _this.WH;
                    ppCss['position'] = 'relative';
                    $objPP.css(ppCss);
                    break;
                case 'weibo' :
                    $objP.css('position', 'relative');
                    var ppCss = {position:'relative',overflow: 'hidden'};
                    // ppCss[_this.objAttr] = o.wrapsize || _this.WH[this.objAttr] * o.visible
                    ppCss[_this.objAttr] = _this.WH[this.objAttr] * o.visible
                    $objPP.css(ppCss);
                    break;
                case 'Marqueue' :
                default :
                    $obj.css({
                        float : _this.dire == 'top' ? 'none' : 'left'
                    });

                    var pCss = {position : 'relative', overflow : 'hidden'};
                    pCss[_this.dire] = -_this.WH[_this.objAttr] * o.index;
                    pCss[_this.objAttr] = 9999;

                    if (_this.effect) {
                        _this.$obj = $objP
                                    .append($obj.slice(0, o.visible).clone())
                                    .prepend($obj.slice($obj.length - o.visible).clone())
                                    .children();

                        pCss[_this.dire] = -(o.visible + o.index * o.steps) * _this.WH[_this.objAttr];
                        // marqueue
                        if (_this.effect == 'Marqueue') {
                            _this.s = -1;
                            _this.scrollSize = _this.WH[_this.objAttr] * _this.L;
                        }
                    };
                    $objP.css(pCss);

                    var ppCss = {overflow: 'hidden', position: 'relative'};
                    // ppCss[_this.objAttr] = o.wrapsize || _this.WH[_this.objAttr] * o.visible;
                    // �������ı߾�,����������ͼƬ���߶���
                    var $obj1 = $obj.eq(0);
                    var marginMore = parseInt($obj1.css('margin-' + this.dire)) - parseInt($obj1.css('margin-' + (this.dire == 'left' ? 'right' : 'bottom')));
                    // �������ĳߴ�
                    // ppCss[_this.objAttr] = o.wrapsize || _this.WH[_this.objAttr] * o.visible + marginMore;
                    ppCss[_this.objAttr] = _this.WH[_this.objAttr] * o.visible + marginMore;
                    
                    $objPP.css(ppCss);
            }

            // ��ҳ
            var t;
            if (o.cell && _this.effect != 'Marqueue') {
                var aCell = o.cell.split('|');

                _this.$cells = aCell.length > 1 ? _this.$self.find(aCell[1]) : _this.$self.find(aCell[0]).children();
                if (_this.$cells.length) _this.$cells = _this.$cells.slice(0, _this.pages);
                else {
                    var __html = '';
                    for (var i = 0; i < _this.pages; i++) __html += '<i>' + (i + 1) + '</i>';
                    _this.$cells = $(__html).appendTo(_this.$self.find(aCell[0]));
                }
                _this.$cells[o.trigger](function() {
                    clearTimeout(t);
                    _this.loopNext = _this.$cells.index(this);
                    t = setTimeout(function () {
                        _this.play(_this.loopNext);
                    }, o.delay)
                    //���ʱ��ֹ��ת
                    if(o.trigger == 'click') return false;
                })
                .eq(_this.index).addClass(o.actclass);
            }; 

            // �Զ�����
            if (o.autoplay * 1) {
                _this.start();
                (o.overstop * 1) && 
                    _this.$obj
                    // $objPP
                    .add(_this.$cells)
                    .add(o.prevbtn && _this.effect != 'Marqueue' && o.prevbtn + ',' + o.nextbtn || null)
                    .on('mouseover', $.proxy(_this.stop, _this))
                    .on('mouseout', $.proxy(_this.start, _this))
                    /*
                    .on('mouseover mouseout', function(e) {
                        console.log(this);
                        _this[e.type == 'mouseover' ? 'stop' : 'start']();
                    })*/
            };

            // ��ʾ����
            o.showtit * 1 && o.visible == 1 && $objPP.after('<a class="tit-duang" target="_blank" href="' + $obj.eq(o.index).data('url') + '">' + $obj.eq(o.index).data('title') + '</a>')
 
            // ҳ��
            o.pagewrap && _this.$self.find(o.pagewrap).html(_this.index * 1 + 1 + '/' + _this.pages);

            // ��һ����һ��
            o.prevbtn && goBtn('prev') && goBtn('next')

            function goBtn(p) {
                var $pnBtn = _this.$self.find(o[p + 'btn']);
                !(o.btnLoop * 1) && p == 'prev' && $pnBtn.addClass('disabled');
                $pnBtn[_this.effect == 'Marqueue' ? o.trigger : 'click'](function() {
                    if ($(this).hasClass('disabled')) return;
                    _this.s = p == 'next' ? -1 : 1;
                    if (_this.effect == 'Marqueue') _this.next();
                    else _this[p]()
                }).attr({
                    unselectable : 'on'
                    , onselectstart : 'return false;'
                });
                return true;
            }
            // �������л�
            o.wheel * 1 && $.fn.mousewheel && $objPP.mousewheel(function(e, d) {
                clearTimeout(t);
                t = setTimeout(function () {
                    _this[d > 0 ? 'prev' : 'next']()
                }, 100)
            });
            // ������չ���л�����
            /*_this.$objExt && $.each(_this.$objExt, function (j, e) {
                e.css('display','none').eq(o.index).show()
            });*/
            _this.$objExt.length > o.index && _this.$objExt.css('display','none').eq(o.index).show();

        }
        , start : function () {
            clearInterval(this.t1);
            this.t1 = setInterval($.proxy(this.next, this), this.o.interval);
        }
        , stop : function () {
            clearInterval(this.t1);
        }
        , next : function () {
            this.play(this.effect != 'Marqueue' && (this.loopNext = this.index + 1) % this.pages);
        }
        , prev : function () {
            this.loopNext = this.index - 1;
            this.play((this.loopNext + this.pages) % this.pages);
        }
        , play : function (next) {
            var _this  = this
            , o        = _this.o
            , $obj     = _this.$obj
            , $objP    = $obj.parent()
            , loopNext = _this.loopNext;

            if (_this.index == next && _this.effect != 'Marqueue') return;

            _this.$self.trigger('beforeFun');
            switch(_this.effect){
                case 'fade' :
                    $obj.eq(_this.index).hide()
                    $obj.eq(next).animate({opacity: 'show'}, o.speed, o.easing);
                    break;
                case 'fold' :
                    $obj.stop(true, true).eq(_this.index)
                    .animate({opacity: 'hide'}, o.speed, o.easing);

                    $obj.eq(next)
                    .animate({opacity: 'show'}, o.speed, o.easing);
                    break;
                case 'Marqueue' :
                    $objP.css(_this.dire, function (i, v) {
                        var offset = parseInt(v) + _this.s;
                        if (offset <= -_this.scrollSize) offset = 0;
                        else if (offset >= 0) offset = - _this.scrollSize;
                        return offset;
                    });
                    break;
                case 'weibo' :
                        var  pCss = {};
                        pCss[_this.dire] = _this.WH[_this.objAttr] * 9 / 8;

                        $objP.stop(true, true)
                        .animate(pCss, o.speed, o.easing, function() {
                            var oLi = $objP.children()[$obj.length - 1];
                            oLi.style.display = 'none';
                            $objP[0].insertBefore(oLi, $objP[0].children[0]);
                            $objP[0].style.top = 0;
                            $(oLi).fadeIn()
                        });
                    break;
                default :
                    var mm = 0;
                    if (this.effect == 'Loop') {
                        if ($objP.is(':animated')) return false;;
                        var offset, _mod = _this.L % o.steps; 
                        // ��һҳ
                        if (_mod && loopNext == _this.pages) {
                            mm = _mod - o.steps;
                        }
                        // ���һҳ
                        else if (_mod && loopNext == -1) {
                            mm = o.steps - _mod;
                        }
                        offset = loopNext * o.steps + o.visible + mm;
                        var comFun = function () {
                            $objP.css(_this.dire, -_this.WH[_this.objAttr] * (next * o.steps + o.visible));
                        }
                    }
                    else if (loopNext == _this.pages - 1 || loopNext == - 1) {
                        mm = _this.L - next * o.steps - o.visible
                    };

                    // offset = offset || next * o.steps + mm;
                    // offset = this.effect == 'Loop' && offset || next * o.steps + mm;

                    var pCss = {};
                    // pCss[_this.dire] = -_this.WH[_this.objAttr] * offset;
                    pCss[_this.dire] = -_this.WH[_this.objAttr] * (this.effect == 'Loop' ? offset : next * o.steps + mm);

                    $objP.stop(true)
                    .animate(pCss, o.speed, o.easing, comFun);
            } // switch end
            // ����
            if(o.showtit * 1 && o.visible == 1) {
                var nextEleData = $obj.eq(next + (this.effect == 'Loop' ? 1 : 0)).data();
                _this.$self.find('.tit-duang').html(nextEleData.title)[0].href = nextEleData.url;
            }
            // ��ҳ
            o.pagewrap && _this.$self.find(o.pagewrap).html(next + 1 + '/' + _this.pages);
            // ���ư�ť
            o.cell && _this.$cells.removeClass(o.actclass).eq(next).addClass(o.actclass)
            // ��չ����, next����ʱû����չ����,��ִ��
            _this.$objExt.length > next && _this.$objExt.css('display','none').eq(next).show();
            // 
            _this.index = next;
            // ��ťѭ��
            if (!(o.btnLoop * 1) && o.prevbtn) {
                _this.$self.find(o.prevbtn + ',' + o.nextbtn).removeClass('disabled');
                next == 0 && _this.$self.find(o.prevbtn).addClass('disabled');
                next == _this.pages - 1 && _this.$self.find(o.nextbtn).addClass('disabled');
            }
            _this.$self.trigger('afterFun',[next]);
        }

    }

    function Plugin(option) {
        return option == 'index' ? this.data('jqDuang').index : this.each(function () {
            var $this   = $(this)
            var data    = $this.data('jqDuang')
            var options = typeof option == 'object' && option

            if (!data) {
                $this.data('jqDuang', (data = new Duang(this, options)));
                data.init();
            }

            if (typeof option == 'string') data[option]()
            else if(typeof option == 'number') data.play(data.loopNext = option)
        })
    }

    var old = $.fn.jqDuang;

    $.fn.jqDuang             = Plugin
    $.fn.jqDuang.Constructor = Duang;

    $.fn.jqDuang.noConflict = function () {
        $.fn.jqDuang = old
        return this
    }

    $(window).on('load', function () {
        $('.jqDuang').each(function() {
            var $this = $(this);
            Plugin.call($this, $this.data())
        });
    })
}(jQuery);