import { range } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal, scaleQuantile } from 'd3-scale';

import { colorSets } from './color-sets';

export class ColorHelper {
  scale: any;
  colorDomain: any[];
  domain: any;
  customColors: any;

  constructor(scheme: string | { name: string; selectable: boolean; group: string; domain: string[]; } | undefined, domain: any, customColors?: any) {
    if (typeof scheme === 'string') {
      scheme = colorSets.find(cs => {
        return cs.name === scheme;
      });
    }
    this.colorDomain = scheme!.domain;
    this.domain = domain;
    this.customColors = customColors;

    this.scale = this.generateColorScheme(scheme, this.domain);
  }

  generateColorScheme(scheme: string | { name: string; selectable: boolean; group: string; domain: string[]; } | undefined, domain: Iterable<string>) {
    if (typeof scheme === 'string') {
      scheme = colorSets.find(cs => {
        return cs.name === scheme;
      });
    }
    return scaleOrdinal().range(scheme!.domain).domain(domain);
  }

  getColor(value: string | null | undefined) {
    if (value === undefined || value === null) {
      throw new Error('Value can not be null');
    }

    if (typeof this.customColors === 'function') {
      return this.customColors(value);
    }

    const formattedValue = value.toString();
    let found: any; // todo type customColors
    if (this.customColors && this.customColors.length > 0) {
      found = this.customColors.find((mapping: { name: string; }) => {
        return mapping.name.toLowerCase() === formattedValue.toLowerCase();
      });
    }

    if (found) {
      return found.value;
    } else {
      return this.scale(value);
    }
  }
}
