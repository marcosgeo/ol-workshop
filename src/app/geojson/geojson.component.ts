import { Component, AfterViewInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Draw from 'ol/interaction/Draw';
import Link from 'ol/interaction/Link';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { getArea } from 'ol/sphere';

import colormap from 'colormap';

@Component({
  selector: 'app-geojson',
  templateUrl: './geojson.component.html',
  styleUrls: ['./geojson.component.css'],
})
export class GeojsonComponent implements AfterViewInit {
  downloadUrl?: string;
  private map?: Map;
  private colorByArea?: any;
  private source: VectorSource = new VectorSource();

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.prepareDownload();
    this.defineColorByArea();
  }

  initMap(): void {
    const that = this; // preserves this in other name
    const layer: VectorLayer<VectorSource> = new VectorLayer({
      source: this.source,
    });
    const countries: VectorLayer<VectorSource> = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: '../../assets/data/countries.json',
      }),
      style: function (feature) {
        return new Style({
          fill: new Fill({
            color: that.colorByArea(feature),
          }),
          stroke: new Stroke({
            color: 'rgba(255,255,255,0.8)',
          }),
        });
      },
    });

    this.map = new Map({
      target: 'map-container',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
    this.map.addLayer(countries);

    // creates a url link at map center to reload at the last place
    this.map.addInteraction(new Link());

    // allows drag and drop json data over the map
    this.map.addLayer(layer);
    this.map.addInteraction(
      new DragAndDrop({
        source: this.source,
        formatConstructors: [GeoJSON],
      })
    );

    // allows features editing
    this.map.addInteraction(
      new Modify({
        source: this.source,
      })
    );

    // allows draw new features
    this.map.addInteraction(
      new Draw({
        type: 'Polygon',
        source: this.source,
      })
    );

    // allows snap features during editing
    this.map.addInteraction(
      new Snap({
        source: this.source,
      })
    );
  }

  clearEditing(): void {
    this.source.clear();
  }

  // listen for updates on vector layer and updates the download url
  prepareDownload(): void {
    const that = this; // preserves this on other name
    const format = new GeoJSON({ featureProjection: 'EPSG:3857' });
    this.source.on('change', function () {
      const features = that.source.getFeatures();
      const json = format.writeFeatures(features);
      that.downloadUrl =
        'data:application/json;charset=utf-8,' + encodeURIComponent(json);
    });
  }

  // sets the color index based on an area factor to color a polygon
  defineColorByArea() {
    const min = 1e8; // the smallest area
    const max = 2e13; // the biggest area
    const steps = 50;
    const ramp = colormap({
      colormap: 'blackbody',
      nshades: steps,
    });

    const clamp = function (value: number, low: number, high: number) {
      return Math.max(low, Math.min(value, high));
    };

    this.colorByArea = function (feature: any) {
      const area = getArea(feature.getGeometry());
      const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
      const index = Math.round(f * (steps - 1));
      console.log('colorByArea', ramp[index]);
      return ramp[index];
    };
  }
}
