export const getImageSize = (
    url: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const onFinish = (
        size: { width: number; height: number } = { width: 0, height: 0 },
      ) => {
        img.remove();
        resolve(size);
      };
      img.onerror = () => onFinish();
      img.onload = () => onFinish({ width: img.width, height: img.height });
      img.src = url;
    });
  };
  