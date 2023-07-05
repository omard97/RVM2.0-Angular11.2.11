import { Component,ElementRef, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css']
})

export class CamaraComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  isCameraStarted = false;
  capturedPhoto!: string;

  startCamera() {
    const video = this.videoPlayer.nativeElement;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.play();
          this.isCameraStarted = true;
        })
        .catch(error => {
          console.log('Error al acceder a la cámara:', error);
        });
    } else {
      console.log('La API MediaDevices no está disponible');
    }
  }

  capturePhoto() {
    const video = this.videoPlayer.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    this.capturedPhoto = canvas.toDataURL('image/jpeg');
  }
}
