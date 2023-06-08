import { Component, AfterViewInit } from '@angular/core';

import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import Link from 'ol/interaction/Link';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';

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
    this.map = new Map({
      target: 'map-container',
      layers: [
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: '../../assets/data/countries.json',
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
    // creates a url link at map center to reload at the last place
    this.map.addInteraction(new Link());
  }
}
