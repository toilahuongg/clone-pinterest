export const getImage = (file: File): Promise<{ width: string; height: string }> =>
  new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = function () {
      resolve({ width: `${img.width}`, height: `${img.height}` });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
