(function (module, global) {
    module.Routers.Chat = Backbone.Router.extend({
        routes: {
            '': 'chatRoom'
        },

        chatRoom: function () {
            module.Views.chatRoom = module.Views.chatRoom || new module.Views.ChatRoom();
        }

    });

    $(document).ready(function () {
        module.Routers.chat = module.Routers.chat || new module.Routers.Chat();
        Backbone.history.start();
    });

})(Prestame.modules('Chat'));