import { Component, AfterViewInit } from '@angular/core';

import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { Map, Tile, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { from } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-46.5, -23.5]),
        zoom: 8,
      }),
    });
  }
}
