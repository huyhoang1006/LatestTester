<template>
  <div class="custom-folder">
    <template v-if="mainIconInfo.type === 'image'">
      <img :src="mainIconInfo.src" :style="{ width: size, height: size }" class="main-icon" />
    </template>
    <template v-else>
      <i :class="['main-icon']"></i>
    </template>
    <i v-if="mainIconInfo.type !== 'image'" class="fa-regular fa-folder-open main-icon"></i>
    <i v-if="mainIconInfo.type !== 'image'" :class="['badge', badgeIcon]"></i>
  </div>
</template>

<script>
import substationIcon from '@/assets/Treeview/Substation.png'
import voltageLevelIcon from '@/assets/Treeview/Voltage Level.png'
import bayIcon from '@/assets/Treeview/Bay.png'
import ownerIcon from '@/assets/Treeview/Owner.png'
import disconnectorIcon from '@/assets/Treeview/Disconnector.png'
import currentTransformerIcon from '@/assets/Treeview/Current Transformer.png'
import capacitorIcon from '@/assets/Treeview/Capacitor.png'
import reactorIcon from '@/assets/Treeview/Reactor.png'
import earthingSwitchIcon from '@/assets/Treeview/Earthing Switch.png'
import loadIcon from '@/assets/Treeview/Load.png'
import motorIcon from '@/assets/Treeview/Motor.png'
import transformer2WIcon from '@/assets/Treeview/2W Tranformer 2.png'
import transformer3WIcon from '@/assets/Treeview/3W Transformer 2.png'
import transformerAutoIcon from '@/assets/Treeview/Auto Transformer.png'
import powerCableIcon from '@/assets/Treeview/power cable.png'
import surgeArresterIcon from '@/assets/Treeview/Surge arrester.png'
import unknownIcon from '@/assets/Treeview/2W Tranformer 2.png'

export default {
  name: 'FolderIconWithBadge',
  props: {
    folderType: {
      type: String,
      default: 'location',
      validator: (value) =>
        [
          'location',
          'asset',
          'job',
          'test',
          'owner',
          'building',
          'voltageLevel',
          'bay',
          'fileType'
        ].includes(value)
    },
    size: {
      type: String,
      default: '20px',
      validator: (value) => ['12px', '14px', '16px', '20px', '24px', '32px'].includes(value)
    },
    fileTypeDetail: {
      type: String,
      default: 'file',
      validator: (value) => ['pdf', 'xml', 'excel', 'word', 'json', 'file'].includes(value)
    },
    badgeColor: {
      type: String,
      default: '4285f4'
    },
    assetDetail: {
      type: String,
      default: 'Unknown'
    },
    transformerType: {
      type: String,
      default: null
    }
  },
  computed: {
    mainIconInfo() {
      const faDefaults = {
        location: 'fa-solid fa-location-dot',
        job: 'fa-solid fa-toolbox',
        test: 'fa-solid fa-file-lines',
        building: 'fa-solid fa-building',
        owner: 'fa-solid fa-location-crosshairs',
        voltageLevel: 'fa-solid fa-bolt-lightning',
        bay: 'fa-solid fa-tower-observation'
      }

      const fileTypeFa = {
        pdf: 'fa-solid fa-file-pdf',
        json: 'fa-solid fa-file-code',
        xml: 'fa-solid fa-file-code',
        excel: 'fa-solid fa-file-excel',
        word: 'fa-solid fa-file-word'
      }

      try {
        if (this.folderType === 'location') {
          return { type: 'image', src: substationIcon }
        }

        if (this.folderType === 'voltageLevel') {
          return { type: 'image', src: voltageLevelIcon }
        }

        if (this.folderType === 'bay') {
          return { type: 'image', src: bayIcon }
        }

        if (this.folderType === 'owner') {
          return { type: 'image', src: ownerIcon }
        }

        if (this.folderType === 'asset') {
          const assetMap = {
            Disconnector: disconnectorIcon,
            'Current transformer': currentTransformerIcon,
            Capacitor: capacitorIcon,
            Reactor: reactorIcon,
            'Earthing Switch': earthingSwitchIcon,
            Load: loadIcon,
            Motor: motorIcon,
            Transformer: transformer2WIcon,
            'Power cable': powerCableIcon,
            'Surge arrester': surgeArresterIcon
          }

          if (this.assetDetail === 'Transformer') {
            if (this.transformerType && this.transformerType.includes('Two-winding')) {
              return { type: 'image', src: transformer2WIcon }
            } else if (this.transformerType && this.transformerType.includes('Three-winding')) {
              return { type: 'image', src: transformer3WIcon }
            } else if (this.transformerType && this.transformerType.includes('Auto w/')) {
              return { type: 'image', src: transformerAutoIcon }
            } else {
              return { type: 'image', src: transformer2WIcon }
            }
          }

          const src = assetMap[this.assetDetail] || unknownIcon
          return { type: 'image', src }
        }

        if (this.folderType === 'fileType') {
          const fa = fileTypeFa[this.fileTypeDetail] || 'fa-solid fa-file'
          return { type: 'fa', class: fa }
        }
      } catch (e) {
        // require failed -> fall back to FA
      }

      if (this.folderType === 'asset') {
        return { type: 'fa', class: 'fa-solid fa-gear' }
      }

      const faClass = faDefaults[this.folderType] || faDefaults.location
      return { type: 'fa', class: faClass }
    },
    badgeIcon() {
      const icons = {
        location: 'fa-solid fa-location-dot',
        asset: {
          Unknown: 'fa-solid fa-gear',
          Transformer: 'fa-solid fa-bolt',
          'Surge arrester': 'fa-solid fa-shield-halved',
          Disconnector: 'fa-solid fa-plug-circle-xmark',
          'Power cable': 'fa-solid fa-route',
          Bushing: 'fa-solid fa-shield',
          'Voltage transformer': 'fa-solid fa-bolt-lightning',
          'Rotating machine': 'fa-solid fa-group-arrows-rotate',
          'Current transformer': 'fa-solid fa-bolt-lightning',
          Capacitor: 'fa-solid fa-bolt',
          'Circuit breaker': 'fa-solid fa-toggle-on',
          Reactor: 'fa-solid fa-industry'
        },
        job: 'fa-solid fa-toolbox',
        test: 'fa-solid fa-file-lines',
        owner: 'fa-solid fa-location-crosshairs',
        building: 'fa-solid fa-building',
        voltageLevel: 'fa-solid fa-bolt-lightning',
        bay: 'fa-solid fa-tower-observation',
        fileType: {
          pdf: 'fa-solid fa-file-pdf',
          json: 'fa-solid fa-file-code',
          xml: 'fa-solid fa-file-code',
          excel: 'fa-solid fa-file-excel',
          word: 'fa-solid fa-file-word'
        }
      }
      if (this.folderType == 'asset') {
        if (this.assetDetail == 'Unknown') {
          return icons.asset['Unknown']
        } else {
          return icons.asset[this.assetDetail]
        }
      } else if (this.folderType == 'fileType') {
        return icons.fileType[this.fileTypeDetail] || 'fa-solid fa-file'
      } else {
        return icons[this.folderType] || 'fa-solid fa-location-dot'
      }
    },
    badgeStyle() {
      return {
        badgeColor: `#${this.badgeColor}`,
        fontSize: `calc(${this.size} * 0.75)`
      }
    }
  }
}
</script>

<style scoped>
.custom-folder {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: v-bind(size);
  height: v-bind(size);
}

.main-icon {
  font-size: v-bind(size);
  color: #ffc107;
  position: relative;
  z-index: 1;
}

.badge {
  position: absolute;
  bottom: 0;
  right: 0;
  color: v-bind('badgeStyle.badgeColor');
  background-color: white;
  border-radius: 50%;
  padding: 1px;
  transform: translate(25%, 25%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  z-index: 2;
  font-size: v-bind('badgeStyle.fontSize');
}
</style>
