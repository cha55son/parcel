window.Parcel = window.Parcel || { };

Parcel.Truck = function(options) {
    this.settings = $.extend({
        speed: 0.10,
        top: 10, // Absolute position to spawn the truck.
        left: 10,
        depot: '.depot', // Class of the depot the truck should visit. If multiple are provided the first placed depot is used.
        addresses: [], // The addresses on the truck's route.
        html: '',
        // Callbacks
        arrivedAtDepot: function() { },
        finishedLoading: function() { },
        collectedParcel: function() { },
        deliveredParcel: function() { },
        finishedDelivering: function() { }
    }, options);
    // $ denotes jQuery objects.
    this.$depot = $(this.settings.depot);
    this.$addresses = this.settings.addresses;
    if (this.$depot.length == 0) {
        alert("You have not placed a depot. Place a depot with Shift + Left Click.");
        return;
    }
    if (this.$addresses.length == 0) {
        alert("The truck has no deliveries. Place a delivery location with Left Click.");
        return;
    }
    this.$truck = $('<div class="truck">' + this.settings.html + '</div>').appendTo('body').eq(0);
    this.parcels = 0;
    // Ship the items
    var self = this;
    this.load(this.$addresses.length, function() {
        self.deliver(self.$addresses, function() {
            console.log('delivered');
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
Parcel.Truck.prototype.load = function(parcels, callback) {
    parcels = parcels || 1;
    callback = callback || function() { };
    // Find the depot
    var depotPos = this.getAddrParkPos(this.$depot);
    // Drive the truck to the depot
    var self = this;
    this.moveTo(depotPos.top, depotPos.left, function() {
        self.settings.arrivedAtDepot.call(self);
        // Pickup parcels
        for (var i = 0; i < parcels; i++) {
           self.parcels++; 
           self.settings.collectedParcel.call(self);
        }
        self.settings.finishedLoading.call(self);
        callback();
    });
};

// Get the address where the truck should park for delivery.
Parcel.Truck.prototype.getAddrParkPos = function(addr) {
    var pos = addr.position();
    var top = pos.top + (addr.height() / 2 - this.$truck.height() / 2);
    var left = pos.left - this.$truck.width();
    return { top: top, left: left };
};

// Simply moves the truck to the proper position.
// Using a grid and the A* algorithm to avoid obstacles
// would be really cool with this function.
Parcel.Truck.prototype.moveTo = function(top, left, callback) {
    callback = callback || function() { };
    var self = this;
    var speed = this.getSpeedTo(top, left);
    this.$truck.animate({
        top: top,
        left: left
    }, speed, function() {
        callback();
    });
};

// Deliver a parcel to a group of addresses(jqueryObjects).
// Traveling sales man algorithm would be good here.
Parcel.Truck.prototype.deliver = function(jqueryObjs, callback) {
    callback = callback || function() { };
    var addr = jqueryObjs.eq(0);
    var pos = this.getAddrParkPos(addr);
    var self = this;
    this.moveTo(pos.top, pos.left, function() {
        // Deliver the parcel
        self.parcels--;
        self.settings.deliveredParcel.call(self);
        // Remove the address
        jqueryObjs = jqueryObjs.not(jqueryObjs.eq(0));
        if (jqueryObjs.length == 0)
            return callback();
        // Recurse until all addresses have been visited.
        self.deliver(jqueryObjs, callback);
    });
};

// Return the animation time in milliseconds to move from
// the truck's current position to the given position.
Parcel.Truck.prototype.getSpeedTo = function(top, left) {
    // get the distance
    var truckPos = this.$truck.position();
    var xd = left - truckPos.left;
    var yd = top - truckPos.top;
    var dist = Math.sqrt(xd * xd + yd * yd);
    // time = dist / rate
    return dist / this.settings.speed;
};

// Handle clearing the screen of a truck.
Parcel.Truck.prototype.remove = function() {
    this.$truck.remove();
};
