export function PlateGenerator(name: string) {
  let plate = deleteVocals(name);
  plate = plate.slice(0, 3).toUpperCase();
  return plate;
}

function deleteVocals(originalName: string) {
  let text = deleteSpace(originalName);
  text = text.replace(/[aáAÁeéEÉiíIÍoOóÓuúUÚ]/g, '');
  return text;
}

function deleteSpace(text: string) {
  let cleanText = text.replace(/\s+/g, '');
  return cleanText;
}
