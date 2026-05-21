import * as solid_js from 'solid-js';
import { JSX } from 'solid-js';
import { Ref } from '@solid-primitives/refs';
import { EChartsOption, ResizeOpts, EChartsType } from 'echarts';

type InitOptions = {
    locale?: string;
    renderer?: 'canvas' | 'svg';
    devicePixelRatio?: number;
    useDirtyRect?: boolean;
    useCoarsePointer?: boolean;
    pointerSize?: number;
};
type EChartsEventHandler = (event: any) => void | boolean;
type EChartsEventHandlerDefinition = {
    query: string | object;
    handler: EChartsEventHandler;
};
type EventHandlers = Record<string, EChartsEventHandler | EChartsEventHandlerDefinition>;
interface EChartsBaseProps {
    ref?: Ref<HTMLDivElement>;
    class?: string;
    style?: JSX.CSSProperties;
    initOptions?: InitOptions;
    option: EChartsOption;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    isLoading?: boolean;
    loadingOptions?: any;
    resizeOptions?: Omit<ResizeOpts, 'width' | 'height'>;
    theme?: string | object;
    eventHandlers?: EventHandlers;
    onInit?: (chartInstance: EChartsType) => void;
}

interface EChartsAutoSizeProps extends EChartsBaseProps {
}
declare const EChartsAutoSize: (props: EChartsAutoSizeProps) => solid_js.JSX.Element;

interface EChartsProps extends EChartsBaseProps {
    width: number | 'auto';
    height: number | 'auto';
}
declare const ECharts: (props: EChartsProps) => solid_js.JSX.Element;

export { ECharts, EChartsAutoSize, type EChartsAutoSizeProps, type EChartsBaseProps, type EChartsEventHandler, type EChartsEventHandlerDefinition, type EChartsProps, type EventHandlers, type InitOptions };
