import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent } from './map/map.component';
import { GeojsonComponent } from './geojson/geojson.component';
import { MobileComponent } from './mobile/mobile.component';

const routes: Routes = [
  { path: 'basic', component: MapComponent },
  { path: 'vector-data', component: GeojsonComponent },
  { path: 'mobile', component: MobileComponent },
  { path: '', redirectTo: '/basic', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
