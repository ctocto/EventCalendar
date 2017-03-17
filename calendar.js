/* 
* @Author: Marte
* @Date:   2016-12-08 20:48:54
* @Last Modified by:   Marte
* @Last Modified time: 2017-03-17 10:23:11
*/
var Calendar = {
    nowDate : new Date(),  
    weekArr : ["日", "一", "二", "三", "四", "五", "六"],
    init: function(el, options){
        
        this.$el = $(el);
        this.initialize(options);
        this.swiper();
    },
    initialize: function(options) {
        this.opt = options;
        if (this.opt && this.opt.checkDate) {

            this.nowDate = new Date(this.opt.checkDate);
        };
        this.pageIndex = 0;
        this.nowYear = this.nowDate.getFullYear();
        this.nowMonth= this.nowDate.getMonth() + 1;
        this.nowDay= this.nowDate.getDate();
        this.nowWeek = this.nowDate.getDay();
        this.endDay = new Date(this.nowYear, this.nowMonth, 0).getDate();
        this.firstDayWeek = new Date(this.nowYear, this.nowMonth - 1, 1).getDay();

        this.endDayWeek = new Date(this.nowYear, this.nowMonth, 0).getDay();
        this.preMonthEndDay = new Date(this.nowYear, this.nowMonth - 1, 0).getDate();
        
        $('.year-style').html(this.nowYear+'年'+this.nowMonth+'月');
        this.html();
        this.inPullDate();
        this.events();
    },
    update: function(options) {
        this.initialize(options);
        this.mySwiper.updateSlidesSize();//更新slide个数
        this.mySwiper.slideTo(this.pageIndex, 1000, false);
    },
    swiper: function() {
        this.mySwiper = new Swiper('.swiper-container',{
                    direction: 'horizontal',
                    freeMode : false,
                });
        this.mySwiper.slideTo(this.pageIndex, 0, false);
    },
    html: function(){
        var calendarWrap = '';
        var endRowN = null;
        var endColN = this.endDay + this.firstDayWeek;
        if (endColN < 29) {
            endRowN = 4
        }else if (endColN < 36) {
            endRowN = 5;
        }else {
            endRowN = 6;
        };
        
        for (var ci = 0; ci < endRowN; ci++) {

            var weekLi = '';
            for (var i = 0; i < this.weekArr.length; i++) {
                weekLi += '<li class="fl week-item">' + this.weekArr[i] + '</li>';
            };
            var weekUl = '<ul class="clearfix week-wrap">'+weekLi+'</ul>';

            var dateLi = '';
            for (var i = 0; i < 7; i++) {
                
                dateLi += '<li class="fl date-item"></li>';
                
            };
            var dateUl = '<ul class="clearfix date-wrap">'+dateLi+'</ul>';
            calendarWrap += '<div class="calendar-week-wrapper swiper-slide" data-Dindex="'+ci+'">'+weekUl+dateUl+'</div>';

        };

        this.$el.html(calendarWrap);
        this.$el.find('.date-item').eq(this.firstDayWeek+this.nowDay-1).addClass('hs-date-active');
    },
    inPullDate: function(){
        if (this.opt && this.opt.actionDate) {
            var actions = this.opt.actionDate;
            if (actions[this.nowYear] && actions[this.nowYear][this.nowMonth]) {
                var actionArr = actions[this.nowYear][this.nowMonth];
            };
        };
        //填充前一个月日期
        for (var i = 0; i < this.firstDayWeek; i++) {
            this.$el.find('.date-item').eq(i).text(this.preMonthEndDay - this.firstDayWeek + i + 1);
            if (this.nowMonth == 1) {
                this.$el.find('.date-item').eq(i).attr('data-action-date', (this.nowYear-1)+'-'+(this.nowMonth-1)+'-'+(this.preMonthEndDay - this.firstDayWeek + i + 1));
            }else{
                this.$el.find('.date-item').eq(i).attr('data-action-date', this.nowYear+'-'+(this.nowMonth-1)+'-'+(this.preMonthEndDay - this.firstDayWeek + i + 1));
            };
            this.$el.find('.date-item').eq(i).attr('data-pre-date',true);
        };
        //填充后后一个月日期
        for (var i = 0; i < 6 - this.endDayWeek; i++) {
            this.$el.find('.date-item').eq(this.firstDayWeek+this.endDay+i).text(i+1);
            if (this.nowMonth == 12) {
                this.$el.find('.date-item').eq(this.firstDayWeek+this.endDay+i).attr('data-action-date', this.nowYear+'-'+(this.nowMonth+1)+'-'+(i+1));
            }else{
                this.$el.find('.date-item').eq(this.firstDayWeek+this.endDay+i).attr('data-action-date', (this.nowYear+1)+'-'+(this.nowMonth+1)+'-'+(i+1));
            };
            this.$el.find('.date-item').eq(this.firstDayWeek+this.endDay+i).attr('data-next-date', true);
        };
        //填充当前月日期
        for (var i = 0; i < this.endDay; i++) {
            var actHtml = this.nowYear + '-' + this.nowMonth + '-' + (i+1);
            this.$el.find('.date-item').eq(this.firstDayWeek + i).attr('data-action-date', actHtml);
            this.$el.find('.date-item').eq(this.firstDayWeek+i).text(i+1);
            this.$el.find('.date-item').eq(this.firstDayWeek+i).attr('data-now-date', true);
            if ((i+1) == this.nowDay) {

                this.pageIndex = this.$el.find('.date-item').eq(this.firstDayWeek+i).parents('.calendar-week-wrapper').attr('data-Dindex');
            };
            
            if (actionArr) {

                for (var j = 0; j < actionArr.length; j++) {
                    if (parseInt(actionArr[j]) == (i+1)) {
                  
                        this.$el.find('.date-item').eq(this.firstDayWeek + i).attr('data-action-state', true);
                        break;
                    };
                };
                
            };
        };


    },
    events: function(){
        var _this = this;
        this.$el.on('click', '.tx_dateItem', function(event) {
            event.preventDefault();
            _this.$el.find('.date-item').removeClass('tap-active-date');
            $(this).addClass('tap-active-date');
        });

        $('.J_scrollDate').on('click', '[data-now-date]', function(event) {
            $("[data-now-date]").removeClass('hs-date-active-bg');
            $(this).addClass('hs-date-active-bg');
        });
    }

};
window.Calendar = Calendar;