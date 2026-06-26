import { h } from 'vue'

export const LMap = {
    name: 'LMapStub',
    props: {},
    render() {
        return h('div', '[Leaflet Map Stub]')
    }
}

export const LTileLayer = {
    name: 'LTileLayerStub',
    props: {},
    render() {
        return h('div', '[Tile Layer Stub]')
    }
}

export const LMarker = {
    name: 'LMarkerStub',
    props: {},
    render() {
        return h('div', '[Marker Stub]')
    }
}

export const LPopup = {
    name: 'LPopupStub',
    props: {},
    render() {
        return h('div', '[Popup Stub]')
    }
}

export default {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
}
