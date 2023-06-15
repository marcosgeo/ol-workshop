import { Component, AfterViewInit } from '@angular/core';

import { Map, View } from 'ol';
import Control from 'ol/control/Control';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { circular } from 'ol/geom/Polygon';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css'],
})
export class MobileComponent implements AfterViewInit {
  map?: Map;
  private gpsSource: VectorSource = new VectorSource();

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.getCurrentPosition();
    this.centerOnClick();
  }

  initMap() {
    const gpsLayer = new VectorLayer({
      source: this.gpsSource,
    });
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
    this.map.addLayer(gpsLayer);
  }

  getCurrentPosition(): void {
    console.log('getCurrentPosition was called');
    const that = this; // preserves this on other name
    window.navigator.geolocation.watchPosition(
      (pos: any) => {
        console.log(`watching ${pos}`);
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = circular(coords, pos.coords.accuracy);
        that.gpsSource.clear(true);
        that.gpsSource.addFeatures([
          new Feature(
            accuracy.transform('EPSG:4326', that.map?.getView().getProjection())
          ),
          new Feature(new Point(fromLonLat(coords))),
        ]);
      },
      function (error: any) {
        alert(`Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  centerOnClick() {
    const that = this;
    const locate = document.createElement('div');
    locate.className = 'ol-control ol-unselectable locate';
    locate.innerHTML = '<button title="Locate me">ø</button>';
    locate.addEventListener('click', function () {
      if (!that.gpsSource.isEmpty()) {
        that.map?.getView().fit(that.gpsSource.getExtent(), {
          maxZoom: 18,
          duration: 500,
        });
      }
    });
    that.map?.addControl(new Control({ element: locate }));
    const control = document.getElementsByClassName(
      'ol-zoom ol-unselectable ol-control'
    );
    control[0].appendChild(locate);
  }
}
