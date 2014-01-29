$(function(){


    var ModelB = Backbone.Model.extend({
        url:'/data/text1.json',
        parse: function (jsonObject) {
            return jsonObject;
        }
    });



    var ViewB = Backbone.View.extend({
        el : '.list-group',
        initialize: function(){
            this.template = _.template($('#htmlTemplate').html()),
            this.model.bind("change", this.render, this);
        },

        render: function(){
            var htmlTemplate = _.template($('#htmlTemplate').html(), this.model.toJSON());
            this.$el.append(htmlTemplate);
            var pOffset =  $("li:last-child").position().top;
            $('.jumbotron').scrollTop(pOffset);
        }

    });

    var loadMessage = function(modelB, i, timeout){

        setTimeout(function(){
            modelB.url= '/data/text'+i+'.json';
            modelB.fetch();
        },timeout);

    };

    var modelB = new ModelB({url: '/data/text1.json'});
    var viewB = new ViewB({model:modelB});


    var numberOfMessages=7;
    var timeout= 2000;
    for (var i=1; i<=numberOfMessages; i++){
        loadMessage(modelB,i, timeout);
        timeout+=2000;
    }


})
