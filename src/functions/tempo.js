
export function inicio_mes() {
  data = new Date;
  if (data.getMonth() + 1 < 10) {
    mes = '0' + data.getMonth()
  } else {
    mes = data.getMonth()
  }

  dataFormat = data.getFullYear() + '-' + mes + '-' + '01';

  return dataFormat;
}


export function date(data) {
  //data = new Date;
  if (data.getMonth() + 1 < 10) {
    mes = '0' + (data.getMonth() + 1)
  } else {
    mes = data.getMonth() + 1
  }
  if (data.getDate() <= 9) {
    dia = '0' + data.getDate();
  } else {
    dia = data.getDate();
  }
  dataFormat = data.getFullYear() + '-' + mes + '-' + dia;

  return dataFormat;
}

export function time() {

  data = new Date;
  hora = '';
  minutos = '';

  if (data.getMinutes() < 10) {
    minutos = '0' + data.getMinutes();
  } else {
    minutos = data.getMinutes();
  }

  if (data.getHours() < 10) {
    hora = '0' + data.getHours();
  } else {
    hora = data.getHours();
  }

  timeFormat = hora + ":" + minutos + ":" + '00';
  return timeFormat;
}



export function timeParam(data) {

  //data = new Date;
  hora = '';
  minutos = '';

  if (data.getMinutes() < 10) {
    minutos = '0' + data.getMinutes();
  } else {
    minutos = data.getMinutes();
  }

  if (data.getHours() < 10) {
    hora = '0' + data.getHours();
  } else {
    hora = data.getHours();
  }


  timeFormat = hora + ":" + minutos + ":" + '00';
  return timeFormat;
}


export function timeParam_curto(data) {

  //data = new Date;
  hora = '';
  minutos = '';

  if (data.getMinutes() < 10) {
    minutos = '0' + data.getMinutes();
  } else {
    minutos = data.getMinutes();
  }

  if (data.getHours() < 10) {
    hora = '0' + data.getHours();
  } else {
    hora = data.getHours();
  }

  timeFormat = hora + ":" + minutos;
  return timeFormat;
}


export function timeToString(time) {

  const date = new Date(time);
  return date.toISOString().split('T')[0];
}
