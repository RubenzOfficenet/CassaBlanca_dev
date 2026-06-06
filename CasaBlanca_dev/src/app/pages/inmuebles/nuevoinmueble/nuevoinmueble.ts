import { Component } from '@angular/core';
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nuevoinmueble',
  imports: [MatDialogContent, MatDialogActions, MatDialogModule, MatButtonModule],
  templateUrl: './nuevoinmueble.html',
  styleUrl: './nuevoinmueble.css',
})
export class Nuevoinmueble {}
