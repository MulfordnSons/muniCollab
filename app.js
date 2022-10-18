require([
    "esri/config",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/views/draw/Draw",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
  ], function(esriConfig, WebMap, MapView, Draw, Graphic, GraphicsLayer) {

    const drawGL = new GraphicsLayer({
        id: "draw Graphics Layer"
      });

  esriConfig.apiKey = "";

  document.getElementById("submit").disabled = true;

   const webmap = new WebMap ({
    portalItem: {
        id: "41281c51f9de45edaf1c8ed44bb10e30"
   }
    });

    const view = new MapView({
        container: "viewDiv",
        map: webmap,

    });

    const draw = new Draw({
        view: view
      });
      
      view.when(()=>{
        setDrawAction();
      });
      
      function setDrawAction() {
        let action = draw.create("point");

        // PointDrawAction.cursor-update
        // Give a visual feedback to users as they move the pointer over the view
        action.on("cursor-update", function (evt) {
          createPointGraphic(evt.coordinates);
        });
      
        // PointDrawAction.draw-complete
        // Create a point when user clicks on the view or presses "C" key.
        action.on("draw-complete", function (evt) {
          console.log(evt)
          createPointGraphic(evt.coordinates, true);
          setDrawAction();
        });
      }
      
      function createPointGraphic(coordinates, addToGL){
        view.graphics.removeAll();
        let point = {
          type: "point", // autocasts as /Point
          x: coordinates[0],
          y: coordinates[1],
          spatialReference: view.spatialReference
        };
      
        let graphic = new Graphic({
          geometry: point,
          symbol: {
            type: "simple-marker", // autocasts as SimpleMarkerSymbol
            style: "square",
            color: "red",
            size: "16px",
            outline: { // autocasts as SimpleLineSymbol
              color: [255, 255, 0],
              width: 3
            }
          }
        });
        if(addToGL){
          console.log('add to view 2')
          drawGL.removeAll();
          drawGL.add(graphic);
        }else{
          console.log('add to view')
          view.graphics.add(graphic);
        }
      }
    

});


