window.Parcel = window.Parcel || { };

Parcel.DeliveryLocation = function(options) {
    this.types = ['house', 'factory', 'office'];
    this.settings = $.extend({
        top: 0,
        left: 0,
        type: null,
        address: null // A unique address for this location. ex. 1678 or 6584 Lynnford Rd.
    }, options);
    this.parcels = 0;
    if (this.settings.type === null || $.inArray(this.settings.type, this.types) === -1)
        this.settings.type = this.types[Math.floor(Math.random() * 3)];
    // Create a random address if one is not provided.
    if (this.settings.address === null) {
        var streetNames = ['Lynnford', 'Sycamore', 'Clifdon', 'Pine', 'Maple', 'Cedar', 'Fourth', 'Fifth', 'Second', 'Hill', 'Lake'];
        var roads = ['Rd.', 'Ct.', 'Ln.', 'Hwy.', 'Dr.'];
        this.settings.address = Math.floor(Math.random() * 9999) + ' ' + 
                                streetNames[Math.floor(Math.random() * streetNames.length)] + ' ' + 
                                roads[Math.floor(Math.random() * roads.length)];
    }
    this.address = this.settings.address;
    this.$el = $([
        '<div class="', this.settings.type, ' delivery visit" data-addr="', this.address, '">',
            '<div class="delivery-image"></div>',
            '<div class="delivery-received">Received: 0</div>',
            '<div class="delivery-address">', this.address, '</div>',
            '<div class="delivery-options">',
                '<button class="btn btn-sm btn-default delivery-order">Order</button>',
            '</div>',
        '</div>'
    ].join('')).appendTo('body');
    this.$el.css({
        top: this.settings.top - this.$el.height() / 2,
        left: this.settings.left - this.$el.width() / 2
    });
    $('.delivery-order', this.$el).on('click', this.order.bind(this));
};

// Triggers a window event to request an order.
Parcel.DeliveryLocation.prototype.order = function() {
    $(window).trigger('Parcel.DeliveryLocation.Order', { location: this });
};

Parcel.DeliveryLocation.prototype.receive = function(parcel) {
    $('.delivery-received', this.$el).text('Received: ' + ++this.parcels);
};
