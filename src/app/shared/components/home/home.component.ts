import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommodityService } from 'src/app/core/services/commodity/commodity.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { Commodity } from '../../models/commodity.model';
import { MessageResponse } from '../../models/response/message.response';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  labelButton: string = "Guardar";

  commodity: Commodity;
  creatorUser: User;
  message: MessageResponse;

  listCommodity: Commodity[] = [];
  users: User[] = [];

  filterForm: FormGroup;
  commodityForm: FormGroup;

  @ViewChild('myCommodityForm') private myCommodityForm: NgForm;

  constructor( private fb: FormBuilder, 
              private _commodityService: CommodityService,
              private _userService: UserService ) {

    this.createFilterForm();
    this.createCommodityForm();
  }

  ngOnInit(): void {

    this.getListCommodity( "", "", "" );
    this.getUsers();
  }

  createFilterForm() {
  
    this.filterForm = this.fb.group({
      name: [''],
      date: [''],
      creatorUser: ['']
    });
  }

  submitFilterForm() {

    if ( this.filterForm.invalid ) { return; }

    const filter = this.filterForm.value;
    this.getListCommodity( filter.name, filter.date, filter.creatorUser );
  }

  createCommodityForm() {
  
    this.commodityForm = this.fb.group({
      mode: ['new', Validators.required],
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      product: ['', [Validators.required, Validators.maxLength(30)]],
      quantity: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]], 
      dateOfAdmission: ['', Validators.required],
      creatorUser: ['', Validators.required],
    });
  }

  submitCommodityForm() {

    if ( this.commodityForm.invalid ) { return; }

    const commodity = this.commodityForm.value;
    this.creatorUser = new User( commodity.creatorUser );

    this.commodity = new Commodity(
      commodity.id,
      commodity.name,
      commodity.product,
      commodity.quantity,
      commodity.dateOfAdmission,
      this.creatorUser
    );

    this.sendPetition( commodity.mode, this.commodity );    
  }

  sendPetition( mode: string, commodity: Commodity ) {

    let petition: Observable<MessageResponse>;

    if( mode == 'new' ) {
      petition = this._commodityService.saveCommodity( commodity );
    }
    if( mode == 'edit' ) {
      petition = this._commodityService.updateCommodity( commodity );
    }
    if( mode == 'remove' ) {
      petition = this._commodityService.deleteCommodity( commodity.id, commodity.creatorUser.id );
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

        this.clearCommodityForm();
  
      } else {
  
        Swal.fire({
          title: 'Error',
          text: this.message.message,
          icon: 'error',
          confirmButtonColor: '#2196f3'
        });
      }

    });
  }

  getCommodity( mode: string, id: number ) {
    
    this._commodityService.getCommodity( id )
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

          this.commodity = resp;
          this.commodityForm.patchValue({
            mode: mode,
            id: this.commodity.id,
            name: this.commodity.name,
            product: this.commodity.product,
            quantity: this.commodity.quantity,
            dateOfAdmission: this.formatDate( this.commodity.dateOfAdmission ),
            creatorUser: this.commodity.creatorUser.id
          });
        }
      });
  }

  getListCommodity( name: string, date: string, creatorUser: any ) {

    this._commodityService.getListCommodity( name, date, creatorUser )
      .subscribe( resp => {

        this.listCommodity = resp;
      });
  }

  getUsers() {

    this._userService.getUsers()
      .subscribe( resp => {
        
        this.users = resp;
      });
  }

  clearCommodityForm() {

    this.labelButton = "Guardar";
    this.getListCommodity( "", "", "" );
    this.myCommodityForm.resetForm();
    this.enableFields();
    this.commodityForm.patchValue({
      mode: "new",
      creatorUser: ""
    });
  }

  enableFields() {

    Object.keys(this.commodityForm.controls).forEach(key => {
      this.commodityForm.controls[key].enable();
    });
  }

  disableFields() {

    Object.keys(this.commodityForm.controls).forEach(key => {
      if( key != "mode" && key != "id" && key != "creatorUser" ) {
        this.commodityForm.controls[key].disable();
      }              
    });
  }

  private formatDate( date: Date ) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
