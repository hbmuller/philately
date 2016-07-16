var RushLayer = (function(){

    var layer = function( options ){

        var extended = this._applyDefaults( options );

        this._data = {};
        this.source( extended.source );
        this.opacity( extended.opacity );
        this.label( extended.label );
        this.active( extended.active );
        this.position( extended.x, extended.y );
    };

    layer.prototype._defaults = {
        'source': null,
        'label': '',
        'opacity': 1,
        'active': true,
        'x': 0,
        'y': 0
    };

    layer.prototype._applyDefaults = function( options ) {

        var data = Object.create( this._defaults );

        for ( var key in data ) {
            if( typeof options[ key ] !== 'undefined' )
                data[ key ] = options[ key ];
        }

        return data;
    };

    layer.prototype.source = function( source ) {
        if( source ) {
            var sourceElement = typeof source === 'string' ? document.querySelector( source ) : source;

            if( sourceElement instanceof HTMLImageElement || sourceElement instanceof HTMLCanvasElement ) {
                this._data.source = sourceElement;
            } else {
                console.error( 'The "source" option must be a canvas or image element or a string selector to one of them.' );
                return false;
            }
        }

        return this._data.source || null;
    };

    layer.prototype.label = function( label ) {
        if( typeof label === 'string' ) {
            this._data.label = label;
        } else if( typeof label !== 'undefined' ) {
            console.error( 'The "label" option must be a string' );
            return false;
        }

        return this._data.label;
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

    layer.prototype.active = function( active ) {
        if( typeof active === 'boolean' ) {
            this._data.active = active;
        } else if( typeof active !== 'undefined' ) {
            console.error( 'The "active" option must be a boolean' );
            return;
        }

        return this._data.active;
    };

    layer.prototype.position = function( x, y ) {
        if( typeof x === 'number' && typeof x === 'number' ) {
            this._data.position = {
                x: x,
                y: y
            };
        } else if( typeof x !== 'undefined' || typeof y !== 'undefined' ) {
            console.error( 'Both "x" and "y" options must be numbers' );
            return false;
        }

        return this._data.position;
    };

    return layer;
}());
var RushEngine = (function(){

    var engine = function( options ){
        var extended = this._applyDefaults( options );

        this._data = { createdAt: performance.now() };

        this.resetLayers( extended.layers );
        if(typeof extended.stepStart === 'function')
            this._data.stepStart = extended.stepStart;
        if(typeof extended.stepEnd === 'function')
            this._data.stepEnd = extended.stepEnd;

        if( this.target( extended.target ) ){
            if( extended.autoStart ){
                this.start();
            }
        } else {
            console.error("The engine needs a canvas target, even if it's not onscreen.");
        }
    };

    engine.prototype._defaults = {
        'target': null,
        'stepStart': null,
        'stepEnd': null,
        'layers': null,
        'autoStart': true
    };

    engine.prototype._applyDefaults = function( options ) {

        if ( typeof options !== 'object' || typeof options.target === 'undefined' ) {
            console.error( 'The "target" option is required.' );
            return false;
        }

        var data = Object.create( this._defaults );

        for ( var key in data ) {
            if( typeof options[ key ] !== 'undefined' )
                data[ key ] = options[ key ];
        }

        return data;
    };

    engine.prototype.target = function( target ) {
        if( target ) {
            var targetElement = typeof target === 'string' ? document.querySelector( target ) : target;

            if( targetElement instanceof HTMLCanvasElement ) {
                this._data.target = targetElement;
                this._data.context = targetElement.getContext('2d');
                this.setCanvasSize();
            } else {
                console.error( 'The "target" option must be a canvas element or a string selector to one of them.' );
                return false;
            }
        }

        return this._data.target || null;
    };

    engine.prototype.setCanvasSize = function(width,height) {
        var canvasWidth = typeof width === 'number' ? width : this._data.target.clientWidth;
        var canvasHeight = typeof height === 'number' ? height : this._data.target.clientHeight;

        this._data.target.width = canvasWidth;
        this._data.target.height = canvasHeight;

        this._data.width = canvasWidth;
        this._data.height = canvasHeight;
    };

    engine.prototype.resetLayers = function( layers ) {
        this._data.layers = [];

        if(layers instanceof Array){
            for (var i = 0, ln = layers.length; i < ln; i++) {
                this.addLayer( layers[i] );
            }
        }
    };

    engine.prototype.addLayer = function( layer ) {
        if( layer instanceof RushLayer ){
            this._data.layers.push(layer);
            return layer;
        } else {
            console.error( 'The "layer" parameter must be a RushLayer instance.' );
            return false;
        }
    };

    engine.prototype.removeLayer = function( layer ) {
        if( layer instanceof RushLayer || (typeof layer === 'string' && layer !== '')){
            for (var i = this._data.layers.length - 1; i >= 0; i--) {
                var currLayer = this._data.layers[i];
                if( currLayer === layer || currLayer.label() === layer ){
                    this._data.layers.splice(i,1);
                }
            }
        } else {
            console.error( 'The "layer" parameter must be a RushLayer instance or a string representing the layer label.' );
        }

        return this._data.layers.length;
    };

    engine.prototype.draw = function() {
        var d = this._data;
        d.context.clearRect(0,0, d.width, d.height);

        for (var i = 0, ln = d.layers.length; i < ln; i++) {
            var layer = d.layers[ i ];

            if( layer.active() && layer.source() && layer.opacity() ) {
                var position = layer.position();

                d.context.globalAlpha = layer.opacity();
                d.context.drawImage(layer.source(), position.x, position.y);
            }
        }

        d.context.globalAlpha = 1;
    };

    engine.prototype.start = function() {
        var
            now = performance.now()
            d = this._data;

        d.startedAt = now;
        d.lastCall = now;
        d.running = true;

        this.step(now);
    };

    engine.prototype.step = function(now) {
        var
            d = this._data,
            offset = now - d.lastCall,
            _this = this;

        if(typeof d.stepStart === 'function')
            d.stepStart(offset,now);

        this.draw();

        if(typeof d.stepEnd === 'function')
            d.stepEnd(offset,now);

        if( d.running )
            requestAnimationFrame(function( now ){
                _this.step( now );
            });
    };

    engine.prototype.stop = function() {
        this._data.running = false;
    };

    return engine;
}());