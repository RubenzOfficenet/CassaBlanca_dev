import { Component, viewChild, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef, MatDialogActions } from "@angular/material/dialog";
import { IEstadosOcupacion } from '../../../interfaces/iestadosocupacion.interfase';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { Nuevoinmueble } from '../nuevoinmueble/nuevoinmueble';
import { InmueblesServices } from '../../../services/inmuebles-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InmuebleEditarDTO } from '../../../Models/InmuebleEditarDTO.model';


@Component({
  selector: 'app-editarinmueble',
  imports: [MatDialogContent, MatDialogActions, ConfirmDialog, ReactiveFormsModule, MatButtonModule],
  templateUrl: './editarinmueble.html',
  styleUrl: './editarinmueble.css',
})
export class Editarinmueble implements OnInit {

  inmuebleForm: FormGroup;
  estadosOcupacion: IEstadosOcupacion[] = [];
  modalConfirmacion = viewChild<ConfirmDialog>('modalConfirmacion');

  constructor(private fb: FormBuilder,
              private _inmueblesServices: InmueblesServices,
              @Inject(MAT_DIALOG_DATA) public data: { id: number },

              private dialogRef: MatDialogRef<Nuevoinmueble>,
              private snackBar: MatSnackBar) 
    {
    this.inmuebleForm = this.fb.group({
      NumeroCasa: ['', [
        Validators.required,
        Validators.pattern(/^(?!\s*$).+/)
      ]],
      Ubicacion: [''],
      CuotaDeMantenimientoBase: [0],
      EstadoOcupacion: [-1],
      NumeroHabitantes: [0],

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


  }

  ngOnInit(): void {
    this.getEstadosOcupacion();
    this.cargarInmueble();
  }

  cargarInmueble(): void {
    this._inmueblesServices
      .getInuebleById(this.data.id)
      .subscribe({
        next: (inmueble) => {
          this.inmuebleForm.patchValue({
            NumeroCasa: inmueble.numeroCasa,
            Ubicacion: inmueble.ubicacion,
            CuotaDeMantenimientoBase: inmueble.cuotaDeMantenimientoBase,
            EstadoOcupacion: inmueble.estadoOcupacion,
            NumeroHabitantes: inmueble.numeroHabitantes,

            NombreTitular: inmueble.nombreTitular,
            ApellidosTitular: inmueble.apellidosTitular,
            CelularTitular: inmueble.celularTitular,
            EmailTitular: inmueble.emailTitular,

            NombreOcupante: inmueble.nombreOcupante,
            ApellidosOcupante: inmueble.apellidosOcupante,
            CelularOcupante: inmueble.celularOcupante,
            EmailOcupante: inmueble.emailOcupante,

            Observaciones: inmueble.observaciones
          });

        },
        error: (err) => {
          console.error('Error al obtener inmueble', err);
        }
      });
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

  guardar() {
    // valida el formulario
    if (this.inmuebleForm.invalid) {
      this.inmuebleForm.markAllAsTouched();
      return;
    }
  }


} // end coponent
