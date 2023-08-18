import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {

  constructor(private Titulo:Title) { 
    Titulo.setTitle('Nosotros')
  }

  ngOnInit(): void {
  }

}
