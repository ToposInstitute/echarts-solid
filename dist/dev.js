import { use, effect, style, className, createComponent, mergeProps, template } from 'solid-js/web';
import { onMount, onCleanup, createEffect, on, createSignal } from 'solid-js';
import { init } from 'echarts';
import { mergeRefs } from '@solid-primitives/refs';
import { createElementSize } from '@solid-primitives/resize-observer';

// src/components/ECharts/EChartsAutoSize.tsx

// src/components/ECharts/utils.ts
var bindEvents = (chartInstance, eventHandlers) => {
  Object.entries(eventHandlers).forEach(([eventName, handler]) => {
    if ("query" in handler) {
      chartInstance.on(eventName, handler.query, handler.handler);
    } else {
      chartInstance.on(eventName, handler);
    }
  });
};
var unbindEvents = (chartInstance, eventHandlers) => {
  Object.entries(eventHandlers).forEach(([eventName, handler]) => {
    chartInstance.off(eventName, "handler" in handler ? handler.handler : handler);
  });
};

// src/components/ECharts/ECharts.tsx
var _tmpl$ = /* @__PURE__ */ template(`<div>`);
var ECharts = (props) => {
  let chartElement;
  let chartInstance;
  onMount(() => {
    chartInstance = init(chartElement, props.theme, {
      width: props.width,
      height: props.height,
      ...props.initOptions ?? {}
    });
    chartInstance.setOption(props.option, props.notMerge, props.lazyUpdate);
    if (props.eventHandlers) {
      bindEvents(chartInstance, props.eventHandlers);
    }
    if (props.isLoading) {
      chartInstance.showLoading(props.loadingOptions);
    }
    props.onInit?.(chartInstance);
  });
  onCleanup(() => {
    chartInstance.dispose();
  });
  createEffect(on(() => [props.width, props.height], ([width, height]) => {
    chartInstance.resize({
      width,
      height,
      ...props.resizeOptions
    });
  }, {
    defer: true
  }));
  createEffect(on(() => props.option, (option) => {
    chartInstance.setOption(option, props.notMerge, props.lazyUpdate);
  }, {
    defer: true
  }));
  createEffect(on(() => props.isLoading, (isLoading) => {
    if (isLoading) {
      chartInstance.showLoading(props.loadingOptions);
    } else {
      chartInstance.hideLoading();
    }
  }, {
    defer: true
  }));
  createEffect(on(() => props.eventHandlers, (eventHandlers, prevEventHandlers) => {
    if (prevEventHandlers) {
      unbindEvents(chartInstance, prevEventHandlers);
    }
    if (eventHandlers) {
      bindEvents(chartInstance, eventHandlers);
    }
  }, {
    defer: true
  }));
  return (() => {
    var _el$ = _tmpl$();
    var _ref$ = mergeRefs(props.ref, (el) => chartElement = el);
    typeof _ref$ === "function" && use(_ref$, _el$);
    effect((_p$) => {
      var _v$ = props.style, _v$2 = props.class;
      _p$.e = style(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && className(_el$, _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};
var EChartsAutoSize = (props) => {
  const [chartElement, setChartElement] = createSignal();
  const size = createElementSize(chartElement);
  return createComponent(ECharts, mergeProps(props, {
    get width() {
      return size.width ?? 0;
    },
    get height() {
      return size.height ?? 0;
    },
    get style() {
      return {
        width: "100%",
        height: "100%",
        ...props.style
      };
    },
    ref(r$) {
      var _ref$ = mergeRefs(props.ref, setChartElement);
      typeof _ref$ === "function" && _ref$(r$);
    }
  }));
};

export { ECharts, EChartsAutoSize };
