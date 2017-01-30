(function (module, global) {
    module.Views.ChatRoom = Backbone.View.extend({
        el: '#chatRoom',

        ui: {
            message: '#message',
            board: '.chatBoard'
        },

        initialize: function () {
            var self = this;
            this.socket = io();
            this.socket.on('chat message', function (msg) {
                self.render(msg);
            });
        },

        render: function (message) {
            var compiled = _.template("<div class='alert alert-warning alert-dismissible'><div class='message-arrow'></div><div class='message'><%= message %></div></div>");
            this.$(this.ui.board).append(compiled({
                message: message
            }));
        },

        events: {
            'click #send': 'send',
            'keyup #message': 'enter'
        },

        enter: function (e) {
            if (String(e.keyCode) === '13') {
                this.send(e);
            }
        },

        send: function (e) {
            e.preventDefault();
            var $message = this.$(this.ui.message);
            if ($message.val()) {
                this.socket.emit('chat message', $message.val());
                $message.val('');
            }
        }
    });
})(Prestame.modules('Chat'));