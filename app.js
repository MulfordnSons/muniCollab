require([
    "esri/config",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/ScaleBar",
    "esri/widgets/Legend"
  ], function(esriConfig, WebMap, MapView, ScaleBar, Legend) {

  esriConfig.apiKey = "";

   const webmap = new WebMap ({
    portalItem: {
        id: "41281c51f9de45edaf1c8ed44bb10e30"
   }
    });

    const view = new MapView({
        container: "viewDiv",
        map: webmap,

    });

});


