export function cortar_nome(nome) {
  nome_formatado_array = nome.split(" ", 2);
  nome_formatado = nome_formatado_array[0] + ' ' + nome_formatado_array[1];
  return nome_formatado;
}