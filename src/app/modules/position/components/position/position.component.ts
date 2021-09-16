import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PositionService } from 'src/app/core/services/position/position.service';
import { Position } from 'src/app/shared/models/position.model';
import { MessageResponse } from 'src/app/shared/models/response/message.response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

  labelButton: string = "Guardar";

  position: Position;
  message: MessageResponse;

  positions: Position[] = [];

  positionForm: FormGroup;

  @ViewChild('myPositionForm') private myPositionForm: NgForm;

  constructor( private fb: FormBuilder,
              private _positionService: PositionService ) { 

    this.createPositionForm();
  }

  ngOnInit(): void {

    this.getPositions();
  }

  createPositionForm() {
  
    this.positionForm = this.fb.group({
      mode: ['new', Validators.required],
      id: [''],
      name: ['', Validators.required]
    });
  }

  submitPositionForm() {

    if ( this.positionForm.invalid ) { return; }

    const position = this.positionForm.value;

    this.position = new Position(
      position.id,
      position.name
    );

    this.sendPetition( position.mode, this.position );    
  }

  sendPetition( mode: string, position: Position ) {

    let petition: Observable<MessageResponse>;

    if( mode == 'new' ) {
      petition = this._positionService.savePosition( position );
    }
    if( mode == 'edit' ) {
      petition = this._positionService.updatePosition( position );
    }
    if( mode == 'remove' ) {
      petition = this._positionService.deletePosition( position.id );
    }

    petition.subscribe( resp => {
      
      this.message = resp;

      if( !this.message.error ) {

        Swal.fire({
          title: '',
          text: this.message.message,
          icon: 'success',
          confirmButtonColor: '#2196f3'
        });

        this.clearPositionForm();
  
      } else {
  
        Swal.fire({
          title: 'Error',
          text: this.message.message,
          icon: 'error',
          confirmButtonColor: '#2196f3'
        });
      }

    },
    error => {
      
      Swal.fire({
        title: 'Error',
        text: error,
        icon: 'error',
        confirmButtonColor: '#2196f3'
      });
    });
  }

  getPosition( mode: string, id: number ) {
    
    this._positionService.getPosition( id )
      .subscribe( resp => {

        if( resp != null ) {

          if( mode == 'edit' ) {
            this.labelButton = "Actualizar";
            this.enableFields();
          }
          if( mode == 'remove' ) {
            this.labelButton = "Eliminar";
            this.disableFields();
          }

          this.position = resp;
          this.positionForm.patchValue({
            mode: mode,
            id: this.position.id,
            name: this.position.name
          });
        }
      });
  }

  getPositions() {

    this._positionService.getPositions()
      .subscribe( resp => {
        
        this.positions = resp;
      });
  }

  clearPositionForm() {

    this.labelButton = "Guardar";
    this.getPositions();
    this.myPositionForm.resetForm();
    this.enableFields();
    this.positionForm.patchValue({
      mode: "new"
    });
  }

  enableFields() {

    Object.keys(this.positionForm.controls).forEach(key => {
      this.positionForm.controls[key].enable();
    });
  }

  disableFields() {

    Object.keys(this.positionForm.controls).forEach(key => {
      if( key != "mode" && key != "id" ) {
        this.positionForm.controls[key].disable();
      }              
    });
  }

}
