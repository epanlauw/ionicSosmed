import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { map } from "rxjs/operators";
import { Maps } from "src/app/model/map";
import { AuthService } from "src/app/service/auth.service";
import { UserService } from "src/app/service/user.service";

declare var google: any;

@Component({
  selector: "app-home-map",
  templateUrl: "./home-map.page.html",
  styleUrls: ["./home-map.page.scss"],
})
export class HomeMapPage implements OnInit {
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild("map", { read: ElementRef, static: false }) mapRef: ElementRef;
  umnPos: any = {
    lat: -6.256081,
    lng: 106.618755,
  };
  LocationNow: any = {
    lat: -6.256081,
    lng: 106.618755,
  };
  userEmail: string;
  userID: string;
  friends: any;
  namaDepan: string;
  namaBelakang: string;
  photo: SafeResourceUrl;
  user: any;
  Marker: any = [];
  user2: any;
  ShowDataMap: any;
  dataMapNow: any;
  dataMap: any;
  latTemp: any;
  lngTemp: any;

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userSrv: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.authSrv.userDetails().subscribe(
      (res) => {
        if (res !== null) {
          this.userEmail = res.email;
          this.userSrv
            .getAll("user")
            .snapshotChanges()
            .pipe(
              map((changes) =>
                changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
              )
            )
            .subscribe((data) => {
              this.user = data;
              this.user = this.user.filter((User) => {
                return User.email == this.userEmail;
              });
              this.photo = this.user[0].imageUrl;
              this.namaDepan = this.user[0].nDepan;
              this.namaBelakang = this.user[0].nBelakang;

              this.userSrv
                .getCurrentLocation("" + this.namaDepan)
                .snapshotChanges()
                .pipe(
                  map((changes) =>
                    changes.map((c) => ({
                      key: c.payload.key,
                      ...c.payload.val(),
                    }))
                  )
                )
                .subscribe((data2) => {
                  var postShowDataMapUserCenter = {
                    lat: undefined,
                    lng: undefined,
                  };
                  this.dataMapNow = data2;
                  if (!this.dataMapNow[0]) {
                    postShowDataMapUserCenter = {
                      lat: -6.256081,
                      lng: 106.618755,
                    };
                  } else {
                    postShowDataMapUserCenter = {
                      lat: this.dataMapNow[0].lat,
                      lng: this.dataMapNow[0].lng,
                    };
                  }
                  const location = new google.maps.LatLng(
                    postShowDataMapUserCenter.lat,
                    postShowDataMapUserCenter.lng
                  );
                  const options = {
                    center: location,
                    zoom: 13,
                    disableDefaultUI: true,
                  };
                  this.map = new google.maps.Map(
                    this.mapRef.nativeElement,
                    options
                  );
                  this.userSrv
                    .getFriend(this.namaDepan)
                    .snapshotChanges()
                    .pipe(
                      map((changes) =>
                        changes.map((c) => ({
                          key: c.payload.key,
                          ...c.payload.val(),
                        }))
                      )
                    )
                    .subscribe((data2) => {
                      this.friends = data2;
                      for (let i = 0; i < this.friends.length; ) {
                        this.userSrv
                          .getCurrentLocation(this.friends[i].nDepan)
                          .snapshotChanges()
                          .pipe(
                            map((changes) =>
                              changes.map((c) => ({
                                key: c.payload.key,
                                ...c.payload.val(),
                              }))
                            )
                          )
                          .subscribe((data3) => {
                            this.ShowDataMap = data3;
                            const postShowDataMap = {
                              lat: this.ShowDataMap[0].lat,
                              lng: this.ShowDataMap[0].lng,
                            };
                            if (i == 1) {
                              this.Marker[i] = new google.maps.Marker({
                                position: this.umnPos,
                                map: this.map,
                              });
                            } else {
                              this.Marker[i] = new google.maps.Marker({
                                position: postShowDataMap,
                                map: this.map,
                              });
                            }
                          });
                        i++;
                      }
                      if (!this.dataMapNow[0]) {
                      } else {
                        const postShowDataMapUser = {
                          lat: this.dataMapNow[0].lat,
                          lng: this.dataMapNow[0].lng,
                        };
                        this.Marker[
                          this.friends.length
                        ] = new google.maps.Marker({
                          position: postShowDataMapUser,
                          map: this.map,
                        });
                      }
                    });
                });
            });
        } else {
          this.navCtrl.navigateBack("");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  locationClick() {
    if(this.map) {
      this.map.panTo({lat: this.dataMapNow[0].lat, lng: this.dataMapNow[0].lng});
    }
  }

  showCurrentLoc() {
    this.presentLoading().then(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.infoWindow.setPosition(pos);
          this.infoWindow.setContent("Your Current Location");
          this.infoWindow.open(this.map);
          const marker2 = new google.maps.Marker({
            position: pos,
            map: this.map,
          });
          let date = new Date();
          const postData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            time: "" + date,
          };
          this.dataMap = postData;
          if (this.dataMapNow.length == 0) {
            this.userSrv
              .CurrentLocation(this.namaDepan, this.dataMap)
              .then((res) => {});
            this.presentToast();
          }
          if (this.dataMapNow.length > 0) {
            this.userSrv
              .DeleteLocation(this.dataMapNow[0].key, this.namaDepan)
              .then((res) => {
                this.userSrv
                  .CurrentLocation(this.namaDepan, this.dataMap)
                  .then((res) => {
                    this.presentToast2();
                  });
              });
          }
          this.map.setCenter(pos);
        });
      }
    });
  }

  async presentToast() {
    let toast = this.toastCtrl.create({
      message: "Lokasi Telah Diinput, silahkan refresh aplikasi.",
      color: "primary",
      duration: 1000,
      position: "bottom",
    });

    (await toast).present();
  }

  async presentToast2() {
    let toast = this.toastCtrl.create({
      message: "Lokasi Telah Diupdate, silahkan refresh aplikasi.",
      color: "primary",
      duration: 1000,
      position: "bottom",
    });

    (await toast).present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Cari Lokasi....",
      duration: 5000,
    });
    await loading.present();

    await loading.onDidDismiss();
  }
}
