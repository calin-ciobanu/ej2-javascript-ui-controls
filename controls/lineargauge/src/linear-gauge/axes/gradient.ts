import { SvgRenderer, LinearGradient as Linear, RadialGradient as Radial, GradientColor } from '@syncfusion/ej2-svg-base';
import { Pointer, Range } from '../axes/axis';
import { LinearGauge } from '../../linear-gauge';
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { ColorStopModel, GradientPositionModel} from '../axes/gradient-model';
/**
 * Specified the color information for the gradient in the linear gauge.
 */
export class ColorStop extends ChildProperty<ColorStop> {
    /**
     * Specifies the color of the gradient.
     * @default "#000000"
     */
    @Property('#000000')
    public color : string;
    /**
     * Specifies the opacity of the gradient.
     * @default 1
     */
    @Property(1)
    public opacity ?: number;
    /**
     * Specifies the offset of the gradient.
     * @default "0%"
     */
    @Property('0%')
    public offset : string;
    /**
     * Specifies the style of the gradient.
     * @default ""
     */
    @Property('')
    public style ?: string;
}

/**
 * Specifies the position in percentage from which the radial gradient must be applied.
 */
export class GradientPosition extends ChildProperty<GradientPosition> {
    /**
     * Specifies the horizontal position of the gradient.
     * @default "0%"
     */
    @Property('0%')
    public x : string;
    /**
     * Specifies the vertical position of the gradient.
     * @default "0%"
     */
    @Property('0%')
    public y : string;
}

/**
 * This specifies the properties of the linear gradient colors for the linear gauge.
 */
export class LinearGradient extends ChildProperty<LinearGradient> {
    /**
     * Specifies the start value of the linear gradient.
     * @default "0%"
     */
    @Property('0%')
    public startValue: string;
    /**
     * Specifies the end value of the linear gradient.
     * @default "100%"
     */
    @Property('100%')
    public endValue: string;
    /**
     * Specifies the color, opacity, offset and style of the linear gradient.
     */
    @Collection<ColorStopModel>([{color: '#000000', opacity: 1, offset: '0%', style: ''}], ColorStop)
    public colorStop: ColorStopModel[];
}

/**
 * This specifies the properties of the radial gradient colors for the linear gauge.
 */
export class RadialGradient extends ChildProperty<RadialGradient> {
    /**
     * Specifies the radius of the radial gradient.
     * @default "0%"
     */
    @Property('0%')
    public radius: string;
    /**
     * Specifies the outer position of the radial gradient.
     */
    @Complex<GradientPositionModel>({x: '0%', y: '0%'}, GradientPosition)
    public outerPosition: GradientPositionModel;
    /**
     * Specifies the inner position of the radial gradient.
     */
    @Complex<GradientPositionModel>({x: '0%', y: '0%'}, GradientPosition)
    public innerPosition: GradientPositionModel;
    /**
     * Specifies the color, opacity, offset and style of the radial gradient.
     */
    @Collection<ColorStopModel>([{color: '#000000', opacity: 1, offset: '0%', style: ''}], ColorStop)
    public colorStop: ColorStopModel[];
}


/**
 * To get the gradient support for pointers and ranges in the linear gauge.
 * @hidden
 */
export class Gradient {

    private gauge: LinearGauge;

    constructor(control: LinearGauge) {
        this.gauge = control;
    }

    /**
     * To get the linear gradient string.
     * @private
     */
    private getLinearGradientColor(element: Range | Pointer): string {
        let render: SvgRenderer = new SvgRenderer('');
        let colorStop: ColorStopModel[] = element.linearGradient.colorStop;
        let colors: GradientColor[] = this.getGradientColor(colorStop);
        let name: string = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'linearGradient';
        let gradientPosition: Linear = {
            id: name,
            x1: (element.linearGradient.startValue.indexOf('%') === -1 ?
                element.linearGradient.startValue :
                parseFloat(element.linearGradient.startValue).toString()) + '%',
            x2: (element.linearGradient.endValue.indexOf('%') === -1 ?
                element.linearGradient.endValue :
                parseFloat(element.linearGradient.endValue).toString()) + '%',
            y1: '0' + '%',
            y2: '0' + '%'
        };
        let def: Element = render.drawGradient('linearGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }

    /**
     * To get the radial gradient string.
     * @private
     */
    private getRadialGradientColor(element: Range | Pointer): string {
        let render: SvgRenderer = new SvgRenderer('');
        let colorStop: ColorStopModel[] = element.radialGradient.colorStop;
        let colors: GradientColor[] = this.getGradientColor(colorStop);
        let name: string = '_' + this.gauge.svgObject.id + '_' + this.gauge.gradientCount + '_' + 'radialGradient';
        let gradientPosition: Radial = {
            id: name,
            r: (element.radialGradient.radius.indexOf('%') === -1 ?
                element.radialGradient.radius :
                parseFloat(element.radialGradient.radius).toString()) + '%',
            cx: (element.radialGradient.outerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.x :
                parseFloat(element.radialGradient.outerPosition.x).toString()) + '%',
            cy: (element.radialGradient.outerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.outerPosition.y :
                parseFloat(element.radialGradient.outerPosition.y).toString()) + '%',
            fx: (element.radialGradient.innerPosition.x.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.y :
                parseFloat(element.radialGradient.innerPosition.x).toString()) + '%',
            fy: (element.radialGradient.innerPosition.y.indexOf('%') === -1 ?
                element.radialGradient.innerPosition.y :
                parseFloat(element.radialGradient.innerPosition.y).toString()) + '%',
        };
        let def: Element = render.drawGradient('radialGradient', gradientPosition, colors);
        this.gauge.svgObject.appendChild(def);
        return 'url(#' + name + ')';
    }

    /**
     * To get the color, offset, opacity and style.
     * @private
     */
    private getGradientColor(colorStop: ColorStopModel[]): GradientColor[] {
        let colors: GradientColor[] = [];
        let length: number = colorStop.length;
        for (let j: number = 0; j < length; j++) {
            let color: GradientColor = {
                color: colorStop[j].color,
                colorStop: colorStop[j].offset,
                opacity: (colorStop[j].opacity) ? (colorStop[j].opacity).toString() : '1',
                style: colorStop[j].style
            };
            colors.push(color);
        }
        return colors;
    }

    /**
     * To get the gradient color string.
     * @private
     */
    public getGradientColorString(element: Pointer | Range): string {
        let gradientColor: string;
        if ((element.linearGradient || element.radialGradient)) {
            if (element.linearGradient) {
                gradientColor = this.getLinearGradientColor(element);
            } else {
                gradientColor = this.getRadialGradientColor(element);
            }
            this.gauge.gradientCount += 1;
        } else {
            return null;
        }
        return gradientColor;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'Gradient';
    }

    /**
     * To destroy the gradient.
     * @return {void}
     * @private
     */
    public destroy(control: LinearGauge): void {
        /**
         * Destroy method performed here
         */
    }
}