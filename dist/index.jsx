// src/components/ECharts/EChartsAutoSize.tsx
import { createSignal } from "solid-js";

// src/components/ECharts/ECharts.tsx
import { createEffect, on, onCleanup, onMount } from "solid-js";
import { init } from "echarts";
import { mergeRefs } from "@solid-primitives/refs";

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
  createEffect(
    on(
      () => [props.width, props.height],
      ([width, height]) => {
        chartInstance.resize({ width, height, ...props.resizeOptions });
      },
      { defer: true }
    )
  );
  createEffect(
    on(
      () => props.option,
      (option) => {
        chartInstance.setOption(option, props.notMerge, props.lazyUpdate);
      },
      { defer: true }
    )
  );
  createEffect(
    on(
      () => props.isLoading,
      (isLoading) => {
        if (isLoading) {
          chartInstance.showLoading(props.loadingOptions);
        } else {
          chartInstance.hideLoading();
        }
      },
      { defer: true }
    )
  );
  createEffect(
    on(
      () => props.eventHandlers,
      (eventHandlers, prevEventHandlers) => {
        if (prevEventHandlers) {
          unbindEvents(chartInstance, prevEventHandlers);
        }
        if (eventHandlers) {
          bindEvents(chartInstance, eventHandlers);
        }
      },
      { defer: true }
    )
  );
  return <div
    style={props.style}
    class={props.class}
    ref={mergeRefs(props.ref, (el) => chartElement = el)}
  />;
};

// src/components/ECharts/EChartsAutoSize.tsx
import { mergeRefs as mergeRefs2 } from "@solid-primitives/refs";
import { createElementSize } from "@solid-primitives/resize-observer";
var EChartsAutoSize = (props) => {
  const [chartElement, setChartElement] = createSignal();
  const size = createElementSize(chartElement);
  return <ECharts
    {...props}
    width={size.width ?? 0}
    height={size.height ?? 0}
    style={{ width: "100%", height: "100%", ...props.style }}
    ref={mergeRefs2(props.ref, setChartElement)}
  />;
};
export {
  ECharts,
  EChartsAutoSize
};
