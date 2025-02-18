import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DetailsComponent } from './pages/details/details.component';
import { HeaderComponent } from './core/header/header.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailsComponent, NotFoundComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgApexchartsModule, HeaderComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
