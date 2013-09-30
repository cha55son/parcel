window.Parcel = window.Parcel || { };

Parcel.Truck = function(options) {
    this.settings = $.extend({
        speed: 0.10,
        top: 10, // Absolute position to spawn the truck.
        left: 10,
        depot: '.depot', // Class of the depot the truck should visit.
        // Callbacks
        arrivedAtDepot: function() { },
        deliveredParcel: function() { },
        finishedDelivering: function() { }
    }, options);
    // $ denotes jQuery objects.
    this.$depot = $(this.settings.depot);
    this.$el = $([
        '<div class="truck">',
            '<img src="img/truck.png" />',
            '<div class="truck-next-stop delivery-address"></div>',
            '<span class="truck-parcels" data-cnt="0">+0</span>',
        '</div>'
    ].join('')).appendTo('body');
    this.parcels = [];
    // Send the truck to the depot to load parcels.
    var self = this;
    this.load(function() {
        // Ship the items
        self.deliver(self.parcels, function() {
            // Return the truck to its starting position.
            self.moveTo(self.settings.top, self.settings.left, function() {
                // The truck is finished.
                self.settings.finishedDelivering.call(self);
            });
        });
    });
};

// Send the truck to the depot to pickup the
// proper amount of parcels for delivery.
Parcel.Truck.prototype.load = function(callback) {
    callback = callback || function() { };
    // Find the depot
    var depotPos = this.getAddrParkPos(this.$depot);
    // Drive the truck to the depot
    var self = this;
    this.moveTo(depotPos.top, depotPos.left, function() {
        self.settings.arrivedAtDepot.call(self);
        callback();
    });
};

// Get the address where the truck should park for delivery.
Parcel.Truck.prototype.getAddrParkPos = function(addr) {
    var pos = addr.position();
    var top = pos.top + (addr.height() / 2 - this.$el.height() / 2);
    var left = pos.left - this.$el.width();
    return { top: top, left: left };
};

// Simply moves the truck to the proper position.
// Using a grid and the A* algorithm to avoid obstacles
// would be really cool with this function.
Parcel.Truck.prototype.moveTo = function(top, left, callback) {
    callback = callback || function() { };
    var self = this;
    var speed = this.getSpeedTo(top, left);
    this.$el.animate({
        top: top,
        left: left
    }, speed, function() {
        callback();
    });
};

// Deliver parcels to their correct addresses.
// Traveling sales man algorithm would be good here.
Parcel.Truck.prototype.deliver = function(parcels, callback) {
    callback = callback || function() { };
    var parcel = parcels[0];
    var pos = this.getAddrParkPos(parcel.to.$el);
    var self = this;
    this.moveTo(pos.top, pos.left, function() {
        // Deliver the parcel
        self.settings.deliveredParcel.call(self, parcel);
        // Remove the parcel from the beginning of the array.
        parcels.shift();
        // Update UI
        self.updateNextStop();
        self.updateParcels();
        if (parcels.length == 0)
            return callback();
        // Recurse until all addresses have been visited.
        self.deliver(parcels, callback);
    });
};

// Return the animation time in milliseconds to move from
// the truck's current position to the given position.
Parcel.Truck.prototype.getSpeedTo = function(top, left) {
    // get the distance
    var truckPos = this.$el.position();
    var xd = left - truckPos.left;
    var yd = top - truckPos.top;
    var dist = Math.sqrt(xd * xd + yd * yd);
    // time = dist / rate
    return dist / this.settings.speed;
};

// Load a parcel onto the truck
Parcel.Truck.prototype.add = function(parcel) {
    if (!parcel instanceof Parcel.Parcel) return; 
    this.parcels.push(parcel); 
    this.updateNextStop();
    this.updateParcels();
};

// Handle clearing the screen of a truck.
Parcel.Truck.prototype.remove = function() {
    this.$el.remove();
};

Parcel.Truck.prototype.updateNextStop = function() {
    var ifEmpty = this.parcels.length == 0;
    $('.truck-next-stop', this.$el)
        .text(ifEmpty ? '' : this.parcels[0].to.address)
        .css('display', ifEmpty ? 'none' : 'block');
};

Parcel.Truck.prototype.updateParcels = function() {
    var parcelCnt = $('.truck-parcels', this.$el);
    parcelCnt.data('cnt', this.parcels.length);
    parcelCnt.text('+' + this.parcels.length);
};
