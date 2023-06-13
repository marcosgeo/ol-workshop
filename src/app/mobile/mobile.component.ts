import { Component, AfterViewInit } from '@angular/core';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css'],
})
export class MobileComponent implements AfterViewInit {
  map?: Map;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-46.5, -23.5]),
        zoom: 5,
      }),
    });
  }
}
