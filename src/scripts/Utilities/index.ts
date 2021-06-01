/** Check if element is in viewport
  * @param {HTMLElement} elementToCheck
  * @return {String}
  */
 export const isInViewport = (elementToCheck: HTMLElement): string | boolean => {
  if (elementToCheck) {
    const {
      top,
      left,
      bottom,
      right,
    } = elementToCheck.getBoundingClientRect()

    if (top < 0) {
      return 'top'
    }
    if (left < 0) {
      return 'left'
    }
    if (bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      return 'bottom'
    }
    if (right > (window.innerWidth || document.documentElement.clientWidth)) {
      return 'right'
    }

    return (
      top >= 0
      && left >= 0
      && bottom <= (window.innerHeight || document.documentElement.clientHeight)
      && right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
  return true
}

export const concatArray = (...args: any[]) => args.reduce((acc, val) => [...acc, ...val])

/** Add CSS style to HTMLElement */
export const addCSSStyle = (el: HTMLElement, styles: any = {}): void => {
  const element = el

  Object
    .keys(styles)
    .forEach((key: string) => {
      element.style[key] = styles[key]
    })
}

/** Add attributes to HTMLElement */
export const setAttributes = (node: HTMLElement, attrs: any): void => {
  Object
    .keys(attrs)
    .forEach((attribute) => {
      node.setAttribute(attribute, attrs[attribute])
    })
}

/** Merge object into one */
export const mergeObject = (defaultObj: any, updatedObj: any): any => Object.assign({}, defaultObj, updatedObj)

/** Test if element is function */
export const isFunction = (functionToCheck: any): boolean => functionToCheck
  && {}.toString.call(functionToCheck) === '[object Function]'

/** Return if value is in range */
export const isInRange = (n:number, nStart: number, nEnd:number): boolean => n >= nStart && n <= nEnd

/** Get value */
export const getValue = (domain: number | string | any[], index: number): number | string => {
  if (Array.isArray(domain)) {
    return domain[index]
  }
  
  return domain
}

/** Capitalize first letter of a string */
export const capitalizeFirstLetter = (string: string): string => string.charAt(0).toUpperCase() + string.slice(1)

/** Recursive method to flatten an array with multiple array nested inside
  * See -> https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/flat
*/
export const arrayFlattenDeep = (array: any[]): any[] => array.reduce((acc, val) => (
  Array.isArray(val) ? acc.concat(arrayFlattenDeep(val)) : acc.concat(val)), [])
