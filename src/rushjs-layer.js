var RushLayer = (function(){

    var layer = function(source, opacity){
        this.source( source );
        this.opacity( opacity );
    };

    layer.prototype._data = {};

    layer.prototype.source = function( source ) {
        if( typeof newValue !== 'undefined' ) {
            var sourceElement = typeof source === 'string' ? document.querySelector( source ) : source;

            if ( sourceElement instanceof HTMLImageElement || sourceElement instanceof HTMLCanvasElement ) {
                this._data.source = sourceElement;
            } else {
                return false;
            }
        }

        return this._data.source;
    };

    layer.prototype.opacity = function( newValue ) {
        if( typeof newValue === 'number' ) {
            this._data.opacity = Math.max( 0, Math.min( 1, newValue ) );
        } else if( typeof newValue !== 'undefined' ) {
            return false;
        }

        return this._data.opacity;
    };

    return layer;
}());