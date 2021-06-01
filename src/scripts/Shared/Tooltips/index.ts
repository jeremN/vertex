import { IPosition } from './type';
import { Selection? select, event } from 'd3-selection';

class D3Tooltip {
  tooltip: null | Selection<SVGElement, any, HTMLElement, any>;
  type: null | string;
  tempClasses: null | string;
  target: null | Selection<SVGElement, any, HTMLElement, any>;
  posType: null | string;

  constructor() {
    this.tooltip = null
    this.type = null
    this.tempClasses = null
    this.target = null
    this.posType = null

    this.createTooltip()
  }

  createTooltip() {
    if (document.querySelector('.stan__c__tooltip--d3Tooltip')) {
      this.tooltip = select('.stan__c__tooltip--d3Tooltip')
    } else {
      this.tooltip = select('body')
         .append('div')
        .attr('class', 'stan__c__tooltip stan__c__tooltip--d3Tooltip')
        .style('display', 'none')
        .style('opacity', 0)
        .style('position', 'fixed')
    }
  }

  /**  Append tooltip
    *  @param {HTMLElement} html
    *  @param {Node, HTMLElement} target
    *  @param {ClassName} classe
    *  @param {String} type
    */
  appendTooltip(html: HTMLElement, classe: string, target: Selection<SVGElement, any, HTMLElement, any>, type: string = 'none') {
    if (!html) throw new Error('html must be defined')

    if (this.tooltip) {
      if (this.tempClasses) this.tooltip.classed(this.tempClasses, false)
      if (classe && classe !== ('' || null)) {
        this.tempClasses = classe
        this.tooltip.classed(classe, true)
      }
      if (target) this.target = target
      this.posType = type
      
      this.tooltip.html(html)
      .style('left', 0)
      .style('top', 0)
      .style('display', 'flex')
      
      return this
    }
  }

  /**  Calculate tooltip position
    *  @param {Node || HTMLElement} target
    *  @param {String} type
    *  @return {Array} pos[x, y]
    */
  static tooltipPosition(target: SVGElement | null, type: string): Array<any> {
    const { clientX, clientY } = event
    const pos = [clientX + 20, clientY + 20]
    if (!target) return pos

    const {
      x,
      y,
      width: tW,
      height: tH,
    } = target.getBoundingClientRect()
    const { width, height } = document.querySelector('.stan__c__tooltip--d3Tooltip')?.getBoundingClientRect()
    const position: IPosition = {
      top: [x - width / 2 + tW / 2, y - height - tH / 2],
      bottom: [x - width / 2 + tW / 2, y + height / 2 + tH / 2],
      right: [x + tW + 10, y - height / 2 + tH / 2],
      left: [x - width - 10, y - height / 2 + tH / 2],
    }

    return type ? position[type] : pos
  }

  /**  Show tooltip
    *  @param {Number} duration
    *  @param {Array} manualPosition
    */
  showTooltip(duration: number, manualPosition: any[]) {
    this.tooltip?.style('display', 'flex')
    const [x, y] = manualPosition || D3Tooltip.tooltipPosition(this.target, this.posType)

    this.tooltip?.style('transform', `translate(${x}px, ${y}px)`)
      .transition()
      .duration(duration)
      .style('opacity', 1)

    return this
  }

  /**  Hide tooltip
    *  @param {Number} duration
    *  @param {ClassName} classe
    */
  hideTooltip(duration: number) {
    this.tooltip?.transition()
      .duration(duration)
      .style('opacity', 0)
      .style('display', 'none')
      .style('transform', 'transform(0, 0)')

    this.target = null
    this.posType = null

    if (this.tempClasses) {
      this.tooltip?.classed(this.tempClasses, false)
      this.tempClasses = null
    }

    return this
  }

  removeTooltip() {
    this.tooltip?.node()?.remove()
    return this
  }
}

export default D3Tooltip
