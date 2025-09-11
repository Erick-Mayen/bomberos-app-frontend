import { Injectable } from '@angular/core';
import Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {
    Notiflix.Report.init({
      backgroundColor: '#fff',
    });
  }

  SuccesNotify(message: string) {
    Notiflix.Notify.success(message);
  }

  ErrorNotify(message: string) {
    Notiflix.Notify.failure(message);
  }

  WarningNotify(message: string) {
    Notiflix.Notify.warning(message);
  }

  successReport(title: string, message: string) {
    Notiflix.Report.success(
      title,
      message,
      'Aceptar'
    );
  }

  errorReport(title: string, message: string) {
    Notiflix.Report.failure(
      title,
      message,
      'Cerrar'
    );
  }

  infoReport(title: string, message: string) {
    Notiflix.Report.info(
      title,
      message,
      'Aceptar'
    );
  }

  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    Notiflix.Confirm.show(
      title,
      message,
      'Sí',
      'No',
      onConfirm,
      onCancel,
      {
        titleColor: '#4caf50',
        okButtonBackground: '#4caf50',
        cancelButtonBackground: '#f44336',
        backgroundColor: '#fff',
        messageColor: '#333',
      }
    );
  }
}
