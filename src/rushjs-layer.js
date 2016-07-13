var RushLayer = (function(){

    var layer = function( options ){

        var extended = this._applyDefaults( options );
        if( extended ) {
            this._data = {};
            this.source( extended.source );
            this.opacity( extended.opacity );
            this.position( extended.x, extended.y );
        }
    };

    layer.prototype._defaults = {
        'source': null,
        'label': '',
        'opacity': 1,
        'x': 0,
        'y': 0,
    };

    layer.prototype._applyDefaults = function( options ) {

        if ( typeof options !== 'object' || typeof options.source === 'undefined' ) {
            console.error( 'The "source" option is required.' );
            return false;
        }

        var data = Object.create( this._defaults );

        for ( var key in data ) {
            if( typeof options[ key ] !== 'undefined' )
                data[ key ] = options[ key ];
        }

        return data;
    };

    layer.prototype.source = function( source ) {
        if( typeof source !== 'undefined' ) {
            var sourceElement = typeof source === 'string' ? document.querySelector( source ) : source;

            if( sourceElement instanceof HTMLImageElement || sourceElement instanceof HTMLCanvasElement ) {
                this._data.source = sourceElement;
            } else {
                console.error( 'The "source" option must be a canvas or image element or a string selector to one of them.' );
                return false;
            }
        }

        return this._data.source;
    };

    layer.prototype.label = function( label ) {
        if( typeof label === 'string' ) {
            this._data.label = label;
        } else if( typeof label !== 'undefined' ) {
            console.error( 'The "label" option must be a string' );
            return false;
        }

        return this._data.opacity;
    };

    layer.prototype.opacity = function( opacity ) {
        if( typeof opacity === 'number' ) {
            this._data.opacity = Math.max( 0, Math.min( 1, opacity ) );
        } else if( typeof opacity !== 'undefined' ) {
            console.error( 'The "opacity" option must be a number' );
            return false;
        }

        return this._data.opacity;
    };

    layer.prototype.position = function( x, y ) {
        if( typeof x === 'number' && typeof x === 'number' ) {
            this._data.x = x;
            this._data.y = y;
        } else if( typeof x !== 'undefined' || typeof y !== 'undefined' ) {
            console.error( 'Both "x" and "y" options must be numbers' );
            return false;
        }

        return { x: this._data.x, y: this._data.y };
    };

    return layer;
}());