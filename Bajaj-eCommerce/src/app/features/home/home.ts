import { Component } from '@angular/core';
import { Slider } from '../../shared/components/slider/slider';
import { Banner } from '../../shared/components/banner/banner';

@Component({
  selector: 'bajaj-home',
  imports: [Slider, Banner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly title = 'Bajaj ECommerce - Welcome';
}

