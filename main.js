import 'ol/ol.css';
import {Map, Overlay, View} from 'ol';
import {defaults, MousePosition, OverviewMap, ScaleLine, ZoomSlider, ZoomToExtent} from 'ol/control';
import FullScreen from 'ol/control/FullScreen';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {DragRotate, Draw} from "ol/interaction";
import {altKeyOnly} from "ol/events/condition";
import {GeoJSON} from "ol/format";
import {Tile} from "ol/layer";

window.onload = init()

function init() {

    // Control
    const fullScreen = new FullScreen()
    const mousePosition = new MousePosition();
    const overviewMap = new OverviewMap({
        collapsed : false,
        layers : [
            new Tile({
                source: new OSM()
            })
        ]
    });

    const scaleLineControl = new ScaleLine();
    const zoomSliderControl = new ZoomSlider();
    const zoomToExtentControl = new ZoomToExtent;

    const map = new Map({
        view: new View({
            center: [-25940000, 4520000],
            zoom: 10,
            // maxZoom: 6,
            // minZoom: 2,
            rotation: 0
        }),
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        target: "js-map",
        keyboardEventTarget  : document,
        controls:  defaults().extend([
            fullScreen,
            mousePosition,
            overviewMap,
            scaleLineControl,
            zoomSliderControl,
            zoomToExtentControl
        ])
    })
    console.log(defaults())

    const popupContainerElement = document.getElementById('popup-container');
    const popup = new Overlay({
        element : popupContainerElement,
        positioning : 'top-right'
    })
    map.addOverlay(popup)

    map.on("click", function (e) {
        const clickCoordinate = e.coordinate;
        // popup.setPosition(undefined);
        popup.setPosition(clickCoordinate)
        popupContainerElement.innerHTML = clickCoordinate
    })

    // DragRotate Interaction
    const dragRotateInteraction = new DragRotate({
        condition : altKeyOnly
    });

    map.addInteraction(dragRotateInteraction)

    const drawInteraction = new Draw({
        type: "Polygon",
        freehand : true
    });

    map.addInteraction(drawInteraction)
    
    drawInteraction.on("drawend", function (e) {
        let parser = new GeoJSON();
        let drawnFeatures =  parser.writeFeatures([e.feature]);
        console.log(drawnFeatures)
    })
}

/**
 *
 126.972834327088,37.5803252319788
 126.972834327088,37.5803252319788
 126.973754929037,37.5781301900341
 126.97352232952,37.57765916231
 126.972273520284,37.5793642555833
 126.971857202562,37.578720072494
 126.97415891885,37.5751581086431
 126.97330778814,37.5755708216537
 126.973159138099,37.5757880681811
 */