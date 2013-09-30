window.Parcel = window.Parcel || { };

Parcel.Depot = function(options) {
    this.settings = $.extend({
        top: 0,
        left: 0
    }, options);
    // The parcels ready to be shipped.
    this.storage = [];
    this.$el = $([
        '<div class="delivery depot visit">',
            '<div class="delivery-image"></div>',   
            '<div class="delivery-options">',
                '<button class="btn btn-sm btn-default depot-ship">Ship</button>',
            '</div>',
            '<div class="delivery-storage">',
                '<h6 class="depot-storage-header">Storage</h6>',
            '</div>',
        '</div>'
    ].join('')).appendTo('body');
    this.$el.css({
        top: this.settings.top - this.$el.height() / 2,
        left: this.settings.left - this.$el.width() / 2
    });
    $('.depot-ship', this.$el).on('click', this.ship.bind(this));
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

Parcel.Depot.prototype.ship = function(e) {
    if (this.storage.length == 0) {
        alert('There must be orders before shipping. Try clicking "order" on a delivery location.');
        return;
    }
    $(window).trigger('Parcel.Depot.Ship', { depot: this });
};

// Just simply empties the storage and returns all parcels.
// Convience method so outer classes dont affect the inner working of this class.
Parcel.Depot.prototype.loadParcels = function() {
    var parcels = this.storage;
    this.storage = [];
    $('.depot-parcel', this.$el).remove();
    return parcels;
};
