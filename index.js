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
                        // Drop present :)
                        var pos = this.$truck.position();
                        var present = $('<div class="present"></div>').appendTo('body');
                        present.css({
                            top: pos.top + this.$truck.height() - present.height(),
                            left: pos.left + this.$truck.width() - present.width()
                        });
                    }
                });
            }
        });
        $(document).mouseup(function(e) {
            if (e.shiftKey && e.which == 1) { // Shift + Left click, place a depot.
                placeType(e.pageY, e.pageX, 'depot');
            } else if (e.which == 1) { // Left click, place a delivery location.
                placeType(e.pageY, e.pageX, 'delivery');
            }
        });
    });
})();
