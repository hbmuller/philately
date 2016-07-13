var RushEngine = (function(){

    var engine = function( options ){

        var extended = this._applyDefaults( options );
    };

    engine.prototype._defaults = {
        'target': null,
        'stepCallback': null,
        'layers': null
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
        if( typeof target !== 'undefined' ) {
            var targetElement = typeof target === 'string' ? document.querySelector( target ) : target;

            if( targetElement instanceof HTMLCanvasElement ) {
                this._data.target = targetElement;
            } else {
                console.error( 'The "target" option must be a canvas element or a string selector to one of them.' );
                return false;
            }
        }

        return this._data.target;
    };


    renderer.prototype.resetLayers = function( layers ) {
        if(layers instanceof Array){
            this._data.layers = [];

            for (var i = 0, ln = layers.length; i < ln; i++) {
                this.addLayer( layers[i] );
            }
        }
    };

    // renderer.prototype.addLayer = function(layer) {
    //     if(layer instanceof Object && layer.name && typeof this._layerIndexes[layer.name] !== 'number'){

    //         if (typeof layer.x !== 'number') layer.x = 0;
    //         if (typeof layer.y !== 'number') layer.y = 0;
    //         if (typeof layer.opacity !== 'number') layer.opacity = 1;

    //         this._layers.push(layer);
    //         this._layerIndexes[layer.name] = this._layers.length - 1;
    //     }
    // };

    // renderer.prototype.draw = function() {
    //     var canvasData = this.getCanvasData();
    //     this._context.clearRect(0,0,canvasData.width,canvasData.height);

    //     for (var i = 0, ln = this._layers.length; i < ln; i++) {
    //         var layer = this._layers[i];
    //         this._context.globalAlpha = layer.opacity;
    //         this._context.drawImage(layer.source,layer.x,layer.y);
    //     }
    // };

    // renderer.prototype.getCanvasData = function() {
    //     return this._canvasData || this.setCanvasData();
    // };

    // renderer.prototype.setCanvasData = function() {
    //     var canvasWidth = this._canvas.clientWidth;
    //     var canvasHeight = this._canvas.clientHeight;

    //     this._canvas.width = canvasWidth;
    //     this._canvas.height = canvasHeight;

    //     this._canvasData = {
    //         width: canvasWidth,
    //         height: canvasHeight
    //     };

    //     return this._canvasData;
    // };

    // renderer.prototype.setLayersSources = function(sources) {
    //     for(var layerName in sources){
    //         var index = this._layerIndexes[ layerName ];
    //         if(typeof index === 'number'){
    //             this._layers[ index ].source = sources[layerName];
    //         }else{
    //             this.addLayer({
    //                 name: layerName,
    //                 source: sources[layerName]
    //             });
    //         }
    //     }
    // };

    return renderer;
}());