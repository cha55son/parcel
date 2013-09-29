// Protect the global NS.
(function() {
    $(document).ready(function() {
        // Events
        $(window).on('Parcel.DeliveryLocation.Order', function(e, data) {
            console.log('Location: ' + data.location.address + ' has placed an order.');
        });

        // Add the warehouse
        var warehouse = new Parcel.Warehouse({
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

        $(document).keypress(function(e) {
            if (e.which == 13) { // Enter, create and ship truck
                var truck = new Parcel.Truck({
                    html: '<img src="img/truck.png" /><span class="truck-parcels" data-cnt="0">+0</span>',
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
                        // Drop present :)
                        var pos = this.$truck.position();
                        var present = $('<div class="present"></div>').appendTo('body');
                        present.css({
                            top: pos.top + this.$truck.height() - present.height(),
                            left: pos.left + this.$truck.width() - present.width()
                        });
                    },
                    finishedDelivering: function() {
                        this.remove();
                    }
                });
            }
        });
        $(document).mouseup(function(e) {
            if (e.which == 1) { // Left click, place a delivery location.
                // placeType(e.pageY, e.pageX, 'delivery');
            }
        });
    });
})();
