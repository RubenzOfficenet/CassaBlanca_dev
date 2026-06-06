import { Component, inject, signal, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Nuevoinmueble } from './nuevoinmueble/nuevoinmueble';
import { InmueblesServices } from '../../services/inmuebles-services';
import { ICasas } from '../../Models/inmueble.model';
import { MatSortModule } from '@angular/material/sort';
import { CurrencyPipe } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-inmuebles',
  imports: [MatButtonModule,
    MatDialogModule,
    MatSortModule,
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule],
  templateUrl: './inmuebles.html',
  styleUrl: './inmuebles.css',
})


export class Inmuebles implements AfterViewInit {

  displayedColumns: string[] = [
    'numeroCasa',
    'cuotaDeMantenimientoBase',
    'estadoInicialOcupacion',
    'nombreTitular',
    'emailTitular',
    'celularTitular',
    'nombreOcupante',
    'emailOcupante',
    'celularOcupante',
    'numeroHabitantes'
  ];

  dataSource = new MatTableDataSource<ICasas>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private _inmueblesServices: InmueblesServices) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.cargaDatosInmuebles();
  }

  casas = signal<ICasas[]>([]);
  totalRegistros?: number;



  cargaDatosInmuebles() {
    this._inmueblesServices.getInmuebles().subscribe({
      next: (data) => {
        console.log('Datos de inmuebles recibidos:', data);
        this.dataSource.data = data;   // ✅ Actualizas los datos sin recrear el dataSource
        this.totalRegistros = data.length;
      },
      error: (err) => {
        console.error('Error al cargar los inmuebles:', err);
      }
    });
  }

  // cargaDatosInmuebles() {
  //   this._inmueblesServices.getInmuebles().subscribe({
  //     next: (data) => {
  //       this.casas.set(data);
  //       this.totalRegistros = this.casas().length;
  //       this.dataSource = new MatTableDataSource(this.casas());
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar los inmuebles:', err);
  //     }
  //   });
  //   this.dataSource = new MatTableDataSource(this.casas());

  // }



  abrirPopup() {
    const dialogRef = this.dialog.open(Nuevoinmueble, {
      width: '40vw',       // 80% del ancho de la pantalla (Viewport Width)
      maxWidth: '2000px',   // No crecerá más de 800px
      minWidth: '320px',   // No se encogerá a menos de 320px
      disableClose: false, // Evita que se cierre al hacer clic fuera o presionar Escape
      hasBackdrop: true,
      height: '700px'
    });

    // Capturar el resultado cuando se cierre
    dialogRef.afterClosed().subscribe(result => {
      console.log('El pop-up se cerró. Resultado:', result);
      if (result === true) {
        // El usuario hizo clic en "Aceptar"
      }
    });
  }

}
