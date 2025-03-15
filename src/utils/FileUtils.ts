import { domains } from "@/constants/Domain";

const validUrlProtocols: string[] = ['http', 'blob', 'data:', 'content:', '/_next', 'file:'];

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
  
  export const getUploadFileUrl = (url: any, fallbackUrl: string = '') => {
    url = String(url?.default || url || '');
    if (!url) return fallbackUrl;
    if (!validUrlProtocols.some((i) => url.startsWith(i))) {
        url = domains.cdn + url;
    }
    return url;
};
