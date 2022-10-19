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

    const taxParcels = new FeatureLayer({
        url: "https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Tax_Parcels/FeatureServer",
        minScale: 0,
        maxSscale: 3000001
      });

      
    // const addressPoints = new FeatureLayer({
    //     url: "https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Address_Points/FeatureServer",
    //     minScale: 0,
    //     maxSscale: 3000001
    //   });

  
    const map = new Map({
      basemap: "gray-vector",
      layers:[drawGL]
    });
    
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-85, 48],
      zoom: 5,
    });

    drawButton = document.getElementById('enable-draw')

    drawButton.onclick = function() {
      var content = drawButton.textContent
      console.log(drawButton.textContent)
      if (content === 'enable drawing') {
        drawButton.textContent = 'disable drawing'
      } else if (content === 'disable drawing') {
        drawButton.textContent = 'enable drawing'
      }
    }

    // const featureLayer = new FeatureLayer({
    //   url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
    // });

    // map.add(featureLayer);

    // map.add(addressPoints);
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
      if (drawButton.textContent === 'disable drawing') {
        if(addToGL){
          console.log(coordinates)
          console.log(view.spatialReference)
          drawGL.removeAll();
          drawGL.add(graphic);
          document.getElementById('modal-overlay').style.display = "block"
          document.getElementById('modal').style.display = "block"
        }else{
          view.graphics.add(graphic);
        }
      } else {console.log('idk')}
     
    }
  });
