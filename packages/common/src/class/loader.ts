import { LoaderInterface } from '../type/loader'

export class Loader implements LoaderInterface {
  private readonly images: Record<string, HTMLImageElement | unknown>

  constructor () {
    this.images = {}
  }

  public getImage (key: string): HTMLImageElement {
    const image = this.images[key] ?? undefined

    if (image == null) {
      throw new Error('Image not found')
    }

    return image as HTMLImageElement
  }

  public async loadImage (key: string, src: string): Promise<HTMLImageElement | string> {
    const image = new Image()

    const loader = new Promise<HTMLImageElement | string>((resolve, reject) => {
      image.onload = () => {
        this.images[key] = image
        resolve(image)
      }

      image.onerror = (e) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Could not load image ${src} ${JSON.stringify(e)}`)
      }
    })

    image.src = src
    return await loader
  }
}
