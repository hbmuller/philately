var RushEngine = (function(){

    var renderer = function(canvas,layers){
        // this._canvas = document.querySelector(canvas);
        // this._context = this._canvas.getContext('2d');
        // this._layers = [];
        // this._layerIndexes = {};

        // this._bind();
        // this.resetLayers(layers);
    };

    // renderer.prototype.resetLayers = function(layers) {
    //     if(layers instanceof Array){
    //         this._layers = [];
    //         this._layerIndexes = {};

    //         for (var i = 0, ln = layers.length; i < ln; i++) {
    //             this.addLayer( layers[i] );
    //         }
    //     }
    // };

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