import { Component, viewChild } from '@angular/core';
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ICasaCreate } from '../../../interfaces/icasa.interfase';
import { FormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IEstadosOcupacion } from '../../../interfaces/iestadosocupacion.interfase';
import { InmueblesServices } from '../../../services/inmuebles-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from "../../shared/confirm-dialog/confirm-dialog";
import { convertCompilerOptionsFromJson } from 'typescript';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { ComponentResourceCollector } from '@angular/cdk/schematics';

@Component({
  selector: 'app-nuevoinmueble',
  imports: [MatDialogContent, MatDialogActions, MatDialogModule, MatButtonModule, FormsModule, ReactiveFormsModule, ConfirmDialog],
  templateUrl: './nuevoinmueble.html',
  styleUrl: './nuevoinmueble.css',
})
export class Nuevoinmueble {

  //casaCreate: ICasaCreate;
  inmuebleForm: FormGroup;
  estadosOcupacion: IEstadosOcupacion[] = [];
  modalConfirmacion = viewChild<ConfirmDialog>('modalConfirmacion');
  nuevaCasa: ICasaCreate;


  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<Nuevoinmueble>,
    private _inmueblesServices: InmueblesServices,
    private snackBar: MatSnackBar) {

    this.inmuebleForm = this.fb.group({
      NumeroCasa: [''],
      Ubicacion: [''],
      CuotaDeMantenimientoBase: [''],
      EstadoOcupacion: [''],
      NumeroHabitantes: [''],
      NombreTitular: [''],
      ApellidosTitular: [''],
      CelularTitular: [''],
      EmailTitular: [''],
      NombreOcupante: [''],
      ApellidosOcupante: [''],
      CelularOcupante: [''],
      EmailOcupante: [''],
      Observaciones: ['']
    });

    this.nuevaCasa = {
      numeroCasa: '',
      ubicacion: '',
      cuotaDeMantenimientoBase: 0,
      estadoOcupacion: 0,
      nombreTitular: '',
      apellidosTitular: '',
      emailTitular: '',
      celularTitular: '',
      observaciones: ''
    }
  }

  ngOnInit() {
    this.getEstadosOcupacion();
  }

  guardar() {
    // Devuelve todo el objeto con los valores del formulario
    //this.dialogRef.close(this.inmuebleForm.value);

    this.nuevaCasa = this.construirNuevaCasa();
    console.log(this.nuevaCasa);
    
    this.dialogRef.close('Casa creada...');

  }



  cancelar() {
    this.dialogRef.close(null);
  }


  getEstadosOcupacion() {
    this._inmueblesServices.getEstadosOcupacion().subscribe({
      next: (data) => {
        this.estadosOcupacion = data;
        if (data.length > 0) {
          this.inmuebleForm.patchValue({
            EstadoOcupacion: data[0].id
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar los Estados de Ocupacion:', err);
      }
    });
  }

  mostrarConfirmacion(): void {
    this.modalConfirmacion()?.abrir();
  }

  onCancelar(): void {
    console.log('Operación cancelada');
  }


  private construirNuevaCasa(): ICasaCreate {
    const f = this.inmuebleForm.getRawValue();

    return {
      numeroCasa: f.NumeroCasa,
      ubicacion: f.Ubicacion,
      cuotaDeMantenimientoBase: Number(f.CuotaDeMantenimientoBase),
      estadoOcupacion: f.EstadoOcupacion ? Number(f.EstadoOcupacion) : undefined,
      nombreTitular: f.NombreTitular,
      apellidosTitular: f.ApellidosTitular,
      emailTitular: f.EmailTitular,
      celularTitular: f.CelularTitular,
      observaciones: f.Observaciones
    };
  }

}
