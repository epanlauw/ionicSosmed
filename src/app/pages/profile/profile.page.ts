import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;
  userID: string;
  namaDepan: string;
  namaBelakang: string;
  photo: SafeResourceUrl;
  user: any ;
  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private userSrv: UserService,
    private storage: AngularFireStorage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController 
  ) {}

  ngOnInit(){
      this.authSrv.userDetails().subscribe(res => {
        console.log('res: ', res);
        console.log('uid ', res.uid);
        if(res !== null){
          this.userEmail = res.email;
          this.userSrv.getAll('user').snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))  
            )
          ).subscribe(data => {
            this.user = data;
            console.log(this.user);
            console.log(this.userEmail);
            this.user = this.user.filter(User => {
                return User.email == this.userEmail
            });
            console.log(this.user);
            this.photo = this.user[0].imageUrl;
            console.log("adsasd",this.photo);
            this.namaDepan = this.user[0].nDepan;
            this.namaBelakang =this.user[0].nBelakang
            console.log(this.namaDepan);
            console.log(this.namaBelakang);
            /*for(let i = 0; i < this.user.length;){
                if(this.user[i].email === this.userEmail){
                  this.photo = this.user[i].imageUrl;
                }
                i++;
            }*/
          });
        }else {
          this.navCtrl.navigateBack('');
        }
      }, err => {
        console.log(err);
      });
  }
  
  async presentToast(){
    let toast = this.toastCtrl.create({
      message: 'Profile Telah diUpload',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }
  
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Upload Profile....",
      duration: 5000,
    });
    await loading.present();
  
    await loading.onDidDismiss();
  }

  async presentToast2(){
    let toast = this.toastCtrl.create({
      message: 'User Telah Logout',
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
  
    (await toast).present();
  }
  
  async presentLoading2() {
    const loading = await this.loadingCtrl.create({
      message: "Logout....",
      duration: 5000,
    });
    await loading.present();
  
    await loading.onDidDismiss();
  }


  logout(){
    this.presentLoading2().then(() => {
          this.authSrv.logoutUser()
        .then(res => {
          console.log(res);
          this.presentToast2
          this.navCtrl.navigateBack('');
        })
        .catch(error => {
          console.log(error);
        });
    });

  }

}
