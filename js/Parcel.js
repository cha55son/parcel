window.Parcel = window.Parcel || { };

// This class could be more useful if it
// actually carried data other than where its going.
Parcel.Parcel = function(options) {
    this.settings = $.extend({
        to: null // Should be a delivery location object
    }, options);
    this.to = this.settings.to;
};
