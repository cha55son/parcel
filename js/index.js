// Protect the global NS.
(function() {
    $(document).ready(function() {
        // Events
        $(window).on('Parcel.DeliveryLocation.Order', function(e, data) {
            // A delivery location has placed an order so create the parcel and
            // add it to the depot.
            var parcel = new Parcel.Parcel({
                to: data.location
            });
            depot.add(parcel);
        });
        $(window).on('Parcel.Depot.Ship', function(e, data) {
            var truck = new Parcel.Truck({
                arrivedAtDepot: function() { 
                    // Load all the parcels in the depot
                    // storage into the truck.
                    var parcels = depot.loadParcels();
                    for (var i in parcels)
                        this.add(parcels[i]);
                },
                deliveredParcel: function() { 
                    // Drop present :)
                    var pos = this.$el.position();
                    var present = $('<div class="present"></div>').appendTo('body');
                    present.css({
                        top: pos.top + this.$el.height() - present.height(),
                        left: pos.left + this.$el.width() - present.width()
                    });
                },
                finishedDelivering: function() {
                    this.remove();
                }
            });
        });
        // Allow the user to place delivery locations.
        $(document).mouseup(function(e) {
            if (e.which != 1 || !e.shiftKey) return;
            var loc = new Parcel.DeliveryLocation({
                top: e.pageY,
                left: e.pageX
            });
        });

        // Add the warehouse
        var depot = new Parcel.Depot({
            top: $(window).height() / 2, 
            left: $(window).width() / 2
        });
        // Add three delivery locations and request orders
        var offset = 100;
        var loc1 = new Parcel.DeliveryLocation({
            top: offset,
            left: $(window).width() - offset,
            type: 'office'
        });
        var loc2 = new Parcel.DeliveryLocation({
            top: $(window).height() - offset,
            left: $(window).width()  - offset,
            type: 'factory'
        });
        var loc3 = new Parcel.DeliveryLocation({
            top: $(window).height() / 2,
            left: $(window).width() - offset,
            type: 'house'
        });
        loc1.order();
        loc2.order();
        loc3.order();
    });
})();
