import { Component, AfterViewInit } from '@angular/core';

import kompas from 'kompas';
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
import { Fill, Icon, Style } from 'ol/style';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css'],
})
export class MobileComponent implements AfterViewInit {
  map?: Map;
  private gpsSource: VectorSource = new VectorSource();
  private gpsStyle?: Style;
  private locate?: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.getCurrentPosition();
    this.centerOnClick();
    this.setGpsStyle();
    this.compasInitialization();
  }

  initMap() {
    const gpsLayer = new VectorLayer({
      source: this.gpsSource,
    });
    gpsLayer.setStyle(this.gpsStyle);
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

  setGpsStyle(): void {
    const style = new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.2)',
      }),
      image: new Icon({
        src: '../../assets/data/location-heading.svg',
        imgSize: [27, 55],
        rotateWithView: true,
      }),
    });
    this.gpsStyle = style;
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
    this.locate = locate;
  }

  compasInitialization(): void {
    const that = this;
    const startCompass = function (): void {
      kompas()
        .watch()
        .on('heading', function (heading: number) {
          that.gpsStyle?.getImage().setRotation((Math.PI / 180) * heading);
        });
    };
    if (
      window.DeviceOrientationEvent &&
      typeof (DeviceOrientationEvent as any).requestPermission == 'function'
    ) {
      that.locate.addEventListener('click', function () {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then(startCompass)
          .catch(function (error: any) {
            alert(`ERROR: ${error.message}`);
          });
      });
    } else if ('ondeviceorientationabsolute' in window) {
      startCompass();
    } else {
      alert('No device orientation provided by device');
    }
  }
}
