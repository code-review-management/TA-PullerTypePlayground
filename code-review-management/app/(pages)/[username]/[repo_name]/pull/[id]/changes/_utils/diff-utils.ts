import path from "path";
import refractor from "refractor";

export function getLanguage(filename: string) {
  const fileExtension = path.extname(filename).slice(1);

  if (refractor.registered(fileExtension)) {
    return fileExtension;
  } else {
    return "txt";
  }
}
