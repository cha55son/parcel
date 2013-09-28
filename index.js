function Truck(options) {
    this.settings = $.extend({
        speed: 0.10,
        top: 10, // Absolute position to spawn the truck.
        left: 10,
        depot: '.depot', // Class of the depot the truck should visit. If multiple are provided the closest is used.
        addresses: $(), // The addresses on the truck's route.
        html: '',
        arrivedAtDepot: function() { },
        finishedLoading: function() { },
        collectedParcel: function() { },
        deliveredParcel: function() { }
    }, options);
    this.$truck = $('<div class="truck">' + this.settings.html + '</div>').appendTo('body').eq(0);
    this.$depot = $(this.settings.depot);
    this.parcels = 0;
    // Ship the items
    var self = this;
    this.load(this.settings.addresses.length, function() {
         self.deliver(self.settings.addresses);
    });
};

// Send the truck to the depot to pickup the
// proper amount of parcels for delivery.
Truck.prototype.load = function(parcels, callback) {
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
Truck.prototype.getAddrParkPos = function(addr) {
    var pos = addr.position();
    var top = pos.top + (addr.height() / 2 - this.$truck.height() / 2);
    var left = pos.left - this.$truck.width();
    return { top: top, left: left };
};

// Simply moves the truck to the proper position.
// Using a grid and the A* algorithm to avoid obstacles
// would be really cool with this function.
Truck.prototype.moveTo = function(top, left, callback) {
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
Truck.prototype.deliver = function(jqueryObjs) {
    var addr = jqueryObjs.eq(0);
    var pos = this.getAddrParkPos(addr);
    var self = this;
    this.moveTo(pos.top, pos.left, function() {
        // Deliver the parcel
        self.parcels--;
        self.settings.deliveredParcel.call(self);
        // Remove the address
        jqueryObjs = jqueryObjs.not(jqueryObjs.eq(0));
        if (jqueryObjs.length == 0) return;
        // Recurse until all addresses have been visited.
        self.deliver(jqueryObjs);
    });
};

// Return the animation time in milliseconds to move from
// the truck's current position to the given position.
Truck.prototype.getSpeedTo = function(top, left) {
    // get the distance
    var truckPos = this.$truck.position();
    var xd = left - truckPos.left;
    var yd = top - truckPos.top;
    var dist = Math.sqrt(xd * xd + yd * yd);
    // time = dist / rate
    return dist / this.settings.speed;
};

// Protect the global NS.
(function() {
    var placeType = function(top, left, type) {
        type = type || 'delivery';
        var deliveryOptions = ['house', 'office', 'factory'];
        if (type == 'delivery')
            type = deliveryOptions[Math.floor(Math.random() * 3)] + ' delivery';
        var el = $('<div class="' + type + ' visit"></div>').appendTo('body');
        el.css({
            top: (top - el.height() / 2) + 'px',
            left: (left - el.width() / 2) + 'px'
        });
    };

    $(document).ready(function() {
        $(document).keypress(function(e) {
            console.log(e.which);
            if (e.which == 13) { // Enter, create and ship truck
                var truck = new Truck({
                    html: '<img src="img/truck.png" /><span class="truck-parcels" data-cnt="0">+0</span>',
                    top: 8,
                    left: 8,
                    depot: '.depot',
                    addresses: $('.delivery'),
                    arrivedAtDepot: function() { console.log('Arrived at depot'); },
                    finishedLoading: function() { console.log('Finished loading'); },
                    collectedParcel: function() { 
                        var $parcelCnt = $('.truck-parcels', truck.$truck);
                        var cnt = parseInt($parcelCnt.data('cnt'));
                        $parcelCnt.data('cnt', ++cnt).text('+' + cnt);
                    },
                    deliveredParcel: function() { 
                        var $parcelCnt = $('.truck-parcels', truck.$truck);
                        var cnt = parseInt($parcelCnt.data('cnt'));
                        $parcelCnt.data('cnt', --cnt).text('+' + cnt);
                    }
                });
            }
        });
        $(document).mouseup(function(e) {
            console.log(e.which);
            if (e.shiftKey && e.which == 1) { // Shift + Left click, place a delivery location.
                placeType(e.pageY, e.pageX, 'delivery');
            } else if (e.which == 1) { // Left click, place a depot.
                placeType(e.pageY, e.pageX, 'depot');
            }
        });
    });
})();
