import JSZip from "jszip";

export async function downloadZip(files: { name: string; blob: Blob }[], zipName: string) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = zipName;
  anchor.click();
  URL.revokeObjectURL(url);
}
