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

@Component({
  selector: 'app-geojson',
  templateUrl: './geojson.component.html',
  styleUrls: ['./geojson.component.css'],
})
export class GeojsonComponent implements AfterViewInit {
  downloadUrl?: string;
  private map?: Map;
  private source: VectorSource = new VectorSource();

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.prepareDownload();
  }

  initMap(): void {
    const layer: VectorLayer<VectorSource> = new VectorLayer({
      source: this.source,
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
}
