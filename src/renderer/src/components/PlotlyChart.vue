<template>
  <div ref="chartEl" :id="id" :style="style"></div>
</template>

<script>
import PlotlyLib from 'plotly.js-dist'

export default {
  name: 'PlotlyChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    displayModeBar: {
      type: Boolean,
      default: false
    },
    scrollZoom: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'plotly-chart'
    },
    style: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.doRender()
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.doRender()
      }
    },
    layout: {
      deep: true,
      handler() {
        this.doRender()
      }
    }
  },
  beforeUnmount() {
    if (this.$refs.chartEl) {
      PlotlyLib.purge(this.$refs.chartEl)
    }
  },
  methods: {
    doRender() {
      if (!this.$refs.chartEl) return
      PlotlyLib.newPlot(this.$refs.chartEl, this.data, this.layout, {
        displayModeBar: this.displayModeBar,
        scrollZoom: this.scrollZoom
      })
    }
  }
}
</script>
