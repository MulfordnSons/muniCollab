require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/draw/Draw",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer"
  ], (Map, MapView, Draw, Graphic, GraphicsLayer, FeatureLayer) => {
    const drawGL = new GraphicsLayer({
      id: "draw Graphics Layer"
    });

    var taxParcels = new FeatureLayer({
        url: "https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Tax_Parcels/FeatureServer"
      });

      
    var addressPoints = new FeatureLayer({
        url: "https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Address_Points/FeatureServer"
      });

  
    const map = new Map({
      basemap: "gray-vector",
      layers:[drawGL]
    });
    
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-86, 49],
      zoom: 10
    });

    map.add(addressPoints);
    map.add(taxParcels);
     

    //map.addLayer(drawGL)

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
        document.getElementById('modal-overlay').style.display = "block"
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
          style: "circle",
          color: "blue",
          size: "12px",
          outline: { // autocasts as SimpleLineSymbol
            color: [255, 255, 0],
            width: 3
          }
        }
      });
      if(addToGL){
        console.log(coordinates)
        console.log(view.spatialReference)
        drawGL.removeAll();
        drawGL.add(graphic);
      }else{
        view.graphics.add(graphic);
      }
    }
  });


