window.Parcel = window.Parcel || { };

Parcel.Warehouse = function(options) {
    this.settings = $.extend({
        top: 0,
        left: 0
    }, options);
    this.$el = $([
        '<div class="warehouse depot visit">',
            '<div class="delivery-image"></div>',    
        '</div>'
    ].join('')).appendTo('body');
    this.$el.css({
        top: this.settings.top - this.$el.height() / 2,
        left: this.settings.left - this.$el.width() / 2
    });
};
