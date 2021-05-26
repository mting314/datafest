import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MediumWidgetModule } from 'ngx-medium-widget';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarxhomeComponent } from './components/navbarxhome/navbarxhome.component';
import { SimplebarchartComponent } from './components/simplebarchart/simplebarchart.component';
import {GoogleAnalyticsService} from './services/google-analytics.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    NavbarxhomeComponent,
    SimplebarchartComponent,
    SimplebarchartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSliderModule,
    AppRoutingModule,
    FontAwesomeModule,
    MediumWidgetModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BsDropdownModule.forRoot()
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
