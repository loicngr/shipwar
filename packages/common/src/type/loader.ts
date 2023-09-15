export interface LoaderInterface {
  readonly images: Record<string, HTMLImageElement | unknown>

  getImage: (key: string) => HTMLImageElement
  loadImage: (key: string, src: string) => Promise<HTMLImageElement | string>
}
