import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-my-dialog',
  templateUrl: './my-dialog.component.html',
  styleUrls: ['./my-dialog.component.css']
})
export class MyDialogComponent implements OnInit {
   @ViewChild('search')
   public searchElementRef:ElementRef;

   public zoom: number;
   public latitude:Number;
   public longitude:number;
   public latlongs: any=[];
   public latlong: any={};
   public searchControl: FormControl;
   
   

  constructor(public dialogRef: MatDialogRef <MyDialogComponent>,private mapsAPILoader:MapsAPILoader, private ngZone:NgZone,
  @Inject(MAT_DIALOG_DATA) public data:any) { 

  }

  ngOnInit() {
    this.zoom=8;
    this.latitude=39.8282;
    this.latitude=-98.5795;

    this.searchControl=new FormControl();
    this.setCurrentPosition();
    this.mapsAPILoader.load().then(()=>{
    const autocomplete=new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,{
    types: [],
    componentRestrictions:{'country':'IN'}
    });
    autocomplete.addListener('place_changed',()=>{
     this.ngZone.run(()=>{
       const place: google.maps.places.PlaceResult=autocomplete.getPlace();
       if(place.geometry===undefined || place.geometry===null){
         return;
       }
       const latlong = {
         latitude: place.geometry.location.lat(),
         longitude:place.geometry.location.lng()
       };
     
       this.latlongs.push(latlong); 
       this.searchControl.reset();
     });
    });
    });
   
  }
  private setCurrentPosition(){
    if('geolocation'in navigator){
      navigator.geolocation.getCurrentPosition((Position)=>{
        this.latitude=Position.coords.latitude;
        this.longitude=Position.coords.longitude;
        this.zoom=8;
      });
    }
  }

  save() {

    this.dialogRef.close("it was save");

  }

}
