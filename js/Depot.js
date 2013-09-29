window.Parcel = window.Parcel || { };

Parcel.Depot = function(options) {
    this.settings = $.extend({
        top: 0,
        left: 0
    }, options);
    // The parcels ready to be shipped.
    this.storage = [];
    this.$el = $([
        '<div class="depot visit">',
            '<div class="delivery-image"></div>',   
            '<div class="delivery-storage">',
                '<h6 class="delivery-storage-header">Storage</h6>',
            '</div>',
        '</div>'
    ].join('')).appendTo('body');
    this.$el.css({
        top: this.settings.top - this.$el.height() / 2,
        left: this.settings.left - this.$el.width() / 2
    });
};

Parcel.Depot.prototype.add = function(parcel) {
    if (!parcel instanceof Parcel.Parcel) return;
    this.storage.push(parcel);
    $('.delivery-storage', this.$el).append([
        '<div class="depot-parcel" data-addr="', parcel.to.address, '">',
            '<span class="glyphicon glyphicon-chevron-right"></span> ', parcel.to.address, 
        '</div>'
    ].join(''));
};
