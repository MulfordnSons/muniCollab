require([
    "esri/Map",
    "esri/views/MapView",
    "esri/views/draw/Draw",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList"
  ], (Map, MapView, Draw, Graphic, GraphicsLayer, FeatureLayer, LayerList) => {

    const drawGL = new GraphicsLayer({
      id: "draw Graphics Layer",
      listMode: "hide"
    });


    const popupTaxParcels = {
      "title": "Tax Parcels", 
      "content": "<b>Parcel ID:</b> {Owner}"
    }
    

    const taxParcels = new FeatureLayer({
        url: "https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Tax_Parcels/FeatureServer",
        minScale: 0,
        maxSscale: 3000001,
        visible: false,
        outFields: "Owner",
        popupTemplate: popupTaxParcels
      });

      
    const addressPoints = new FeatureLayer({
        url: "https://services1.arcgis.com/1Cfo0re3un0w6a30/arcgis/rest/services/Address_Points/FeatureServer",
        minScale: 0,
        maxSscale: 3000001
      });

  
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

    let drawButton = document.getElementById('enable-draw')

    drawButton.onclick = function() {
      var content = drawButton.textContent
      console.log(drawButton.textContent)
      if (content === 'Draw Enabled') {
        drawButton.textContent = 'Draw Disabled'
      } else if (content === 'Draw Disabled') {
        drawButton.textContent = 'Draw Enabled'
      }
    }

    function zoomToLayer(layer) {
      return layer.queryExtent().then((response) => {
        console.log(response.extent)
        view.goTo(response.extent)
        .catch((error) => {
          console.error(error);
        });
      });
    }

    function closeModal() {
      console.log('button is clicked')
      let modal = document.getElementById("modal")
      modal.classList.add("closed")
      console.log('button')
      drawButton.textContent = 'Draw Enabled'
    }

    function displayModal() {
      let element = document.getElementById("modal");
      element.classList.remove("closed");
      drawButton.textContent = 'Draw Disabled';
    }

    let modalButton = document.getElementById("closeButton")
    modalButton.addEventListener("click", closeModal);


    map.add(addressPoints);
    map.add(taxParcels, 0);
     

    //map.addLayer(drawGL)

    const draw = new Draw({
      view: view
    });
    
    view.when(()=>{
      setDrawAction();
      zoomToLayer(taxParcels)
    })
    ;
    

    view.when(() => {
      const layerList = new LayerList({
        view: view,
        layers: [
          {
            layer: addressPoints
          },
          {
            layer: taxParcels
          }
        ]
      });

      // Add widget to the top right corner of the view
      view.ui.add(layerList, "top-right");
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
      if (drawButton.textContent === 'Draw Enabled') {
        if(addToGL){
          console.log(coordinates)
          console.log(view.spatialReference)
          drawGL.removeAll();
          drawGL.add(graphic);
          // document.getElementById('modal-overlay').style.display = "block"
          displayModal()
        }else{
          view.graphics.add(graphic);
        }
      } else {console.log('idk')}
     
    }
  });
