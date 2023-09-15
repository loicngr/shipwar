import type { VectorInterface } from '../type/vector'

export class Vector {
  /**
   * Constructeur de classe
   * @param x Coordonnée X du vecteur
   * @param y Coordonnée Y du vecteur
   */
  constructor (public x: VectorInterface['x'], public y: VectorInterface['y']) {}

  /**
   * Ajoute un autre vecteur à ce vecteur
   * @param v Le vecteur à ajouter
   * @returns Le vecteur résultant
   */
  add (v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  /**
   * Soustrait un autre vecteur à ce vecteur
   * @param v Le vecteur à soustraire
   * @returns Le vecteur résultant
   */
  subtract (v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  /**
   * Multiplie ce vecteur par une valeur scalaire
   * @param scalar Le scalaire par lequel multiplier le vecteur
   * @returns Le vecteur résultant
   */
  multiply (scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  /**
   * Divise ce vecteur par une valeur scalaire
   * @param scalar Le scalaire par lequel diviser le vecteur
   * @returns Le vecteur résultant
   */
  divide (scalar: number): Vector {
    return new Vector(this.x / scalar, this.y / scalar)
  }

  /**
   * Calcule la longueur (magnitude) de ce vecteur
   * @returns La longueur du vecteur
   */
  magnitude (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  /**
   * Normalise ce vecteur (le rend de longueur 1)
   * @returns Le vecteur normalisé
   */
  normalize (): Vector {
    const length = this.magnitude()
    return this.divide(length)
  }
}
