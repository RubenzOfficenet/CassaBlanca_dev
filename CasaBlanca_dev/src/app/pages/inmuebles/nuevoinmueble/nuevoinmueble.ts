import { Component, viewChild } from '@angular/core';
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ICasaCreate } from '../../../interfaces/icasa.interfase';
import { FormsModule, NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IEstadosOcupacion } from '../../../interfaces/iestadosocupacion.interfase';
import { InmueblesServices } from '../../../services/inmuebles-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from "../../shared/confirm-dialog/confirm-dialog";
import { convertCompilerOptionsFromJson } from 'typescript';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { ComponentResourceCollector } from '@angular/cdk/schematics';
import { validate } from '@angular/forms/signals';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-nuevoinmueble',
  imports: [MatDialogContent, MatDialogActions, MatDialogModule, MatButtonModule, FormsModule, ReactiveFormsModule, ConfirmDialog, MatSnackBarModule],
  templateUrl: './nuevoinmueble.html',
  styleUrl: './nuevoinmueble.css',
})
export class Nuevoinmueble {

  //casaCreate: ICasaCreate;
  inmuebleForm: FormGroup;
  estadosOcupacion: IEstadosOcupacion[] = [];
  modalConfirmacion = viewChild<ConfirmDialog>('modalConfirmacion');
  nuevaCasa: ICasaCreate;
  numeroCasaVacio: boolean = true;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<Nuevoinmueble>,
    private _inmueblesServices: InmueblesServices,

    private snackBar: MatSnackBar) {
    this.inmuebleForm = this.fb.group({
      NumeroCasa: ['', [
        Validators.required,
        Validators.pattern(/^.*\S.*$/)]],
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
    // valida el formulario
    if (this.inmuebleForm.invalid) {
      this.inmuebleForm.markAllAsTouched();
      this.numeroCasaVacio = true;
      return;
    }

    debugger;
    this.numeroCasaVacio = false;
    this.nuevaCasa = this.construirNuevaCasa();

    this._inmueblesServices.postCreateHouse(this.nuevaCasa).subscribe({
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
    this.numeroCasaVacio = true;
    if (this.inmuebleForm.get('NumeroCasa')?.invalid) {      
      this.snackBar.open(
        'Debe capturar el Número de Casa.',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        }
      );      
      return;
    }

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
