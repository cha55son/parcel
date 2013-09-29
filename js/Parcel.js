window.Parcel = window.Parcel || { };

Parcel.Parcel = function(options) {
    this.settings = $.extend({
        to: null // Should be a delivery location object
    }, options);
    this.to = this.settings.to;
};
