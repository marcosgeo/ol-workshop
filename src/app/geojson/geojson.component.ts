import { Component, AfterViewInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import Link from 'ol/interaction/Link';
import Modify from 'ol/interaction/Modify';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-geojson',
  templateUrl: './geojson.component.html',
  styleUrls: ['./geojson.component.css'],
})
export class GeojsonComponent implements AfterViewInit {
  map?: Map;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    let source: VectorSource = new VectorSource();
    const layer: VectorLayer<VectorSource> = new VectorLayer({
      source: source,
    });

    this.map = new Map({
      target: 'map-container',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // creates a url link at map center to reload at the last place
    this.map.addInteraction(new Link());

    // allows drag and drop json data over the map
    this.map.addLayer(layer);
    this.map.addInteraction(
      new DragAndDrop({
        source: source,
        formatConstructors: [GeoJSON],
      })
    );

    // allows features editing
    this.map.addInteraction(
      new Modify({
        source: source,
      })
    );

    // allows draw new features
    this.map.addInteraction(
      new Draw({
        type: 'Polygon',
        source: source,
      })
    );
  }
}
